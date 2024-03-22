import { FC, useState } from "react";
import { DependencyCycleError, Task } from "../model/task";
import { useTaskStore } from "../context/TaskStoreContext";
import { observer } from "mobx-react-lite";
import { EditableValue, ICustomEditorProps } from "./EditableValue";

import "./TaskNode.css";
import { DeleteButton } from "./DeleteButton";

export type ITaskNodeProps = {
  task: Task;
};

export const TaskNode: FC<ITaskNodeProps> = observer(({ task }) => {
  const setTaskName = (name: string) => {
    task.setName(name);
  };

  const setTaskEstimate = (estimate: number) => {
    task.setEstimate(estimate);
  };

  const setTaskDependencies = ({
    task,
    dependencies,
  }: {
    task: Task;
    dependencies: Task[];
  }) => {
    task.setDependencies(dependencies);
  };

  return (
    <div
      id={`task-node-${task.id}`}
      className="task-node"
      style={{
        backgroundColor: task.color,
      }}
    >
      <div className="deleteButtonContainer">
        <DeleteButton onClick={() => task.delete()} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <EditableValue value={task.name} onChange={setTaskName} />
        <EditableValue
          label="Estimate"
          value={task.estimate}
          onChange={setTaskEstimate}
        />
      </div>
      <EditableValue
        label="Dependencies"
        value={{ task, dependencies: task.dependsOn }}
        onChange={setTaskDependencies}
        customRenderer={DependencyRenderer}
        customEditor={DependencyEditor}
      />
    </div>
  );
});

const DependencyRenderer = ({
  dependencies,
}: {
  task: Task;
  dependencies: Task[];
}) => {
  return dependencies.length.toString();
};

const DependencyEditor: FC<
  ICustomEditorProps<{ task: Task; dependencies: Task[] }>
> = ({ value: { task, dependencies }, error, onChange, onCancel }) => {
  const [localDependencies, setLocalDependencies] = useState(dependencies);
  const taskStore = useTaskStore();
  const allOtherTasks = taskStore.getTasks().filter((t) => t !== task);

  const addTaskToLocal = (task: Task) => {
    setLocalDependencies([...localDependencies, task]);
  };

  const removeTaskFromLocal = (task: Task) => {
    setLocalDependencies(localDependencies.filter((t) => t !== task));
  };
  const errorDisplay =
    error instanceof DependencyCycleError ? (
      <div style={{ color: "red" }}>{error.message}</div>
    ) : null;
  return (
    <form>
      {errorDisplay}
      <ul className="dependencies">
        {allOtherTasks.map((t) => (
          <li key={t.id}>
            <input
              type="checkbox"
              checked={localDependencies.includes(t)}
              onChange={(e) => {
                if (e.target.checked) {
                  addTaskToLocal(t);
                } else {
                  removeTaskFromLocal(t);
                }
              }}
            />
            {t.name}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onChange({ task, dependencies: localDependencies })}
      >
        Save
      </button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export const NewTaskNode: FC<{
  stopEditing: () => void;
}> = observer(({ stopEditing }) => {
  const [name, setName] = useState("New Task");
  const [estimate, setEstimate] = useState(1);
  const taskStore = useTaskStore();

  const saveTask = () => {
    taskStore.addTask({ name, estimate });
    stopEditing();
  };

  return (
    <form className="task-node">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        value={estimate}
        min={1}
        onChange={(e) => setEstimate(parseInt(e.target.value))}
      />
      <div
        className="controls"
        style={{ display: "flex", justifyContent: "space-evenly" }}
      >
        <button onClick={() => saveTask()}>Save</button>
        <button onClick={stopEditing}>Cancel</button>
      </div>
    </form>
  );
});
