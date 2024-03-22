import { FC } from "react";
import { useStateStore } from "../context/StateStoreContext";
import { usePlanStore } from "../context/PlanStoreContext";
import { useDevStore } from "../context/DevStoreContext";
import { useTaskStore } from "../context/TaskStoreContext";

export const AppControls: FC = () => {
  const stateStore = useStateStore();
  const planStore = usePlanStore();
  const devStore = useDevStore();
  const taskStore = useTaskStore();

  const save = async () => {
    let serialized = {};
    [stateStore, planStore, devStore, taskStore].forEach((store) => {
      serialized = { ...serialized, ...store.serialized };
    });
    const json = JSON.stringify(serialized);

    // get a local file handle to save the JSON
    const handle = await window.showSaveFilePicker({
      suggestedName: `${planStore.title || "untitled"}.json`,
      types: [
        {
          description: "JSON",
          accept: { "application/json": [".json"] },
        },
      ],
    });

    // create a writable stream to write to the file
    const writable = await handle.createWritable();
    await writable.write(json);
    await writable.close();
  };

  const load = async () => {
    // get a local file handle to load the JSON
    const [handle] = await window.showOpenFilePicker({
      types: [
        {
          description: "JSON",
          accept: { "application/json": [".json"] },
        },
      ],
    });

    // create a readable stream to read from the file
    const file = await handle.getFile();
    const reader = new FileReader();
    reader.onload = () => {
      const json = reader.result as string;
      const data = JSON.parse(json);
      const storeList = [stateStore, planStore, taskStore, devStore];
      storeList.forEach((store) => {
        store.clear();
      });

      stateStore.deserialize(data);
      planStore.deserialize(data);
      taskStore.deserialize(data);
      devStore.deserialize(data, taskStore);
    };
    reader.readAsText(file);
  };

  const clear = () => {
    const doClear = async () => {
      if (window.confirm("Are you sure you want to clear all data?")) {
        [stateStore, planStore, taskStore, devStore].forEach((store) => {
          store.clear();
        });
      }
    };
    setTimeout(doClear, 0);
  };

  const copyMermaidCode = () => {
    let mermaid = `gantt\n\ttitle ${planStore.title}\n\tdateFormat YYYY-MM-DD\n`;
    if (planStore.excludeWeekends) {
      mermaid += "\texcludes weekends\n";
    }
    mermaid += "\n";
    devStore.getDevs().forEach((dev) => {
      mermaid += `\tsection ${dev.name}\n`;
      dev.tasks.forEach((task) => {
        const startDate = planStore.startDate.plus({
          days: dev.startDayForTask(task),
        });
        mermaid += `\t\t${task.name}: ${startDate.toISODate()}, ${task.estimate}d\n`;
      });
    });
    navigator.clipboard.writeText(mermaid);
  };
  return (
    <nav className="top-controls">
      <button onClick={save}>Save</button>
      <button onClick={load}>Load</button>
      <button onClick={clear}>Clear</button>
      <button onClick={copyMermaidCode}>Copy Mermaid Code</button>
    </nav>
  );
};
