import ReactDOMServer from 'react-dom/server.browser';
import React from 'react';
import type { WebsiteData } from '../types';

import { NavbarTemplate } from '../components/templates/NavbarTemplate';
import { HeroTemplate } from '../components/templates/HeroTemplate';
import { AboutTemplate } from '../components/templates/AboutTemplate';
import { ServicesTemplate } from '../components/templates/ServicesTemplate';
import { ContactTemplate } from '../components/templates/ContactTemplate';
import { FooterTemplate } from '../components/templates/FooterTemplate';

// Helper to add data-path attributes to React elements
const addDataPaths = (data: any, pathPrefix = ''): any => {
    if (typeof data !== 'object' || data === null || React.isValidElement(data)) {
        return data;
    }

    if (Array.isArray(data)) {
        return data.map((item, index) => addDataPaths(item, `${pathPrefix}[${index}]`));
    }

    const newData: { [key: string]: any } = {};
    for (const key in data) {
        const newPath = pathPrefix ? `${pathPrefix}.${key}` : key;
        if (typeof data[key] === 'string' && key !== 'href' && key !== 'imageUrl' && key !== 'icon' && key !== 'url' && key !== 'platform') {
            // This is a simple way to wrap editable strings.
            // In a real app, you'd integrate this into your templates more deeply.
            // This is a conceptual example. The actual implementation is in the templates themselves.
        } else {
            newData[key] = addDataPaths(data[key], newPath);
        }
    }
    return newData;
};

// We will add the data-path attributes directly in the templates for more control.
const renderComponent = (Component: React.FC<any>, props: any) => {
    return ReactDOMServer.renderToStaticMarkup(React.createElement(Component, props));
};

const liveEditScript = `
  <script>
    window.addEventListener('message', (event) => {
      if (event.data.type === 'TOGGLE_EDIT_MODE') {
        const isEditing = event.data.payload;
        document.querySelectorAll('[data-path]').forEach(el => {
          el.setAttribute('contenteditable', isEditing);
          el.style.outline = isEditing ? '2px dashed #FF6F61' : 'none';
          el.style.cursor = isEditing ? 'text' : 'default';

          if (isEditing) {
            el.addEventListener('blur', handleBlur);
          } else {
            el.removeEventListener('blur', handleBlur);
          }
        });
      }
    });

    function handleBlur(e) {
      const path = e.target.getAttribute('data-path');
      const content = e.target.innerText;
      window.parent.postMessage({
        type: 'CONTENT_UPDATE',
        payload: { path, content }
      }, '*');
    }
  </script>
`;


export const generateFullHtml = (data: WebsiteData): string => {
  const { theme, groundingSources, customCss } = data;

  const fontHeading = theme.fontHeading || 'Poppins';
  const fontBody = theme.fontBody || 'Lato';
  const fontFamilies = [...new Set([fontHeading, fontBody])].map(font => `${font.replace(' ', '+')}:wght@400;500;600;700;800`).join('&family=');


  const groundingSourcesHtml = groundingSources && groundingSources.length > 0 ? `
    <section id="sources" style="padding: 3rem 0; background-color: ${theme.secondary}1A;">
      <div style="max-width: 1280px; margin: 0 auto; padding: 0 1.5rem;">
        <h2 style="font-size: 1.875rem; font-weight: 700; color: ${theme.neutral}; margin-bottom: 1.5rem; text-align: center;">
          Content Sources
        </h2>
        <ul style="list-style: none; max-width: 56rem; margin: 0 auto; color: ${theme.neutral}CC; display: flex; flex-direction: column; gap: 0.75rem;">
          ${groundingSources.map(source =>
            source.web && source.web.uri ? `
              <li style="background-color: ${theme.base}; padding: 0.75rem; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);">
                <a
                  href="${source.web.uri}"
                  target="_blank"
                  rel="noopener noreferrer"
                  style="color: ${theme.primary}; text-decoration: none;"
                  title="${source.web.uri}"
                >
                  ${source.web.title || 'Untitled Source'}
                </a>
              </li>
            ` : ''
          ).join('')}
        </ul>
      </div>
    </section>
  ` : '';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title data-path="navbar.brandName">${data.navbar.brandName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${fontFamilies}&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['${fontBody}', 'sans-serif'],
            heading: ['${fontHeading}', 'sans-serif'],
          },
          colors: {
            primary: 'var(--color-primary)',
            secondary: 'var(--color-secondary)',
            accent: 'var(--color-accent)',
            neutral: 'var(--color-neutral)',
            'base-100': 'var(--color-base-100)',
          }
        }
      }
    }
  </script>
  <style>
    :root {
      --color-primary: ${theme.primary};
      --color-secondary: ${theme.secondary};
      --color-accent: ${theme.accent};
      --color-neutral: ${theme.neutral};
      --color-base-100: ${theme.base};
    }
    body {
      font-family: '${fontBody}', sans-serif;
    }
    h1, h2, h3, h4, h5, h6 {
      font-family: '${fontHeading}', sans-serif;
    }
    [contenteditable="true"]:hover {
        box-shadow: 0 0 0 2px #FFDAB9;
    }
    ${customCss || ''}
  </style>
</head>
<body class="bg-base-100 text-neutral">
  ${renderComponent(NavbarTemplate, data.navbar)}
  ${renderComponent(HeroTemplate, data.hero)}
  ${renderComponent(AboutTemplate, data.about)}
  ${renderComponent(ServicesTemplate, data.services)}
  ${renderComponent(ContactTemplate, data.contact)}
  ${groundingSourcesHtml}
  ${renderComponent(FooterTemplate, data.footer)}
  ${liveEditScript}
</body>
</html>
  `;

  return html.trim();
};