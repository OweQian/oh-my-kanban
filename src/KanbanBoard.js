/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {useState} from "react";
import KanbanColumn from "./KanbanColumn";

const COLUMN_BG_COLORS = {
  loading: '#E3E3E3',
  todo: '#C9AF97',
  ongoing: '#FFE799',
  done: '#C0E8BA'
}

const kanbanBoardStyles = css`
  flex: 10;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin: 0 1rem 1rem;
`;

export const COLUMN_KEY_TODO = 'todo';
export const COLUMN_KEY_ONGOING = 'ongoing';
export const COLUMN_KEY_DONE = 'done';

const KanbanBoard = ({isLoading = true, todoList, ongoingList, doneList, onAdd, onRemove}) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragSource, setDragSource] = useState(null);
  const [dragTarget, setDragTarget] = useState(null);
  const handleDrop = (evt) => {
    if (!draggedItem || !dragSource || !dragTarget || dragTarget === dragSource) {
      return;
    }
    dragSource && onRemove(dragSource, draggedItem);
    dragTarget && onAdd(dragTarget, draggedItem);
  }
  return (
    <main css={kanbanBoardStyles}>
      {isLoading ? <KanbanColumn title="读取中..." bgColor={COLUMN_BG_COLORS.loading} />
        : (
          <>
            <KanbanColumn
              cardList={todoList}
              setDraggedItem={setDraggedItem}
              onDrop={handleDrop}
              setIsDragTarget={(isTgt) => setDragTarget(isTgt ? COLUMN_KEY_TODO : null)}
              setIsDragSource={(isSrc) => setDragSource(isSrc ? COLUMN_KEY_TODO : null)}
              bgColor={COLUMN_BG_COLORS.todo}
              title="待处理"
              canAddNew
              onAdd={onAdd.bind(null, COLUMN_KEY_TODO)}>
            </KanbanColumn>
            <KanbanColumn
              setDraggedItem={setDraggedItem}
              cardList={ongoingList}
              onDrop={handleDrop}
              setIsDragTarget={(isTgt) => setDragTarget(isTgt ? COLUMN_KEY_ONGOING : null)}
              setIsDragSource={(isSrc) => setDragSource(isSrc ? COLUMN_KEY_ONGOING : null)}
              bgColor={COLUMN_BG_COLORS.ongoing}
              title="进行中">
            </KanbanColumn>
            <KanbanColumn
              onRemove={onRemove.bind(null, COLUMN_KEY_DONE)}
              onDrop={handleDrop}
              cardList={doneList}
              setDraggedItem={setDraggedItem}
              setIsDragTarget={(isTgt) => setDragTarget(isTgt ? COLUMN_KEY_DONE : null)}
              setIsDragSource={(isSrc) => setDragSource(isSrc ? COLUMN_KEY_DONE : null)}
              bgColor={COLUMN_BG_COLORS.done}
              title="已完成">
            </KanbanColumn>
          </>
        )}
    </main>
  )
};

export default KanbanBoard;
