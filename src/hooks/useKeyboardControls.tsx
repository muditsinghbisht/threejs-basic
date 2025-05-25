import { useEffect } from 'react';

type KeyboardControlsFunc = (keyPress: string) => void;

interface UseKeyboardControlsProps {
  onKeyPress?: KeyboardControlsFunc;
  onKeyDown?: KeyboardControlsFunc;
  onKeyUp?: KeyboardControlsFunc;
}

export function useKeyboardControls({
  onKeyPress, onKeyDown, onKeyUp
}: UseKeyboardControlsProps) {

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ('qweasd'.includes(key) && onKeyPress) {
        onKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onKeyPress]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ('qweasd'.includes(key) && onKeyDown) {
        onKeyDown(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyDown]);

  useEffect (() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ('wasd'.includes(key) && onKeyUp) {
        onKeyUp(key);
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [onKeyUp])
}
