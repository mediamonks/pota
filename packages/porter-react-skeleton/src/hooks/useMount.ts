import { EffectCallback, useEffect } from 'react';

/**
 * @param effect - function, which is triggered on mount. If the function returns a callback, it will be called on unmount.
 */
export default function useMount(effect: EffectCallback): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
}
