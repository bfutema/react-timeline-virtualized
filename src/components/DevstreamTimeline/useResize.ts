import { useRef, useEffect, useCallback, RefObject } from 'react';

interface IParams {
  onDown?: () => void;
  onResize: (position: number, direction: number) => void;
  onUp?: () => void;
  snap?: number;
  elementKey?: string;
}

function useResize(
  ref: RefObject<HTMLDivElement>,
  { snap = 1, onDown, onResize, onUp, elementKey }: IParams,
  parentRef?: RefObject<HTMLDivElement>,
) {
  const isResizingRef = useRef<boolean>(false);

  const xOnStart = useRef<number>(0);

  const getSnapPosition = useCallback(
    (dx: number) => dx - (dx % snap) + (dx % snap < snap / 2 ? 0 : snap),
    [snap],
  );

  const onMouseDown = useCallback(
    (e: globalThis.MouseEvent) => {
      if (onDown) onDown();

      if (!isResizingRef.current) {
        isResizingRef.current = true;

        if (parentRef) {
          if (parentRef.current) {
            const { left } = parentRef.current.getBoundingClientRect();

            xOnStart.current = Number(e.pageX) - left;
          }

          return;
        }

        xOnStart.current = Number(e.pageX);
      }
    },
    [onDown, parentRef],
  );

  const onMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      e.stopPropagation();

      if (!isResizingRef.current) return;

      if (parentRef) {
        if (parentRef.current) {
          const { left } = parentRef.current.getBoundingClientRect();

          const dx = Number(e.pageX) - left;

          let position = getSnapPosition(dx);

          const foundedElement = document.getElementById(elementKey || '');

          if (foundedElement) {
            const { scrollLeft } = foundedElement;

            position += getSnapPosition(scrollLeft);
          }

          onResize(position, e.movementX);
        }

        return;
      }

      const dx = Number(e.pageX);

      const position = getSnapPosition(dx);

      onResize(position, e.movementX);
    },
    [elementKey, parentRef, getSnapPosition, onResize],
  );

  const onMouseUp = useCallback(() => {
    if (isResizingRef.current) {
      isResizingRef.current = false;

      xOnStart.current = 0;

      if (onUp) onUp();
    }
  }, [onUp]);

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('mousedown', onMouseDown);

      if (parentRef) {
        if (parentRef.current) {
          parentRef.current.addEventListener('mousemove', onMouseMove);
          parentRef.current.addEventListener('mouseup', onMouseUp);
        }
      } else {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      }
    }
  }, [ref, parentRef, onMouseDown, onMouseMove, onMouseUp]);
}

export { useResize };
