// TeuxDeux Clone - JavaScript functionality
class TeuxDeuxApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentWeek = this.getCurrentWeek();
        this.draggedTask = null;
        
        this.init();
    }

    init() {
        this.updateDayDates();
        this.renderAllTasks();
        this.bindEvents();
        console.log('TeuxDeux Clone initialized');
    }

    // Get current week's dates
    getCurrentWeek() {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const monday = new Date(today);
        monday.setDate(today.getDate() - dayOfWeek + 1);
        
        const week = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            week.push(day);
        }
        return week;
    }

    // Update day dates in headers
    updateDayDates() {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        days.forEach((day, index) => {
            const dateElement = document.querySelector(`[data-day="${day}"] .day-date`);
            if (dateElement) {
                const date = this.currentWeek[index];
                const formatted = date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                });
                dateElement.textContent = formatted;
                
                // Highlight today
                if (this.isToday(date)) {
                    dateElement.parentElement.classList.add('today');
                    dateElement.style.color = '#3498db';
                    dateElement.style.fontWeight = '500';
                }
            }
        });
    }

    // Check if date is today
    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    // Load tasks from localStorage
    loadTasks() {
        try {
            const saved = localStorage.getItem('teuxdeux-tasks');
            return saved ? JSON.parse(saved) : {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
                sunday: []
            };
        } catch (error) {
            console.error('Error loading tasks:', error);
            return {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
                sunday: []
            };
        }
    }

    // Save tasks to localStorage
    saveTasks() {
        try {
            localStorage.setItem('teuxdeux-tasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    }

    // Generate unique ID for tasks
    generateId() {
        return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Add new task
    addTask(day, text) {
        if (!text.trim()) return;

        const task = {
            id: this.generateId(),
            text: text.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks[day].push(task);
        this.saveTasks();
        this.renderTasks(day);
        
        // Clear input
        const input = document.querySelector(`[data-day="${day}"] .new-task-input`);
        if (input) {
            input.value = '';
        }

        console.log(`Added task to ${day}:`, task);
    }

    // Delete task
    deleteTask(day, taskId) {
        this.tasks[day] = this.tasks[day].filter(task => task.id !== taskId);
        this.saveTasks();
        this.renderTasks(day);
        console.log(`Deleted task ${taskId} from ${day}`);
    }

    // Toggle task completion
    toggleTask(day, taskId) {
        const task = this.tasks[day].find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks(day);
            console.log(`Toggled task ${taskId} in ${day}:`, task.completed);
        }
    }

    // Update task text
    updateTaskText(day, taskId, newText) {
        const task = this.tasks[day].find(task => task.id === taskId);
        if (task && newText.trim()) {
            task.text = newText.trim();
            this.saveTasks();
            console.log(`Updated task ${taskId} in ${day}:`, task.text);
        }
    }

    // Move task between days
    moveTask(fromDay, toDay, taskId) {
        if (fromDay === toDay) return;

        const taskIndex = this.tasks[fromDay].findIndex(task => task.id === taskId);
        if (taskIndex === -1) return;

        const task = this.tasks[fromDay].splice(taskIndex, 1)[0];
        this.tasks[toDay].push(task);
        this.saveTasks();
        
        this.renderTasks(fromDay);
        this.renderTasks(toDay);
        
        console.log(`Moved task ${taskId} from ${fromDay} to ${toDay}`);
    }

    // Render tasks for a specific day
    renderTasks(day) {
        const container = document.querySelector(`[data-day="${day}"] .tasks-list`);
        if (!container) return;

        const tasks = this.tasks[day] || [];
        
        if (tasks.length === 0) {
            container.innerHTML = '<div class="empty-state">No tasks yet</div>';
            return;
        }

        container.innerHTML = tasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" 
                 data-task-id="${task.id}" 
                 data-day="${day}"
                 draggable="true">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                     data-task-id="${task.id}" 
                     data-day="${day}"></div>
                <div class="task-text" 
                     contenteditable="true" 
                     data-task-id="${task.id}" 
                     data-day="${day}">${this.escapeHtml(task.text)}</div>
                <div class="task-actions">
                    <button class="task-delete" 
                            data-task-id="${task.id}" 
                            data-day="${day}">×</button>
                </div>
            </div>
        `).join('');
    }

    // Render all tasks
    renderAllTasks() {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        days.forEach(day => this.renderTasks(day));
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Clear completed tasks
    clearCompleted() {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        days.forEach(day => {
            this.tasks[day] = this.tasks[day].filter(task => !task.completed);
        });
        this.saveTasks();
        this.renderAllTasks();
        console.log('Cleared all completed tasks');
    }

    // Clear all tasks
    clearAll() {
        if (confirm('Are you sure you want to delete all tasks? This cannot be undone.')) {
            const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            days.forEach(day => {
                this.tasks[day] = [];
            });
            this.saveTasks();
            this.renderAllTasks();
            console.log('Cleared all tasks');
        }
    }

    // Bind event listeners
    bindEvents() {
        // Add task on Enter key
        document.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('new-task-input') && e.key === 'Enter') {
                const day = e.target.dataset.day;
                const text = e.target.value;
                this.addTask(day, text);
            }
        });

        // Handle task interactions using event delegation
        document.addEventListener('click', (e) => {
            // Toggle task completion
            if (e.target.classList.contains('task-checkbox')) {
                const day = e.target.dataset.day;
                const taskId = e.target.dataset.taskId;
                this.toggleTask(day, taskId);
            }

            // Delete task
            if (e.target.classList.contains('task-delete')) {
                const day = e.target.dataset.day;
                const taskId = e.target.dataset.taskId;
                this.deleteTask(day, taskId);
            }

            // Clear completed tasks
            if (e.target.classList.contains('clear-completed')) {
                this.clearCompleted();
            }

            // Clear all tasks
            if (e.target.classList.contains('clear-all')) {
                this.clearAll();
            }
        });

        // Handle task text editing
        document.addEventListener('blur', (e) => {
            if (e.target.classList.contains('task-text')) {
                const day = e.target.dataset.day;
                const taskId = e.target.dataset.taskId;
                const newText = e.target.textContent;
                this.updateTaskText(day, taskId, newText);
            }
        });

        // Handle Enter key in task text editing
        document.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('task-text') && e.key === 'Enter') {
                e.preventDefault();
                e.target.blur();
            }
        });

        // Drag and drop functionality
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('task-item')) {
                this.draggedTask = {
                    id: e.target.dataset.taskId,
                    day: e.target.dataset.day,
                    element: e.target
                };
                e.target.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            }
        });

        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('task-item')) {
                e.target.classList.remove('dragging');
                this.draggedTask = null;
                
                // Remove drop target classes
                document.querySelectorAll('.drop-target').forEach(el => {
                    el.classList.remove('drop-target');
                });
            }
        });

        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (this.draggedTask) {
                e.dataTransfer.dropEffect = 'move';
            }
        });

        document.addEventListener('dragenter', (e) => {
            if (this.draggedTask && e.target.classList.contains('tasks-list')) {
                e.target.classList.add('drop-target');
            }
        });

        document.addEventListener('dragleave', (e) => {
            if (e.target.classList.contains('tasks-list')) {
                e.target.classList.remove('drop-target');
            }
        });

        document.addEventListener('drop', (e) => {
            e.preventDefault();
            
            if (this.draggedTask && e.target.classList.contains('tasks-list')) {
                const targetDay = e.target.dataset.day;
                const sourceDay = this.draggedTask.day;
                const taskId = this.draggedTask.id;
                
                this.moveTask(sourceDay, targetDay, taskId);
                
                // Remove drop target classes
                document.querySelectorAll('.drop-target').forEach(el => {
                    el.classList.remove('drop-target');
                });
            }
        });

        console.log('Event listeners bound');
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.teuxdeux = new TeuxDeuxApp();
});

// Add some demo data if no tasks exist
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const tasks = JSON.parse(localStorage.getItem('teuxdeux-tasks') || '{}');
        const hasAnyTasks = Object.values(tasks).some(dayTasks => dayTasks && dayTasks.length > 0);
        
        if (!hasAnyTasks) {
            console.log('Adding demo tasks...');
            window.teuxdeux.addTask('monday', 'Review GitHub Copilot features');
            window.teuxdeux.addTask('monday', 'Plan weekly sprint');
            window.teuxdeux.addTask('tuesday', 'Team standup meeting');
            window.teuxdeux.addTask('tuesday', 'Code review session');
            window.teuxdeux.addTask('wednesday', 'Implement new features');
            window.teuxdeux.addTask('thursday', 'Write documentation');
            window.teuxdeux.addTask('friday', 'Deploy to production');
            window.teuxdeux.addTask('friday', 'Weekend planning');
        }
    }, 100);
});