/* ============================================================
   منصة وعي الشباب BBA - Main Application JavaScript
   Production-Ready Frontend Logic
   ============================================================ */

// ============================================================
// 1. INITIALIZATION & MUNICIPALITIES DATA
// ============================================================

// List of 34 municipalities in Bordj Bou Arreridj (Alphabetized)
const MUNICIPALITIES = [
    'أولاد براهم',
    'أولاد دحمان',
    'أولاد سيدي إبراهيم',
    'العناصر',
    'العش',
    'الحمادية',
    'الماين',
    'الرابطة',
    'الرفراف',
    'الياشير',
    'بئر قصد علي',
    'برج الغدير',
    'برج بوعريريج',
    'برج زمورة',
    'تاسمرت',
    'تفرق',
    'تقلعيت',
    'تكستار',
    'ثنية النصر',
    'جعافرة',
    'حرازة',
    'حسناوة',
    'خليل',
    'عين تاغروت',
    'عين تسرة',
    'غيلاسة',
    'القصور',
    'القلة',
    'المهير',
    'المنصورة',
    'مجانة',
    'رأس الوادي',
    'سيدي امبارك',
    'بن داود'
];

// Sample Articles Data for Awareness Section
const ARTICLES = [
    {
        id: 1,
        title: 'مخاطر المخدرات على الصحة النفسية',
        category: 'توعية صحية',
        excerpt: 'تعرف على التأثيرات الخطيرة للمخدرات على الدماغ والصحة النفسية للشباب والمراهقين.',
        date: '2026-01-15',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%230b101b" width="400" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23D4AF37" font-size="24" font-weight="bold"%3Eالصحة النفسية%3C/text%3E%3C/svg%3E'
    },
    {
        id: 2,
        title: 'برامج الوقاية من الإدمان',
        category: 'وقاية',
        excerpt: 'اكتشف البرامج الفعالة والاستراتيجيات المثبتة لمكافحة الإدمان والوقاية منه في المجتمع.',
        date: '2026-01-12',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%230b101b" width="400" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%2310b981" font-size="24" font-weight="bold"%3Eالوقاية%3C/text%3E%3C/svg%3E'
    },
    {
        id: 3,
        title: 'دور الأسرة في الحماية من المخدرات',
        category: 'تربية أسرية',
        excerpt: 'كيف يمكن للأسرة أن تلعب دوراً حاسماً في حماية أبنائهم من مخاطر الإدمان والمواد المؤثرة.',
        date: '2026-01-10',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%230b101b" width="400" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23f59e0b" font-size="24" font-weight="bold"%3Eالأسرة%3C/text%3E%3C/svg%3E'
    },
    {
        id: 4,
        title: 'الدعم النفسي والاجتماعي للمتعافين',
        category: 'دعم معافين',
        excerpt: 'معلومات شاملة عن آليات الدعم المتاحة والخدمات المتخصصة للأشخاص في رحلة التعافي من الإدمان.',
        date: '2026-01-08',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%230b101b" width="400" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%2310b981" font-size="24" font-weight="bold"%3Eالدعم%3C/text%3E%3C/svg%3E'
    },
    {
        id: 5,
        title: 'التطبيقات الحديثة في العلاج السلوكي',
        category: 'علاج',
        excerpt: 'استعرض أحدث التقنيات والتطبيقات العلاجية المستخدمة في برامج مكافحة الإدمان عالمياً.',
        date: '2026-01-05',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%230b101b" width="400" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23D4AF37" font-size="24" font-weight="bold"%3Eالعلاج%3C/text%3E%3C/svg%3E'
    },
    {
        id: 6,
        title: 'قانون مكافحة الإدمان والعقوبات',
        category: 'قانون',
        excerpt: 'تعريف شامل بالأطر القانونية والعقوبات المتعلقة بالمخدرات والمواد المؤثرة على الحالة النفسية.',
        date: '2026-01-02',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%230b101b" width="400" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23ef4444" font-size="24" font-weight="bold"%3Eالقانون%3C/text%3E%3C/svg%3E'
    }
];

// ============================================================
// 2. INITIALIZATION FUNCTION
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeMunicipalities();
    loadArticles();
    setupEventListeners();
    setupNavigation();
    console.log('✓ Application initialized successfully');
});

// ============================================================
// 3. MUNICIPALITIES DROPDOWN SETUP
// ============================================================

function initializeMunicipalities() {
    const municipalitySelect = document.getElementById('municipality');
    
    if (municipalitySelect) {
        MUNICIPALITIES.forEach(municipality => {
            const option = document.createElement('option');
            option.value = municipality;
            option.textContent = municipality;
            municipalitySelect.appendChild(option);
        });
    }
}

// ============================================================
// 4. ARTICLES RENDERING
// ============================================================

function loadArticles() {
    const articlesGrid = document.getElementById('articlesGrid');
    
    if (articlesGrid) {
        articlesGrid.innerHTML = ARTICLES.map(article => `
            <article class="article-card">
                <img src="${article.image}" alt="${article.title}" class="article-image">
                <div class="article-content">
                    <span class="article-category">${article.category}</span>
                    <h3 class="article-title">${article.title}</h3>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <div class="article-footer">
                        <time>${formatDate(article.date)}</time>
                        <a href="#" class="read-more">اقرأ المزيد →</a>
                    </div>
                </div>
            </article>
        `).join('');
    }
}

// ============================================================
// 5. SECURE CODE GENERATION
// ============================================================

function generateSecureCode() {
    try {
        // Generate random bytes using crypto API
        const array = new Uint8Array(6);
        window.crypto.getRandomValues(array);
        
        // Convert to hex and format as BBA-XXXX-XXXX
        const hex = Array.from(array)
            .map(b => b.toString(16).padStart(2, '0').toUpperCase())
            .join('');
        
        const code = `BBA-${hex.substring(0, 4)}-${hex.substring(4, 8)}`;
        
        // Display the code
        const codeElement = document.getElementById('secureCode');
        const codeDisplayWrapper = document.getElementById('codeDisplayWrapper');
        const generateBtn = document.getElementById('generateCodeBtn');
        
        if (codeElement && codeDisplayWrapper) {
            codeElement.textContent = code;
            codeDisplayWrapper.style.display = 'block';
            generateBtn.style.display = 'none';
            
            // Show success toast
            showToast('تم إنشاء رمز التتبع بنجاح!', 'success');
        }
    } catch (error) {
        console.error('Error generating secure code:', error);
        showToast('حدث خطأ في إنشاء الرمز. يرجى المحاولة مجدداً.', 'error');
    }
}

// ============================================================
// 6. COPY TO CLIPBOARD
// ============================================================

function copyToClipboard() {
    const codeElement = document.getElementById('secureCode');
    const code = codeElement.textContent;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code)
            .then(() => {
                showToast('تم نسخ الرمز بنجاح!', 'success');
                
                // Visual feedback on button
                const copyBtn = document.getElementById('copyCodeBtn');
                const originalInner = copyBtn.innerHTML;
                copyBtn.innerHTML = '✓';
                copyBtn.style.background = 'var(--color-success)';
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalInner;
                    copyBtn.style.background = '';
                }, 2000);
            })
            .catch(() => {
                // Fallback for older browsers
                copyToClipboardFallback(code);
            });
    } else {
        // Fallback for older browsers
        copyToClipboardFallback(code);
    }
}

function copyToClipboardFallback(code) {
    const textarea = document.createElement('textarea');
    textarea.value = code;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showToast('تم نسخ الرمز بنجاح!', 'success');
    } catch (error) {
        showToast('فشل نسخ الرمز. يرجى المحاولة يدوياً.', 'error');
    }
    
    document.body.removeChild(textarea);
}

// ============================================================
// 7. FORM SUBMISSION
// ============================================================

function submitVolunteerForm(event) {
    event.preventDefault();
    
    const form = document.getElementById('volunteerForm');
    const submitBtn = form.querySelector('.btn-submit');
    
    // Disable button during submission
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'جاري الإرسال...';
    
    // Collect form data
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        age: document.getElementById('age').value,
        municipality: document.getElementById('municipality').value,
        membershipType: document.querySelector('input[name="membershipType"]:checked').value,
        motivation: document.getElementById('motivation').value,
        timestamp: new Date().toISOString()
    };
    
    // Simulate API call (in production, this would send to a backend)
    setTimeout(() => {
        // Log data (in production, would be sent to server)
        console.log('Volunteer Form Submitted:', formData);
        
        // Store in localStorage for admin panel to retrieve
        let submissions = JSON.parse(localStorage.getItem('volunteerSubmissions') || '[]');
        submissions.push({
            ...formData,
            id: Date.now(),
            status: 'قيد الانتظار',
            submittedAt: new Date().toLocaleString('ar-DZ')
        });
        localStorage.setItem('volunteerSubmissions', JSON.stringify(submissions));
        
        // Show success message
        showToast('شكراً لك! تم استقبال طلب التطوع بنجاح. سيتم التواصل معك قريباً.', 'success');
        
        // Reset form
        form.reset();
        
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }, 1500);
}

// ============================================================
// 8. TOAST NOTIFICATIONS
// ============================================================

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutLeft 0.4s ease-out forwards';
        setTimeout(() => {
            container.removeChild(toast);
        }, 400);
    }, 4000);
}

// ============================================================
// 9. NAVIGATION & SCROLLING
// ============================================================

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link:not(.admin-link)');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const target = this.getAttribute('href');
            if (target.startsWith('#')) {
                e.preventDefault();
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Close mobile menu if open
                const menu = document.getElementById('navbarMenu');
                const toggle = document.getElementById('menuToggle');
                if (menu && menu.classList.contains('active')) {
                    menu.classList.remove('active');
                    toggle.classList.remove('active');
                }
                
                // Scroll to section
                scrollToSection(target.substring(1));
            }
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.navbar').offsetHeight;
        const offset = section.offsetTop - headerHeight;
        window.scrollTo({
            top: offset,
            behavior: 'smooth'
        });
        
        // Update active nav link
        const navLinks = document.querySelectorAll('.nav-link:not(.admin-link)');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// ============================================================
// 10. MOBILE MENU TOGGLE
// ============================================================

function setupEventListeners() {
    const menuToggle = document.getElementById('menuToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    
    if (menuToggle && navbarMenu) {
        menuToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
}

// ============================================================
// 11. MEMBERSHIP TYPE SELECTOR STYLING
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    const radioButtons = document.querySelectorAll('input[name="membershipType"]');
    
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            const options = document.querySelectorAll('.membership-option');
            options.forEach(opt => {
                opt.style.transition = 'all 0.3s ease-out';
            });
        });
    });
});

// ============================================================
// 12. UTILITY FUNCTIONS
// ============================================================

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-DZ', options);
}

// ============================================================
// 13. SMOOTH SCROLL BEHAVIOR ON NAVIGATION
// ============================================================

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link:not(.admin-link)');
    
    // Get all sections
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + navbar.offsetHeight + 50;
    
    sections.forEach(section => {
        if (section.offsetTop <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition) {
            const sectionId = section.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ============================================================
// 14. INITIALIZATION MESSAGES
// ============================================================

console.log('%c✓ منصة وعي الشباب BBA Platform Loaded', 'color: #D4AF37; font-size: 16px; font-weight: bold;');
console.log('%c برنامج قادة الشباب الجزائريين - Dz Young Leaders', 'color: #10b981; font-size: 12px;');
