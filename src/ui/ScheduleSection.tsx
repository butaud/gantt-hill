import { DateTime } from "luxon";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useDevStore } from "../context/DevStoreContext";
import { DevRow } from "./DevRow";
import { useStateStore } from "../context/StateStoreContext";

export const ScheduleSection: FC<{ start: DateTime }> = observer(
  ({ start }) => {
    const devStore = useDevStore();
    const stateStore = useStateStore();
    const devs = devStore.getDevs();
    const end = devStore.scheduleEnd;
    const countOfTasksWithUnassignedDependencies =
      devStore.tasksWithUnassignedDependencies.size;
    return (
      <div>
        <h2>Schedule</h2>
        {stateStore.isEditingOof ? (
          <button onClick={() => (stateStore.isEditingOof = false)}>
            Done Editing OOF
          </button>
        ) : (
          <button onClick={() => (stateStore.isEditingOof = true)}>
            Edit OOF
          </button>
        )}

        {countOfTasksWithUnassignedDependencies > 0 && (
          <p>
            Warning: {countOfTasksWithUnassignedDependencies}{" "}
            {countOfTasksWithUnassignedDependencies === 1
              ? "task has "
              : "tasks have "}
            unassigned dependencies.
          </p>
        )}
        <table>
          <thead>
            <tr>
              <th></th>
              {[...Array(end).keys()].map((day) => (
                <DayHeader key={day} day={start.plus({ days: day })} />
              ))}
            </tr>
            {devs.map((dev) => (
              <DevRow key={dev.id} dev={dev} />
            ))}
          </thead>
        </table>
      </div>
    );
  },
);

const DayHeader: FC<{ day: DateTime }> = ({ day }) => {
  return <th>{day.toFormat("EEE d")}</th>;
};
