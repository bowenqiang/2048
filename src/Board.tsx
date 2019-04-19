import React, { Component } from 'react';
import { List, fromJS, is } from 'immutable';
import { TTile, IBoardProps, IBoardStates, KeyBoardKeys } from './App-model';
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
                {cells}
                <div className='tile-container'>
                    {tiles}
                </div>       
            </div>
        );
    }

    componentDidMount() {
        // this.initialBoard();
        document.addEventListener('keydown', this.keyDownHandler, true);
    }

    componentDidUpdate() {
        if(this.state.maxScore === Board.WINNING_SCORE) {
            let that = this;
            setTimeout(() => {
                alert(`${that.state.didLose ? 'You Lose, try again' : 'You Won!'}`);
            }, 500);
        }
    }

    private initialBoard = (): List<List<TTile>> => {
        let board: TTile[][] = this.createEmptyBoard();
        this.generateTiles(board, 2);
        // console.log(board);
        // console.log(fromJS(board));
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
        while(counter) {
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
        // return Math.random() > 0.5 ? 4 : 2;
        return 2;
    }

    private keyDownHandler = (e: KeyboardEvent) => {
        if(this.state.isGameFinished) {
            alert(`${this.state.didLose ? 'You Lose, try again' : 'You Won!'}`);
            e.preventDefault();
            return;
        }
        const board = this.state.board.toJS();
        const board_string = JSON.stringify(board);
        switch(e.key) {
            case KeyBoardKeys.ARROWUP:
                this.moveTilesHelperUp(board);
                break;
            case KeyBoardKeys.ARROWDOWN:
                this.moveTilesHelperDown(board);
                break;
            case KeyBoardKeys.ARROWLEFT:
                this.moveTilesHelperLeft(board);
                break;
            case KeyBoardKeys.ARROWRIGHT:
                this.moveTilesHelperRight(board);
                break;
        }
        const maxScore: number = this.getCurrentScore(board);
        this.generateTiles(board, 1);
        const newBoard: List<List<TTile>> = fromJS(board);
        const didLose: boolean = JSON.stringify(board) === board_string;
        this.setState({
            board: newBoard,
            maxScore: maxScore,
            isGameFinished: maxScore === Board.WINNING_SCORE || didLose,
            didLose: didLose
        });

        e.preventDefault();
    }

    private moveTilesHelperLeft = (board: TTile[][]): void => {
        for(let row_idx = 0; row_idx < Board.BOARD_SIZE; row_idx++){           
            for(let i = 1, j = 0; i < Board.BOARD_SIZE; i++) {
                if(board[row_idx][i].val === 0) {
                    continue;
                }

                if(board[row_idx][j].val === 0) {
                    board[row_idx][j].val = board[row_idx][i].val;
                    board[row_idx][i].val = 0;
                    continue;
                }
                if(board[row_idx][j].val === board[row_idx][i].val) {
                    board[row_idx][j].val = board[row_idx][j].val * 2;
                    board[row_idx][i].val = 0;
                    continue;
                }
                if(board[row_idx][j].val !== board[row_idx][i].val) {
                    j++;
                    if(j === i) {
                        continue;
                    } else {
                        board[row_idx][j].val = board[row_idx][i].val;
                        board[row_idx][i].val = 0;
                        continue;
                    }
                }
            }
        }
    }

    private moveTilesHelperRight = (board: TTile[][]): void => {
        for(let row_idx = 0; row_idx < Board.BOARD_SIZE; row_idx++){           
            for(let i = Board.BOARD_SIZE - 2, j = Board.BOARD_SIZE -1; i >= 0; i--) {
                if(board[row_idx][i].val === 0) {
                    continue;
                }

                if(board[row_idx][j].val === 0) {
                    board[row_idx][j].val = board[row_idx][i].val;
                    board[row_idx][i].val = 0;
                    continue;
                }
                if(board[row_idx][j].val === board[row_idx][i].val) {
                    board[row_idx][j].val = board[row_idx][j].val * 2;
                    board[row_idx][i].val = 0;
                    continue;
                }
                if(board[row_idx][j].val !== board[row_idx][i].val) {
                    j--;
                    if(j === i) {
                        continue;
                    } else {
                        board[row_idx][j].val = board[row_idx][i].val;
                        board[row_idx][i].val = 0;
                        continue;
                    }
                }
            }
        }
    }

    private moveTilesHelperUp = (board: TTile[][]): void => {
        for(let col_idx = 0; col_idx < Board.BOARD_SIZE; col_idx++){           
            for(let i = 1, j = 0; i < Board.BOARD_SIZE; i++) {
                if(board[i][col_idx].val === 0) {
                    continue;
                }

                if(board[j][col_idx].val === 0) {
                    board[j][col_idx].val = board[i][col_idx].val;
                    board[i][col_idx].val = 0;
                    continue;
                }
                if(board[j][col_idx].val === board[i][col_idx].val) {
                    board[j][col_idx].val = board[j][col_idx].val * 2;
                    board[i][col_idx].val = 0;
                    continue;
                }
                if(board[j][col_idx].val !== board[i][col_idx].val) {
                    j++;
                    if(j === i) {
                        continue;
                    } else {
                        board[j][col_idx].val = board[i][col_idx].val;
                        board[i][col_idx].val = 0;
                        continue;
                    }
                }
            }
        }
    }

    private moveTilesHelperDown = (board: TTile[][]): void => {
        for(let col_idx = 0; col_idx < Board.BOARD_SIZE; col_idx++){           
            for(let i = Board.BOARD_SIZE - 2, j = Board.BOARD_SIZE -1; i >= 0; i--) {
                if(board[i][col_idx].val === 0) {
                    continue;
                }

                if(board[j][col_idx].val === 0) {
                    board[j][col_idx].val = board[i][col_idx].val;
                    board[i][col_idx].val = 0;
                    continue;
                }
                if(board[j][col_idx].val === board[i][col_idx].val) {
                    board[j][col_idx].val = board[j][col_idx].val * 2;
                    board[i][col_idx].val = 0;
                    continue;
                }
                if(board[j][col_idx].val !== board[i][col_idx].val) {
                    j--;
                    if(j === i) {
                        continue;
                    } else {
                        board[j][col_idx].val = board[i][col_idx].val;
                        board[i][col_idx].val = 0;
                        continue;
                    }
                }
            }
        }
    }

    private getCurrentScore = (board: TTile[][]): number => {
        let score: number = 0;
        let temp: TTile[] = [];
        for(let i = 0; i < Board.BOARD_SIZE; i++) {
            temp.push(board[i].reduce(reducer));
        }

        return temp.reduce(reducer).val;

        function reducer(accumulator: TTile, currentValue: TTile) {
            return accumulator.val > currentValue.val ? accumulator : currentValue;
        }
    }

    
}

export default Board;