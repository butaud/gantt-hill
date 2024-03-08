import { createContext, FC, ReactNode, useContext } from "react";
import { TaskStore } from "../model/task";

const TaskStoreContext = createContext<TaskStore | undefined>(undefined);

export const TaskStoreProvider: FC<{
  store: TaskStore;
  children?: ReactNode;
}> = ({ store, children }) => {
  return (
    <TaskStoreContext.Provider value={store}>
      {children}
    </TaskStoreContext.Provider>
  );
};

export const useTaskStore = () => {
  const store = useContext(TaskStoreContext);
  if (store === undefined) {
    throw new Error("useDevStore must be used within a TaskStoreProvider");
  }
  return store;
};
