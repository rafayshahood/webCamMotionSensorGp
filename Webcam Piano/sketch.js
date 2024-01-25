//Extension 1: I've customized the graphics. I've changed the color,stroke and the opacity of the active notes that are drawn. I've also changed the shape of the notes. Also while making these effects i've made use of noteState variable at certain areas.

//Extension 2: I've worked to implement playing sound depending on the which note the grid s activated. I've used different sounds that are produced if a certain threshold is met.Each sound has different criteria to meet.I've used the monoSynth class for this purpose. 

var video;
var prevImg;
var diffImg;
var currImg;
var thresholdSlider;
var threshold;

var grid;
var monoSynth;

//Variables to play different sound
var playSound = false;
var playG4 = false;
var playA6 = false;
var playFb4 = false;


function setup() {
    createCanvas(640 * 2, 480);
    pixelDensity(1);
    video = createCapture(VIDEO);
    video.hide();

    thresholdSlider = createSlider(0, 255, 50);
    thresholdSlider.position(20, 20);

    grid = new Grid(640,480);

    //initializing to producs sound
    monoSynth = new p5.MonoSynth(); 
}

function draw() {
    background(0);
    image(video, 0, 0);

    currImg = createImage(video.width, video.height);
    currImg.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);
    
    currImg.resize(currImg.width * 0.25, currImg.height * 0.25);
    
    currImg.filter(BLUR,3);

    diffImg = createImage(video.width, video.height);
    diffImg.loadPixels();
    
    diffImg.resize(diffImg.width * 0.25, diffImg.height * 0.25);

    threshold = thresholdSlider.value();

    if (typeof prevImg !== 'undefined') {
        prevImg.loadPixels();
        currImg.loadPixels();
        for (var x = 0; x < currImg.width; x += 1) {
            for (var y = 0; y < currImg.height; y += 1) {
                var index = (x + (y * currImg.width)) * 4;
                var redSource = currImg.pixels[index + 0];
                var greenSource = currImg.pixels[index + 1];
                var blueSource = currImg.pixels[index + 2];

                var redBack = prevImg.pixels[index + 0];
                var greenBack = prevImg.pixels[index + 1];
                var blueBack = prevImg.pixels[index + 2];

                var d = dist(redSource, greenSource, blueSource, redBack, greenBack, blueBack);

                if (d > threshold) {
                    diffImg.pixels[index + 0] = 0;
                    diffImg.pixels[index + 1] = 0;
                    diffImg.pixels[index + 2] = 0;
                    diffImg.pixels[index + 3] = 255;
                } else {
                    diffImg.pixels[index + 0] = 255;
                    diffImg.pixels[index + 1] = 255;
                    diffImg.pixels[index + 2] = 255;
                    diffImg.pixels[index + 3] = 255;
                }
            }
        }
    }
    diffImg.updatePixels();
    image(diffImg, 640, 0);

    noFill();
    stroke(255);
    text(threshold, 160, 35);
    
    prevImg = createImage(currImg.width, currImg.height);
    prevImg.copy(currImg, 0, 0, currImg.width, currImg.height, 0, 0, currImg.width, currImg.height);
  
    //Nested for-loop    
    for (var i=0;i<grid.notePos.length;i++){
        for (var j=0;j<grid.notePos[i].length;j++){
            //if gride.nostate[i][j] matches certain value set its related variable to true
            if ( grid.noteState[i][j]> 0.8){
                playSound= true;
                playA6 = true;
            } 
            if ( grid.noteState[i][j]> 0.6 && grid.noteState[i][j] < 0.8){
                playSound= true;
                playG4 = true;
            } 
            if ( grid.noteState[i][j]> 0.3 && grid.noteState[i][j] < 0.6){
                playSound= true;
                playFb4 = true;
            }             
        }
    }  

    //call the notes sound function
    notesSound()
    grid.run(diffImg);
}

function notesSound(){

    if (playSound == true){
        userStartAudio();    
            if (playG4 == true){
                var note = 'G4';
                playG4 = false;
            }
            else if (playA6 == true)
            {
                var note = 'A6';
                playA6 = false;
            }
            else if (playFb4 == true)
            {
                var note = 'Fb4';
                Fb4 = false;
            }        

        //random velocity values between 0-1
        var velocity = random(0,1);
        // time from now (in seconds)
        var time = 1/3;
        // note duration (in seconds)
        var dur = 0.6;   

        monoSynth.play(note, velocity, time, dur);
        playSound = false;
    }
}

function keyPressed() {

}

// faster method for calculating color similarity which does not calculate root.
// Only needed if dist() runs slow
function distSquared(x1, y1, z1, x2, y2, z2){
  var d = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1);
  return d;
}
