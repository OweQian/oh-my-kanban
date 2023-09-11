/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import KanbanCard from "./KanbanCard";
import {useState} from "react";
import KanbanNewCard from "./KanbanNewCard";

const kanbanColumnStyles = css`
  flex: 1 1;
  display: flex;
  flex-direction: column;
  border: 1px solid gray;
  border-radius: 1rem;
  & > h2 {
    margin: .6rem 1rem;
    padding-bottom: .6rem;
    border-bottom: 1px solid gray;
    & > button {
      float: right;
      margin-top: 0.2rem;
      padding: 0.2rem 0.5rem;
      border: 0;
      border-radius: 1rem;
      height: 1.8rem;
      line-height: 1rem;
      font-size: 1rem;
    }
  }  
  & > ul {
    flex: 1;
    flex-basis: 0;
    margin: 1rem;
    padding: 0;
    overflow: auto;
  }  
`;

const KanbanColumn = ({bgColor, title, onDrop, setIsDragSource = () => {}, setIsDragTarget = () => {}, cardList = [], setDraggedItem, canAddNew, onAdd}) => {
  const [showAdd, setShowAdd] = useState(false);
  const handleAdd = (e) => {
    setShowAdd(true);
  };
  const handleSubmit = (newCard) => {
    onAdd && onAdd(newCard)
    setShowAdd(false);
  }
  return (
    <section
      onDragStart={() => setIsDragSource(true)}
      onDragEnd={(evt) => {
        evt.preventDefault();
        setIsDragTarget(false);
        setIsDragSource(false);
      }}
      onDragOver={(evt) => {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'move';
        setIsDragTarget(true);
      }}
      onDragLeave={(evt) => {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'none';
        setIsDragTarget(false);
      }}
      onDrop={(evt) => {
        evt.preventDefault();
        onDrop && onDrop(evt);
      }}
      css={css`
        ${kanbanColumnStyles}
        background-color: ${bgColor};
      `}>
      <h2>
        {title}
        {
          canAddNew && (
            <button onClick={handleAdd} disabled={showAdd}>⊕ 添加新卡片</button>
          )
        }
      </h2>
      <ul>
        {canAddNew && showAdd && <KanbanNewCard onSubmit={handleSubmit} />}
        {
          cardList.map(props => <KanbanCard onDragStart={() => setDraggedItem && setDraggedItem(props)} key={props.title} {...props} />)
        }
      </ul>
    </section>
  )
}

export default KanbanColumn;
