import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface DiagramDisplayProps {
  svgCode?: string;
  mermaidCode?: string;
  imageUrl?: string;
}

const DiagramDisplay: React.FC<DiagramDisplayProps> = ({ svgCode, mermaidCode, imageUrl }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [svgOutput, setSvgOutput] = useState<string>('');

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
    });
  }, []);

  useEffect(() => {
    const renderMermaid = async () => {
      if (mermaidCode && mermaidRef.current) {
        try {
          // Clean the code by removing markdown code block syntax if present
          const cleanCode = mermaidCode.replace(/^```mermaid\n/, '').replace(/\n```$/, '').trim();
          
          // Clear previous content
          mermaidRef.current.innerHTML = '';
          
          // Modern Mermaid rendering approach
          const { svg } = await mermaid.render(
            'mermaid-diagram-' + Math.random().toString(36).substring(7),
            cleanCode
          );
          setSvgOutput(svg);
        } catch (error) {
          console.error('Error rendering Mermaid diagram:', error);
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = '<p>Error rendering diagram</p>';
          }
        }
      }
    };

    renderMermaid();
  }, [mermaidCode]);

  if (svgCode) {
    // Clean the SVG code if it's wrapped in markdown code block
    const cleanSvg = svgCode.replace(/^```svg\n/, '').replace(/\n```$/, '').trim();
    return (
      <div 
        className="w-full"
        dangerouslySetInnerHTML={{ __html: svgCode }} 
      />
    );
  }

  if (mermaidCode) {
    return (
      <>
        {svgOutput ? (
          <div 
            className="w-full"
            dangerouslySetInnerHTML={{ __html: svgOutput }} 
          />
        ) : (
          <div ref={mermaidRef} className="mermaid-diagram" />
        )}
      </>
    );
  }

  if (imageUrl) {
    return (
      <div className="max-w-full h-auto mx-auto">
        <img src={imageUrl} alt="Diagram" style={{ maxWidth: '100%' }} />
      </div>
    );
  }

  return null;
};

export default DiagramDisplay;


