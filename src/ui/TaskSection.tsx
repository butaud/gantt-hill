import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import { useTaskStore } from "../context/TaskStoreContext";
import { NewTaskNode, TaskNode } from "./TaskNode";
import { useStateStore } from "../context/StateStoreContext";
import { TaskRearrangeUnassignedTasks } from "./Rearrange";

import "./TaskSection.css";

export const TaskSection: FC = observer(() => {
  const [isAdding, setIsAdding] = useState(false);
  const taskStore = useTaskStore();
  const stateStore = useStateStore();
  const tasks = taskStore.getTasks();

  const assignedTasks = tasks.filter((task) => task.isAssigned);
  const unassignedTasks = tasks.filter((task) => !task.isAssigned);

  return (
    <div className="task-section">
      <div>
        <h3>Unassigned Tasks</h3>
        {stateStore.isRearrangingTasks ? (
          <TaskRearrangeUnassignedTasks tasks={unassignedTasks} />
        ) : (
          <div className="task-container">
            {unassignedTasks.map((task) => (
              <TaskNode key={task.id} task={task} />
            ))}
            {isAdding ? (
              <NewTaskNode stopEditing={() => setIsAdding(false)} />
            ) : (
              <button onClick={() => setIsAdding(true)}>Add Task</button>
            )}
          </div>
        )}
      </div>
      <div>
        <h3>Assigned Tasks</h3>
        <ul className="task-container">
          {assignedTasks.map((task) => (
            <TaskNode key={task.id} task={task} />
          ))}
        </ul>
      </div>
    </div>
  );
});
