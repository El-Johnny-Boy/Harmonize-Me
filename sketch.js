var cols, rows;
var w = 24;
var grid = [];

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
      this.isHiglighted = true;
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
  var playTime = audioContext.currentTime;
  mainTrack.sort(function(a, b) {return a[1] - b[1]})

  var endTime = 12.5;
  var i = 0;
  var noteStartTime = mainTrack[i][1];
  while (audioContext.currentTime - playTime < 5) {
    actualTime = audioContext.currentTime - playTime;

    if (actualTime > noteStartTime && actualTime < noteStartTime + 0.25 && i < mainTrack.length) {
      playNote(mainTrack[i][0], mainTrack[i][1]);
      i++;
      if (i < mainTrack.length) {
        noteStartTime = mainTrack[i][1];
      }
    }
  }
}

function playTrackRecursively(id) {
  console.log(recursiveID);
  var delay = 0;
  isTrackPlaying = true;
  playNote(mainTrack[id][0], 0);
  if (id < mainTrack.length - 1 && isTrackPlaying){
    delay = mainTrack[id + 1][1] - mainTrack[id][1];
    recursiveID = setTimeout(function() {
      playTrackRecursively(id + 1);
    }, delay * 1000);
  }
  isTrackPlaying = false;
}

function stopTrack() {
  isTrackPlaying = false;

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