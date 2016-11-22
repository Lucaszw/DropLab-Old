var Objects = require('/Users/lucaszw/Desktop/DropLab2/project/static/scripts/jsx/fabric/Objects.jsx');
var Colormap = require('colormap');

const NOT_PRESENT = -1;
const HOVER    = 0;
const EMPTY    = undefined;
const UNIT     = 3;

class Controller {
  constructor (grid) {
    this.grid = grid;

    this.colors = Colormap({
      colormap: 'jet',
      nshades: 21,
      format: 'hex',
      alpha: 1
    });

  }

  activate (coords){
    this.deactivateAll();
    const obj = this.grid.getObject(coords);
    obj.addHighlight();
    this.grid.setState({mode: HOVER, activeUnit: obj.getName()});
  }

  deactivateAll () {
    const grid = this.grid;

    grid.objects.forEach(function(row,x){
      row.forEach(function(obj,y){
        const coords = {x: x, y: y};
        if (grid.isEmpty(coords)) return;
        if (obj.getType() == UNIT) obj.removeHighlight();
      });
    });

  }

  draw (coords,index) {
    let obj = this.grid.objects[coords.x][coords.y] = new Objects.Unit({
        x: coords.x*this.grid.size,
        y: coords.y*this.grid.size,
        width: this.grid.size,
        canvas: this.grid.canvas,
        background: this.colors[index],
        name: index.toString()
      });

    obj.draw();
  }

  erase (coords) {
    const index = this.grid.getObject(coords).getName();
    this.grid.props.updateUnit(coords,index,EMPTY);
  }

  place (coords) {
    if (!this.grid.isEmpty(coords)) return;
    this.grid.props.updateUnit(coords,NOT_PRESENT,UNIT);
  }

  type () {return UNIT}

  updateAll () {
    let grid = this.grid;
    let self = this;
    grid.props.units.forEach(function(unit,index){

      if (grid.isEmpty(unit))
        self.draw(unit,index);

      if (!grid.isEmpty(unit) && unit.value == EMPTY)
        grid.removeObject (unit);

      if (!unit.hasGoal && unit.x2 != EMPTY)
        grid.removeObject({x: unit.x2, y: unit.y2});

      if (!unit.hasGoal) return;

      let goal = {x: unit.x2, y: unit.y2};

      if (grid.isEmpty(goal))
        grid.GoalController.draw(goal,index);

    });
  }


}

module.exports = {Controller: Controller};
