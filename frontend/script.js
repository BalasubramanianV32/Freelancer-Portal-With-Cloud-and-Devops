/**
 * QuickGig – Shared JavaScript Utilities
 * script.js
 */

// ===== Helpers =====

/**
 * Validate email format
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Simple delay promise
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Show an alert inside a container element
 * @param {HTMLElement} container
 * @param {'success'|'error'|'info'} type
 * @param {string} message
 */
function showAlert(container, type, message) {
  if (!container) return;
  clearAlerts(container);
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.innerHTML = message;
  container.appendChild(alert);

  // Auto-dismiss success/info after 5s
  if (type === 'success' || type === 'info') {
    setTimeout(() => {
      if (alert.parentNode) alert.remove();
    }, 5000);
  }
}

/**
 * Clear all alerts inside a container
 */
function clearAlerts(container) {
  if (!container) return;
  container.innerHTML = '';
}

// ===== API Layer =====

const BASE_URL = 'http://backend:5000';

/**
 * POST a new job to the backend
 */
async function apiPostJob(jobData) {
  const response = await fetch(`${BASE_URL}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${response.status}`);
  }
  return response.json();
}

/**
 * GET all jobs from the backend
 */
async function apiGetJobs() {
  const response = await fetch(`${BASE_URL}/jobs`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  return Array.isArray(data) ? data : (data.jobs || []);
}

async function loadJobs() {
  const container = document.getElementById("jobsContainer");
  if (!container) return; // Prevent errors if not on the dashboard page

  container.innerHTML = "<p>Loading jobs...</p>";

  try {
    const jobs = await apiGetJobs();

    if (!jobs || jobs.length === 0) {
      container.innerHTML = "<p>No jobs available right now.</p>";
      return;
    }

    container.innerHTML = ""; // Clear loading text

    jobs.forEach(job => {
      const div = document.createElement("div");
      div.className = "job-card"; // Added class for basic styling
      div.innerHTML = `
        <h3>${escapeHtml(job.title)}</h3>
        <p>${escapeHtml(job.description)}</p>
        <p><strong>Budget:</strong> ₹${job.budget}</p>
        <button class="btn btn-primary" onclick="alert('Application functionality coming soon!')">Apply</button>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to load jobs:", err);
    container.innerHTML = "<p style='color: red;'>Failed to load jobs. Ensure backend is running.</p>";
  }
}

// ===== Active Nav Link Highlighting & Initialization =====
document.addEventListener('DOMContentLoaded', () => {
  // Highlight active nav link
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path) {
      link.style.fontWeight = '600';
      link.style.color = 'var(--primary)';
    }
  });

  // Automatically load jobs if jobsContainer is present
  loadJobs();
});