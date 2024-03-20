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
}
