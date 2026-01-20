<script setup>

</script>

<template>
    <header>
        <h1>Доски</h1>
    </header>
    <nav>
        <ul>
            <li><a href="register.html">Регистрация</a></li>
            <li><a href="login.html">Вход</a></li>
            <li><a href="create-board.html">Создать доску</a></li>
            <li><a href="public-boards.html">Публичные доски</a></li>
        </ul>
    </nav>
    <main>
        <p>Добро пожаловать! Используйте меню выше для навигации.</p>
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

ul {
    list-style: none;
    padding: 0;
}

li {
    display: inline;
    margin-right: 15px;
}
</style>