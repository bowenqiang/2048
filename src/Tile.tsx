import React, { Component } from 'react';
import { TTile, ITileProps, ITileStates } from './App-model';
import './Tile.scss';

class Tile extends Component<ITileProps, ITileStates> {
    private _id: string = '';
    private _tile: HTMLElement | null = null;
    private _style: any;
    constructor(props: ITileProps) {
        super(props);
        this._id = this.props.tileData.x * 4 + this.props.tileData.y + '';
    }
    render() {
        const tileData: TTile = this.props.tileData;
        const className: string = `tile`;

        const content: string = tileData.val !==0 ? tileData.val.toString() : '';
        let fontSize: number = 0;
        const windowWidth: number = window.outerWidth;
        let step: number = 0;
        if(windowWidth > 480) {
            step = 114;
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
        } else {
            step = 81;
            switch(content.length) {
                case 1:
                    fontSize = 64
                case 2:
                    fontSize = 48;
                    break;
                case 3:
                    fontSize = 36;
                    break;
                case 4:
                    fontSize = 28;
                    break;
                default:
                    fontSize = 24;
            }
        }
        this._style = {
            top: tileData.x * step + 'px',
            left: tileData.y * step + 'px',
            fontSize: fontSize + 'px',
        };
        return (
            <div className={className} id={this._id} style={this._style}>{content}</div>
        );
    }

    componentDidMount() {
        this._tile = document.getElementById(this._id);
        if(this._tile) {
            this.titleInitialAnimation(this._tile, this._tile.getBoundingClientRect(), 1.1, 3);
        }
    }

    shouldComponentUpdate(nextProps: ITileProps, nextStates: ITileStates) {
        if(this.props.tileData.val !== nextProps.tileData.val) {
            return true;
        }
        return false;
    }

    componentDidUpdate() {
        if(this._tile) {
            this.titleInitialAnimation(this._tile, this._tile.getBoundingClientRect(), 1.1, 3);
        }
    }

    private titleInitialAnimation = (tile: HTMLElement, initalRect: ClientRect, ratio: number, speed: number) => {
        let counter = 0;
        let top = tile.style.top ? parseInt(tile.style.top) : 0;
        let left = tile.style.left ? parseInt(tile.style.left) : 0;
        let sign = 1;
        const animation = () => {
            window.requestAnimationFrame(() => {
                const tileRect = tile.getBoundingClientRect();
                tile.style.width = initalRect.width + counter * speed * sign + 'px';
                tile.style.height = initalRect.height + counter * speed * sign + 'px';
                tile.style.top = top - 0.5 * counter * speed * sign + 'px';
                tile.style.left = left - 0.5 * counter * speed * sign + 'px';
                counter++;
                if(tileRect.width < initalRect.width * ratio && tileRect.height < initalRect.height * ratio && sign > 0) {
                    animation();
                } else if(tileRect.width > initalRect.width && tileRect.height > initalRect.height) {
                    counter = 0;
                    animation();
                    sign = -1;
                }

            })
        }
        animation();
    }
}

export default Tile;