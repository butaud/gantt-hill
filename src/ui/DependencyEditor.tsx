import { FC } from "react";
import { Task } from "../model/task";
import { observer } from "mobx-react-lite";
import { useTaskStore } from "../context/TaskStoreContext";

type IDependencyEditorProps = {
  task: Task;
};

export const DependencyEditor: FC<IDependencyEditorProps> = observer(
  ({ task }) => {
    const taskStore = useTaskStore();
    const allOtherTasks = taskStore.getTasks().filter((t) => t !== task);

    return (
      <div>
        <h3>Dependencies</h3>
        <ul>
          {allOtherTasks.map((t) => (
            <li key={t.id}>
              <input
                type="checkbox"
                checked={task.dependsOn.includes(t)}
                onChange={(e) => {
                  if (e.target.checked) {
                    task.addDependency(t);
                  } else {
                    task.removeDependency(t);
                  }
                }}
              />
              {t.name}
            </li>
          ))}
        </ul>
      </div>
    );
  },
);
