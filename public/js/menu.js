const 
    hamburger = document.querySelector('.hamburger'),
    menu = document.querySelector('.header__navbar');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('hamburger_active');
    menu.classList.toggle('header__navbar_active');
    document.querySelector('body').classList.toggle('no_scroll');
})
