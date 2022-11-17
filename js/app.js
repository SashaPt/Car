$(function () {
  $(document).contextmenu(function (event) {
    event.preventDefault();
  });

  function prepareForStart() {
    $('.screen').removeClass('up');
    $('.play').attr('disabled', 'true');
    $('.level h2').html('Select Level').removeClass('selected');
    $('.game-over').removeClass('display');
    $('.car').css('left', '55%')
    $('.start').removeAttr('disabled');
  }
  prepareForStart();

  let level = 0;
  let score = 0;
  let timers = [];
  let roadTimer, stoneCreateTimer, stoneMoveTimer;

  $('.level button').click(function () {
    level = parseInt($(this).attr('data-speed'));
    $('#level').html(level);
    $('.level h2').html(`Level ${level}`).addClass('selected');
    $('.play').removeAttr('disabled');
  });

  $('.play').click(playGame);

  function playGame() {
    let carLeft = parseInt($('.car').css('left'));
    let roadWidth = parseInt($('.road').css('width'));
    let roadHeight = parseInt($('.road').css('height'));
    let carWidth = parseInt($('.car').css('width'));

    $('.screen:eq(0)').addClass('up');
    $('.pause').attr('disabled', 'true');

    $('.start').click(function () {
      console.log(timers)
      $(document).on('keydown', moveCar);

      if (!roadTimer) {
        roadTimer = setInterval(moveRoad, 20 / (level * level));
        timers.push(roadTimer);

        stoneCreateTimer = setInterval(
          createStones,
          3000 - level * level * 200
        );
        timers.push(stoneCreateTimer);

        stoneMoveTimer = setInterval(moveStones, 20 / (level * level));
        timers.push(stoneMoveTimer);

        $('.pause').removeAttr('disabled');
      }
    });

    $('.pause').click(pauseGame);

    $('.new-game').click(function () {
      prepareForStart();
      $('.stone').each(function(i, stone) {
        stone.remove();
      });
      score = 0;
      level = 0;
    });

    function pauseGame() {
      $(document).off('keydown', moveCar);

      if (roadTimer) {
        $.each(timers, function (i, timer) {
          clearInterval(timer);
        });
        roadTimer = null;

        $('.pause').attr('disabled', 'true');
      }
    }

    function moveCar(event) {
      carWidth = parseInt($('.car').css('width'));
      roadWidth = parseInt($('.road').css('width'));
      carLeft = parseInt($('.car').css('left'));
      if (event.keyCode === 39 && roadTimer) {
        if (carLeft <= roadWidth - carWidth - 5) {
          carLeft += 5;
        }
      } else if (event.keyCode === 37 && roadTimer) {
        if (carLeft >= 5) {
          carLeft -= 5;
        }
      }
      $('.car').css('left', `${carLeft}px`);
    }

    function moveRoad() {
      $('.road').each(function () {
        let bottom = parseInt($(this).css('bottom'));
        let roadHeight = parseInt($(this).css('height'));

        if (bottom > 5 - roadHeight) {
          bottom -= 5;
          $(this).css('bottom', `${bottom}px`);
        } else {
          $(this).css('bottom', `${roadHeight - 5}px`);
        }
      });
    }

    function createStones() {
      function getRandomNumber(min, max) {
        return Math.trunc(Math.random() * (max - min + 1) + min);
      }
      let stone = $('<img src="../media/images/stone.png">').addClass('stone');
      $('.game').append(stone);
      stone.css({
        left: `${getRandomNumber(
          0,
          roadWidth - parseInt($('.stone').css('width'))
        )}px`,
        bottom: `${roadHeight}px`,
      });
    }

    function moveStones() {
      $('.stone').each(function () {
        let stoneBottom = parseInt($(this).css('bottom'));
        let stoneHeight = parseInt($(this).css('height'));
        let stoneWidth = parseInt($(this).css('width'));
        let stoneLeft = parseInt($(this).css('left'));
        let carTop = parseInt($('.car').css('height'));
        carLeft = parseInt($('.car').css('left'));

        if (stoneBottom > 5 - stoneHeight) {
          if (
            stoneBottom <= carTop &&
            stoneLeft - carLeft < carWidth &&
            carLeft - stoneLeft < stoneWidth
          ) {
            pauseGame();
            $('#score').html(score);
            $('.game-over').addClass('display');
            $('.start').attr('disabled', 'true');
            timers = [];
            setTimeout(() => {
              $('.screen:eq(1)').addClass('up');
            }, 2000);
          }
          stoneBottom -= 5;
          $(this).css('bottom', `${stoneBottom}px`);
        } else {
          $(this).remove();
          score++;
        }
      });
    }
  }
});
