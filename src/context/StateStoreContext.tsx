import { createContext, FC, ReactNode, useContext } from "react";
import { StateStore } from "../model/state";

const StateStoreContext = createContext<StateStore | undefined>(undefined);

export const StateStoreProvider: FC<{
  store: StateStore;
  children?: ReactNode;
}> = ({ store, children }) => {
  return (
    <StateStoreContext.Provider value={store}>
      {children}
    </StateStoreContext.Provider>
  );
};

export const useStateStore = () => {
  const store = useContext(StateStoreContext);
  if (store === undefined) {
    throw new Error("useStateStore must be used within a StateStoreProvider");
  }
  return store;
};
