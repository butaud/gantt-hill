import { useState } from "react";
import "./App.css";
import { PlanEditor } from "./ui/PlanEditor";

import { TaskStore } from "./model/task";
import { DevStore } from "./model/dev";
import { DevStoreProvider } from "./context/DevStoreContext";
import { TaskStoreProvider } from "./context/TaskStoreContext";
import { DateTime } from "luxon";
import { StateStore } from "./model/state";
import { StateStoreProvider } from "./context/StateStoreContext";

const stateStore = new StateStore();
const devStore = new DevStore();
const taskStore = new TaskStore(devStore);
const t1 = taskStore.addTask({ name: "Task 1", estimate: 3 });
const t2 = taskStore.addTask({ name: "Task 2", estimate: 2 });
taskStore.addTask({ name: "Task 3", estimate: 1 });
const t4 = taskStore.addTask({ name: "Task 4", estimate: 6 });
t2.addDependency(t1);
const d1 = devStore.addDev({ name: "Dev 1" });
const d2 = devStore.addDev({ name: "Dev 2" });
d1.addTask(t1);
d1.addTask(t4);
d2.addTask(t2);
[...Array(7).keys()].forEach((i) => d2.oofDays.add(i));

function App() {
  const [name, setName] = useState("Test Plan");
  const [start, setStart] = useState(DateTime.now());

  return (
    <DevStoreProvider store={devStore}>
      <TaskStoreProvider store={taskStore}>
        <StateStoreProvider store={stateStore}>
          <header className="app-header">
            <h1>Gantt Hill</h1>
            <nav className="top-controls">
              <button>Save</button>
              <button>Load</button>
              <button>Export as Mermaid</button>
            </nav>
          </header>
          <main className="main-content">
            <PlanEditor
              name={name}
              start={start}
              setPlanName={setName}
              setPlanStart={setStart}
            />
          </main>
        </StateStoreProvider>
      </TaskStoreProvider>
    </DevStoreProvider>
  );
}

export default App;
