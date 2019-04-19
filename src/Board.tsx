import React, { Component } from 'react';
import { List, fromJS, is } from 'immutable';
import { TTile, IBoardProps, IBoardStates, KeyBoardKeys, TNextMoves } from './App-model';
import Tile from './Tile';
import './Board.scss';

class Board extends Component<IBoardProps, IBoardStates> {
    static readonly BOARD_SIZE: number = 4;
    static readonly WINNING_SCORE: number = 2048;
    constructor(props: IBoardProps) {
        super(props);
        this.state = {
            board: this.initialBoard(),
            maxScore: 0,
            isGameFinished: false,
            didLose: false
        };
    }
    render() {
        const board = this.state.board.toJS();
        console.log(board);
        const cells: JSX.Element[] = [];
        for(let i = 0; i < Board.BOARD_SIZE; i++) {
            const cellRow: JSX.Element[] = [];
            for(let j = 0; j < Board.BOARD_SIZE; j++) {
                cellRow.push((
                    <div className='cell' key={j}></div>
                ));
            }
            cells.push((
                <div className='cell-row' key={i}>{cellRow}</div>
            ));
        }

        const tiles: JSX.Element[] = [];
        for(let i = 0; i < Board.BOARD_SIZE; i++) {
            for(let j = 0; j < Board.BOARD_SIZE; j++) {
                const tileData: TTile = board[i][j];
                if(tileData.val !== 0) {
                    tiles.push((
                        <Tile tileData={tileData}></Tile>
                    ));
                }
            }
        }

        return (
            <div className='board'>
                <div className='current-score'>Score: {this.state.maxScore}</div>
                {cells}
                <div className='tile-container'>
                    {tiles}
                </div>       
            </div>
        );
    }

    componentDidMount() {
        document.addEventListener('keydown', this.keyDownHandler, true);
        this.setState({
            maxScore: this.getCurrentScore(this.state.board.toJS())
        });
    }

    componentDidUpdate() {
        if(this.state.isGameFinished) {
            let that = this;
            setTimeout(() => {
                alert(`${that.state.didLose ? 'You Lose, try again' : 'You Won!'}`);
            }, 500);
        }
    }

    private initialBoard = (): List<List<TTile>> => {
        let board: TTile[][] = this.createEmptyBoard();
        this.generateTiles(board, 15);
        return fromJS(board);
    }

    private createEmptyBoard = ():TTile[][] => {
        let board: TTile[][] = [];
        for(let i = 0; i < Board.BOARD_SIZE; i++) {
            let row: TTile[] = [];
            for(let j = 0; j < Board.BOARD_SIZE; j++) {
                row.push({
                    x: i,
                    y: j,
                    val: 0
                })
            }
            board.push(row);
        }
        return board;
    }

    private generateTiles = (board: TTile[][], num: number): void => {
        let counter = num;
        while(counter && this.getTilesNum(board) !== 16) {
            let x: number = Math.ceil(Math.random() * Board.BOARD_SIZE - 1);
            let y: number = Math.ceil(Math.random() * Board.BOARD_SIZE - 1);
            let val: number = this.generateValue();
            if(board[x][y].val === 0) {
                board[x][y] = {x: x, y: y, val: val};
                counter--;
            }
        }
    }

    private generateValue = (): number => {
        return Math.random() > 0.8 ? 4 : 2;
    }

    private keyDownHandler = (e: KeyboardEvent) => {
        if(this.state.isGameFinished) {
            alert(`${this.state.didLose ? 'You Lose, try again' : 'You Won!'}`);
            e.preventDefault();
            return;
        }
        let board = this.state.board.toJS();
        const nextPossibleMoves: TNextMoves = this.nextPossibleMoves(board);
        if (!nextPossibleMoves.up && !nextPossibleMoves.down && !nextPossibleMoves.left && !nextPossibleMoves.right) {
            this.setState({
                isGameFinished: true,
                didLose: true
            })
            e.preventDefault();
            return;
        }

        switch(e.key) {
            case KeyBoardKeys.ARROWUP:
                board = nextPossibleMoves.up ? nextPossibleMoves.up : board;
                break;
            case KeyBoardKeys.ARROWDOWN:
                board = nextPossibleMoves.down ? nextPossibleMoves.down : board;
                break;
            case KeyBoardKeys.ARROWLEFT:
                board = nextPossibleMoves.left ? nextPossibleMoves.left : board;
                break;
            case KeyBoardKeys.ARROWRIGHT:
                board = nextPossibleMoves.right ? nextPossibleMoves.right : board;
                break;
        }
        const maxScore: number = this.getCurrentScore(board);
        this.generateTiles(board, 1);
        const newBoard: List<List<TTile>> = fromJS(board);

        this.setState({
            board: newBoard,
            maxScore: maxScore,
            isGameFinished: maxScore === Board.WINNING_SCORE
        });

        e.preventDefault();
    }

    private moveTilesHelperLeft = (board: TTile[][]): TTile[][] => {
        const newBoard = JSON.parse(JSON.stringify(board));
        for(let row_idx = 0; row_idx < Board.BOARD_SIZE; row_idx++){           
            for(let i = 1, j = 0; i < Board.BOARD_SIZE; i++) {
                if(newBoard[row_idx][i].val === 0) {
                    continue;
                }

                if(newBoard[row_idx][j].val === 0) {
                    newBoard[row_idx][j].val = newBoard[row_idx][i].val;
                    newBoard[row_idx][i].val = 0;
                    continue;
                }
                if(newBoard[row_idx][j].val === newBoard[row_idx][i].val) {
                    newBoard[row_idx][j].val = newBoard[row_idx][j].val * 2;
                    newBoard[row_idx][i].val = 0;
                    continue;
                }
                if(newBoard[row_idx][j].val !== newBoard[row_idx][i].val) {
                    j++;
                    if(j === i) {
                        continue;
                    } else {
                        newBoard[row_idx][j].val = newBoard[row_idx][i].val;
                        newBoard[row_idx][i].val = 0;
                        continue;
                    }
                }
            }
        }
        return newBoard;
    }

    private moveTilesHelperRight = (board: TTile[][]): TTile[][] => {
        const newBoard = JSON.parse(JSON.stringify(board));
        for(let row_idx = 0; row_idx < Board.BOARD_SIZE; row_idx++){           
            for(let i = Board.BOARD_SIZE - 2, j = Board.BOARD_SIZE -1; i >= 0; i--) {
                if(newBoard[row_idx][i].val === 0) {
                    continue;
                }

                if(newBoard[row_idx][j].val === 0) {
                    newBoard[row_idx][j].val = newBoard[row_idx][i].val;
                    newBoard[row_idx][i].val = 0;
                    continue;
                }
                if(newBoard[row_idx][j].val === newBoard[row_idx][i].val) {
                    newBoard[row_idx][j].val = newBoard[row_idx][j].val * 2;
                    newBoard[row_idx][i].val = 0;
                    continue;
                }
                if(newBoard[row_idx][j].val !== newBoard[row_idx][i].val) {
                    j--;
                    if(j === i) {
                        continue;
                    } else {
                        newBoard[row_idx][j].val = newBoard[row_idx][i].val;
                        newBoard[row_idx][i].val = 0;
                        continue;
                    }
                }
            }
        }
        return newBoard;
    }

    private moveTilesHelperUp = (board: TTile[][]): TTile[][] => {
        const newBoard = JSON.parse(JSON.stringify(board));
        for(let col_idx = 0; col_idx < Board.BOARD_SIZE; col_idx++){           
            for(let i = 1, j = 0; i < Board.BOARD_SIZE; i++) {
                if(newBoard[i][col_idx].val === 0) {
                    continue;
                }

                if(newBoard[j][col_idx].val === 0) {
                    newBoard[j][col_idx].val = newBoard[i][col_idx].val;
                    newBoard[i][col_idx].val = 0;
                    continue;
                }
                if(newBoard[j][col_idx].val === newBoard[i][col_idx].val) {
                    newBoard[j][col_idx].val = newBoard[j][col_idx].val * 2;
                    newBoard[i][col_idx].val = 0;
                    continue;
                }
                if(newBoard[j][col_idx].val !== newBoard[i][col_idx].val) {
                    j++;
                    if(j === i) {
                        continue;
                    } else {
                        newBoard[j][col_idx].val = newBoard[i][col_idx].val;
                        newBoard[i][col_idx].val = 0;
                        continue;
                    }
                }
            }
        }
        return newBoard;
    }

    private moveTilesHelperDown = (board: TTile[][]): TTile[][] => {
        const newBoard = JSON.parse(JSON.stringify(board));
        for(let col_idx = 0; col_idx < Board.BOARD_SIZE; col_idx++){           
            for(let i = Board.BOARD_SIZE - 2, j = Board.BOARD_SIZE -1; i >= 0; i--) {
                if(newBoard[i][col_idx].val === 0) {
                    continue;
                }

                if(newBoard[j][col_idx].val === 0) {
                    newBoard[j][col_idx].val = newBoard[i][col_idx].val;
                    newBoard[i][col_idx].val = 0;
                    continue;
                }
                if(newBoard[j][col_idx].val === newBoard[i][col_idx].val) {
                    newBoard[j][col_idx].val = newBoard[j][col_idx].val * 2;
                    newBoard[i][col_idx].val = 0;
                    continue;
                }
                if(newBoard[j][col_idx].val !== newBoard[i][col_idx].val) {
                    j--;
                    if(j === i) {
                        continue;
                    } else {
                        newBoard[j][col_idx].val = newBoard[i][col_idx].val;
                        newBoard[i][col_idx].val = 0;
                        continue;
                    }
                }
            }
        }
        return newBoard;
    }

    private getCurrentScore = (board: TTile[][]): number => {
        let temp: TTile[] = [];
        for(let i = 0; i < Board.BOARD_SIZE; i++) {
            temp.push(board[i].reduce(reducer));
        }

        return temp.reduce(reducer).val;

        function reducer(accumulator: TTile, currentValue: TTile) {
            return accumulator.val > currentValue.val ? accumulator : currentValue;
        }
    }

    private getTilesNum = (board: TTile[][]): number => {
        let num: number = 0;
        for(let i = 0; i < Board.BOARD_SIZE; i++) {
            for(let j = 0; j < Board.BOARD_SIZE; j++) {
                if(board[i][j].val > 0) {
                    num++;
                }
            }
        }
        return num;
    }

    private nextPossibleMoves = (board: TTile[][]): TNextMoves => {
        const result = {};
        const board_stringfy = JSON.stringify(board);
        const upMove: TTile[][] = this.moveTilesHelperUp(board);
        const downMove: TTile[][] = this.moveTilesHelperDown(board);
        const leftMove: TTile[][] = this.moveTilesHelperLeft(board);
        const rightMove: TTile[][] = this.moveTilesHelperRight(board);
        return {
            up: JSON.stringify(upMove) === board_stringfy ? null : upMove,
            down: JSON.stringify(downMove) === board_stringfy ? null : downMove,
            left: JSON.stringify(leftMove) === board_stringfy ? null : leftMove,
            right: JSON.stringify(rightMove) === board_stringfy ? null : rightMove, 
        }
    }
}

export default Board;