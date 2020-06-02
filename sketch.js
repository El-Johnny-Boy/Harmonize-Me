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
var scalesNames = ["amaj", "asmaj", "bmaj", "cmaj", "csmaj", "dmaj", "dsmaj", "emaj", "fmaj", "fsmaj", "gmaj", "gsmaj",
                   "amajpen", "asmajpen", "bmajpen", "cmajpen", "csmajpen", "dmajpen", "dsmajpen", "emajpen", "fmajpen", "fsmajpen", "gmajpen", "gsmajpen",
                   "amin", "asmin", "bmin", "cmin", "csmin", "dmin", "dsmin", "emin", "fmin", "fsmin", "gmin", "gsmin",
                   "aminpen", "asminpen", "bminpen", "cminpen", "csminpen", "dminpen", "dsminpen", "eminpen", "fminpen", "fsminpen", "gminpen", "gsminpen"];

var now = 0;
var t = audioContext.currentTime;
var mainTrack = [];
var harmonyTrack = [];
var hasHarmonyWrittenOnce = false;
var isTrackPlaying = false;
var recursiveID;

player.loader.decodeAfterLoading(audioContext, '_tone_0253_Acoustic_Guitar_sf2_file');

var dropdown = document.getElementsByClassName("dropbtn");


function setup() {
  var canvas = createCanvas(1200, 864);
  canvas.parent('sketch-holder');
  cols = floor(width/w);
  rows = floor(height/w);

  $("#PlayWholeTrack").hide();
  $("#PlayMainTrack").hide();
  $("#PlayHarmony").hide();

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
  text("Mouse: (" + mouseX.toString() + ", " + mouseY.toString() + ")", width - 100, height - 10);
  
}


//TODO: send which tile needs to be clicked
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
    var notePitch = getPitchByPosition(y);
    var noteStartTime = getStartTimeByPosition(x);
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
          var tile = new Tile(x, y, tileSize, 255, 127, 80, 255, 0, 0);
          tiles.push(tile);
        }
      }
      else {
        cancel();
        this.isClicked = false;
        var noteIndex = findObjectIndex(notePitch, noteStartTime, mainTrack);
        if (noteIndex > -1) {
          mainTrack.splice(noteIndex, 1);
          if (!mainTrackContainsNote(notePitch)) {
            if (mainTrack.length == 0) {
              $(".container").show();
            }
            else {
              showScalesButtons(notePitch % 12);
            }
          }
        }
        noteIndex = findObjectIndex(notePitch, noteStartTime, harmonyTrack);
        if (noteIndex > -1) {
          harmonyTrack.splice(noteIndex, 1);
        } 
        if (tileCheck > -1) {
          tiles.splice(tileCheck, 1);

        }
      }
    }
  }

}

function Tile(x, y, tileW, r, g, b, outR, outG, outB) {
  this.x = x;
  this.y = y;
  this.tileWidth = tileW;
  this.r = r;
  this.g = g;
  this.b = b;
  this.outR = outR;
  this.outG = outG;
  this.outB = outB;

  this.show = function() {
    stroke(this.outR, this.outG, this.outB);
    fill(this.r, this.g, this.b);
    rect(this.x, this.y, this.tileWidth * 24, w);
  }
}

//check if there is a tile that starts at (x, y) coordinates. Currently only works with the start of the tile
//TODO: make it work when clicking anywhere on the tile, with any pointer size
function checkForExistentTiles(x, y) {
  for (var i = 0; i < tiles.length; i++) {
    if (tiles[i].x == x && tiles[i].y == y) {
      return i;
    }
  }
  return -1;
}

//Tile size preview
function drawTilePreview() {
  var x = floor(mouseX / 24) * 24;
  var y = floor(mouseY / 24) * 24;
  stroke(255, 0, 0);
  strokeWeight(2);
  noFill();
  rect(x, y, tileSize * 24, w);
}

function drawHarmonyTrack() {
  for (var i = 0; i < harmonyTrack.length; i++) {
    var tile = new Tile(getPositionByStartTime([harmonyTrack[i][1]]), getPositionByPitch(harmonyTrack[i][0]), getTileSizeByDuration(harmonyTrack[i][2]), 50, 205, 50, 0, 100, 0);
    tiles.push(tile);
  }
}

function playNote(pitch, when, dur) {
  audioContext.resume();
  player.queueWaveTable(audioContext, output, guitar, when, pitch, dur);
}

function cancel() {
  player.cancelQueue(audioContext);
}

//TODO: Add a condition so it can be clicked only once
function playMainTrack() {
  isTrackPlaying = true;
  mainTrack.sort(function(a, b) {return a[1] - b[1]});
  playTrackRecursively(0, mainTrack);
}

function playHarmonyTrack() {
  isTrackPlaying = true;
  harmonyTrack.sort(function(a, b) {return a[1] - b[1]});
  playTrackRecursively(0, harmonyTrack);
}

function playWholeTrack() {
  isTrackPlaying = true;
  playTrackRecursively(0, mainTrack.concat(harmonyTrack).sort(function(a, b) {return a[1] - b[1]}));
}

//Recursively go through all the track. At each timestamp, play all the note that start at the same time
//TODO: Currently start playing at the first note, make it so it starts to play at the beginning.
function playTrackRecursively(id, track) {
  var notesBatch = getNotesOfSameStartTime(track[id][1], track);
  playNotesInBatch(notesBatch);
  if (id + notesBatch.length < track.length && isTrackPlaying){
    delay = track[id + notesBatch.length][1] - track[id][1];
    recursiveID = setTimeout(function() {
      playTrackRecursively(id + notesBatch.length, track);
    }, delay * 1000);
  }
}

//Play notes of notes array in a for loop
function playNotesInBatch(notes) {
  for (var i = 0; i < notes.length; i++) {
    playNote(notes[i][0], notes[i][1], notes[i][2]);
  }
}

//Get all the notes that start at the same time
function getNotesOfSameStartTime(startTime, track) {
  var indexArray = []
  for (var i = 0; i < track.length; i++) {
    if (track[i][1] == startTime) {
      indexArray.push(i);
    }
  }
  var batch = track.slice(indexArray[0], indexArray[indexArray.length - 1] + 1);
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
  harmonyTrack = [];
  tiles = [];
  $(".container").show();
  $("#Play").show();
  $("#PlayWholeTrack").hide();
  $("#PlayMainTrack").hide();
  $("#PlayHarmony").hide();
}

function harmonize() {
  var scaleValue = $("input[name='radio']:checked").val();
  var radioValue = $("input[name='harmony']:checked").val();
  harmonyTrack = [];
  if (hasHarmonyWrittenOnce) {
    tiles.splice(tiles.length / 2, tiles.length / 2);
  }
  hasHarmonyWrittenOnce = true;
  if (radioValue == 0) {
    console.log("Scale n°:" + scaleValue.toString());
    console.log(scales[scaleValue]);
    getThirdHarmonyTrack(scales[scaleValue]);
  }
  else if (radioValue == 1) {
    getFourthHarmonyTrack();
  }
  else {
    getFifthHarmonyTrack();
  }
  drawHarmonyTrack();
  $("#Play").hide();
  $("#PlayWholeTrack").show();
  $("#PlayMainTrack").show();
  $("#PlayHarmony").show();
}

function getPitchByPosition(y) {
  return 78 - floor(y / 24);
}

function getPositionByPitch(y) {
  return (78 - y) * 24;
}

function getStartTimeByPosition(x) {
  return 0.25 * floor(x / 24);
}

function getPositionByStartTime(x) {
  return x * 24 / 0.25;
}

function getNoteDuration(l) {
  return 0.25 * l;
}

function getTileSizeByDuration(d) {
  return d / 0.25;
}

function findObjectIndex(y, x, track) {
  for (var i = 0; i < track.length; i++) {
    if (track[i][0] == y && track[i][1] == x) {
      return i;
    }
  }
  return -1;
}

//Hide the scale radio buttons that don't contain the note passed as a parameter
function hideScalesButtons(pitch) {
  for (let scale of findScalesWithoutNote(pitch)) {
    $("#" + scalesNames[scale]).hide();
    //console.log("Hiding " + scalesNames[scale] + " scale");
  }
}


//Show the scale radio buttons that contain the note passed as a parameter
function showScalesButtons(pitch) {
  for (let scale of findScalesWithNote(pitch)) {
    $("#" + scalesNames[scale]).show();
    //console.log("Showing " + scalesNames[scale] + " scale");
  }
}

function* findScalesWithoutNote(pitch) {
  for (var i = 0; i < scales.length; i++) {
    if (!scales[i].includes(pitch)) {
      yield i;
    }
  }
}


function* findScalesWithNote() {
  for (var i = 0; i < scales.length; i++) {
    if (scaleContainsMainTrack(i)) {
      yield i;
    }
  }
}

function scaleContainsMainTrack(scaleIndex) {
  for (var i = 0; i < mainTrack.length; i++) {
    if (!scales[scaleIndex].includes(mainTrack[i][0] % 12)) {
      return false;
    }
  }
  return true;
}

//Check if the array mainTrack contains the note passed as a parameter
function mainTrackContainsNote(note) {
  for (var i = 0; i < mainTrack.length; i++) {
    if (mainTrack[i][0] == note) {
      return true;
    }
  }
  return false;
}

//Return value to the radio button selected. For scales, name is radio, for harmonies, name is harmony
/* function getSelectedButtonValue(name) {
  return $("input[name='" + name + "']:checked").val()
} */

function getThirdHarmonyTrack(scale) {
  var noteIndex;
  var third = 0;
  for (var i = 0; i < mainTrack.length; i++) {
    noteIndex = scale.indexOf(mainTrack[i][0] % 12);
    third = scale[(noteIndex + 2) % scale.length];
    if (third < mainTrack[i][0]) {
      while(third < mainTrack[i][0]) {
        third += 12;
      }
    }
    harmonyTrack.push([third, mainTrack[i][1], mainTrack[i][2]]);
  }
}

function getFourthHarmonyTrack() {
  for (var i = 0; i < mainTrack.length; i++) {
    harmonyTrack.push([mainTrack[i][0] + 5, mainTrack[i][1], mainTrack[i][2]]);
  }
}

function getFifthHarmonyTrack() {
  for (var i = 0; i < mainTrack.length; i++) {
    harmonyTrack.push([mainTrack[i][0] + 7, mainTrack[i][1], mainTrack[i][2]]);
  }
}

