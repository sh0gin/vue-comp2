<script setup>

</script>

<template>
    <header>
        <h1>Просмотр доски</h1>
    </header>
    <nav><a href="index.html">← Назад</a></nav>
    <main>
        <form action="/api/board/view" method="GET">
            <label>ID доски: <input name="id" type="number" required></label><br><br>
            <button type="submit">Показать</button>
        </form>

        <!-- Пример макета доски -->
        <div class="canvas-container">
            <div class="canvas">
                <div class="object focused" style="top: 100px; left: 200px; width: 200px; height: 100px;">
                    Прямоугольник
                    <div class="object-label">Редактирует: Алексей</div>
                </div>
                <div class="object"
                    style="top: 300px; left: 500px; width: 150px; height: 150px; border-radius: 50%; background: #e3f2fd;">
                    Круг
                </div>
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

.canvas-container {
    overflow: auto;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin: 20px 0;
    background: #fff;
}

.canvas {
    width: 1600px;
    height: 900px;
    position: relative;
    background: #fafafa;
    border: 2px dashed #ccc;
}

.object {
    position: absolute;
    padding: 8px;
    border: 2px solid transparent;
    border-radius: 4px;
    background: white;
}

.object.focused {
    border-color: #42b883;
    box-shadow: 0 0 0 2px rgba(66, 184, 131, 0.3);
}

.object-label {
    font-size: 0.85rem;
    color: #666;
    margin-top: 4px;
}
</style>