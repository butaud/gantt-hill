import { makeAutoObservable } from "mobx";

export class StateStore {
  isEditingOof = false;

  constructor() {
    makeAutoObservable(this);
  }
}
