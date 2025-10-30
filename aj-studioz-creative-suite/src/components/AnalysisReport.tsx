import React from 'react';

interface AnalysisReportProps {
  imageSrc: string;
  question: string;
  analysisHtml: string;
}

export const AnalysisReport: React.FC<AnalysisReportProps> = ({ imageSrc, question, analysisHtml }) => {
  const AjStudiozLogo = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <svg
            style={{ width: '40px', height: '40px', color: '#FF6F61' }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
            <path d="M7 13l3 3 7-7"></path>
        </svg>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, letterSpacing: '-0.5px' }}>
            AJ STUDIOZ
        </h1>
    </div>
  );

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>AI Analysis Report</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* FIX: Changed crossOrigin from "true" to "anonymous" to provide a valid value for the attribute. */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        <style>{`
          @media print {
            @page {
              margin: 1in;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
          body {
            font-family: 'Poppins', sans-serif;
            color: #36454F;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
          }
          .header, .footer {
            padding-bottom: 20px;
            margin-bottom: 40px;
            border-bottom: 1px solid #E0F7FA;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            padding-bottom: 0;
            margin-bottom: 0;
            border-top: 1px solid #E0F7FA;
            border-bottom: none;
            text-align: center;
            font-size: 12px;
            color: #36454F80;
          }
          h2 {
            font-size: 28px;
            font-weight: 700;
            color: #36454F;
            margin-top: 0;
            margin-bottom: 8px;
          }
          h3 {
             font-size: 20px;
             font-weight: 600;
             margin-top: 32px;
             margin-bottom: 16px;
             border-bottom: 2px solid #FFDAB9;
             padding-bottom: 8px;
          }
          .question-box {
            background-color: #F9F6F2;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 32px;
            font-style: italic;
          }
          .image-preview {
            max-width: 100%;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            margin-bottom: 32px;
          }
          
          /* Markdown Styles */
          .markdown-content > *:first-child { margin-top: 0; }
          .markdown-content > *:last-child { margin-bottom: 0; }
          .markdown-content h1, .markdown-content h2, .markdown-content h3 { font-weight: 700; margin-top: 1em; margin-bottom: 0.5em; border-bottom: 1px solid #FFDAB9; padding-bottom: 0.3em; }
          .markdown-content p { margin-bottom: 1em; line-height: 1.6; }
          .markdown-content a { color: #FF6F61; text-decoration: none; font-weight: 600; }
          .markdown-content ul, .markdown-content ol { margin-left: 24px; margin-bottom: 1em; padding-left: 0; }
          .markdown-content li { margin-bottom: 0.4em; }
          .markdown-content pre { background-color: #F0F4F8; color: #36454F; padding: 1rem; border-radius: 0.75rem; overflow-x: auto; font-size: 0.9em; border: 1px solid #E0F7FA; }
          .markdown-content code { background-color: #E0F7FA; color: #FF6F61; padding: 0.2em 0.4em; margin: 0; font-size: 85%; border-radius: 6px; }
          .markdown-content pre code { background-color: transparent; color: inherit; padding: 0; }
          .markdown-content blockquote { border-left: 4px solid #FFDAB9; padding-left: 1rem; margin-left: 0; font-style: italic; color: #36454F; opacity: 0.8; }
        `}</style>
      </head>
      <body>
        <div className="header">
          <AjStudiozLogo />
        </div>
        
        <h2>AI Homework Helper Report</h2>

        <h3>Your Question</h3>
        <div className="question-box">
          <p>"{question}"</p>
        </div>
        
        <h3>Image Provided</h3>
        <img src={imageSrc} alt="User uploaded content" className="image-preview" />
        
        <h3>AI's Explanation</h3>
        <div 
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: analysisHtml }}
        />

        <div className="footer">
            <p>Generated by AJ STUDIOZ AI | {new Date().toLocaleDateString()}</p>
        </div>
      </body>
    </html>
  );
};