window.onload = () => {
    initializeNow(window.document)
};

function initializeNow(document) {

    let el = document.getElementById("pagination-bottom");
    const handler = (visible) => {
        const linkToNextPage = el.getElementsByClassName('ui-pagination-active')[0].nextElementSibling.getAttribute("href");
        if (!linkToNextPage)
            return;
        fetch(linkToNextPage)
        .then(function(response) {
            return response.text();
        }).then(parsedText => {
            const parseElement = document.createElement( 'html' );
            parseElement.innerHTML = parsedText;

            if((window.innerHeight + window.scrollY) >= document.body.offsetHeight)
                window.scrollBy(0, -100);

            const topList = parseElement.querySelector('#hs-list-items');
            if (topList) {
                initializeImages(topList);
                el.parentElement.insertBefore(topList, el);
            }
            const bottomList = parseElement.querySelector('#hs-below-list-items');
            if(bottomList) {
                const div = document.createElement('div');
                div.innerHTML = bottomList.children[0].innerText.trim();
                bottomList.children[0].innerText = '';
                bottomList.appendChild(div.firstChild);
                initializeImages(bottomList);
                el.parentElement.insertBefore(bottomList, el);
            }
            const categoryList = parseElement.querySelector('#gallery-item');
            if (categoryList) {
                el.parentElement.insertBefore(categoryList, el);
                initializeImages(categoryList);
            }
            const newPagination = parseElement.querySelector('#pagination-bottom');
            el.parentElement.insertBefore(newPagination, el);
            el.parentElement.removeChild(el);
            el = newPagination;

        })
    };
    
    var old_visible = false;
    const checkVis = () => {
        var visible = isElementInViewport(el);
        if (visible != old_visible) {
            old_visible = visible;
            if (visible) {
                handler();
            }
        }
    }
    if (el) {
        attachEvents(checkVis);
    }
}

function attachEvents(handler) {
    if (window.addEventListener) {
        addEventListener('DOMContentLoaded', handler, false);
        addEventListener('load', handler, false);
        addEventListener('scroll', handler, false);
        addEventListener('resize', handler, false);
    } else if (window.attachEvent) {
        attachEvent('onDOMContentLoaded', handler); // IE9+ :(
        attachEvent('onload', handler);
        attachEvent('onscroll', handler);
        attachEvent('onresize', handler);
    }
}

function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}

function initializeImages(list) {
    list.querySelectorAll('img').forEach(imageEl => {
        if (imageEl.hasAttribute('image-src')) {
            imageEl.setAttribute('src', imageEl.getAttribute('image-src'));
            imageEl.setAttribute('image-src', '');
            imageEl.classList.add('pic-Core-v');
        }
    });
}
