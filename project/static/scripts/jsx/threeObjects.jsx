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
    return <div ref="container" onMouseMove={this.handleMouseMove} ></div>
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
