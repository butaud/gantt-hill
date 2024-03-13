import { makeAutoObservable } from "mobx";
import { Task } from "./task";

const MAX_SCHEDULE_DAYS = 1000;

export type DevDay = Task | "OOF" | "BLOCKED" | "FREE";
export type Schedule = DevDay[][];
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
    const result: Schedule = this.devs.map(() => []);
    let now = 0;
    const tasksToSchedule = this.allAssignedTasks.filter(
      (task) => !this.tasksWithUnassignedDependencies.has(task),
    );
    const scheduledTasks = new Set<Task>();

    const isScheduledTaskCompleted = (task: Task, now: number) => {
      const daysWorked =
        result
          .find((devTasks) => devTasks.includes(task))
          ?.slice(0, now)
          ?.filter((t) => t === task).length ?? 0;
      return daysWorked >= task.estimate;
    };

    let allTasksAreDone = true;
    do {
      allTasksAreDone = true;
      this.devs.forEach((dev, devIndex) => {
        const filteredTasks = dev.tasks.filter((task) =>
          tasksToSchedule.includes(task),
        );
        const currentTask = filteredTasks.find(
          (task) =>
            scheduledTasks.has(task) && !isScheduledTaskCompleted(task, now),
        );
        const nextTask = filteredTasks.find(
          (task) => !scheduledTasks.has(task),
        );

        if (currentTask || nextTask) {
          allTasksAreDone = false;
        }
        if (dev.isOofDay(now)) {
          result[devIndex].push("OOF");
          return;
        }

        if (currentTask) {
          result[devIndex].push(currentTask);
          return;
        }
        if (!nextTask) {
          result[devIndex].push("FREE");
          return;
        }

        if (
          nextTask.dependsOn.some(
            (dependency) => !isScheduledTaskCompleted(dependency, now),
          )
        ) {
          result[devIndex].push("BLOCKED");
          return;
        }

        scheduledTasks.add(nextTask);
        result[devIndex].push(nextTask);
      });
      now++;
    } while (!allTasksAreDone && now < MAX_SCHEDULE_DAYS);

    return result;
  }

  get scheduleEnd() {
    return this.schedule[0]?.length ?? 0;
  }

  getScheduleForDev(dev: Dev) {
    return this.schedule[this.devs.indexOf(dev)];
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

  get schedule() {
    return this.store.getScheduleForDev(this);
  }
}
