import {
  createContext,
  PropsWithChildren,
  FunctionComponent,
  Context,
  useContext,
  useState,
} from 'react';

/**
 * Creates a context for the store created by the passed `storeFactory`.
 * Additionally returns the `Provider` component and the hook for the created store's context.
 *
 * @param storeFactory - a function that returns an object representing the store
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/naming-convention
const createStoreContext = <T extends Record<string, any>>(Store: {
  new (): T;
}): [FunctionComponent<unknown>, () => T, Context<T>] => {
  const context = createContext<T>({} as T); // the initial value is only to satisfy TS and won't be used

  /**
   * Initializes and contains the context for the `T`.
   */
  function StoreProvider({ children }: PropsWithChildren<unknown>): JSX.Element {
    const [store] = useState(() => new Store());
    return <context.Provider value={store}>{children}</context.Provider>;
  }

  const useStore = () => {
    const store = useContext(context);
    if (store) {
      return store;
    }
    throw new ReferenceError(
      `${Store.name} is not initialized, make sure that your component is wrapped in the 'Provider' of the store.`,
    );
  };

  return [StoreProvider, useStore, context];
};

export default createStoreContext;
