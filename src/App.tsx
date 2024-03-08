import { useState } from "react";
import "./App.css";
import { Dev, Task } from "./models";
import { PlanEditor } from "./PlanEditor";

import { testPlan } from "./testPlan";

const replaceAllMatchingTasks = (
  listToUpdate: ReadonlyArray<Task>,
  sourceList: ReadonlyArray<Task>,
) => {
  return listToUpdate
    .filter((task) =>
      sourceList.find((sourceTask) => sourceTask.id === task.id),
    )
    .map((task) => {
      const matchingTask = sourceList.find(
        (sourceTask) => sourceTask.id === task.id,
      );
      return matchingTask || task;
    });
};

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

  const setPlanTasks = (tasks: ReadonlyArray<Task>) => {
    const dependencyUpdatedTasks = tasks.map((task) => {
      const dependsOn = task.dependsOn
        .filter((dependency) => tasks.includes(dependency))
        .map(
          (dependency) =>
            tasks.find((t) => t.id === dependency.id) ?? dependency,
        );
      return { ...task, dependsOn };
    });
    setTasks(dependencyUpdatedTasks);
    setDevs(
      devs.map((dev) => ({
        ...dev,
        tasks: replaceAllMatchingTasks(dev.tasks, tasks),
      })),
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gantt Hill</h1>
      </header>
      <PlanEditor
        plan={plan}
        setPlanDevs={setDevs}
        setPlanTasks={setPlanTasks}
        setPlanName={setName}
        setPlanStart={setStart}
      />
    </div>
  );
}

export default App;
