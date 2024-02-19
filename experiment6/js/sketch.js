// sketch.js - L systems using a grammar
// Author: Jackie Sanchez
// Date:2/18/2024

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
//have a constant variable set to F
const axiom = "F";

  //set up a rule that changes the value of F
  let rules = {
    "F": "F+G-F-J+F",
    "G": "-I+J-J+G",
    "H": "+H-H-I+I",
    "I": "-J+F+G+J",
    "J": "F-F+J-I",
    "-": "-",
    "+": "+"
  }
  

//set the sentence to the axium
let sentence = axiom;

//set a length
let len = 50;

function setup() {
  //create Canvas
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized
  $(window).resize(function() {
      console.log("Resizing...");
      resizeCanvas(canvasContainer.width(), canvasContainer.height());
  });
  
  //prevent Draw from looping
  noLoop();
  
  executeLSystem("F", 7)
  
  //set background to black
  background(color(109,0,139));
  
  //set stroke to white
  stroke(255);
  
  //no filling
  noFill();
  
  //for i from 0 to 4
  for (let i = 0; i < 10; i++) {
    
    //call the generate function
    //generate();
  }
  
  //call the draw L system function
  drawLSystem();
}


function executeLSystem(axiom, iterations) {
  let sentence = axiom;
  let nextString = "";
  
  
  for (let i = 0; i < iterations; i ++) {
    nextString = "";
    for (let char of sentence) {
      if (rules[char]) {
        nextString += rules[char];
      } else {
        nextString += char;
      }
    }
    
    sentence = nextString;
    generate()
  }
  
}

function generate() {
  //create an empty string
  let nextSentence = "";
  
  //fir u from 0 to sentence length
  for (let i = 0; i < sentence.length; i++) {
    
    //hold the character in the sentence at the ith position
    let current = sentence.charAt(i);
    
    //add the rule of the current character.  If there is no rule, then add the current character
    nextSentence += rules[current] || current;
  }
  
  //set the sentence to the next Sentence
  sentence = nextSentence;
  
  //multiply the len by .5
  len *= 0.5;
}



function drawLSystem() {
  let scaleFactor = 4;
  
  //move tot he middle of the width and to height of the canvas
  translate(width/2, (height/3)*2);
  
  //scale up the drawing
  scale(scaleFactor);
  
  let blueYellowPalette = [
    color(68, 108, 179), // Dark blue
    color(120, 200, 214), // Medium blue
    color(200, 200, 255), // Light blue
    color(255, 100, 153), // Light yellow
    color(255, 204, 0)    // Yellow
  ];
  
  let palletIndex = 0;
  
  //for i from 0 to sentence length
  for (let i = 0; i < sentence.length; i++) {
    //stroke(bluePallet[random(3)])
    
    //hold the character in the sentence at the ith position
    let current = sentence.charAt(i);
    
    //if it is "F"
    if (current === "F") {
      stroke(blueYellowPalette[0])
      //draw a line at the position
      line(0, 0, -len * scaleFactor, 0);
      //move to a new poition on the canvas
      translate(-len * scaleFactor, 0);
      //else if the current is a plus
    } else if (current === "G") {
      stroke(blueYellowPalette[2])
      //draw a circle
      ellipse(0,0, len*7, -len*9)
      translate(-len* scaleFactor, 0);
    } else if (current === "+") {
      //rotate the canvas by 90 
      rotate(radians(90));
      //else if current is a minus
    } else if (current === "-") {
      //rotate the canvas by -90
      rotate(radians(-90));
    } else if (current === "H") {
      stroke(blueYellowPalette[1])
      triangle(-len * scaleFactor , 0, 0, 0, len, len);
      translate(-len * scaleFactor, 0)
    }
    // } else if (current === "J") {
    //   stroke(blueYellowPalette[2]);
    //   line(0, 0, len * scaleFactor, 0);
    //   translate(len * scaleFactor, scaleFactor);
    // }
    
  }
}