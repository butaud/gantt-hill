import { DateTime } from "luxon";
import { Dev, Plan, Task } from "./models";

const task1: Task = {
  id: 1,
  name: "Task 1",
  estimate: 3,
  dependsOn: [],
};

const task2: Task = {
  id: 2,
  name: "Task 2",
  estimate: 2,
  dependsOn: [task1],
};

const dev1: Dev = {
  id: 1,
  name: "Dev 1",
  oofages: [],
  tasks: [task1],
};

const dev2: Dev = {
  id: 2,
  name: "Dev 2",
  oofages: [
    {
      startInclusive: 0,
      endExclusive: 7,
    },
  ],
  tasks: [task2],
};

export const testPlan: Plan = {
  id: 1,
  name: "Test Plan",
  start: DateTime.now(),
  tasks: [task1, task2],
  devs: [dev1, dev2],
};
