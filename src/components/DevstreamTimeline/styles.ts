import { darken, lighten, transparentize } from 'polished';
import styled, { css } from 'styled-components';

import { IColors } from '.';
import { ITimelineRowVariation } from './interfaces';

export interface IGeneric {
  id?: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export type Full<T> = {
  [P in keyof T]-?: T[P];
};

type Colors = Full<IColors>;

interface ITimelineContainerProps {
  colors: Colors;
}

interface ITimelineHeaderItemsProps {
  colors: Colors;
}

interface ITimelineAsideContainerProps {
  colors: Colors;
}

interface ITimelineDayProps {
  colors: Colors;
  label: string;
  days: number;
  isFirstDay: boolean;
  isLastDay: boolean;
}

interface ITimelineCalendarViewportProps {
  colors: Colors;
}

export const TimelineStyles = {
  Container: styled.div<ITimelineContainerProps>`
    ${({ colors }) => css`
      width: 100%;
      height: calc(100vh - 220px);

      background: ${colors.background};

      position: absolute;
      bottom: 0;
    `}
  `,
  Content: styled.div`
    ${() => css`
      height: 100%;

      display: grid;
      grid-template-columns: 300px 1fr;
    `}
  `,
  Header: {
    Container: styled.div`
      ${() => css`
        width: 100%;
        height: 90px;

        position: absolute;
        top: calc(-90px - 1px);

        display: grid;
        align-items: flex-end;
        grid-template-columns: 300px 1fr;

        user-select: none;

        z-index: 3;
      `}
    `,
    Items: styled.div<ITimelineHeaderItemsProps>`
      ${({ colors }) => css`
        box-shadow: 4px 0px 4px 0px ${colors.shadow};

        display: flex;
        flex-direction: column;

        z-index: 2;
      `}
    `,
    ViewportData: styled.div`
      width: 100%;
      height: 100%;

      padding-left: 1px;

      overflow: scroll;

      display: flex;

      z-index: 1;

      &::-webkit-scrollbar {
        width: 0;
        height: 0;
      }
    `,
    Day: styled.div<ITimelineDayProps>`
      ${({ colors, label, days, isFirstDay, isLastDay }) => css`
        width: 47px;
        min-width: 47px;
        height: 55px;
        min-height: 55px;

        outline: 1px solid ${colors.background};
        background: ${colors.header.background};

        padding: 12px;

        position: relative;

        align-self: flex-end;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        strong {
          color: ${colors.font.title};
          font-size: 14px;
          font-weight: bold;
          text-align: center;
          line-height: 18px;
        }

        &:before {
          content: '';

          width: ${isFirstDay || isLastDay ? 'calc(46px / 2)' : '100%'};
          height: 23px;

          border-left: ${isFirstDay
            ? `1px solid ${colors.header.background}`
            : 'none'};
          border-right: ${isLastDay
            ? `1px solid ${colors.header.background}`
            : 'none'};
          border-top-left-radius: ${isFirstDay ? '10px' : '0px'};
          border-top-right-radius: ${isLastDay ? '10px' : '0px'};
          border-top: 1px solid ${colors.header.background};

          position: absolute;
          top: -23px;
          right: ${isFirstDay ? '0px' : 'initial'};
          left: ${isLastDay ? '0px' : 'initial'};

          z-index: 11;
        }

        ${isFirstDay &&
        css`
          &:after {
            content: '${label}';

            background: ${colors.background};
            background: ${colors.header.background};
            border-radius: 4px;

            color: ${colors.font.title};
            font-size: 12px;
            text-transform: capitalize;
            white-space: nowrap;

            padding: 2px 8px;

            position: absolute;
            top: -35px;
            left: 40px;
            left: calc(47 * ${days / 2}px);

            z-index: 12;
          }
        `}
      `}
    `,
  },
  Aside: {
    Container: styled.div<ITimelineAsideContainerProps>`
      ${({ colors }) => css`
        box-shadow: 4px 0px 4px 0px ${colors.shadow};

        overflow: scroll;

        display: flex;
        flex-direction: column;

        z-index: 2;

        &::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
      `}
    `,
  },
  Calendar: {
    ViewportData: styled.div<ITimelineCalendarViewportProps>`
      ${({ colors }) => css`
        width: 100%;

        outline: 1px solid ${colors.background};

        padding-left: 1px;

        overflow: scroll;

        display: flex;
        flex-direction: column;

        z-index: 1;

        &::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
      `}
    `,
  },
};

/**
 * Component: AsideItemRow
 */
interface IAsideItemRowContainerProps {
  colors: Colors;
}

interface IAsideItemRowContentProps {
  colors: Colors;
  variation: ITimelineRowVariation;
}

interface IAsideItemRowSelectorProps {
  colors: Colors;
}

interface IAsideItemRowColorPickerProps {
  colors: Colors;
  color?: string;
}

const itemRowVariations = (colors: Colors) => ({
  content: {
    HEADER: css`
      height: 55px;

      padding: 8px 6px 8px 16px;

      user-select: none;

      strong {
        color: ${colors.font.title};
        font-size: 18px;
        font-weight: bold;
        font-family: Roboto;
        text-transform: capitalize;

        user-select: none;
      }
    `,
    PROJECT: css`
      &:hover {
        background: ${transparentize(0.9, colors.hover)};

        cursor: pointer;

        strong,
        > span {
          color: ${colors.hover};
        }
      }

      > div {
        padding: 8px 16px;

        flex: 1;
        display: flex;
        flex-direction: column;

        user-select: none;

        strong {
          color: ${colors.font.title};
          font-family: Roboto, sans-serif;
          font-size: 14px;
          font-weight: 500;
        }

        span {
          color: ${colors.font.subtitle};
          font-family: Roboto, sans-serif;
          font-size: 12px;
          font-weight: normal;
        }
      }

      > span {
        color: ${colors.font.title};
        font-family: Roboto, sans-serif;

        padding: 8px 16px;

        display: flex;
        align-items: center;
        justify-content: center;

        user-select: none;
      }
    `,
    USER: css`
      &:hover {
        background: ${transparentize(0.9, colors.hover)};

        cursor: pointer;

        strong,
        > span {
          color: ${colors.hover};

          user-select: none;
        }
      }

      > div {
        padding: 8px 24px 8px 32px;

        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;

        user-select: none;

        strong {
          color: ${colors.font.title};
          font-family: Roboto, sans-serif;
          font-size: 14px;
          font-weight: 500;

          user-select: none;
        }
      }

      > span {
        color: ${colors.font.title};
        font-family: Roboto, sans-serif;

        padding: 8px 16px;

        display: flex;
        align-items: center;
        justify-content: center;

        user-select: none;
      }
    `,
    EMPTY: css`
      outline: 1px solid ${colors.background};
      background: ${colors.primary};

      &:hover {
        background: ${transparentize(0.9, colors.hover)};

        cursor: pointer;
      }
    `,
    LOADING: css`
      outline: 1px solid ${colors.background};
      background: ${colors.primary};

      &:hover {
        background: ${transparentize(0.9, colors.hover)};

        cursor: pointer;
      }

      &:after {
        content: '';

        width: 100%;
        height: 47px;

        animation-duration: 2.2s;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
        animation-name: shimmer;
        animation-timing-function: linear;
        background: linear-gradient(
          to right,
          ${colors.primary} 8%,
          ${colors.background} 18%,
          ${colors.primary} 33%
        );
        background-size: 1200px 100%;

        @-webkit-keyframes shimmer {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 100% 0;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1200px 0;
          }
          100% {
            background-position: 1200px 0;
          }
        }
      }
    `,
  },
});

export const AsideItemRowStyles = {
  Container: styled.div<IAsideItemRowContainerProps>`
    ${({ colors }) => css`
      width: 100%;

      outline: 1px solid ${colors.background};

      z-index: 10;
    `}
  `,
  Content: styled.div<IAsideItemRowContentProps>`
    ${({ variation, colors }) => css`
      height: 47px;

      background: ${colors.primary};
      border-bottom: 1px solid #0a192f;

      display: flex;
      align-items: center;
      justify-content: space-between;

      ${itemRowVariations(colors).content[variation]}
    `}
  `,
  Selector: styled.div<IAsideItemRowSelectorProps>`
    ${({ colors }) => css`
      display: flex;
      align-items: center;
      justify-content: space-between;

      div {
        padding: 0 4px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        strong {
          color: ${colors.font.title};
          font-size: 14px;
          font-weight: normal;
        }
      }

      svg {
        stroke: ${colors.font.title};
      }
    `}
  `,
  ColorPicker: styled.div<IAsideItemRowColorPickerProps>`
    ${({ colors, color = 'red' }) => css`
      width: 22px;
      height: 22px;

      border-radius: 2px;
      border: 1px solid ${colors.background};
      background: ${color};

      transition: filter 200ms;

      &:hover {
        filter: brightness(1.4);
      }
    `}
  `,
};

export const ViewportData = styled.div``;

/**
 * Component: CalendarRow
 */
export const CalendarRowStyles = {
  Container: styled.div`
    ${() => css`
      width: 100%;

      position: relative;

      display: flex;
    `}
  `,
};

/**
 * Component: Day
 */
interface ITimelineDayContainerProps {
  colors: Colors;
  isWeekend: boolean;
}

export const TimelineDayStyles = {
  Container: styled.button<ITimelineDayContainerProps>`
    ${({ isWeekend, colors }) => css`
      /* Dimensions */
      width: 47px;
      min-width: 47px;
      height: 47px;
      min-height: 47px;

      /* Visual */
      outline: 1px solid ${colors.background};
      border: none;
      /* outline: 1px solid red; */
      background: ${isWeekend ? colors.weekend : colors.primary};

      /* Positioning */
      position: relative;

      /* Alignments */
      display: flex;
      align-items: center;
      justify-content: center;

      /* Pointer */
      user-select: none;
      cursor: pointer;

      /* Transitions */
      transition: all 200ms;

      &:hover {
        background: ${transparentize(0.8, colors.hover)};
      }

      span {
        color: ${colors.font.title};
        font-family: Roboto, sans-serif;
      }
    `}
  `,
};

/**
 * Component: Bar
 */
interface ITimelineBarContainerProps {
  color: string;
  startDateIsLess?: boolean;
  endDateIsGreater?: boolean;
}

const Interaction = styled.div`
  width: 14px;
  height: 28px;

  position: relative;

  cursor: e-resize;

  display: flex;
  align-items: center;

  &:after {
    content: '';

    width: 4px;
    height: 20px;

    background: white;

    position: absolute;

    opacity: 0;

    transition: opacity 200ms;
  }
`;

export const TimelineBarStyles = {
  Container: styled.div<ITimelineBarContainerProps>`
    ${({ color, startDateIsLess, endDateIsGreater }) => css`
      min-width: 47px;
      height: 28px;

      border-top-left-radius: ${startDateIsLess ? '0px' : '6px'};
      border-top-right-radius: ${endDateIsGreater ? '0px' : '6px'};
      border-bottom-right-radius: ${endDateIsGreater ? '0px' : '6px'};
      border-bottom-left-radius: ${startDateIsLess ? '0px' : '6px'};
      border: 2px solid ${lighten(0.1, color)};
      background: ${darken(0.05, color)};

      position: absolute;
      top: 23.5px;
      transform: translateY(-14px);

      cursor: pointer;

      transition: border, background 200ms;

      display: flex;
      align-items: center;
      justify-content: space-between;

      &:hover {
        border: 2px solid ${lighten(0.2, color)};
        background: ${color};

        div {
          &::after {
            opacity: 1;
          }
        }
      }
    `}
  `,
  LeftInteraction: styled(Interaction)`
    margin-left: -2px;

    &::after {
      left: 3px;
      border-top-left-radius: 2px;
      border-bottom-left-radius: 2px;
    }
  `,
  RightInteraction: styled(Interaction)`
    margin-right: -2px;

    &::after {
      right: 3px;
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
    }
  `,
};
