(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
      React.createElement("div", {style: canvasStyle}, 
        React.createElement("canvas", {ref: "fabric_canvas"})
      )
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

},{}]},{},[1]);
