import { makeAutoObservable } from "mobx";

export class StateStore {
  isEditingOof = false;

  constructor() {
    makeAutoObservable(this);
  }

  startEditingOof() {
    this.isEditingOof = true;
  }

  stopEditingOof() {
    this.isEditingOof = false;
  }

  get serialized() {
    return {};
  }

  clear() {
    this.isEditingOof = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deserialize(_: unknown) {
    // no-op
  }
}
