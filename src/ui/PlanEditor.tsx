import { DateTime } from "luxon";
import { FC, useState } from "react";
import { TaskSection } from "./TaskSection";
import { ScheduleSection } from "./ScheduleSection";

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
  const [editing, setEditing] = useState(false);
  return (
    <div>
      {editing ? (
        <>
          <input
            type="text"
            value={name}
            onChange={(e) => setPlanName(e.target.value)}
          />
          <input
            type="date"
            value={start.toISODate() ?? undefined}
            onChange={(e) => setPlanStart(DateTime.fromISO(e.target.value))}
          />
          <button onClick={() => setEditing(false)}>Stop Editing</button>
        </>
      ) : (
        <>
          <h2>{name}</h2>
          <p>Starts: {start.toLocaleString()}</p>
          <button onClick={() => setEditing(true)}>Edit</button>
        </>
      )}
      <TaskSection />
      <ScheduleSection start={start} />
    </div>
  );
};
