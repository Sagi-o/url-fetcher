import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { SafeHtmlRenderer } from '../SafeHtmlRenderer';

describe('SafeHtmlRenderer', () => {
  const renderWithMantine = (component: React.ReactElement) => {
    return render(<MantineProvider>{component}</MantineProvider>);
  };

  it('should render safe HTML content', () => {
    const html = '<p>Hello World</p>';
    const { container } = renderWithMantine(<SafeHtmlRenderer html={html} />);

    const paragraph = container.querySelector('p');
    expect(paragraph).not.toBeNull();
    expect(container).toHaveTextContent('Hello World');
  });

  it('should sanitize dangerous scripts', () => {
    const html = '<p>Safe</p><script>alert("XSS")</script>';
    const { container } = renderWithMantine(<SafeHtmlRenderer html={html} />);

    // Script should be removed
    const script = container.querySelector('script');
    expect(script).toBeNull();

    // Safe content should remain
    expect(container).toHaveTextContent('Safe');
  });

  it('should allow safe tags', () => {
    const html = '<div><h1>Title</h1><p>Text</p><a href="#">Link</a></div>';
    const { container } = renderWithMantine(<SafeHtmlRenderer html={html} />);

    expect(container.querySelector('h1')).not.toBeNull();
    expect(container.querySelector('p')).not.toBeNull();
    expect(container.querySelector('a')).not.toBeNull();
  });
});
