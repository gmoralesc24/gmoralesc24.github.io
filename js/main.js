import { projectsData, skillsData } from '../data/projects.js';
import { translations } from '../locales/i18n.js';

let currentLang = 'es'; // default language

document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Year
    document.getElementById('year').textContent = new Date().getFullYear();

    // 2. Initial Render
    renderSkills();
    renderProjects('all');
    updateTranslations();

    // 3. Setup Listeners
    setupLanguageToggle();
    setupFilters();
    setup3DTilt();
});

function setupLanguageToggle() {
    const langBtn = document.getElementById('lang-toggle');
    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        langBtn.innerHTML = currentLang === 'es' ? '🌐 Español (ES)' : '🌐 English (EN)';
        updateTranslations();
        renderProjects(document.querySelector('.filter-btn.active').dataset.filter); // Re-render projects in new lang
    });
}

function updateTranslations() {
    const t = translations[currentLang];
    
    // Update simple text content elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.innerHTML = t[key];
        }
    });

    // Special case for hero greeting (which has inner HTML/Elements next to it in some cases, though here we wrapped it cleanly)
}

function renderSkills() {
    const container = document.getElementById('skills-container');
    container.innerHTML = '';
    
    skillsData.forEach(skill => {
        const row = document.createElement('div');
        row.className = 'skill-row';
        
        row.innerHTML = `
            <div class="skill-info">
                <span>${skill.name}</span>
                <span>${skill.value}%</span>
            </div>
            <div class="skill-bar-bg">
                <div class="skill-bar-fill" style="width: 0%"></div>
            </div>
        `;
        container.appendChild(row);

        // Animate bar using setTimeout
        setTimeout(() => {
            row.querySelector('.skill-bar-fill').style.width = `${skill.value}%`;
        }, 300);
    });
}

function renderProjects(filter) {
    const container = document.getElementById('projects-grid');
    container.innerHTML = '';
    
    const filtered = projectsData.filter(p => filter === 'all' || p.category === filter);

    filtered.forEach(project => {
        const desc = project.description[currentLang] || project.description['en'];
        const tagsHtml = project.tags.map(t => `<span class="tag">${t}</span>`).join('');
        
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <h3>${project.name}</h3>
            <p>${desc}</p>
            <div class="project-tags">
                ${tagsHtml}
            </div>
            <div class="project-links">
                <a href="${project.url}" target="_blank" class="project-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    Code / Repo
                </a>
            </div>
        `;
        container.appendChild(card);
    });
}

function setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active
            buttons.forEach(b => b.classList.remove('active'));
            // Add active
            e.target.classList.add('active');
            
            const filter = e.target.dataset.filter;
            renderProjects(filter);
        });
    });
}

function setup3DTilt() {
    const wrapper = document.querySelector('.hero-image-wrapper');
    const heroSection = document.getElementById('home');
    if(!wrapper || !heroSection) return;

    heroSection.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = heroSection.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        
        // Tilt bounds: roughly +/- 20 degrees based on distance
        const tiltX = -y * 30; 
        const tiltY = x * 30;
        
        wrapper.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    heroSection.addEventListener('mouseleave', () => {
        wrapper.style.transform = `rotateX(0deg) rotateY(0deg)`;
    });
}
