import { action, observable, runInAction } from 'mobx';
import { useState } from 'react';
import { isPlainObject } from 'isntnt';

/**
 * Creates an observable mobx store from the passed factory function.
 *
 * NOTE: this is a rough copy of `mobx-react-lite`'s `useLocalStore`, this exists
 * so that the functions are wrapped in an `action`, rather than a `transaction`.
 * This is to align with how we configured MobX; to allow observables to be changed only via actions.
 *
 * @param storeFactory - a function that returns an object representing the store
 */
export default function useStoreFactory<T extends Record<string, unknown>>(
  storeFactory: () => T,
): T {
  const [store] = useState(() => {
    const local = observable(storeFactory());
    if (isPlainObject(local)) {
      runInAction(() => {
        for (const key of Object.keys(local)) {
          const callback = local[key];
          if (typeof callback === 'function') {
            (local as Record<typeof key, unknown>)[key] = action(
              callback.name,
              (...args: Array<unknown>) => callback.apply(local, args),
            );
          }
        }
      });
    }
    return local;
  });

  return store;
}
