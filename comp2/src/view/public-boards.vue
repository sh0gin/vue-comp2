<script setup>

</script>

<template>
    <header>
        <h1>Публичные доски</h1>
    </header>
    <nav><a href="index.html">← Назад</a></nav>
    <main>
        <div class="filters">
            <label>Фильтр по лайкам:</label>
            <select>
                <option>Все</option>
                <option>Более 10</option>
                <option>Более 50</option>
            </select>
            <button disabled>Применить</button>
        </div>
        <div class="board-list">
            <div class="board-item">
                <h3>Вдохновение</h3>
                <p class="likes">❤️ 42</p>
                <a href="view-by-hash.html?hash=hash123">Просмотреть</a>
            </div>
            <div class="board-item">
                <h3>UI Kit 2026</h3>
                <p class="likes">❤️ 128</p>
                <a href="view-by-hash.html?hash=hash456">Просмотреть</a>
            </div>
        </div>
    </main>
</template>

<style scoped>
body {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background: #f9f9f9;
    color: #333;
}

header h1 {
    color: #2c3e50;
    border-bottom: 2px solid #3498db;
    padding-bottom: 10px;
}

nav {
    margin: 15px 0;
}

nav a {
    color: #3498db;
    text-decoration: none;
}

nav a:hover {
    text-decoration: underline;
}

.filters {
    margin-bottom: 20px;
}

select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    margin-right: 10px;
}

.board-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
}

.board-item {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 16px;
    background: white;
}

.board-item h3 {
    margin-bottom: 8px;
}

.likes {
    color: #e74c3c;
    font-weight: bold;
}
</style>