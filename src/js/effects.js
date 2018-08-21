import {
    addAboutButton,
    addArrowsContainer,
    loadContactsContent,
    loadProjsContent,
    loadCompanyContent,
    loadProjContent,
    addSlide
} from './hbsInjector.js';
import { containerFadeIn, containerFadeOut } from './fades.js';

const HOOK_CONTENT_AREA = 'js-content-area';
const HOOK_CONTENT_AREA_CLASS = '.' + HOOK_CONTENT_AREA;
const HOOK_CONTENT_SECTION = 'js-content-section';
const HOOK_CONTENT_SECTION_CLASS = '.' + HOOK_CONTENT_SECTION;
const HOOK_IMAGE_BOTTOMOVERLAY = '.js-image-bottomOverlay';
const HOOK_IMAGE_TOPOVERLAY = '.js-image-topOverlay';
const HOOK_MAIN_MENU = '.js-main-menu';
const HOOK_CLOSE_ABOUT_AREA = '.js-close-about-area';
const HOOK_ABOUT_LEFT_ARROW = '.js-about-left-arrow';
const HOOK_ABOUT_RIGHT_ARROW = '.js-about-right-arrow';

const CLASS_BUTTON_BEING_PRESSED = 'buttonBeingPressed';

const DATA_MENU_IN_VIEW = 'data-menu-in-view';
const DATA_PAGE_NUMBER = 'data-page-number';
const DATA_IMAGE_NUMBER = 'data-image-number';

let $body = $('body');
let $secondMenuContainer = $body.find(HOOK_CONTENT_AREA_CLASS);

const ANIMATION_DELAY = 750;

const resetWebPage = () => {
    location.reload();
};

const getBodyViewMode = () => {
    return $body.attr(DATA_MENU_IN_VIEW);
};

const slideNumber = newPageNumber => {
    return new Promise((resolve, reject) => {
        $secondMenuContainer.attr(DATA_PAGE_NUMBER, newPageNumber);
        resolve();
    });
};

const clearPreviousSlide = () => {
    return new Promise((resolve, reject) => {
        $secondMenuContainer.find('.js-slide-container').remove();
        resolve();
    });
};

const updateSlideSequence = newPageNumber => {
    // js-slide-container
    return slideNumber(newPageNumber)
    .then(() => {
        return clearPreviousSlide();
    })
    .then((resolve, reject) => {
        addSlide(newPageNumber);
    });
};

const incrementPageNumber = () => {
    let pageNumber = parseInt($secondMenuContainer.attr(DATA_PAGE_NUMBER), 10) + 1;
    
    updateSlideSequence(pageNumber);
};

const decrementPageNumber = () => {
    let pageNumber = $secondMenuContainer.attr(DATA_PAGE_NUMBER);

    if (pageNumber > 0) {
        pageNumber--;
        updateSlideSequence(pageNumber);
    }
};

const closeScreen = () => {
    let $bottomOverlay = $secondMenuContainer.find(HOOK_IMAGE_BOTTOMOVERLAY);
    let $topOverlay = $secondMenuContainer.find(HOOK_IMAGE_TOPOVERLAY);

    return new Promise((resolve, reject) => {
        $bottomOverlay.animate({
            bottom: '0'
        }, ANIMATION_DELAY);
      
        $topOverlay.animate({
            top: '0'
        }, ANIMATION_DELAY, function () {
            resolve();
        });
    });
};

function openScreen() {
    let $bottomOverlay = $secondMenuContainer.find(HOOK_IMAGE_BOTTOMOVERLAY);
    let $topOverlay = $secondMenuContainer.find(HOOK_IMAGE_TOPOVERLAY);

    return new Promise((resolve, reject) => {
        $bottomOverlay.animate({
            bottom: '-50%'
        }, ANIMATION_DELAY);
      
        $topOverlay.animate({
            top: '-50%'
        }, ANIMATION_DELAY, function () {
            resolve();
        });
    });
};

const addMarginToMainMenu = () => {
    let $mainContainer = $body.find(HOOK_MAIN_MENU);

    $mainContainer.animate({
        'margin-top': '-' + $mainContainer.height() + 'px'
    }, 1250, function () {
        containerFadeIn(HOOK_CONTENT_AREA);
    });
};

const removeMarginToMainMenu = () => {
    let $mainContainer = $body.find(HOOK_MAIN_MENU);
    
    containerFadeOut(HOOK_CONTENT_AREA)
    .then(() => {
        $mainContainer.animate({
            'margin-top': '0px'
        }, 1250);
    })
};

const initAboutMenuFunctionality = () => {
    return new Promise((resolve, reject) => {
        addAboutButton();
        addArrowsContainer();
        addSlide(0);

        resolve();
    });
};

const addButtonsFunctionality = () => {
    $secondMenuContainer
        .on('click', HOOK_CLOSE_ABOUT_AREA, resetWebPage)
        .on('click', HOOK_ABOUT_LEFT_ARROW, decrementPageNumber)
        .on('click', HOOK_ABOUT_RIGHT_ARROW, incrementPageNumber);

    $(document).keydown(function (e) {
        if (getBodyViewMode() === 'about') {
            if(e.keyCode === 27) {
                $secondMenuContainer.find(HOOK_CLOSE_ABOUT_AREA).addClass(CLASS_BUTTON_BEING_PRESSED);
            } else if (e.keyCode === 37) {
                $secondMenuContainer.find(HOOK_ABOUT_LEFT_ARROW).addClass(CLASS_BUTTON_BEING_PRESSED);
                decrementPageNumber();
            } else if (e.keyCode === 39) {
                $secondMenuContainer.find(HOOK_ABOUT_RIGHT_ARROW).addClass(CLASS_BUTTON_BEING_PRESSED);
                incrementPageNumber();
            }
        }
    });

    $(document).keyup(function (e) {
        if (getBodyViewMode() === 'about') {
            if(e.keyCode === 27) {
                $secondMenuContainer.find(HOOK_CLOSE_ABOUT_AREA).removeClass(CLASS_BUTTON_BEING_PRESSED);
                resetWebPage();
            } else if (e.keyCode === 37) {
                $secondMenuContainer.find(HOOK_ABOUT_LEFT_ARROW).removeClass(CLASS_BUTTON_BEING_PRESSED);
            } else if (e.keyCode === 39) {
                $secondMenuContainer.find(HOOK_ABOUT_RIGHT_ARROW).removeClass(CLASS_BUTTON_BEING_PRESSED);
            }
        }
    });
};

const initContentContainer = (menuView, areaToEmpty = HOOK_CONTENT_AREA_CLASS) => {
    return new Promise((resolve, reject) => {
        $secondMenuContainer = $body.find(areaToEmpty).empty();
        $body.attr(DATA_MENU_IN_VIEW, menuView);

        resolve();
    });
};

const loadPageContent = (pageToLoad, detailID = '') => {
    return new Promise((resolve, reject) => {
        switch(pageToLoad) {
            case 'contacts':
                loadContactsContent();
                break;
            case 'projs':
                loadProjsContent();
                break;
            case 'companyProjs':
                loadCompanyContent(detailID);
                break;
            case 'projDetails':
                loadProjContent(detailID);
                break;
            default:
                console.log('404 Page not found');
        }
        resolve();
    });
};

const loadContentSequence = contentToLoad => {
    return containerFadeOut(HOOK_CONTENT_SECTION)
    .then(() => {
        return module.exports.initContentContainer('second', HOOK_CONTENT_SECTION_CLASS)
    })
    .then(() => {
        return module.exports.loadPageContent(contentToLoad);
    })
    .then(() => {
        return containerFadeIn(HOOK_CONTENT_SECTION);
    });
};

const loadNewImage = (newImageNumber, newImage, $container) => {
    return closeScreen()
    .then(() => {
        return new Promise((resolve, reject) => {
            $container.attr(DATA_IMAGE_NUMBER, newImageNumber);
            $container.css('background-image', 'url(' + newImage + ')');

            resolve();
        });
    })
    .then(() => {
        return openScreen();
    });
};

export {
    addMarginToMainMenu,
    removeMarginToMainMenu,
    initAboutMenuFunctionality,
    addButtonsFunctionality,
    initContentContainer,
    loadPageContent,
    loadContentSequence,
    loadNewImage,
}