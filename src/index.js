import lodash from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';

import './style.css';

function Square(props) {
    return (
        <button className={props.winner ? 'square winner' : 'square'} onClick={()=>props.onClick()}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        let winner = this.props.winners.find(item => item === i) !== undefined;
        return <Square value={this.props.squares[i]} onClick={()=>this.props.onClick(i)} winner={winner} />;
    }

    getRow(start) {
        let squares = lodash.range(start, start+3).map(item => {
            return (
                <span key={item}>{this.renderSquare(item)}</span>
            );
        });
        return (
            <div key={start} className="board-row">{squares}</div>
        );
    }

    render() {
        let board = lodash.range(0, 9, 3).map(item => {
            return this.getRow(item);
        });
        return (
            <div>
                {board}
            </div>
        );
    }
}

class Game extends React.Component {

    constructor() {
        super();
        this.state = this.getInitState();
    }

    getInitState() {
        return {
            history: [
                {squares: new Array(9).fill(null)}
            ],
            xIsNext: true,
            stepNumber: 0,
        }
    }

    handleClick(i) {
        let history = this.state.history;
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        // click during travelling through history happened - remove rest of the history
        if (this.state.stepNumber !== history.length - 1) {
            history = history.slice(0, this.state.stepNumber+1);
        }

        squares[i] = this.nextPlayer();
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    replay() {
        this.setState(this.getInitState());
    }

    render() {
        const history = this.state.history.slice();
        const current = history[this.state.stepNumber];
        const winners = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Move #' + move :
                'Game start';
            return (
                <li key={move}>
                    <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
                </li>
            );
        });

        let status = this.getStatus(winners, current.squares);

        function _get_winners(w) {
            return w ? w : [null, null, null];
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={i => this.handleClick(i)} winners={_get_winners(winners)}/>
                </div>
                <div className="game-info">
                    <div><a href="#" onClick={() => this.replay()}>Replay</a></div>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }

    getStatus(winners, squares) {
        let status;

        if (winners){
            status = 'Winner: ' + this.currentPlayer();
        }
        else if (squares.find(x => x === null) === undefined) {
            status = 'No more moves left';
        }
        else {
            status = 'Next player: ' + this.nextPlayer();
        }
        return status;
    }

    currentPlayer() {
        return this.state.xIsNext ? 'O' : 'X';
    }

    nextPlayer() {
        return this.state.xIsNext ? 'X' : 'O';
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: !(step % 2),
        });
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('container')
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
            return [a, b, c];
        }
    }
    return null;
}
