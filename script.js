document.addEventListener('DOMContentLoaded', () => {
    const feedContainer = document.getElementById('feed-container');
    const navItems = document.querySelectorAll('.nav-item');
    
    let allQuestions = [];
    let shuffledQuestions = [];
    
    // Initialize Bookmarks array from localStorage
    let bookmarkedIds = JSON.parse(localStorage.getItem('eureka_bookmarks')) || [];

    // Fetch the 100 questions from data.json
    fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            allQuestions = data;
            // 1) Randomize the questions for the home feed
            shuffledQuestions = shuffleArray([...allQuestions]);
            renderFeed(shuffledQuestions);
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            feedContainer.innerHTML = `
                <div class="error-screen" style="text-align:center; padding: 40px; color: #ff007f;">
                    <h3>Failed to spark curiosity.</h3>
                    <p>Please ensure you are using a local server (Live Server) or hosting online!</p>
                </div>
            `;
        });

    // Fisher-Yates Shuffle Algorithm for true randomness
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Dynamic Render Engine
    function renderFeed(questionsArray, isProfileView = false) {
        feedContainer.innerHTML = '';
        
        if (questionsArray.length === 0) {
            feedContainer.innerHTML = `
                <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; min-height:60vh; text-align:center; color: var(--text-muted); padding: 20px;">
                    <svg viewBox="0 0 24 24" style="width:64px; height:64px; fill:var(--text-muted); margin-bottom:16px;"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/></svg>
                    <h3 style="color:#fff; margin-bottom:8px; text-transform:uppercase;">No Saved Kuestions</h3>
                    <p>Tap the bookmark icon on cards in your home feed to build your curiosity vault.</p>
                </div>
            `;
            return;
        }

        questionsArray.forEach(item => {
            const card = document.createElement('article');
            card.className = 'kuestion-card';
            
            // Check if this item is currently bookmarked
            const isBookmarked = bookmarkedIds.includes(item.id);
            
            card.innerHTML = `
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span class="category-tag">${item.category}</span>
                    <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" onclick="toggleBookmark(${item.id}, this)" aria-label="Bookmark question">
                        <svg viewBox="0 0 24 24">
                            <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                        </svg>
                    </button>
                </div>
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

    // Global toggle function for bookmarks
    window.toggleBookmark = function(id, buttonElement) {
        if (bookmarkedIds.includes(id)) {
            // Remove from array
            bookmarkedIds = bookmarkedIds.filter(bId => bId !== id);
            buttonElement.classList.remove('active');
        } else {
            // Add to array
            bookmarkedIds.push(id);
            buttonElement.classList.add('active');
        }
        
        // Overwrite standard storage entry
        localStorage.setItem('eureka_bookmarks', JSON.stringify(bookmarkedIds));

        // If the user unfavorites a card inside the Profile tab view, instantly remove it live
        const activeNav = document.querySelector('.nav-item.active').getAttribute('data-target');
        if (activeNav === 'profile') {
            const savedQuestions = allQuestions.filter(q => bookmarkedIds.includes(q.id));
            renderFeed(savedQuestions, true);
        }
    };

    // Navigation Logic
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            const target = item.getAttribute('data-target');
            
            if (target === 'home') {
                renderFeed(shuffledQuestions);
            } else if (target === 'profile') {
                // 2) Filter the core pool down strictly to saved entries
                const savedQuestions = allQuestions.filter(q => bookmarkedIds.includes(q.id));
                renderFeed(savedQuestions, true);
            } else {
                // Fallback placeholder for undeveloped Views (Photos/Camera)
                feedContainer.innerHTML = `
                    <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; min-height:60vh; text-align:center; color: var(--text-muted);">
                        <svg viewBox="0 0 24 24" style="width:64px; height:64px; fill:var(--accent-purple); margin-bottom:16px;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                        <h3 style="color:#fff; margin-bottom:8px; text-transform:uppercase;">${target} arriving soon!</h3>
                        <p>Stay tuned as we construct more ways to ignite your brain.</p>
                    </div>
                `;
            }
        });
    });
});

// Smooth Accordion Toggles
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
        
        setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
    }
};