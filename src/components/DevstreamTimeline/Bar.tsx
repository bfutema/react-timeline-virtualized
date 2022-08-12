import React, { useRef, useMemo, useCallback } from 'react';

import { format } from 'date-fns';
import locale from 'date-fns/locale/pt-BR';

import { ICalendarItem } from './index';
import { IBar, IBarPosition, IKeys, ITimelineRow } from './interfaces';
import { useResize } from './useResize';

import { TimelineBarStyles } from './styles';

interface IBarProps {
  barPosition: IBarPosition;
  bar: IBar;
  color: string;
  snap: number;
  dayWidth: number;
  keys: IKeys;
  calendarItems: ICalendarItem[];
  timelineData: ITimelineRow[];
  viewportDataRef: React.RefObject<HTMLDivElement>;
  isShowContent?: boolean;
  startDateIsLess?: boolean;
  endDateIsGreater?: boolean;
  foundedPosition?: ICalendarItem;
  onUpdate: (bar: IBar) => void;
}

const Bar: React.FC<IBarProps> = ({
  barPosition,
  bar,
  color,
  snap,
  dayWidth,
  keys,
  calendarItems,
  timelineData,
  viewportDataRef,
  isShowContent,
  startDateIsLess,
  endDateIsGreater,
  foundedPosition,
  onUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const newLeftRef = useRef<number>(0);
  const newWidthRef = useRef<number>(0);
  const resizingRef = useRef<'LEFT' | 'RIGHT'>();

  // const dragRef = useRef<HTMLDivElement>(null);
  const leftResizeRef = useRef<HTMLDivElement>(null);
  const rightResizeRef = useRef<HTMLDivElement>(null);

  const allBars = useMemo(() => {
    const bars: IBar[] = [];

    timelineData.forEach(timelineDataItem => {
      timelineDataItem.bars.forEach(timelineDataItemBar => {
        bars.push(timelineDataItemBar);
      });
    });

    return bars;
  }, [timelineData]);

  const leftResize = useCallback(
    (left: number, direction: number) => {
      resizingRef.current = 'LEFT';

      if (containerRef.current) {
        const width = containerRef.current.style.width.replace('px', '');
        const pLeft = containerRef.current.style.left.replace('px', '');

        const limit = barPosition.width + barPosition.left - dayWidth;

        const diff = left + Number(width) - snap - limit;

        if (left > limit) return;
        if (Number(width) === dayWidth && direction > 0) return;

        /** Resizing to left */
        if (left < Number(pLeft)) {
          const newWidth = Number(width) + snap + Math.abs(diff) - dayWidth;

          containerRef.current.style.left = `${left}px`;
          containerRef.current.style.width = `${newWidth}px`;
        }

        /** Resizing to right */
        if (left > Number(pLeft)) {
          const newWidth = Number(width) - snap - diff + dayWidth;

          containerRef.current.style.left = `${left}px`;
          containerRef.current.style.width = `${newWidth}px`;
        }

        newLeftRef.current = left;
      }
    },
    [barPosition.left, barPosition.width, dayWidth, snap],
  );

  const rightResize = useCallback(
    (width: number) => {
      resizingRef.current = 'RIGHT';

      if (containerRef.current) {
        const currentLeft = +containerRef.current.style.left.replace('px', '');

        const newWidth =
          width -
          Number(barPosition.left) +
          (width - currentLeft - (width - Number(barPosition.left)));

        newWidthRef.current = newWidth;

        containerRef.current.style.width = `${newWidth}px`;
      }
    },
    [barPosition.left],
  );

  // const onDragBar = useCallback((left: number) => {
  //   setBarStyle(prev => ({ ...prev, left }));
  // }, []);

  const onDown = () => {
    const aside = document.getElementById(keys.aside);
    const viewportData = document.getElementById(keys.viewportData);

    aside?.classList.add('enabled');
    viewportData?.classList.add('enabled');
  };

  const onUp = () => {
    const aside = document.getElementById(keys.aside);
    const viewportData = document.getElementById(keys.viewportData);

    aside?.classList.remove('enabled');
    viewportData?.classList.remove('enabled');

    if (resizingRef.current === 'LEFT') {
      const newPosition = newLeftRef.current / dayWidth;

      const foundNewStart = calendarItems.find(
        calendarItem => calendarItem.start === newPosition,
      );

      if (!foundNewStart) return;

      const foundedBarToUpdate = allBars.find(
        timelineBarItem => timelineBarItem.id === bar.id,
      );

      if (!foundedBarToUpdate) return;

      onUpdate({
        ...foundedBarToUpdate,
        start: format(foundNewStart.date, 'yyyy-MM-dd', { locale }),
      });
    }

    if (resizingRef.current === 'RIGHT') {
      if (!foundedPosition) return;

      const newPosition =
        foundedPosition.start + (newWidthRef.current - dayWidth) / dayWidth;

      const foundNewEnd = calendarItems.find(
        calendarItem => calendarItem.start === newPosition,
      );

      if (!foundNewEnd) return;

      const foundedBarToUpdate = allBars.find(
        timelineBarItem => timelineBarItem.id === bar.id,
      );

      if (!foundedBarToUpdate) return;

      onUpdate({
        ...foundedBarToUpdate,
        end: format(foundNewEnd.date, 'yyyy-MM-dd', { locale }),
      });
    }
  };

  const { viewportData: elementKey } = keys;

  // useDrag(dragRef, { onDrag: onDragBar, snap }, calendarRef);
  useResize(
    leftResizeRef,
    { onResize: leftResize, onDown, onUp, snap, elementKey },
    viewportDataRef,
  );
  useResize(
    rightResizeRef,
    { onResize: rightResize, onDown, onUp, snap, elementKey },
    viewportDataRef,
  );

  if (isShowContent) return null;

  return (
    <TimelineBarStyles.Container
      ref={containerRef}
      color={color}
      startDateIsLess={startDateIsLess}
      endDateIsGreater={endDateIsGreater}
      style={{ width: barPosition.width, left: barPosition.left }}
    >
      {!startDateIsLess && (
        <TimelineBarStyles.LeftInteraction ref={leftResizeRef} />
      )}

      {/* <div ref={dragRef} style={{ height: '100%', display: 'flex', flex: 1 }} /> */}

      {!endDateIsGreater && (
        <TimelineBarStyles.RightInteraction ref={rightResizeRef} />
      )}
    </TimelineBarStyles.Container>
  );
};

export { Bar };
