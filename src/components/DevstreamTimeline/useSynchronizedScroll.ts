import { RefObject, useEffect } from 'react';

function useSynchronizedScroll({
  refs: elements,
  scrollType,
  elementKey,
}: {
  refs: { ref: RefObject<HTMLDivElement>; id: string; targetId: string }[];
  scrollType?: 'HORIZONTAL' | 'VERTICAL' | 'BOTH';
  elementKey?: string;
}) {
  useEffect(() => {
    const element = document.getElementById(elementKey || '');
    const enabled = element ? !element.classList.contains('enabled') : true;

    if (enabled) {
      elements.forEach(el => {
        if (el.ref.current) {
          const onScroll = (e: any) => {
            const viewPortData: any = document.getElementById(el.targetId);

            const { target } = e;

            if (target.id === el.id) {
              if (scrollType === 'VERTICAL') {
                viewPortData.scrollTop = target.scrollTop;
              }

              if (scrollType === 'HORIZONTAL') {
                viewPortData.scrollLeft = target.scrollLeft;
              }

              if (scrollType === 'BOTH') {
                viewPortData.scrollTop = target.scrollTop;
                viewPortData.scrollLeft = target.scrollLeft;
              }
            }
          };

          el.ref.current.addEventListener('mouseenter', () => {
            el.ref.current?.addEventListener('scroll', onScroll);
          });

          el.ref.current.addEventListener('mouseleave', () => {
            el.ref.current?.removeEventListener('scroll', onScroll);
          });
        }
      });
    } else {
      elements.forEach(el => {
        if (el.ref.current) {
          const onScroll = (e: any) => {
            const viewPortData: any = document.getElementById(el.targetId);

            const { target } = e;

            if (target.id === el.id) {
              if (scrollType === 'VERTICAL') {
                viewPortData.scrollTop = target.scrollTop;
              }

              if (scrollType === 'HORIZONTAL') {
                viewPortData.scrollLeft = target.scrollLeft;
              }

              if (scrollType === 'BOTH') {
                viewPortData.scrollTop = target.scrollTop;
                viewPortData.scrollLeft = target.scrollLeft;
              }
            }
          };

          el.ref.current.removeEventListener('mouseenter', () => {
            el.ref.current?.removeEventListener('scroll', onScroll);
          });

          el.ref.current.removeEventListener('mouseleave', () => {
            el.ref.current?.removeEventListener('scroll', onScroll);
          });
        }
      });
    }
  }, [elementKey, elements, scrollType]);
}

export { useSynchronizedScroll };
