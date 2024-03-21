import { DateTime } from "luxon";
import { FC } from "react";
import { TaskSection } from "./TaskSection";
import { ScheduleSection } from "./ScheduleSection";
import { EditableValue } from "./EditableValue";
import { DragDropContext, OnDragEndResponder } from "@hello-pangea/dnd";
import { useDevStore } from "../context/DevStoreContext";
import { useTaskStore } from "../context/TaskStoreContext";

import "./PlanEditor.css";

type IPlanEditorProps = {
  name: string;
  start: DateTime;
  setPlanName: (name: string) => void;
  setPlanStart: (start: DateTime) => void;
};

export const PlanEditor: FC<IPlanEditorProps> = ({
  name,
  start,
  setPlanName,
  setPlanStart,
}) => {
  const devStore = useDevStore();
  const taskStore = useTaskStore();

  const onDragEnd: OnDragEndResponder = (event) => {
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

  return (
    <>
      <section className="planMetadata">
        <p>
          <EditableValue value={name} onChange={setPlanName} />
        </p>
        <p>
          <EditableValue value={start} onChange={setPlanStart} />
        </p>
      </section>
      <DragDropContext onDragEnd={onDragEnd}>
        <section className="tasks">
          <TaskSection />
        </section>
        <section className="schedule">
          <ScheduleSection start={start} />
        </section>
      </DragDropContext>
    </>
  );
};
