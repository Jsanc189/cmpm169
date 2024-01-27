// sketch.js - purpose and description here
// Author: Jackie Sanchez   
// Date:    1/25/2024

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

//lists to carry particle objects
var particles_a = [];
var particles_b = [];
var particles_c = [];
var clouds = [];

//color pallets
var morning_green = [215, 99, 127, 235, 208];
var morning_blue  = [0, 71, 80, 59, 46];

var afternoon_green = [165, 140, 0];

var twilight_red = [106, 90, 205];
var twilight_green = [90, 61, 43];
var twilight_blue = [205, 139, 226];


//variable to limit how many particles are in each list
var nums = 100;
var nums_cloud = 7;

//variable to hold the noise range
var noiseScale = 3000;

function setup() {
  //create a canvas that takes up the window width and height
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized
  $(window).resize(function() {
      console.log("Resizing...");
      resizeCanvas(canvasContainer.width(), canvasContainer.height());
  });
  
  //set the background color
  background(139, 0, 139);
  
  //populate the particle lists with helper function at a random x and y coordinate
  for(var i = 0; i < nums; i++){
    particles_a.push(new Particle(random(0, width), random(0, height)));
    particles_b.push(new Particle(random(0, width), random(0, height)));
    particles_c.push(new Particle(random(0, width), random(0, height)));
    
  }
  
  for (var i = 0; i < nums_cloud; i++){
    clouds.push(new Cloud(random(0, width/9), random(0, height/8)));
  }

}



function draw() {
  //no outlien for shapes
  noStroke();
  
  //draws geometry with smooth edges
  smooth();
  
  
  // for each i from 0 to nums
  for(var i = 0; i < nums; i++){
    //variable radius that re sizes  the scale from i in the scale of 0 to nums
    //to the scale from 1-2
    var radius = map(i, 0, nums, 1,2);
    
    //variable to set the alpha i from 0-nums to 0-250
    var alpha = map(i, 0, nums, 0, 250);

    
    //set the color based on a number with transparency alpha
    fill(255 , random(morning_green), random(morning_blue), alpha);
    //move particles in particle list a
    particles_a[i].move();
    particles_a[i].display(radius);
    particles_a[i].checkEdge();
    
    //change color and move the b particles
    fill(255, random(afternoon_green), 0, alpha);
    particles_b[i].move();
    particles_b[i].display(radius);
    particles_b[i].checkEdge();
    
    //change color and move the c particles
    
    fill(random(twilight_red), random(twilight_green), random(twilight_blue), alpha);
    particles_c[i].move();
    particles_c[i].display(radius);
    particles_c[i].checkEdge();
  }
  
  
  //stroke(random(twilight_red), random(twilight_green), random(twilight_blue))
    //draw clouds
  for (var i =0; i < nums_cloud; i++) {
    clouds[i].move();
    clouds[i].display();
  }

}


//Class to create a particle with behaviors
function Particle(x,y){
  //make a direction vector with no starting direction
  this.dir = createVector(0,0);
  
  //make a velocity vector with no starting velocity
  this.vel = createVector(0,0);
  
  //create a position vector with x and y parameters
  this.pos = createVector(x,y);
  
  //set a speed
  this.speed = 0.4;
  
  //function to move the particle
  this.move = function() {
    //variable to set the angle utilizing noise based of position of x and y of point
    var angle = noise(this.pos.x/noiseScale, this.pos.y/noiseScale) * TWO_PI * noiseScale;
    
    //move the direction of x to the cosin of the angle calculated above
    this.dir.x = cos(angle);
    //move the direction of y to the sin of the angle calculated above
    this.dir.y = sin(angle);
    
    //set the velocity of the point to the new direction as a copy
    this.vel = this.dir.copy();
    
    //multiply the velocity with the speed
    this.vel.mult(this.speed);
    
    //set the position of the point by adding the velocity vector to it
    this.pos.add(this.vel);
  }
  
  //function to move the position of a particle back into the canvas if it moves outside
  //the window bounds
  this.checkEdge = function() {
    if(this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0){
      this.pos.x = random(50, width);
      this.pos.x = random(50, height);
    }
  }
  
  //make and ellips at pos x and y to a size of parameter r
  this.display = function(r) {
    
    bezier(this.pos.x, this.pos.y, -this.pos.x + r, -this.pos.y - r, this.pos.x - r, this.pos.y +r, r, r);
  }
  
}

// Class to create a cloud shape
function Cloud(x, y) {
  this.x = x;
  this.y = y;
  this.speed = random(0.15, 0.25); // Adjust the speed as needed
  this.minX = x - 50; // Set the minimum x-coordinate
  this.maxX = x + 50; // Set the maximum x-coordinate


  // Function to move the cloud back and forth
  this.move = function() {
    this.x += this.speed;

    // If the cloud reaches the maximum x-coordinate, reverse the direction
    if (this.x > this.maxX) {
      this.speed *= -1;
      this.x = this.maxX;
    }

    // If the cloud reaches the minimum x-coordinate, reverse the direction
    if (this.x < this.minX) {
      this.speed *= -1;
      this.x = this.minX;
    }
  }

  // Function to display the cloud
  this.display = function() {
    fill(255, 200); // Clouds are white with some transparency
    ellipse(this.x, this.y, 100, 60);
    ellipse(this.x + 30, this.y - 20, 80, 40);
    ellipse(this.x - 30, this.y - 40, 80, 40);
    ellipse(this.x +40, this.y+30, 60, 30);
  }
}