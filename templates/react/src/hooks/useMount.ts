import { EffectCallback, useEffect } from 'react';

/**
 * @param callback - function, which is triggered on mount. If the function returns a callback, it will be called on unmount.
 */
export default function useMount(callback: EffectCallback): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, []);
}
