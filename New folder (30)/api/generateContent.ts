import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ai, handleError, extractJsonFromString } from './utils';

const schemaDescription = `
{
  "theme": { "primary": "string", "secondary": "string", "accent": "string", "neutral": "string", "base": "string", "fontHeading": "string", "fontBody": "string" },
  "navbar": { "brandName": "string", "links": [{ "text": "string", "href": "string" }] },
  "hero": { "headline": "string", "subheadline": "string", "ctaButtonText": "string" },
  "about": { "title": "string", "paragraph1": "string", "paragraph2": "string", "imageUrl": "string" },
  "services": { "title": "string", "services": [{ "icon": "string", "title": "string", "description": "string" }] },
  "contact": { "title": "string", "address": "string", "email": "string", "phone": "string" },
  "footer": { "copyrightText": "string", "twitterUrl": "string", "linkedinUrl": "string", "githubUrl": "string", "instagramUrl": "string" },
  "customCss": "string"
}
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { formData } = req.body;
    const textPrompt = `
    You are an expert web designer and content strategist AI. Your task is to generate the complete JSON for a single-page website based on a user's description and any files they provide.
    User's Request:
    - Main Description: "${formData.prompt}"
    Provided Content Files:
    - ${formData.uploadedFiles.length > 0 ? formData.uploadedFiles.map((f: any) => f.name).join(', ') : 'None'}
    Advanced Options Provided:
    - Custom CSS to inject: "${formData.advancedOptions.customCss || 'none'}"
    - Specific Theme Color Overrides: ${JSON.stringify(formData.advancedOptions.themeOverrides) || 'none'}
    Instructions:
    1.  Analyze all provided materials.
    2.  Use provided files for content.
    3.  Choose a Font Pairing. Select one font for 'fontHeading' and one for 'fontBody' from this list: ['Poppins', 'Montserrat', 'Lato', 'Roboto', 'Oswald', 'Playfair Display', 'Lora'].
    4.  If the user provides theme color overrides, use those exact hex codes.
    5.  Generate a complete JSON object. Your response MUST BE ONLY the raw JSON object, without any markdown formatting.
    6.  The JSON object must strictly adhere to the following structure:
        ${schemaDescription}
    7.  For 'services.services.icon', choose a keyword from: \`code\`, \`design\`, \`data\`, \`consulting\`, \`marketing\`, \`cloud\`.
    8. For the 'footer', provide placeholder URLs (e.g., 'https://twitter.com/username') for 'twitterUrl', 'linkedinUrl', 'githubUrl', and 'instagramUrl'. If a platform is not relevant, you can omit the field or leave the string empty.
    9. If the user does NOT provide an image, use a relevant placeholder URL from \`https://picsum.photos/seed/{keyword}/600/400\`.
  `;

    const contentParts = [
      { text: textPrompt },
      ...formData.uploadedFiles.map((file: any) => ({
          inlineData: {
              mimeType: file.type,
              data: file.base64Data,
          }
      }))
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: contentParts },
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    const rawText = response.text;
    const jsonString = extractJsonFromString(rawText);
    const parsedData = JSON.parse(jsonString);
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if(sources) {
        parsedData.groundingSources = sources;
    }

    if (!parsedData.theme.fontHeading) parsedData.theme.fontHeading = 'Poppins';
    if (!parsedData.theme.fontBody) parsedData.theme.fontBody = 'Lato';

    res.status(200).json(parsedData);

  } catch (error) {
    handleError(res, error, 'Failed to generate website content.');
  }
}
