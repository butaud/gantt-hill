import { makeAutoObservable } from "mobx";
import { DevStore } from "./dev";

export class TaskStore {
  tasks: Task[] = [];
  devStore: DevStore;
  constructor(devStore: DevStore) {
    makeAutoObservable(this, {
      devStore: false,
    });
    this.devStore = devStore;
  }
  getTasks() {
    return this.tasks;
  }
  addTask(draft: TaskDraft) {
    const id = this.tasks.length + 1;
    const task = new Task(this, this.devStore, id, draft.name, draft.estimate);
    this.tasks.push(task);
    return task;
  }
  deleteTask(task: Task) {
    this.tasks = this.tasks.filter((t) => t !== task);
  }
}

export type TaskDraft = {
  name: string;
  estimate: number;
};

export class Task {
  id: number;
  name: string;
  estimate: number;
  dependsOn: Task[];
  store: TaskStore;
  devStore: DevStore;
  constructor(
    store: TaskStore,
    devStore: DevStore,
    id: number,
    name: string,
    estimate: number,
  ) {
    makeAutoObservable(this, {
      id: false,
      store: false,
    });
    this.id = id;
    this.name = name;
    this.estimate = estimate;
    this.dependsOn = [];
    this.store = store;
    this.devStore = devStore;
  }

  setName(name: string) {
    this.name = name;
  }

  setEstimate(estimate: number) {
    this.estimate = estimate;
  }

  private proposedDependenciesCauseACycle(proposedDependencies: Task[]) {
    const toVisit = [...proposedDependencies];
    const visited = new Set<Task>();
    while (toVisit.length > 0) {
      const task = toVisit.pop()!;
      if (task.dependsOn.some((t) => t === this)) {
        return true;
      }
      visited.add(task);
      toVisit.push(
        ...task.dependsOn.filter(
          (t) => !visited.has(t) && !toVisit.includes(t),
        ),
      );
    }
    return false;
  }

  addDependency(task: Task) {
    if (this.proposedDependenciesCauseACycle([...this.dependsOn, task])) {
      throw new DependencyCycleError();
    }
    this.dependsOn.push(task);
  }

  removeDependency(task: Task) {
    this.dependsOn = this.dependsOn.filter((t) => t !== task);
  }

  setDependencies(tasks: Task[]) {
    if (this.proposedDependenciesCauseACycle(tasks)) {
      throw new DependencyCycleError();
    }
    this.dependsOn = tasks;
  }

  delete() {
    this.store.deleteTask(this);
  }

  get isAssigned() {
    return this.devStore.getDevs().some((dev) => dev.tasks.includes(this));
  }
}

export class DependencyCycleError extends Error {
  constructor() {
    super("Dependency would cause a cycle");
  }
}
