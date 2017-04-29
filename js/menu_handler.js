$(document).ready(function() {

  $(".js-main-container").on('click', '.js-menu-option', function() {

    if($(this).attr('id') === 'about') {
      $(".js-second-nav-wrapper").empty();
      //criar svg
    }

    $('.js-main-container').animate({
        'margin-top': '-' + $(".js-main-container").height() + 'px'
    }, 1250, function() {

      //menu do segundo menu -> fade in
      $(".js-second-nav-wrapper").fadeTo("slow", 1);
    });
  });

  $("body").on('click', '.js-second-nome-reload', function() {
    /*
     * ao clickar no segundo menu manda opacity a 0 e depois recarrega novo conteudo
     */
    $(".js-second-nav-wrapper").fadeTo("slow", 0);

    if($(this).attr('id') === 'second_nome_reload') {

      $('.js-main-container').animate({
        'margin-top': '0px'
      }, 1250);
    }
  });
});
