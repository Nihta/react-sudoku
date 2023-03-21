import { useEffect, useRef } from "react";

const useTimeout = (callback: () => void, delay: number) => {
  // Create a ref for the callback function.
  const callbackRef = useRef<any>(null);

  // Remember the latest callback.
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up the timeout.
  useEffect(() => {
    function tick() {
      callbackRef.current && callbackRef.current();
    }

    const id = setTimeout(tick, delay);
    return () => clearTimeout(id);
  }, [delay]);
};

export default useTimeout;
