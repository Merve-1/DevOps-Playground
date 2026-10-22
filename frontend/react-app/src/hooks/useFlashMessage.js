import { useCallback, useEffect, useRef, useState } from 'react';

export function useFlashMessage(ms = 3000) {
  const [message, setMessage] = useState('');
  const timer = useRef();

  const flash = useCallback((text) => {
    clearTimeout(timer.current);
    setMessage(text);
    if (text) timer.current = setTimeout(() => setMessage(''), ms);
  }, [ms]);

  useEffect(() => () => clearTimeout(timer.current), []);
  return [message, flash];
}