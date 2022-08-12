import React, { useMemo, useCallback } from 'react';

import { format, isWeekend } from 'date-fns';
import locale from 'date-fns/locale/pt-BR';

import { ICalendarItem, IColors } from './index';
import { ITimelineRow } from './interfaces';
import { toHMS } from './toHMS';

import { Full, TimelineDayStyles } from './styles';

interface IDayProps {
  colors: Full<IColors>;
  item: ITimelineRow;
  calendarItem: ICalendarItem;
  isShowContent?: boolean;
}

const Day: React.FC<IDayProps> = ({
  colors,
  item,
  calendarItem,
  isShowContent,
}) => {
  const transformHours = useCallback((hours: number) => {
    if (hours === 0) return '';

    const parsedHours = toHMS(hours);

    const H = parsedHours.substring(0, 2);
    const M = parsedHours.substring(3, 5);
    const S = parsedHours.substring(6, 8);

    if (hours > 3600) return `${H}h`;
    if (hours > 60) return `${M}m`;

    return `${S}s`;
  }, []);

  const hours = useMemo(() => {
    if (!item) return '';
    if (item.variation !== 'USER') return '';

    const userHours = item.summary_activities
      .filter(activity => activity.user_id === item.id)
      .filter(
        activity =>
          String(activity.worked_date) ===
          format(calendarItem.date, 'yyyy-MM-dd', { locale }),
      )
      .reduce((acc, activity) => {
        const summed = acc + activity.original_worked_hours;
        return summed;
      }, 0);

    return transformHours(userHours);
  }, [calendarItem.date, item, transformHours]);

  return (
    <TimelineDayStyles.Container
      type="button"
      colors={colors}
      isWeekend={isWeekend(calendarItem.date)}
      onClick={() => console.log('Abrindo modal', calendarItem)}
    >
      {isShowContent && <span>{hours}</span>}
    </TimelineDayStyles.Container>
  );
};

export { Day };
