import { observer } from "mobx-react-lite";
import { CSSProperties, FC } from "react";
import { Dev, DevDay } from "../model/dev";
import { Task } from "../model/task";

import "./DayCell.css";
import { useStateStore } from "../context/StateStoreContext";

export const DayCell: FC<{
  dev: Dev;
  day: number;
  devDay: DevDay;
}> = observer(({ dev, day, devDay }) => {
  const stateStore = useStateStore();
  const isEditingOof = stateStore.isEditingOof;
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
  const maybeStyleAttributes: { style?: CSSProperties } = {};
  if (devDay instanceof Task) {
    maybeStyleAttributes["style"] = {
      backgroundColor: devDay.color,
    };
  }
  return (
    <td className={cellClass} {...maybeStyleAttributes}>
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
