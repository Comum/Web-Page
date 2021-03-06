import { containerFadeOut, containerFadeIn } from './fades'; 

/*
 * KNOWN BUGS
 * If a slide is changed before the text is added then the text of the previous slide is printed in the new slide.
 * 
 */

let $body = $('body');
let $container = $body.find('.js-content-area');
let interval;
let intervalSecond;

const slideZero = `
    <div class="slideZeroContainer js-slide-container">
        <ul class="instructionsArea cursor-default no-select-text">
            <li>Press the arrow keys to move through the slides.</li>
            <li>Or press the buttons on the right bottom corner to move through the slides.</li>
            <li>Press the ESC key to reset the page.</li>
            <li>Or press the button on the left top corner to reset the page.</li>
        </ul>
    </div>
`;

const slideOne = `
    <div class="slideOneContainer js-slide-container">
        <div class="textLine js-text-line" data-text-line="0">
            <span class="textLineContent js-text-container"></span>
            <span class="dashBlinker text-bold js-dash-blinker">|</span>
        </div>
        <div class="textLine js-text-line" data-text-line="1">
            <span class="textLineContent js-text-container"></span>
        </div>
        <div class="textLine js-text-line" data-text-line="2">
            <span class="textLineContent js-text-container"></span>
        </div>
        <div class="textLine js-text-line" data-text-line="3">
            <span class="textLineContent js-text-container"></span>
        </div>
        <div class="textLine js-text-line" data-text-line="4">
            <span class="textLineContent js-text-container"></span>
        </div>
    </div>
`;

const slideTwo = `
    <div class="slideTwoContainer js-slide-container">
        <div class="slideTwoContentContainer opacity-0 logoFeup js-image-container">
            <a href="https://www.fe.up.pt" target="_blank" class="display-block height-200"></a>
        </div>
        <div class="slideTwoContentContainer text-color">
            <span class="textLineContent js-text-container"></span>
            <span class="dashBlinker text-bold js-dash-blinker">|</span>
        </div>
    </div>
`;

const slideThree = `
    <div class="slideThreeContainer js-slide-container opacity-0">
        <div class="logoMajo height-100 js-image-container">
            <a href="http://www.majo.pt" target="_blank" class="display-block height-100"></a>
        </div>
        <div class="slideThreeContentContainer text-color">
            <div class="slideThreeTextField text-color js-text-intro-1">
                <span class="textLineContent js-text-container"></span>
                <span class="dashBlinker text-bold js-dash-blinker">|</span>
            </div>
            <div class="slideThreeTextField text-color js-text-intro-2"></div>
            <div class="slideThreeTextField text-color text-large text-italic js-text-proj-1"></div>
            <div class="slideThreeTextField text-color text-large text-italic js-text-proj-2"></div>
            <div class="slideThreeTextField text-color js-text-more-info"></div>
        </div>
    </div>
`;

const moveBlinkerToNextLine = () => {
    let $blinker = $container.find('.js-dash-blinker');
    let blinkerContainerNumber = parseInt($blinker.parent().attr('data-text-line'), 10);
    let newBlinkerContainerNumber;

    if (blinkerContainerNumber < 4) {
        newBlinkerContainerNumber = blinkerContainerNumber + 1;
    }
   
    $blinker.appendTo($('.js-text-line[data-text-line=' + newBlinkerContainerNumber + ']'));
}

const replaceTextWithAnchor = ($containerToUse, textToReplace, anchorPath) => {
    let containerContent = $containerToUse.text().replace(textToReplace, '<a href="' + anchorPath + '" target="_blank" class="anchorDefaultStyle">' + textToReplace + '</a>');

    $containerToUse.empty().html(containerContent);
}

const loadSlide = slide => {
    return new Promise(resolve => {
        $container.append(slide);
        resolve();
    });
}

// use another variable as interval
const insertText = (text, $container, delay, moveBlinker) => {
    return new Promise(resolve => {
        let chars = text.split('');
        let i = 0;
        let wordsLeft = chars.length;

        interval = setInterval(function () {
            if(i < chars.length) {
                $container.text($container.text() + chars[i++]);
                wordsLeft--;
                if (wordsLeft === 0) {
                    
                    if (moveBlinker) {
                        moveBlinkerToNextLine();
                    }

                    resolve();
                }
            }
        }, delay);
    });
}

const loadSlideOneText = text => {
    let $lines = $container.find('.js-text-container');
    let i = 0;

    return insertText(text[i], $($lines[i]), 50, 1)
        .then(() => {
            clearInterval(interval);
            i++;
            return insertText(text[i], $($lines[i]), 50, 1);
        })
        .then(() => {
            clearInterval(interval);
            i++;
            return insertText(text[i], $($lines[i]), 50, 1);
        })
        .then(() => {
            clearInterval(interval);
            i++;
            return insertText(text[i], $($lines[i]), 50, 1);
        })
        .then(() => {
            clearInterval(interval);
            i++;
            return insertText(text[i], $($lines[i]), 50, 1);
        });
}

const getMyAge = () => {
    let date = new Date();
    let age;

    if (date.getMonth() >= 4 && date.getDate() >= 23) {
        age = date.getFullYear() - 1990;
    } else {
        age = date.getFullYear() - 1990 - 1;
    }

    return age;
}

const slideOneSequence = () => {
    return loadSlide(slideOne)
        .then(() => {
            let age = getMyAge();
            let textToLoad;

            textToLoad = [
                'Hello,',
                'My name is Miguel and my objective in life is to be happy.',
                'I\'m a ' + age + ' year old web developer based in London.',
                'And this is my story.',
                'Spoilers: it will be boring and short.'
            ];

            clearInterval(interval);
            loadSlideOneText(textToLoad);
        });
}

const slideTwoSequence = () => {
    let $containerToUse;

    return loadSlide(slideTwo)
        .then(() => {
            clearInterval(interval);
            return containerFadeIn('js-image-container');
        })
        .then(() => {
            let textToShow = 'In 2014 I finished my Masters in Electrotecnical Engineering at Faculdade de Engenharia da Universidade do Porto. As soon as I finished I started my Web Developer career, as you do.';

            $containerToUse = $body.find('.js-text-container');

            return insertText(textToShow, $containerToUse, 50, 0);
        })
        .then(() => {
            clearInterval(intervalSecond);

            replaceTextWithAnchor($containerToUse, 'Faculdade de Engenharia da Universidade do Porto', 'https://sigarra.up.pt/feup/');
        });
}

const slideThreeSequence = () => {
    let $containerToUse;

    return loadSlide(slideThree)
        .then(() => {
            clearInterval(interval);
            return containerFadeIn('js-slide-container');
        })
        .then(() => {
            let textToShow = 'In Octber 2014 I started working at a company named MAJO. I was hired, mainly, as a full stack developer but I ended up doing a bit of tech support as well. On both projects I was the only dev working on them :(';

            $containerToUse = $body.find('.js-text-intro-1').find('.js-text-container');
            clearInterval(intervalSecond);
            return insertText(textToShow, $containerToUse, 50, 0);
        })
        .then(() => {
            let textToShow = 'My two big projects on MAJO were:';

            $containerToUse = $body.find('.js-text-intro-2');
            clearInterval(intervalSecond);
            return insertText(textToShow, $containerToUse, 50, 0);
        })
        .then(() => {
            let textToShow = 'Majo Energy Audit';

            $containerToUse = $body.find('.js-text-proj-1');
            clearInterval(intervalSecond);
            return insertText(textToShow, $containerToUse, 50, 0);
        })
        .then(() => {
            let textToShow = 'Majo Managment Platform';

            $containerToUse = $body.find('.js-text-proj-2');
            clearInterval(intervalSecond);
            return insertText(textToShow, $containerToUse, 50, 0);
        })
        .then(() => {
            let textToShow = 'More information on them can be found on the projects tab.';

            $containerToUse = $body.find('.js-text-more-info');
            clearInterval(intervalSecond);
            return insertText(textToShow, $containerToUse, 50, 0);
        });
}

const loadSlideZero = () => {
    loadSlide(slideZero);
};

const loadSlideOne = () => {
    slideOneSequence();
};

const loadSlideTwo = () => {
    slideTwoSequence();
};

const loadSlideThree = () => {
    slideThreeSequence();
};

export {
    loadSlideZero,
    loadSlideOne,
    loadSlideTwo,
    loadSlideThree,
}