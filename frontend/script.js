fetch('https://blog-pvoa.onrender.com')
    .then(response => response.json())
    .then(data => {
        const projectsDiv = document.getElementById('projects');
        data.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.innerHTML = `
                <h2>${project.title}</h2>
                <p>${project.description}</p>
                <a href="${project.github_link}" target="_blank">GitHub</a>
            `;
            projectsDiv.appendChild(projectElement);
        });
    })
    .catch(error => console.error('Error fetching projects:', error));
