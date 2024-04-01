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
  moveExistingTask(task: Task, toIndex: number) {
    const fromIndex = this.tasks.indexOf(task);
    this.tasks.splice(fromIndex, 1);
    this.tasks.splice(toIndex, 0, task);
  }
  deleteTask(task: Task) {
    // first remove the task from any dependencies
    for (const otherTask of this.tasks) {
      otherTask.removeDependency(task);
    }

    // then, remove the task from any devs
    for (const dev of this.devStore.getDevs()) {
      dev.removeTask(task);
    }

    // finally, remove the task from the task store
    this.tasks = this.tasks.filter((t) => t !== task);
  }
  getTask(id: number) {
    return this.tasks.find((task) => task.id === id);
  }

  get unassignedTotal() {
    return this.tasks
      .filter((task) => !task.isAssigned)
      .reduce((acc, task) => acc + task.estimate, 0);
  }

  get serialized() {
    return {
      tasks: this.tasks.map((task) => task.serialized),
    };
  }

  clear() {
    this.tasks = [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deserialize(data: any) {
    for (const taskData of data.tasks) {
      const task = new Task(
        this,
        this.devStore,
        taskData.id,
        taskData.name,
        taskData.estimate,
      );
      this.tasks.push(task);
    }

    for (const taskData of data.tasks) {
      const task = this.getTask(taskData.id);
      if (!task) {
        throw new Error(`Task ${taskData.id} not found`);
      }
      task.setDependencies(
        taskData.dependsOn.map((id: number) => this.getTask(id)),
      );
    }
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

  get color() {
    let hash = 0;
    for (let i = 0; i < this.name.length; i++) {
      hash = this.name.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
      hash = hash * 17;
    }

    hash = Math.abs(hash);

    const transformedHash = Math.sin(hash) * 10000;
    hash = Math.abs(Math.floor(transformedHash * transformedHash));

    const hue = hash % 360;
    const saturation = 90;
    const lightness = 50;
    const alpha = 0.15;

    return `hsl(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
  }

  get isAssigned() {
    return this.devStore.getDevs().some((dev) => dev.tasks.includes(this));
  }

  get serialized() {
    return {
      id: this.id,
      name: this.name,
      estimate: this.estimate,
      dependsOn: this.dependsOn.map((task) => task.id),
    };
  }
}

export class DependencyCycleError extends Error {
  constructor() {
    super("Dependency would cause a cycle");
  }
}
