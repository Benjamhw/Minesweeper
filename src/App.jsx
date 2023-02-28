import React, { Component } from 'react'
import './App.css';
import { Container, Row, Col } from 'reactstrap'
import logo from './Assets/msLogo.png';
import flag from './Assets/flag.svg';
import Timer from "react-compound-timer";

function App() {

    return (
        <Container>
            <Board></Board>
        </Container>
    );
}

class Board extends Component {

    rows = 20;
    cols = 24;
    mines = 99;
    firstTile = {
        row: 5,
        col: 0
    };
    gameActive = false;

    constructor(props) {
        super(props);
        this.state = {
            rows: 0,
            cols: 0,
            mines: 0,
            flags: 0,
            tileObjects: [[]],
            tilesReady: false
        }
        this.fillBoard = this.fillBoard.bind(this);
        this.setup = this.setup.bind(this);
        this.setFlagCallback = this.setFlagCallback.bind(this);
    }

    componentDidMount() {
        this.setup()
    }

    setup() {
        this.setState({
            rows: this.rows,
            cols: this.cols,
            mines: this.mines,
            flags: this.mines,
            tileObjects: this.setupBoard()
        },
            
            //this.fillBoard
        );
    }

    setupBoard() {
        return this.fillTileElms(new Array(this.rows).fill(0).map(() => new Array(this.cols).fill(0)));
    }

    async fillBoard() {
        let tiles = this.fillMines();
        tiles = this.fillNumbers(tiles);
        tiles = this.fillTileElms(tiles);

        this.setState({
            tileObjects: tiles,
            tilesReady: true
        });
    }

    fillMines() {
        let mines = this.state.mines;
        let tiles = new Array(this.rows).fill(0).map(() => new Array(this.cols).fill(0));
        let counter = 0;
        while (mines > 0 && counter < 1000) {
            let rowIndex = Math.floor(Math.random() * this.rows);
            let colIndex = Math.floor(Math.random() * this.cols);
            if(this.firstIsInSuroundingTiles(rowIndex,colIndex)){
                //first tile should not be a mine
                counter++;
                continue;
                
            }
            if (tiles[rowIndex][colIndex] !== -1) {
                tiles[rowIndex][colIndex] = -1;
                mines--;
            }
            counter++;
        }
        return tiles;
    }

    firstIsInSuroundingTiles(row,col){
        let fRow = this.firstTile.row;
        let fCol = this.firstTile.col;

        for(let r = row-1; r<=row+1;r++){
            for(let c = col-1; c<=col+1;c++){
                if(fRow===r&&fCol===c) return true;
            }
        }
        return false;
        //||||||||
    }

    fillNumbers(tiles) {
        let newTiles = tiles;
        tiles.forEach((row, rowIndex) => {
            row.forEach((tile, tileIndex) => {
                let mines = 0;
                if (tile !== -1) {
                    //check left:
                    if (tiles[rowIndex][tileIndex - 1] != null && tiles[rowIndex][tileIndex - 1] === -1) {
                        mines++;
                    }
                    //check right:
                    if (tiles[rowIndex][tileIndex + 1] != null && tiles[rowIndex][tileIndex + 1] === -1) {
                        mines++;
                    }
                    if (rowIndex > 0) {
                        //check up:
                        if (tiles[rowIndex - 1][tileIndex] != null && tiles[rowIndex - 1][tileIndex] === -1) {
                            mines++;
                        }
                        //check leftUp:
                        if (tiles[rowIndex - 1][tileIndex - 1] != null && tiles[rowIndex - 1][tileIndex - 1] === -1) {
                            mines++;
                        }
                        //check rightUp:
                        if (tiles[rowIndex - 1][tileIndex + 1] != null && tiles[rowIndex - 1][tileIndex + 1] === -1) {
                            mines++;
                        }
                    }
                    if (rowIndex < tiles.length - 1) {
                        //check down:
                        if (tiles[rowIndex + 1][tileIndex] != null && tiles[rowIndex + 1][tileIndex] === -1) {
                            mines++;
                        }

                        //check leftDown:
                        if (tiles[rowIndex + 1][tileIndex - 1] != null && tiles[rowIndex + 1][tileIndex - 1] === -1) {
                            mines++;
                        }
                        //check rightDown:
                        if (tiles[rowIndex + 1][tileIndex + 1] != null && tiles[rowIndex + 1][tileIndex + 1] === -1) {
                            mines++;
                        }
                    }
                    if (mines > 0) { newTiles[rowIndex][tileIndex] = mines }
                }

            });
        });
        return tiles;
    }

    fillTileElms(tiles) {
        let tileObjects = new Array(this.rows).fill(0).map(() => new Array(this.cols).fill(0));
        for (let i = 0; i < tiles.length; i++) {
            for (let j = 0; j < tiles[i].length; j++) {
                tileObjects[i][j] = {
                    value: tiles[i][j],
                    row: i,
                    col: j,
                    open: false
                }
            }
        }

        return tileObjects;
    }
    //Recursive!!
    counter=0;
    checkEmptyTiles(tile) {
        this.counter++;
        if (tile == null || tile.open) return;

        if (tile.value > 0) {

            this.setState(prevState => {
                let tileObjects = Object.assign({}, prevState.tileObjects);
                tileObjects[tile.row][tile.col].open = true;
                return tileObjects;
            });
            tile.open = true;
            return;
        }

        if (tile.value === 0 && !tile.open) {
            this.setState(prevState => {
                let tileObjects = Object.assign({}, prevState.tileObjects);
                tileObjects[tile.row][tile.col].open = true;
                return tileObjects;
            });
            tile.open = true;
        }
        else return;

        let leftTile = null
        let rightTile = null
        let upTile = null
        let upLeftTile = null
        let upRightTile = null
        let downTile = null
        let downLeftTile = null
        let downRightTile = null

        leftTile = this.state.tileObjects[tile.row][tile.col - 1];
        rightTile = this.state.tileObjects[tile.row][tile.col + 1];

        if (tile.row > 0) {
            upTile = this.state.tileObjects[tile.row - 1][tile.col];
            upLeftTile = this.state.tileObjects[tile.row - 1][tile.col - 1];
            upRightTile = this.state.tileObjects[tile.row - 1][tile.col + 1];
        }
        if (tile.row < this.state.tileObjects.length - 1) {
            downTile = this.state.tileObjects[tile.row + 1][tile.col];
            downLeftTile = this.state.tileObjects[tile.row + 1][tile.col - 1];
            downRightTile = this.state.tileObjects[tile.row + 1][tile.col + 1];
        }

        this.checkEmptyTiles(leftTile);
        this.checkEmptyTiles(rightTile);
        this.checkEmptyTiles(upTile);
        this.checkEmptyTiles(upLeftTile);
        this.checkEmptyTiles(upRightTile);
        this.checkEmptyTiles(downTile);
        this.checkEmptyTiles(downLeftTile);
        this.checkEmptyTiles(downRightTile);

        return;
    }

    setFlagCallback(bool) {
        let newFlags = bool ? this.state.flags + 1 : this.state.flags - 1;
        this.setState({
            flags: newFlags
        });
    }

    async clickTileCallback(tile){
        if(tile.open){
            return;
        }
        if(!this.gameActive){
            this.firstTile.row = tile.row;
            this.firstTile.col = tile.col;
            this.gameActive = true;

            await this.fillBoard();
        }

        if(tile.value === -1) {
            await this.gameOver();
        } else {
            console.log("here");
            this.checkEmptyTiles(tile);
            console.log("done:" + this.counter);
            this.counter = 0;
        }
    }

    async gameOver(){
        let tiles = this.state.tileObjects;
        tiles.map((row) => {
            row.map((tile) => {
                setTimeout(()=>{
                    if(tile.value == -1){
                        tile.open = true
                        this.setState({
                            tileObjects: tiles
                        });
                    }
                    
                }, 10);
            })
        });
        
    }

    render() {
        return (
            <React.Fragment>

                <table>
                    <tbody>
                        <tr>
                            <td colSpan={this.cols} className="header container">
                                <Row>
                                    <Col>
                                        <img src={logo} alt="Logo" />
                                    </Col>
                                    <Col className="flagDiv">
                                        <p>{this.state.flags}</p>
                                        <img src={flag} alt="Logo" width="20" />
                                    </Col>
                                    <Col>
                                        <Timer>
                                            <Timer.Minutes /> M
                                            <Timer.Seconds /> S
                                        </Timer>
                                    </Col>
                                </Row>
                            </td>
                        </tr>
                        {this.state.tileObjects.map((value, index) => {
                            return (
                                <tr key={index}>
                                    {value.map((subValue, subIndex) => {
                                        return (
                                            <td key={subValue.row + "-" + subValue.col}>
                                                <Tile
                                                    value={subValue.value}
                                                    row={subValue.row}
                                                    col={subValue.col}
                                                    open={subValue.open}
                                                    checkEmptyTiles={() => this.checkEmptyTiles(this.state.tileObjects[subValue.row][subValue.col])}
                                                    setFlag={this.setFlagCallback}
                                                    clickTile={() => this.clickTileCallback(this.state.tileObjects[subValue.row][subValue.col])}>
                                                </Tile>
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </React.Fragment>

        )
    }

}

class Tile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 40,
            height: 40,
            flagged: false,
            clicked: false
        }
        this.setFlag = this.setFlag.bind(this);
    }

    click(e) {
        e.preventDefault();
        if (this.state.flagged) return;
        this.props.clickTile();
    }

    setFlag(e) {
        e.preventDefault();
        if (this.props.open) return;
        this.setState({
            flagged: !this.state.flagged
        },
            function () { this.props.setFlag(!this.state.flagged) }
        )
    }


    render() {
        const openTileClass = "tile openTile color" + this.props.value;
        const flaggedClass = "tile flag";
        const openMineClass = "tile openMine";



        const classList = this.props.open ? (this.props.value!=-1 ? openTileClass : openMineClass) :
            this.state.flagged ? flaggedClass : "tile";
        return (
            <div className={classList}
                onClick={e => this.click(e)}
                onContextMenu={e => this.setFlag(e)}>
                {(!this.props.open ? "" :
                    (this.props.value === -1 ? "" :
                        (this.props.value === 0 ? "" :
                            this.props.value)))
                }
                {/* {this.props.value} */}
            </div>
        )
    }
}


export default App;