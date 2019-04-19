import { List } from 'immutable';

export type TCell = {
    x: number,
    y: number,
    val: number
}

export interface IBoardProps {

}

export interface IBoardStates {
    board: List<TCell>
}

export interface ICellProps {
    cellData: TCell
}

export interface ICellStates {

}