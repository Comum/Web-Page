function addEscVisualDisplay() {
  $.get('content/aboutEscButton.html', function(data){
    $('.js-second-container').append(data);

    $(document).keydown(function(e) {
      if(e.keyCode == 27) { // 'ESC' pressionado
        if($('.js-second-container').hasClass('js-initiate-sequence')) {
          $('.js-close-about-area').addClass('buttonBeingPressed');
        }
      }
    });
    $('.js-close-about-area').on('click', function () {
      location.reload();
    });
  });
}

function addArrowsVisualDisplay() {
  $.get('content/aboutArrowsButton.html', function(data){
    $('.js-second-container').append(data);
  });
}

function initiate_sequence() {
  $('.js-second-container').empty();
  $('.js-second-container').addClass('js-initiate-sequence');
  
  // get ESC button display
  addEscVisualDisplay();
  // get arrows display
  addArrowsVisualDisplay();
  // left &#8678; or 9665 - 37
  // right &#8680; or 9655 - 39
  // criar svg
};

function about_button_clicked(id) {

  if(id === 'about') {
    return true;
  }

  if((id.split('_').length > 1) && (id.split('_')[1] === 'about')){
    clear_content_area();
    return true;
  }

  return false;
};

function entry_buttons_pressed(id) {
  if(id.split('_').length === 1) {
    return true;
  }
};

function container_fade_in(container) {
  $('.' + container).fadeTo('slow', 1);
};

function container_fade_out(container) {
  $('.' + container).fadeTo('slow', 0);
}

function entry_menu_to_second() {
  $('.js-main-container').animate({
      'margin-top': '-' + $('.js-main-container').height() + 'px'
  }, 1250, function() {
    //menu do segundo menu -> fade in
    container_fade_in('js-second-container');
  });
};

function clear_content_area() {
  $('.js-content-area').empty();
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

function load_new_content(content) {
  $.get('content/' + content + '.html', function(data){
    if (content === 'contacts') {
      getPageWithQuote(data);
    } else {
      $('.js-content-area').hide().append(data).fadeTo('slow', 1);
    }
  });
};

$(document).ready(function() {

  var id_elem;

  $('.js-main-view').on('click', '.js-menu-option', function() {

    id_elem = $(this).attr('id');

    if(about_button_clicked(id_elem)) {
      initiate_sequence();
    }
    else {
      clear_content_area();
      if(id_elem.split('_').length > 1) {
        load_new_content(id_elem.split('_')[1]);
      }
      else {
        container_fade_in('js-second-nav-wrapper');
        load_new_content(id_elem);
      }
    }

    if(entry_buttons_pressed(id_elem)) {
      entry_menu_to_second();
    }
  });

  $('body').on('click', '.js-second-nome-reload', function() {
    /*
     * ao clickar no segundo menu manda opacity a 0 e depois recarrega novo conteudo
     */
    container_fade_out('js-second-nav-wrapper');
    container_fade_out('js-content-area');

    if($(this).attr('id') === 'second_nome_reload') { //click no nome

      $('.js-main-container').animate({
        'margin-top': '0px'
      }, 1250);
    }
  });

  $(document).keyup(function(e) {
     if(e.keyCode == 27) { // 'ESC' pressionado
        if($('.js-second-container').hasClass('js-initiate-sequence')) {
          //reset a tudo
          $('.js-second-container').find('.js-close-about-area').removeClass('buttonBeingPressed');
          location.reload();
        }
    }
  });
});
