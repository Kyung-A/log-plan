export interface ITask {
  id: string;
  goal_id: string;
  title: string;
  target_count: number;
  current_count: number;
  created_at?: string;
}
