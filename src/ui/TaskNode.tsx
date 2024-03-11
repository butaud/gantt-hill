import { FC, useState } from "react";
import { Task } from "../model/task";
import { useTaskStore } from "../context/TaskStoreContext";
import { observer } from "mobx-react-lite";
import { DependencyEditor } from "./DependencyEditor";

export type ITaskNodeProps = {
  task: Task;
};

export const TaskNode: FC<ITaskNodeProps> = observer(({ task }) => {
  const [editing, setEditing] = useState(task === undefined);

  return (
    <div id={`task-node-${task.id}`}>
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

export const TaskEditNode: FC<{
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
    <form>
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
    </form>
  );
});

const TaskDisplayNode: FC<{ task: Task }> = observer(({ task }) => {
  const [editingDependencies, setEditingDependencies] = useState(false);
  return (
    <>
      <p>{task.name}</p>
      <p>{task.estimate}</p>
      {editingDependencies ? (
        <div>
          <DependencyEditor task={task} />
          <button onClick={() => setEditingDependencies(false)}>Done</button>
        </div>
      ) : (
        <p>
          <a href="#" onClick={() => setEditingDependencies(true)}>
            Dependencies
          </a>
          : {task.dependsOn.length}
        </p>
      )}
    </>
  );
});
