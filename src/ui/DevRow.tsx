import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Dev } from "../model/dev";
import { DayCell } from "./DayCell";
import { EditableValue } from "./EditableValue";

export const DevRow: FC<{
  dev: Dev;
}> = observer(({ dev }) => {
  const setDevName = (newName: string) => {
    dev.name = newName;
  };
  return (
    <tr>
      <td>
        <EditableValue value={dev.name} onChange={setDevName} />
      </td>
      {dev.schedule.map((devDay, index) => (
        <DayCell key={index} dev={dev} day={index} devDay={devDay} />
      ))}
    </tr>
  );
});
