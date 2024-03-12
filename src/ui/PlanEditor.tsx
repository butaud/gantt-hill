import { DateTime } from "luxon";
import { FC } from "react";
import { TaskSection } from "./TaskSection";
import { ScheduleSection } from "./ScheduleSection";
import { EditableValue } from "./EditableValue";

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
  return (
    <div>
      <p>
        <EditableValue value={name} onChange={setPlanName} />
      </p>
      <p>
        <EditableValue value={start} onChange={setPlanStart} />
      </p>
      <TaskSection />
      <ScheduleSection start={start} />
    </div>
  );
};
