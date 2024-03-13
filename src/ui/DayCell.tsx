import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Dev, DevDay } from "../model/dev";
import { Task } from "../model/task";

export const DayCell: FC<{
  dev: Dev;
  day: number;
  devDay: DevDay;
  isEditingOof: boolean;
}> = observer(({ dev, day, devDay, isEditingOof }) => {
  const isOof = dev.isOofDay(day);
  return (
    <td style={{ backgroundColor: isOof ? "lightgray" : "white" }}>
      {isEditingOof ? (
        <OofEditor dev={dev} day={day} />
      ) : devDay instanceof Task ? (
        devDay.name
      ) : (
        devDay
      )}
    </td>
  );
});

const OofEditor: FC<{ dev: Dev; day: number }> = observer(({ dev, day }) => {
  const isOof = dev.isOofDay(day);
  const checkboxChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      dev.addOofDay(day);
    } else {
      dev.removeOofDay(day);
    }
  };
  return <input type="checkbox" checked={isOof} onChange={checkboxChanged} />;
});
