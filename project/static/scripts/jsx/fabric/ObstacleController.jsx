var Objects = require('/Users/lucaszw/Desktop/DropLab2/project/static/scripts/jsx/fabric/Objects.jsx');

const OBSTACLE = 1;
const UNIT = 3;

class Controller {

  constructor (grid) {
    this.grid = grid;
  }

  erase (coords) {this.grid.props.updateObstacles(coords,0);}

  draw (coords) {
    let obj = this.grid.objects[coords.x][coords.y] = new Objects.Box({
        x: coords.x*this.grid.size,
        y: coords.y*this.grid.size,
        width: this.grid.size,
        canvas: this.grid.canvas,
        background: 'rgb(200, 200, 200)'
      });

    obj.draw();

  }

  place (coords) {
    if (!this.grid.isEmpty(coords)) return;

    // If can't remove then highlight unit
    if (!this.tryRemoving(coords)){
      this.grid.activateUnit(coords);
      return false;
    }
    // this.setState({mode: HOVER});
    this.grid.props.updateObstacles(coords,1);
  }

  tryRemoving (coords) {
    // Object can't be overwritten (currently only units):
    if (this.grid.getType(coords) == UNIT) return false;
    // Can remove:
    this.grid.removeObject(coords);
    return true;
  }

  type () { return OBSTACLE; }

  update () {
    const n = this.grid.props.matrix.length;
    const m = this.grid.props.matrix[0].length;

    for (let i = 0; i < n; i++){
      for (let ii = 0; ii < m ; ii++){
        let coords = {x: i, y: ii};

        if (this.grid.props.matrix[i][ii] == 1 && this.grid.isEmpty(coords))
          this.draw (coords);

        if (this.grid.props.matrix[i][ii] == 0 && this.grid.getType(coords) == OBSTACLE)
          this.grid.removeObject (coords);

      }
    }
  }

}

module.exports = {Controller: Controller};
