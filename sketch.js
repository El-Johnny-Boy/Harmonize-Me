var cols, rows;
var w = 24;
var grid = [];
var tempTileSize = 1;
var tileSize = 1;

var guitar = _tone_0253_Acoustic_Guitar_sf2_file;
var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContextFunc();
var output = audioContext.destination;
var player = new WebAudioFontPlayer();

var now = 0;
var t = audioContext.currentTime;
var mainTrack = [];
var isTrackPlaying = false;
var recursiveID;

player.loader.decodeAfterLoading(audioContext, '_tone_0253_Acoustic_Guitar_sf2_file');

function setup() {
  var canvas = createCanvas(1200, 2112);
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
}

function mousePressed() {
  for (var i = 0; i < grid.length; i++) {
    grid[i].clicked();
  }
}

function mouseWheel(event) {
  tempTileSize += event.delta / -100;
  tileSize = Math.min(Math.max(parseInt(tempTileSize), 1), 8);
  console.log(tileSize);

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

    if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + w) {
      //this.isHiglighted = true;
      for (var i = 0; i < tileSize; i++) {
        grid[i].isHiglighted = true;
      }
    }
    else {
      this.isHiglighted = false;
    }
    stroke(51);
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
    if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + w) {
      if (!this.isClicked) {
        cancel();
        playNote(getPitch(y), now);
        mainTrack.push([notePitch, noteStartTime]);
        this.isClicked = true;
        this.r = 255;
        this.g = 0;
        this.b = 0;
      }
      else {
        cancel();
        this.isClicked = false;
        var noteIndex = findObjectIndex(notePitch, noteStartTime);
        if (noteIndex > -1) {
          mainTrack.splice(noteIndex, 1);
          console.log(mainTrack);
        }
      }
    }
  }

}

function playNote(pitch, when) {
  audioContext.resume();
  player.queueWaveTable(audioContext, output, guitar, when, pitch, 0.25);
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
  console.log(notes);
  for (var i = 0; i < notes.length; i++) {
    playNote(notes[i][0], notes[i][1]);
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
  for (var i = 0; i < grid.length; i++) {
      grid[i].isClicked = false;
  }
  mainTrack = [];
}

function getPitch(y) {
  return 99 - floor(y / 24);
}

function getStartTime(x) {
  return 0.25 * floor(x / 24);
}

function findObjectIndex(y, x) {
  for (var i = 0; i < mainTrack.length; i++) {
    if (mainTrack[i][0] == y && mainTrack[i][1] == x) {
      return i;
    }
  }
  return -1;
}