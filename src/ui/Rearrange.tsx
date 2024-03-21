import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Dev } from "../model/dev";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Task } from "../model/task";

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
          {dev.tasks.map((task, index) => (
            <RearrangeableTaskCell key={task.id} task={task} index={index} />
          ))}
          {provided.placeholder}
        </tr>
      )}
    </Droppable>
  );
});

export const TaskRearrangeUnassignedTasks: FC<{ tasks: Task[] }> = observer(
  ({ tasks }) => {
    return (
      <Droppable droppableId="unassigned" direction="vertical">
        {(provided) => (
          <ul ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => (
              <RearrangeableTaskListItem
                key={task.id}
                task={task}
                index={index}
              />
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    );
  },
);

const RearrangeableTaskCell: FC<{ task: Task; index: number }> = observer(
  ({ task, index }) => {
    return (
      <Draggable draggableId={task.id.toString()} index={index}>
        {(provided) => (
          <td
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
          </td>
        )}
      </Draggable>
    );
  },
);

const RearrangeableTaskListItem: FC<{ task: Task; index: number }> = observer(
  ({ task, index }) => {
    return (
      <Draggable draggableId={task.id.toString()} index={index}>
        {(provided) => (
          <li
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
          </li>
        )}
      </Draggable>
    );
  },
);
