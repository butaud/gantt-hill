import { DateTime } from "luxon";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useDevStore } from "../../context/DevStoreContext";
import { DevRow } from "../schedule/DevRow";
import { useStateStore } from "../../context/StateStoreContext";

import "./ScheduleSection.css";
import { usePlanStore } from "../../context/PlanStoreContext";

export const ScheduleSection: FC = observer(() => {
  const planStore = usePlanStore();
  const devStore = useDevStore();
  const stateStore = useStateStore();
  const devs = devStore.getDevs();
  const end = devStore.scheduleEnd;
  const tasksWithUnassignedDependencies =
    devStore.tasksWithUnassignedDependencies;

  return (
    <section className="schedule">
      <h2>Schedule</h2>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        {stateStore.isEditingOof ? (
          <button onClick={() => stateStore.stopEditingOof()}>
            Done Editing OOF
          </button>
        ) : (
          <button onClick={() => stateStore.startEditingOof()}>Edit OOF</button>
        )}
      </div>

      {tasksWithUnassignedDependencies.size > 0 && (
        <p>
          The following tasks have unassigned dependencies and cannot be
          scheduled:{" "}
          {Array.from(tasksWithUnassignedDependencies)
            .map((task) => task.name)
            .join(", ")}
        </p>
      )}
      <table className="schedule">
        <thead>
          <tr>
            <th>Dev</th>
            {[...Array(end).keys()].map((day) => {
              if (planStore.isWeekend(day)) {
                return null;
              }
              return (
                <DayHeader
                  key={day}
                  day={planStore.startDate.plus({ days: day })}
                />
              );
            })}
          </tr>
        </thead>
        <tbody>
          {devs.map((dev) => (
            <DevRow key={dev.id} dev={dev} />
          ))}
        </tbody>
      </table>
    </section>
  );
});

const DayHeader: FC<{ day: DateTime }> = ({ day }) => {
  return <th>{day.toFormat("EEE d")}</th>;
};
