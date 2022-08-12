import { addDays, addMonths, differenceInDays, subMonths } from 'date-fns';

import { ICalendarItem } from '.';
import { ITimelineRow } from './interfaces';

class TimelineHelper {
  public getCalendarItems(
    selectedMonth: Date,
    prevMonthsQuantity: number,
    nextMonthsQuantity: number,
  ): ICalendarItem[] {
    const calendarItems: ICalendarItem[] = [];
    const prevMonths = subMonths(selectedMonth, prevMonthsQuantity);
    const nextMonths = addMonths(selectedMonth, nextMonthsQuantity + 1);

    const qtd = differenceInDays(nextMonths, prevMonths);

    for (let i = 0; i < qtd; i++) {
      calendarItems.push({
        start: i,
        date: addDays(prevMonths, i),
      });
    }

    return calendarItems;
  }

  public getTimelineData(data: ITimelineRow[] | undefined): ITimelineRow[] {
    const timelineData: ITimelineRow[] = [];

    const qtd = data ? Math.abs(16 - data.length) : 16;

    for (let i = 0; i < qtd; i++) {
      timelineData.push({
        id: i,
        name: '',
        color: 'red',
        variation: !data ? 'LOADING' : 'EMPTY',
        startDate: new Date(),
        endDate: new Date(),
        bars: [],
        summary_activities: [],
      });
    }

    return data ? [...data, ...timelineData] : timelineData;
  }
}

const INSTANCE = new TimelineHelper();

export { INSTANCE as TimelineHelper };
