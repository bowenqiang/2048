import { List } from 'immutable';

export type TCell = {
    val: number;
}

export interface IBoardProps {

}

export interface IBoardStates {
    board: List<TCell>
}