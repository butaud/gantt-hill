import { FC } from "react";
import { TaskSection } from "./TaskSection";
import { ScheduleSection } from "./ScheduleSection";

import "./PlanEditor.css";
import { AssignSection } from "./AssignSection";
import { MetadataSection } from "./MetadataSection";

export const PlanEditor: FC = () => {
  return (
    <>
      <MetadataSection />
      <TaskSection />
      <AssignSection />
      <ScheduleSection />
    </>
  );
};
