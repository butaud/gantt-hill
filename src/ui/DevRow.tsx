import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Dev } from "../model/dev";
import { DayCell } from "./DayCell";

import "./DevRow.css";
import { usePlanStore } from "../context/PlanStoreContext";

export const DevRow: FC<{
  dev: Dev;
}> = observer(({ dev }) => {
  const planStore = usePlanStore();
  return (
    <tr>
      <td className="devName">{dev.name}</td>
      {dev.schedule.map((devDay, index) => {
        if (planStore.isWeekend(index)) {
          return null;
        }
        return <DayCell key={index} dev={dev} day={index} devDay={devDay} />;
      })}
    </tr>
  );
});
