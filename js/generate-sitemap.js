/**
 * Sitemap Generator for Anime Book Library
 * 
 * This script fetches all book content from the GitHub repository
 * and generates a sitemap.xml file with URLs for each book.
 * 
 * Usage: Run this script whenever new content is added to update the sitemap.
 */

// Configuration
const REPO_OWNER = 'atrajit-sarkar';
const REPO_NAME = 'AnimeBook';
const CONTENT_BRANCH = 'content';
const BASE_URL = `https://${REPO_OWNER}.github.io/${REPO_NAME}`;
const OUTPUT_FILE = '../sitemap.xml';

// GitHub API URL for fetching content
const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/${CONTENT_BRANCH}?recursive=1`;

/**
 * Fetch all content files from GitHub repository
 * @returns {Promise<Array>} Array of file paths
 */
async function fetchContentFiles() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${data.message}`);
    }
    
    // Filter for markdown files only
    return data.tree
      .filter(item => item.path.endsWith('.md'))
      .map(item => item.path);
  } catch (error) {
    console.error('Error fetching content files:', error);
    return [];
  }
}

/**
 * Generate sitemap XML content
 * @param {Array} files Array of file paths
 * @returns {string} XML content
 */
function generateSitemapXml(files) {
  const today = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add homepage
  xml += '  <url>\n';
  xml += `    <loc>${BASE_URL}/</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += '    <changefreq>weekly</changefreq>\n';
  xml += '    <priority>1.0</priority>\n';
  xml += '  </url>\n';
  
  // Add each book page
  files.forEach(file => {
    // Convert file path to URL path
    // Example: action/my-story.md -> books/action/my-story
    const urlPath = file
      .replace(/\.md$/, '')
      .split('/')
      .join('/');
    
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}/books/${urlPath}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  return xml;
}

/**
 * Write sitemap to file
 * @param {string} xml XML content
 */
function writeSitemapToFile(xml) {
  const fs = require('fs');
  const path = require('path');
  
  try {
    fs.writeFileSync(path.resolve(__dirname, OUTPUT_FILE), xml);
    console.log(`Sitemap generated successfully at ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('Error writing sitemap file:', error);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('Generating sitemap for Anime Book Library...');
  
  const files = await fetchContentFiles();
  console.log(`Found ${files.length} content files`);
  
  const xml = generateSitemapXml(files);
  writeSitemapToFile(xml);
}

// Run the script
main();