/**
 * Scopes CSS rules to a specific selector to prevent global style bleeding
 * Adds a scope prefix to all CSS selectors
 */
export function scopeCss(css: string, scopeSelector: string): string {
  if (!css) return '';

  try {
    // Split by rule boundaries (closing braces)
    const rules = css.split('}');

    const scopedRules = rules
      .map((rule) => {
        const trimmedRule = rule.trim();
        if (!trimmedRule) return '';

        // Find the selector part (before the opening brace)
        const openBraceIndex = trimmedRule.indexOf('{');
        if (openBraceIndex === -1) return '';

        const selector = trimmedRule.substring(0, openBraceIndex).trim();
        const declarations = trimmedRule.substring(openBraceIndex);

        // Skip at-rules like @media, @keyframes, etc.
        if (selector.startsWith('@')) {
          // For @media and other at-rules, we need to scope the inner selectors
          if (selector.startsWith('@media') || selector.startsWith('@supports')) {
            // Recursively scope the content inside @media/@supports
            const innerContent = declarations.substring(1); // Remove opening {
            const scopedInner = scopeCss(innerContent, scopeSelector);
            return `${selector} { ${scopedInner} }`;
          }
          // For @keyframes, @font-face, etc., keep as-is
          return `${selector} ${declarations}}`;
        }

        // Split multiple selectors (e.g., "div, span, p")
        const selectors = selector.split(',').map((s) => s.trim());

        // Add scope to each selector
        const scopedSelectors = selectors.map((sel) => {
          // Don't scope :root, html, body, or universal selector
          if (sel === ':root' || sel === 'html' || sel === 'body' || sel === '*') {
            return `${scopeSelector}`;
          }

          // Handle pseudo-elements and pseudo-classes
          const pseudoMatch = sel.match(/^([^:]+)(:.+)?$/);
          if (pseudoMatch) {
            const baseSelector = pseudoMatch[1] || '';
            const pseudo = pseudoMatch[2] || '';

            // If selector starts with a combinator, just prepend scope
            if (sel.startsWith('>') || sel.startsWith('+') || sel.startsWith('~')) {
              return `${scopeSelector} ${sel}`;
            }

            return `${scopeSelector} ${baseSelector}${pseudo}`;
          }

          return `${scopeSelector} ${sel}`;
        });

        return `${scopedSelectors.join(', ')} ${declarations}}`;
      })
      .filter((r) => r)
      .join('\n');

    return scopedRules;
  } catch (error) {
    console.error('Error scoping CSS:', error);
    return css; // Return original CSS if scoping fails
  }
}
