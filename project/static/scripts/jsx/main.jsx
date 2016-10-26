var ThreeObjects  = require('./threeObjects.jsx');
var FabricObjects = require('./fabricObjects.jsx');

class Main extends React.Component {

  render () {

    const navStyle = {
      position: "absolute",
      left: "100%",
      marginLeft: "-200px",
      height: "100%"
    };


    return (
      <div >
        <div style={navStyle} >
          <ComponentNavigation />
        </div>
        <GridSystem />
      </div>
    );

  }
}

class ComponentNavigation extends React.Component {
  constructor (props) {
    super (props);
  }

  render () {
    const style = {
      width: "200px",
      background: "rgba(255,255,255,0.5)",
      height: "100%",
      textAlign: "center"
    };

    return (
      <div style={style}>
        <b>Drop Lab Components</b>
      </div>
    );
  }

}

class GridSystem extends React.Component {
  constructor (props) {
    super (props);

    let gridTextureDimensions = {
      height: 1024,
      width: 1024,
      size: 100
    };

    this.state = {
      gridTextureCanvas: null,
      gridTextureDimensions: gridTextureDimensions,
      activeCoordinates: {
        twoDim: {x: 0, y: 0},
        threeDim: {x:0,y:0,z:0}
      }
    }

    // Event Binders:
    this.handleGridTextureCanvasChanged = this.handleGridTextureCanvasChanged.bind(this);
    this.handleActiveCoordinateChanged  = this.handleActiveCoordinateChanged.bind(this);
  }

  handleGridTextureCanvasChanged (canvas) { this.setState({gridTextureCanvas: canvas}) }
  handleActiveCoordinateChanged (uv,point) {
    const dim = this.state.gridTextureDimensions;
    let x = Math.floor(uv.x*dim.width/dim.size)*dim.size;
    let y = Math.floor((1-uv.y)*dim.height/dim.size)*dim.size;

    let activeCoodinates = new Object();
    activeCoodinates.twoDim = {x: x, y: y};
    activeCoodinates.threeDim = point;
    this.setState({activeCoordinates: activeCoodinates});
  }

  render () {
    return (
      <div>
        <FabricObjects.Grid
          setCanvas  = {this.handleGridTextureCanvasChanged}
          dimensions = {this.state.gridTextureDimensions}
          activeCoordinates = {this.state.activeCoordinates.twoDim}
           />
         <ThreeObjects.Canvas
          gridTextureCanvas = {this.state.gridTextureCanvas}
          changeActiveCoordinates = {this.handleActiveCoordinateChanged}
          activeCoordinates = {this.state.activeCoordinates.threeDim}
           />
      </div>
    )
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById('main')
);
