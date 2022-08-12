import { IGeneric } from './styles';

export interface ISummaryActivity extends IGeneric {
  user_id: number;
  project_id: number;
  original_cost: number;
  original_worked_hours: number;
  worked_date: Date;
  checked_worked_hours: number;
}
