var $body;
var $mainView;
var MENU_OPTION = '.js-menu-option';
var SECOND_NOME_RELOAD = '.js-second-nome-reload';

function addEscVisualDisplay() {
  $.get('content/aboutEscButton.html', function(data){
    $('.js-second-container').append(data);

    $('.js-close-about-area').on('click', function () {
      location.reload();
    });
  });
}

function pageNumberOperation(operation) {
  var $secondContainer = $('.js-second-container');
  var pageNumber = parseInt($secondContainer.attr('data-page-number'), 10);

  if ($secondContainer.hasClass('isLoading')) {
    return;
  }

  if (operation === 'inc') {
    pageNumber = pageNumber + 1;
  } else if ((operation === 'dec') && (pageNumber > 1)) {
    pageNumber = pageNumber - 1;
  }

  $secondContainer
    .addClass('isLoading')
    .attr('data-page-number', pageNumber);
}

function addButtonBehaviour() {
  var $secondContainer = $('.js-second-container');

  $(document).keydown(function(e) {
    if ($secondContainer.hasClass('js-initiate-sequence')) {
      if(e.keyCode === 27) {
        $secondContainer.find('.js-close-about-area').addClass('buttonBeingPressed');
      } else if (e.keyCode === 37) {
        $secondContainer.find('.js-about-left-arrow').addClass('buttonBeingPressed');
        pageNumberOperation('dec');
      } else if (e.keyCode === 39) {
        $secondContainer.find('.js-about-right-arrow').addClass('buttonBeingPressed');
        pageNumberOperation('inc');
      }
    }
  });
}

function removeButtonVisualDisplayEffects() {
  var $secondContainer = $('.js-second-container');

  $(document).keyup(function(e) {
    if ($secondContainer.hasClass('js-initiate-sequence')) {
      if(e.keyCode === 27) { // 'ESC' pressionado
        $secondContainer.find('.js-close-about-area').removeClass('buttonBeingPressed');
        location.reload();
      } else if (e.keyCode === 37) {
        $secondContainer
          .removeClass('isLoading')
          .find('.js-about-left-arrow')
          .removeClass('buttonBeingPressed');
      } else if (e.keyCode === 39) {
        $secondContainer
          .removeClass('isLoading')
          .find('.js-about-right-arrow')
          .removeClass('buttonBeingPressed');
      }
    }
  });
}

function addArrowsVisualDisplay() {
  $.get('content/aboutArrowsButton.html', function(data) {
    $('.js-second-container').append(data);
  });
}

function initiate_sequence() {
  var $secondContainer = $('.js-second-container');

  $secondContainer
    .empty()
    .addClass('js-initiate-sequence')
    .attr('data-page-number', 1);
  
  addEscVisualDisplay();
  addArrowsVisualDisplay();
  addButtonBehaviour();
};

function about_button_clicked(id) {

  if(id === 'about') {
    return true;
  }

  if((id.split('_').length > 1) && (id.split('_')[1] === 'about')){
    clearContentArea();
    return true;
  }

  return false;
};

function entry_buttons_pressed(id) {
  if(id.split('_').length === 1) {
    return true;
  }
};

function containerFadeIn(container) {
  $mainView.find('.' + container).fadeTo('slow', 1);
};

function containerFadeOut(container) {
  $mainView.find('.' + container).fadeTo('slow', 0);
}

function entryMenuToSecond() {
  var $mainContainer = $mainView.find('.js-main-container');

  $mainContainer.animate({
      'margin-top': '-' + $mainContainer.height() + 'px'
  }, 1250, function () {
    containerFadeIn('js-second-container');
  });
};

function clearContentArea() {
  var $contentArea = $mainView.find('.js-content-area')
  
  $contentArea.empty();
};

function loadContactsPage(info, quote) {
  var $el = $('.js-content-area');

  $el.hide().append(info);
  $el.find('.js-quote-block').text(quote);
  $el.fadeTo('show', 1);
}

function getPageWithQuote(info) {
  var quote;

  $.ajax({
    url: 'http://cors-proxy.htmldriven.com/?url=http://thoughtsoncoding.com/api/1.0/random.json',
    error: function () {
      quote = 'Insert cheeky quote here.';
      loadContactsPage(info, quote)
    },
    success: function (data) {
      quote = JSON.parse(data.body).quote;
      loadContactsPage(info, quote);
    }
  });
}

function loadNewContent(content) {
  $.get('content/' + content + '.html', function (data) {
    if (content === 'contacts') {
      getPageWithQuote(data);
    } else {
      $('.js-content-area')
        .hide()
        .append(data)
        .fadeTo('slow', 1);
    }
  });
};

function onClickMenuOption() {
  var elementID = $(this).attr('id');
  
  if(about_button_clicked(elementID)) {
    initiate_sequence();
  }
  else {
    clearContentArea();
    if(elementID.split('_').length > 1) {
      loadNewContent(elementID.split('_')[1]);
    }
    else {
      containerFadeIn('js-second-nav-wrapper');
      loadNewContent(elementID);
    }
  }

  if(entry_buttons_pressed(elementID)) {
    entryMenuToSecond();
  }
}

function onClickSecondNome() {
  var $mainContainer = $mainView.find('.js-main-container');

  containerFadeOut('js-second-nav-wrapper');
  containerFadeOut('js-content-area');

  if($(this).attr('id') === 'second_nome_reload') {
    $mainContainer.animate({
      'margin-top': '0px'
    }, 1250);
  }
}

$(document).ready(function() {
  $body = $('body');
  $mainView = $body.find('.js-main-view');

  $mainView.on('click', MENU_OPTION, onClickMenuOption);
  $body.on('click', SECOND_NOME_RELOAD, onClickSecondNome);

  removeButtonVisualDisplayEffects();
});
