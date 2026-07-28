document.addEventListener('DOMContentLoaded', () => {
    const feedContainer = document.getElementById('feed-container');
    const navItems = document.querySelectorAll('.nav-item');

    // Fetch the 40 Kuestions from the JSON file
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(questions => {
            renderFeed(questions);
        })
        .catch(error => {
            console.error('Error loading questions:', error);
            feedContainer.innerHTML = `<p style="text-align:center; padding: 20px; color: var(--neon-pink);">Failed to spark curiosity. Please try reloading!</p>`;
        });

    // Render cards dynamic function
    function renderFeed(questions) {
        feedContainer.innerHTML = ''; // clear initial load text

        questions.forEach(item => {
            const card = document.createElement('article');
            card.className = 'kuestion-card';
            
            card.innerHTML = `
                <span class="category-tag">${item.category}</span>
                <h2 class="question-text">${item.question}</h2>
                <div class="action-box">
                    <button class="reveal-btn" onclick="toggleAnswer(this)">Show Answer</button>
                </div>
                <div class="answer-box">
                    <p class="answer-text">${item.answer}</p>
                </div>
            `;
            
            feedContainer.appendChild(card);
        });
    }

    // Tab navigation switching effect
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Mock page navigation view changes if needed
            const target = item.getAttribute('data-target');
            if (target !== 'home') {
                feedContainer.innerHTML = `
                    <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; min-height:60vh; text-align:center; color: var(--text-muted);">
                        <svg viewBox="0 0 24 24" style="width:64px; height:64px; fill:var(--accent-purple); margin-bottom:16px;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                        <h3 style="color:#fff; margin-bottom:8px; text-transform:uppercase;">${target} feature arriving soon!</h3>
                        <p>Stay tuned as we construct more ways to ignite your brain.</p>
                    </div>
                `;
            } else {
                // Re-fetch or reload home feed
                fetch('data.json').then(res => res.json()).then(renderFeed);
            }
        });
    });
});

// Global scope toggle handler for dynamically created buttons
window.toggleAnswer = function(button) {
    const card = button.closest('.kuestion-card');
    const answerBox = card.querySelector('.answer-box');
    
    if (answerBox.classList.contains('show')) {
        answerBox.classList.remove('show');
        button.textContent = 'Show Answer';
        button.style.background = 'linear-gradient(135deg, var(--accent-glow), var(--accent-purple))';
    } else {
        answerBox.classList.add('show');
        button.textContent = 'Hide Answer';
        button.style.background = 'linear-gradient(135deg, var(--neon-pink), var(--accent-purple))';
        
        // Smooth scroll alignment fix if user reveals answer near bounds
        setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
    }
};