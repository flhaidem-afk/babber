/**
 * The Gentlemen's Den - Premium Barber Shop
 * Complete JavaScript Application
 */

const GentlemensDen = {
    // State
    state: {
        currentTestimonial: 0,
        testimonialCount: 4,
        autoSlideInterval: null,
        navbarHeight: 80
    },

    // ============================================
    // Initialization
    // ============================================
    init() {
        this.initLoading();
        this.initNavbar();
        this.initMobileMenu();
        this.initSmoothScroll();
        this.initActiveNav();
        this.initScrollReveal();
        this.initBackToTop();
        this.initCounters();
        this.initTestimonials();
        this.initGalleryFilter();
        this.initBookingForm();
        this.initBusinessHours();
        this.initModal();
    },

    // ============================================
    // Loading Screen
    // ============================================
    initLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 2000);
        });

        // Fallback if load event already fired
        if (document.readyState === 'complete') {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 2000);
        }
    },

    // ============================================
    // Navbar
    // ============================================
    initNavbar() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Add/remove scrolled class
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show on scroll direction (optional)
            if (currentScroll > lastScroll && currentScroll > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
        });

        navbar.style.transition = 'transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease';
    },

    // ============================================
    // Mobile Menu
    // ============================================
    initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileLinks = document.querySelectorAll('.mobile-link');

        if (!hamburger || !mobileMenu) return;

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    },

    // ============================================
    // Smooth Scroll
    // ============================================
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);

                if (target) {
                    const offsetTop = target.offsetTop - this.state.navbarHeight;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }.bind(this));
        });
    },

    // ============================================
    // Active Navigation Highlighting
    // ============================================
    initActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        });

        sections.forEach(section => observer.observe(section));
    },

    // ============================================
    // Scroll Reveal Animations
    // ============================================
    initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    },

    // ============================================
    // Back to Top Button
    // ============================================
    initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    },

    // ============================================
    // Animated Counters
    // ============================================
    initCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'));
                    const suffix = el.textContent.includes('%') ? '%' : '';
                    const prefix = el.textContent.includes('+') ? '+' : '';
                    this.animateCounter(el, target, 2000, prefix, suffix);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    },

    animateCounter(element, target, duration, prefix, suffix) {
        prefix = prefix || '';
        suffix = suffix || '';
        const startTime = performance.now();
        const start = 0;

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * eased);
            element.textContent = prefix + current.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    },

    // ============================================
    // Testimonials Slider
    // ============================================
    initTestimonials() {
        const track = document.querySelector('.testimonials-track');
        const prevBtn = document.querySelector('.testimonial-prev');
        const nextBtn = document.querySelector('.testimonial-next');
        const dots = document.querySelectorAll('.testimonials-dots .dot');

        if (!track || !prevBtn || !nextBtn) return;

        const updateSlider = () => {
            const cardWidth = track.children[0].offsetWidth;
            track.style.transform = 'translateX(-' + (this.state.currentTestimonial * cardWidth) + 'px)';

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === this.state.currentTestimonial);
            });
        };

        const nextSlide = () => {
            this.state.currentTestimonial = (this.state.currentTestimonial + 1) % this.state.testimonialCount;
            updateSlider();
        };

        const prevSlide = () => {
            this.state.currentTestimonial = (this.state.currentTestimonial - 1 + this.state.testimonialCount) % this.state.testimonialCount;
            updateSlider();
        };

        nextBtn.addEventListener('click', () => {
            nextSlide();
            this.resetAutoSlide();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            this.resetAutoSlide();
        });

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                this.state.currentTestimonial = i;
                updateSlider();
                this.resetAutoSlide();
            });
        });

        // Auto-slide
        this.startAutoSlide();

        // Handle resize
        window.addEventListener('resize', () => {
            updateSlider();
        });
    },

    startAutoSlide() {
        this.state.autoSlideInterval = setInterval(() => {
            this.state.currentTestimonial = (this.state.currentTestimonial + 1) % this.state.testimonialCount;
            const track = document.querySelector('.testimonials-track');
            if (track) {
                const cardWidth = track.children[0].offsetWidth;
                track.style.transform = 'translateX(-' + (this.state.currentTestimonial * cardWidth) + 'px)';
            }
            const dots = document.querySelectorAll('.testimonials-dots .dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === this.state.currentTestimonial);
            });
        }, 5000);
    },

    resetAutoSlide() {
        clearInterval(this.state.autoSlideInterval);
        this.startAutoSlide();
    },

    // ============================================
    // Gallery Filter
    // ============================================
    initGalleryFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter items
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeIn 0.5s ease';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    },

    // ============================================
    // Booking Form Validation
    // ============================================
    initBookingForm() {
        const form = document.getElementById('bookingForm');
        if (!form) return;

        // Set minimum date to today
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (this.validateForm(form)) {
                this.showSuccessModal();
                form.reset();
            }
        });

        // Real-time validation on blur
        const inputs = form.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearError(input);
            });
        });
    },

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('input[required], select[required]');

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Validate email if provided
        const email = form.querySelector('#email');
        if (email && email.value && !this.isValidEmail(email.value)) {
            this.showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate phone
        const phone = form.querySelector('#phone');
        if (phone && phone.value) {
            const phoneDigits = phone.value.replace(/\D/g, '');
            if (phoneDigits.length < 10) {
                this.showError(phone, 'Please enter a valid phone number');
                isValid = false;
            }
        }

        return isValid;
    },

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name');

        if (!value) {
            this.showError(field, this.getFieldLabel(fieldName) + ' is required');
            return false;
        }

        // Phone validation
        if (fieldName === 'phone') {
            const digits = value.replace(/\D/g, '');
            if (digits.length < 10) {
                this.showError(field, 'Please enter a valid phone number');
                return false;
            }
        }

        this.clearError(field);
        return true;
    },

    getFieldLabel(fieldName) {
        const labels = {
            firstName: 'First name',
            lastName: 'Last name',
            phone: 'Phone number',
            service: 'Service',
            date: 'Date',
            time: 'Time'
        };
        return labels[fieldName] || 'This field';
    },

    showError(field, message) {
        field.classList.add('error');
        const errorEl = document.getElementById(field.id + 'Error');
        if (errorEl) {
            errorEl.textContent = message;
        }
    },

    clearError(field) {
        field.classList.remove('error');
        const errorEl = document.getElementById(field.id + 'Error');
        if (errorEl) {
            errorEl.textContent = '';
        }
    },

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    // ============================================
    // Business Hours Status
    // ============================================
    initBusinessHours() {
        this.updateBusinessStatus();
        // Update every minute
        setInterval(() => this.updateBusinessStatus(), 60000);
    },

    updateBusinessStatus() {
        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const currentTime = hour + minute / 60;

        const statusIndicator = document.getElementById('statusIndicator');
        const statusText = document.getElementById('statusText');
        const scheduleItems = document.querySelectorAll('.schedule-item');

        if (!statusIndicator || !statusText) return;

        // Highlight current day
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const currentDay = days[day];

        scheduleItems.forEach(item => {
            item.classList.remove('current-day');
            if (item.getAttribute('data-day') === currentDay) {
                item.classList.add('current-day');
            }
        });

        // Check if open
        let isOpen = false;
        let openTime, closeTime;

        switch (day) {
            case 0: // Sunday
                isOpen = false;
                break;
            case 1: case 2: case 3: // Mon-Wed
                openTime = 9; closeTime = 19;
                isOpen = currentTime >= openTime && currentTime < closeTime;
                break;
            case 4: case 5: // Thu-Fri
                openTime = 9; closeTime = 20;
                isOpen = currentTime >= openTime && currentTime < closeTime;
                break;
            case 6: // Saturday
                openTime = 8; closeTime = 18;
                isOpen = currentTime >= openTime && currentTime < closeTime;
                break;
        }

        if (isOpen) {
            statusIndicator.className = 'status-indicator open';
            statusText.textContent = 'We are Open Now';
            statusText.style.color = 'var(--color-success)';
        } else {
            statusIndicator.className = 'status-indicator closed';
            statusText.textContent = 'We are Closed Now';
            statusText.style.color = 'var(--color-danger)';
        }
    },

    // ============================================
    // Success Modal
    // ============================================
    initModal() {
        const modal = document.getElementById('successModal');
        const modalClose = document.getElementById('modalClose');

        if (!modal || !modalClose) return;

        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    },

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.add('active');
        }
    }
};

// ============================================
// Global Event Listeners
// ============================================

// Add fadeIn animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    GentlemensDen.init();
});

// Handle window resize for responsive slider
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const track = document.querySelector('.testimonials-track');
        if (track && track.children.length > 0) {
            const cardWidth = track.children[0].offsetWidth;
            const currentIndex = GentlemensDen.state.currentTestimonial;
            track.style.transform = 'translateX(-' + (currentIndex * cardWidth) + 'px)';
        }
    }, 250);
});