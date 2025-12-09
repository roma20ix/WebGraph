// Конфигурация тем
const topics = ['memloc', 'dfs', 'bfs', 'komp', 'dijkstra', 'floyd', 'bellman', 'topological', 'bipartite', 'mst', 'cycle', 'tree'];
let currentTopic = 'dfs';

// Функция для загрузки контента темы
async function loadTopicData(topic) {
    if (!topics.includes(topic)) return;
    
    currentTopic = topic;
    
    try {
        // Загружаем HTML-файл с данными темы
        const response = await fetch(`data/${topic}.html`);
        if (!response.ok) {
            throw new Error(`Не удалось загрузить данные для ${topic}`);
        }
        const html = await response.text();
        
        // Создаем временный элемент для парсинга HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Извлекаем разделы
        const theorySection = doc.querySelector('.theory-section');
        const visualizationSection = doc.querySelector('.visualization-section');
        const codeSection = doc.querySelector('.code-section');
        
        // Заполняем контент на странице
        if (theorySection) {
            document.querySelector('.theory-content').innerHTML = theorySection.innerHTML;
        }
        
        if (visualizationSection) {
            document.querySelector('.visualization-content').innerHTML = visualizationSection.innerHTML;
        }
        
        if (codeSection) {
            document.querySelector('.code-content').innerHTML = codeSection.innerHTML;
            
            // Добавляем кнопки копирования и подсвечиваем код после загрузки
            addCopyButtons();
            highlightCode();
        }
        
        // Обновляем активную тему в боковой панели
        document.querySelectorAll('.topics a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-topic') === topic) {
                link.classList.add('active');
            }
        });
    } catch (error) {
        console.error('Ошибка загрузки темы:', error);
        document.querySelector('.theory-content').innerHTML = `<p>Ошибка загрузки данных: ${error.message}</p>`;
    }
}

// Функция для добавления кнопок копирования
function addCopyButtons() {
    document.querySelectorAll('.code-block').forEach((block) => {
        // Проверяем, не добавлена ли уже кнопка
        if (block.querySelector('.copy-button')) return;
        
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.title = 'Копировать код';
        
        copyButton.addEventListener('click', () => {
            const code = block.querySelector('code').innerText;
            navigator.clipboard.writeText(code).then(() => {
                // Визуальная обратная связь при копировании
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                copyButton.classList.add('copied');
                
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    copyButton.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Ошибка при копировании: ', err);
                copyButton.innerHTML = '<i class="fas fa-times"></i>';
                
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            });
        });
        
        block.style.position = 'relative';
        block.appendChild(copyButton);
    });
}

// Функция для подсветки кода
function highlightCode() {
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем Highlight.js
    hljs.highlightAll();
    
    // Загружаем данные по умолчанию
    loadTopicData('dfs');
    
    // Обработчики для вкладок
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Убираем активный класс у всех вкладок
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            // Добавляем активный класс текущей вкладке
            this.classList.add('active');
            
            // Скрываем все содержимое вкладок
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Показываем соответствующее содержимое
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Если переключились на вкладку с кодом, переподсвечиваем код
            if (tabId === 'code') {
                setTimeout(() => {
                    addCopyButtons();
                    highlightCode();
                }, 100);
            }
        });
    });
    
    // Обработчики для выбора темы
    document.querySelectorAll('.topics a').forEach(link => {
        link.addEventListener('click', function() {
            const topic = this.getAttribute('data-topic');
            loadTopicData(topic);
        });
    });
});
