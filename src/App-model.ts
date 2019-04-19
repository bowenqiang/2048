import { List } from 'immutable';

export type TTile = {
    x: number,
    y: number,
    val: number
}

export enum KeyBoardKeys {
    ARROWUP = 'ArrowUp',
    ARROWDOWN = 'ArrowDown',
    ARROWLEFT = 'ArrowLeft',
    ARROWRIGHT = 'ArrowRight'
}

export interface IBoardProps {

}

export interface IBoardStates {
    board: List<List<TTile>>
}

export interface ITileProps {
    tileData: TTile
}

export interface ITileStates {

}