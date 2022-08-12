import React from 'react';

import { differenceInDays, format, addMonths } from 'date-fns';
import locale from 'date-fns/locale/pt-BR';
import { v4 } from 'uuid';

import { Bar } from './Bar';
import { Day } from './Day';
import { ICalendarItem, IColors } from './index';
import { IBar, IKeys, ITimelineRow } from './interfaces';
import { useSynchronizedDragScroll } from './useSynchronizedDragScroll';
import { useSynchronizedScroll } from './useSynchronizedScroll';

import { CalendarRowStyles, Full } from './styles';

interface ICalendarRowProps {
  colors: Full<IColors>;
  selectedMonth: Date;
  nextMonthsQuantity: number;
  dayWidth: number;
  item: ITimelineRow;
  keys: IKeys;
  calendarItems: ICalendarItem[];
  timelineData: ITimelineRow[];
  headerRef: React.RefObject<HTMLDivElement>;
  asideRef: React.RefObject<HTMLDivElement>;
  viewportDataRef: React.RefObject<HTMLDivElement>;
  isShowContent?: boolean;
  onUpdate: (bar: IBar) => void;
}

const CalendarRow: React.FC<ICalendarRowProps> = ({
  colors,
  selectedMonth,
  nextMonthsQuantity,
  dayWidth,
  item,
  keys,
  calendarItems,
  timelineData,
  headerRef,
  asideRef,
  viewportDataRef,
  isShowContent,
  onUpdate,
}) => {
  useSynchronizedDragScroll({
    ref: viewportDataRef,
    elementKey: keys.viewportData,
    targetRef: headerRef,
    directions: 'horizontal',
  });

  useSynchronizedScroll({
    refs: [
      { ref: asideRef, id: keys.aside, targetId: keys.viewportData },
      { ref: viewportDataRef, id: keys.viewportData, targetId: keys.aside },
    ],
    scrollType: 'VERTICAL',
  });

  return (
    <CalendarRowStyles.Container>
      {calendarItems.map(calendarItem => {
        return (
          <Day
            key={v4()}
            colors={colors}
            item={item}
            calendarItem={calendarItem}
            isShowContent={isShowContent}
          />
        );
      })}

      {item.bars?.map(bar => {
        const foundedPosition = calendarItems.find(
          cItem =>
            format(cItem.date, 'yyyy-MM-dd', { locale }) === String(bar.start),
        );
        const lastPosition = calendarItems.at(-1);

        if (!lastPosition) return undefined;

        const diff = differenceInDays(new Date(bar.end), new Date(bar.start));

        const nextMonths = addMonths(selectedMonth, nextMonthsQuantity + 1);

        const endDateIsGreater = new Date(bar.end) > nextMonths;

        const barPosition = {
          left: foundedPosition ? dayWidth * foundedPosition.start : 0,
          width: endDateIsGreater
            ? (lastPosition.start - (foundedPosition?.start || 0)) * 47 + 47
            : dayWidth * diff + dayWidth,
        };

        return (
          <Bar
            key={v4()}
            barPosition={barPosition}
            bar={bar}
            dayWidth={dayWidth}
            color={bar.color}
            snap={dayWidth}
            keys={keys}
            calendarItems={calendarItems}
            timelineData={timelineData}
            viewportDataRef={viewportDataRef}
            isShowContent={isShowContent}
            startDateIsLess={!foundedPosition}
            endDateIsGreater={endDateIsGreater}
            foundedPosition={foundedPosition}
            onUpdate={onUpdate}
          />
        );
      })}
    </CalendarRowStyles.Container>
  );
};

export { CalendarRow };
