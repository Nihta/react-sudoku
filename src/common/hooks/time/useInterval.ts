import { useEffect, useRef } from "react";

const useInterval = (callback: () => void, delay: number) => {
  // Create a ref for the callback function.
  const callbackRef = useRef<any>(null);

  // Remember the latest callback.
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up the timeout and clean up the interval when the component unmounts.
  useEffect(() => {
    const interval = setInterval(() => {
      callbackRef.current && callbackRef.current();
    }, delay);

    return () => clearInterval(interval);
  }, [delay]);
};

export default useInterval;
