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
    <div className="task-section">
      <h3>Tasks</h3>
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
    </div>
  );
});
