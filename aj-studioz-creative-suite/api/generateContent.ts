
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Type } from '@google/genai';
import { ai, handleError } from './utils';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        theme: {
            type: Type.OBJECT,
            properties: {
                primary: { type: Type.STRING, description: "Primary color hex code, e.g., #3B82F6" },
                secondary: { type: Type.STRING, description: "Secondary color hex code, e.g., #F3F4F6" },
                accent: { type: Type.STRING, description: "Accent color hex code, e.g., #EF4444" },
                neutral: { type: Type.STRING, description: "Neutral color for text, hex code, e.g., #1F2937" },
                base: { type: Type.STRING, description: "Base background color hex code, e.g., #FFFFFF" },
                fontHeading: { type: Type.STRING, description: "Font name for headings from the allowed list." },
                fontBody: { type: Type.STRING, description: "Font name for body text from the allowed list." },
            },
            required: ["primary", "secondary", "accent", "neutral", "base", "fontHeading", "fontBody"]
        },
        navbar: {
            type: Type.OBJECT,
            properties: {
                brandName: { type: Type.STRING },
                links: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            text: { type: Type.STRING },
                            href: { type: Type.STRING, description: "Anchor link like '#about'." },
                        },
                        required: ["text", "href"]
                    }
                }
            },
            required: ["brandName", "links"]
        },
        hero: {
            type: Type.OBJECT,
            properties: {
                headline: { type: Type.STRING },
                subheadline: { type: Type.STRING },
                ctaButtonText: { type: Type.STRING },
            },
            required: ["headline", "subheadline", "ctaButtonText"]
        },
        about: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                paragraph1: { type: Type.STRING },
                paragraph2: { type: Type.STRING },
                imageUrl: { type: Type.STRING, description: "URL for a relevant image." },
            },
            required: ["title", "paragraph1", "paragraph2", "imageUrl"]
        },
        services: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                services: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            icon: { type: Type.STRING, description: "A keyword for an icon from the allowed list." },
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                        },
                        required: ["icon", "title", "description"]
                    }
                }
            },
            required: ["title", "services"]
        },
        contact: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                address: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
            },
            required: ["title", "address", "email", "phone"]
        },
        footer: {
            type: Type.OBJECT,
            properties: {
                copyrightText: { type: Type.STRING },
                twitterUrl: { type: Type.STRING },
                linkedinUrl: { type: Type.STRING },
                githubUrl: { type: Type.STRING },
                instagramUrl: { type: Type.STRING },
            },
            required: ["copyrightText"]
        },
        customCss: { type: Type.STRING, description: "Optional custom CSS styles." },
    },
    required: ["theme", "navbar", "hero", "about", "services", "contact", "footer"]
};

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

    Key Instructions:
    1.  Analyze all provided materials to inform the content and design.
    2.  Choose a Font Pairing: Select one font for 'fontHeading' and one for 'fontBody' from this list: ['Poppins', 'Montserrat', 'Lato', 'Roboto', 'Oswald', 'Playfair Display', 'Lora'].
    3.  If the user provides theme color overrides, use those exact hex codes.
    4.  For 'services.services.icon', choose a keyword from: \`code\`, \`design\`, \`data\`, \`consulting\`, \`marketing\`, \`cloud\`.
    5. For the 'footer', provide placeholder URLs (e.g., 'https://twitter.com/username') if relevant. Omit if not applicable.
    6. If the user does NOT provide an image for the 'about' section, use a relevant placeholder URL from \`https://picsum.photos/seed/{keyword}/600/400\`.
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
      model: 'gemini-2.5-pro',
      contents: { parts: contentParts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    const parsedData = JSON.parse(response.text);
    res.status(200).json(parsedData);

  } catch (error) {
    handleError(res, error, 'Failed to generate website content.');
  }
}
