(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const NOT_PRESENT = -1;
const EMPTY    = undefined;
const HOVER    = 0;
const OBSTACLE = 1;
const ERASE    = 2;
const UNIT     = 3;
const GOAL     = 4;
const CIRCLE   = 5;

class FabricObject {
  constructor (props) {
    this.x = props.x;
    this.y = props.y;
    this.width = props.width;
    this.height = props.height;
    this.canvas = props.canvas;
    this.background = props.background;
  }

  removeControls() {
    let obj = this.getObject();
    obj.lockMovementY  = true;
    obj.lockMovementX  = true;
    obj.hasBorders  = false;
    obj.hasControls = false;
  }

  getObject() {
    console.error("Please Implement Me");
  }
}

class Circle extends FabricObject {
  constructor (props) {
    super (props);

    this.circle = new fabric.Circle({
      left: this.x + this.width/4,
      top: this.y + this.width/4,
      radius: this.width/4,
      fill: this.background,
      type: props.type
    });

    this.removeControls();
  }
  getObject(){return this.circle}
  draw(){
    this.canvas.add(this.circle);
    this.removeControls();
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
      fill: this.background,
      type: props.type
    });
  }

  draw(){
    this.canvas.add(this.rect);
    this.removeControls();
  }
  getObject(){return this.rect }
  getName(){return -1};
  //OVERRIDE:
  getType(){return OBSTACLE};
}

class Unit extends Box {
  constructor (props){
    super (props);

    let spacer = (props.name.length > 1) ? "" : " ";
    let stroke = 3;
    this.rect.set({left: 0, top: 0});

    this.text = new fabric.Text(spacer+props.name, {
      top: 0,
      left: 0,
      fontSize: this.width,
      fill: 'black'
    });

    this.highlight = new fabric.Rect({
      left: -1*(this.width+stroke)/2,
      top: -1*(this.width+2*stroke)/2 ,
      width: this.width,
      height: this.width,
      type: props.type,
      fill: "rgba(255,255,255,0)",
      stroke: "black",
      strokeWidth: 3
    });

    this.group = new fabric.Group([this.rect,this.text],{
      left: this.x,
      top: this.y
    });

    this.name = props.name;

  }

  removeHighlight(){this.group.remove(this.highlight)}
  addHighlight(){this.group.add(this.highlight)}
  getName(){return this.name}

  //OVERRIDES:
  draw(){
    this.canvas.add(this.group);
    this.removeControls();
  }
  getObject(){return this.group }
  getType(){return UNIT}
}

class Goal extends Unit {
  constructor (props) {
    super (props);
    this.rect.set({fill: "rgb(222, 152, 140)"});
  }
  //OVERRIDES:
  getType(){return GOAL}
}

module.exports = {FabricObject: FabricObject, Circle: Circle, Box: Box, Unit: Unit, Goal: Goal};

},{}]},{},[1]);
