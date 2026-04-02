import { ITask } from "./task";

export interface IGoal {
  id: string;
  title: string;
  end_date: string;
  parent_goal_id: string | null;
  retrospective: string | null;
  is_completed: boolean;
  created_at: string;
  tasks: ITask[];
}
