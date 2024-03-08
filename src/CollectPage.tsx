import { FC } from "react";
import { Task } from "./model/task";
import { Dev } from "./model/dev";

export type ICollectProps = {
  devs: readonly Dev[];
  setDevs: (devs: Dev[]) => void;
  tasks: readonly Task[];
  setTasks: (tasks: Task[]) => void;
};

export const CollectPage: FC<ICollectProps> = ({ devs, tasks }) => {
  return (
    <div>
      <h2>Collect</h2>
      <h3>Devs</h3>
      <ul>
        {devs.map((dev) => (
          <li key={dev.id} style={{ color: dev.color }}>
            {dev.name}
          </li>
        ))}
      </ul>
      <h3>Tasks</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  );
};
