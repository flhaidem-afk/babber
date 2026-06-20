/* Royal Fade Barbershop - Interactive JavaScript */

(function() {
    'use strict';

    // ===== LOADING SCREEN =====
    var loadingScreen = document.getElementById('loading-screen');

    function hideLoader() {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(function() {
                if (loadingScreen) loadingScreen.style.display = 'none';
            }, 700);
        }
    }

    if (document.readyState === 'complete') {
        setTimeout(hideLoader, 500);
    } else {
        window.addEventListener('load', function() {
            setTimeout(hideLoader, 800);
        });
    }
    setTimeout(hideLoader, 3000);

    // ===== NAVBAR =====
    var navbar = document.getElementById('navbar');
    function updateNavbar() {
        if (!navbar) return;
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    }
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    // ===== MOBILE MENU =====
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobile-menu');
    var mobileClose = document.getElementById('mobile-close');
    var mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (hamburger && mobileMenu) {
        function closeMobileMenu() {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
        function openMobileMenu() {
            hamburger.classList.add('active');
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        hamburger.addEventListener('click', function() {
            mobileMenu.classList.contains('active') ? closeMobileMenu() : openMobileMenu();
        });
        if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
        mobileNavLinks.forEach(function(link) { link.addEventListener('click', closeMobileMenu); });
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) closeMobileMenu();
        });
    }

    // ===== ACTIVE NAV LINK =====
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link');
    function updateActiveNav() {
        var scrollPos = window.scrollY + 120;
        sections.forEach(function(section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) link.classList.add('active');
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ===== SCROLL REVEAL =====
    var revealElements = document.querySelectorAll('.reveal');
    function showAllReveals() {
        revealElements.forEach(function(el) { el.classList.add('active'); });
    }

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });
        revealElements.forEach(function(el) { observer.observe(el); });
        setTimeout(showAllReveals, 2000);
    } else {
        showAllReveals();
    }
    setTimeout(showAllReveals, 4000);

    // ===== ANIMATED COUNTERS =====
    var statNumbers = document.querySelectorAll('.stat-number');
    var countersStarted = false;

    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-target'));
        var duration = 2500;
        var start = performance.now();
        function update(now) {
            var elapsed = now - start;
            var progress = Math.min(elapsed / duration, 1);
            var ease = 1 - Math.pow(1 - progress, 4);
            el.textContent = Math.floor(target * ease).toLocaleString();
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target.toLocaleString();
        }
        requestAnimationFrame(update);
    }

    if ('IntersectionObserver' in window) {
        var statsObs = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    statNumbers.forEach(function(num, i) {
                        setTimeout(function() { animateCounter(num); }, i * 250);
                    });
                    statsObs.disconnect();
                }
            });
        }, { threshold: 0.5 });
        var statsSection = document.querySelector('.statistics');
        if (statsSection) statsObs.observe(statsSection);
    }

    // ===== BACK TO TOP =====
    var backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 600) backToTop.classList.add('visible');
            else backToTop.classList.remove('visible');
        }, { passive: true });
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var navH = navbar ? navbar.offsetHeight : 0;
                window.scrollTo({ top: target.offsetTop - navH - 20, behavior: 'smooth' });
            }
        });
    });

    // ===== TESTIMONIALS SLIDER =====
    var slider = document.getElementById('testimonials-slider');
    var slides = document.querySelectorAll('.testimonial-slide');
    var prevBtn = document.getElementById('slider-prev');
    var nextBtn = document.getElementById('slider-next');
    var dots = document.querySelectorAll('.slider-dot');

    if (slider && slides.length > 0) {
        var currentSlide = 0;
        var autoSlide;

        function goToSlide(index) {
            slides.forEach(function(slide, i) {
                slide.classList.remove('active', 'prev');
                if (i === index) slide.classList.add('active');
                else if (i < index) slide.classList.add('prev');
            });
            dots.forEach(function(dot, i) { dot.classList.toggle('active', i === index); });
            currentSlide = index;
        }
        function nextSlide() { goToSlide((currentSlide + 1) % slides.length); }
        function prevSlide() { goToSlide((currentSlide - 1 + slides.length) % slides.length); }
        function startAuto() { autoSlide = setInterval(nextSlide, 5000); }
        function resetAuto() { clearInterval(autoSlide); startAuto(); }

        if (nextBtn) nextBtn.addEventListener('click', function() { nextSlide(); resetAuto(); });
        if (prevBtn) prevBtn.addEventListener('click', function() { prevSlide(); resetAuto(); });
        dots.forEach(function(dot, i) {
            dot.addEventListener('click', function() { goToSlide(i); resetAuto(); });
        });
        startAuto();

        var sliderWrapper = document.querySelector('.testimonials-slider-wrapper');
        if (sliderWrapper) {
            sliderWrapper.addEventListener('mouseenter', function() { clearInterval(autoSlide); });
            sliderWrapper.addEventListener('mouseleave', startAuto);
        }

        var touchStartX = 0;
        slider.addEventListener('touchstart', function(e) { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
        slider.addEventListener('touchend', function(e) {
            var diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) { diff > 0 ? nextSlide() : prevSlide(); resetAuto(); }
        }, { passive: true });
    }

    // ===== GALLERY LIGHTBOX =====
    var galleryItems = document.querySelectorAll('.gallery-item');
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxCaption = document.getElementById('lightbox-caption');

    if (lightbox && galleryItems.length > 0) {
        var currentImg = 0;
        var galleryArr = Array.from(galleryItems);

        function openLightbox(index) {
            currentImg = index;
            var item = galleryArr[index];
            var img = item.querySelector('img');
            var title = item.querySelector('.gallery-title');
            var tag = item.querySelector('.gallery-tag');
            lightboxImg.src = img.src;
            lightboxCaption.textContent = (tag ? tag.textContent : '') + ((tag && title) ? ' — ' : '') + (title ? title.textContent : '');
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
        function updateImg() {
            var item = galleryArr[currentImg];
            lightboxImg.src = item.querySelector('img').src;
            var title = item.querySelector('.gallery-title');
            var tag = item.querySelector('.gallery-tag');
            lightboxCaption.textContent = (tag ? tag.textContent : '') + ((tag && title) ? ' — ' : '') + (title ? title.textContent : '');
        }
        function nextImg() { currentImg = (currentImg + 1) % galleryArr.length; updateImg(); }
        function prevImg() { currentImg = (currentImg - 1 + galleryArr.length) % galleryArr.length; updateImg(); }

        galleryItems.forEach(function(item, i) { item.addEventListener('click', function() { openLightbox(i); }); });
        document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        document.querySelector('.lightbox-next').addEventListener('click', nextImg);
        document.querySelector('.lightbox-prev').addEventListener('click', prevImg);
        lightbox.addEventListener('click', function(e) { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImg();
            if (e.key === 'ArrowLeft') prevImg();
        });
    }

    // ===== BOOKING FORM =====
    var bookingForm = document.getElementById('booking-form');
    var bookingSuccess = document.getElementById('booking-success');
    var newBookingBtn = document.getElementById('new-booking');
    var dateInput = document.getElementById('booking-date');

    if (dateInput) {
        var today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    if (bookingForm && bookingSuccess) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            bookingForm.style.opacity = '0';
            setTimeout(function() {
                bookingForm.style.display = 'none';
                bookingSuccess.classList.add('active');
            }, 300);
        });
    }
    if (newBookingBtn && bookingForm && bookingSuccess) {
        newBookingBtn.addEventListener('click', function() {
            bookingSuccess.classList.remove('active');
            bookingForm.style.display = 'block';
            setTimeout(function() { bookingForm.style.opacity = '1'; }, 50);
            bookingForm.reset();
        });
    }

    // ===== CONTACT FORM =====
    var contactForm = document.getElementById('contact-form');
    var contactSuccess = document.getElementById('contact-success');
    if (contactForm && contactSuccess) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            contactForm.style.opacity = '0';
            setTimeout(function() {
                contactForm.classList.add('hidden');
                contactSuccess.classList.add('active');
            }, 300);
            setTimeout(function() {
                contactSuccess.classList.remove('active');
                contactForm.classList.remove('hidden');
                contactForm.style.opacity = '1';
                contactForm.reset();
            }, 4000);
        });
    }

    // ===== NEWSLETTER =====
    var newsletterForm = document.getElementById('newsletter-form');
    var newsletterSuccess = document.getElementById('newsletter-success');
    if (newsletterForm && newsletterSuccess) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var input = newsletterForm.querySelector('input');
            if (input && input.value) {
                newsletterSuccess.classList.add('active');
                input.value = '';
                setTimeout(function() { newsletterSuccess.classList.remove('active'); }, 4000);
            }
        });
    }

    // ===== SERVICE BOOKING LINKS =====
    var serviceBookButtons = document.querySelectorAll('.service-book');
    var serviceSelect = document.getElementById('booking-service');
    var serviceMap = {
        'Classic Haircut': 'haircut', 'Skin Fade': 'fade', 'Beard Trim': 'beard',
        'Hot Towel Shave': 'shave', 'Hair Styling': 'styling', 'Kids Haircut': 'kids', 'Premium Grooming': 'premium'
    };
    if (serviceSelect) {
        serviceBookButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var card = this.closest('.service-card');
                if (!card) return;
                var name = card.querySelector('.service-name');
                if (!name) return;
                for (var key in serviceMap) {
                    if (name.textContent.indexOf(key) !== -1) {
                        serviceSelect.value = serviceMap[key];
                        break;
                    }
                }
            });
        });
    }

    // ===== PARALLAX HERO =====
    var heroBg = document.querySelector('.hero-bg');
    if (heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', function() {
            var hero = document.querySelector('.hero');
            if (!hero) return;
            var scrolled = window.scrollY;
            if (scrolled < hero.offsetHeight) heroBg.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
        }, { passive: true });
    }

    // ===== KEYBOARD NAV =====
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    console.log('%c Royal Fade Barbershop ', 'background: linear-gradient(135deg, #C9A84C, #D4B76A); color: #0A0A0A; font-size: 22px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
    console.log('%c Premium Men's Grooming Since 2012 ', 'color: #C9A84C; font-size: 14px;');
})();