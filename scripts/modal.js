$(document).ready(function () {

  var isMobile;
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    isMobile = true;
  }

  // MODAL
  var modalText = {
    genetic_exploder: {
      title: 'Genetic Explorder',
      tag: 'AI DRIVEN CELLULAR AUTOMATA',
      detail:
        'Genetic Exploder is an AI driven program using a genetic algorithm to find automata patterns that converge on 2d targets.',
      link: 'http://game-of-life-solver.s3-website-us-east-1.amazonaws.com/'
    },
    spider_desk: {
      title: 'Arachnid',
      tag: 'NATURE THEMED DESK',
      detail:
        'Arachnid is made from recycled materials from upstate new york for a nature inspired design competition.'
    },
    bugger: {
      title: 'Bugger Game',
      tag: 'MMO GAME',
      detail: 'Bugger is an massive online multiplayer game written in Javascript and Node.js that uses AI driven cellular automata to generate enemy explosion patterns.',
      link: 'https://www.youtube.com/watch?time_continue=2&v=2P6zEizJXXk&feature=emb_logo'
    },
    psychology: {
      title: 'Saccadic Eye Movement Software',
      tag: 'Pyschology Experiment',
      detail: 'Saccadic eye movement psychology experiment software -- developed for SFASU -- written with Node.js using HTML Canvas and exported for cross-platform (mobile, mac, windows 10).'
    },
    dice: {
      title: 'Dice Weaponry',
      tag: 'HIGH IMPACT ELECTRONIC DICE',
      detail: 'Prototype high-impact electronic device for enhanced board game play using atmega328 in C++.',
      link: 'https://twitter.com/diceweaponry?lang=en'
    },
    move_different: {
      title: 'Move Different',
      tag: 'THREE DAY INTERACTIVE POPUP',
      detail: 'An 8x8 interactive calisthenics structure that reacts to movement through touch, light, and sound.',
      link: 'https://vimeo.com/328663355'
    },
    beat_wizard: {
      title: 'Beat Wizard',
      tag: 'ACCELEROMETER BASED MIDI CONTROLLER',
      detail: 'Design was based around having too little space in my apartment for a drum kit, but I wanted to sweat. Uses an MPU6050 and arduino to send midi signals through usb.',
      link: 'https://www.youtube.com/watch?v=OdsN1frIMPQ'
    },
    silia: {
      title: 'Silia',
      tag: 'Cherry and Bubinga Desk',
      detail: 'Cherry and Bubinga -- three-way miters bring contrast and elegance together. The desk features a secret magnetic locking mechanism.'
    },
    poppin_teddy: {
      title: 'Poppin\' Teddy',
      tag: 'Giant Bear Midi Controller',
      detail: 'Midi controller using open frameworks and arduino in a giant bear, written in C++',
      link: 'https://www.youtube.com/watch?v=yE77Hw2Vz9c'
    },
    ai_bike: {
      title: 'Autonomouse Bike',
      tag: 'SELF DRIVING BICYCLE',
      detail: 'An autonomous bicycle using arduino, java, c++, welding and 3D printing. Uses a genetic algorithm to learn to balance.'
    },
    drip: {
      title: 'Drip',
      tag: 'EXOTIC MEDLEY END TABLE',
      detail: 'Steel and Exotic Medley - Inspired by water and modern spaces. Drip was designed to be the vibrant pop of color in a minimal environment.'
    },
    verleen: {
      title: 'Verleen',
      tag: 'WALNUT RECORD CABINET',
      detail: 'Walnut record cabinet with reinforced anti-tip structure. Verleen was our model that just happened to walk by as we were photographing. Sometimes the light of the world shines down in the perfect way.'
    },
    gravity: {
      title: 'Gravity',
      tag: 'ANTI GRAVITY | ANTI USE',
      detail: 'Welded Chain and Walnut - A simple table made purely for the joy of design. A slope prevents usefulness and clutter.'
    },
    ofcourse: {
      title: 'ofCourse.io',
      tag: 'HUMAN COMPUTER INTERACTION',
      detail: 'Online class for students in Shanghai, China teaching Human computer interaction via Arduion, Node.js and JavaScript.',
      link: 'http://my.ofcourse.io/course/249'
    },
    automata: {
      title: 'Sealife Automata',
      tag: 'STEAM PROJECT',
      detail: 'Automata designed for a STEM program to get children involved in engineering. It was designed to inspire them to look and learn, touch and play.',
      link: 'https://www.youtube.com/watch?v=oEhN6xHVefU&feature=emb_title'
    },
    beam: {
      title: 'Beam Camp',
      tag: 'ART AND ENGINEERING INSTRUCTOR',
      detail: 'Classes: Sound Effect Boards using piezo microphones, Build your own Xylophone, Dance Painting, Spin Art Machines',
      link: 'https://beamcamp.org/'
    },
    computers_for_kids: {
      title: 'Computers for Kids',
      tag: 'FUNDRAISER AND SCHOLARSHIP',
      detail: 'Fundraiser and Scholarship to help 75 children receive computers to continue their education during the Covid-19 crisis.',
      link: 'https://www.gofundme.com/f/863quj-computers-for-kids'
    },
    mmc: {
      title: 'Makers Making Change',
      tag: 'ASSISTIVE TECHNOLOGY DESIGN AND BUILD',
      detail: 'Working with persons with disabilities to manufacture and design assistive devices. I have so far made over 60 devices in partner with the program.',
      link: 'https://www.makersmakingchange.com/'
    }
  };

  $('#gallery .button').on('click', function () {
    fillModal(this.id);
    $('.modal-wrap').addClass('visible');
  });

  if (isMobile) {
    $('#gallery .mix').on('click', function (e) {
      $('#gallery .mix').removeClass('cardHover');
      let p = $(e.target).parents()[1]
      $(p).addClass('cardHover');
    });
  }

  $('.close').on('click', function () {
    $('.modal-wrap, #modal .button').removeClass('visible');
  });

  $('.mask').on('click', function () {
    $('.modal-wrap, #modal .button').removeClass('visible');
  });

  var carousel = $('#carousel'),
    slideWidth = 700,
    threshold = slideWidth / 3,
    dragStart,
    dragEnd;

  setDimensions();

  $('#next').click(function () {
    shiftSlide(-1);
  });
  $('#prev').click(function () {
    shiftSlide(1);
  });

  carousel.on('mousedown', function () {
    if (carousel.hasClass('transition')) return;
    dragStart = event.pageX;
    $(this).on('mousemove', function () {
      dragEnd = event.pageX;
      $(this).css('transform', 'translateX(' + dragPos() + 'px)');
    });
    $(document).on('mouseup', function () {
      if (dragPos() > threshold) {
        return shiftSlide(1);
      }
      if (dragPos() < -threshold) {
        return shiftSlide(-1);
      }
      shiftSlide(0);
    });
  });

  function setDimensions() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      slideWidth = $(window).innerWidth();
    }
    $('.carousel-wrap, .slide').css('width', slideWidth);
    $('.modal').css('max-width', slideWidth);
    $('#carousel').css('left', slideWidth * -1);
  }

  function dragPos() {
    return dragEnd - dragStart;
  }

  function shiftSlide(direction) {
    if (carousel.hasClass('transition')) return;
    dragEnd = dragStart;
    $(document).off('mouseup');
    carousel
      .off('mousemove')
      .addClass('transition')
      .css('transform', 'translateX(' + direction * slideWidth + 'px)');
    setTimeout(function () {
      if (direction === 1) {
        $('.slide:first').before($('.slide:last'));
      } else if (direction === -1) {
        $('.slide:last').after($('.slide:first'));
      }
      carousel.removeClass('transition');
      carousel.css('transform', 'translateX(0px)');
    }, 700);
  }

  function fillModal(id) {
    $('#modal .title').text(modalText[id].title);
    $('#modal .detail').text(modalText[id].detail);
    $('#modal .tag').text(modalText[id].tag);
    if (modalText[id].link)
      $('#modal .button')
        .addClass('visible')
        .parent()
        .attr('href', modalText[id].link);

    $.each($('#modal li'), function (index, value) {
      $(this).text(modalText[id].bullets[index]);
    });
    $.each($('#modal .slide'), function (index, value) {
      let fileType = '.';
      if (!UrlExists("img/slides/" + id + '-' + index + fileType)) fileType = '.gif';
      $(this).css({
        background:
          "url('img/slides/" + id + '-' + index + fileType + "') center center/cover",
        backgroundSize: 'cover'
      });
    });
  }
});

function UrlExists(url) {
  var http = new XMLHttpRequest();
  http.open('HEAD', url, false);
  http.send();
  if (http.status == 404) console.log('.gif not found, searching for .jpg');
  return http.status != 404;
}
