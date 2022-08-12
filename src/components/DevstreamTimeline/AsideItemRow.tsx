import React, { useCallback, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { format } from 'date-fns';
import locale from 'date-fns/locale/pt-BR';

import { IColors } from './index';
import { ITimelineRow } from './interfaces';
import { toHMS } from './toHMS';

import { AsideItemRowStyles, Full } from './styles';

interface IAsideItemRowProps {
  colors: Full<IColors>;
  selectedMonth: Date;
  item?: ITimelineRow;
  isShowContent?: boolean;
}

const AsideItemRow: React.FC<IAsideItemRowProps> = ({
  colors,
  selectedMonth,
  item,
  isShowContent = false,
}) => {
  const transformHours = useCallback((hours: number) => {
    if (hours === 0) return '00h';

    const parsedHours = toHMS(hours);

    const parsedArray = parsedHours.split(':');

    const H = parsedArray[0];
    const M = parsedArray[1];
    // const S = parsedArray[2];

    return `${H}h ${M}m`;
  }, []);

  const variations = useMemo(() => {
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

    return {
      HEADER: (
        <AsideItemRowStyles.Content variation="HEADER" colors={colors}>
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
        <AsideItemRowStyles.Content variation="PROJECT" colors={colors}>
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
        <AsideItemRowStyles.Content variation="USER" colors={colors}>
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
        <AsideItemRowStyles.Content variation="EMPTY" colors={colors}>
          <div />
        </AsideItemRowStyles.Content>
      ),
      LOADING: (
        <AsideItemRowStyles.Content variation="LOADING" colors={colors}>
          <div />
        </AsideItemRowStyles.Content>
      ),
    };
  }, [colors, isShowContent, item, selectedMonth, transformHours]);

  return (
    <AsideItemRowStyles.Container colors={colors}>
      {variations[item?.variation || 'HEADER']}
    </AsideItemRowStyles.Container>
  );
};

export { AsideItemRow };
