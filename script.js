window,addEventListener('load', function(){
  var button = document.querySelector('.start'),
      minutes = document.querySelector('.minutes'),
      seconds = document.querySelector('.seconds'),
      timeOver = document.querySelector('#timeout'),
      puzzle = document.querySelector('.puzzle'),
      hintButton = document.querySelector(''), // add selector for hint button here
      timer;

  button.addEventListener('click', function() {
    startTimer();
  })

  function startTimer() {
    timer = window.setTimeout(function(){
      seconds.textContent = +seconds.textContent - 1;
      window.clearTimeout(timer);
      if ( minutes.textContent == 0 && seconds.textContent == 0 ) {
        // code to run after the time has ran out
        timeOver.play();
        return;
      }
      if ( minutes.textContent != 0 && seconds.textContent == 0 ) {
        minutes.textContent = +minutes.textContent - 1;
        seconds.textContent = 59;
      }
      startTimer();
    }, 10);
  }

  hintButton.addEventListener('mousedown', function() {
    puzzle.classList.add('hinted');
  })

  hintButton.addEventListener('mouseup', function() {
    puzzle.classList.remove('hinted');
  })

});
