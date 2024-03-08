import { FC, useState } from "react";
import { Draft, Task } from "./models";

export type ITaskNodeProps = {
  task: Task | undefined;
  addTask: (task: Draft<Task>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (task: Task) => void;
};

export const TaskNode: FC<ITaskNodeProps> = ({
  task,
  addTask,
  updateTask,
  deleteTask,
}) => {
  const [editing, setEditing] = useState(task === undefined);

  const saveTask = (draft: Draft<Task>) => {
    if (task === undefined) {
      addTask(draft);
    } else {
      updateTask({ ...task, ...draft });
    }
    setEditing(false);
  };

  return (
    <div>
      {editing || !task ? (
        <TaskEditNode task={task} saveTask={saveTask} />
      ) : (
        <TaskDisplayNode task={task} />
      )}
      {!editing && task && (
        <button onClick={() => setEditing(true)}>Edit</button>
      )}
      {task !== undefined && (
        <button onClick={() => deleteTask(task)}>Delete</button>
      )}
    </div>
  );
};

const TaskEditNode: FC<{
  task: Task | undefined;
  saveTask: (task: Draft<Task>) => void;
}> = ({ task, saveTask }) => {
  const [name, setName] = useState(task?.name ?? "New Task");
  const [estimate, setEstimate] = useState(task?.estimate ?? 0);
  const [dependsOn, setDependsOn] = useState(task?.dependsOn ?? []);

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
      <button onClick={() => saveTask({ ...task, name, estimate, dependsOn })}>
        Save
      </button>
    </>
  );
};

const TaskDisplayNode: FC<{ task: Task }> = ({ task }) => {
  return (
    <>
      <p>{task.name}</p>
      <p>{task.estimate}</p>
      <p>Dependencies: {task.dependsOn.length}</p>
    </>
  );
};
