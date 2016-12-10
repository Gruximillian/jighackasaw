// Identify draggable items and define its data
var startDrag = {
  init: function () {
    this.cacheDOM();
    this.bindEvents();
  },
  cacheDOM: function () {
    this.puzzlePieces = document.querySelectorAll('img[src*=piece]');
  },
  bindEvents: function () {
    for (var i = 0; i < this.puzzlePieces.length; i++) {
      this.puzzlePieces[i].addEventListener("mousedown", this.applyAttr);
      this.puzzlePieces[i].addEventListener("dragstart", this.dragStart);
    }
  },
  applyAttr: function () {
    this.setAttribute("draggable", "true");
  },
  dragStart: function (e) {
    e.dataTransfer.setData("text/plain", e.target.id);
    e.dataTransfer.dropEffect = "move";
  }
};

var dropZone = {
  init: function () {
    this.cacheDOM();
    this.bindEvents();
  },
  cacheDOM: function () {
    this.tray = document.getElementById("tray");
  },
  bindEvents: function () {
    this.tray.addEventListener("dragenter", this.enterZone);
    this.tray.addEventListener("dragleave", this.leaveZone);
    this.tray.addEventListener("dragover", this.dragItem);
    this.tray.addEventListener("drop", this.dropItem);
  },
  enterZone: function (e) {
    e.target.style.background = "blue";
  },
  leaveZone: function (e) {
    e.target.style.background = "teal";
  },
  dragItem: function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  },
  dropItem: function (e) {
    e.preventDefault();
    // Get the id of the piece and add the moved element to the target's DOM
    var movedPiece = e.dataTransfer.getData("text");
    if (e.target.id === "tray") {
      e.target.appendChild(document.getElementById(movedPiece));
      e.target.style.background = "teal";
    }
  }
};

startDrag.init();
dropZone.init();
