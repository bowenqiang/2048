import React, { Component } from 'react';
import { TTile, ITileProps, ITileStates } from './App-model';
import './Tile.scss';

class Tile extends Component<ITileProps, ITileStates> {
    constructor(props: ITileProps) {
        super(props);
    }
    render() {
        const tileData = this.props.tileData;
        const className = `tile`;
        const content = tileData.val !==0 ? tileData.val : '';
        const style = {
            top: tileData.x * 114 + 'px',
            left: tileData.y * 114 + 'px'
        };
        return (
            <div className={className} style={style}>{content}</div>
        );
    }
}

export default Tile;