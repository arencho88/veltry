let nav = document.querySelector('.header__nav')
let burgerBtn = document.querySelector('.header__nav-burger');

burgerBtn.onclick = navToggle;

function navToggle() {
	if (nav.classList.contains('header__nav--closed')) {
		nav.classList.remove('header__nav--closed');
		nav.classList.add('header__nav--opened');
	} else {
		nav.classList.remove('header__nav--opened');
		nav.classList.add('header__nav--closed');
	}
}

