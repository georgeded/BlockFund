let items = document.querySelectorAll('.slider .item');
let next = document.getElementById('next');
let prev = document.getElementById('prev');

let active = 0; // Set to 0 to start with the first slide
function loadShow(){
    let stt = 0;
    // Mark active slide for responsive CSS
    items.forEach((el, idx) => {
        if (idx === active) el.classList.add('is-active');
        else el.classList.remove('is-active');
    });

    items[active].style.transform = `none`;
    items[active].style.zIndex = 1;
    items[active].style.filter = 'none';
    items[active].style.opacity = 1;
    for(var i = active + 1; i < items.length; i++){
        stt++;
        items[i].style.transform = `translateX(${120*stt}px) scale(${1 - 0.2*stt}) perspective(16px) rotateY(-1deg)`;
        items[i].style.zIndex = -stt;
        items[i].style.filter = 'blur(5px)';
        items[i].style.opacity = stt > 2 ? 0 : 0.6;
    }
    stt = 0;
    for(var i = active - 1; i >= 0; i--){
        stt++;
        items[i].style.transform = `translateX(${-120*stt}px) scale(${1 - 0.2*stt}) perspective(16px) rotateY(1deg)`;
        items[i].style.zIndex = -stt;
        items[i].style.filter = 'blur(5px)';
        items[i].style.opacity = stt > 2 ? 0 : 0.6;
    }

    // Hide the prev button if on the first slide
    prev.style.display = active === 0 ? 'none' : 'block';

    // Hide the next button if on the last slide
    next.style.display = active === items.length - 1 ? 'none' : 'block';
}
loadShow();
next.onclick = function(){
    if(active < items.length - 1) {
        active += 1;
        loadShow();
    }
}
prev.onclick = function(){
    if(active > 0) {
        active -= 1;
        loadShow();
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // Copy address functionality for all elements with class 'copyAddress'
    document.querySelectorAll('.copyAddress').forEach(function(element) {
        element.addEventListener('click', function() {
            const address = '0xbC1AA1F461ac8B7359fC833F957c355F19BB4144';
            navigator.clipboard.writeText(address).then(() => {
                alert('Address copied to clipboard!');
            }).catch(err => {
                console.error('Error copying text: ', err);
            });
        });
    });
});
