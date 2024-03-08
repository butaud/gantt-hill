import { DateTime } from "luxon";
import { Plan, Task, Dev, Schedule } from "./models";
import { FC } from "react";
import { getScheduleEnd, schedule } from "./schedule";

type IPlanEditorProps = {
  plan: Readonly<Plan>;
  setPlanName: (name: string) => void;
  setPlanStart: (start: DateTime) => void;
  setPlanTasks: (tasks: ReadonlyArray<Task>) => void;
  setPlanDevs: (devs: ReadonlyArray<Dev>) => void;
};

export const PlanEditor: FC<IPlanEditorProps> = ({
  plan,
  setPlanName,
  setPlanStart,
  setPlanTasks,
  setPlanDevs,
}) => {
  const planSchedule = schedule(plan.devs);
  const end = getScheduleEnd(plan.tasks, planSchedule);
  return (
    <div>
      <h2>{plan.name}</h2>
      <table>
        <thead>
          <tr>
            <tr></tr>
            {[...Array(end).keys()].map((day) => (
              <DayHeader key={day} day={plan.start.plus({ days: day })} />
            ))}
          </tr>
          {plan.devs.map((dev) => (
            <DevRow key={dev.id} dev={dev} schedule={planSchedule} end={end} />
          ))}
        </thead>
      </table>
    </div>
  );
};

const DayHeader: FC<{ day: DateTime }> = ({ day }) => {
  return <th>{day.toFormat("EEE d")}</th>;
};

const DevRow: FC<{ dev: Dev; schedule: Schedule; end: number }> = ({
  dev,
  schedule,
  end,
}) => {
  return (
    <tr>
      <td>{dev.name}</td>
      {[...Array(end).keys()].map((day) => (
        <DevCell key={day} day={day} dev={dev} schedule={schedule} />
      ))}
    </tr>
  );
};

const DevCell: FC<{ dev: Dev; day: number; schedule: Schedule }> = ({
  dev,
  day,
  schedule,
}) => {
  const isOof = dev.oofages.some(
    (oof) => day >= oof.startInclusive && day < oof.endExclusive,
  );
  const task = dev.tasks.find(
    (task) =>
      schedule[task.id] <= day && schedule[task.id] + task.estimate > day,
  );
  return (
    <td style={{ backgroundColor: isOof ? "lightgray" : "white" }}>
      {task ? task.name : null}
    </td>
  );
};
