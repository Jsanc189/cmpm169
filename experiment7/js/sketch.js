// sketch.js - Data Visualization with Steam Hours
// Author: Jackie Sanchez
// Date:2/24/2024

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
//have a constant variable set to F
let data; // Variable to store the parsed CSV data
let circles = []; // Array to store information about drawn circles
let csvDataReady = false; // Flag to track whether CSV data is ready
let maxAttempts = 1500; // Maximum number of attempts to place a circle without overlap
let minDistance = 1
let backgroundImage;

// Define the Neon Waves Gaming Classic Palette Color RGB values
const neonWavesPalette = [
    [150, 0, 128],   // Dark Purple
    [40, 153, 204],  // Blue
    [153, 255, 51], // Lime Green
    [255, 102, 0],  // Orange
    [255, 200, 0],  // Yellow
    [255, 0, 102],  // Pink
];

// Canvas size
const canvasWidth = 1000;
const canvasHeight = 1000;

// URL of your CSV file
const csvFilePath = 'VideoGameHours.csv';

// Fetch the CSV file
fetch(csvFilePath)
    .then(response => response.text())
    .then(contents => {
        // Parse CSV content
        data = processCSV(contents);
        // Set flag to indicate that CSV data is ready
        csvDataReady = true;
    })
    .catch(error => console.error('Error fetching the CSV file:', error));

function processCSV(contents) {
    // Split CSV content into rows
    const rows = contents.split('\n');

    // Initialize an object to store the parsed CSV data
    const parsedData = {};

    // Parse CSV rows
    rows.forEach(row => {
        // Split the row into an array of values
        const [key, val] = row.split(',');

        // Trim key and value
        const trimmedKey = key.trim();
        const trimmedVal = val.trim();

        // Store the data with the key-value pair
        parsedData[trimmedKey] = trimmedVal;
    });

    // Return the parsed data
    return parsedData;
}


function preload() {
  backgroundImage = loadImage('pc_gaming.png')
}

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
    image(backgroundImage, 0, 0, width, height);
    noLoop(); // Draw only once
    drawCircles();
}

function drawCircles() {
    // Clear existing circles
    circles = [];

    // Loop until all circles are drawn
    while (Object.keys(data).length > 0) {
        // Find the key with the maximum value (hours played)
        let maxKey = null;
        let maxValue = -Infinity;
        for (let key in data) {
            let value = parseFloat(data[key]);
            if (value > maxValue) {
                maxValue = value;
                maxKey = key;
            }
        }

        // If no valid maximum key is found, exit the loop
        if (!maxKey) break;

        // Calculate diameter for the maximum value
        let diameter = map(maxValue, 0, 100, 20, 100);

        // Attempt to place the circle without overlap
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < maxAttempts) {
            let x = random(diameter / 2, canvasWidth - diameter / 2);
            let y = random(diameter / 2, canvasHeight - diameter / 2);

            // Check for overlap with existing circles
            let overlap = false;
            for (let i = 0; i < circles.length; i++) {
                let d = dist(x, y, circles[i].x, circles[i].y);
                if (d < (diameter / 2 + circles[i].diameter / 2)) {
                    overlap = true;
                    break;
                }
            }

            if (!overlap) {
                // Draw the circle
                circles.push({ x: x, y: y, diameter: diameter });
                
                let randomIndex = floor(random(neonWavesPalette.length));
                let mycolor = neonWavesPalette[randomIndex];
              
                fill(color(mycolor[0],mycolor[1],mycolor[2]));
                ellipse(x, y, diameter, diameter);
              
              // Set text size inversely proportionate to circle diameter
                let textSizeProportion = map(diameter, 20, 100, 12, 24);
                textSize(textSizeProportion);
              
                textAlign(CENTER, CENTER);
                fill(255);
              
                // Check if text fits within the circle
                let textWidthLimit = diameter * 0.8; // Adjust the factor as needed
                let textFits = textWidth(maxKey) < textWidthLimit;
                
                // Reduce text size until it fits within the circle
                while (!textFits && textSize() > 8) {
                    textSize(textSize() - 1);
                    textFits = textWidth(maxKey) < textWidthLimit;
                }
              

                text(maxKey, x, y);


                // Remove the drawn circle from the data dictionary
                delete data[maxKey];
                placed = true;
            }

            attempts++;
        }

        if (attempts >= maxAttempts) {
            console.log("Max attempts reached for", maxKey);
        }
    }
}

