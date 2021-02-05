import { makeAutoObservable } from 'mobx';
import createStoreContext from './utils/createStoreContext';

export const [GlobalStoreProvider, useGlobalStore] = createStoreContext(
  class GlobalStore {
    public count: number = 0;

    public constructor() {
      // NOTE: don't add anything else here  unless you know what you are doing
      // as the constructor will be executed twice due to `StrictMode`
      makeAutoObservable(this);
    }

    public increment = () => {
      this.count += 1;
    };

    public decrement = () => {
      this.count -= 1;
    };
  },
);

export type GlobalStore = ReturnType<typeof useGlobalStore>;
