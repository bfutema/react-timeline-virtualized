import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: calc(100vh - 216px);

  background: #0a192f;

  position: absolute;
  bottom: 0;

  * {
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
`;

export const Calendar = styled.div`
  > div:nth-of-type(1) {
    width: 100% !important;
    height: 100%;
  }
`;
