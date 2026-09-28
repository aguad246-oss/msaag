// ═══════════════════════════════════════════════════════════
// إعدادات واتساب
// ═══════════════════════════════════════════════════════════

const whatsappNumber = "966549262772";

// ═══════════════════════════════════════════════════════════
// شريط التنقل
// ═══════════════════════════════════════════════════════════

const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinkItems = document.querySelectorAll('.nav-link');

// تأثير التمرير على شريط التنقل
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// قائمة الجوال
mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// إغلاق القائمة عند النقر على رابط
navLinkItems.forEach(link => {
    link.addEventListener('click', (e) => {
        // تحديث الرابط النشط
        navLinkItems.forEach(item => item.classList.remove('active'));
        link.classList.add('active');
        
        // إغلاق القائمة على الجوال
        navLinks.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        
        // التمرير الناعم
        if (link.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// إغلاق القائمة عند النقر خارجها
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    }
});

// ═══════════════════════════════════════════════════════════
// تأثيرات الظهور عند التمرير
// ═══════════════════════════════════════════════════════════

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// مراقبة العناصر
const animatedElements = document.querySelectorAll('.service-card, .why-card, .testimonial-card');
animatedElements.forEach(element => {
    observer.observe(element);
});

// ═══════════════════════════════════════════════════════════
// نظام الحجز
// ═══════════════════════════════════════════════════════════

const modal = document.getElementById('bookingModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const bookingForm = document.getElementById('bookingForm');
const bookButtons = document.querySelectorAll('.btn-book');

// فتح نافذة الحجز
bookButtons.forEach(button => {
    button.addEventListener('click', () => {
        const serviceName = button.getAttribute('data-service');
        const serviceDuration = button.getAttribute('data-duration');
        const servicePrice = button.getAttribute('data-price');
        
        // ملء بيانات الخدمة
        document.getElementById('selectedService').value = serviceName;
        document.getElementById('serviceDuration').value = serviceDuration;
        document.getElementById('servicePrice').value = servicePrice + ' ريال';
        
        // تعيين الحد الأدنى للتاريخ (اليوم)
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('bookingDate').setAttribute('min', today);
        
        // فتح النافذة
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// إغلاق نافذة الحجز
const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    bookingForm.reset();
};

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// إغلاق بمفتاح ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// ═══════════════════════════════════════════════════════════
// معالجة نموذج الحجز وإرسال واتساب
// ═══════════════════════════════════════════════════════════

bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // جمع البيانات
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const selectedService = document.getElementById('selectedService').value;
    const serviceDuration = document.getElementById('serviceDuration').value;
    const servicePrice = document.getElementById('servicePrice').value;
    const bookingDate = document.getElementById('bookingDate').value;
    const bookingTime = document.getElementById('bookingTime').value;
    const bookingNotes = document.getElementById('bookingNotes').value.trim();
    
    // التحقق من البيانات
    if (!customerName || !customerPhone || !bookingDate || !bookingTime) {
        alert('الرجاء ملء جميع الحقول المطلوبة');
        return;
    }
    
    // تنسيق التاريخ
    const dateObj = new Date(bookingDate);
    const formattedDate = dateObj.toLocaleDateString('ar-SA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // تنسيق الوقت
    const timeObj = new Date(`2000-01-01T${bookingTime}`);
    const formattedTime = timeObj.toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    // إنشاء رسالة واتساب
    let whatsappMessage = `مرحباً، أرغب في حجز موعد:\n\n`;
    whatsappMessage += `📝 *الاسم:* ${customerName}\n`;
    whatsappMessage += `📱 *رقم الجوال:* ${customerPhone}\n`;
    whatsappMessage += `💆 *الخدمة:* ${selectedService}\n`;
    whatsappMessage += `⏱ *مدة الجلسة:* ${serviceDuration}\n`;
    whatsappMessage += `💰 *السعر:* ${servicePrice}\n`;
    whatsappMessage += `📅 *التاريخ:* ${formattedDate}\n`;
    whatsappMessage += `🕐 *الوقت:* ${formattedTime}\n`;
    
    if (bookingNotes) {
        whatsappMessage += `📋 *ملاحظات:* ${bookingNotes}\n`;
    }
    
    whatsappMessage += `\nشكراً لكم 🌸`;
    
    // تشفير الرسالة
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // رابط واتساب
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // فتح واتساب
    window.open(whatsappURL, '_blank');
    
    // إغلاق النافذة وإعادة تعيين النموذج
    setTimeout(() => {
        closeModal();
    }, 500);
});

// ═══════════════════════════════════════════════════════════
// زر واتساب العائم
// ═══════════════════════════════════════════════════════════

const whatsappFloat = document.getElementById('whatsappFloat');

whatsappFloat.addEventListener('click', (e) => {
    e.preventDefault();
    const defaultMessage = encodeURIComponent('مرحباً، أود الاستفسار عن خدمات المساج والاسترخاء 🌸');
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;
    window.open(whatsappURL, '_blank');
});

// ═══════════════════════════════════════════════════════════
// زر التواصل في قسم التواصل
// ═══════════════════════════════════════════════════════════

const whatsappContactBtn = document.getElementById('whatsappContactBtn');

whatsappContactBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const contactMessage = encodeURIComponent('مرحباً، أود التواصل معكم 🌸');
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${contactMessage}`;
    window.open(whatsappURL, '_blank');
});

// ═══════════════════════════════════════════════════════════
// التمرير الناعم لجميع الروابط الداخلية
// ═══════════════════════════════════════════════════════════

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ═══════════════════════════════════════════════════════════
// تحديث الرابط النشط عند التمرير
// ═══════════════════════════════════════════════════════════

const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinkItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ═══════════════════════════════════════════════════════════
// تحسين الأداء - Debounce للتمرير
// ═══════════════════════════════════════════════════════════

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ═══════════════════════════════════════════════════════════
// تحميل الصور الكسولة (Lazy Loading)
// ═══════════════════════════════════════════════════════════

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
}

// ═══════════════════════════════════════════════════════════
// تأثيرات إضافية عند التحميل
// ═══════════════════════════════════════════════════════════

window.addEventListener('load', () => {
    // إخفاء شاشة التحميل إذا وجدت
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
    }
    
    // تفعيل الأنيميشن للعناصر المرئية
    const visibleElements = document.querySelectorAll('.fade-in, .fade-in-delay, .fade-in-delay-2');
    visibleElements.forEach(element => {
        element.style.opacity = '1';
    });
});

// ═══════════════════════════════════════════════════════════
// منع إرسال النموذج أكثر من مرة
// ═══════════════════════════════════════════════════════════

let isSubmitting = false;

bookingForm.addEventListener('submit', (e) => {
    if (isSubmitting) {
        e.preventDefault();
        return;
    }
    isSubmitting = true;
    
    setTimeout(() => {
        isSubmitting = false;
    }, 3000);
});

// ═══════════════════════════════════════════════════════════
// تنسيق حقل رقم الهاتف تلقائياً
// ═══════════════════════════════════════════════════════════

const phoneInput = document.getElementById('customerPhone');

phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) {
        value = value.slice(0, 10);
    }
    e.target.value = value;
});

// ═══════════════════════════════════════════════════════════
// رسائل التحقق المخصصة
// ═══════════════════════════════════════════════════════════

const inputs = bookingForm.querySelectorAll('input[required], textarea[required]');

inputs.forEach(input => {
    input.addEventListener('invalid', (e) => {
        e.preventDefault();
        if (input.validity.valueMissing) {
            input.setCustomValidity('هذا الحقل مطلوب');
        } else if (input.validity.patternMismatch) {
            input.setCustomValidity('الرجاء إدخال رقم جوال صحيح (10 أرقام)');
        }
    });
    
    input.addEventListener('input', () => {
        input.setCustomValidity('');
    });
});

// ═══════════════════════════════════════════════════════════
// تحسين تجربة المستخدم - Focus على أول حقل عند فتح النموذج
// ═══════════════════════════════════════════════════════════

const firstInput = document.getElementById('customerName');

bookButtons.forEach(button => {
    button.addEventListener('click', () => {
        setTimeout(() => {
            firstInput.focus();
        }, 300);
    });
});

// ═══════════════════════════════════════════════════════════
// تحديث السنة في الفوتر تلقائياً
// ═══════════════════════════════════════════════════════════

const currentYear = new Date().getFullYear();
const yearElement = document.querySelector('.footer-bottom p');
if (yearElement) {
    yearElement.innerHTML = `&copy; ${currentYear} Massage & Relax. جميع الحقوق محفوظة.`;
}

// ═══════════════════════════════════════════════════════════
// إضافة تأثير Parallax خفيف للـ Hero
// ═══════════════════════════════════════════════════════════

const hero = document.querySelector('.hero');

window.addEventListener('scroll', debounce(() => {
    const scrolled = window.scrollY;
    if (hero && scrolled < window.innerHeight) {
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
}, 10));

// ═══════════════════════════════════════════════════════════
// عداد الزوار (اختياري - يمكن إضافته لاحقاً)
// ═══════════════════════════════════════════════════════════

function incrementVisitorCount() {
    let count = localStorage.getItem('visitorCount') || 0;
    count = parseInt(count) + 1;
    localStorage.setItem('visitorCount', count);
    console.log(`عدد الزيارات: ${count}`);
}

incrementVisitorCount();

// ═══════════════════════════════════════════════════════════
// تتبع الأحداث (يمكن ربطه مع Google Analytics لاحقاً)
// ═══════════════════════════════════════════════════════════

function trackEvent(category, action, label) {
    console.log(`Event: ${category} - ${action} - ${label}`);
    // يمكن إضافة كود Google Analytics هنا
    // gtag('event', action, {
    //     'event_category': category,
    //     'event_label': label
    // });
}

// تتبع نقرات أزرار الحجز
bookButtons.forEach(button => {
    button.addEventListener('click', () => {
        const serviceName = button.getAttribute('data-service');
        trackEvent('Booking', 'Click', serviceName);
    });
});

// تتبع إرسال نموذج الحجز
bookingForm.addEventListener('submit', () => {
    const serviceName = document.getElementById('selectedService').value;
    trackEvent('Booking', 'Submit', serviceName);
});

// تتبع نقرات زر واتساب
whatsappFloat.addEventListener('click', () => {
    trackEvent('WhatsApp', 'Click', 'Floating Button');
});

// ═══════════════════════════════════════════════════════════
// رسالة ترحيب في Console
// ═══════════════════════════════════════════════════════════

console.log('%c🌸 مرحباً بك في Massage & Relax 🌸', 'color: #d4a574; font-size: 20px; font-weight: bold;');
console.log('%cنحن سعداء بزيارتك لموقعنا!', 'color: #8b9d83; font-size: 14px;');
console.log('%cللتواصل: 0549262772', 'color: #25d366; font-size: 14px;');

// ═══════════════════════════════════════════════════════════
// نهاية الكود
// ═══════════════════════════════════════════════════════════