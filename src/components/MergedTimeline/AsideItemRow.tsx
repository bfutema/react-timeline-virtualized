import React, { useCallback } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Grid, GridCellProps } from 'react-virtualized';

import { format } from 'date-fns';
import locale from 'date-fns/locale/pt-BR';

import { IColors } from '@components/DevstreamTimeline';
import { ITimelineRow } from '@components/DevstreamTimeline/interfaces';
import { AsideItemRowStyles, Full } from '@components/DevstreamTimeline/styles';
import { toHMS } from '@components/DevstreamTimeline/toHMS';

// import { Container } from './styles';

interface IAsideItemRowProps {
  colors: Full<IColors>;
  selectedMonth: Date;
  data: ITimelineRow[];
  isShowContent?: boolean;
  rowHeight?: number;
  scrollTop?: number;
}

const AsideItemRow: React.FC<IAsideItemRowProps> = ({
  colors,
  selectedMonth,
  data,
  isShowContent = false,
  rowHeight = 47,
  scrollTop = 0,
}) => {
  // const variations = useMemo(() => {
  //   const parsedProject = { start: '', end: '', hours: '' };
  //   const parsedUser = { hours: '' };

  //   if (item) {
  //     parsedProject.start = format(item.startDate, 'dd MMM yyyy', { locale });
  //     parsedProject.end = format(item.endDate, 'dd MMM yyyy', { locale });

  //     if (item.variation === 'PROJECT') {
  //       const projectHours = item.summary_activities
  //         .filter(activity => activity.project_id === item.id)
  //         .reduce((acc, activity) => {
  //           const summed = acc + activity.original_worked_hours;
  //           return summed;
  //         }, 0);

  //       parsedProject.hours = transformHours(projectHours);
  //     }

  //     if (item.variation === 'USER') {
  //       const userHours = item.summary_activities
  //         .filter(activity => activity.user_id === item.id)
  //         .reduce((acc, activity) => {
  //           const summed = acc + activity.original_worked_hours;
  //           return summed;
  //         }, 0);

  //       parsedUser.hours = transformHours(userHours);
  //     }
  //   }

  //   return {
  //     HEADER: (
  //       <AsideItemRowStyles.Content variation="HEADER" colors={colors}>
  //         <strong>Projetos</strong>

  //         <AsideItemRowStyles.Selector colors={colors}>
  //           <FiChevronLeft size={24} />

  //           <div>
  //             <strong>{format(selectedMonth, 'MMM', { locale })}</strong>
  //             <strong>{format(selectedMonth, 'yyyy', { locale })}</strong>
  //           </div>

  //           <FiChevronRight size={24} />
  //         </AsideItemRowStyles.Selector>
  //       </AsideItemRowStyles.Content>
  //     ),
  //     PROJECT: (
  //       <AsideItemRowStyles.Content variation="PROJECT" colors={colors}>
  //         <div>
  //           <strong>{item?.name}</strong>

  //           <span>
  //             {parsedProject.start} - {parsedProject.end}
  //           </span>
  //         </div>

  //         {isShowContent && <span>{parsedProject.hours}</span>}
  //       </AsideItemRowStyles.Content>
  //     ),
  //     USER: (
  //       <AsideItemRowStyles.Content variation="USER" colors={colors}>
  //         <div>
  //           <strong>{item?.name}</strong>

  //           {!isShowContent && (
  //             <AsideItemRowStyles.ColorPicker
  //               colors={colors}
  //               color={item?.color}
  //             />
  //           )}
  //         </div>

  //         {isShowContent && <span>{parsedUser.hours}</span>}
  //       </AsideItemRowStyles.Content>
  //     ),
  //     EMPTY: (
  //       <AsideItemRowStyles.Content variation="EMPTY" colors={colors}>
  //         <div />
  //       </AsideItemRowStyles.Content>
  //     ),
  //     LOADING: (
  //       <AsideItemRowStyles.Content variation="LOADING" colors={colors}>
  //         <div />
  //       </AsideItemRowStyles.Content>
  //     ),
  //   };
  // }, [colors, isShowContent, item, selectedMonth, transformHours]);

  const transformHours = useCallback((hours: number) => {
    if (hours === 0) return '00h';

    const parsedHours = toHMS(hours);

    const parsedArray = parsedHours.split(':');

    const H = parsedArray[0];
    const M = parsedArray[1];
    // const S = parsedArray[2];

    return `${H}h ${M}m`;
  }, []);

  const cellRenderer = useCallback(
    ({ key, rowIndex = 0, style }: Partial<GridCellProps>) => {
      const item = data[rowIndex];

      const variation: keyof typeof variations =
        style?.height === 55 ? 'HEADER' : item.variation;

      const parsedProject = { start: '', end: '', hours: '' };
      const parsedUser = { hours: '' };

      if (item) {
        parsedProject.start = format(item.startDate, 'dd MMM yyyy', { locale });
        parsedProject.end = format(item.endDate, 'dd MMM yyyy', { locale });

        if (item.variation === 'PROJECT') {
          const projectHours = item.summary_activities
            .filter(activity => activity.project_id === item.id)
            .reduce((acc, activity) => {
              const summed = acc + activity.original_worked_hours;
              return summed;
            }, 0);

          parsedProject.hours = transformHours(projectHours);
        }

        if (item.variation === 'USER') {
          const userHours = item.summary_activities
            .filter(activity => activity.user_id === item.id)
            .reduce((acc, activity) => {
              const summed = acc + activity.original_worked_hours;
              return summed;
            }, 0);

          parsedUser.hours = transformHours(userHours);
        }
      }

      const variations = {
        HEADER: (
          <AsideItemRowStyles.Content
            key={key}
            variation="HEADER"
            colors={colors}
            style={style}
          >
            <strong>Projetos</strong>

            <AsideItemRowStyles.Selector colors={colors}>
              <FiChevronLeft size={24} />

              <div>
                <strong>{format(selectedMonth, 'MMM', { locale })}</strong>
                <strong>{format(selectedMonth, 'yyyy', { locale })}</strong>
              </div>

              <FiChevronRight size={24} />
            </AsideItemRowStyles.Selector>
          </AsideItemRowStyles.Content>
        ),
        PROJECT: (
          <AsideItemRowStyles.Content
            key={key}
            variation="PROJECT"
            colors={colors}
          >
            <div>
              <strong>{item.name}</strong>

              <span>
                {parsedProject.start} - {parsedProject.end}
              </span>
            </div>

            {isShowContent && <span>{parsedProject.hours}</span>}
          </AsideItemRowStyles.Content>
        ),
        USER: (
          <AsideItemRowStyles.Content
            key={key}
            variation="USER"
            colors={colors}
          >
            <div>
              <strong>{item?.name}</strong>

              {!isShowContent && (
                <AsideItemRowStyles.ColorPicker
                  colors={colors}
                  color={item?.color}
                />
              )}
            </div>

            {isShowContent && <span>{parsedUser.hours}</span>}
          </AsideItemRowStyles.Content>
        ),
        EMPTY: (
          <AsideItemRowStyles.Content
            key={key}
            variation="EMPTY"
            colors={colors}
          >
            <div />
          </AsideItemRowStyles.Content>
        ),
        LOADING: (
          <AsideItemRowStyles.Content
            key={key}
            variation="LOADING"
            colors={colors}
          >
            <div />
          </AsideItemRowStyles.Content>
        ),
      };

      return variations[variation];
    },
    [colors, data, isShowContent, selectedMonth, transformHours],
  );

  const parsedStyle =
    rowHeight === 55
      ? { width: '100%', overflow: 'hidden !important' }
      : { height: '100% !important', overflow: 'hidden !important' };

  return (
    <div
      style={{
        zIndex: 10,
        position: 'absolute',
        left: 0,
        top: rowHeight === 55 ? 0 : 55,
        outline: '1px solid #0A192F',
      }}
    >
      <Grid
        overscanColumnCount={0}
        overscanRowCount={data.length + 5}
        cellRenderer={cellRenderer}
        columnWidth={280}
        columnCount={1}
        style={parsedStyle}
        height={rowHeight === 55 ? 55 : 47}
        rowHeight={rowHeight === 55 ? 55 : 47}
        rowCount={rowHeight === 55 ? 1 : data.length}
        width={280}
        scrollTop={rowHeight === 55 ? 0 : scrollTop}
      />
    </div>
  );
};

export { AsideItemRow };
