// Theme functionality
        function initializeTheme() {
            const themeToggle = document.getElementById('themeToggle');
            const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

            // Check for saved theme or prefer system theme
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                document.documentElement.setAttribute('data-theme', savedTheme);
            } else if (prefersDarkScheme.matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
            }

            // Toggle theme on button click
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }

        // Fetch and populate CV data from JSON
        document.addEventListener('DOMContentLoaded', function () {
            initializeTheme(); // Initialize theme functionality

            fetch('./json/info.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    document.getElementById('loading').style.display = 'none';

                    // Populate the CV with data
                    populateCV(data);

                    // Show the CV content
                    document.getElementById('header').style.display = 'flex';
                    document.getElementById('mainContent').style.display = 'grid';

                    addPrintButton();
                })
                .catch(error => {
                    console.error('Error loading JSON data:', error);
                    document.getElementById('loading').innerHTML =
                        '<p>Error loading CV data. Please check if the JSON file exists.</p>';
                });
        });

        function populateCV(data) {
            populateHeader(data.personalInfo);
            populateSidebar(data);
            populateContent(data);
        }

        function populateHeader(personalInfo) {
            const header = document.getElementById('header');

            header.innerHTML = `
                <img src="${personalInfo.profileImage}" alt="Profile Photo" class="profile-img">
                <div class="header-info">
                    <h1 class="name">${personalInfo.name}</h1>
                    <p class="title">${personalInfo.title}</p>
                    <p class="summary">${personalInfo.summary}</p>
                    <div class="contact-info">
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <span><a class="social-link" href="mailto:${personalInfo.email}">${personalInfo.email}</a></span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <span>${personalInfo.phone}</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span><a class="social-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(personalInfo.location)}" target="_blank">${personalInfo.location}</a></span>
                        </div>
                        <div class="contact-item">
                            <i class="fab fa-linkedin"></i>
                            <span><a class="social-link" href="${personalInfo.linkedin}" target="_blank">${personalInfo.linkedin}</a></span>
                        </div>
                        <div class="contact-item">
                            <i class="fab fa-github"></i>
                            <span><a class="social-link" href="${personalInfo.github}" target="_blank">${personalInfo.github}</a></span>
                        </div>
                    </div>
                </div>
            `;
        }

        function populateSidebar(data) {
            const sidebar = document.getElementById('sidebar');

            sidebar.innerHTML = `
                <div class="section">
                    <h3 class="section-title"><i class="fas fa-code"></i> Technical Skills</h3>
                    ${generateSkillsHTML(data.skills)}
                </div>
                
                <div class="section">
                    <h3 class="section-title"><i class="fas fa-globe"></i> Languages</h3>
                    ${generateLanguagesHTML(data.languages)}
                </div>
                
                <div class="section">
                    <h3 class="section-title"><i class="fas fa-award"></i> Certifications</h3>
                    ${generateCertificationsHTML(data.certifications)}
                </div>
                
                <div class="qr-code">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(data.personalInfo.portfolio)}" alt="QR Code to Portfolio">
                    <div class="qr-text">Scan to view my portfolio</div>
                </div>
            `;
        }

        function generateSkillsHTML(skills) {
            let html = '';

            for (const [category, skillList] of Object.entries(skills)) {
                const categoryName = category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                html += `
                    <div class="skill-category">
                        <h4>${categoryName}</h4>
                        <div class="skills-list">
                            ${skillList.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    </div>
                `;
            }

            return html;
        }

        function generateLanguagesHTML(languages) {
            return languages.map(lang => `
                <div class="language-item">
                    <span class="language-name">${lang.language}</span>
                    <span class="language-level">${lang.level}</span>
                </div>
            `).join('');
        }

        function generateCertificationsHTML(certifications) {
            return certifications.map(cert => `
                <div class="certification-item">
                    <div class="certification-name">${cert.name}</div>
                    <div class="certification-org">${cert.issuer}</div>
                </div>
            `).join('');
        }

        function populateContent(data) {
            const content = document.getElementById('content');

            content.innerHTML = `
                <div class="section">
                    <h3 class="section-title"><i class="fas fa-briefcase"></i> Professional Experience</h3>
                    ${generateExperienceHTML(data.experience)}
                </div>
                
                <div class="section">
                    <h3 class="section-title"><i class="fas fa-graduation-cap"></i> Education</h3>
                    ${generateEducationHTML(data.education)}
                </div>
                
                <div class="section">
                    <h3 class="section-title"><i class="fas fa-project-diagram"></i> Notable Projects</h3>
                    ${generateProjectsHTML(data.projects)}
                </div>
            `;
        }

        function generateExperienceHTML(experience) {
            return experience.map(exp => `
                <div class="timeline-item">
                    <div class="timeline-date">${exp.period}</div>
                    <h4 class="timeline-title">${exp.position}</h4>
                    <div class="timeline-subtitle">${exp.company}</div>
                    <p>${exp.description}</p>
                    <ul>
                        ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                    </ul>
                </div>
            `).join('');
        }

        function generateEducationHTML(education) {
            return education.map(edu => `
                <div class="education-item">
                    <div class="education-degree">${edu.degree}</div>
                    <div class="education-school">${edu.school}</div>
                    <div class="education-date">${edu.period}</div>
                    <p>${edu.details}</p>
                </div>
            `).join('');
        }

        function generateProjectsHTML(projects) {
            return projects.map(project => `
                <div class="project-item">
                    <div class="project-title">
                        <span>${project.name}</span>
                        <div class="project-links">
                            ${project.links.demo ? `<a href="${project.links.demo}" class="project-link">Live Demo</a>` : ''}
                            ${project.links.github ? `<a href="${project.links.github}" class="project-link">GitHub</a>` : ''}
                        </div>
                    </div>
                    <div class="project-description">
                        ${project.description}
                    </div>
                    <div class="project-tech">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
            `).join('');
        }

        function addPrintButton() {
            const printButton = document.createElement('button');
            printButton.innerHTML = '<i class="fas fa-print"></i> Print CV';
            printButton.className = 'print-button';
            printButton.style.position = 'fixed';
            printButton.style.bottom = '20px';
            printButton.style.right = '90px';
            printButton.style.padding = '10px 15px';
            printButton.style.background = 'var(--primary)';
            printButton.style.color = 'white';
            printButton.style.border = 'none';
            printButton.style.borderRadius = '5px';
            printButton.style.cursor = 'pointer';
            printButton.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            printButton.style.zIndex = '1000';

            printButton.addEventListener('click', function () {
                window.print();
            });

            document.body.appendChild(printButton);
        }