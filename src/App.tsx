import { useState } from "react";
import "./App.css";
import { Dev, Task } from "./models";
import { PlanEditor } from "./PlanEditor";

import { testPlan } from "./testPlan";

function App() {
  const [name, setName] = useState(testPlan.name);
  const [start, setStart] = useState(testPlan.start);
  const [tasks, setTasks] = useState<ReadonlyArray<Task>>(testPlan.tasks);
  const [devs, setDevs] = useState<ReadonlyArray<Dev>>(testPlan.devs);

  const plan = {
    id: 1,
    name,
    start,
    tasks,
    devs,
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gantt Hill</h1>
      </header>
      <PlanEditor
        plan={plan}
        setPlanDevs={setDevs}
        setPlanTasks={setTasks}
        setPlanName={setName}
        setPlanStart={setStart}
      />
    </div>
  );
}

export default App;
