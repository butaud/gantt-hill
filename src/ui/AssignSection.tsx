import { FC, useMemo, useRef, useState } from "react";
import { useTaskStore } from "../context/TaskStoreContext";
import { useDevStore } from "../context/DevStoreContext";
import { observer } from "mobx-react-lite";
import { Task } from "../model/task";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";

import "./AssignSection.css";
import { useDimensions } from "../hooks/dimensions";
import { EditableValue } from "./EditableValue";
import { DeleteButton } from "./DeleteButton";

export const AssignSection: FC = observer(() => {
  const taskStore = useTaskStore();
  const devStore = useDevStore();
  const divRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(divRef);
  const taskRowWidth = width * 0.8;

  const unassignedTasks = taskStore
    .getTasks()
    .filter((task) => !task.isAssigned);

  const [isDragging, setIsDragging] = useState(false);

  const onDragEnd: OnDragEndResponder = (event) => {
    setIsDragging(false);
    if (event.destination && event.source) {
      const task = taskStore.getTask(parseInt(event.draggableId));
      if (task) {
        const getDev = (droppableId: string) => {
          if (droppableId === "unassigned") {
            return undefined;
          }
          const dev = devStore.getDev(parseInt(droppableId));
          if (!dev) {
            throw new Error(`No dev with id ${droppableId}`);
          }
          return dev;
        };
        const sourceDev = getDev(event.source.droppableId);
        const destinationDev = getDev(event.destination.droppableId);
        // these steps handle all the cases
        if (sourceDev) {
          sourceDev.removeTask(task);
        }

        if (destinationDev) {
          destinationDev.addTask(task, event.destination.index);
        } else {
          taskStore.moveExistingTask(task, event.destination.index);
        }
      }
    }
  };

  const onDragStart = () => {
    setIsDragging(true);
  };
  return (
    <>
      <h2>Assign</h2>
      <div className="assignment-rows" ref={divRef}>
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          <div className="assignment-row unassigned">
            <h3>Unassigned</h3>
            <TaskRearrangeRow
              tasks={unassignedTasks}
              rowWidth={taskRowWidth}
              dragging={isDragging}
            />
          </div>
          {devStore.getDevs().map((dev) => (
            <div key={dev.id} className="assignment-row">
              <h3>
                <DeleteButton onClick={() => dev.delete()} />
                <EditableValue
                  value={dev.name}
                  onChange={(newName: string) => dev.setName(newName)}
                />
              </h3>
              <TaskRearrangeRow
                tasks={dev.tasks}
                devId={dev.id}
                rowWidth={taskRowWidth}
                dragging={isDragging}
              />
            </div>
          ))}
        </DragDropContext>
        <AddDevRow />
      </div>
    </>
  );
});

export const TaskRearrangeRow: FC<{
  tasks: Task[];
  devId?: number;
  rowWidth: number;
  dragging: boolean;
}> = observer(({ tasks, devId, rowWidth, dragging }) => {
  const classNames = ["dropZone"];
  if (dragging) {
    classNames.push("dragging");
  }
  if (!devId) {
    classNames.push("unassigned");
  }
  return (
    <div className={classNames.join(" ")}>
      <Droppable
        droppableId={devId?.toString() ?? "unassigned"}
        direction="horizontal"
      >
        {(provided) => (
          <ul ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => (
              <RearrangeableTaskItem
                key={task.id}
                task={task}
                index={index}
                rowSize={rowWidth}
              />
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </div>
  );
});

const RearrangeableTaskItem: FC<{
  task: Task;
  index: number;
  rowSize: number;
}> = observer(({ task, index, rowSize }) => {
  const devStore = useDevStore();
  const taskStore = useTaskStore();

  const myWidth = useMemo(() => {
    const highestRowTotal = Math.max(
      devStore.highestTaskTotal,
      taskStore.unassignedTotal,
    );
    return (task.estimate / highestRowTotal) * rowSize * 0.9;
  }, [
    rowSize,
    task.estimate,
    devStore.highestTaskTotal,
    taskStore.unassignedTotal,
  ]);
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            width: `${myWidth}px`,
            border: "1px solid black",
            backgroundColor: task.color,
          }}
          title={task.name}
        >
          {task.name}
        </li>
      )}
    </Draggable>
  );
});

const AddDevRow: FC = observer(() => {
  const devStore = useDevStore();
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);

  const addDev = () => {
    devStore.addDev({ name });
    setName("");
    setAdding(false);
  };

  const cancel = () => {
    setName("");
    setAdding(false);
  };

  return (
    <div className="add-row">
      {!adding && <button onClick={() => setAdding(true)}>Add Dev</button>}
      {adding && (
        <>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={addDev}>Save</button>
          <button onClick={cancel}>Cancel</button>
        </>
      )}
    </div>
  );
});
