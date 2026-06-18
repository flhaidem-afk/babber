// script.js
class LocalBusiness {
    constructor() {
        this.currentStep = 1;
        this.bookingData = {};
        this.init();
    }

    init() {
        this.setupPreloader();
        this.setupNavbar();
        this.setupScrollEffects();
        this.setupCounters();
        this.setupGalleryFilter();
        this.setupForm();
        this.setMinDate();
    }

    setupPreloader() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.getElementById('preloader').classList.add('hidden');
            }, 1800);
        });
    }

    setupNavbar() {
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile toggle
        const mobileToggle = document.getElementById('mobileToggle');
        const navLinks = document.getElementById('navLinks');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                navLinks.classList.toggle('mobile-open');
            });
        }

        // Active nav link on scroll
        const sections = document.querySelectorAll('section[id]');
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    setupScrollEffects() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.service-card, .team-card, .gallery-item, .testimonial-card, .b-feature').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }

    setupCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target);
                    this.animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element, target) {
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeProgress);
            
            element.textContent = current.toLocaleString() + (target > 1000 ? '+' : '');
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    setupGalleryFilter() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const filter = e.target.dataset.filter;
                document.querySelectorAll('.gallery-item').forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    setupForm() {
        const form = document.getElementById('bookingForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitBooking();
            });
        }
    }

    setMinDate() {
        const dateInput = document.getElementById('bookDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
            dateInput.value = today;
        }
    }

    nextStep(step) {
        // Update booking data
        if (step === 2) {
            const service = document.querySelector('input[name="service"]:checked');
            if (service) this.bookingData.service = service.value;
        } else if (step === 3) {
            const barber = document.querySelector('input[name="barber"]:checked');
            if (barber) this.bookingData.barber = barber.value;
        } else if (step === 4) {
            const date = document.getElementById('bookDate').value;
            const time = document.querySelector('input[name="time"]:checked');
            if (date) this.bookingData.date = date;
            if (time) this.bookingData.time = time.value;
            this.updateSummary();
        }

        // Hide current step
        document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
        
        // Show next step
        const nextStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
        if (nextStepEl) {
            nextStepEl.classList.add('active');
            this.currentStep = step;
        }
    }

    prevStep(step) {
        document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
        const prevStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
        if (prevStepEl) {
            prevStepEl.classList.add('active');
            this.currentStep = step;
        }
    }

    updateSummary() {
        const summaryEl = document.getElementById('bookingSummary');
        if (!summaryEl) return;

        const services = {
            'haircut': { name: 'Classic Haircut', price: 35 },
            'beard': { name: 'Beard Sculpting', price: 25 },
            'shave': { name: 'Hot Towel Shave', price: 45 },
            'package': { name: 'The Full Package', price: 95 }
        };

        const barbers = {
            'marcus': 'Marcus Johnson',
            'david': 'David Chen',
            'james': 'James Wilson',
            'carlos': 'Carlos Rivera'
        };

        const service = services[this.bookingData.service] || services['haircut'];
        const barber = barbers[this.bookingData.barber] || 'Any Available';

        summaryEl.innerHTML = `
            <h4>Booking Summary</h4>
            <div class="summary-row">
                <span>Service</span>
                <span>${service.name}</span>
            </div>
            <div class="summary-row">
                <span>Barber</span>
                <span>${barber}</span>
            </div>
            <div class="summary-row">
                <span>Date</span>
                <span>${this.bookingData.date || 'Not selected'}</span>
            </div>
            <div class="summary-row">
                <span>Time</span>
                <span>${this.bookingData.time || 'Not selected'}</span>
            </div>
            <div class="summary-row">
                <span>Total</span>
                <span>$${service.price}.00</span>
            </div>
        `;
    }

    submitBooking() {
        const btn = document.querySelector('.btn-confirm');
        const btnText = btn.querySelector('.btn-text');
        const btnLoader = btn.querySelector('.btn-loader');

        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
        btn.disabled = true;

        // Collect final data
        this.bookingData.name = document.getElementById('bookName').value;
        this.bookingData.phone = document.getElementById('bookPhone').value;
        this.bookingData.email = document.getElementById('bookEmail').value;

        setTimeout(() => {
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
            btn.disabled = false;

            this.showSuccessModal();
            document.getElementById('bookingForm').reset();
            this.setMinDate();
            this.nextStep(1);
        }, 2000);
    }

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        const details = document.getElementById('modalDetails');
        
        const services = {
            'haircut': 'Classic Haircut',
            'beard': 'Beard Sculpting',
            'shave': 'Hot Towel Shave',
            'package': 'The Full Package'
        };

        const barbers = {
            'marcus': 'Marcus Johnson',
            'david': 'David Chen',
            'james': 'James Wilson',
            'carlos': 'Carlos Rivera'
        };

        details.innerHTML = `
            <div class="modal-detail-row">
                <span>Service</span>
                <span>${services[this.bookingData.service] || 'Classic Haircut'}</span>
            </div>
            <div class="modal-detail-row">
                <span>Barber</span>
                <span>${barbers[this.bookingData.barber] || 'Any Available'}</span>
            </div>
            <div class="modal-detail-row">
                <span>Date & Time</span>
                <span>${this.bookingData.date} at ${this.bookingData.time}</span>
            </div>
        `;

        modal.classList.add('open');
    }
}

// Global functions
function scrollToBooking() {
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}

function scrollToServices() {
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
}

function selectService(service) {
    scrollToBooking();
    setTimeout(() => {
        const radio = document.querySelector(`input[name="service"][value="${service}"]`);
        if (radio) {
            radio.checked = true;
            // Highlight the option
            document.querySelectorAll('.service-option .option-content').forEach(el => {
                el.style.borderColor = '';
                el.style.background = '';
            });
            radio.nextElementSibling.style.borderColor = 'var(--primary)';
            radio.nextElementSibling.style.background = 'rgba(249, 115, 22, 0.05)';
        }
    }, 500);
}

function nextStep(step) {
    window.localBusiness.nextStep(step);
}

function prevStep(step) {
    window.localBusiness.prevStep(step);
}

function closeModal() {
    document.getElementById('successModal').classList.remove('open');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.localBusiness = new LocalBusiness();
});