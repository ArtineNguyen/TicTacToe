import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import "bootstrap/dist/css/bootstrap.min.css";
import FacebookLogin from 'react-facebook-login';
import './App.css';

function App() {
  const [board, setBoard] = useState(new Array(9).fill(null))
  const [isOver, setisOver] = useState(null)
  const [winner, setWinner] = useState(null)
  const [currentUser, setcurrentUser] = useState(null)
  const [topScore, settopScore] = useState(null)
  const responseFacebook = (resp) => {
    setcurrentUser({
      name: resp.name,
      email: resp.email,
    })
  }
  const getUser = async () => {
    const response = await fetch('https://ftw-highscores.herokuapp.com/tictactoe-dev')
    const data = await response.json()
    settopScore(data.items)
    console.log(data)
  }

  const resetGame = () => {
    setBoard(new Array(9).fill(null));
    setisOver(false);
    setWinner(null);
    // setisOpen(false);
  }

  const PostUser = async () => {
    let data = new URLSearchParams();
    data.append("player", currentUser.name);
    data.append("score", -1e+99999);
    const url = `https://ftw-highscores.herokuapp.com/tictactoe-dev`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data.toString(),
      json: true
    });
  }

  useEffect(() => {
    getUser()
  }, [])
  return (

    <div className="App">
      <Board board={board} setBoard={setBoard}
        isOver={isOver} setisOver={setisOver}
        winner={winner} setWinner={setWinner}
      />

      <FacebookLogin
        autoLoad={true}
        appId="733592677154644"
        fields="name,email,picture"
        callback={(resp) => responseFacebook(resp)}
      />
      <div>
        <h3>Top Score</h3>
        {topScore && topScore.map(el => (
          <li>
            {el.player} with the score: {el.score}
          </li>
        ))}
      </div>
      <button onClick={()=>{
        PostUser()
      }}>POST</button>

      <button onClick={()=>{resetGame()}}>Reset Game</button>
    </div>
  );
}


function Board(props) {

  const handleClick = (id) => {
    if (props.isOver) return
    let board = props.board.slice()
    let check = board.filter((el) => el === null)
    if (!board[id]) {
      board[id] = (check.length % 2) ? ("x") : ("o");
    }
    else return;
    console.log(board)
    if (board.filter(el => !el).length === 0) props.setisOver(true);
    props.setBoard(board);
    if (decideOutcome(board)) {
      props.setWinner(decideOutcome(board))
      props.setisOver(true)
    }
    console.log(props.winner)
  }

  return (
    <div className="container">
      <div className="board">
        {props.board.map((el, idx) => {
          return <Square key={idx} value={el} id={idx} handleClick={handleClick} />
        })}
      </div>
    </div>
  );
}
function decideOutcome(arr) {
  const PossibleWinningCases = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [0, 4, 8]
  ];
  let Winner = null;
  PossibleWinningCases.map(el => {
    let [a, b, c] = el
    if (arr[a] && arr[a] === arr[b] && arr[a] === arr[c])
      Winner = arr[a]
  })
  return Winner
}

function Square(props) {
  return (
    <div className="square" onClick={() => props.handleClick(props.id)}>
      {props.value}
    </div>
  )
}

export default App;
