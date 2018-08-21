let $body = $('body');

const containerFadeIn = container => {
    return new Promise(resolve => {
        $body.find('.' + container).fadeTo('slow', 1, () => {
            resolve();
        });
    });
};

const containerFadeOut = container => {
    return new Promise(resolve => {
        $body.find('.' + container).fadeTo('slow', 0, () => {
            resolve();
        });
    });
};

export {
    containerFadeIn,
    containerFadeOut,
}