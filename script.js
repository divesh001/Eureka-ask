document.addEventListener('DOMContentLoaded', () => {
    const feedContainer = document.getElementById('feed-container');
    const navItems = document.querySelectorAll('.nav-item');
    
    let allQuestions = [];
    let shuffledQuestions = [];
    
    // Initialize Bookmarks array from localStorage
    let bookmarkedIds = JSON.parse(localStorage.getItem('eureka_bookmarks')) || [];

    // 1. INITIAL LOADING ENGINE: Fetch the 100 questions from data.json
    fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            allQuestions = data;
            // Randomize the questions pool for the home feed
            shuffledQuestions = shuffleArray([...allQuestions]);
            renderFeed(shuffledQuestions);
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            feedContainer.innerHTML = `
                <div class="error-screen" style="text-align:center; padding: 40px; color: var(--neon-pink, #ff007f);">
                    <h3>Failed to spark curiosity.</h3>
                    <p>Please ensure you are using a local development server (like Live Server) or hosting online to load the JSON dataset!</p>
                </div>
            `;
        });

    // True randomness algorithm (Fisher-Yates Shuffle)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 2. MAIN DYNAMIC RENDER ENGINE FOR QUESTIONS
    function renderFeed(questionsArray, isProfileView = false) {
        feedContainer.innerHTML = '';
        
        // Empty State: If looking at bookmarks but nothing is saved
        if (questionsArray.length === 0) {
            feedContainer.innerHTML = `
                <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; min-height:60vh; text-align:center; color: var(--text-muted); padding: 20px;">
                    <svg viewBox="0 0 24 24" style="width:64px; height:64px; fill:var(--text-muted); margin-bottom:16px;">
                        <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/>
                    </svg>
                    <h3 style="color:#fff; margin-bottom:8px; text-transform:uppercase;">No Saved Kuestions</h3>
                    <p>Tap the bookmark icon on cards in your home feed to build your curiosity vault.</p>
                </div>
            `;
            return;
        }

        // Generate card layout structure on the fly
        questionsArray.forEach(item => {
            const card = document.createElement('article');
            card.className = 'kuestion-card';
            
            const isBookmarked = bookmarkedIds.includes(item.id);
            
            card.innerHTML = `
                <div class="card-header">
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

    // 3. PERSISTENT BOOKMARK SAVING ENGINE
    window.toggleBookmark = function(id, buttonElement) {
        if (bookmarkedIds.includes(id)) {
            // Remove question from array
            bookmarkedIds = bookmarkedIds.filter(bId => bId !== id);
            buttonElement.classList.remove('active');
        } else {
            // Add question to array
            bookmarkedIds.push(id);
            buttonElement.classList.add('active');
        }
        
        // Write snapshot directly to user's web browser environment
        localStorage.setItem('eureka_bookmarks', JSON.stringify(bookmarkedIds));

        // Interactive Live-Update: Remove element instantly if unchecked within the profile tab
        const activeNav = document.querySelector('.nav-item.active').getAttribute('data-target');
        if (activeNav === 'profile') {
            const savedQuestions = allQuestions.filter(q => bookmarkedIds.includes(q.id));
            renderFeed(savedQuestions, true);
        }
    };

    // 4. BOTTOM TAB NAVIGATION LOGIC
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Manage UI highlights
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            const target = item.getAttribute('data-target');
            
            if (target === 'home') {
                renderFeed(shuffledQuestions);
            } else if (target === 'profile') {
                // Read from local storage vault, filter data pool, and print to page
                const savedQuestions = allQuestions.filter(q => bookmarkedIds.includes(q.id));
                renderFeed(savedQuestions, true);
            } else if (target === 'photos') {
                // Initialize the deep space satellite feeds
                loadNasaPhotos();
            } else {
                // Fallback UI wrapper for undeveloped options (Camera Tab placeholder)
                feedContainer.innerHTML = `
                    <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; min-height:60vh; text-align:center; color: var(--text-muted);">
                        <svg viewBox="0 0 24 24" style="width:64px; height:64px; fill:var(--accent-purple); margin-bottom:16px;">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                        </svg>
                        <h3 style="color:#fff; margin-bottom:8px; text-transform:uppercase;">${target} tools arriving soon!</h3>
                        <p style="font-size:0.9rem; max-width:280px; margin:0 auto;">Stay tuned as we engineer more ways to analyze your physics world.</p>
                    </div>
                `;
            }
        });
    });

    // 5. NASA SATELLITE CORE DATA ENGINE
    function loadNasaPhotos() {
        feedContainer.innerHTML = `
            <div style="display:flex; justify-content:center; align-items:center; min-height:50vh; color:var(--accent-glow);">
                <p style="letter-spacing:2px; text-transform:uppercase; font-size:0.9rem; font-weight:bold; animation: pulse 1.5s infinite;">Connecting to NASA deep space feeds...</p>
            </div>
        `;

        // Generate dates dynamically to pull past 5 days (safely isolating 3 clean image models)
        const today = new Date();
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(today.getDate() - 5);
        
        const formatDate = (date) => date.toISOString().split('T')[0];
        const nasaUrl = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&start_date=${formatDate(fiveDaysAgo)}&end_date=${formatDate(today)}`;

        fetch(nasaUrl)
            .then(res => {
                if (!res.ok) throw new Error('NASA Data Link failure');
                return res.json();
            })
            .then(data => {
                // Clean data: process images only, rank reverse chronologically, scale down to top 3 entries
                const pastThreeImages = data.filter(item => item.media_type === 'image').reverse().slice(0, 3);
                renderNasaGallery(pastThreeImages);
            })
            .catch(err => {
                console.error(err);
                feedContainer.innerHTML = `
                    <div style="text-align:center; padding:40px; color:var(--neon-pink);">
                        <h3 style="margin-bottom:8px;">Cosmic Signal Lost</h3>
                        <p style="font-size:0.9rem; color:var(--text-muted);">Could not safely interface with astronomical telemetry. Try again later.</p>
                    </div>
                `;
            });
    }

    function renderNasaGallery(imagesArray) {
        feedContainer.innerHTML = '';
        
        const galleryWrapper = document.createElement('div');
        galleryWrapper.className = 'nasa-gallery-wrapper';
        
        imagesArray.forEach(item => {
            const itemBlock = document.createElement('div');
            itemBlock.className = 'nasa-photo-block';
            itemBlock.innerHTML = `
                <div class="nasa-img-container">
                    <img src="${item.url}" alt="${item.title}" onclick="toggleNasaText(this)">
                    <div class="nasa-floating-title">${item.title}</div>
                </div>
                <div class="nasa-explanation-drawer">
                    <h3>${item.title}</h3>
                    <span style="font-size:0.75rem; color:var(--accent-glow); display:block; margin-bottom:10px;">NASA Space Log // ${item.date}</span>
                    <p>${item.explanation}</p>
                </div>
            `;
            galleryWrapper.appendChild(itemBlock);
        });
        
        feedContainer.appendChild(galleryWrapper);
    }

    // Interactive Toggle for NASA Explanation Drawer Panels
    window.toggleNasaText = function(imageElement) {
        const parentBlock = imageElement.closest('.nasa-photo-block');
        const drawer = parentBlock.querySelector('.nasa-explanation-drawer');
        drawer.classList.toggle('open');
    };
});

// 6. INTERACTIVE SLIDE ACCORDION ACCENTS FOR CORE QUESTIONS
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
        
        // Ensure microcard centers perfectly into view for the student during mobile review sessions
        setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 250);
    }
};