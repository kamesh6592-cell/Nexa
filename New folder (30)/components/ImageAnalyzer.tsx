import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactDOMServer from 'react-dom/server.browser';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { analyzeImage } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';
import { AnalysisReport } from './AnalysisReport';
import type { AnalysisResult } from '../types';

interface ImageFile {
  file: File;
  previewUrl: string;
}

interface Annotation {
  id: number;
  // FIX: Changed 'path' to 'pen' to align with the active tool state ('pen') and resolve type errors.
  type: 'pen' | 'arrow' | 'text';
  color: string;
  points?: { x: number; y: number }[]; // For paths
  start?: { x: number; y: number }; // For arrows
  end?: { x: number; y: number }; // For arrows
  text?: string; // For text
  position?: { x: number; y: number }; // For text
}

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};


export const ImageAnalyzer: React.FC = () => {
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [question, setQuestion] = useState('');
  const [lastQuestion, setLastQuestion] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Annotation state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTool, setActiveTool] = useState<'pen' | 'arrow' | 'text'>('pen');
  const [activeColor, setActiveColor] = useState('#FF6F61');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const nextAnnotationId = useRef(0);

  const drawAnnotations = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Redraw background image
    const img = new Image();
    img.src = imageFile?.previewUrl || '';
    img.onload = () => {
        const aspectRatio = img.width / img.height;
        let newWidth = canvas.width;
        let newHeight = newWidth / aspectRatio;

        if (newHeight > canvas.height) {
            newHeight = canvas.height;
            newWidth = newHeight * aspectRatio;
        }

        const x = (canvas.width - newWidth) / 2;
        const y = (canvas.height - newHeight) / 2;

        ctx.drawImage(img, x, y, newWidth, newHeight);

        // Redraw annotations
        annotations.forEach(annotation => {
            ctx.strokeStyle = annotation.color;
            ctx.fillStyle = annotation.color;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
    
            // FIX: Changed condition from 'path' to 'pen' to match the updated Annotation type.
            if (annotation.type === 'pen' && annotation.points && annotation.points.length > 1) {
                ctx.beginPath();
                ctx.moveTo(annotation.points[0].x, annotation.points[0].y);
                for (let i = 1; i < annotation.points.length; i++) {
                    ctx.lineTo(annotation.points[i].x, annotation.points[i].y);
                }
                ctx.stroke();
            } else if (annotation.type === 'arrow' && annotation.start && annotation.end) {
                const headlen = 10;
                const dx = annotation.end.x - annotation.start.x;
                const dy = annotation.end.y - annotation.start.y;
                const angle = Math.atan2(dy, dx);
                ctx.beginPath();
                ctx.moveTo(annotation.start.x, annotation.start.y);
                ctx.lineTo(annotation.end.x, annotation.end.y);
                ctx.lineTo(annotation.end.x - headlen * Math.cos(angle - Math.PI / 6), annotation.end.y - headlen * Math.sin(angle - Math.PI / 6));
                ctx.moveTo(annotation.end.x, annotation.end.y);
                ctx.lineTo(annotation.end.x - headlen * Math.cos(angle + Math.PI / 6), annotation.end.y - headlen * Math.sin(angle + Math.PI / 6));
                ctx.stroke();
            } else if (annotation.type === 'text' && annotation.text && annotation.position) {
                 ctx.font = '16px Poppins';
                 ctx.fillText(annotation.text, annotation.position.x, annotation.position.y);
            }
        });
    };
  }, [imageFile, annotations]);

  useEffect(() => {
    drawAnnotations();
  }, [drawAnnotations]);

  const getCanvasCoords = (e: React.MouseEvent): { x: number, y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageFile || activeTool === 'text') return;
    setIsDrawing(true);
    const { x, y } = getCanvasCoords(e);
    const newAnnotation: Annotation = {
      id: nextAnnotationId.current++,
      type: activeTool,
      color: activeColor,
      points: activeTool === 'pen' ? [{ x, y }] : undefined,
      start: activeTool === 'arrow' ? { x, y } : undefined,
      end: activeTool === 'arrow' ? { x, y } : undefined,
    };
    setAnnotations(prev => [...prev, newAnnotation]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const { x, y } = getCanvasCoords(e);
    setAnnotations(prev =>
      prev.map(ann => {
        if (ann.id === nextAnnotationId.current - 1) {
          if (ann.type === 'pen' && ann.points) {
            return { ...ann, points: [...ann.points, { x, y }] };
          }
          if (ann.type === 'arrow') {
            return { ...ann, end: { x, y } };
          }
        }
        return ann;
      })
    );
  };
  
  const handleMouseUp = () => {
    setIsDrawing(false);
  };
  
   const handleCanvasClick = (e: React.MouseEvent) => {
    if (activeTool !== 'text' || !imageFile) return;
    const { x, y } = getCanvasCoords(e);
    const text = prompt("Enter text:", "");
    if (text) {
        const newAnnotation: Annotation = {
            id: nextAnnotationId.current++,
            type: 'text',
            color: activeColor,
            text,
            position: { x, y },
        };
        setAnnotations(prev => [...prev, newAnnotation]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imageFile) URL.revokeObjectURL(imageFile.previewUrl);
      setAnalysisResult(null);
      setError(null);
      setQuestion('');
      setLastQuestion('');
      setAnnotations([]); // Clear annotations for new image
      setImageFile({ file, previewUrl: URL.createObjectURL(file) });
    }
  };
  
  const handleUndo = () => {
    setAnnotations(prev => prev.slice(0, -1));
  };
  
  const handleClear = () => {
    setAnnotations([]);
  };

  useEffect(() => {
    return () => {
      if (imageFile) URL.revokeObjectURL(imageFile.previewUrl);
    };
  }, [imageFile]);

  const handleSubmit = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!imageFile || !question.trim() || !canvas) return;

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setLastQuestion(question); 

    try {
      const annotatedImageBase64 = canvas.toDataURL('image/jpeg').split(',')[1];
      const newAnalysis = await analyzeImage(annotatedImageBase64, 'image/jpeg', question);
      setAnalysisResult(newAnalysis);
    } catch (err) {
      console.error(err);
      setError('An error occurred while analyzing the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, question]);

  const handleSharePdf = () => {
      const canvas = canvasRef.current;
    if (!analysisResult || !imageFile || !lastQuestion || !canvas) return;

    const annotatedImage = canvas.toDataURL('image/jpeg');

    const analysisHtml = ReactDOMServer.renderToString(
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysisResult.answer}</ReactMarkdown>
    );

    const reportHtml = ReactDOMServer.renderToStaticMarkup(
      <AnalysisReport
        imageSrc={annotatedImage}
        question={lastQuestion}
        analysisHtml={analysisHtml}
      />
    );
    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };
  
  const ToolButton: React.FC<{
    label: string;
    icon: React.ReactNode;
    tool: 'pen' | 'arrow' | 'text';
  }> = ({ label, icon, tool }) => (
    <button
      onClick={() => setActiveTool(tool)}
      className={`p-2 rounded-lg flex items-center gap-2 transition-colors text-sm ${
        activeTool === tool ? 'bg-brand-coral text-white' : 'bg-brand-sky hover:bg-brand-peach'
      }`}
      aria-label={label}
    >
      {icon}
    </button>
  );
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* ... styles ... */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-brand-charcoal">
          AI Homework Helper
        </h2>
        <p className="mt-4 text-lg text-brand-charcoal/70">
          Snap a picture of any problem—even handwritten notes—and get the answers you need.
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg shadow-brand-peach/50 border border-brand-charcoal/5 space-y-6">
        <div>
            <label className="block text-md font-semibold text-brand-charcoal mb-2">
                1. Upload a picture of your problem
            </label>
            <p className="text-sm text-brand-charcoal/60 mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-coral/80 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                </svg>
                <span>Works great with printed text and even handwritten notes!</span>
            </p>
             <div className="flex items-center space-x-4">
                 <label htmlFor="image-upload" className="cursor-pointer bg-brand-sky hover:bg-opacity-80 text-brand-charcoal font-bold py-2 px-5 rounded-full transition-colors inline-block">Choose File</label>
                 <input id="image-upload" type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} className="hidden" />
                 {imageFile && <span className="text-sm text-brand-charcoal/60 truncate">{imageFile.file.name}</span>}
             </div>
        </div>

        {imageFile && (
          <div className="space-y-6 animate-[popIn_0.5s_ease-out_forwards]">
            <div>
                 <label className="block text-md font-semibold text-brand-charcoal mb-2">
                    2. Annotate your image (Optional)
                </label>
                <div className="flex items-center gap-2 p-2 bg-brand-cream rounded-xl mb-2 flex-wrap">
                    <ToolButton tool="pen" label="Pen Tool" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>} />
                    <ToolButton tool="arrow" label="Arrow Tool" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>} />
                    <ToolButton tool="text" label="Text Tool" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.243 3.243a1 1 0 01.727 1.213L9.53 6h.97a1 1 0 110 2h-3a1 1 0 110-2h.97l-.44-1.544a1 1 0 011.213-.727zM9 12a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /><path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2-1a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 00-1-1H5z" /></svg>} />
                    <input type="color" value={activeColor} onChange={e => setActiveColor(e.target.value)} className="w-8 h-8 rounded-md" />
                    <div className="flex-grow"></div>
                    <button onClick={handleUndo} className="p-2 rounded-lg bg-brand-sky hover:bg-brand-peach" aria-label="Undo"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg></button>
                    <button onClick={handleClear} className="p-2 rounded-lg bg-brand-sky hover:bg-brand-peach" aria-label="Clear"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
                </div>
                <canvas 
                    ref={canvasRef} 
                    width="600" 
                    height="400" 
                    className="w-full h-auto bg-gray-200 rounded-2xl cursor-crosshair"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onClick={handleCanvasClick}
                />
            </div>
            <div>
                <label className="block text-md font-semibold text-brand-charcoal mb-2">
                    3. Ask a question about the image
                </label>
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={3}
                    className="w-full bg-brand-cream/70 border-2 border-transparent rounded-xl p-3 focus:ring-2 focus:ring-brand-coral"
                    placeholder="e.g., Can you solve for x? or What part of the cell is this arrow pointing to?"
                />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading || !imageFile || !question.trim()}
              className="w-full bg-brand-coral hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none text-white font-bold py-4 px-4 rounded-full transition-transform duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-brand-coral/50 text-lg shadow-lg shadow-brand-coral/40"
            >
              {isLoading ? 'Thinking...' : '🤔 Get Answer 🤔'}
            </button>
          </div>
        )}
      </div>

     {/* ... rest of the result rendering component ... */}
      <div className="mt-8">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-48">
            <LoadingSpinner />
            <p className="text-xl mt-4 text-brand-charcoal/70">
              Reading your image and solving...
            </p>
          </div>
        )}
        {error && !isLoading && (
          <div className="text-center p-4 bg-red-100 border border-red-300 rounded-xl">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        {analysisResult && !isLoading && imageFile && (
          <div className="bg-white p-8 rounded-3xl shadow-lg shadow-brand-peach/50 border border-brand-charcoal/5 space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h3 className="text-2xl font-bold text-brand-charcoal">Here's the Answer!</h3>
                <button 
                  onClick={handleSharePdf}
                  className="bg-brand-sky hover:bg-brand-peach text-brand-charcoal/80 font-semibold py-1.5 px-4 rounded-full text-sm transition-all flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
                  Share as PDF
                </button>
            </div>
            
            <div className="space-y-6">
                 <div className="bg-brand-sky/50 p-6 rounded-2xl">
                    <p className="font-semibold text-brand-charcoal mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-coral" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 11-2 0V4H6a1 1 0 11-2 0V4zm4 12a1 1 0 001 1h6a1 1 0 100-2H9a1 1 0 00-1 1z" clipRule="evenodd" /></svg>
                        What I Read (OCR):
                    </p>
                    <blockquote className="text-sm text-brand-charcoal/70 italic border-l-4 border-brand-peach pl-4 max-h-32 overflow-y-auto">
                      {analysisResult.ocrText || "I couldn't find any text in this image."}
                    </blockquote>
                </div>
                
                 <div className="bg-brand-sky/50 p-6 rounded-2xl">
                    <p className="font-semibold text-brand-charcoal mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-coral" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                        AI's Explanation:
                    </p>
                    <div className="markdown-content text-brand-charcoal/80">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysisResult.answer}</ReactMarkdown>
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};