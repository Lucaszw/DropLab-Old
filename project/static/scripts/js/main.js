(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
      React.createElement("div", null, 
        React.createElement("div", {style: navStyle}, 
          React.createElement(ComponentNavigation, null)
        ), 
        React.createElement(GridSystem, null)
      )
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
      React.createElement("div", {style: style}, 
        React.createElement("b", null, "Drop Lab Components")
      )
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
      React.createElement("div", null, 
        React.createElement(FabricObjects.Grid, {
          setCanvas: this.handleGridTextureCanvasChanged, 
          dimensions: this.state.gridTextureDimensions, 
          activeCoordinates: this.state.activeCoordinates.twoDim}
           ), 
         React.createElement(ThreeObjects.Canvas, {
          gridTextureCanvas: this.state.gridTextureCanvas, 
          changeActiveCoordinates: this.handleActiveCoordinateChanged, 
          activeCoordinates: this.state.activeCoordinates.threeDim}
           )
      )
    )
  }
}

ReactDOM.render(
  React.createElement(Main, null),
  document.getElementById('main')
);

},{"./fabricObjects.jsx":2,"./threeObjects.jsx":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
class Canvas extends React.Component {
  constructor(props){
    super(props);

    // Initiate Scene, Camera, and Renderer:
    this.scene    = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xf4f4f4 );

    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    this.camera.position.set( 500, 1100, 1500 );
    this.camera.lookAt( new THREE.Vector3() );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor( 0xf0f0f0 );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.collidableObjects = new Array();

    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  componentDidMount() {
    // Append Renderer to Component:
    this.refs.container.appendChild(this.renderer.domElement);

    this.lights = new Lights({scene: this.scene});
    this.lights.addToScene();

    this.plane = new Plane({scene: this.scene});
    this.plane.addToScene();

    this.box = new Box({scene: this.scene, size: 200});
    this.box.addToScene();

    this.renderer.render( this.scene, this.camera );
    this.animate();

    // Add objects that can collide with ray caster:
    this.collidableObjects.push(this.plane.getObject());
  }

  componentDidUpdate() {
    const x = this.props.activeCoordinates.x;
    const z = this.props.activeCoordinates.z;
    this.plane.updateTexture(this.props.gridTextureCanvas);
    this.box.updatePosition(x,100,z);
  }

  animate() {
    var self = this;
    requestAnimationFrame( function(){self.animate(self)} );

    // this.plane.render();
    // Render Scene:
    this.renderer.render(this.scene, this.camera);
  }

  castRay (x,y) {
    this.mouse.set(x,y);
    this.raycaster.setFromCamera(this.mouse,this.camera);

    let intersects = this.raycaster.intersectObjects( this.collidableObjects );

    if (intersects.length > 0){
      const uv = intersects[ 0 ].uv;
      const point = intersects[0].point;

      this.props.changeActiveCoordinates(uv,point);

    }

  }

  handleMouseMove(e) {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const w = this.refs.container.clientWidth;
    const h = this.refs.container.clientHeight;

    this.castRay(
      +1*( x / w ) * 2 - 1,
      -1*( y / h ) * 2 + 1
    );

  }

  render() {
    return React.createElement("div", {ref: "container", onMouseMove: this.handleMouseMove})
  }
}

class ThreeObject {
  constructor(props){
    this.scene    = props.scene;
    this.camera   = props.camera;
    this.renderer = props.renderer;
    this.size     = props.size;
  }

  addToScene () { this.scene.add( this.obj ) }
  getObject ()  { return this.obj }

};

class Lights extends ThreeObject {
  constructor (props) {
    super (props);
    this.ambientLight = new THREE.AmbientLight( 0x606060 );
    this.directionalLight = new THREE.DirectionalLight( 0xffffff , 1);
    this.directionalLight.position.set( 1, 0.75, 0.5 );
  }

  addToScene () {
    this.scene.add( this.ambientLight );
    this.scene.add( this.directionalLight );
  }
};

class Plane extends ThreeObject {
  constructor (props) {
    super (props);
    const size = 2000, step = 50;
    const geometry = new THREE.PlaneGeometry( size, size );

    let material = new THREE.MeshPhongMaterial();

    this.texture = new THREE.Texture();

    this.obj = new THREE.Mesh( geometry, material );
    this.obj.rotation.set(-Math.PI/2, 0, 0);
  }

  updateTexture(canvas) {
    this.texture = new THREE.Texture(canvas);
    this.texture.needsUpdate  = true;

    let material = this.obj.material;
    material.map = this.texture;
    material.color.setHex(0xffffff);
    material.needsUpdate = true;
  }

  render() { this.texture.needsUpdate = true }

};

class Box extends ThreeObject {
  constructor(props){
    super(props);
    this.geometry = new THREE.BoxGeometry( this.size, this.size, this.size );
    this.material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
    this.obj = new THREE.Mesh( this.geometry, this.material );
    this.obj.position.set(-950,60,-925);
  }

  updatePosition(x,y,z){
    this.obj.position.set(x,y,z);
  }

};

module.exports = {Canvas: Canvas, Box: Box, Lights: Lights, Plane: Plane};

},{}]},{},[1]);
