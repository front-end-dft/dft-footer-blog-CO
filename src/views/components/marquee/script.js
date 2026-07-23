const container = document.querySelector('.marquee-container');
const follower = document.querySelector('.mouse-follower');
const followerImg = follower.querySelector('img');
const wrappers = document.querySelectorAll('.marquee-wrapper');

container.addEventListener('mousemove', (e) => {
    follower.style.left = e.clientX + 'px';
    follower.style.top = e.clientY + 'px';
});

wrappers.forEach(wrapper => {
    wrapper.addEventListener('mouseenter', () => {
        const imgPath = wrapper.getAttribute('data-hover-img');
        followerImg.src = imgPath;
    });
});