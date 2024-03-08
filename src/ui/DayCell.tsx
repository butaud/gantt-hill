import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Dev, Schedule } from "../model/dev";

export const DayCell: FC<{ dev: Dev; day: number; schedule: Schedule }> =
  observer(({ dev, day, schedule }) => {
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
  });
