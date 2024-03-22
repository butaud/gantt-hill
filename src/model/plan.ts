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
}
