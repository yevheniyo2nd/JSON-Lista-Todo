// URL адрес для работы с задачами на сервере
const todosEndpoint = 'http://localhost:3002/todos';

// Create - POST
// Функция для добавления новой задачи на сервер
async function addTodo(todo) {
    try {
        const response = await fetch(todosEndpoint, {
            method: 'POST', // Метод POST для создания новой задачи
            headers: {
                'Content-Type': 'application/json', // Указываем тип содержимого как JSON
            },
            body: JSON.stringify(todo), // Преобразуем задачу в JSON и отправляем
        });
        const newTodo = await response.json(); // Получаем добавленную задачу из ответа
        return newTodo; // Возвращаем добавленную задачу
    } catch (error) {
        console.error('Ошибка при добавлении задачи:', error); // В случае ошибки логируем её
    }
}

// Read - GET
// Функция для получения всех задач с сервера
async function fetchTodos() {
    try {
        const response = await fetch(todosEndpoint); // Выполняем GET запрос
        const todos = await response.json(); // Получаем список задач из ответа
        return todos; // Возвращаем список задач
    } catch (error) {
        console.error('Ошибка при получении задач:', error); // Логируем ошибку, если что-то пошло не так
        return []; // Возвращаем пустой массив в случае ошибки
    }
}

// Update - PUT
// Функция для обновления задачи на сервере
async function updateTodo(todo) {
    try {
        await fetch(`${todosEndpoint}/${todo.id}`, {
            method: 'PUT', // Метод PUT для обновления задачи
            headers: {
                'Content-Type': 'application/json', // Указываем тип содержимого как JSON
            },
            body: JSON.stringify(todo), // Преобразуем задачу в JSON и отправляем
        });
    } catch (error) {
        console.error('Ошибка при обновлении задачи:', error); // Логируем ошибку, если что-то пошло не так
    }
}

// Delete - DELETE
// Функция для удаления задачи с сервера
async function deleteTodo(id) {
    try {
        await fetch(`${todosEndpoint}/${id}`, {
            method: 'DELETE', // Метод DELETE для удаления задачи
        });
    } catch (error) {
        console.error('Ошибка при удалении задачи:', error); // Логируем ошибку, если что-то пошло не так
    }
}

// Функция для инициализации списка задач при загрузке страницы
async function initTodoList() {
    const todos = await fetchTodos(); // Получаем текущие задачи с сервера
    const todoList = document.getElementById('container_down'); // Находим элемент списка в DOM
    todoList.innerHTML = ''; // Очищаем текущий список

    // Создаём элемент для каждой задачи и добавляем их в список
    todos.forEach(todo => {
        const todoItem = createTodoElement(todo); // Создаём элемент задачи
        todoList.appendChild(todoItem); // Добавляем элемент в список
    });
}

// LI + x/✔
function createTodoElement(todo) {
    const div = document.createElement('div'); // Создаём div элемент для задачи
    div.classList.add('todo-item'); // Добавляем класс для задачи
    if (todo.completed) { // Если задача выполнена, добавляем класс 'completed'
        div.classList.add('completed');
    }

    const nameDiv = document.createElement('div'); // Создаём div элемент для имени
    nameDiv.textContent = todo.title; // Устанавливаем текст задачи
    nameDiv.classList.add('name');

    const buttonsContainer = document.createElement('div'); // Создаём контейнер для кнопок
    buttonsContainer.classList.add('buttons-container');

    const deleteButton = document.createElement('div'); // Создаём кнопку удаления
    deleteButton.textContent = '⤬'; // Устанавливаем текст кнопки
    deleteButton.classList.add('button', 'delete');
    deleteButton.onclick = async () => {
        await deleteTodo(todo.id); // Удаляем задачу при клике на кнопку
        div.remove(); // Удаляем элемент из DOM
    };

    const completeButton = document.createElement('div'); // Создаём кнопку завершения
    completeButton.textContent = todo.completed ? '⚫' : '⚪'; // Устанавливаем текст кнопки
    completeButton.classList.add('button', 'complete');
    completeButton.onclick = async () => {
        div.classList.toggle('completed'); // Отмечаем задачу как выполненную
        todo.completed = !todo.completed; // Переключаем состояние задачи
        await updateTodo(todo); // Обновляем задачу на сервере

        // Переключаем текст кнопки
        completeButton.textContent = todo.completed ? '⚫' : '⚪';
    };

    buttonsContainer.appendChild(completeButton); // Добавляем кнопку завершения в контейнер кнопок
    buttonsContainer.appendChild(deleteButton); // Добавляем кнопку удаления в контейнер кнопок

    div.appendChild(nameDiv); // Добавляем div с именем в элемент задачи
    div.appendChild(buttonsContainer); // Добавляем контейнер кнопок в элемент задачи

    return div; // Возвращаем элемент задачи
}

// ADD li
document.getElementById('addTodoButton').onclick = async () => {
    const todoInput = document.getElementById('todoInput'); // Находим элемент ввода
    const newTodoTitle = todoInput.value.trim(); // Получаем и очищаем значение ввода

    if (newTodoTitle) {
        const newTodo = await addTodo({ title: newTodoTitle, completed: false }); // Добавляем задачу на сервер
        const todoList = document.getElementById('container_down'); // Находим элемент списка
        const newTodoElement = createTodoElement(newTodo); // Создаём элемент для новой задачи
        todoList.appendChild(newTodoElement); // Добавляем элемент в список
        todoInput.value = ''; // Очищаем поле ввода
    }
};

// Инициализация списка задач при загрузке страницы
window.onload = initTodoList; // Выполняем инициализацию при загрузке страницы