function Square(props) {    // функция обработки кнопки
      return (
      <button     // Возвращает кнопку 
        className="square"    // с классом square, обработчиком событий onClick в который передаётся состояние и значение из компонента выше
        onClick={props.onClick}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {     // создаём компонент Broad


  renderSquare(i) {     //фунция фозвращающая елемент Square в котором записаны текущие значаеия 
    return (<Square 
        value = {this.props.squares[i]}
        onClick = {() => this.props.onClick(i)}
        />);
  }

  render() {
    return (
      <div className="board">
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
  hendleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  render() {
    const history = this.state.history;

    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Перейти к ходу #' + move : 'Начать с начала';
      return (
        <li key={move}>
          <button className="transition" 
                  onClick = {() => this.jumpTo(move)}>
          {desc}
          </button>
          <Board 
            squares={history[move].squares}
            onClick={() => this.jumpTo(move)}
          />
        </li>
      );
    });

    let status;
    if (winner){
      status = 'Выиграл игрок: ' + winner;
    } else {
      status = 'Ход игрока: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.hendleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="status">{ status }</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('content')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}