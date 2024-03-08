import { FC } from "react";
import { Plan } from "./model/plan";
import { Dev } from "./model/dev";
import { Task } from "./model/task";

export type IPlanProps = {
  devs: ReadonlyArray<Dev>;
  tasks: ReadonlyArray<Task>;
  plans: ReadonlyArray<Plan>;
  setPlans: (plans: ReadonlyArray<Plan>) => void;
};

export const PlanPage: FC<IPlanProps> = ({ plans, setPlans }) => {
  return (
    <div>
      <h2>Plan</h2>
      <ul>
        {plans.map((plan) => (
          <li key={plan.id}>{plan.name}</li>
        ))}
      </ul>
    </div>
  );
};
