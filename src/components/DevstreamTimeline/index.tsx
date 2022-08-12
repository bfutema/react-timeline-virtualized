import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';

import {
  differenceInDays,
  endOfMonth,
  format,
  isFirstDayOfMonth,
  isLastDayOfMonth,
  startOfMonth,
} from 'date-fns';
import locale from 'date-fns/locale/pt-BR';
import { v4 } from 'uuid';

import { AsideItemRow } from './AsideItemRow';
import { CalendarRow } from './CalendarRow';
import { IBar, ITimelineRow } from './interfaces';
import { TimelineHelper } from './TimelineHelper';

import { Full, TimelineStyles } from './styles';

export type ICalendarItem = { date: Date; start: number };
export type IColors = {
  primary?: string;
  weekend?: string;
  background?: string;
  font?: { title?: string; subtitle?: string };
  header?: { background?: string; text?: string };
  hover?: string;
  shadow?: string;
};

interface ITimelineProps {
  colors?: IColors;
  data: ITimelineRow[] | undefined;
  prevMonthsQuantity?: number;
  nextMonthsQuantity?: number;
  dayWidth?: number;
  variation?: 'DEFAULT' | 'REPORT';
  onUpdateBar?: (bar: IBar) => void;
}

const Timeline: React.FC<ITimelineProps> = ({
  colors: colorsPassed,
  data = undefined,
  prevMonthsQuantity = 1,
  nextMonthsQuantity = 1,
  dayWidth: dayWidthPassed = 47,
  variation = 'DEFAULT',
  onUpdateBar,
}) => {
  const headerViewportRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLDivElement>(null);
  const viewportDataRef = useRef<HTMLDivElement>(null);

  const isDraggingRef = useRef<boolean>(false);
  const draggingPositionRef = useRef<number>(0);

  const [selectedMonth] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth()),
  );
  const [dayWidth] = useState<number>(dayWidthPassed);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  // const [scrollLeft] = useState<number>(0);

  const [calendarItems] = useState<ICalendarItem[]>(
    TimelineHelper.getCalendarItems(
      selectedMonth,
      prevMonthsQuantity,
      nextMonthsQuantity,
    ),
  );
  const [timelineData, setTimelineData] = useState<ITimelineRow[]>(
    TimelineHelper.getTimelineData(data),
  );

  const delay = useCallback((time: number) => {
    return new Promise(resolve => setTimeout(() => resolve(time), time));
  }, []);

  useEffect(() => {
    async function set() {
      await delay(3000);

      setTimelineData(TimelineHelper.getTimelineData(data));
    }

    set();
  }, [data, delay]);

  useEffect(() => {
    if (!isUpdating) {
      const todayIndex = calendarItems.findIndex(
        calendarItem =>
          format(calendarItem.date, 'yyyy-MM-dd', { locale }) ===
          format(selectedMonth, 'yyyy-MM-dd', { locale }),
      );

      if (viewportDataRef.current) {
        viewportDataRef.current.scrollTo({
          left: dayWidth * todayIndex,
          behavior: 'auto',
        });
      }

      if (headerViewportRef.current) {
        headerViewportRef.current.scrollTo({
          left: dayWidth * todayIndex,
          behavior: 'auto',
        });
      }
    }
  }, [
    calendarItems,
    dayWidth,
    headerViewportRef,
    isUpdating,
    selectedMonth,
    viewportDataRef,
  ]);

  const colors: Full<IColors> = useMemo(() => {
    return {
      ...{
        primary: '#232b47',
        weekend: '#29385c',
        background: '#0A192F',
        font: { title: '#E3E9EC', subtitle: '#92abd8' },
        header: { background: '#6c87bf', text: '#E3E9EC' },
        hover: '#00B0FF',
        shadow: 'rgba(0, 0, 0, 0.4)',
      },
      ...colorsPassed,
    };
  }, [colorsPassed]);

  const keys = useMemo(() => {
    return {
      aside: `timeline-${v4()}-aside`,
      viewportData: `timeline-${v4()}-viewportData`,
    };
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    draggingPositionRef.current = e.clientX;
  }, []);

  // const handleHorizontalChange = useCallback((newDraggingPosition: number) => {
  //   console.log('onHorizontalChange: ', newDraggingPosition);
  // }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      const delta = draggingPositionRef.current - e.clientX;

      if (delta !== 0) {
        draggingPositionRef.current = e.clientX;
        // handleHorizontalChange(scrollLeft + delta);
      }
    }
  }, []);

  const onMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const onMouseLeave = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  return (
    <TimelineStyles.Container colors={colors}>
      <TimelineStyles.Header.Container>
        <TimelineStyles.Header.Items colors={colors}>
          <AsideItemRow colors={colors} selectedMonth={selectedMonth} />
        </TimelineStyles.Header.Items>

        <TimelineStyles.Header.ViewportData ref={headerViewportRef}>
          {calendarItems.map(({ date }) => {
            return (
              <TimelineStyles.Header.Day
                key={v4()}
                colors={colors}
                label={format(date, 'MMMM yyyy', { locale })}
                days={differenceInDays(endOfMonth(date), startOfMonth(date))}
                isFirstDay={isFirstDayOfMonth(date)}
                isLastDay={isLastDayOfMonth(date)}
              >
                <strong>{format(date, 'dd', { locale })}</strong>
                <strong>
                  {format(date, 'EE', { locale }).substring(0, 3)}
                </strong>
              </TimelineStyles.Header.Day>
            );
          })}
        </TimelineStyles.Header.ViewportData>
      </TimelineStyles.Header.Container>

      <TimelineStyles.Content>
        <TimelineStyles.Aside.Container
          id={keys.aside}
          ref={asideRef}
          colors={colors}
        >
          {timelineData.map(item => {
            return (
              <AsideItemRow
                key={v4()}
                colors={colors}
                selectedMonth={selectedMonth}
                item={item}
                isShowContent={variation === 'REPORT'}
              />
            );
          })}
        </TimelineStyles.Aside.Container>

        <TimelineStyles.Calendar.ViewportData
          id={keys.viewportData}
          ref={viewportDataRef}
          colors={colors}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
        >
          {timelineData.map(item => {
            return (
              <CalendarRow
                key={v4()}
                colors={colors}
                selectedMonth={selectedMonth}
                nextMonthsQuantity={nextMonthsQuantity}
                keys={keys}
                item={item}
                dayWidth={dayWidth}
                calendarItems={calendarItems}
                timelineData={timelineData}
                headerRef={headerViewportRef}
                asideRef={asideRef}
                viewportDataRef={viewportDataRef}
                isShowContent={variation === 'REPORT'}
                onUpdate={bar => {
                  if (onUpdateBar) {
                    onUpdateBar(bar);
                    setIsUpdating(true);
                  }

                  setTimelineData(state => {
                    const updatedState = state.map(stateItem => {
                      const updatedBars = stateItem.bars.map(stateItemBar => {
                        if (stateItemBar.id === bar.id) return bar;

                        return stateItemBar;
                      });

                      return { ...stateItem, bars: updatedBars };
                    });

                    return updatedState;
                  });
                }}
              />
            );
          })}
        </TimelineStyles.Calendar.ViewportData>
      </TimelineStyles.Content>
    </TimelineStyles.Container>
  );
};

export { Timeline };
