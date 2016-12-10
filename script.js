window,addEventListener('load', function(){
  var button = document.querySelector('.start'),
      minutes = document.querySelector('.minutes'),
      seconds = document.querySelector('.seconds'),
      timeOver = document.querySelector('#timeout'),
      puzzle = document.querySelector('.puzzle'),
      solved = document.querySelector('.solved'),
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

  // puzzle.addEventListener('mousedown', function() {
  //   solved.style.opacity = 0.8;
  // })
  //
  // puzzle.addEventListener('mouseup', function() {
  //   solved.style.opacity = 0;
  // })

});
