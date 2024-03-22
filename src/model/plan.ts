import { DateTime } from "luxon";
import { makeAutoObservable } from "mobx";

export class PlanStore {
  title = "";
  startDate = DateTime.now();
  excludeWeekends = true;

  constructor() {
    makeAutoObservable(this);
  }

  setTitle(title: string) {
    this.title = title;
  }

  setStartDate(date: DateTime) {
    this.startDate = date;
  }

  setExcludeWeekends(excludeWeekends: boolean) {
    this.excludeWeekends = excludeWeekends;
  }

  isWeekend(day: number) {
    if (!this.excludeWeekends) {
      return false;
    }
    return this.startDate.plus({ days: day }).weekday >= 6;
  }

  isMonday(day: number) {
    return this.startDate.plus({ days: day }).weekday === 1;
  }

  get serialized() {
    return {
      plan: {
        title: this.title,
        startDate: this.startDate.toISO(),
        excludeWeekends: this.excludeWeekends,
      },
    };
  }

  clear() {
    this.title = "";
    this.startDate = DateTime.now();
    this.excludeWeekends = true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deserialize(data: any) {
    this.title = data.plan.title;
    const parsedStartDate = DateTime.fromISO(data.plan.startDate);
    if (!parsedStartDate.isValid) {
      throw new Error(`Invalid date: ${data.plan.startDate}`);
    }
    this.startDate = parsedStartDate;
    this.excludeWeekends = data.plan.excludeWeekends;
  }
}
