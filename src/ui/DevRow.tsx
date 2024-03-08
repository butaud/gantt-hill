import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Dev, Schedule } from "../model/dev";
import { DayCell } from "./DayCell";

export const DevRow: FC<{ dev: Dev; schedule: Schedule; end: number }> =
  observer(({ dev, schedule, end }) => {
    return (
      <tr>
        <td>{dev.name}</td>
        {[...Array(end).keys()].map((day) => (
          <DayCell key={day} day={day} dev={dev} schedule={schedule} />
        ))}
      </tr>
    );
  });
