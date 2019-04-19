import { List } from 'immutable';

export type TTile = {
    x: number,
    y: number,
    val: number
}

export type TNextMoves = {
    up: TTile[][] | null,
    down: TTile[][] | null,
    left: TTile[][] | null,
    right: TTile[][] | null
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
    maxScore: number
    isGameFinished: boolean
    didLose: boolean
}

export interface ITileProps {
    tileData: TTile
}

export interface ITileStates {

}