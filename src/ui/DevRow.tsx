import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Dev } from "../model/dev";
import { DayCell } from "./DayCell";
import { EditableValue } from "./EditableValue";
import { Task } from "../model/task";
import { useStateStore } from "../context/StateStoreContext";
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";

export const DevRow: FC<{
  dev: Dev;
}> = observer(({ dev }) => {
  const setDevName = (newName: string) => {
    dev.name = newName;
  };
  const stateStore = useStateStore();
  if (stateStore.isRearrangingTasks) {
    return <TaskRearrangeDevRow dev={dev} />;
  } else {
    return (
      <tr>
        <td>
          <EditableValue value={dev.name} onChange={setDevName} />
        </td>
        {dev.schedule.map((devDay, index) => (
          <DayCell key={index} dev={dev} day={index} devDay={devDay} />
        ))}
      </tr>
    );
  }
});

export const TaskRearrangeDevRow: FC<{ dev: Dev }> = observer(({ dev }) => {
  return (
    <Droppable droppableId={dev.id.toString()} direction="horizontal">
      {(provided) => (
        <tr
          style={{ width: "100%" }}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <td>{dev.name}</td>
          <td style={{ display: "flex" }}>
            {dev.tasks.map((task, index) => (
              <RearrangeableTask key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </td>
        </tr>
      )}
    </Droppable>
  );
});

import { Draggable } from "@hello-pangea/dnd";

export const RearrangeableTask: FC<{ task: Task; index: number }> = observer(
  ({ task, index }) => {
    return (
      <Draggable draggableId={task.id.toString()} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              flexGrow: task.estimate,
              border: "1px solid black",
            }}
          >
            {task.name}
          </div>
        )}
      </Draggable>
    );
  },
);
