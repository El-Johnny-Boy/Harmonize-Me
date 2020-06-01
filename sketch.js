var cols, rows;
var w = 24;
var grid = [];
var tiles = [];
var tempTileSize = 1;
var tileSize = 1;

var guitar = _tone_0253_Acoustic_Guitar_sf2_file;
var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContextFunc();
var output = audioContext.destination;
var player = new WebAudioFontPlayer();
var scales = [[1, 2, 4, 6, 8, 9, 11],   //A Major
              [0, 2, 3, 5, 7, 9, 10],   //A# Major
              [1, 3, 4, 6, 8, 10, 11],  //B Major
              [0, 2, 4, 5, 7, 9, 11],   //C Major
              [0, 1, 3, 5, 6, 8, 10],   //C# Major
              [1, 2, 4, 6, 7, 9, 11],   //D Major
              [0, 2, 3, 5, 7, 8, 10],   //D# Major
              [1, 3, 4, 6, 8, 9, 11],   //E Major
              [0, 2, 4, 5, 7, 9, 10],   //F Major
              [1, 3, 5, 6, 8, 10, 11],  //F# Major
              [0, 2, 4, 6, 7, 9, 11],   //G Major
              [0, 1, 3, 5, 7, 8, 10],   //G# Major
              [1, 4, 6, 9, 11],         //A Major Pentatonic
              [0, 2, 5, 7, 10],         //A# Major Pentatonic
              [1, 3, 6, 8, 11],         //B Major Pentatonic
              [0, 2, 4, 7, 9],          //C Major Pentatonic
              [1, 3, 5, 8, 10],         //C# Major Pentatonic
              [2, 4, 6, 9, 11],         //D Major Pentatonic
              [0, 3, 5, 7, 10],         //D# Major Pentatonic
              [1, 4, 6, 8, 11],         //E Major Pentatonic
              [0, 2, 5, 7, 9],          //F Major Pentatonic
              [1, 3, 6, 8, 10],         //F# Major Pentatonic
              [2, 4, 7, 9, 11],         //G Major Pentatonic
              [0, 3, 5, 8, 10],         //G# Major Pentatonic
              [0, 2, 4, 5, 7, 9, 11],   //A Minor
              [0, 1, 3, 5, 6, 8, 10],   //A# Minor
              [1, 2, 4, 6, 7, 9, 11],   //B Minor
              [0, 2, 3, 5, 7, 8, 10],   //C Minor
              [1, 3, 4, 6, 8, 9, 11],   //C# Minor
              [0, 2, 4, 5, 7, 9, 10],   //D Minor
              [1, 3, 5, 6, 8, 10, 11],  //D# Minor
              [0, 2, 4, 6, 7, 9, 11],   //E Minor
              [0, 1, 3, 5, 7, 8, 10],   //F Minor
              [1, 2, 4, 6, 8, 9, 11],   //F# Minor
              [0, 2, 3, 5, 7, 9, 10],   //G Minor
              [1, 3, 4, 6, 8, 10, 11],  //G# Minor
              [0, 2, 4, 7, 9],          //A Minor Pentatonic
              [1, 3, 5, 8, 10],         //A#
              [2, 4, 6, 9, 11],         //B
              [0, 3, 5, 7, 10],         //C
              [1, 4, 6, 8, 11],         //C#
              [0, 2, 5, 7, 9],          //D
              [1, 3, 6, 8, 10],         //D#
              [2, 4, 7, 9, 11],         //E
              [0, 3, 5, 8, 10],         //F
              [1, 4, 6, 9, 11],         //F#
              [0, 2, 5, 7, 10],         //G
              [1, 3, 6, 8, 11],         //G#
            ];

var now = 0;
var t = audioContext.currentTime;
var mainTrack = [];
var isTrackPlaying = false;
var recursiveID;

player.loader.decodeAfterLoading(audioContext, '_tone_0253_Acoustic_Guitar_sf2_file');

var dropdown = document.getElementsByClassName("dropbtn");


function setup() {
  var canvas = createCanvas(1200, 864);
  canvas.parent('sketch-holder');
  cols = floor(width/w);
  rows = floor(height/w);

  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }
}

function draw() {
  background(255);
  for (var i = 0; i < grid.length; i++) {
    grid[i].show();
  }

  drawTilePreview();
  for (var i = 0; i < tiles.length; i++) {
    tiles[i].show();
  }

  let fps = frameRate();
  fill(255);
  stroke(0);
  text("FPS: " + fps.toFixed(2), 10, height - 10);
  
}


//ToDo : sent which tile needs to be clicked
function mousePressed() {
  for (var i = 0; i < grid.length; i++) {
    grid[i].clicked();
  }

  for (var i = 0; i < tiles.length; i++) {

  }
}

function mouseWheel(event) {
  tempTileSize += event.delta / -100;
  tileSize = Math.min(Math.max(parseInt(tempTileSize), 1), 8);

}

function Cell(i, j) {
  this.i = i;
  this.j = j;
  this.r = 255;
  this.g = 255;
  this.b = 255;


  this.isClicked = false;
  this.isHiglighted = false;

  this.show = function() {
    var x = this.i * w;
    var y = this.j * w;

    stroke(0);
    if (!this.isClicked) {
      if (!this.isHiglighted) {
        this.r = 255;
        this.g = 255;
        this.b = 255;
      }
      else {
        this.r = 255;
        this.g = 102;
        this.b = 102;
      }
    }


    fill(this.r, this.g, this.b);
    rect(x, y, w, w);
  }

  this.clicked = function() {
    var x = this.i * w;
    var y = this.j * w;
    var notePitch = getPitch(y);
    var noteStartTime = getStartTime(x);
    var noteDuration = getNoteDuration(tileSize);
    var tileCheck = checkForExistentTiles(i * w, j *w);

    if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + w) {
      if (!this.isClicked) {
        this.isClicked = true;
        cancel();
        playNote(notePitch, now, noteDuration);
        mainTrack.push([notePitch, noteStartTime, noteDuration]);
        hideScalesButtons(notePitch % 12);
        if (tileCheck == -1) {
          var tile = new Tile(i, j, tileSize);
          tiles.push(tile);
        }
      }
      else {
        cancel();
        this.isClicked = false;
        var noteIndex = findObjectIndex(notePitch, noteStartTime);
        if (noteIndex > -1) {
          mainTrack.splice(noteIndex, 1);
        }
        if (tileCheck > -1) {
          tiles.splice(tileCheck, 1);

        }
      }
    }
  }

}

function Tile(i, j, tileW) {
  this.x = i * w;
  this.y = j * w;
  this.tileWidth = tileW;

  this.show = function() {
    stroke(255, 0, 0);
    fill(255, 127, 80);
    rect(this.x, this.y, this.tileWidth * 24, w);
  }
}

function checkForExistentTiles(x, y) {
  //console.log("Number of tiles: " + tiles.length.toString());
  for (var i = 0; i < tiles.length; i++) {
    if (tiles[i].x == x && tiles[i].y == y) {
      return i;
    }
  }
  return -1;
}

function drawTilePreview() {
  var x = floor(mouseX / 24) * 24;
  var y = floor(mouseY / 24) * 24;
  stroke(255, 0, 0);
  strokeWeight(2);
  noFill();
  rect(x, y, tileSize * 24, w);
}

function playNote(pitch, when, dur) {
  audioContext.resume();
  player.queueWaveTable(audioContext, output, guitar, when, pitch, dur);
}

function cancel() {
  player.cancelQueue(audioContext);
}

function playTrack() {
  isTrackPlaying = true;
  mainTrack.sort(function(a, b) {return a[1] - b[1]})
  playTrackRecursively(0);
}

function playTrackRecursively(id) {
  var delay = 0;
  var notesBatch = getNotesOfSameStartTime(mainTrack[id][1]);
  playNotesInBatch(notesBatch);
  if (id + notesBatch.length < mainTrack.length && isTrackPlaying){
    delay = mainTrack[id + notesBatch.length][1] - mainTrack[id][1];
    recursiveID = setTimeout(function() {
      playTrackRecursively(id + notesBatch.length);
    }, delay * 1000);
  }
}

function playNotesInBatch(notes) {
  for (var i = 0; i < notes.length; i++) {
    playNote(notes[i][0], notes[i][1], notes[i][2]);
  }
}

function getNotesOfSameStartTime(startTime) {
  var indexArray = []
  for (var i = 0; i < mainTrack.length; i++) {
    if (mainTrack[i][1] == startTime) {
      indexArray.push(i);
    }
  }
  var batch = mainTrack.slice(indexArray[0], indexArray[indexArray.length - 1] + 1);
  return batch;
}

function stopTrack() {
  isTrackPlaying = false;
  clearTimeout(recursiveID);
  player.cancelQueue(audioContext);
}

function resetSheet() {
  stopTrack();
  for (var i = 0; i < grid.length; i++) {
      grid[i].isClicked = false;
  }
  mainTrack = [];
  tiles = [];
}

function getPitch(y) {
  return 78 - floor(y / 24);
}

function getStartTime(x) {
  return 0.25 * floor(x / 24);
}

function getNoteDuration(l) {
  return 0.25 * l;
}

function findObjectIndex(y, x) {
  for (var i = 0; i < mainTrack.length; i++) {
    if (mainTrack[i][0] == y && mainTrack[i][1] == x) {
      return i;
    }
  }
  return -1;
}

function hideScalesButtons(pitch) {
  for (let scale of findScalesWithoutNote(pitch)) {
    //console.log(scale);
    
    //$(".container :input").filter(function(){return this.value==scale.toString()}).hide();
    //console.log($(".container :input[value='" + scale.toString() + "']").val());
    $("#amajor").hide();

  }
}

function* findScalesWithoutNote(pitch) {
  for (var i = 0; i < scales.length; i++) {
    if (!scales[i].includes(pitch)) {
      yield i;
    }
  }
}