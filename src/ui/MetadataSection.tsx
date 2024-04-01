import { observer } from "mobx-react-lite";
import { FC } from "react";
import { usePlanStore } from "../context/PlanStoreContext";
import { EditableValue } from "./EditableValue";

export const MetadataSection: FC = observer(() => {
  const planStore = usePlanStore();
  return (
    <section className="planMetadata">
      <p>
        <EditableValue
          value={planStore.title}
          onChange={(newName) => planStore.setTitle(newName)}
        />
      </p>
      <p>
        <EditableValue
          value={planStore.startDate}
          onChange={(newDate) => planStore.setStartDate(newDate)}
        />
      </p>
      <p>
        Exclude weekends:{" "}
        <EditableValue
          value={planStore.excludeWeekends}
          onChange={(newExcludeWeekends) =>
            planStore.setExcludeWeekends(newExcludeWeekends)
          }
        />
      </p>
    </section>
  );
});
