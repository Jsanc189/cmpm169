// sketch.js - purpose and description here
// Author: Jackie Sanchez
// Date: 1/20/2024

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
//global variables
var size = 10;
var my_color;6
var my_shape;
var angle = 0;
var rot_speed = 1;
var spawn_space = 0;

function setup() {
  //create canvas with a background as black
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized
  $(window).resize(function() {
      console.log("Resizing...");
      resizeCanvas(canvasContainer.width(), canvasContainer.height());
  });
  background(0); 
  
  //create a cursor
  cursor(CROSS);
  
  //set shape color and shape
  my_color = color(255,0,0);
  my_shape = 'circle';
}

function draw() {
  //save the canvas state and move the canvas to where the mouse is
  push();
  translate(mouseX, mouseY);
  
  //rotate the cavas by the angle 
  rotate(angle);
  
  //check the shape state and draw the corresponding shape
  if(my_shape == 'circle') {
    fill(my_color)
    ellipse(spawn_space, spawn_space, size, size);
  } else if(my_shape == 'rectangle') {
    fill(my_color)
    rect(spawn_space, spawn_space, size, size);
  } else if(my_shape == 'triangle') {
    fill(my_color)
    triangle(spawn_space, spawn_space, spawn_space, size, -size, spawn_space);
  }
  
  //add to the angle by the rotation speed
  angle += rot_speed;
  
  //reset the canvas back to its original state
  pop();  
}


function keyPressed() {
   //if up or down arrow key pressed, change the size of the shape
   if (keyCode == '87') size += 10;
   if (keyCode == '83') size -=10;
   
   //if left or right arrow pressed change the spawn displacement from x and y
   if (keyCode == '65') spawn_space += 1;
   if (keyCode == '68') spawn_space -=1;
}

function keyReleased() {
    //if space is released, change to a random color
    if (key == ' ') my_color = color(random(255), random(255), random(255));
    
    //if 1-3 keys are pressed, change to corresponding shape
    if (key == '1') {
      my_shape = 'circle';
    } else if (key == '2') {
      my_shape = 'rectangle';
    } else if (key == '3') {
      my_shape = 'triangle';
    }
} 