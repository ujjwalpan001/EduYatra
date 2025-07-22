import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import React from 'react';

type LatexContent = string | undefined | null;

/**
 * Renders text with LaTeX expressions
 * @param content The text content to render
 * @param isInline Whether to force inline rendering
 * @returns React nodes with rendered LaTeX
 */
export const renderKatex = (content: LatexContent, isInline = false): React.ReactNode => {
  if (!content) return null;

  return content.split(/(\$\$.*?\$\$|\$.*?\$)/).map((part, i) => {
    if (part.startsWith('$$') && part.endsWith('$$') && !isInline) {
      return <BlockMath key={i} math={part.slice(2, -2)} />;
    } else if (part.startsWith('$') && part.endsWith('$')) {
      return <InlineMath key={i} math={part.slice(1, -1)} />;
    }
    return <span key={i}>{part}</span>;
  });
};

/**
 * React component for LaTeX rendering with error boundary
 */
export const KatexRenderer = ({ 
  children, 
  isInline = false 
}: { 
  children: LatexContent; 
  isInline?: boolean 
}) => {
  try {
    return <>{renderKatex(children, isInline)}</>;
  } catch (error) {
    console.error('Katex rendering error:', error);
    return <span className="text-red-500">{children}</span>;
  }
};

/**
 * Checks if text contains LaTeX expressions
 */
export const hasKatex = (content: LatexContent): boolean => {
  return !!content && /\$(.*?)\$/.test(content);
};