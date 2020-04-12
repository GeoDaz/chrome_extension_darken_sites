'use-strict';

window.onbeforeunload = e => localStorage.clear();
init();

function init() {
	const key_stored = `darken-${window.location.origin}`;
	let toggled = localStorage.getItem(key_stored);
	if (toggled) {
		toggled = JSON.parse(toggled);
	}
	if (!toggled) {
		dark();
		toggled = localStorage.setItem(key_stored, true);
	} else {
		light();
		toggled = localStorage.setItem(key_stored, false);
	}
}

function dark() {
	const body = document.getElementsByTagName('body')[0];
	body.classList.add('body-darken');

	const els = document.querySelectorAll('*');
	for (let el of els) {
		// Font color
		let font_color = el.style.color || getComputedStyle(el).color;
		if (font_color) {
			font_color = font_color.replace(/\s/g, '').toLowerCase();
			if (lightenFont(font_color)) {
				el.classList.add('font-color-lighten');
			}
		}
		// Background color
		let bkg_color =
			el.style.backgroundColor || getComputedStyle(el).backgroundColor;
		if (bkg_color) {
			bkg_color = bkg_color.replace(/\s/g, '').toLowerCase();
			bkg_cond = darkenBkg(bkg_color);
			if (bkg_cond === true) {
				el.classList.add('background-darken');
			} else if (typeof bkg_cond === 'object') {
				el.style.backgroundColor = `rgba(${bkg_cond[0]},${bkg_cond[1]},${bkg_cond[2]},${bkg_cond[3]})`;
				el.classList.add('trans-background-darken');
			}
		}
	}
}

function light() {
	const body = document.getElementsByTagName('body')[0];
	body.classList.remove('body-darken');

	const fonts = document.getElementsByClassName('font-color-lighten');
	// `for let of` didn't work, it justs loop on half elements. I don't know why...
	for (let i = fonts.length - 1; i > -1; i--) {
		fonts[i].classList.remove('font-color-lighten');
	}

	const bkgs = document.getElementsByClassName('background-darken');
	for (let i = bkgs.length - 1; i > -1; i--) {
		bkgs[i].classList.remove('background-darken');
	}

	const trans_bkgs = document.getElementsByClassName(
		'trans-background-darken'
	);
	for (let i = trans_bkgs.length - 1; i > -1; i--) {
		trans_bkgs[i].style.backgroundColor = '';
		trans_bkgs[i].classList.remove('trans-background-darken');
	}
}

function lightenFont(color) {
	if (!color.length) {
		return false;
	} else if (color === 'black') {
		return true;
	} else if (color.charAt(0) === '#') {
		color = color.substr(1);
		parseInt(color, 16);
		if (color.length === 3 && color < 2184) {
			//#888
			return true;
		} else if (color.length === 6 && color < 8355711) {
			//#7f7f7f
			return true;
		}
		return false;
	} else if (color.slice(0, 4) === 'rgb(') {
		return manageFontRGB(color, 4);
	} else if (color.slice(0, 4) === 'rgba') {
		return manageFontRGB(color, 5);
	}
	return false;
}

function darkenBkg(color) {
	if (!color.length) {
		return false;
	} else if (
		color === 'white'
		|| color === 'whitesmoke'
		|| color === 'florawhite'
		|| color === 'ghostwhite'
		|| color === 'aliceblue'
		|| color === 'azure'
		|| color === 'honeydew'
		|| color === 'ivory'
		|| color === 'snow'
		|| color === 'seashell'
	) {
		return true;
	} else if (color.charAt(0) === '#') {
		color = color.substr(1);
		parseInt(color, 16);
		if (color.length === 3 && color > 3003) {
			// #bbb
			return true;
		} else if (color.length === 6 && color > 12171705) {
			// #b9b9b9
			return true;
		}
		return false;
	} else if (color.slice(0, 4) === 'rgb(') {
		return manageBkgRGB(color, 4);
	} else if (color.slice(0, 4) === 'rgba') {
		return manageBkgRGB(color, 5, true);
	}
	return false;
}

function manageFontRGB(color, pre_size) {
	color = color.substr(pre_size);
	color = color.substr(0, color.length - 1);
	color = color.split(',');
	// blue is not readable on black
	if (color[0] < 127 && color[1] < 127 && color[2] < 127) {
		return true;
	}
	return false;
}

function manageBkgRGB(color, pre_size, trans = false) {
	color = color.substr(pre_size);
	color = color.substr(0, color.length - 1);
	color = color.split(',');
	if (trans) {
		color[0] = 255 - color[0];
		color[1] = 255 - color[1];
		color[2] = 255 - color[2];
		return color;
	}
	if (color[0] > 185 && color[1] > 185 && color[2] > 185) {
		return true;
	}
	return false;
}
