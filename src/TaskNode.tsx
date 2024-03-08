import { FC, useState } from "react";
import { Task } from "./model/task";
import { useTaskStore } from "./context/TaskStoreContext";
import { observer } from "mobx-react-lite";

export type ITaskNodeProps = {
  task: Task | undefined;
};

export const TaskNode: FC<ITaskNodeProps> = observer(({ task }) => {
  const [editing, setEditing] = useState(task === undefined);

  return (
    <div>
      {editing || !task ? (
        <TaskEditNode task={task} stopEditing={() => setEditing(false)} />
      ) : (
        <TaskDisplayNode task={task} />
      )}
      {!editing && task && (
        <button onClick={() => setEditing(true)}>Edit</button>
      )}
      {task !== undefined && (
        <button onClick={() => task.delete()}>Delete</button>
      )}
    </div>
  );
});

const TaskEditNode: FC<{
  task: Task | undefined;
  stopEditing: () => void;
}> = observer(({ task, stopEditing }) => {
  const [name, setName] = useState(task?.name ?? "New Task");
  const [estimate, setEstimate] = useState(task?.estimate ?? 0);
  const taskStore = useTaskStore();

  const saveTask = () => {
    if (task) {
      task.setName(name);
      task.setEstimate(estimate);
      stopEditing();
    } else {
      taskStore.addTask({ name, estimate });
      stopEditing();
    }
  };

  return (
    <>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        value={estimate}
        onChange={(e) => setEstimate(parseInt(e.target.value))}
      />
      <button onClick={() => saveTask()}>Save</button>
    </>
  );
});

const TaskDisplayNode: FC<{ task: Task }> = ({ task }) => {
  return (
    <>
      <p>{task.name}</p>
      <p>{task.estimate}</p>
      <p>Dependencies: {task.dependsOn.length}</p>
    </>
  );
};
