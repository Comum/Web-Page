function clear_container_info() {
  $(".js-content-container").empty();
};

function initiate_company_values(company_info) {

};

function load_new_info(company_info) {

  $.get("content/company_info.html", function(data){
    $(".js-content-area").hide().append(data);

    initiate_company_values(company_info);

    $(".js-content-area").fadeTo("slow", 1);
  });
};

function proj_clicked() {
  $(".js-content-area").on("click", ".js-company-logo", function () {
    var comp_id = $(this).attr('id');

    $.getJSON("projects.json", function(data) {
      $.each( data, function( key, val ) {
        if (comp_id === this.company_id) {
          clear_container_info();
          load_new_info(this);
        }
      });
    });
  });
};

$(document).ready(function () {
  proj_clicked();
});
