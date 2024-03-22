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

  get serialized() {
    return {};
  }

  clear() {
    this.isEditingOof = false;
    this.isRearrangingTasks = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deserialize(_: unknown) {
    // no-op
  }
}
