import { createContext, FC, ReactNode, useContext } from "react";
import { PlanStore } from "../model/plan";

const PlanStoreContext = createContext<PlanStore | undefined>(undefined);

export const PlanStoreProvider: FC<{
  store: PlanStore;
  children?: ReactNode;
}> = ({ store, children }) => {
  return (
    <PlanStoreContext.Provider value={store}>
      {children}
    </PlanStoreContext.Provider>
  );
};

export const usePlanStore = () => {
  const store = useContext(PlanStoreContext);
  if (store === undefined) {
    throw new Error("usePlanStore must be used within a PlanStoreProvider");
  }
  return store;
};
