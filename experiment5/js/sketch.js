// sketch.js - 3D art
// Author: Jackie Sanchez
// Date:2/12/2024

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

//Declare variables
let scale = 20;
let cols, rows;
let w;
let h;

let flightPos = 0;
let terrain =[];
let raindrops = [];
let colors = [];

let backgroundImage;

//a function that sets the flight speed, noise change and terrain height
let Controls = function() {
  this.flightSpeed = 0.08;
  this.noiseDelta = 0.16;
  this.terrainHeight = 112;
};

//creates and instance of the control function
let controls = new Controls();


function preload() {
  backgroundImage = loadImage("moon_sky.jpg");
}

function setup() {
    canvasContainer = $("#canvas-container");
    let canvas = createCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL);
    canvas.parent("canvas-container");
    // resize canvas is the page is resized
    $(window).resize(function() {
        console.log("Resizing...");
        resizeCanvas(canvasContainer.width(), canvasContainer.height());
    });

  for (let i = 0; i < 10; i++) {
    colors.push(color(0, 100, 255 - i * 20));
  }
  
  // let lightestBlue = colors[colors.length - 1];
  // let lightestBlueRGB = [red(lightestBlue), green(lightestBlue), blue(lightestBlue)];
  // console.log(lightestBlueRGB);
  
  //makes a graphic user interface w/ width of 295
  //let gui = new dat.GUI({width: 295});
  
  //closes gui interface until the user clicks it open
 // gui.close();
  
  //creates a slider for the flight speed from 0 to 0.4 with a step of 0.02
  //gui.add(controls, 'flightSpeed', 0, 0.4).name("Flight speed").step(0.02);
  
  //creates a slider for the noise Delta from 0.05 to 0.4 with a step of 0.01
  //gui.add(controls, 'noiseDelta', 0.05, 0.4).name("Noise delta").step(0.01);
  
  //creates a slider for the terrain height from 0 to 200 with a step of 1
  //gui.add(controls, 'terrainHeight', 0, 200).name("Terrain height").step(1);
  
  w = width;
  h = height;
  
  cols = w / scale;
  rows = h / scale;
  
  //populate the empty terrain list with an empty list for the # of cols
  for (let i = 0; i < cols; ++i){
    terrain[i] = [];  
  }
  
  //make raindrops
  for (let i = 0; i < 500; i++) {
    
    raindrops.push(new Raindrop());
  }
}

function draw() {
  let scaleFactor = 2;
  
  let newWidth = backgroundImage.width * scaleFactor;
  let newHeight = backgroundImage.height * scaleFactor;
  
  // Calculate the position to center the scaled-up image
  let xPosition = (width - newWidth) / 2 - 50;
  let yPosition = (height - newHeight) / 2 -500;
  //update the flight position to move toward the screen by the # in the controls flight speed
  flightPos -= controls.flightSpeed;
  
  //call the shiftNoiseSpace function to make a new set of points on terrain
  shiftNoiseSpace();
  
  //set the background to a color
  // background(51);
  
  background(0);
  image(backgroundImage, xPosition, yPosition, newWidth, newHeight);
  
  //Find the lowest point of the terrain
  let lowestPoint = height / 4;

  
  // my_color = color(0, 100, 255 -80);
  
  //draw rectangle
  fill(colors[0]);
  stroke(colors[0]);
  rect(-width /2, lowestPoint, width, height - lowestPoint);
  
  
  //rotate the canvas about the X axis by pi divided by 3
  rotateX(PI / 3);
  
  //displace the object
  translate((-w / 2) +1, (-h / 2) + 30), 0;
  
  //for rows from 0 to rows minus 1
  for (let y = 0; y < rows - 1; ++y){
    
    //begin drawing triangle strip shape
    beginShape(TRIANGLE_STRIP);
    
    //fol columns from 0 to cols
    for (let x = 0; x < cols; ++x){
      
      //get color for terrain based on height
      let c1 = colorizeTerrain(terrain[x][y]);
      stroke(c1);
      fill(c1);  
      //console.log(c1);
      //set a vertex
      vertex(x * scale, y * scale, terrain[x][y]);
      
      
      //set another vertex
      c2 = colorizeTerrain(terrain[x][y+1]);
      //console.log(c2);
      stroke(c1);
      fill(c2);
      vertex(x * scale, (y+1) * scale, terrain[x][y+1]);
    }
    //end drawing of the shape
    endShape();
  }
  
  //Update the raindrops displayed
  for(let drop of raindrops) {
    drop.fall();
    drop.display();
  }
}


function shiftNoiseSpace() {
  let yOffset = flightPos;
  for (let i = 0; i < rows; ++i) {
    let xOffset = 0;
    for (let j = 0; j < cols; ++j) {
      // Use modulo operator to create periodic boundary conditions
      let xIndex = (j + cols) % cols; // Ensure the index is always positive
      let yIndex = (i + rows) % rows;
      terrain[j][i] = map(noise(xOffset, yOffset), 0, 1, -controls.terrainHeight, controls.terrainHeight);
      xOffset += controls.noiseDelta;
    }
    yOffset += controls.noiseDelta;
  }
}

class Raindrop{
  constructor() {
    //set the x coordinate of the raindrop to a random value in width
    this.x = random(width);
    
    //set the y coordinate of the raindrop to a random value between -500 and -50
    this.y = random(-500, -50);
    
    this.z = random(-500, 500);
    
    //set the speed of the falling of the rain
    this.speed = random(5,10);
    
    //set the length of the raindrop
    this.length = random(5,7);
  }
  
  fall() {
    //move the raindrop down
    this.y += this.speed;
    
    let terrainX = floor(constrain(this.x / scale, 0, cols -1));
    let terrainY = floor(constrain(this.y / scale, 0, rows - 1));
    let terrainZ = terrain[terrainX][terrainY];
    
    //if the raindrop reaches the bottom, reset position
    if (this.y > height) {
      this.y = random(-200, -100);
      this.x = random(width);
      this.z = random(-500, 500);
    }
  }
  
  display() {
    // Blue color for raindrops
    stroke(255, 255, 255);
    
    let terrainX = floor(constrain(this.x / scale, 0, cols -1));
    let terrainY = floor(constrain(this.y / scale, 0, rows - 1));
    let terrainZ = terrain[terrainX][terrainY];
    
    
    point(this.x, this.y, this.z, terrainZ);
    
  }
}

function colorizeTerrain(height) {
  let index = floor(map(height, -controls.terrainHeight, controls.terrainHeight, 0, colors.length - 1));
  return colors[index];

}