import { makeAutoObservable } from "mobx";

export class StateStore {
  isEditingOof = false;
  isRearrangingTasks = false;

  constructor() {
    makeAutoObservable(this);
  }

  startEditingOof() {
    this.isEditingOof = true;
  }

  stopEditingOof() {
    this.isEditingOof = false;
  }

  startRearrangingTasks() {
    this.isRearrangingTasks = true;
  }

  stopRearrangingTasks() {
    this.isRearrangingTasks = false;
  }
}
