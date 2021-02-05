import { useEffect } from 'react';

/**
 * @param fn - function, which is triggered on unmount.
 */
const useUnmount = (fn: () => void): void => {
  useEffect(() => fn, []);
};

export default useUnmount;
