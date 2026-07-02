import { useEffect, useState, useCallback } from 'react';

let externalShow = null;

export function showToast(message) {
  externalShow?.(message);
}

export function Toast() {
  const [toast, setToast] = useState(null);

  const show = useCallback((message) => {
    setToast({ message, id: Date.now() });
  }, []);

  useEffect(() => {
    externalShow = show;
    return () => { externalShow = null; };
  }, [show]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 1900);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;
  return <div className="toast" key={toast.id}>{toast.message}</div>;
}
