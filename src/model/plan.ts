import { DateTime } from "luxon";
import { makeAutoObservable } from "mobx";

export class PlanStore {
  title = "";
  startDate = DateTime.now();

  constructor() {
    makeAutoObservable(this);
  }

  setTitle(title: string) {
    this.title = title;
  }

  setStartDate(date: DateTime) {
    this.startDate = date;
  }

  isWeekend(day: number) {
    return this.startDate.plus({ days: day }).weekday >= 6;
  }

  isMonday(day: number) {
    return this.startDate.plus({ days: day }).weekday === 1;
  }
}
