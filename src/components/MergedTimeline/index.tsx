import React, { useCallback, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { ScrollSync, AutoSizer, Grid, GridCellProps } from 'react-virtualized';

import { PROJECTS_TO_USERS } from '@mocks/index';
import { format } from 'date-fns';
import locale from 'date-fns/locale/pt-BR';

import { ICalendarItem } from '@components/DevstreamTimeline';
import { AsideItemRowStyles } from '@components/DevstreamTimeline/styles';
import { TimelineHelper } from '@components/DevstreamTimeline/TimelineHelper';
import { toHMS } from '@components/DevstreamTimeline/toHMS';

import { Container } from './styles';

const devstream = {
  primary: '#232b47',
  weekend: '#29385c',
  background: '#0A192F',
  font: { title: '#E3E9EC', subtitle: '#92abd8' },
  header: { background: '#6c87bf', text: '#E3E9EC' },
  hover: '#00B0FF',
  shadow: 'rgba(0, 0, 0, 0.4)',
};

interface IMergedTimelineProps {
  prevMonthsQuantity?: number;
  nextMonthsQuantity?: number;
  variation?: 'DEFAULT' | 'REPORT';
}

const MergedTimeline: React.FC<IMergedTimelineProps> = ({
  prevMonthsQuantity = 1,
  nextMonthsQuantity = 1,
  variation = 'DEFAULT',
}) => {
  const data = PROJECTS_TO_USERS;

  const [selectedMonth] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth()),
  );

  const [calendarItems] = useState<ICalendarItem[]>(
    TimelineHelper.getCalendarItems(
      selectedMonth,
      prevMonthsQuantity,
      nextMonthsQuantity,
    ),
  );

  const isShowContent = variation === 'REPORT';

  const transformHours = useCallback((hours: number) => {
    if (hours === 0) return '00h';

    const parsedHours = toHMS(hours);

    const parsedArray = parsedHours.split(':');

    const H = parsedArray[0];
    const M = parsedArray[1];
    // const S = parsedArray[2];

    return `${H}h ${M}m`;
  }, []);

  const leftSideCell = useCallback(
    ({ key, columnIndex = 0, rowIndex = 0, style }: Partial<GridCellProps>) => {
      if (columnIndex >= 0 && style?.height === 47 && style.width === 47) {
        return (
          <div
            key={key}
            style={{
              ...style,
              borderBottom: '1px solid #0A192F',
              borderRight: '1px solid #0A192F',
            }}
          >
            oi
          </div>
        );
      }

      const item = data[rowIndex];

      const variationItem: keyof typeof variations =
        style?.height === 55 ? 'HEADER' : item?.variation || 'EMPTY';

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
            colors={devstream}
            style={style}
          >
            <strong>Projetos</strong>

            <AsideItemRowStyles.Selector colors={devstream}>
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
            colors={devstream}
          >
            <div>
              <strong>{item?.name}</strong>

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
            colors={devstream}
          >
            <div>
              <strong>{item?.name}</strong>

              {!isShowContent && (
                <AsideItemRowStyles.ColorPicker
                  colors={devstream}
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
            colors={devstream}
          >
            <div />
          </AsideItemRowStyles.Content>
        ),
        LOADING: (
          <AsideItemRowStyles.Content
            key={key}
            variation="LOADING"
            colors={devstream}
          >
            <div />
          </AsideItemRowStyles.Content>
        ),
      };

      return variations[variationItem];
    },
    [data, isShowContent, selectedMonth, transformHours],
  );

  const renderHeader = useCallback(
    ({ columnIndex = 0, key, style }: Partial<GridCellProps>) => {
      return (
        <div
          key={key}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '0 .5em',
            fontWeight: 'bold',
            ...style,
            outline: '1px solid #0A192F',
            background: '#6c87bf',
          }}
        >
          <strong>
            {format(calendarItems[columnIndex].date, 'dd', { locale })}
          </strong>
          <strong>
            {format(calendarItems[columnIndex].date, 'EE', {
              locale,
            }).substring(0, 3)}
          </strong>
        </div>
      );
    },
    [calendarItems],
  );

  const renderHeaderCell = useCallback(
    ({ columnIndex, key, rowIndex, style }: GridCellProps) => {
      return renderHeader({ columnIndex, key, rowIndex, style });
    },
    [renderHeader],
  );

  const renderBodyCell = useCallback(
    ({ columnIndex, key, rowIndex, style }: GridCellProps) => {
      return leftSideCell({ columnIndex, key, rowIndex, style });
    },
    [leftSideCell],
  );

  return (
    <Container>
      <ScrollSync>
        {({ scrollTop, scrollLeft, onScroll }) => {
          return (
            <div style={{ height: '100%' }}>
              {/* HEADER C0 */}
              {/* <AsideItemRow
                colors={devstream}
                data={data}
                selectedMonth={selectedMonth}
                isShowContent={variation === 'REPORT'}
                rowHeight={55}
              /> */}
              <div
                style={{
                  zIndex: 10,
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  outline: '1px solid #0A192F',
                }}
              >
                <Grid
                  overscanColumnCount={0}
                  overscanRowCount={data.length + 5}
                  cellRenderer={leftSideCell}
                  columnWidth={280}
                  columnCount={1}
                  style={{ width: '100%', overflow: 'hidden !important' }}
                  height={55}
                  rowHeight={55}
                  rowCount={1}
                  width={280}
                  scrollTop={0}
                />
              </div>
              {/* HEADER C0 */}

              {/* LATERAL */}
              {/* <AsideItemRow
                colors={devstream}
                data={data}
                selectedMonth={selectedMonth}
                isShowContent={variation === 'REPORT'}
                scrollTop={scrollTop}
              /> */}
              <div
                style={{
                  zIndex: 10,
                  position: 'absolute',
                  left: 0,
                  top: 55,
                  outline: '1px solid #0A192F',
                }}
              >
                <Grid
                  overscanColumnCount={0}
                  overscanRowCount={data.length + 5}
                  cellRenderer={leftSideCell}
                  columnWidth={280}
                  columnCount={1}
                  style={{ overflow: 'hidden !important' }}
                  height={47 * data.length}
                  rowHeight={47}
                  rowCount={data.length + 6}
                  width={280}
                  scrollTop={scrollTop}
                />
              </div>
              {/* LATERAL */}

              <div
                style={{
                  height: '100%',
                  // border: '1px solid red',
                  background: '#232b47',
                }}
                className="div"
              >
                <AutoSizer disableHeight>
                  {({ width }) => {
                    return (
                      <div>
                        {/* HEADER CALENDARIO (C1, C2, C3) */}
                        <div
                          style={{
                            // backgroundColor: `rgb(${topBackgroundColor.r},${topBackgroundColor.g},${topBackgroundColor.b})`,
                            // color: topColor,
                            // height: 47,
                            width: width - 280,
                            // border: '1px solid red',
                            marginLeft: 280,
                          }}
                        >
                          <Grid
                            style={{
                              width: '100%',
                              overflow: 'hidden !important',
                            }}
                            columnWidth={47}
                            columnCount={365 * 2}
                            height={55}
                            overscanColumnCount={0}
                            cellRenderer={renderHeaderCell}
                            rowHeight={55}
                            rowCount={1}
                            scrollLeft={scrollLeft}
                            width={width}
                          />
                        </div>
                        {/* HEADER CALENDARIO (C1, C2, C3) */}

                        {/* CALENDARIO GERAL */}
                        <div
                          style={{
                            // backgroundColor: `rgb(${middleBackgroundColor.r},${middleBackgroundColor.g},${middleBackgroundColor.b})`,
                            // color: middleColor,
                            height: 47 * data.length,
                            width: width - 280,
                            // border: '1px solid red',
                            marginLeft: 280,
                          }}
                        >
                          <Grid
                            style={{ width: '100%' }}
                            columnWidth={47}
                            columnCount={365 * 2}
                            height={47 * data.length}
                            onScroll={onScroll}
                            overscanColumnCount={0}
                            overscanRowCount={data.length + 5}
                            cellRenderer={renderBodyCell}
                            rowHeight={47}
                            rowCount={data.length + 6}
                            width={width}
                          />
                        </div>
                        {/* CALENDARIO GERAL */}
                      </div>
                    );
                  }}
                </AutoSizer>
              </div>
            </div>
          );
        }}
      </ScrollSync>
    </Container>
  );
};

export { MergedTimeline };
