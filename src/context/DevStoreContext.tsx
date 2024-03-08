import { createContext, FC, ReactNode, useContext } from "react";
import { DevStore } from "../model/dev";

const DevStoreContext = createContext<DevStore | undefined>(undefined);

export const DevStoreProvider: FC<{
  store: DevStore;
  children?: ReactNode;
}> = ({ store, children }) => {
  return (
    <DevStoreContext.Provider value={store}>
      {children}
    </DevStoreContext.Provider>
  );
};

export const useDevStore = () => {
  const store = useContext(DevStoreContext);
  if (store === undefined) {
    throw new Error("useDevStore must be used within a DevStoreProvider");
  }
  return store;
};
