import { useEffect, useRef } from "react";

function useKeyDown(handler: (event: KeyboardEvent) => void) {
  const savedHandler = useRef<any>(null);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (e: KeyboardEvent) => {
      savedHandler.current(e);
    };

    window.addEventListener("keydown", eventListener);
    return () => {
      window.removeEventListener("keydown", eventListener);
    };
  }, []);
}

export default useKeyDown;
