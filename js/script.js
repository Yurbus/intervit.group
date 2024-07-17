"use script"

const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows());
    }
};

if (isMobile.any()) {
    document.body.classList.add('_touch');
	
			let menuArrows = document.querySelectorAll('.menu__arrow');
			if (menuArrows.length > 0) {
				for (let index = 0; index < menuArrows.length; index++) {
					const menuArrow = menuArrows[index];
					menuArrow.addEventListener("click", function (e) {
						menuArrow.parentElement.classList.toggle('_active');
					});
				}
			}

} else {
    document.body.classList.add('_pc');
}

// Меню бурнер
const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');
if (iconMenu) {
	iconMenu.addEventListener("click", function (e) {
		document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('_active');
		menuBody.classList.toggle('_active');
	});
}

// -------- Прокрутка при клике -----------------------------------------

const menuLinks = document.querySelectorAll('.menu__link[data-goto]');
if(menuLinks.length > 0) {
	menuLinks.forEach(menuLink => {
		menuLink.addEventListener("click", onMenuLinkClick);
	});

	function onMenuLinkClick(e) {
		const menuLink = e.target;
		if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
			const gotoBlock = document.querySelector(menuLink.dataset.goto);
			const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;
		
			if (iconMenu.classList.contains('_active')) {
				document.body.classList.remove('_lock');
				iconMenu.classList.remove('_active');
				menuBody.classList.remove('_active');
			}

			window.scrollTo({
				top: gotoBlockValue,
				behavior: "smooth"
			});
			e.preventDefault();
		}
	}
}


// --------- Переключение языка ------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    const headerLang = document.querySelector('.header__lang');
    const langList = document.querySelector('.lang__list');

    // Проверяем, является ли устройство мобильным
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    if (isMobile) {
        headerLang.addEventListener('click', function(event) {
            // Переключаем видимость меню при клике на мобильных устройствах
            if (langList.style.display === 'block') {
                langList.style.display = 'none';
            } else {
                langList.style.display = 'block';
            }
        });

        // Закрываем меню при клике вне его области
        document.addEventListener('click', function(event) {
            if (!headerLang.contains(event.target)) {
                langList.style.display = 'none';
            }
        });
    }
});


// ----------- Slider hero -----------------------------------------------------------

document.addEventListener("DOMContentLoaded", function() {
    const slides = document.querySelectorAll('.slide');
    const currentSlideElement = document.querySelector('.current-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const totalSlides = slides.length;
    const slideInterval = 6000; // 3 seconds

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentSlideElement.textContent = `0${index + 1}`;
        // Trigger reflow to restart animation
        currentSlideElement.style.animation = 'none';
        currentSlideElement.offsetHeight; // Trigger reflow
        currentSlideElement.style.animation = 'fadeInUp 1s ease-in-out';
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            currentSlide = parseInt(e.target.getAttribute('data-slide'));
            showSlide(currentSlide);
        });
    });

    currentSlideElement.addEventListener('click', () => {
        nextSlide();
    });

    // Show the initial slide
    showSlide(currentSlide);

    // Set the interval for automatic slide change
    setInterval(nextSlide, slideInterval);
});



// ---------- Sidebar active ---------------------------------------------------------

const iconFilter= document.querySelector('.filter__btn');
const aside = document.querySelector('.sidebar');
const closeSidebar = document.querySelector('.close_sidebar');
if (iconFilter) {
	iconFilter.addEventListener("click", function (e) {
		document.body.classList.toggle('lock_body');
		iconFilter.classList.add('active');
		aside.classList.toggle('active');
	});
}
if (closeSidebar) {
	closeSidebar.addEventListener("click", function (e) {
		document.body.classList.remove('lock_body');
        closeSidebar.classList.remove('active');
		aside.classList.remove('active');
	});
}



// ------- Section about прокрутка чисел ---------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const statsBlock = document.getElementById('stats');
    const stats = document.querySelectorAll('.stat');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stats.forEach(stat => {
                    const line = stat.querySelector('.line');
                    const number = stat.querySelector('.number');
                    const target = +number.getAttribute('data-target');
                    stat.classList.add('visible');
                    line.classList.add('visible');
                    scrollToTarget(number, target);
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsBlock);

    function scrollToTarget(element, target) {
        let start = 0;
        const increment = target / 100;
        const duration = 2000;
        const stepTime = duration / 100;
        const timer = setInterval(() => {
            start += increment;
            element.textContent = Math.round(start);
            if (start >= target) {
                clearInterval(timer);
                element.textContent = target;
            }
        }, stepTime);
    }
});


// ------- Показать больше фото ---------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.gallery-item');
    const button = document.getElementById('more');

    let itemsToShow = 6;
    const increment = window.innerWidth < 767 ? 2 : 3;

    // Показать начальный набор предметов
    items.forEach((item, index) => {
        if (index < itemsToShow) {
            item.classList.add('show');
        }
    });
    // Добавить слушиватель событий клика на кнопку
    button.addEventListener('click', () => {
        itemsToShow += increment;
        items.forEach((item, index) => {
            if (index < itemsToShow) {
                item.classList.add('show');
            }
        });
        // Скрыть кнопку, если показаны все элементы
        if (itemsToShow >= items.length) {
            button.style.display = 'none';
        }
    });
});

// ---------- Для видео -------------------------------------
document.addEventListener('DOMContentLoaded', () => {

    const itemsVd = document.querySelectorAll('.video-item');
    const buttonVd = document.getElementById('more_video');

    let itemsToShowV = 6;
    const incrementV = window.innerWidth < 767 ? 2 : 3;

    // Показать начальный набор предметов
    itemsVd.forEach((itemsVd, index) => {
        if (index < itemsToShowV) {
            itemsVd.classList.add('show');
        }
    });
    // Добавить слушиватель событий клика на кнопку
    buttonVd.addEventListener('click', () => {
        itemsToShowV += incrementV;
        itemsVd.forEach((item, index) => {
            if (index < itemsToShowV) {
                item.classList.add('show');
            }
        });
        // Скрыть кнопку, если показаны все элементы
        if (itemsToShowV >= itemsVd.length) {
            buttonVd.style.display = 'none';
        }
    });
});
