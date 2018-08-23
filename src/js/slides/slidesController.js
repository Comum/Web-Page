import { containerFadeOut, containerFadeIn } from '../fades'; 

import slides from './slidesInfo';

const HOOK_CONTENT_AREA = 'js-content-area';
const HOOK_SLIDE_CONTAINER = 'js-slide-container';

const $body = $('body');
const $container = $body.find(`.${HOOK_CONTENT_AREA}`);

class SlideController {
    getSlidesLength() {
        return slides.length;
    }

    loadSlide(nr) {
        const slideContent = slides[(nr - 1)].slide;

        return containerFadeOut(HOOK_CONTENT_AREA)
        .then(resolve => {
            $body.find(`.${HOOK_SLIDE_CONTAINER}`).remove();
            resolve();
        })
        .then(resolve => {
            $container.append(slideContent);
        })
        .then(resolve => {
            return containerFadeIn(HOOK_CONTENT_AREA);
        });
    }
}

export default SlideController;