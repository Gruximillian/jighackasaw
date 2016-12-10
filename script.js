(function (global) {

  // declare DOM variables here
  var button = document.querySelector('.start'),
      minutes = document.querySelector('.minutes'),
      seconds = document.querySelector('.seconds'),
      timeOver = document.querySelector('#timeout'),
      puzzle = document.querySelector('.puzzle'),
      timer;



    

  /******************************************************  
  //EVENTS
  ******************************************************/


  //timer start event
  button.addEventListener('click', function() {
      startTimer();
    });



  //hint button events
  // hintButton.addEventListener('mousedown', function() {
  //     puzzle.classList.add('hinted');
  //   });

  // hintButton.addEventListener('mouseup', function() {
  //     puzzle.classList.remove('hinted');
  //   });





    //helper functions
    function startTimer() {
      timer = global.setTimeout(function(){
        seconds.textContent -=1;
        global.clearTimeout(timer);
        if ( minutes.textContent == 0 && seconds.textContent == 0 ) {
          // code to run after the time has ran out
          timeOver.play();
          return;
        }
        if (minutes.textContent != 0 && seconds.textContent == 0 ) {
          minutes.textContent -= 1;
          seconds.textContent = 59;
        }
        startTimer();
      }, 10);
    }


  // DRAG AND DROP 
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


  var trayShuffler = {

      //create the elements
      cacheDOM: function() {

        this.tray =  document.getElementById('tray');

        this.trayImages = [
          {name: 'piece_01.png', source: 'puzzle/piece_01.png'},
          {name: 'piece_02.png', source: 'puzzle/piece_02.png'},
          {name: 'piece_03.png', source: 'puzzle/piece_03.png'},
          {name: 'piece_04.png', source: 'puzzle/piece_04.png'},
          {name: 'piece_05.png', source: 'puzzle/piece_05.png'},
          {name: 'piece_06.png', source: 'puzzle/piece_06.png'},
          {name: 'piece_07.png', source: 'puzzle/piece_07.png'},
          {name: 'piece_08.png', source: 'puzzle/piece_08.png'},
          {name: 'piece_09.png', source: 'puzzle/piece_09.png'},
          {name: 'piece_10.png', source: 'puzzle/piece_10.png'},
          {name: 'piece_11.png', source: 'puzzle/piece_11.png'},
          {name: 'piece_12.png', source: 'puzzle/piece_12.png'},
          {name: 'piece_13.png', source: 'puzzle/piece_13.png'},
          {name: 'piece_14.png', source: 'puzzle/piece_14.png'},
          {name: 'piece_15.png', source: 'puzzle/piece_15.png'},
          {name: 'piece_16.png', source: 'puzzle/piece_16.png'},
          {name: 'piece_17.png', source: 'puzzle/piece_17.png'},
          {name: 'piece_18.png', source: 'puzzle/piece_18.png'},
          {name: 'piece_19.png', source: 'puzzle/piece_19.png'},
          {name: 'piece_20.png', source: 'puzzle/piece_20.png'},
          {name: 'piece_21.png', source: 'puzzle/piece_21.png'},
          {name: 'piece_22.png', source: 'puzzle/piece_22.png'},
          {name: 'piece_23.png', source: 'puzzle/piece_23.png'},
          {name: 'piece_24.png', source: 'puzzle/piece_24.png'},
          {name: 'piece_25.png', source: 'puzzle/piece_25.png'},
          {name: 'piece_26.png', source: 'puzzle/piece_26.png'},
          {name: 'piece_27.png', source: 'puzzle/piece_27.png'},
          {name: 'piece_28.png', source: 'puzzle/piece_28.png'},
          {name: 'piece_29.png', source: 'puzzle/piece_29.png'},
          {name: 'piece_30.png', source: 'puzzle/piece_30.png'},
          {name: 'piece_31.png', source: 'puzzle/piece_31.png'},
          {name: 'piece_32.png', source: 'puzzle/piece_32.png'},
          {name: 'piece_33.png', source: 'puzzle/piece_33.png'},
          {name: 'piece_34.png', source: 'puzzle/piece_34.png'},
          {name: 'piece_35.png', source: 'puzzle/piece_35.png'},
          {name: 'piece_36.png', source: 'puzzle/piece_36.png'},
          {name: 'piece_37.png', source: 'puzzle/piece_37.png'},
          {name: 'piece_38.png', source: 'puzzle/piece_38.png'},
          {name: 'piece_39.png', source: 'puzzle/piece_39.png'},
          {name: 'piece_40.png', source: 'puzzle/piece_40.png'},
          {name: 'piece_41.png', source: 'puzzle/piece_41.png'}
        ];
      },

      //shuffle the array
      shuffle: function() {

        //save to local var for shuffle
        var array = this.trayImages;
        
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;

          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }

        return array;
        
      },

      //put pieces on the tray
      addPieces: function() {

        //call shuffle and return images array 
        var array = trayShuffler.shuffle();

        //add pieces to the tray
        for(var i =0; i < array.length; i++) {

          console.log(array[i].name);
          var node = document.createElement('img');
          node.src = array[i].source;
          tray.appendChild(node);
        }
      }
      // end of trayShuffler object
    }

    //run these two functions as part of the 'Start' event
    trayShuffler.cacheDOM();
    trayShuffler.addPieces();














// end of JS file
})(window);
