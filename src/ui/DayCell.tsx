import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Dev, DevDay } from "../model/dev";
import { Task } from "../model/task";

import "./DayCell.css";

export const DayCell: FC<{
  dev: Dev;
  day: number;
  devDay: DevDay;
  isEditingOof: boolean;
}> = observer(({ dev, day, devDay, isEditingOof }) => {
  const cellClass = (() => {
    if (devDay instanceof Task) {
      return "task";
    }
    switch (devDay) {
      case "OOF":
        return "oof";
      case "BLOCKED":
        return "blocked";
      case "FREE":
        return "free";
    }
  })();
  return (
    <td className={cellClass}>
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
