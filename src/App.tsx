import "./App.css";
import { PlanEditor } from "./ui/PlanEditor";

import { TaskStore } from "./model/task";
import { DevStore } from "./model/dev";
import { DevStoreProvider } from "./context/DevStoreContext";
import { TaskStoreProvider } from "./context/TaskStoreContext";
import { StateStore } from "./model/state";
import { StateStoreProvider } from "./context/StateStoreContext";
import { PlanStore } from "./model/plan";
import { PlanStoreProvider } from "./context/PlanStoreContext";
import { AppControls } from "./ui/AppControls";

const stateStore = new StateStore();
const planStore = new PlanStore();
planStore.setTitle("My Execution Plan");
const devStore = new DevStore(planStore);
const taskStore = new TaskStore(devStore);
/**
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
*/

function App() {
  return (
    <PlanStoreProvider store={planStore}>
      <DevStoreProvider store={devStore}>
        <TaskStoreProvider store={taskStore}>
          <StateStoreProvider store={stateStore}>
            <header className="app-header">
              <h1>Gantt Hill</h1>
              <AppControls />
            </header>
            <main className="main-content">
              <PlanEditor />
            </main>
            <footer className="app-footer">
              <a href="https://github.com/butaud/gantt-hill">
                GitHub Source with Readme
              </a>
            </footer>
          </StateStoreProvider>
        </TaskStoreProvider>
      </DevStoreProvider>
    </PlanStoreProvider>
  );
}

export default App;
