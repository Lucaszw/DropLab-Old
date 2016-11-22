var Objects = require('/Users/lucaszw/Desktop/DropLab2/project/static/scripts/jsx/fabric/Objects.jsx');

class Controller {
  constructor (grid){
    this.grid = grid;
  }

  erase () {
    const n = this.grid.pathPoints.length;
    for (let i = 0; i< n; i++){
      let point = this.grid.pathPoints.pop();
      this.grid.canvas.remove(point.getObject());
    }
  }

  draw (path) {
    let grid = this.grid;

    this.erase();
    path.forEach(function (coords){

      let x = coords[1];
      let y = coords[0];

      let obj = new Objects.Circle({
          x: x * grid.size,
          y: y * grid.size,
          width: grid.size,
          canvas: grid.canvas,
          background: 'rgb(200, 200, 200)'
        });

      grid.pathPoints.push(obj);

      obj.draw();

    });

    path.needsDrawing = false;

  }
}

module.exports = {Controller: Controller};
