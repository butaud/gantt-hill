import { Dev, Schedule, Task } from "./models";

export const areCycleFree: (tasks: ReadonlyArray<Task>) => boolean = (
  tasks,
) => {
  const visited = new Set<Task>();
  const stack = new Set<Task>();
  const visit = (task: Task): boolean => {
    if (stack.has(task)) {
      return false;
    }
    if (visited.has(task)) {
      return true;
    }
    stack.add(task);
    for (const dependency of task.dependsOn) {
      if (!visit(dependency)) {
        return false;
      }
    }
    stack.delete(task);
    visited.add(task);
    return true;
  };
  for (const task of tasks) {
    if (!visit(task)) {
      return false;
    }
  }
  return true;
};

export const topologicalSortTasks: (
  tasks: ReadonlyArray<Task>,
) => ReadonlyArray<Task> = (tasks) => {
  const sorted: Task[] = tasks.filter((task) => task.dependsOn.length === 0);
  while (sorted.length < tasks.length) {
    const next = tasks.find(
      (task) =>
        !sorted.includes(task) &&
        task.dependsOn.every((dependency) => sorted.includes(dependency)),
    );
    if (next === undefined) {
      throw new Error("Cycle detected");
    }
    sorted.push(next);
  }
  return sorted;
};

const isTaskReadyToStart = (
  schedule: Schedule,
  task: Task,
  now: number,
): boolean => {
  return task.dependsOn.every(
    (dependency) => schedule[dependency.id] + dependency.estimate <= now,
  );
};

const isAssigned = (schedule: Schedule, dev: Dev, now: number): boolean =>
  dev.tasks.some(
    (task) =>
      schedule[task.id] <= now && now < schedule[task.id] + task.estimate,
  );

const isOof = (dev: Dev, now: number): boolean =>
  dev.oofages.some(
    (oofage) => oofage.startInclusive <= now && now < oofage.endExclusive,
  );

export const schedule: (devs: ReadonlyArray<Dev>) => Schedule = (devs) => {
  const schedule: Schedule = {};
  let now = 0;
  const tasksToSchedule = devs.flatMap((dev) => dev.tasks).length;
  while (Object.keys(schedule).length < tasksToSchedule) {
    for (const dev of devs) {
      if (!isAssigned(schedule, dev, now) && !isOof(dev, now)) {
        const nextTask = dev.tasks.find(
          (task) => schedule[task.id] === undefined,
        );
        if (
          nextTask !== undefined &&
          isTaskReadyToStart(schedule, nextTask, now)
        ) {
          schedule[nextTask.id] = now;
        }
      }
    }
    now++;
  }
  return schedule;
};

export const getScheduleEnd: (
  tasks: ReadonlyArray<Task>,
  schedule: Schedule,
) => number = (tasks, schedule) => {
  let maxTask: Task | undefined;
  for (const task of tasks) {
    if (
      maxTask === undefined ||
      schedule[task.id] + task.estimate >
        schedule[maxTask.id] + maxTask.estimate
    ) {
      maxTask = task;
    }
  }
  return maxTask === undefined ? 0 : schedule[maxTask.id] + maxTask.estimate;
};
