/* eslint-disable no-underscore-dangle */
import React from 'react';
import { AutoSizer, Grid, GridCellProps, ScrollSync } from 'react-virtualized';

import clsx from 'clsx';

import { hexToRgb, mixColors } from '../../utils';

import {
  Container,
  ContentBox,
  ScrollContent,
  ScrollContentHeader,
  ScrollContentAside,
  ScrollContentCalendar,
} from './styles';

const LEFT_COLOR_FROM = hexToRgb('#232b47');
const LEFT_COLOR_TO = hexToRgb('#232b47');
const TOP_COLOR_FROM = hexToRgb('#6c87bf');
const TOP_COLOR_TO = hexToRgb('#6c87bf');

const VistualizedTimeline: React.FC = () => {
  const firstColumnWidth = 280;
  const columnWidth = 47;
  const columnCount = 365 * 2;
  const height = 650;
  const overscanColumnCount = 0;
  const overscanRowCount = 5;
  const rowHeight = 47;
  const rowCount = 10000;

  const _renderLeftHeaderCell = ({
    columnIndex,
    key,
    style,
  }: Partial<GridCellProps>) => {
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
          background: columnIndex === 0 ? '#232b47' : '#6c87bf',
          left:
            columnIndex === 0
              ? style?.left
              : `calc(${style?.left}px + ${firstColumnWidth - 47}px)`,
        }}
      >
        {`C${columnIndex}`}
      </div>
    );
  };

  const _renderLeftSideCell = ({
    columnIndex = 0,
    key,
    rowIndex = 0,
    style,
  }: Partial<GridCellProps>) => {
    const rowClass =
      rowIndex % 2 === 0
        ? columnIndex % 2 === 0
          ? 'evenRow'
          : 'oddRow'
        : columnIndex % 2 !== 0
        ? 'evenRow'
        : 'oddRow';
    const classNames = clsx(rowClass, {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '0 .5em',
    });

    return (
      <div
        className={classNames}
        key={key}
        style={{
          background: '#232b47',
          outline: '1px solid #0A192F',
          ...style,
          left:
            columnIndex === 0
              ? style?.left
              : `calc(${style?.left}px + ${firstColumnWidth - 47}px)`,
        }}
      >
        {/* {`R${rowIndex}, C${columnIndex}`} */}1
      </div>
    );
  };

  const _renderHeaderCell = ({
    columnIndex,
    key,
    rowIndex,
    style,
  }: GridCellProps): JSX.Element => {
    if (columnIndex < 1) return <></>;

    return _renderLeftHeaderCell({ columnIndex, key, rowIndex, style });
  };

  const _renderBodyCell = ({
    columnIndex,
    key,
    rowIndex,
    style,
  }: GridCellProps) => {
    if (columnIndex < 1) return <></>;

    return _renderLeftSideCell({ columnIndex, key, rowIndex, style });
  };

  return (
    <Container>
      <ContentBox>
        <ScrollSync>
          {({
            clientHeight,
            clientWidth,
            onScroll,
            scrollHeight,
            scrollLeft,
            scrollTop,
            scrollWidth,
          }) => {
            const x = scrollLeft / (scrollWidth - clientWidth);
            const y = scrollTop / (scrollHeight - clientHeight);

            const leftBackgroundColor = mixColors(
              LEFT_COLOR_FROM,
              LEFT_COLOR_TO,
              y,
            );
            const leftColor = '#ffffff';
            const topBackgroundColor = mixColors(
              TOP_COLOR_FROM,
              TOP_COLOR_TO,
              x,
            );
            const topColor = '#ffffff';
            const middleBackgroundColor = mixColors(
              leftBackgroundColor,
              topBackgroundColor,
              0.5,
            );
            const middleColor = '#ffffff';

            return (
              <ScrollContent>
                {/* HEADER C0 */}
                <ScrollContentHeader
                  style={{
                    color: leftColor,
                    backgroundColor: `rgb(${topBackgroundColor.r},${topBackgroundColor.g},${topBackgroundColor.b})`,
                    outline: '1px solid rgb(10, 25, 47)',
                    // outline: '1px solid red',
                    // border: '1px solid red',
                  }}
                >
                  <Grid
                    cellRenderer={_renderLeftHeaderCell}
                    style={{ width: '100%', overflow: 'hidden !important' }}
                    width={firstColumnWidth}
                    height={rowHeight}
                    rowHeight={rowHeight}
                    columnWidth={firstColumnWidth}
                    rowCount={1}
                    columnCount={1}
                  />
                </ScrollContentHeader>
                {/* HEADER C0 */}

                {/* LATERAL */}
                <ScrollContentAside
                  style={{
                    top: rowHeight,
                    color: leftColor,
                    backgroundColor: `rgb(${leftBackgroundColor.r},${leftBackgroundColor.g},${leftBackgroundColor.b})`,
                    // borderTop: '1px solid rgb(10, 25, 47)',
                    outline: '1px solid rgb(10, 25, 47)',
                  }}
                >
                  <Grid
                    overscanColumnCount={overscanColumnCount}
                    overscanRowCount={overscanRowCount}
                    cellRenderer={_renderLeftSideCell}
                    columnWidth={firstColumnWidth}
                    columnCount={1}
                    style={{ overflow: 'hidden !important' }}
                    height={height}
                    rowHeight={rowHeight}
                    rowCount={rowCount}
                    scrollTop={scrollTop}
                    width={firstColumnWidth}
                  />
                </ScrollContentAside>
                {/* LATERAL */}

                <ScrollContentCalendar>
                  <AutoSizer disableHeight>
                    {({ width }) => (
                      <div>
                        {/* HEADER CALENDARIO (C1, C2, C3) */}
                        <div
                          style={{
                            backgroundColor: `rgb(${topBackgroundColor.r},${topBackgroundColor.g},${topBackgroundColor.b})`,
                            color: topColor,
                            height: rowHeight,
                            width,
                            // border: '1px solid red',
                          }}
                        >
                          <Grid
                            style={{
                              width: '100%',
                              overflow: 'hidden !important',
                            }}
                            columnWidth={columnWidth}
                            columnCount={columnCount}
                            height={rowHeight}
                            overscanColumnCount={overscanColumnCount}
                            cellRenderer={_renderHeaderCell}
                            rowHeight={rowHeight}
                            rowCount={1}
                            scrollLeft={scrollLeft}
                            width={width}
                          />
                        </div>
                        {/* HEADER CALENDARIO (C1, C2, C3) */}

                        {/* CALENDARIO GERAL */}
                        <div
                          style={{
                            backgroundColor: `rgb(${middleBackgroundColor.r},${middleBackgroundColor.g},${middleBackgroundColor.b})`,
                            color: middleColor,
                            height,
                            width,
                            // border: '1px solid red',
                          }}
                        >
                          <Grid
                            style={{ width: '100%' }}
                            columnWidth={columnWidth}
                            columnCount={columnCount}
                            height={height}
                            onScroll={onScroll}
                            overscanColumnCount={overscanColumnCount}
                            overscanRowCount={overscanRowCount}
                            cellRenderer={_renderBodyCell}
                            rowHeight={rowHeight}
                            rowCount={rowCount}
                            width={width}
                          />
                        </div>
                        {/* CALENDARIO GERAL */}
                      </div>
                    )}
                  </AutoSizer>
                </ScrollContentCalendar>
              </ScrollContent>
            );
          }}
        </ScrollSync>
      </ContentBox>
    </Container>
  );
};

export { VistualizedTimeline };
