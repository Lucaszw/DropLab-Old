var ThreeObjects  = require('./threeObjects.jsx');
var FabricObjects = require('./fabricObjects.jsx');

const NOT_PRESENT = -1;
const EMPTY = undefined;
const UNIT = 3;

function GenerateMatrix(n) {
  let matrix = new Array(n);
  for (let i=0;i < n;i++){
    matrix[i] = new Array(n);
    for (let ii=0; ii < n; ii++)
      matrix[i][ii] = 0;
  }
  return matrix;
}

class Main extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      matrix: GenerateMatrix(20),
      units: new Array(),
      path: new Array()
    }

    // Event Binders:
    this.handleUpdateMatrix = this.handleUpdateMatrix.bind(this);
    this.handleUpdateUnits = this.handleUpdateUnits.bind(this);
    this.handleGeneratePaths = this.handleGeneratePaths.bind(this);
  }

  handleGeneratePaths () {
    let unit = this.state.units[0];
    var grid   = new PF.Grid(this.state.matrix);
    var finder = new PF.AStarFinder({allowDiagonal: true});

    // let paths = this.state.paths;
    let path = finder.findPath(unit.y, unit.x, unit.y2, unit.x2, grid);
    path.needsDrawing = true;

    this.setState({path: path});
    // this.paths.push();
  }

  handleUpdateMatrix(matrix){this.setState({matrix: matrix})};
  handleUpdateUnits(units){this.setState({units: units})};

  render () {

    const navStyle = {
      position: "absolute",
      left: "100%",
      marginLeft: "-200px",
      height: "100%"
    };


    return (
      <div >
        <GridSystem2D
          updateMatrix={this.handleUpdateMatrix}
          updateUnits={this.handleUpdateUnits}
          matrix={this.state.matrix}
          units={this.state.units}
          path={this.state.path}
          />
        <div style={navStyle} >
          <ComponentNavigation
            generatePaths={this.handleGeneratePaths}
            />
        </div>
      </div>
    );

  }
}

class GridSystem2D extends React.Component {
  constructor (props) {
    super (props);

    let gridTextureDimensions = {
      height: 500,
      width: 500
    };

    this.state = {
      gridTextureCanvas: null,
      gridTextureDimensions: gridTextureDimensions,
      activeCoordinates: {x: 0, y: 0}
    }

    // Event Binders:
    this.handleGridTextureCanvasChanged = this.handleGridTextureCanvasChanged.bind(this);
    this.handleActiveCoordinatesChanged = this.handleActiveCoordinatesChanged.bind(this);
    this.handleUpdateObstacles = this.handleUpdateObstacles.bind(this);
    this.handleUpdateUnit = this.handleUpdateUnit.bind(this);
    this.handleUpdateGoal = this.handleUpdateGoal.bind(this);

  }

  handleGridTextureCanvasChanged (canvas) { this.setState({gridTextureCanvas: canvas}) }
  handleActiveCoordinatesChanged (x,y) { this.setState({activeCoordinates: {x: x,y: y}})}

  handleUpdateObstacles (coords,val) {
    let matrix = this.props.matrix;
    matrix[coords.x][coords.y] = val;
    this.props.updateMatrix(matrix);
  }

  handleUpdateUnit (unit,index,value) {
    let units = this.props.units;

    unit.value = value;
    unit.hasGoal = false;

    if (index == NOT_PRESENT) units.push(unit);
    if (value == EMPTY) units[index] = unit;

    this.props.updateUnits(units);
  }

  handleUpdateGoal (coords,index,value) {
    let units = this.props.units;
    let unit  = this.props.units[index];

    if (value == EMPTY) {unit.hasGoal = false;}
    else if(unit.hasGoal) {return}
    else {
      unit.x2 = coords.x;
      unit.y2 = coords.y;
      unit.hasGoal = true;
    }

    this.props.updateUnits(units);
  }

  render () {
    return (
      <div>
        <FabricObjects.Grid
          setCanvas  = {this.handleGridTextureCanvasChanged}
          updateActiveCoordinates = {this.handleActiveCoordinatesChanged}
          updateObstacles = {this.handleUpdateObstacles}
          updateUnit = {this.handleUpdateUnit}
          updateGoal = {this.handleUpdateGoal}
          dimensions = {this.state.gridTextureDimensions}
          activeCoordinates = {this.state.activeCoordinates}
          {...this.props}
           />
      </div>
    )
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
        <button onClick={this.props.generatePaths}>Calculate Path</button>
      </div>
    );
  }

}

ReactDOM.render(
  <Main />,
  document.getElementById('main')
);
