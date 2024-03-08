import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useTaskStore } from "../context/TaskStoreContext";
import { TaskNode } from "./TaskNode";

export const TaskSection: FC = observer(() => {
  const taskStore = useTaskStore();
  const tasks = taskStore.getTasks();

  const assignedTasks = tasks.filter((task) => task.isAssigned);
  const unassignedTasks = tasks.filter((task) => !task.isAssigned);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h3>Unassigned Tasks</h3>
        <div>
          {unassignedTasks.map((task) => (
            <TaskNode key={task.id} task={task} />
          ))}
        </div>
      </div>
      <div>
        <h3>Assigned Tasks</h3>
        <ul>
          {assignedTasks.map((task) => (
            <TaskNode key={task.id} task={task} />
          ))}
        </ul>
      </div>
    </div>
  );
});
