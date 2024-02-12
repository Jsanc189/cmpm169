// sketch.js - Images, Video, & Sound Art
// Author: Jackie Sanchez
// Date: 2/2/24

'use strict'

//variables
var mic;
var video;
var x;
var y;
var curvePointX = 0;
var curvePointY = 0;
var pointCount = 3;
var diffusion = 50;
var soundThreshold = 0.02;
var streamReady = false;


function setup() {
  createCanvas(640, 480);  //set canvas size
  background(255);  //set the background to white

  getAudioContext().suspend();
  
  x = width /2;    //center x
  y = height /2;   //center y

  function mousePressed() {
    userStartAudio();
  }
  
  mic = new p5.AudioIn();
  mic.start();
  
  //create a video capture
  video = createCapture(VIDEO, function(){
    streamReady = true;
  });
  
  //set the size of the image to the width and height based on pixel density
  video.size(width * pixelDensity(), height * pixelDensity());
  
  //hide the video from the screen
  video.hide();
  
  //set the interior of shapes to no color
  noFill();
}

function draw() {
  //Get the volumn level from the microphone
  var soundLevel = mic.getLevel();
  
  if(soundLevel > soundThreshold) {
    
  
    if (streamReady) {
      // Get the color from the video
      var c = color(video.get(width - x, y));
    
      // Convert color under 'c' to Hue Saturation Value
      var cHSV = chroma(red(c), green(c), blue(c));
    
      // Set the stroke weight to the cHSV value divided by 50
      strokeWeight(5);
    
      // Set the color of the stroke to c
      stroke(c);
    
      // Set the diffusion variable to a new range based on height to 5-100
      diffusion = map(mouseY, 0, height, 5, 100);
    
      // Draw shapes with x and y
      beginShape();
    
      // Draw a circular shape for the note head
      var radius = 20; // You can adjust the radius
      for (var angle = 0; angle <= 180; angle += 5) {
        var xPos = x + radius * cos(radians(angle));
        var yPos = y + radius * sin(radians(angle));
        curveVertex(xPos, yPos);
      }
    
    // Draw the stem
    var stemHeight = 50; // You can adjust the stem height
    curveVertex(x, y);
    curveVertex(x, y + stemHeight);
    
    endShape();
    
    // Set x and y as the curve points
    x = constrain(x + random(-diffusion, diffusion), 0, width - 1);
    y = constrain(y + random(-diffusion, diffusion), 0, height - 1);
    }
  }
}
  
  
function keyReleased() {
  if (keyCode == DELETE || keyCode == BACKSPACE) clear();
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
  if (key == 'q' || key == 'Q') noLoop();
  if (key == 'w' || key == 'W') loop();
  if (keyCode == UP_ARROW) pointCount = min(pointCount + 1, 30);
  if (keyCode == DOWN_ARROW) pointCount = max(pointCount - 1, 1);
}