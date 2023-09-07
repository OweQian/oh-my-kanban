/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const kanbanBoardStyles = css`
  flex: 10;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin: 0 1rem 1rem;
`;

const KanbanBoard = ({children}) => (<main css={kanbanBoardStyles}>{children}</main>)

export default KanbanBoard;
