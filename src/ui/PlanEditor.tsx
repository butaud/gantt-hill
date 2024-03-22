import { FC } from "react";
import { TaskSection } from "./TaskSection";
import { ScheduleSection } from "./ScheduleSection";
import { EditableValue } from "./EditableValue";

import "./PlanEditor.css";
import { observer } from "mobx-react-lite";
import { usePlanStore } from "../context/PlanStoreContext";
import { AssignSection } from "./AssignSection";

export const PlanEditor: FC = observer(() => {
  const planStore = usePlanStore();

  return (
    <>
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
      <section className="tasks">
        <TaskSection />
      </section>
      <section className="assign">
        <AssignSection />
      </section>
      <section className="schedule">
        <ScheduleSection />
      </section>
    </>
  );
});
