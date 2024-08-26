function showHoverImg(element) {
    const defaultImg = element.querySelector('[id^="default-img"]');
    const hoverImg = element.querySelector('[id^="hover-img"]');
    defaultImg.style.display = 'none';
    hoverImg.style.display = 'block';
}

function hideHoverImg(element) {
    const defaultImg = element.querySelector('[id^="default-img"]');
    const hoverImg = element.querySelector('[id^="hover-img"]');
    defaultImg.style.display = 'block';
    hoverImg.style.display = 'none';
}
