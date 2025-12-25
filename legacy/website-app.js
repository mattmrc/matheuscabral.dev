// Portfolio data
const portfolioData = {
  projects: [
    {
      title: "Real-time Data Pipeline",
      category: "infrastructure",
      description: "Built a scalable real-time data pipeline processing 100M+ events daily using Kafka, Spark Streaming, and AWS infrastructure.",
      technologies: ["Apache Kafka", "Spark Streaming", "AWS", "Python", "Docker"],
      impact: "Reduced data processing latency by 90% and improved system reliability to 99.9% uptime.",
      github: "#",
      demo: "#"
    },
    {
      title: "Cloud Data Lake Migration",
      category: "architecture",
      description: "Led migration of legacy data warehouse to cloud-native data lake architecture, improving scalability and reducing costs.",
      technologies: ["AWS S3", "AWS Glue", "Apache Spark", "Terraform", "SQL"],
      impact: "Reduced infrastructure costs by 60% while improving query performance by 3x.",
      github: "#",
      demo: "#"
    },
    {
      title: "ML Feature Pipeline",
      category: "machine-learning",
      description: "Designed and implemented automated feature engineering pipeline for machine learning models in production.",
      technologies: ["Apache Airflow", "Python", "scikit-learn", "PostgreSQL", "Redis"],
      impact: "Accelerated model deployment time from weeks to hours with automated feature validation.",
      github: "#",
      demo: "#"
    },
    {
      title: "ETL Framework",
      category: "tools",
      description: "Created reusable ETL framework with automatic schema detection and data quality validation.",
      technologies: ["Python", "Pandas", "Great Expectations", "Apache Spark", "Kubernetes"],
      impact: "Reduced ETL development time by 70% across multiple projects with built-in quality checks.",
      github: "#",
      demo: "#"
    }
  ],
  
  blogArticles: [
    {
      title: "Building Resilient Data Pipelines: Lessons from Production",
      category: "Engineering",
      date: "2024-12-15",
      excerpt: "Key strategies for creating robust data pipelines that can handle failures gracefully and maintain data quality at scale.",
      readTime: "8 min read"
    },
    {
      title: "The Modern Data Engineering Stack: Tools and Technologies in 2025",
      category: "Technology",
      date: "2024-12-01",
      excerpt: "A comprehensive overview of the latest tools and technologies shaping the modern data engineering landscape.",
      readTime: "12 min read"
    },
    {
      title: "Data Quality Testing: A Comprehensive Guide",
      category: "Best Practices",
      date: "2024-11-20",
      excerpt: "How to implement comprehensive data quality testing in large-scale data pipelines using modern tools and frameworks.",
      readTime: "10 min read"
    }
  ],
  
  experience: [
    {
      title: "Senior Data Engineer",
      company: "TechCorp Inc.",
      duration: "2022 - Present",
      description: "Lead data engineering initiatives for enterprise-scale applications serving millions of users daily."
    },
    {
      title: "Data Engineer",
      company: "DataFlow Solutions",
      duration: "2020 - 2022",
      description: "Built data infrastructure from ground up, establishing best practices for data pipeline development."
    },
    {
      title: "Junior Data Analyst",
      company: "Analytics Pro",
      duration: "2019 - 2020",
      description: "Developed analytical solutions and reports for business stakeholders using SQL and Python."
    }
  ]
};

// DOM Elements
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const navIndicator = document.getElementById('nav-indicator');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const typingText = document.getElementById('typing-text');
const portfolioGrid = document.getElementById('portfolio-grid');
const blogGrid = document.getElementById('blog-grid');
const timeline = document.getElementById('timeline');
const contactForm = document.getElementById('contact-form');

// Theme Management
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    themeToggle.addEventListener('click', () => this.toggleTheme());
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-color-scheme', theme);
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }
}

// Navigation Manager
class NavigationManager {
  constructor() {
    this.sections = document.querySelectorAll('section[id]');
    this.navLinks = Array.from(navLinks);
    this.indicator = navIndicator;
    this.isScrolling = false;
    this.init();
  }

  init() {
    this.setupSmoothScrolling();
    this.setupScrollSpy();
    this.setupMobileMenu();
    this.setupNavbarScroll();
    this.updateActiveSection();
  }

  setupSmoothScrolling() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          navMenu.classList.remove('active');
          mobileMenuToggle.classList.remove('active');
        }
      });
    });
  }

  setupScrollSpy() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  updateActiveSection() {
    const scrollPos = window.scrollY + 100;
    let currentSection = '';

    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    // Update active nav link and indicator
    this.navLinks.forEach(link => {
      const section = link.getAttribute('data-section');
      link.classList.toggle('active', section === currentSection);
    });

    this.updateIndicator(currentSection);
  }

  updateIndicator(activeSection) {
    const activeLink = document.querySelector(`[data-section="${activeSection}"]`);
    
    if (activeLink && this.indicator) {
      const linkRect = activeLink.getBoundingClientRect();
      const navRect = navMenu.getBoundingClientRect();
      
      const left = linkRect.left - navRect.left;
      const width = linkRect.width;
      
      this.indicator.style.left = `${left}px`;
      this.indicator.style.width = `${width}px`;
      this.indicator.style.opacity = '1';
    } else if (this.indicator) {
      this.indicator.style.opacity = '0';
    }
  }

  setupMobileMenu() {
    mobileMenuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
      }
    });
  }

  setupNavbarScroll() {
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      lastScrollTop = scrollTop;
    });
  }
}

// Typing Animation
class TypingAnimation {
  constructor(element, texts, options = {}) {
    this.element = element;
    this.texts = texts;
    this.typeSpeed = options.typeSpeed || 100;
    this.deleteSpeed = options.deleteSpeed || 50;
    this.pauseTime = options.pauseTime || 2000;
    this.currentIndex = 0;
    this.currentText = '';
    this.isDeleting = false;
    this.init();
  }

  init() {
    if (this.element) {
      this.type();
    }
  }

  type() {
    const fullText = this.texts[this.currentIndex];
    
    if (this.isDeleting) {
      this.currentText = fullText.substring(0, this.currentText.length - 1);
    } else {
      this.currentText = fullText.substring(0, this.currentText.length + 1);
    }

    this.element.textContent = this.currentText;

    let typeSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

    if (!this.isDeleting && this.currentText === fullText) {
      typeSpeed = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentText === '') {
      this.isDeleting = false;
      this.currentIndex = (this.currentIndex + 1) % this.texts.length;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Portfolio Manager
class PortfolioManager {
  constructor() {
    this.projects = portfolioData.projects;
    this.currentFilter = 'all';
    this.init();
  }

  init() {
    this.renderProjects();
    this.setupFilters();
  }

  renderProjects() {
    if (!portfolioGrid) return;

    const filteredProjects = this.currentFilter === 'all' 
      ? this.projects 
      : this.projects.filter(project => project.category === this.currentFilter);

    portfolioGrid.innerHTML = filteredProjects.map(project => `
      <div class="portfolio-item fade-in" data-category="${project.category}">
        <div class="portfolio-content">
          <h3 class="portfolio-title">${project.title}</h3>
          <span class="portfolio-category">${this.formatCategory(project.category)}</span>
          <p class="portfolio-description">${project.description}</p>
          
          <div class="portfolio-tech">
            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
          
          <div class="portfolio-impact">
            <strong>Impact:</strong> ${project.impact}
          </div>
          
          <div class="portfolio-links">
            <a href="${project.github}" class="btn btn--outline btn--sm" target="_blank">
              View Code
            </a>
            <a href="${project.demo}" class="btn btn--primary btn--sm" target="_blank">
              Live Demo
            </a>
          </div>
        </div>
      </div>
    `).join('');

    // Trigger fade-in animation
    setTimeout(() => {
      document.querySelectorAll('.portfolio-item').forEach(item => {
        item.classList.add('visible');
      });
    }, 100);
  }

  setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Update active filter button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update current filter and re-render
        this.currentFilter = button.getAttribute('data-filter');
        this.renderProjects();
      });
    });
  }

  formatCategory(category) {
    const categoryMap = {
      'infrastructure': 'Infrastructure',
      'architecture': 'Architecture',
      'machine-learning': 'Machine Learning',
      'tools': 'Tools & Frameworks'
    };
    return categoryMap[category] || category;
  }
}

// Blog Manager
class BlogManager {
  constructor() {
    this.articles = portfolioData.blogArticles;
    this.init();
  }

  init() {
    this.renderArticles();
  }

  renderArticles() {
    if (!blogGrid) return;

    blogGrid.innerHTML = this.articles.map(article => `
      <article class="blog-card fade-in">
        <div class="blog-content">
          <div class="blog-meta">
            <span class="blog-category">${article.category}</span>
            <span class="blog-date">${this.formatDate(article.date)}</span>
          </div>
          
          <h3 class="blog-title">${article.title}</h3>
          <p class="blog-excerpt">${article.excerpt}</p>
          
          <div class="blog-footer">
            <span class="blog-read-time">${article.readTime}</span>
            <a href="#" class="blog-read-more">Read More →</a>
          </div>
        </div>
      </article>
    `).join('');

    // Trigger fade-in animation
    setTimeout(() => {
      document.querySelectorAll('.blog-card').forEach(card => {
        card.classList.add('visible');
      });
    }, 100);
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

// Experience Manager
class ExperienceManager {
  constructor() {
    this.experiences = portfolioData.experience;
    this.init();
  }

  init() {
    this.renderTimeline();
  }

  renderTimeline() {
    if (!timeline) return;

    timeline.innerHTML = this.experiences.map(experience => `
      <div class="timeline-item fade-in">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <h3 class="timeline-title">${experience.title}</h3>
          <div class="timeline-company">${experience.company}</div>
          <span class="timeline-duration">${experience.duration}</span>
          <p class="timeline-description">${experience.description}</p>
        </div>
      </div>
    `).join('');

    // Trigger fade-in animation
    setTimeout(() => {
      document.querySelectorAll('.timeline-item').forEach(item => {
        item.classList.add('visible');
      });
    }, 100);
  }
}

// Contact Form Manager
class ContactFormManager {
  constructor() {
    this.form = contactForm;
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const submitButton = this.form.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('.btn-text');
    const buttonLoading = submitButton.querySelector('.btn-loading');
    
    // Show loading state
    buttonText.classList.add('hidden');
    buttonLoading.classList.remove('hidden');
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      this.showMessage('Message sent successfully!', 'success');
      this.form.reset();
      
    } catch (error) {
      this.showMessage('Failed to send message. Please try again.', 'error');
    } finally {
      // Reset button state
      buttonText.classList.remove('hidden');
      buttonLoading.classList.add('hidden');
      submitButton.disabled = false;
    }
  }

  showMessage(message, type) {
    // Create and show a temporary message
    const messageElement = document.createElement('div');
    messageElement.className = `status status--${type}`;
    messageElement.textContent = message;
    messageElement.style.marginTop = '1rem';
    
    this.form.appendChild(messageElement);
    
    setTimeout(() => {
      messageElement.remove();
    }, 5000);
  }
}

// Scroll Animation Manager
class ScrollAnimationManager {
  constructor() {
    this.elements = document.querySelectorAll('.fade-in');
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    this.elements.forEach(element => {
      observer.observe(element);
    });
  }
}

// Performance Manager
class PerformanceManager {
  constructor() {
    this.init();
  }

  init() {
    this.debounce();
    this.preloadCriticalResources();
  }

  debounce() {
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(() => {
        // Scroll ended
      }, 100);
    });
  }

  preloadCriticalResources() {
    // Preload any critical resources if needed
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://fonts.googleapis.com';
    document.head.appendChild(link);
  }
}

// Application Initialization
class App {
  constructor() {
    this.managers = {};
    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeManagers());
    } else {
      this.initializeManagers();
    }
  }

  initializeManagers() {
    try {
      // Initialize all managers
      this.managers.theme = new ThemeManager();
      this.managers.navigation = new NavigationManager();
      this.managers.portfolio = new PortfolioManager();
      this.managers.blog = new BlogManager();
      this.managers.experience = new ExperienceManager();
      this.managers.contactForm = new ContactFormManager();
      this.managers.scrollAnimation = new ScrollAnimationManager();
      this.managers.performance = new PerformanceManager();

      // Initialize typing animation
      const typingTexts = [
        'Data Engineer',
        'Pipeline Architect',
        'Cloud Solutions Expert',
        'ML Infrastructure Engineer'
      ];
      
      if (typingText) {
        this.managers.typing = new TypingAnimation(typingText, typingTexts, {
          typeSpeed: 100,
          deleteSpeed: 50,
          pauseTime: 2000
        });
      }

      // Initialize scroll animations for existing elements
      this.initializeScrollAnimations();
      
      console.log('Portfolio application initialized successfully');
      
    } catch (error) {
      console.error('Error initializing application:', error);
    }
  }

  initializeScrollAnimations() {
    // Add fade-in class to elements that should animate
    const animatedElements = [
      '.about-text',
      '.skills-category',
      '.section-header',
      '.contact-item',
      '.contact-form'
    ];

    animatedElements.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        element.classList.add('fade-in');
      });
    });
  }
}

// Initialize the application
const app = new App();

// Accessibility improvements
document.addEventListener('keydown', (e) => {
  // Escape key closes mobile menu
  if (e.key === 'Escape') {
    navMenu.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
  }
});

// Add skip link for screen readers
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.className = 'sr-only';
skipLink.textContent = 'Skip to main content';
document.body.insertBefore(skipLink, document.body.firstChild);

// Error handling for missing elements
window.addEventListener('error', (e) => {
  console.error('Application error:', e.error);
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { App };
}