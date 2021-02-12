import { EffectCallback, useEffect } from 'react';

/**
 * @param destructor - function, which is triggered on unmount.
 */
export default function useUnmount(destructor: EffectCallback): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => destructor, []);
}
