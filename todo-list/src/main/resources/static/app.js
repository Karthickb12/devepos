const apiBase = '/api/todos';

const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

// Fetch and render todos on load
document.addEventListener('DOMContentLoaded', fetchTodos);

addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

async function fetchTodos() {
    try {
        const response = await fetch(apiBase);
        const todos = await response.json();
        renderTodos(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

function renderTodos(todos) {
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        if (todo.completed) li.classList.add('completed');
        
        li.innerHTML = `
            <div class="checkbox" onclick="toggleTodo(${todo.id}, ${!todo.completed}, '${todo.title.replace(/'/g, "\\'")}')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span class="todo-text">${escapeHtml(todo.title)}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
        `;
        todoList.appendChild(li);
    });
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function addTodo() {
    const title = todoInput.value.trim();
    if (!title) return;

    try {
        const response = await fetch(apiBase, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, completed: false })
        });
        
        if (response.ok) {
            todoInput.value = '';
            fetchTodos();
        }
    } catch (error) {
        console.error('Error adding todo:', error);
    }
}

async function toggleTodo(id, newStatus, title) {
    try {
        // Need to send title as well because the PUT endpoint updates the whole object
        const response = await fetch(`${apiBase}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, completed: newStatus })
        });

        if (response.ok) {
            fetchTodos();
        }
    } catch (error) {
        console.error('Error toggling todo:', error);
    }
}

async function deleteTodo(id) {
    try {
        const response = await fetch(`${apiBase}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchTodos();
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}
