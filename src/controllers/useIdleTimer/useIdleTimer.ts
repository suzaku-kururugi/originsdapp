// import { useEffect, useState, useRef } from 'react';

// export const useIdleTimer = (timeout: number, onIdle: () => void) => {
//   const [isIdle, setIsIdle] = useState(false);
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null);

//   const resetTimer = () => {
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//     }

//     setIsIdle(false);

//     timeoutRef.current = setTimeout(() => {
//       setIsIdle(true);
//       onIdle();
//     }, timeout);
//   };

//   useEffect(() => {
//     const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
//     const handleVisibilityChange = () => {
//       if (document.visibilityState === 'visible') {
//         resetTimer();
//       }
//     };

//     events.forEach(event => window.addEventListener(event, resetTimer));
//     document.addEventListener('visibilitychange', handleVisibilityChange);

//     resetTimer();

//     return () => {
//       events.forEach(event => window.removeEventListener(event, resetTimer));
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     };
//   }, [timeout]);

//   return isIdle;
// };

interface UseIdleTimerReturnInterface {
  isIdle: boolean;
  // timeLeft: number;
}

import { useEffect, useState, useRef, useCallback } from 'react';

export const useIdleTimer = (timeout: number, onIdle: () => void): UseIdleTimerReturnInterface => {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsIdle(false);

    timeoutRef.current = setTimeout(() => {
      setIsIdle(true);
      onIdle();
    }, timeout);
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        resetTimer();
      }
    };

    events.forEach(event => window.addEventListener(event, resetTimer));
    document.addEventListener('visibilitychange', handleVisibilityChange);

    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [timeout]);

  return {
    isIdle
  };
};
