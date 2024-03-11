import { DateTime } from "luxon";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useDevStore } from "../context/DevStoreContext";
import { DevRow } from "./DevRow";

export const ScheduleSection: FC<{ start: DateTime }> = observer(
  ({ start }) => {
    const devStore = useDevStore();
    const devs = devStore.getDevs();
    const planSchedule = devStore.schedule;
    const end = devStore.scheduleEnd;
    const countOfTasksWithUnassignedDependencies =
      devStore.tasksWithUnassignedDependencies.size;
    return (
      <div>
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
              <DevRow
                key={dev.id}
                dev={dev}
                schedule={planSchedule}
                end={end}
              />
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
