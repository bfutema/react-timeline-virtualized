import { RefObject, useCallback, useEffect, useRef } from 'react';

function useSynchronizedDragScroll({
  ref,
  velocity = 3,
  elementKey,
  targetRef,
  directions,
}: {
  ref: RefObject<HTMLDivElement>;
  velocity?: number;
  elementKey?: string;
  targetRef?: RefObject<HTMLDivElement>;
  directions?: 'horizontal' | 'vertical' | 'both';
}) {
  const pxToScrollRef = useRef<number>(velocity);

  const isDownRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);
  const scrollTopRef = useRef<number>(0);
  const scrollLeftRef = useRef<number>(0);

  const onMouseDown = useCallback(
    (e: globalThis.MouseEvent) => {
      if (ref.current) {
        const element = document.getElementById(elementKey || '');
        const enabled = element ? !element.classList.contains('enabled') : true;

        if (enabled) {
          ref.current.style.cursor = 'grabbing';
          isDownRef.current = true;

          if (directions === 'horizontal' || directions === 'both') {
            startXRef.current = e.pageX - ref.current.offsetLeft;
            scrollLeftRef.current = ref.current.scrollLeft;
          }

          if (directions === 'vertical' || directions === 'both') {
            startYRef.current = e.pageY - ref.current.offsetTop;
            scrollTopRef.current = ref.current.scrollTop;
          }
        }
      }
    },
    [directions, elementKey, ref],
  );

  const onMouseLeave = useCallback(() => {
    isDownRef.current = false;
    if (ref.current) {
      const element = document.getElementById(elementKey || '');

      const enabled = element ? !element.classList.contains('enabled') : true;

      if (enabled) {
        ref.current.style.cursor = 'grab';
      }
    }
  }, [elementKey, ref]);

  const onMouseUp = useCallback(() => {
    isDownRef.current = false;
    if (ref.current) {
      const element = document.getElementById(elementKey || '');

      const enabled = element ? !element.classList.contains('enabled') : true;

      if (enabled) {
        ref.current.style.cursor = 'grab';
      }
    }
  }, [elementKey, ref]);

  const onMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      if (isDownRef.current) {
        if (ref.current) {
          const element = document.getElementById(elementKey || '');

          const enabled = element
            ? !element.classList.contains('enabled')
            : true;

          if (enabled) {
            if (directions === 'horizontal' || directions === 'both') {
              const x = e.pageX - ref.current.offsetLeft;
              const walkX = (x - startXRef.current) * pxToScrollRef.current;
              ref.current.scrollLeft = scrollLeftRef.current - walkX;

              if (targetRef) {
                if (targetRef.current) {
                  targetRef.current.scrollLeft = ref.current.scrollLeft;
                }
              }
            }

            if (directions === 'vertical' || directions === 'both') {
              const y = e.pageY - ref.current.offsetTop;
              const walkY = (y - startYRef.current) * pxToScrollRef.current;

              ref.current.scrollTop = scrollTopRef.current - walkY;

              if (targetRef) {
                if (targetRef.current) {
                  targetRef.current.scrollTop = ref.current.scrollTop;
                }
              }
            }
          }
        }
      }

      e.preventDefault();
    },
    [directions, elementKey, targetRef, ref],
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.style.cursor = 'grab';

      ref.current.addEventListener('mousedown', onMouseDown);
      ref.current.addEventListener('mouseleave', onMouseLeave);
      ref.current.addEventListener('mouseup', onMouseUp);
      ref.current.addEventListener('mousemove', onMouseMove);
    }
  }, [onMouseDown, onMouseLeave, onMouseMove, onMouseUp, ref]);
}

export { useSynchronizedDragScroll };
