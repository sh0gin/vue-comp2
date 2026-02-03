<script setup>

</script>

<template>
    <header>
        <h1>Обновить доску</h1>
    </header>
    <nav><a href="index.html">← Назад</a></nav>
    <main>
        <form action="/api/board/update" method="POST">
            <label>ID доски: <input name="id" type="number" required></label><br><br>
            <label>Новое название: <input name="title" type="text"></label><br><br>
            <label>
                Публичная:
                <select name="is_public">
                    <option value="0">Нет</option>
                    <option value="1">Да</option>
                </select>
            </label><br><br>
            <button type="submit">Обновить</button>
        </form>
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

form {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

label {
    display: block;
    margin: 10px 0 5px;
}

input,
select,
button {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

button {
    background: #3498db;
    color: white;
    cursor: pointer;
    font-weight: bold;
}

button:hover {
    background: #2980b9;
}
</style>