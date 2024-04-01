import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import { useTaskStore } from "../context/TaskStoreContext";
import { NewTaskNode, TaskNode } from "./TaskNode";

import "./TaskSection.css";

export const TaskSection: FC = observer(() => {
  const [isAdding, setIsAdding] = useState(false);
  const taskStore = useTaskStore();
  const tasks = taskStore.getTasks();

  return (
    <section className="tasks">
      <h2>Define</h2>
      <div className="task-container">
        {tasks.map((task) => (
          <TaskNode key={task.id} task={task} />
        ))}
        {isAdding ? (
          <NewTaskNode stopEditing={() => setIsAdding(false)} />
        ) : (
          <button onClick={() => setIsAdding(true)}>Add Task</button>
        )}
      </div>
    </section>
  );
});
