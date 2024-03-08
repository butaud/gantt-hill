import { DateTime } from "luxon";
import { Schedule } from "./model/dev";
import { FC, useState } from "react";
import { TaskNode } from "./TaskNode";
import { observer } from "mobx-react-lite";
import { useTaskStore } from "./context/TaskStoreContext";
import { useDevStore } from "./context/DevStoreContext";
import { Dev } from "./model/dev";

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

const TaskSection: FC = observer(() => {
  const taskStore = useTaskStore();
  const tasks = taskStore.getTasks();

  const assignedTasks = tasks.filter((task) => task.isAssigned);
  const unassignedTasks = tasks.filter((task) => !task.isAssigned);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h3>Unassigned Tasks</h3>
        <div>
          {unassignedTasks.map((task) => (
            <TaskNode key={task.id} task={task} />
          ))}
        </div>
      </div>
      <div>
        <h3>Assigned Tasks</h3>
        <ul>
          {assignedTasks.map((task) => (
            <TaskNode key={task.id} task={task} />
          ))}
        </ul>
      </div>
    </div>
  );
});

const ScheduleSection: FC<{ start: DateTime }> = observer(({ start }) => {
  const devStore = useDevStore();
  const devs = devStore.getDevs();
  const planSchedule = devStore.schedule;
  const end = devStore.scheduleEnd;
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          {[...Array(end).keys()].map((day) => (
            <DayHeader key={day} day={start.plus({ days: day })} />
          ))}
        </tr>
        {devs.map((dev) => (
          <DevRow key={dev.id} dev={dev} schedule={planSchedule} end={end} />
        ))}
      </thead>
    </table>
  );
});

const DayHeader: FC<{ day: DateTime }> = ({ day }) => {
  return <th>{day.toFormat("EEE d")}</th>;
};

const DevRow: FC<{ dev: Dev; schedule: Schedule; end: number }> = observer(
  ({ dev, schedule, end }) => {
    return (
      <tr>
        <td>{dev.name}</td>
        {[...Array(end).keys()].map((day) => (
          <DevCell key={day} day={day} dev={dev} schedule={schedule} />
        ))}
      </tr>
    );
  },
);

const DevCell: FC<{ dev: Dev; day: number; schedule: Schedule }> = observer(
  ({ dev, day, schedule }) => {
    const isOof = dev.isOofDay(day);
    const task = dev.tasks.find(
      (task) =>
        schedule[task.id] <= day && schedule[task.id] + task.estimate > day,
    );
    return (
      <td style={{ backgroundColor: isOof ? "lightgray" : "white" }}>
        {task ? task.name : null}
      </td>
    );
  },
);
