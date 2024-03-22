import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Dev } from "../model/dev";
import { DayCell } from "./DayCell";
import { EditableValue } from "./EditableValue";
import { useStateStore } from "../context/StateStoreContext";
import { TaskRearrangeDevRow } from "./Rearrange";

import "./DevRow.css";
import { usePlanStore } from "../context/PlanStoreContext";
import { DeleteButton } from "./DeleteButton";

export const DevRow: FC<{
  dev: Dev;
}> = observer(({ dev }) => {
  const setDevName = (newName: string) => {
    dev.name = newName;
  };
  const planStore = usePlanStore();
  const stateStore = useStateStore();
  if (stateStore.isRearrangingTasks) {
    return <TaskRearrangeDevRow dev={dev} />;
  } else {
    return (
      <tr>
        <td className="devName">
          <DeleteButton onClick={() => dev.delete()} />
          <EditableValue value={dev.name} onChange={setDevName} />
        </td>
        {dev.schedule.map((devDay, index) => {
          if (planStore.isWeekend(index)) {
            return null;
          }
          return <DayCell key={index} dev={dev} day={index} devDay={devDay} />;
        })}
      </tr>
    );
  }
});
