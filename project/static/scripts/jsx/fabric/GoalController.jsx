const EMPTY    = undefined;
const GOAL     = 4;

var Objects = require('/Users/lucaszw/Desktop/DropLab2/project/static/scripts/jsx/fabric/Objects.jsx');

class Controller {
  constructor (grid){
    this.grid = grid;
  }

  draw (coords, index){
    let obj = this.grid.objects[coords.x][coords.y] = new Objects.Goal({
        x: coords.x*this.grid.size,
        y: coords.y*this.grid.size,
        width: this.grid.size,
        canvas: this.grid.canvas,
        name: index.toString()
      });

    obj.draw();
  }

  erase (coords) {
    const index = this.grid.getObject(coords).getName();
    this.grid.props.updateGoal(coords,index,EMPTY);
  }

  place (coords){
    let index = this.grid.state.activeUnit;
    if (index == EMPTY ) return false;

    this.grid.props.updateGoal(coords,index, GOAL);
  }

  type (){return GOAL}

}
module.exports = {Controller: Controller};
