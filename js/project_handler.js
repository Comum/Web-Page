function clear_container_info() {
  $('.js-content-container').empty();
};

function changeBackgroundAnimation(image, number) {
  $('.js-project-image-area')
    .css('background-image', 'url(' + image + ')')
    .attr('data-image-number', number);
}

function onImageArrowClick() {
  var arrowDirection = 0,
      nextImage = '',
      $imageInfo = $('.js-project-image-area'),
      nextImageNumber = $imageInfo.attr('data-image-number');

  if ($(this).hasClass('projectInfo--contentContainer--rightArrow')) {
    arrowDirection = 1;
  } else if ($(this).hasClass('projectInfo--contentContainer--leftArrow')) {
    arrowDirection = 2;
  }

  if ($imageInfo.attr('data-image-number') == 0 && arrowDirection == 2) {
    nextImageNumber = $imageInfo.attr('data-image-count') - 1;
  } else if ($imageInfo.attr('data-image-number') == ($imageInfo.attr('data-image-count') - 1) && arrowDirection == 1) {
    nextImageNumber = 0;
  } else if (arrowDirection == 2) {
    nextImageNumber--;
  } else if (arrowDirection == 1) {
    nextImageNumber++;
  }

  nextImage = 'Images/' + $imageInfo.data('imageName') + nextImageNumber + '.png';
  changeBackgroundAnimation(nextImage, nextImageNumber);
}

function popuate_proj_info(data, proj) {
  var html,
      imageName;

  $('.js-content-container').append(data);
  $('.js-project-info-content').html('&nbsp;&nbsp;' + proj[0].project_description);
  proj[0].project_technologies.forEach(function (tech) {
    html = '<span class="projectInfo--technologies--lang">' + tech + '</span>';
    $('.js-project-info-technologies').append(html);
  });

  imageName = proj[0].project_images[0].split('.')[0].slice(0, -1);

  $('.js-project-image-area')
    .css('background-image', 'url(Images/' + proj[0].project_images[0] + ')')
    .attr('data-image-count', proj[0].project_images.length)
    .attr('data-image-name', imageName);

  $('.js-content-container').fadeTo('slow', 1);
}

function load_proj_template(proj) {
  $.get("content/project_info.html", function(data){
    $(".js-content-container").fadeTo("slow", 0, function () {
      $(".js-content-container")
        .empty()
        .hide();

      popuate_proj_info(data, proj);

      $('.js-image-arrow').on('click', onImageArrowClick);
    });
  });
}

function load_project_info() {
  var company = $(this).attr('id').split('-')[0],
      proj_id = $(this).attr('id'),
      info_proj;

  $.getJSON("projects.json", function(data) {
    $.each(data, function( key, val ) {
      if (company === this.company_id) {
        info_proj = this.projects.
                      filter(function(proj) {
                        if (proj.project_id == proj_id) {
                          return proj;
                        }
                      });
        load_proj_template(info_proj);
      }
    });
  });
}

function initiate_company_values(company_info) {
  var html;

  $(".js-company_area-name").append(company_info.company_name);
  $(".js-company_area-logo").prepend('<a href="' + company_info.company_site + '" target="_blank"><img width="' + company_info.companay_image_width + '" height="' + company_info.companay_image_height + '" src="Images/' + company_info.companay_image.trim() + '" /></a>')

  company_info.projects.forEach(function (proj) {
    if (proj.project_images[0]) {
        html = '<div id="' + proj.project_id + '" class="company_area--projects--project_area js-project-info"><div class="company_area--projects--project_img"><img src="Images/' + proj.project_images[0] + '" class="company_area--projects--project_img_properties"/></div><div class="company_area--projects--project_nome">' + proj.project_name + '</div></div>';
    }
    else {
      html = '<div class="company_area--projects--project_area"><div class="company_area--projects--project_img_empty">Images Not Availabe</div><div class="company_area--projects--project_nome">' + proj.project_name + '</div></div>';
    }

    $(".js-company-projects").prepend(html);
  });
};

function load_new_info(company_info) {

  $.get("content/company_info.html", function(data){
    $(".js-content-container").hide().append(data);

    initiate_company_values(company_info);

    //this function can only run after initiate_company_values() is finished loading
    $(".js-content-container").fadeTo("slow", 1);
    $(".js-project-info").unbind('click');
    $(".js-project-info").on('click', load_project_info);
  });
};

function proj_clicked() {
  $(".js-content-area").on("click", ".js-company-logo", function () {
    var comp_id = $(this).attr('id');

    $.getJSON("projects.json", function(data) {
      $.each(data, function( key, val ) {
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
