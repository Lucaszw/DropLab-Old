class Grid extends React.Component {
  // Generate a texture for grid plane:
  constructor (props) {
    super (props);
    this.canvas  = null;
  }

  componentDidMount () {
    this.canvas  = new fabric.Canvas(this.refs.fabric_canvas, {
      selection: false
    });
    this.props.setCanvas(this.refs.fabric_canvas);
    this.updateGrid();
  }

  componentDidUpdate () {
    // this.props.emitTextureNeedsUpdate();
    this.updateGrid();
  }

  updateGrid () {
    const grid   = this.props.dimensions.size;
    const width  = this.props.dimensions.width;
    const height = this.props.dimensions.height;
    const x = this.props.activeCoordinates.x;
    const y = this.props.activeCoordinates.y;

    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    this.canvas.clear();
    this.canvas.backgroundColor="white";

    for (var i = 0; i < (width / grid); i++) {
      this.canvas.add(new fabric.Line([ i * grid, 0, i * grid, width], { stroke: '#bbbbbb', selectable: false }));
      this.canvas.add(new fabric.Line([ 0, i * grid, width, i * grid], { stroke: '#bbbbbb', selectable: false }))
    }
    const box = new Box({x: x, y: y, width: grid, canvas: this.canvas});
  }

  render () {
    const canvasStyle = {
      display: "none"
    };

    return (
      <div style={canvasStyle} >
        <canvas ref="fabric_canvas" ></canvas>
      </div>
    )
  }

}

class FabricObject {
  constructor (props) {
    this.x = props.x;
    this.y = props.y;
    this.width = props.width;
    this.height = props.height;
    this.canvas = props.canvas;
  }
}

class Box extends FabricObject {
  constructor (props) {
    super (props);

    this.rect = new fabric.Rect({
      left: this.x,
      top: this.y,
      width: this.width,
      height: this.width,
      fill: 'rgb(200, 200, 200)'
    });

    this.canvas.add(this.rect);
  }

}
module.exports = {Grid: Grid};
