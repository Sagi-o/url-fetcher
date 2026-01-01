import { Box } from '@mantine/core';
import DOMPurify from 'dompurify';
import { useMemo } from 'react';

interface SafeHtmlRendererProps {
  html: string;
}

export const SafeHtmlRenderer = ({ html }: SafeHtmlRendererProps) => {
  const sanitizedHtml = useMemo(() => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p',
        'br',
        'strong',
        'em',
        'u',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ul',
        'ol',
        'li',
        'a',
        'img',
        'div',
        'span',
        'table',
        'tr',
        'td',
        'th',
        'thead',
        'tbody',
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
    });
  }, [html]);

  return (
    <Box
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      style={{
        wordBreak: 'break-word',
        '& img': { maxWidth: '100%', height: 'auto' },
        '& a': { color: 'var(--mantine-color-blue-6)' },
      }}
    />
  );
};
