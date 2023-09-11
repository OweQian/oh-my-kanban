/** @jsxImportSource @emotion/react */
import {useEffect, useRef, useState} from "react";
import { css } from '@emotion/react';
import {kanbanCardStyles, kanbanCardTitleStyle} from "./KanbanCard";


const KanbanNewCard = ({onSubmit}) => {
  const [title, setTitle] = useState('');
  const inputElement = useRef(null);
  useEffect(() => {
    inputElement.current.focus();
  }, []);
  const handleChange = (e) => setTitle(e.target.value);
  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      onSubmit({title, status: new Date().toString()});
    }
  };

  return (
    <li css={kanbanCardStyles}>
      <h3>添加新卡片</h3>
      <div css={css`
        ${kanbanCardTitleStyle}
        & > input[type="text"] {
          width: 80%;
        }
      `}>
        <input ref={inputElement} type="text" value={title} onChange={handleChange} onKeyDown={handleKeyDown}/>
      </div>
    </li>
  )
}

export default KanbanNewCard;
