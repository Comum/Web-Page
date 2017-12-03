var $body;
var $secondContainer;
var COMPANY_LOGO = '.js-company-logo';

function clearContainerInfo() {
  var $contentContainer = $secondContainer.find('.js-content-container');
  $contentContainer.empty();
};

function hideOverlayImages() {
  $('.js-image-bottomOverlay').animate({
       bottom: '-50%'
    }, { duration: 750, queue: false });

    $('.js-image-topOverlay').animate({
       top: '-50%'
    }, { duration: 750, queue: false });
}

function changeBackgroundImageWithAnimation(image, number) {
  setTimeout(function () {
    $('.js-project-image-area')
      .css('background-image', 'url(' + image + ')')
      .attr('data-image-number', number);

      hideOverlayImages()
  }, 750);
}

function changeBackgroundAnimation(image, number) {

  $('.js-image-bottomOverlay').animate({
       bottom: 0
    }, { duration: 750, queue: false });

    $('.js-image-topOverlay').animate({
       top: 0
    }, { duration: 750, queue: false }, changeBackgroundImageWithAnimation(image, number));

    //setTimeout(changeBackgroundImageWithAnimation(), 750);
}

function onImageArrowClick() {
  var arrowDirection = 0,
      nextImage = '',
      $imageInfo = $('.js-project-image-area'),
      nextImageNumber = $imageInfo.attr('data-image-number'),
      imageName = $imageInfo.attr('data-image-name');

  if (imageName === 'noImagesForProject') {
    return;
  }

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

function populateProjectInfo(data, proj) {
  var html;
  var imageName;
  var $contentContainer = $secondContainer.find('.js-content-container');
  var $projectInfoName;
  var $projectInfoContent;
  var $projectInfoTechnologies;
  var $projectImageArea;

  $contentContainer.append(data);

  setTimeout(function () {
    $projectInfoName = $secondContainer.find('.js-project-info-name');
    $projectInfoContent = $secondContainer.find('.js-project-info-content');
    $projectInfoTechnologies = $secondContainer.find('.js-project-info-technologies');
    $projectImageArea = $secondContainer.find('.js-project-image-area');
    
    $projectInfoName.text(proj[0].projectName);
    $projectInfoContent.html('&nbsp;&nbsp;' + proj[0].projectDescription);
    proj[0].projectTechnologies.forEach(function (tech, index) {
      html = '<div class="projectInfo--technologies--area"><div id="icon_' + index + '" class="projectInfo--technologies--icon js-tech-lang-icon"></div><div class="projectInfo--technologies--lang">' + tech.name + '</div></div>';
      $projectInfoTechnologies.append(html);
      $('#icon_' + index).css('background-image', 'url(Images/' + tech.icon + ')');
    });
  
    if (proj[0].projectImages.length > 0) {
      imageName = proj[0].projectImages[0].split('.')[0].slice(0, -1);
      imageUrl = 'url(Images/' + proj[0].projectImages[0] + ')';
    } else {
      imageName = 'noImagesForProject';
      imageUrl = 'url(Images/no-results.png)';
    }
  
    $projectImageArea
      .css('background-image', imageUrl)
      .attr('data-image-count', proj[0].projectImages.length)
      .attr('data-image-name', imageName);
  
    $contentContainer.fadeTo('slow', 1);
  }, 0);
}

function loadProjectTemplate(project) {
  var $contentContainer = $secondContainer.find('.js-content-container');
  var $imageArrow;

  $.get('content/project_info.html', function (data) {
    $contentContainer.fadeTo('slow', 0, function () {
      $contentContainer
        .empty()
        .hide();

      populateProjectInfo(data, project);

      // promises
      setTimeout(function () {
        $imageArrow = $secondContainer.find('.js-image-arrow');
        $imageArrow.on('click', onImageArrowClick);
      }, 0);
    });
  });
}

function loadProjectInfo() {
  var projID = $(this).attr('id');
  var company = projID.split('-')[0];
  var infoProject;

  $.getJSON('projects.json', function(data) {
    $.each(data, function( key, val ) {
      if (company === this.companyID) {
        infoProject = this.projects.
                      filter(function(proj) {
                        if (proj.projectID == projID) {
                          return proj;
                        }
                      });
        loadProjectTemplate(infoProject);
      }
    });
  });
}

function initiateCompanyValues(companyInfo) {
  var html;

  $('.js-company_area-name').append(companyInfo.companyName);
  if (companyInfo.companay_image.trim().length > 0) {
      $('.js-company_area-logo').prepend('<a href="' + companyInfo.company_site + '" target="_blank"><img width="' + companyInfo.companay_image_width + '" height="' + companyInfo.companay_image_height + '" src="Images/' + companyInfo.companay_image.trim() + '" /></a>');
  } else {
    $('.js-company_area-name').addClass('noImageProj');
  }

  companyInfo.projects.forEach(function (proj) {
    if (proj.projectImages[0]) {
        html = '<div id="' + proj.projectID + '" class="company_area--projects--project_area js-project-info"><div class="company_area--projects--project_img"><img src="Images/' + proj.projectImages[0] + '" class="company_area--projects--project_img_properties"/></div><div class="company_area--projects--project_nome">' + proj.projectName + '</div></div>';
    }
    else {
      html = '<div id="' + proj.projectID + '" class="company_area--projects--project_area js-project-info"><div class="company_area--projects--project_img_empty">Images Not Availabe</div><div class="company_area--projects--project_nome">' + proj.projectName + '</div></div>';
    }

    $('.js-company-projects').prepend(html);
  });
};

function loadNewInfo(companyInfo) {
  var $contentContainer;
  var $projectInfo;

  $.get('content/company_info.html', function (data) {
    $contentContainer = $secondContainer.find('.js-content-container');
    $contentContainer.hide().append(data);

    initiateCompanyValues(companyInfo);

    // this function can only run after initiateCompanyValues() is finished loading
    // promises
    setTimeout(function () {
      $projectInfo = $secondContainer.find('.js-project-info');
      $contentContainer.fadeTo('slow', 1);
      $projectInfo.unbind('click');
      $projectInfo.on('click', loadProjectInfo);
    }, 0);
  });
};

function onCompanyLogoClick() {
  var companyID = $(this).attr('id');
  
  $.getJSON('projects.json', function (data) {
    $.each(data, function( key, val ) {
      if (companyID === this.companyID) {
        clearContainerInfo();
        loadNewInfo(this);
      }
    });
  });
}

function projectClicked() {
  var $contentArea = $secondContainer.find('.js-content-area');

  $contentArea.on('click', COMPANY_LOGO, onCompanyLogoClick);
};

$(document).ready(function () {
  $body = $('body');
  $secondContainer = $body.find('.js-second-container');

  projectClicked();
});
