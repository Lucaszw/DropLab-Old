const EMPTY    = undefined;
const HOVER    = 0;
const ERASE    = 2;

var Objects = require('./fabric/Objects.jsx');
var ObstacleController = require('./fabric/ObstacleController.jsx');
var UnitController = require('./fabric/UnitController.jsx');
var GoalController = require('./fabric/GoalController.jsx');
var PathController = require('./fabric/PathController.jsx');


class Grid extends React.Component {
  // Generate a texture for grid plane:
  constructor (props) {
    super (props);

    this.mouseMove = this.mouseMove.bind(this);
    this.mouseUp   = this.mouseUp.bind(this);
    this.mouseDown = this.mouseDown.bind(this);

    this.canvas     = null;
    this.objects    = new Array();
    this.pathPoints = new Array();
    this.size       = props.dimensions.width / props.matrix.length;
    this.state = {mode: HOVER, activeUnit: EMPTY};

    this.ObstacleController = new ObstacleController.Controller(this);
    this.UnitController     = new UnitController.Controller(this);
    this.GoalController     = new GoalController.Controller(this);
    this.PathController     = new PathController.Controller(this);

  }

  mouseUp () {this.setState({mode: HOVER})}

  mouseDown (ev){
    if (ev.e.altKey)
      this.setState({mode: ERASE});
    else if (ev.e.shiftKey)
      this.setState({mode: this.UnitController.type()});
    else if (ev.e.metaKey)
      this.setState({mode: this.GoalController.type()});
    else
      this.setState({mode: this.ObstacleController.type()});
  }

  mouseMove (ev){
    let x = Math.floor(ev.e.offsetX / this.size);
    let y = Math.floor(ev.e.offsetY / this.size);
    this.props.updateActiveCoordinates(x,y);
  }

  getObject (coords){
    let obj = this.objects[coords.x][coords.y];
    return obj;
  }

  getType (coords){
    if (this.isEmpty(coords)) return EMPTY;
    return this.getObject(coords).getType();
  }

  isEmpty   (coords) {return this.getObject(coords) == EMPTY}
  clearGrid (coords) {this.objects[coords.x][coords.y] = EMPTY}

  erase (coords) {
    switch (this.getType(coords)) {
      case this.ObstacleController.type():
        this.ObstacleController.erase(coords)
        break;
      case this.UnitController.type():
        this.UnitController.erase(coords)
        break;
      case this.GoalController.type():
        this.GoalController.erase(coords)
        break;
      default:
        return;
    }
  }

  removeObject (coords) {
    if (!this.isEmpty(coords))
      this.canvas.remove(this.getObject(coords).getObject());
    this.clearGrid(coords);
  }

  update (coords) {
    switch (this.getType(coords)){
      case EMPTY:
        this.ObstacleController.place(coords);
        break;
      case this.UnitController.type():
        this.UnitController.activate(coords);
        break;
      default:
        break;
    }
  }

  setGrid () {
    const grid   = this.size;
    const width  = this.props.dimensions.width;
    const height = this.props.dimensions.height;

    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    this.canvas.backgroundColor = "white";

    for (let i = 0; i < (width / grid); i++) {
      this.canvas.add(new fabric.Line([ i * grid, 0, i * grid, width], { stroke: '#bbbbbb', selectable: false }));
      this.canvas.add(new fabric.Line([ 0, i * grid, width, i * grid], { stroke: '#bbbbbb', selectable: false }));

      this.objects.push(new Array(Math.ceil(height/grid)));
    }

  }

  componentDidMount () {
    this.canvas  = new fabric.Canvas(this.refs.fabric_canvas, {
      selection: false
    });

    this.props.setCanvas(this.refs.fabric_canvas);
    this.setGrid();

    this.canvas.on('mouse:move', this.mouseMove);
    this.canvas.on('mouse:up', this.mouseUp);
    this.canvas.on('mouse:down', this.mouseDown);
  }

  componentDidUpdate () {
    const coords = this.props.activeCoordinates;

    if (this.state.mode == this.ObstacleController.type())
      this.update(coords);

    if (this.state.mode == ERASE)
      this.erase(coords);

    if (this.state.mode == this.UnitController.type())
      this.UnitController.place(coords);

    if (this.state.mode == this.GoalController.type())
      this.GoalController.place(coords);

    if (this.props.path.needsDrawing)
      this.PathController.draw(this.props.path);

    // TODO: Change to only update units if they need drawing
    this.UnitController.updateAll();
    this.ObstacleController.update();
  }

  render () {
    const canvasStyle = {
      position: "absolute",
      border: "1px solid"
    };

    return (
      <div style={canvasStyle} >
        <canvas ref="fabric_canvas" ></canvas>
      </div>
    )
  }

}

module.exports = {Grid: Grid};
