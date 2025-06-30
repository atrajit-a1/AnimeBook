/**
 * Anime Book Library - Main Application Script
 * 
 * This script handles the core functionality of the Anime Book Library website:
 * - Fetching categories and books from GitHub repository
 * - Rendering book cards and category filters
 * - Handling search functionality
 * - Loading and parsing markdown content
 */

// Configuration
const config = {
    // GitHub repository information
    github: {
        owner: 'atrajit-sarkar', // GitHub username
        repo: 'AnimeBook',       // Repository name
        contentBranch: 'content',
        apiBaseUrl: 'https://api.github.com/repos',
    },
    // Default cover image if none is provided in frontmatter
    defaultCoverImage: './assets/images/default-cover.svg',
};

// DOM Elements
const elements = {
    booksContainer: document.querySelector('.books-container'),
    categoryFilters: document.querySelector('.category-filters'),
    loadingSpinner: document.querySelector('.loading-spinner'),
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    bookCardTemplate: document.getElementById('book-card-template'),
};

// State
let state = {
    categories: [],
    books: [],
    filteredBooks: [],
    currentCategory: 'all',
    isLoading: true,
};

/**
 * Initialize the application
 */
async function initApp() {
    try {
        // Show loading spinner
        showLoading(true);
        
        // Fetch categories and books from GitHub
        await fetchCategoriesAndBooks();
        
        // Render category filters
        renderCategoryFilters();
        
        // Render all books initially
        filterBooks('all');
        
        // Setup event listeners
        setupEventListeners();
        
        // Hide loading spinner
        showLoading(false);
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showError('Failed to load books. Please try again later.');
    }
}

/**
 * Fetch categories and books from GitHub repository
 */
async function fetchCategoriesAndBooks() {
    try {
        const { owner, repo, contentBranch, apiBaseUrl } = config.github;
        const url = `${apiBaseUrl}/${owner}/${repo}/contents?ref=${contentBranch}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filter directories (categories)
        const categories = data.filter(item => item.type === 'dir');
        state.categories = categories.map(category => category.name);
        
        // Fetch books for each category
        const booksPromises = categories.map(category => fetchBooksInCategory(category.name));
        const booksArrays = await Promise.all(booksPromises);
        
        // Flatten the array of arrays into a single array of books
        state.books = booksArrays.flat();
        state.filteredBooks = [...state.books];
        
    } catch (error) {
        console.error('Error fetching categories and books:', error);
        // If the content branch doesn't exist yet, show sample data
        useSampleData();
    }
}

/**
 * Fetch books in a specific category
 * @param {string} categoryName - The name of the category
 * @returns {Promise<Array>} - Array of book objects
 */
async function fetchBooksInCategory(categoryName) {
    try {
        const { owner, repo, contentBranch, apiBaseUrl } = config.github;
        const url = `${apiBaseUrl}/${owner}/${repo}/contents/${categoryName}?ref=${contentBranch}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filter markdown files
        const mdFiles = data.filter(item => item.type === 'file' && item.name.endsWith('.md'));
        
        // Create book objects with basic info
        return mdFiles.map(file => ({
            title: formatTitle(file.name.replace('.md', '')),
            filename: file.name,
            path: file.path,
            category: categoryName,
            url: file.download_url,
            // These will be populated when the book is clicked
            content: null,
            frontmatter: null,
        }));
        
    } catch (error) {
        console.error(`Error fetching books in category ${categoryName}:`, error);
        return [];
    }
}

/**
 * Fetch and parse a specific book's content
 * @param {string} bookUrl - The URL to the book's markdown file
 * @returns {Object} - Object containing parsed frontmatter and content
 */
async function fetchBookContent(bookUrl) {
    try {
        const response = await fetch(bookUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch book content: ${response.status}`);
        }
        
        const markdown = await response.text();
        
        // Parse frontmatter and content
        const { frontmatter, content } = parseMarkdown(markdown);
        
        return { frontmatter, content };
        
    } catch (error) {
        console.error('Error fetching book content:', error);
        return { frontmatter: {}, content: 'Failed to load book content.' };
    }
}

/**
 * Parse markdown content to extract frontmatter and content
 * @param {string} markdown - The raw markdown content
 * @returns {Object} - Object containing parsed frontmatter and content
 */
function parseMarkdown(markdown) {
    // Default values
    let frontmatter = {};
    let content = markdown;
    
    // Check if the markdown has frontmatter (between --- and ---)
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);
    
    if (match) {
        try {
            // Parse YAML frontmatter
            frontmatter = jsyaml.load(match[1]) || {};
            content = match[2];
        } catch (error) {
            console.error('Error parsing frontmatter:', error);
        }
    }
    
    return { frontmatter, content };
}

/**
 * Render category filters
 */
function renderCategoryFilters() {
    // Clear existing filters except the 'All' button
    const allButton = elements.categoryFilters.querySelector('[data-filter="all"]');
    elements.categoryFilters.innerHTML = '';
    elements.categoryFilters.appendChild(allButton);
    
    // Add category buttons
    state.categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.setAttribute('data-filter', category);
        button.textContent = formatTitle(category);
        
        button.addEventListener('click', () => filterBooks(category));
        
        elements.categoryFilters.appendChild(button);
    });
}

/**
 * Filter books by category
 * @param {string} category - The category to filter by, or 'all' for all books
 */
function filterBooks(category) {
    // Update active filter button
    const filterButtons = elements.categoryFilters.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        if (button.getAttribute('data-filter') === category) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Update current category in state
    state.currentCategory = category;
    
    // Filter books
    if (category === 'all') {
        state.filteredBooks = [...state.books];
    } else {
        state.filteredBooks = state.books.filter(book => book.category === category);
    }
    
    // Render filtered books
    renderBooks();
}

/**
 * Search books by title, author, or description
 * @param {string} query - The search query
 */
function searchBooks(query) {
    if (!query.trim()) {
        // If search is empty, reset to current category filter
        filterBooks(state.currentCategory);
        return;
    }
    
    // Normalize query for case-insensitive search
    const normalizedQuery = query.toLowerCase().trim();
    
    // Filter books based on the query
    const searchResults = state.books.filter(book => {
        // Check if book has been loaded with frontmatter
        if (book.frontmatter) {
            const title = (book.frontmatter.title || book.title || '').toLowerCase();
            const author = (book.frontmatter.author || '').toLowerCase();
            const description = (book.frontmatter.description || '').toLowerCase();
            
            return (
                title.includes(normalizedQuery) ||
                author.includes(normalizedQuery) ||
                description.includes(normalizedQuery)
            );
        } else {
            // If frontmatter not loaded, just check the title
            return book.title.toLowerCase().includes(normalizedQuery);
        }
    });
    
    // Update filtered books and render
    state.filteredBooks = searchResults;
    renderBooks();
    
    // Update UI to show search results
    const filterButtons = elements.categoryFilters.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => button.classList.remove('active'));
}

/**
 * Render books in the books container
 */
function renderBooks() {
    // Clear books container except loading spinner
    const loadingSpinner = elements.loadingSpinner;
    elements.booksContainer.innerHTML = '';
    elements.booksContainer.appendChild(loadingSpinner);
    
    // Hide loading spinner
    loadingSpinner.style.display = 'none';
    
    // If no books found
    if (state.filteredBooks.length === 0) {
        const noBooks = document.createElement('div');
        noBooks.className = 'no-books-message';
        noBooks.innerHTML = `
            <p>No books found. ${state.currentCategory === 'all' ? '' : 'Try another category or '} 
            <a href="#contribute">contribute your own</a>!</p>
        `;
        elements.booksContainer.appendChild(noBooks);
        return;
    }
    
    // Create and append book cards
    state.filteredBooks.forEach(book => {
        const bookCard = createBookCard(book);
        elements.booksContainer.appendChild(bookCard);
    });
}

/**
 * Create a book card element
 * @param {Object} book - The book object
 * @returns {HTMLElement} - The book card element
 */
function createBookCard(book) {
    // Clone the template
    const template = elements.bookCardTemplate;
    const bookCard = document.importNode(template.content, true).querySelector('.book-card');
    
    // Set book data
    const coverImg = bookCard.querySelector('.book-cover img');
    const titleEl = bookCard.querySelector('.book-title');
    const authorEl = bookCard.querySelector('.book-author');
    const descriptionEl = bookCard.querySelector('.book-description');
    const readMoreLink = bookCard.querySelector('.read-more');
    
    // If frontmatter is already loaded
    if (book.frontmatter) {
        coverImg.src = book.frontmatter.cover || config.defaultCoverImage;
        titleEl.textContent = book.frontmatter.title || book.title;
        authorEl.textContent = book.frontmatter.author ? `By ${book.frontmatter.author}` : '';
        descriptionEl.textContent = book.frontmatter.description || 'No description available.';
    } else {
        // Use default values until frontmatter is loaded
        coverImg.src = config.defaultCoverImage;
        titleEl.textContent = book.title;
        authorEl.textContent = '';
        descriptionEl.textContent = 'Loading book details...';
        
        // Load frontmatter asynchronously
        loadBookFrontmatter(book, bookCard);
    }
    
    // Set alt text for cover image
    coverImg.alt = `Cover for ${book.title}`;
    
    // Set read more link
    const bookPath = `${book.category}/${book.filename.replace('.md', '')}`;
    readMoreLink.href = `#/book/${bookPath}`;
    
    return bookCard;
}

/**
 * Load a book's frontmatter asynchronously
 * @param {Object} book - The book object
 * @param {HTMLElement} bookCard - The book card element
 */
async function loadBookFrontmatter(book, bookCard) {
    try {
        // Fetch book content
        const { frontmatter } = await fetchBookContent(book.url);
        
        // Update book object with frontmatter
        book.frontmatter = frontmatter;
        
        // Update book card with frontmatter data
        const coverImg = bookCard.querySelector('.book-cover img');
        const titleEl = bookCard.querySelector('.book-title');
        const authorEl = bookCard.querySelector('.book-author');
        const descriptionEl = bookCard.querySelector('.book-description');
        
        coverImg.src = frontmatter.cover || config.defaultCoverImage;
        titleEl.textContent = frontmatter.title || book.title;
        authorEl.textContent = frontmatter.author ? `By ${frontmatter.author}` : '';
        descriptionEl.textContent = frontmatter.description || 'No description available.';
        
    } catch (error) {
        console.error('Error loading book frontmatter:', error);
    }
}

/**
 * Show or hide the loading spinner
 * @param {boolean} show - Whether to show or hide the spinner
 */
function showLoading(show) {
    elements.loadingSpinner.style.display = show ? 'flex' : 'none';
    state.isLoading = show;
}

/**
 * Show an error message in the books container
 * @param {string} message - The error message to display
 */
function showError(message) {
    showLoading(false);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <p>${message}</p>
    `;
    
    elements.booksContainer.innerHTML = '';
    elements.booksContainer.appendChild(errorElement);
}

/**
 * Format a string to title case (capitalize first letter of each word)
 * @param {string} str - The string to format
 * @returns {string} - The formatted string
 */
function formatTitle(str) {
    return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Category filter buttons
    const allButton = elements.categoryFilters.querySelector('[data-filter="all"]');
    allButton.addEventListener('click', () => filterBooks('all'));
    
    // Search functionality
    elements.searchBtn.addEventListener('click', () => {
        const query = elements.searchInput.value;
        searchBooks(query);
    });
    
    elements.searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const query = elements.searchInput.value;
            searchBooks(query);
        }
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
}

/**
 * Use sample data when GitHub repository is not available
 * This is useful for development or when the content branch doesn't exist yet
 */
function useSampleData() {
    state.categories = ['action', 'romance', 'fantasy', 'sci-fi'];
    
    state.books = [
        {
            title: 'The Last Samurai',
            filename: 'the-last-samurai.md',
            path: 'action/the-last-samurai.md',
            category: 'action',
            url: '#',
            frontmatter: {
                title: 'The Last Samurai',
                author: 'Kenji Yamamoto',
                cover: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                description: 'A tale of honor and courage in feudal Japan.'
            },
            content: '# The Last Samurai\n\nIn the twilight of the samurai era...'
        },
        {
            title: 'Love in Tokyo',
            filename: 'love-in-tokyo.md',
            path: 'romance/love-in-tokyo.md',
            category: 'romance',
            url: '#',
            frontmatter: {
                title: 'Love in Tokyo',
                author: 'Sakura Tanaka',
                cover: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                description: 'A heartwarming romance set in modern Tokyo.'
            },
            content: '# Love in Tokyo\n\nThe cherry blossoms were in full bloom...'
        },
        {
            title: 'Dragon Quest',
            filename: 'dragon-quest.md',
            path: 'fantasy/dragon-quest.md',
            category: 'fantasy',
            url: '#',
            frontmatter: {
                title: 'Dragon Quest',
                author: 'Hiroshi Nakamura',
                cover: 'https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                description: 'An epic adventure in a world of magic and dragons.'
            },
            content: '# Dragon Quest\n\nThe ancient prophecy spoke of a hero...'
        },
        {
            title: 'Cyber Tokyo',
            filename: 'cyber-tokyo.md',
            path: 'sci-fi/cyber-tokyo.md',
            category: 'sci-fi',
            url: '#',
            frontmatter: {
                title: 'Cyber Tokyo',
                author: 'Akira Suzuki',
                cover: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                description: 'A cyberpunk thriller set in futuristic Tokyo.'
            },
            content: '# Cyber Tokyo\n\nThe neon lights of Neo-Tokyo flickered...'
        }
    ];
    
    state.filteredBooks = [...state.books];
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);