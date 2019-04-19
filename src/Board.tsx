import React, { Component } from 'react';
import { List } from 'immutable';
import { TCell, IBoardProps, IBoardStates } from './App-model'



class Board extends Component<IBoardProps, IBoardStates> {
    static readonly BOARD_SIZE: number = 4;
    constructor(props: IBoardProps) {
        super(props);
        this.state = {
            board: List()
        };
    }
    render() {
        return (
            <div className='board'>board</div>
        );
    }

    componentDidMount() {
        this.initialBoard();
    }

    private initialBoard = (): void => {
        let board: List<TCell> = this.createEmptyBoard();
        board = this.placeFirstCells(board);





        console.log(board);
    }

    private createEmptyBoard = ():List<TCell> => {
        let board = List();
        for(let i = 0; i < Board.BOARD_SIZE; i++) {
            let row = List();
            for(let j = 0; j< Board.BOARD_SIZE; j++) {
                row = row.push({
                    val: 0
                })
            }
            board = board.push(row);
        }
        return board;
    }

    private placeFirstCells = (board: List<TCell>): List<TCell> => {
        let counter = 2;
        while(counter) {
            let x: number = Math.ceil(Math.random() * (Board.BOARD_SIZE - 1));
            let y: number = Math.ceil(Math.random() * (Board.BOARD_SIZE - 1));
            let val: number = this.generateValue();
            if(board.getIn([x, y]).val === 0) {
                board = board.setIn([x, y], {val: val});
                counter--;
            }
        }
        return board;
    }

    private generateValue = (): number => {
        return 2;  // set 2 for now
    }
    
}

export default Board;