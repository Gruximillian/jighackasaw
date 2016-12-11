(function (global) {

  // Button that enable early check in the difficult mode
  var checkButton = document.querySelector('#check-trigger');
  checkButton.addEventListener('click', function() {
    solver.init();
    check.alertResult();
  });

// Cache DOM elements and trigger 
  var elements = {
    init: function elInit() {
      this.cacheDOM();
      this.events();
    },
    cacheDOM: function elCacheDOM() {
      this.start_modal = document.getElementById('start-modal');
      this.board = document.querySelector('.honeycomb');
      this.difficulty_input = document.getElementById('difficulty');
      this.difficulty_switch = document.getElementById('difficulty-switch');
      this.time_display = document.getElementById('time-display'); // Displays time
      this.time_msg = document.getElementById('timer-msg'); // Displays timer text
      this.innerhexSVG = document.getElementById('hex-shape-inner'); // Scales down as timer ticks
      this.start_trigger = document.getElementById('start-trigger');
      this.hint_trigger = document.getElementById('hint-trigger');
      this.restart_trigger = document.getElementById('restart-trigger');
      this.stop_trigger = document.getElementById('stop-trigger');
      this.timeOver = document.getElementById('timeover');
      this.dropTileBoard = document.getElementById('drop-tile-board');
      this.dropTileTray = document.getElementById('drop-tile-tray');
      this.puzzleSolvedSound = document.getElementById('solved-100');
    },
    events: function elEvents() {
      // Start timer
      this.start_trigger.addEventListener('click', function() {
        elements.board.classList.add('playing');
        elements.start_modal.classList.add('temporary-hide');
        timer.init_timer();
        timer.start_timer();
      }, false);
      // Hide modal after hint
      this.hint_trigger.addEventListener('mousedown', function(e) {
        if (puzzleData.hints_left !== 0) {
          timer.show_modal();
        }
      }, false);
      // Stop timer
      this.stop_trigger.addEventListener('click', function() {
        timer.stop_timer();
      }, false);
      // Start a new session
      this.restart_trigger.addEventListener('click', timer.restart_puzzle, false);
    }
  };

  var puzzleData = {
    difficult: false,
    hints_left: 3,
    hint_active: false
  };

  var timer = {
    init_timer: function initTimer() {
      puzzleData.difficult = elements.difficulty_input.checked;
      if (puzzleData.difficult) {
        puzzleData.hints_left = 0;
        // Hide hint button
        elements.hint_trigger.style.display = 'none';
      } else {
        // Show hint button
        elements.hint_trigger.style.display = 'inline-block';
      }
      elements.start_trigger.parentNode.classList.add('temporary-hide');
      if (elements.innerhexSVG.classList.contains('time-out')) {
        elements.innerhexSVG.classList.remove('time-out');
      }
      // If difficult is set to true, time limit is half the normal limit
      this.limit = puzzleData.difficult ? 1 : 1;
      // Seconds we're starting with
      this.total_seconds = this.limit * 60;
      // Each second, decrement this; we'll use this one value to update time
      elements.time_msg.textContent = ' left to solve the puzzle';
      // Display stop button
      elements.stop_trigger.style.display = 'inline-block';
      this.seconds_left = this.total_seconds;
      this.set_time();
      this.progressHexBorder();
    },
    set_time: function setTime() {
      // Convert time to "display-friendly" format; pad sec + min less than 10 with a 0
      this.seconds_converted = this.seconds_left % 60;
      this.minutes_left = Math.floor(this.seconds_left / 60);
      this.minutes_displayed = this.minutes_left < 10 ? '0' + this.minutes_left : this.minutes_left;
      this.seconds_displayed = this.seconds_converted < 10 ? '0' + this.seconds_converted : this.seconds_converted;
      elements.time_display.textContent = this.minutes_displayed + ':' + this.seconds_displayed;
      // If less than a minute remains, active PANIC MODE
      if (this.seconds_left === 60) {
        elements.time_display.classList.add('time-running-out');
        elements.time_msg.textContent = 'Time is running out! Better put your puzzlemaster hat on!';
      }
    },
    update_time: function updateTime() {
      this.seconds_left--;
      this.set_time();
      this.progressHexBorder();
    },
    progressHexBorder: function updateTimerProgress(el) {
      var percentLeft = (this.seconds_left * 100) / this.total_seconds / 100;
      elements.innerhexSVG.setAttribute('transform', 'scale(' + percentLeft + ')');
    },
    start_timer: function startTimer() {

      trayShuffler.cacheDOM();
      trayShuffler.resetTray();
      trayShuffler.resetBoard();
      trayShuffler.addPieces();
      check.cacheDOM();

      timer.puzzleTimer = window.setInterval(function(){
        timer.update_time();
        // Womp womp; time ran out?
        if (!timer.seconds_left && !timer.minutes_left) {
          // Do something to show the user time has run out
          // elements.innerhexSVG.classList.add('time-out');
          // elements.time_msg.textContent = 'What a drag. You ran out of time. 😢';
          // elements.timeOver.play(); // Find an appropriate sound for this
          // solver.init();
          solver.solve();
          check.alertResult();
          timer.stop_timer();
          timer.restart_puzzle();
          window.clearInterval(timer.puzzleTimer);
          return;
        }
      }, 1000);
    },
    show_modal: function showHint() {
      puzzleData.hint_active = true;
      puzzleData.hints_left--;
      elements.start_modal.classList.remove('temporary-hide');
      elements.start_modal.classList.add('scale-up');
    },
    hide_modal: function hideModal() {
      puzzleData.hint_active = false;
      // Hide start modal; scale it down to normal
      elements.start_modal.classList.add('temporary-hide');
      elements.start_modal.classList.remove('scale-up');
    },
    hints_done: function hintsDone() {
      this.hide_modal();
      elements.hint_trigger.style.display = 'none';
    },
    reset_timer_styles: function resetTStyles() {
      // Hide stop button
      elements.stop_trigger.style.display = 'none';
      // Hide hint button
      elements.hint_trigger.style.display = 'none';
      elements.start_trigger.parentNode.classList.remove('temporary-hide');
      // Reset scaled SVG
      elements.innerhexSVG.setAttribute('transform', 'scale(1)');
      // Reset 'time out' colors
      if (elements.time_display.classList.contains('time-running-out')) {
        elements.time_display.classList.remove('time-running-out');
      } else if (elements.time_display.classList.contains('time-out')) {
        elements.time_display.classList.remove('time-out');
      }
    },
    reset_puzzle_data: function timerDataReset() {
      puzzleData.hints_left = 3;
    },
    stop_timer: function resetTimer() {
      // Reset tray
      trayShuffler.resetTray();
      // Reset board
      trayShuffler.resetBoard();
      // Reset timer styles
      timer.reset_timer_styles();
      // Reset puzzle data
      timer.reset_puzzle_data();
      // Reset timer text
      elements.time_msg.textContent = 'Want to start a new puzzle session?';
      elements.time_display.textContent = '';
      // Display restart button
      elements.restart_trigger.style.display = 'inline-block';
      window.clearInterval(timer.puzzleTimer);
    },
    restart_puzzle: function restart() {
      // Reset checked condition on switch
      elements.difficulty_input.checked = false;
      // Hide restart button
      elements.restart_trigger.style.display = 'none';
      // Remove box shadow from board
      elements.board.classList.remove('playing');
      // Show start modal
      elements.start_modal.classList.remove('temporary-hide');
    }
  };

  // MOUSE POSITION CALCULATIONS
  var position = {
    closeToCenter: function(e) {
      var x = e.offsetX,
          y = e.offsetY,
          w = e.target.clientWidth,
          h = e.target.clientHeight,
          cx = Math.round(w / 2),
          cy = Math.round(h / 2),
          dx = Math.abs(x - cx),
          dy = Math.abs(y - cy),
          r = Math.floor(w / 5),
          d = 1000;

      d = Math.ceil(Math.sqrt( Math.pow( dx, 2 ) + Math.pow( dy, 2 ) ));

      return d < r;
    }
  }

  // SOLUTION CHECK
  var check = {
    cacheDOM: function() {
      this.puzzlePieces = document.querySelectorAll('img[src*=piece]');
      this.tray = document.querySelector('#tray');
    },
    checkSolution: function() {
      var i, puzzlePieces = this.puzzlePieces,
          len = puzzlePieces.length,
          correctness = 0;

      for ( i = 0; i < len; i++ ) {
        if ( this.testCell(puzzlePieces[i]) ) {
          correctness++;
        }
      }
      correctness = ((correctness / len) * 100).toFixed(2);
      return correctness; // percentage of correct placements
    },
    testCell: function(item) {
      return item.id == item.parentNode.getAttribute("data-piece");
    },
    alertResult: function() {
      var solvedPercentage = this.checkSolution();
      if ( solvedPercentage == 100 ) {
        elements.puzzleSolvedSound.play();
        alert('Congratulations! You solved ' + solvedPercentage + '% of the puzzle!');
        // STOP TIMER AND OFFER A NEW GAME
      } else if ( solvedPercentage < 100 ) {
        alert('Sorry, you solved only ' + solvedPercentage + '% of the puzzle!');
        // ALLOW SOLVING UNTIL TIME RUNS OUT
      }
    },
    checkTray: function() {
      if ( !this.tray.hasChildNodes() && !puzzleData.difficult ) {
        this.alertResult();
      } else if ( !this.tray.hasChildNodes() && puzzleData.difficult ) {
        checkButton.style.display = 'inline-block';
        // MAYBE ADD ELSE IF BLOCK TO HIDE THE BUTTON IF THE USER PLACES BACK AN IMAGE TO THE TRAY
      }
    }
  }

  // PUZZLE SOLVER
  var solver = {
    init: function() {
      this.cacheDOM();
    },
    cacheDOM: function () {
      this.puzzlePieces = document.querySelectorAll('img[src*=piece]');
      this.boardCells = document.querySelectorAll('.hc-cell');
    },
    solve: function() {
      var pieces = Array.prototype.slice.call(this.puzzlePieces),
          cell,
          image,
          id,
          len,
          delay,
          misplaced; // images that are not in appropriate cell

      misplaced = pieces.filter(function(item) {
        return !check.testCell(item);
      })

      len = misplaced.length;

      function arrangeImages(n) {
        delay = window.setTimeout(function() {
          if ( n < len ) {
            id = misplaced[n].id;
            image = misplaced[n].parentNode.removeChild(misplaced[n]);
            cell = document.querySelector('[data-piece=' + id + ']');
            cell.appendChild(image);
            n++;
          }
          window.clearTimeout(delay);
          arrangeImages(n);
        }, 200);
      }

      arrangeImages(0);

    }
  }

  // solver.init();


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
        this.puzzlePieces[i].addEventListener('mousemove', this.setDragIndicator);
        this.puzzlePieces[i].addEventListener("mousedown", this.applyAttr);
        this.puzzlePieces[i].addEventListener("dragstart", this.dragStart);
      }
    },
    applyAttr: function (e) {
      if ( position.closeToCenter(e) ) {
        e.target.classList.add('dragging');
        this.setAttribute("draggable", "true");
      } else {
        this.setAttribute("draggable", "false");
      }
    },
    dragStart: function (e) {
      e.dataTransfer.setData("text/plain", e.target.id);
      // console.log(e.target.id);
      e.dataTransfer.dropEffect = "move";
    },
    setDragIndicator: function(e) {
      if ( position.closeToCenter(e) ) {
        e.target.classList.add('draggable');
      } else {
        e.target.classList.remove('draggable');
      }
    }
  };

  var dropZone = {
    init: function () {
      this.cacheDOM();
      this.bindEvents();
    },
    cacheDOM: function () {
      this.tray = document.getElementById("tray");
      this.cell = document.getElementsByClassName("hc-cell");
    },
    bindEvents: function () {
      this.tray.addEventListener("dragover", this.dragItem);
      this.tray.addEventListener("drop", this.dropItem);
      for (var i = 0; i < this.cell.length; i++) {
        this.cell[i].addEventListener("dragover", this.dragItem);
        this.cell[i].addEventListener("drop", this.dropItem);
      }
    },
    dragItem: function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    dropItem: function (e) {
      e.preventDefault();
      // Get the id of the piece and add the moved element to the target's DOM
      var movedPiece = e.dataTransfer.getData("text");
      if ( e.target.parentNode.id === 'tray' || e.target.id === "tray" ) {
        // whatever the difficulty, allow dropping into tray
        e.target.parentNode.appendChild(document.getElementById(movedPiece));
        elements.dropTileTray.play();
      } else if ( !puzzleData.difficult && movedPiece === e.target.getAttribute("data-piece") ) {
        //easy mode, dropping allowed only into correct cells
        e.target.appendChild(document.getElementById(movedPiece));
        elements.dropTileBoard.play();
      } else if ( puzzleData.difficult && e.target.tagName.toLowerCase() !== 'img' ) {
        // hard mode, dropping allowed on any cell; second condition prevents appending to the other image
        e.target.appendChild(document.getElementById(movedPiece));
        elements.dropTileBoard.play();
      } else {
        // when a tile is released over the image and it goes back to tray
        elements.dropTileTray.play();
      }
      // check if the tray is empty
      check.checkTray();
    }
  };

  // TRAY SHUFFLER OBJECT
  var trayShuffler = {
    // Create the elements
    cacheDOM: function() {
      this.tray =  document.getElementById('tray');
      this.trayImages = [
        {name: 'piece_01.png', id: "p01", source: 'puzzle/piece_01.png'},
        {name: 'piece_02.png', id: "p02", source: 'puzzle/piece_02.png'},
        {name: 'piece_03.png', id: "p03", source: 'puzzle/piece_03.png'},
        {name: 'piece_04.png', id: "p04", source: 'puzzle/piece_04.png'},
        {name: 'piece_05.png', id: "p05", source: 'puzzle/piece_05.png'},
        {name: 'piece_06.png', id: "p06", source: 'puzzle/piece_06.png'},
        {name: 'piece_07.png', id: "p07", source: 'puzzle/piece_07.png'},
        {name: 'piece_08.png', id: "p08", source: 'puzzle/piece_08.png'},
        {name: 'piece_09.png', id: "p09", source: 'puzzle/piece_09.png'},
        {name: 'piece_10.png', id: "p10", source: 'puzzle/piece_10.png'},
        {name: 'piece_11.png', id: "p11", source: 'puzzle/piece_11.png'},
        {name: 'piece_12.png', id: "p12", source: 'puzzle/piece_12.png'},
        {name: 'piece_13.png', id: "p13", source: 'puzzle/piece_13.png'},
        {name: 'piece_14.png', id: "p14", source: 'puzzle/piece_14.png'},
        {name: 'piece_15.png', id: "p15", source: 'puzzle/piece_15.png'},
        {name: 'piece_16.png', id: "p16", source: 'puzzle/piece_16.png'},
        {name: 'piece_17.png', id: "p17", source: 'puzzle/piece_17.png'},
        {name: 'piece_18.png', id: "p18", source: 'puzzle/piece_18.png'},
        {name: 'piece_19.png', id: "p19", source: 'puzzle/piece_19.png'},
        {name: 'piece_20.png', id: "p20", source: 'puzzle/piece_20.png'},
        {name: 'piece_21.png', id: "p21", source: 'puzzle/piece_21.png'},
        {name: 'piece_22.png', id: "p22", source: 'puzzle/piece_22.png'},
        {name: 'piece_23.png', id: "p23", source: 'puzzle/piece_23.png'},
        {name: 'piece_24.png', id: "p24", source: 'puzzle/piece_24.png'},
        {name: 'piece_25.png', id: "p25", source: 'puzzle/piece_25.png'},
        {name: 'piece_26.png', id: "p26", source: 'puzzle/piece_26.png'},
        {name: 'piece_27.png', id: "p27", source: 'puzzle/piece_27.png'},
        {name: 'piece_28.png', id: "p28", source: 'puzzle/piece_28.png'},
        {name: 'piece_29.png', id: "p29", source: 'puzzle/piece_29.png'},
        {name: 'piece_30.png', id: "p30", source: 'puzzle/piece_30.png'},
        {name: 'piece_31.png', id: "p31", source: 'puzzle/piece_31.png'},
        {name: 'piece_32.png', id: "p32", source: 'puzzle/piece_32.png'},
        {name: 'piece_33.png', id: "p33", source: 'puzzle/piece_33.png'},
        {name: 'piece_34.png', id: "p34", source: 'puzzle/piece_34.png'},
        {name: 'piece_35.png', id: "p35", source: 'puzzle/piece_35.png'},
        {name: 'piece_36.png', id: "p36", source: 'puzzle/piece_36.png'},
        {name: 'piece_37.png', id: "p37", source: 'puzzle/piece_37.png'},
        {name: 'piece_38.png', id: "p38", source: 'puzzle/piece_38.png'},
        {name: 'piece_39.png', id: "p39", source: 'puzzle/piece_39.png'},
        {name: 'piece_40.png', id: "p40", source: 'puzzle/piece_40.png'},
        {name: 'piece_41.png', id: "p41", source: 'puzzle/piece_41.png'}
      ];
    },
    // Shuffle the array
    shuffle: function(inputArray) {
      // Save to local var for shuffle
      var array = inputArray || this.trayImages;
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

    // Put pieces on the tray
    addPieces: function() {
      // Call shuffle and return images array
      var array = trayShuffler.shuffle();
      // Add pieces to the tray
      for (var i = 0; i < array.length; i++) {
        var node = document.createElement('img');
        var nodeID = array[i].id;
        node.setAttribute("id",nodeID);
        node.src = array[i].source;
        // Add to board
        this.tray.appendChild(node);
      }
      startDrag.init();
    },
    resetTray: function() {
      while (this.tray.hasChildNodes()) {
        this.tray.removeChild(this.tray.lastChild);
      }
      startDrag.init();
    },
    resetBoard: function() {
      var images = document.querySelectorAll('.honeycomb img');
      for (var i = 0; i < images.length; i++) {
          images[i].parentNode.removeChild(images[i]);
      }
    }
    // End of trayShuffler object
  };


  window.addEventListener('mouseup', function(e) {
    if (puzzleData.hint_active) {
      if (puzzleData.hints_left === 0) {
        timer.hints_done();
      } else {
        timer.hide_modal();
      }
    }
  }, true);


  // initialize objects 
  solver.init();
  elements.init();
  dropZone.init();










// End of JS file
})(window);
