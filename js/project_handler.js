function clear_container_info() {
  $(".js-content-container").empty();
};

function initiate_company_values(company_info) {

  console.log(company_info);

  $(".js-company_area-name").append(company_info.company_name);
  $(".js-company_area-logo").prepend('<a href="' + company_info.company_site + '" target="_blank"><img width="' + company_info.companay_image_width + '" height="' + company_info.companay_image_height + '" src="images/' + company_info.companay_image.trim() + '" /></a>')

  company_info.projects.forEach(function (proj) {
    console.log(proj.project_name);
  });
};

function load_new_info(company_info) {

  $.get("content/company_info.html", function(data){
    $(".js-content-container").hide().append(data);

    initiate_company_values(company_info);

    //this function can only run after initiate_company_values() is finished loading
    $(".js-content-container").fadeTo("slow", 1);
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
