import React, { Component } from 'react';
import { List, fromJS, is } from 'immutable';
import { TTile, IBoardProps, IBoardStates, KeyBoardKeys, TNextMoves, TouchDirection } from './App-model';
import Tile from './Tile';
import './Board.scss';

class Board extends Component<IBoardProps, IBoardStates> {
    static readonly BOARD_SIZE: number = 4;
    static readonly WINNING_SCORE: number = 2048;
    private _touchObj = {
        startX: 0,
        startY: 0,
        distX: 0,
        distY: 0,
        threshold: 50,
        startTime: 0,
        allowedTime: 1000
    }
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
                        <Tile tileData={tileData} key={Board.BOARD_SIZE * i + j}></Tile>
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
        document.addEventListener('touchstart', this.touchStart, true);
        document.addEventListener('touchend', this.touchEnd, true);
        document.addEventListener('touchmove', (e) => {
            e.preventDefault()
        }, {passive: false});
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
        this.generateTiles(board, 2);
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

    private keyDownHandler = (e: KeyboardEvent): void => {
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

    private touchStart = (e: TouchEvent): void => {
        const touchObj: Touch = e.changedTouches[0];
        this._touchObj.startX = touchObj.pageX;
        this._touchObj.startY = touchObj.pageY;
        this._touchObj.startTime = e.timeStamp;
    }

    private touchEnd = (e: TouchEvent): void => {
        let swipeDir: string = '';
        const touchObj: Touch = e.changedTouches[0];
        this._touchObj.distX = touchObj.pageX - this._touchObj.startX;
        this._touchObj.distY = touchObj.pageY - this._touchObj.startY;
        const dist: number = Math.sqrt(this._touchObj.distX * this._touchObj.distX + this._touchObj.distY * this._touchObj.distY);
        if((e.timeStamp - this._touchObj.startTime) <= this._touchObj.allowedTime && dist >= this._touchObj.threshold) {
            if(Math.abs(this._touchObj.distX) > Math.abs(this._touchObj.distY)) {
                swipeDir = this._touchObj.distX > 0 ? TouchDirection.SWIPERIGHT : TouchDirection.SWIPELEFT;
            } else {
                swipeDir = this._touchObj.distY > 0 ? TouchDirection.SWIPEDOWN : TouchDirection.SWIPEUP;
            }
        }
        this.touchHandler(swipeDir);
    }

    private touchHandler = (direction: string) => {
        if(this.state.isGameFinished) {
            alert(`${this.state.didLose ? 'You Lose, try again' : 'You Won!'}`);
            return;
        }
        let board = this.state.board.toJS();
        const nextPossibleMoves: TNextMoves = this.nextPossibleMoves(board);
        if (!nextPossibleMoves.up && !nextPossibleMoves.down && !nextPossibleMoves.left && !nextPossibleMoves.right) {
            this.setState({
                isGameFinished: true,
                didLose: true
            })
            return;
        }

        switch(direction) {
            case TouchDirection.SWIPEUP:
                board = nextPossibleMoves.up ? nextPossibleMoves.up : board;
                break;
            case TouchDirection.SWIPEDOWN:
                board = nextPossibleMoves.down ? nextPossibleMoves.down : board;
                break;
            case TouchDirection.SWIPELEFT:
                board = nextPossibleMoves.left ? nextPossibleMoves.left : board;
                break;
            case TouchDirection.SWIPERIGHT:
                board = nextPossibleMoves.right ? nextPossibleMoves.right : board;
                break;
            default:
                return;
        }
        const maxScore: number = this.getCurrentScore(board);
        this.generateTiles(board, 1);
        const newBoard: List<List<TTile>> = fromJS(board);

        this.setState({
            board: newBoard,
            maxScore: maxScore,
            isGameFinished: maxScore === Board.WINNING_SCORE
        });
    }
}

export default Board;