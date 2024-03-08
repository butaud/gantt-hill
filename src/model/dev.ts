import { makeAutoObservable } from "mobx";
import { Task } from "./task";

export class DevStore {
  private devs: Dev[] = [];
  constructor() {
    makeAutoObservable(this);
  }
  getDevs() {
    return this.devs;
  }
  addDev(dev: DevDraft) {
    const id = this.devs.length + 1;
    const newDev = new Dev(this, id, dev.name);
    this.devs.push(newDev);
    return newDev;
  }
  deleteDev(dev: Dev) {
    this.devs = this.devs.filter((d) => d !== dev);
  }
}

export type DevDraft = {
  name: string;
};

export class Dev {
  id: number;
  name: string;
  oofDays = new Set<number>();
  tasks: Task[] = [];
  store: DevStore;

  constructor(store: DevStore, id: number, name: string) {
    makeAutoObservable(this, {
      id: false,
      store: false,
    });
    this.store = store;
    this.id = id;
    this.name = name;
  }

  delete() {
    this.store.deleteDev(this);
  }

  setName(name: string) {
    this.name = name;
  }

  addTask(task: Task) {
    this.tasks.push(task);
  }

  removeTask(task: Task) {
    this.tasks = this.tasks.filter((t) => t !== task);
  }

  reorderTask(task: Task, index: number) {
    this.tasks = this.tasks.filter((t) => t !== task);
    this.tasks.splice(index, 0, task);
  }

  addOofDay(day: number) {
    this.oofDays.add(day);
  }

  removeOofDay(day: number) {
    this.oofDays.delete(day);
  }

  isOofDay(day: number) {
    return this.oofDays.has(day);
  }
}
