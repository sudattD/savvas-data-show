import { useEffect } from 'react';

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = `Savvas Data Show · ${title}`;
    return () => {
      document.title = prev;
    };
  }, [title]);
}
