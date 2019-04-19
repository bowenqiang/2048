import React, { Component } from 'react';
import { TTile, ITileProps, ITileStates } from './App-model';
import './Tile.scss';

class Tile extends Component<ITileProps, ITileStates> {
    constructor(props: ITileProps) {
        super(props);
    }
    render() {
        const tileData: TTile = this.props.tileData;
        const className: string = `tile`;
        const content: string = tileData.val !==0 ? tileData.val.toString() : '';
        let fontSize: number = 0;
        switch(content.length) {
            case 1:
            case 2:
                fontSize = 64;
                break;
            case 3:
                fontSize = 48;
                break;
            case 4:
                fontSize = 32;
                break;
            default:
                fontSize = 24;
        }
        const style = {
            top: tileData.x * 114 + 'px',
            left: tileData.y * 114 + 'px',
            fontSize: fontSize + 'px'
        };
        return (
            <div className={className} style={style}>{content}</div>
        );
    }
}

export default Tile;