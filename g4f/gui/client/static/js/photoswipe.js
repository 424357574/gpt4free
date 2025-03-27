import PhotoSwipeLightbox from "/js/photoswipe-lightbox.esm.min.js";
import PhotoSwipeVideoPlugin from "/js/photoswipe-video-plugin.esm.min.js";
import PhotoSwipeAutoHideUI from "/js/photoswipe-auto-hide-ui.esm.min.js";
import PhotoSwipeSlideshow from "/js/photoswipe-slideshow.esm.min.js";

const lightbox = new PhotoSwipeLightbox({
    gallery: '#messages',
    children: 'a:has(img)',
    initialZoomLevel: 'fill',
    secondaryZoomLevel: 1,
    maxZoomLevel: 2,
    allowPanToNext: true,
    doubleTapAction: 'close',
    pswpModule: () => import('https://cdn.jsdelivr.net/npm/photoswipe'),
});
lightbox.addFilter('itemData', (itemData, index) => {
    const img = itemData.element.querySelector('img');
    itemData.width = img.naturalWidth || 1024;
    itemData.height = img.naturalHeight || 1024;
    return itemData;
});
lightbox.on('uiRegister', function() {
    lightbox.pswp.ui.registerElement({
        name: 'custom-caption',
        order: 9,
        isButton: false,
        appendTo: 'root',
        html: 'Caption text',
        onInit: (el, pswp) => {
            lightbox.pswp.on('change', () => {
                const currSlideElement = lightbox.pswp.currSlide.data.element;
                if (currSlideElement) {
                    const img = currSlideElement.querySelector('img');
                    const download = document.createElement("a");
                    download.setAttribute("href", img.getAttribute('src'));
                    let extension = img.getAttribute('src').includes(".webp") ? ".webp" : ".jpg";
                    download.setAttribute("download", `${img.getAttribute('alt')} ${lightbox.pswp.currSlide.index}${extension}`);
                    download.style.float = "right";
                    download.innerHTML = '<i class="fa-solid fa-download"></i>';
                    let span = document.createElement("span");
                    span.innerText = img.getAttribute('alt');
                    el.innerHTML = '';
                    el.appendChild(download);
                    el.appendChild(span);
                }
            });
        }
    });
});
// Add a slideshow to the PhotoSwipe gallery.
const _slideshowPlugin = new PhotoSwipeSlideshow(lightbox, {
    defaultDelayMs: 7000,
    restartOnSlideChange: true,
    progressBarPosition: "top",
    autoHideProgressBar: false
});

// Plugin to display video.
const _videoPlugin = new PhotoSwipeVideoPlugin(lightbox, {});

// Hide the PhotoSwipe UI after some time of inactivity.
const _autoHideUI = new PhotoSwipeAutoHideUI(lightbox, {});
lightbox.init();