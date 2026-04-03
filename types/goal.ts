import { ITask } from "./task";

export interface IGoal {
  id: string;
  title: string;
  end_date: Date | string;
  parent_goal_id: string | null;
  retrospective: string | null;
  is_completed: boolean;
  created_at?: string;
  total_current: number;
  total_target: number;
  achievement_rate: number;
  tasks: ITask[];
}
