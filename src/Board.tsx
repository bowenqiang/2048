import React, { Component } from 'react';
import { List } from 'immutable';
import { TTile, IBoardProps, IBoardStates, KeyBoardKeys } from './App-model';
import Tile from './Tile';
import './Board.scss';

class Board extends Component<IBoardProps, IBoardStates> {
    static readonly BOARD_SIZE: number = 4;
    constructor(props: IBoardProps) {
        super(props);
        this.state = {
            board: this.initialBoard()
        };
    }
    render() {
        const board = this.state.board;
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
                const tileData: TTile = board.getIn([i, j]);
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

    private initialBoard = (): List<List<TTile>> => {
        let board: List<List<TTile>> = this.createEmptyBoard();
        board = this.placeFirstTiles(board);
        return board;
    }

    private createEmptyBoard = ():List<List<TTile>> => {
        let board = List();
        for(let i = 0; i < Board.BOARD_SIZE; i++) {
            let row = List();
            for(let j = 0; j< Board.BOARD_SIZE; j++) {
                row = row.push({
                    x: i,
                    y: j,
                    val: 0
                })
            }
            board = board.push(row);
        }
        return board;
    }

    private placeFirstTiles = (board: List<List<TTile>>): List<List<TTile>> => {
        let counter = 9;
        while(counter) {
            let x: number = Math.ceil(Math.random() * Board.BOARD_SIZE - 1);
            let y: number = Math.ceil(Math.random() * Board.BOARD_SIZE - 1);
            let val: number = this.generateValue();
            if(board.getIn([x, y]).val === 0) {
                board = board.setIn([x, y,], {x: x, y: y, val: val});
                counter--;
            }
        }
        return board;
    }

    private generateValue = (): number => {
        // return Math.random() > 0.5 ? 4 : 2;
        return 2;
    }

    private keyDownHandler = (e: KeyboardEvent) => {
        const board = this.state.board;
        let newBoard;
        switch(e.key) {
            case KeyBoardKeys.ARROWUP:
                newBoard = this.moveTiles(board, 'up');
                console.log('up');
            break;
            case KeyBoardKeys.ARROWDOWN:
            console.log('down');
            break;
            case KeyBoardKeys.ARROWLEFT:
                newBoard = this.moveTiles(board, 'left');
                console.log(newBoard);
                break;
            case KeyBoardKeys.ARROWRIGHT:
                newBoard = this.moveTiles(board, 'right')
                console.log(newBoard);
            console.log('right');
            break;
        }
        e.preventDefault();
    }

    private moveTiles = (board: List<List<TTile>>, direction: string): List<List<TTile>> => {
        let newBoard:List<List<TTile>> = List();
        if (direction.toLowerCase() === 'left' || direction.toLowerCase() === 'right') {
            for(let i = 0; i < Board.BOARD_SIZE; i++) {
                const row = (board.get(i) as List<TTile>).toArray();
                const newRow: List<TTile> = direction.toLowerCase() === 'left' ? List(this.moveTilesHelperLeft(row)) : List(this.moveTilesHelperRight(row));
                newBoard = newBoard.push(newRow);
            }
        } else {
            // for(let i = 0; i < Board.BOARD_SIZE; i++) {
            //     const row_temp = List();
            //     for(let i)
            // }
            console.log(board.toArray());
        }

        return newBoard;
    }

    private moveTilesHelperLeft = (arr: Array<TTile>): Array<TTile> => {
        const newArr = [...arr];
        for(let i = 1, j = 0; i < newArr.length; i++) {
            if(newArr[i].val === 0) {
                continue;
            }

            if(newArr[j].val === 0) {
                newArr[j].val = newArr[i].val;
                newArr[i].val = 0;
                continue;
            }
            if(newArr[j].val === newArr[i].val) {
                newArr[j].val = newArr[j].val * 2;
                newArr[i].val = 0;
                continue;
            }
            if(newArr[j].val !== newArr[i].val) {
                j++;
                if(j === i) {
                    continue;
                } else {
                    newArr[j].val = newArr[i].val;
                    newArr[i].val = 0;
                    continue;
                }
            }
        }
        return newArr;
    }

    private moveTilesHelperRight = (arr: Array<TTile>): Array<TTile> => {
        const newArr = [...arr];
        for(let i = newArr.length - 2, j = newArr.length -1; i >= 0; i--) {
            if(newArr[i].val === 0) {
                continue;
            }

            if(newArr[j].val === 0) {
                newArr[j].val = newArr[i].val;
                newArr[i].val = 0;
                continue;
            }
            if(newArr[j].val === newArr[i].val) {
                newArr[j].val = newArr[j].val * 2;
                newArr[i].val = 0;
                continue;
            }
            if(newArr[j].val !== newArr[i].val) {
                j--;
                if(j === i) {
                    continue;
                } else {
                    newArr[j].val = newArr[i].val;
                    newArr[i].val = 0;
                    continue;
                }
            }
        }
        return newArr;
    }

    private moveTitleHelperUp = (arr: Array<TTile>): Array<TTile> => {
        const newArr = [...arr];
        return newArr;
    }
    
}

export default Board;