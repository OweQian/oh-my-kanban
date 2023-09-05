/** @jsxImportSource @emotion/react */
import logo from './logo.svg';
import { css } from '@emotion/react';
import './App.css';
import {useEffect, useRef, useState} from "react";

const KanbanBoard = ({children}) => (<main css={css`
  flex: 10;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin: 0 1rem 1rem;
`}>{children}</main>)

const KanbanColumn = ({children, bgColor, title}) => {
  return (
    <section css={
      css`
        flex: 1 1;
        display: flex;
        flex-direction: column;
        border: 1px solid gray;
        border-radius: 1rem;
        background-color: ${bgColor};
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
    `}>
      <h2>{title}</h2>
      <ul>{children}</ul>
    </section>
  )
}

const kanbanCardStyles = css`
  margin-bottom: 1rem;
  padding: 0.6rem 1rem;
  border: 1px solid gray;
  border-radius: 1rem;
  list-style: none;
  background-color: rgba(255, 255, 255, 0.4);
  text-align: left;
  &:hover {
    box-shadow: 0 .2rem .2rem rgba(0, 0, 0, .2), inset 0 1px #fff;
  }
`

const kanbanCardTitleStyle = css`
  min-height: 3rem;
`
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const UPDATE_INTERVAL = MINUTE;

const KanbanCard = ({title, status}) => {
  const [displayTime, setDisplayTime] = useState(status);
  useEffect(() => {
    const updateDisplayTime = () => {
      const timePassed = new Date() - new Date(status);
      let relativeTime = '刚刚';
      if (MINUTE <= timePassed && timePassed < HOUR) {
        relativeTime = `${Math.ceil(timePassed / MINUTE)} 分钟前`;
      } else if (HOUR <= timePassed && timePassed < DAY) {
        relativeTime = `${Math.ceil(timePassed / HOUR)} 小时前`;
      } else if (DAY <= timePassed) {
        relativeTime = `${Math.ceil(timePassed / DAY)} 天前`;
      }
      setDisplayTime(relativeTime);
    };

    const intervalId = setInterval(updateDisplayTime, UPDATE_INTERVAL);
    updateDisplayTime();
    return () => {
      clearInterval(intervalId);
    }
  }, [status]);

  return (
    <li css={kanbanCardStyles}>
      <div css={kanbanCardTitleStyle}>{title}</div>
      <div css={css`
        text-align: right;
        font-size: 0.8rem;
        color: #333;
      `} title={status}>{displayTime}</div>
    </li>
  )
}

const KanbanNewCard = ({onSubmit}) => {
  const [title, setTitle] = useState('');
  const inputElement = useRef(null);
  useEffect(() => {
    inputElement.current.focus();
  }, []);
  const handleChange = (e) => setTitle(e.target.value);
  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      onSubmit(title);
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
const COLUMN_BG_COLORS = {
  loading: '#E3E3E3',
  todo: '#C9AF97',
  ongoing: '#FFE799',
  done: '#C0E8BA'
}

const DATA_STORE_KEY = 'kanban-data-store';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [todoList, setTodoList] = useState([
    { title: '开发任务-1', status: '2023-08-30 18:15' },
    { title: '开发任务-3', status: '2023-08-30 18:15' },
    { title: '开发任务-5', status: '2023-08-30 18:15' },
    { title: '测试任务-3', status: '2023-08-30 18:15' }
  ]);
  const [ongoingList, setOngoingList] = useState([
    { title: '开发任务-4', status: '2023-08-24 18:15' },
    { title: '开发任务-6', status: '2023-08-24 18:15' },
    { title: '测试任务-2', status: '2023-08-24 18:15' }
  ]);
  const [doneList, setDoneList] = useState([
    { title: '开发任务-2', status: '2023-08-22 18:15' },
    { title: '测试任务-1', status: '2023-08-22 18:15' }
  ])
  useEffect(() => {
    const data = window.localStorage.getItem(DATA_STORE_KEY);
    setTimeout(() => {
      if (data) {
        const kanbanColumnData = JSON.parse(data);
        setTodoList(kanbanColumnData.todoList);
        setOngoingList(kanbanColumnData.ongoingList);
        setDoneList(kanbanColumnData.doneList);
      }
      setIsLoading(false);
    }, 1000);
  }, []);
  const handleAdd = (e) => {
    setShowAdd(true);
  };
  const handleSubmit = (title) => {
    setTodoList(currentTodoList => [
      {title, status: new Date().toDateString()},
      ...currentTodoList,
    ])
    setShowAdd(false);
  }
  const handleSaveAll = () => {
    const data = JSON.stringify({
      todoList,
      ongoingList,
      doneList,
    });
    window.localStorage.setItem(DATA_STORE_KEY, data);
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>我的看板 <button onClick={handleSaveAll}>保存所有卡片</button></h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <KanbanBoard>
        {isLoading ? <KanbanColumn title="读取中..." bgColor={COLUMN_BG_COLORS.loading} />
         : (
          <>
            <KanbanColumn bgColor={COLUMN_BG_COLORS.todo} title={<>待处理<button onClick={handleAdd} disabled={showAdd}>⊕ 添加新卡片</button></>}>
              {showAdd && <KanbanNewCard onSubmit={handleSubmit} />}
              {
                todoList.map(props => <KanbanCard key={props.title} {...props} />)
              }
            </KanbanColumn>
            <KanbanColumn bgColor={COLUMN_BG_COLORS.ongoing} title="进行中">
              {
                ongoingList.map(props => <KanbanCard key={props.title} {...props} />)
              }
            </KanbanColumn>
            <KanbanColumn bgColor={COLUMN_BG_COLORS.done} title="已完成">
              {
                doneList.map(props => <KanbanCard key={props.title} {...props} />)
              }
            </KanbanColumn>
          </>
        )}
      </KanbanBoard>
    </div>
  );
}

export default App;
