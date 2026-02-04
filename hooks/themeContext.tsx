import { useState, useEffect } from 'react';

export function useThemeDetector() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 1. Initial Check
    const root = document.documentElement;
    setIsDark(root.classList.contains('dark'));

    // 2. Observe changes to the 'class' attribute on the root element
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains('dark'));
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}