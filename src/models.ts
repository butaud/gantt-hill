import { DateTime } from "luxon";

export type Draft<T> = Omit<T, "id">;

export type ID = number;
export type Task = {
  id: ID;
  name: string;
  estimate: number;
  dependsOn: ReadonlyArray<Task>;
};

export type Oofage = {
  startInclusive: number;
  endExclusive: number;
};

export type Dev = {
  id: ID;
  name: string;
  oofages: ReadonlyArray<Oofage>;
  tasks: ReadonlyArray<Task>;
};

export type Plan = {
  id: ID;
  start: DateTime;
  name: string;
  tasks: ReadonlyArray<Task>;
  devs: ReadonlyArray<Dev>;
};

export type Schedule = Record<ID, number>;
