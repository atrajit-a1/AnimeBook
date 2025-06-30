/**
 * Anime Book Library - Router
 * 
 * This script handles client-side routing for the single-page application:
 * - Parsing URL hash to determine current route
 * - Rendering appropriate views based on routes
 * - Handling navigation between home and book detail pages
 */

// Router state
const router = {
    currentRoute: null,
    routes: {
        home: {
            path: '/',
            view: showHomeView
        },
        book: {
            path: '/book/',
            view: showBookView
        }
    }
};

// DOM Elements for views
const views = {
    homeView: document.querySelector('main'),
    bookView: null // Will be created dynamically when needed
};

/**
 * Initialize the router
 */
function initRouter() {
    // Create book view container if it doesn't exist
    if (!views.bookView) {
        views.bookView = document.createElement('div');
        views.bookView.id = 'book-view';
        views.bookView.className = 'book-detail';
        views.bookView.style.display = 'none';
        document.body.insertBefore(views.bookView, document.querySelector('footer'));
    }
    
    // Handle initial route
    handleRouteChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleRouteChange);
}

/**
 * Handle route changes when hash changes
 */
function handleRouteChange() {
    // Get the current hash without the # symbol
    const hash = window.location.hash.slice(1) || '/';
    
    // Determine which route matches the current hash
    if (hash === '/' || hash === '') {
        // Home route
        router.currentRoute = router.routes.home;
    } else if (hash.startsWith('/book/')) {
        // Book detail route
        router.currentRoute = router.routes.book;
    } else {
        // Default to home for unknown routes
        router.currentRoute = router.routes.home;
        window.location.hash = '#/';
        return;
    }
    
    // Render the view for the current route
    router.currentRoute.view(hash);
}

/**
 * Show the home view
 */
function showHomeView() {
    // Hide book view and show home view
    views.bookView.style.display = 'none';
    views.homeView.style.display = 'block';
    
    // Scroll to top
    window.scrollTo(0, 0);
}

/**
 * Show the book detail view
 * @param {string} hash - The current URL hash
 */
async function showBookView(hash) {
    // Extract book path from hash
    const bookPath = hash.replace('/book/', '');
    
    if (!bookPath) {
        // If no book path, redirect to home
        window.location.hash = '#/';
        return;
    }
    
    // Show book view and hide home view
    views.bookView.style.display = 'block';
    views.homeView.style.display = 'none';
    
    // Show loading state
    views.bookView.innerHTML = `
        <div class="container">
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading book...</p>
            </div>
        </div>
    `;
    
    try {
        // Find the book in our state
        const [category, filename] = bookPath.split('/');
        const book = findBookByPath(category, filename);
        
        if (!book) {
            throw new Error('Book not found');
        }
        
        // Load book content if not already loaded
        if (!book.content) {
            const { frontmatter, content } = await fetchBookContent(book.url);
            book.frontmatter = frontmatter;
            book.content = content;
        }
        
        // Render book content
        renderBookDetail(book);
        
        // Scroll to top
        window.scrollTo(0, 0);
        
    } catch (error) {
        console.error('Error loading book:', error);
        showBookError('Book not found or failed to load.');
    }
}

/**
 * Find a book by its category and filename
 * @param {string} category - The book category
 * @param {string} filename - The book filename without extension
 * @returns {Object|null} - The book object or null if not found
 */
function findBookByPath(category, filename) {
    // If using sample data or books are already loaded
    if (state.books.length > 0) {
        return state.books.find(book => {
            return book.category === category && 
                   book.filename === `${filename}.md`;
        });
    }
    
    return null;
}

/**
 * Render book detail view
 * @param {Object} book - The book object
 */
function renderBookDetail(book) {
    const { frontmatter, content } = book;
    const title = frontmatter.title || book.title;
    const author = frontmatter.author || 'Unknown Author';
    const cover = frontmatter.cover || config.defaultCoverImage;
    
    // Convert markdown content to HTML
    const htmlContent = marked.parse(content);
    
    // Create book detail HTML
    const bookDetailHTML = `
        <div class="container book-detail-container">
            <div class="book-header">
                <div class="book-header-content">
                    <h1>${title}</h1>
                    <div class="book-meta">
                        <span class="author">By ${author}</span>
                        <span class="category">${formatTitle(book.category)}</span>
                    </div>
                </div>
            </div>
            <div class="book-content">
                ${htmlContent}
            </div>
            <div class="book-actions">
                <a href="#/" class="back-to-list">
                    <i class="fas fa-arrow-left"></i> Back to Books
                </a>
                <div class="share-buttons">
                    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(`Reading ${title} by ${author} on Anime Book Library`)}&url=${encodeURIComponent(window.location.href)}" 
                       target="_blank" class="share-btn twitter">
                        <i class="fab fa-twitter"></i>
                    </a>
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" 
                       target="_blank" class="share-btn facebook">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(title)}" 
                       target="_blank" class="share-btn linkedin">
                        <i class="fab fa-linkedin-in"></i>
                    </a>
                </div>
            </div>
        </div>
    `;
    
    // Update the book view
    views.bookView.innerHTML = bookDetailHTML;
}

/**
 * Show error message in book detail view
 * @param {string} message - The error message
 */
function showBookError(message) {
    views.bookView.innerHTML = `
        <div class="container">
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
                <a href="#/" class="btn primary-btn">Back to Home</a>
            </div>
        </div>
    `;
}

// Initialize the router when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initRouter);