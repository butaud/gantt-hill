import { makeAutoObservable } from "mobx";
import { Task } from "./task";

export type Schedule = Record<number, number>;
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

  get allAssignedTasks() {
    return this.devs.flatMap((dev) => dev.tasks);
  }

  get tasksWithUnassignedDependencies() {
    const result = new Set<Task>();
    let lastResultSize = 0;
    const allAssignedTasks = this.allAssignedTasks;
    do {
      lastResultSize = result.size;
      for (const task of allAssignedTasks) {
        for (const dependency of task.dependsOn) {
          if (
            !allAssignedTasks.includes(dependency) ||
            result.has(dependency)
          ) {
            result.add(task);
          }
        }
      }
    } while (lastResultSize !== result.size);
    return result;
  }

  get schedule() {
    const result: Schedule = {};
    let now = 0;
    const tasksToSchedule =
      this.allAssignedTasks.length - this.tasksWithUnassignedDependencies.size;

    const isWorkingOnATask = (dev: Dev, now: number) =>
      dev.tasks.some(
        (task) =>
          result[task.id] <= now && now < result[task.id] + task.estimate,
      );

    const isTaskReadyToStart = (task: Task, now: number): boolean =>
      task.dependsOn.every(
        (dependency) => result[dependency.id] + dependency.estimate <= now,
      );

    while (Object.keys(result).length < tasksToSchedule) {
      for (const dev of this.devs) {
        if (!isWorkingOnATask(dev, now) && !dev.isOofDay(now)) {
          const nextTask = dev.tasks.find(
            (task) => result[task.id] === undefined,
          );
          if (nextTask !== undefined && isTaskReadyToStart(nextTask, now)) {
            result[nextTask.id] = now;
          }
        }
      }
      now++;
    }
    return result;
  }

  get scheduleEnd() {
    let maxTask: Task | undefined;
    for (const dev of this.devs) {
      for (const task of dev.tasks) {
        if (
          maxTask === undefined ||
          this.schedule[task.id] + task.estimate >
            this.schedule[maxTask.id] + maxTask.estimate
        ) {
          maxTask = task;
        }
      }
    }
    return maxTask === undefined
      ? 0
      : this.schedule[maxTask.id] + maxTask.estimate;
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
