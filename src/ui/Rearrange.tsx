import { observer } from "mobx-react-lite";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Dev } from "../model/dev";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Task } from "../model/task";
import { useDevStore } from "../context/DevStoreContext";

import "./Rearrange.css";

export const TaskRearrangeDevRow: FC<{ dev: Dev }> = observer(({ dev }) => {
  const ref = useRef<HTMLTableRowElement>(null);
  const [rowSize, setRowSize] = useState(0);
  useEffect(() => {
    if (ref.current) {
      setRowSize(ref.current.clientWidth);
    }
  }, []);
  return (
    <tr ref={ref}>
      <td className="devName">{dev.name}</td>
      <Droppable droppableId={dev.id.toString()} direction="horizontal">
        {(provided) => (
          <td
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="dropZone rearrangeCell"
          >
            {dev.tasks.map((task, index) => (
              <RearrangeableTaskItem
                key={task.id}
                task={task}
                index={index}
                rowSize={rowSize}
              />
            ))}
            {provided.placeholder}
          </td>
        )}
      </Droppable>
    </tr>
  );
});

export const TaskRearrangeUnassignedTasks: FC<{ tasks: Task[] }> = observer(
  ({ tasks }) => {
    return (
      <Droppable droppableId="unassigned" direction="vertical">
        {(provided) => (
          <ul
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="dropZone"
          >
            {tasks.map((task, index) => (
              <RearrangeableTaskItem key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    );
  },
);

export const RearrangeableTaskItem: FC<{
  task: Task;
  index: number;
  rowSize?: number;
}> = observer(({ task, index, rowSize }) => {
  const devStore = useDevStore();

  const myWidth = useMemo(() => {
    if (!rowSize) {
      return 100;
    }
    return (task.estimate / devStore.highestTaskTotal) * rowSize * 0.9;
  }, [rowSize, task.estimate, devStore.highestTaskTotal]);
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <div
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
        </div>
      )}
    </Draggable>
  );
});
