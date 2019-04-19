import React, { Component } from 'react';
import { TCell, ICellProps, ICellStates } from './App-model';
import './Cell.scss';

class Cell extends Component<ICellProps, ICellStates> {
    constructor(props: ICellProps) {
        super(props);
    }
    render() {
        const className = `cell ${this.props.cellData.val !== 0 ? 'has-val' : 'empty'}`;
        const content = this.props.cellData.val !==0 ? this.props.cellData.val : '';
        return (
            <div className={className}>{content}</div>
        );
    }
}

export default Cell;