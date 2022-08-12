import styled from 'styled-components';

export const Container = styled.div`
  width: 100vw;

  position: absolute;
  bottom: 0;
  left: 0;

  gap: 8px;
  display: flex;
  flex-direction: column;
`;

export const ContentBox = styled.div`
  width: 100vw;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  overflow: auto;
  background: white;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

export const ScrollContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;

  background: #232b47;
`;

export const ScrollContentHeader = styled.div`
  flex: 0 0 47px;
  z-index: 10;
  position: absolute;
  left: 0;
  top: 0;
`;

export const ScrollContentAside = styled.div`
  flex: 0 0 47px;
  z-index: 10;
  position: absolute;
  left: 0;

  div {
    overflow: hidden !important;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
`;

export const ScrollContentCalendar = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;

  background: #232b47;

  div {
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
`;
