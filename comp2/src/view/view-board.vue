<script setup>
import { inject, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const canv = ref()
const apiUrl = inject('apiUrl');
const activeToken = inject('activeToken');
const route = useRoute()
const cords = ref([])
const activeDesk = ref();
const hash = ref("");

let isMouseDown = false;
let ctx = null


const active = async () => {
    if (!canv.value) return;
    const c = canv.value; 
    ctx = c.getContext('2d');
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

function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

async function findDesk() {

    activeDesk.value = null;
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${activeToken.value}`);

    const raw = JSON.stringify({
        hash: hash.value,
    })

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    }

    let response = await fetch(`${apiUrl.value}api/board/public/${hash.value}`, requestOptions);
    const result = await response.json();
    if (result.code == 404) {
        activeDesk.value = null;
    } else {
        activeDesk.value = result.board;
        let old_coords = [...activeDesk.value.structure.objects];

        let timer = setTimeout(function tmp() {
            const crd = activeDesk.value.structure.objects.shift()
            if (!crd) {
                clearTimeout(timer);
                ctx.beginPath();
                activeDesk.value.structure.objects = old_coords;
                old_coords = "";
                return;
            }

            const pos = {
                x: crd['0'],
                y: crd['1'],
            }

            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
            ctx.fill()

            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y)
            timer = setTimeout(tmp, 1)

        }, 1)
        active()
    }
}

async function save() {
    activeDesk.value.structure.objects.push(...cords.value);


    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${activeToken.value}`);

    const raw = JSON.stringify(activeDesk.value)
    const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
    }

    let response = await fetch(`${apiUrl.value}api/board/${activeDesk.value.id}`, requestOptions);
    const result = await response.json();
}



onMounted(() => {
    if (route.query['hash']) {
        hash.value = route.query['hash'];
        findDesk();
    };

    (async () => await active())()
})

onUnmounted(() => {
    // console.log('123123123');
    
})
// let ctx = canv.getContext('2d');

// canv.width
</script>

<template>
    <header>
        <h1>Просмотр доски</h1>
    </header>
    <nav><a href="index.html">← Назад</a></nav>
    <main>
        <form @submit.prevent="findDesk()">
            <label>Hash доски: <input v-model="hash" name="id" required></label><br><br>
            <span v-if="!activeDesk">Доска не найдена</span>
            <button type="submit">Показать</button>
        </form>

        <!-- Пример макета доски -->
        <div class="canvas-container">
            <canvas class="canvas" ref="canv">

                <!-- <div class="object focused" style="top: 100px; left: 200px; width: 200px; height: 100px;">
                    Прямоугольник
                    <div class="object-label">Редактирует: Алексей</div>
                </div>
                <div class="object"
                    style="top: 300px; left: 500px; width: 150px; height: 150px; border-radius: 50%; background: #e3f2fd;">
                    Круг
                </div> -->
            </canvas>
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
    /* overflow: auto; */
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin: 20px 0;
    background: #fff;
    position: absolute;
    left: 50px;
    padding-bottom: 50px;
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