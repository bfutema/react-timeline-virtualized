import { ISummaryActivity } from './models';

export interface IBar {
  id: number;
  color: string;
  start: string;
  end: string;
}

export interface ITimelineRow {
  id: number;
  name: string;
  variation: ITimelineRowVariation;
  color: string;
  startDate: Date;
  endDate: Date;
  bars: IBar[];
  summary_activities: ISummaryActivity[];
}

export type ITimelineRowVariation =
  | 'HEADER'
  | 'PROJECT'
  | 'USER'
  | 'EMPTY'
  | 'LOADING';
export type IBarPosition = { left: number; width: number };
export type IKeys = { aside: string; viewportData: string };
