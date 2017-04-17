$(document).ready(function() {

  $("#main_container").on('click', '.menu_option', function() {

    if($(this).attr('id') === 'about') {
      $("#second_nav_wrapper").empty();
      //criar svg
    }

    $('#main_container').animate({
        'margin-top': '-' + $("#main_container").height() + 'px'
    }, 1250, function() {

      //menu do segundo menu -> fade in
      $("#second_nav_wrapper").fadeTo("slow", 1);
      /*$("#second_nav_wrapper").animate(function() {
        'opacity': '1'
      }, 1000);*/
    });
  });

  $("body").on('click', '#second_nome_reload', function() {

    /*
     * ao clickar no segundo menu manda opacity a 0 e depois recarrega novo conteudo
     */

    $("#second_nav_wrapper").fadeTo("slow", 0);

    if($(this).attr('id') === 'second_nome_reload') {

      $('#main_container').animate({
        'margin-top': '0px'
      }, 1250);
    }
  });
});
