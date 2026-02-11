// Application State
let appState = {
    currentCategory: 'MS_SQL',
    topics: {},
    progress: {},
    theme: 'light'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadProgress();
    fetchTopics();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Category Buttons (delegated listener)
    document.getElementById('categoryNav').addEventListener('click', (e) => {
        const btn = e.target.closest('.category-btn');
        if (btn) {
            switchCategory(btn.dataset.category);
        }
    });
    
    // Theme Toggle
    document.getElementById('themeToggle').addEventListener('change', toggleTheme);
    
    // Action Buttons
    document.getElementById('importBtn').addEventListener('click', triggerImport);
    document.getElementById('exportBtn').addEventListener('click', exportProgress);
    document.getElementById('resetBtn').addEventListener('click', resetProgress);
    
    // File Input
    document.getElementById('fileInput').addEventListener('change', handleFileImport);
    
    // Sidebar Toggle (Mobile)
    document.getElementById('toggleSidebar').addEventListener('click', toggleSidebar);
    
    // Close sidebar when clicking on main content (mobile)
    document.querySelector('.main-content').addEventListener('click', closeSidebar);
}

// Fetch Topics Data
async function fetchTopics() {
    try {
        // Try to load from data/topics.json
        const response = await fetch('../data/topics.json');
        if (!response.ok) throw new Error('Failed to fetch topics');
        appState.topics = await response.json();
        renderCategoryNavigation();
        renderCategory('MS_SQL');
    } catch (error) {
        console.error('Error loading topics:', error);
        showToast('Error loading topics. Please check the data file.', 'error');
        // Provide fallback data
        appState.topics = getDefaultTopics();
        renderCategoryNavigation();
        renderCategory('MS_SQL');
    }
}

// Get Default Topics (Fallback)
function getDefaultTopics() {
    return {
        "MS_SQL": [
            { "Phase-1.0": { "Topic": "SQL Server Architecture", "Sub-Topics": ["SQL Server service architecture","Database engine vs SQL OS","SQLOS schedulers","Worker threads","Memory clerks"] } },
            { "Phase-2.0": { "Topic": "Storage & Files", "Sub-Topics": ["MDF vs LDF","Data file internals","Log file internals","VLFs","Autogrowth strategy"] } }
        ],
        "ORACLE": [
            { "Phase-1.0": { "Topic": "Oracle Architecture", "Sub-Topics": ["Oracle instance vs database","SGA components","PGA","Background processes"] } }
        ],
        "SSIS": [
            { "Phase-1.0": { "Topic": "SSIS Fundamentals", "Sub-Topics": ["What SSIS is","ETL vs ELT","SSIS architecture"] } }
        ],
        "SSRS": [
            { "Phase-1.0": { "Topic": "SSRS Fundamentals", "Sub-Topics": ["What SSRS is","SSRS architecture","Report Server vs Report Manager"] } }
        ]
    };
}

// Render Category Navigation Dynamically
function renderCategoryNavigation() {
    const nav = document.getElementById('categoryNav');
    nav.innerHTML = Object.keys(appState.topics).map((category, index) => {
        const label = getCategoryLabel(category);
        const icon = getCategoryIcon(category);
        const isActive = category === 'MS_SQL' ? 'active' : '';
        return `
            <button class="category-btn ${isActive}" data-category="${category}" title="${label}">
                <span class="icon">${icon}</span>
                <span class="label">${label}</span>
            </button>
        `;
    }).join('');
}

// Switch Category
function switchCategory(category) {
    appState.currentCategory = category;
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    renderCategory(category);
    closeSidebar();
}

// Render Category Topics
function renderCategory(category) {
    const container = document.getElementById('topicsContainer');
    const titleElement = document.getElementById('categoryTitle');
    const descElement = document.getElementById('categoryDescription');
    
    titleElement.textContent = getCategoryLabel(category);
    descElement.textContent = getCategoryDescription(category);
    
    const topics = appState.topics[category] || [];
    
    if (topics.length === 0) {
        container.innerHTML = '<p class="loading">No topics found</p>';
        return;
    }
    
    container.innerHTML = topics.map((topicObj, index) => {
        const phaseKey = Object.keys(topicObj)[0];
        const phaseData = topicObj[phaseKey];
        const topicTitle = phaseData.Topic;
        const subTopics = phaseData['Sub-Topics'] || [];
        
        const topicId = `${category}-${phaseKey}`;
        const completedCount = countCompletedSubtopics(topicId);
        const totalCount = subTopics.length;
        const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        
        return `
            <div class="topic-card">
                <div class="topic-header">
                    <span class="phase-badge">${phaseKey}</span>
                    <span class="topic-title">${topicTitle}</span>
                    <div class="completion-percentage">
                        <div class="value">${completionPct}%</div>
                        <div class="label">complete</div>
                    </div>
                </div>
                <div class="subtopics-list">
                    ${subTopics.map((subtopic, idx) => {
                        const subtopicId = `${topicId}-${idx}`;
                        const isChecked = isSubtopicCompleted(subtopicId);
                        return `
                            <div class="subtopic-item">
                                <input type="checkbox" id="${subtopicId}" ${isChecked ? 'checked' : ''} 
                                       onchange="toggleSubtopic('${subtopicId}')">
                                <label for="${subtopicId}">${subtopic}</label>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');
    
    updateProgressStats();
}

// Toggle Subtopic Completion
function toggleSubtopic(subtopicId) {
    const checkbox = document.getElementById(subtopicId);
    if (!appState.progress[subtopicId]) {
        appState.progress[subtopicId] = {};
    }
    appState.progress[subtopicId].completed = checkbox.checked;
    saveProgress();
    updateProgressStats();
    
    // Re-render to update completion percentages
    renderCategory(appState.currentCategory);
}

// Check if Subtopic is Completed
function isSubtopicCompleted(subtopicId) {
    return appState.progress[subtopicId]?.completed || false;
}

// Count Completed Subtopics in Topic
function countCompletedSubtopics(topicId) {
    return Object.keys(appState.progress).filter(key => 
        key.startsWith(topicId) && appState.progress[key].completed
    ).length;
}

// Update Progress Statistics
function updateProgressStats() {
    const totalCompletedCount = Object.keys(appState.progress).filter(
        key => appState.progress[key].completed
    ).length;
    
    let totalCount = 0;
    const topics = appState.topics[appState.currentCategory] || [];
    topics.forEach(topicObj => {
        const phaseData = Object.values(topicObj)[0];
        totalCount += (phaseData['Sub-Topics'] || []).length;
    });
    
    const allTopics = appState.topics;
    let grandTotal = 0;
    Object.keys(allTopics).forEach(category => {
        const categoryTopics = allTopics[category] || [];
        categoryTopics.forEach(topicObj => {
            const phaseData = Object.values(topicObj)[0];
            grandTotal += (phaseData['Sub-Topics'] || []).length;
        });
    });
    
    const allCompleted = Object.keys(appState.progress).filter(
        key => appState.progress[key].completed
    ).length;
    
    document.getElementById('completedCount').textContent = allCompleted;
    document.getElementById('totalCount').textContent = grandTotal;
    
    const percentage = grandTotal > 0 ? Math.round((allCompleted / grandTotal) * 100) : 0;
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressPercentage').textContent = percentage + '%';
}

// Toggle Theme
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    appState.theme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', appState.theme);
}

// Load Theme Preference
function loadTheme() {
    const storedTheme = localStorage.getItem('theme') || 'light';
    appState.theme = storedTheme;
    
    if (storedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').checked = true;
    }
}

// Save Progress to Local Storage
function saveProgress() {
    localStorage.setItem('progress', JSON.stringify(appState.progress));
}

// Load Progress from Local Storage
function loadProgress() {
    const saved = localStorage.getItem('progress');
    if (saved) {
        appState.progress = JSON.parse(saved);
    }
}

// Import Progress
function triggerImport() {
    document.getElementById('fileInput').click();
}

// Handle File Import
function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.topics) {
                appState.topics = data.topics;
                localStorage.setItem('topics', JSON.stringify(appState.topics));
            }
            
            if (data.progress) {
                appState.progress = data.progress;
                saveProgress();
            }
            
            renderCategory(appState.currentCategory);
            updateProgressStats();
            showToast('Learning path imported successfully!', 'success');
        } catch (error) {
            showToast('Error importing file. Please ensure it is valid JSON.', 'error');
            console.error('Import error:', error);
        }
    };
    reader.readAsText(file);
    
    event.target.value = '';
}

// Export Progress
function exportProgress() {
    const exportData = {
        exportDate: new Date().toISOString(),
        topics: appState.topics,
        progress: appState.progress
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `learning-progress-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('Progress exported successfully!', 'success');
}

// Reset Progress
function resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
        appState.progress = {};
        saveProgress();
        renderCategory(appState.currentCategory);
        updateProgressStats();
        showToast('Progress reset successfully!', 'success');
    }
}

// Toggle Sidebar (Mobile)
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('open');
}

// Close Sidebar (Mobile)
function closeSidebar() {
    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.remove('open');
    }
}

// Show Toast Notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Get Category Label
function getCategoryLabel(category) {
    const labels = {
        'MS_SQL': 'MS SQL Server',
        'ORACLE': 'Oracle',
        'SSIS': 'SSIS',
        'SSRS': 'SSRS',
        'AWS_CLOUD': 'AWS Cloud',
        'AI': 'AI Fundamentals',
        'AI_in_DBA': 'AI in DBA'
    };
    return labels[category] || category;
}

// Get Category Icon
function getCategoryIcon(category) {
    const icons = {
        'MS_SQL': '🗄️',
        'ORACLE': '🔴',
        'SSIS': '📦',
        'SSRS': '📊',
        'AWS_CLOUD': '☁️',
        'AI': '🤖',
        'AI_in_DBA': '🧠'
    };
    return icons[category] || '📚';
}

// Get Category Description
function getCategoryDescription(category) {
    const descriptions = {
        'MS_SQL': 'Master MS SQL Server architecture, performance tuning, and enterprise operations',
        'ORACLE': 'Learn Oracle database fundamentals, architecture, and advanced administration',
        'SSIS': 'Explore SQL Server Integration Services for ETL and data pipeline development',
        'SSRS': 'Discover SQL Server Reporting Services for building and managing reports',
        'AWS_CLOUD': 'Master AWS cloud infrastructure, databases, and enterprise patterns',
        'AI': 'Learn AI fundamentals, LLM usage, and prompting techniques for productivity',
        'AI_in_DBA': 'Discover how to leverage AI tools for DBA tasks and operations'
    };
    return descriptions[category] || '';
}

// Handle Resize for Responsive Sidebar
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.querySelector('.sidebar').classList.remove('open');
    }
});
