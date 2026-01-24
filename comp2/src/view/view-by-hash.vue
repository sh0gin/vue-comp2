<script setup>
const active2 = async () => {
    if (!canv.value) return;
    const c = canv.value, ctx = c.getContext('2d');
    c.width = 1600; c.height = 900; ctx.lineWidth = 20;
    c.onmousedown = () => isMouseDown = true;
    c.onmouseup = () => (isMouseDown = false, ctx.beginPath(), cords.value.push('mouseup'));
    c.onmousemove = e => {
        if (isMouseDown) {
            const p = getMousePos(c, e);
            cords.value.push([p.x, p.y]);
            ctx.lineTo(p.x, p.y); ctx.stroke(); ctx.beginPath();
            ctx.arc(p.x, p.y, 10, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(p.x, p.y);
        }
    };
    document.onkeydown = async e => {
        if (e.key === 's') save();
        if (e.key === 'c') {
            ctx.fillStyle = 'white'; ctx.fillRect(0, 0, c.width, c.height);
            cords.value = []; ctx.beginPath(); ctx.fillStyle = 'black';
            activeDesk.value.structure.objects = [];
            await fetch(`${apiUrl.value}api/board/${activeDesk.value.id}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${activeToken.value}`},
                body: JSON.stringify(activeDesk.value)
            });
        }
    };
};
</script>

<template>
    <header>
        <h1>Просмотр публичной доски</h1>
    </header>
    <nav><a href="index.html">← Назад</a></nav>
    <main>
        <form action="/api/board/view-by-hash" method="GET">
            <label>Хеш: <input name="hash" type="text" required></label><br><br>
            <button type="submit">Открыть</button>
        </form>

        <!-- Макет доски -->
        <div class="canvas-container">
            <div class="canvas">
                <div class="object" style="top: 200px; left: 300px; width: 250px; height: 80px; background: #f1f8e9;">
                    Цитата дня
                </div>
            </div>
        </div>
        <p class="likes">❤️ 42 лайка</p>
        <form action="/api/board/like" method="POST" style="margin-top: 10px;">
            <input type="hidden" name="id" value="5" />
            <button type="submit" disabled>Поставить лайк (требуется вход)</button>
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
</style>