<script setup>
import { inject, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const canv = ref()
const apiUrl = inject('apiUrl');
const activeToken = inject('activeToken');
// const activeToken = ref();
const route = useRoute()
const cords = ref([])
const activeDesk = ref();
const hash = ref("");
const socket = ref()
let isMouseDown = false;
let ctx = null

let loaderTrue = ref(false);

const active = async () => {
    if (!canv.value) return;
    // const c = canv.value;
    ctx = canv.value.getContext('2d');
    canv.value.width = 1600; canv.value.height = 900; ctx.lineWidth = 20;
    canv.value.onmousedown = () => isMouseDown = true;
    canv.value.onmouseup = () => (isMouseDown = false, ctx.beginPath(), cords.value.push('mouseup'));
    canv.value.onmousemove = e => {
        if (isMouseDown) {
            const p = getMousePos(canv.value, e);
            cords.value.push([p.x, p.y]);
            ctx.lineTo(p.x, p.y); ctx.stroke(); ctx.beginPath();
            ctx.arc(p.x, p.y, 10, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(p.x, p.y);
        }
    };
    document.onkeydown = async e => {
        if (e.key === 's') {
            save();
        };
        if (e.key === 'c') {
            clear();
        }
    };
};

const save = async () => {
    console.log(JSON.stringify({ ...activeDesk.value, structure: { objects: [...activeDesk.value.structure.objects, ...cords.value] } }));


    if (socket.value?.readyState === WebSocket.OPEN) {
        socket.value.send(JSON.stringify({
            type: 'update_board',
            boardId: activeDesk.value.id,
            token: activeToken.value, // если нужна авторизация
            data: {
                structure: { objects: [...activeDesk.value.structure.objects, ...cords.value] }
            }
        }));
    }
    // await fetch(`${apiUrl.value}api/board/${activeDesk.value.id}`, {
    //     method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${activeToken.value}` },
    //     body: JSON.stringify({ ...activeDesk.value, structure: { objects: [...activeDesk.value.structure.objects, ...cords.value] } })
    // });
}

const clear = async () => {
    ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canv.value.width, canv.value.height);
    cords.value = []; ctx.beginPath(); ctx.fillStyle = 'black';
    activeDesk.value.structure.objects = [];
    await fetch(`${apiUrl.value}api/board/${activeDesk.value.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${activeToken.value}` },
        body: JSON.stringify(activeDesk.value)
    });
}

const getMousePos = (canvas, evt) => {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

const findDesk = async () => {
    activeDesk.value = null;

    const response = await fetch(`${apiUrl.value}api/board/public/${hash.value}`, {
        headers: { 'Authorization': `Bearer ${activeToken.value}` }
    });


    const result = await response.json();

    if (result.code != 404) {
        loaderTrue.value = true;
        activeDesk.value = result.board;
        activeDesk.value.structure = JSON.parse(activeDesk.value.structure);
        let old_coords = [...activeDesk.value.structure.objects];

        let timer = setTimeout(function tmp() {
            const crd = activeDesk.value.structure.objects.shift()
            if (!crd) {
                clearTimeout(timer);
                ctx.beginPath();
                activeDesk.value.structure.objects = old_coords;
                old_coords = "";
                loaderTrue.value = false;
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

const tooglePublic = async () => {
    console.log(activeDesk.value);
}

const connect = () => {
    socket.value = new WebSocket('ws://localhost:8080'); // Замени на свой URL

    socket.value.onopen = () => {
        console.log('Соединение установлено');
    };

    socket.value.onmessage = (event) => {
        const data = JSON.parse(event.data);
        messages.value.push(data);
    };

    socket.value.onclose = () => {
        console.log('Соединение закрыто');
    };

    socket.value.onerror = (error) => {
        console.error('Ошибка WebSocket:', error);
    };
};



onMounted(() => {
    connect();
    if (route.query['hash']) {
        hash.value = route.query['hash'];
        findDesk();
    };

    (async () => await active())()
})

onUnmounted(() => {
    if (socket.value) {
        socket.value.close();
    }
});

</script>

<template>
    <header>
        <h1>Просмотр доски</h1>
    </header>
    <nav><a href="index.html">← Назад</a></nav>
    <main class="main-layout">
        <form @submit.prevent="findDesk()">
            <label>Hash доски: <input v-model="hash" name="id" required></label><br><br>
            <span v-if="!activeDesk">Доска не найдена</span>
            <button type="submit">Показать</button>
        </form>

        <div v-show="loaderTrue" class="loader">
            <div class="spinner"></div>
            <p>Загрузка...</p>
        </div>

        <!-- Блоки слева -->
        <aside class="side-blocks">
            <div class="board-info" v-show="activeDesk">
                <h3>Информация о доске</h3>
                <p>
                    <strong>Название:</strong>
                    <span>{{ activeDesk?.title || 'Без названия' }}</span>
                </p>
                <button class="black">{{ activeDesk?.is_public ? 'Сделать приватной' : 'Сделать публичной' }}</button>
                <button class="black" @click="save">Сохранить</button>
                <button class="black" @click="clear">Очистить</button>
            </div>

            <div class="tools-panel">
                <h3>Инструменты</h3>
                <button class="black" @click="addShape('rect')">Добавить элемент курса</button>
                <button class="black" @click="addShape('circle')">Круг</button>
                <button class="black" @click="addShape('line')">Линия</button>
                <button class="black" @click="addText">Текст</button>
                <button class="black" @click="uploadImage">Вставить изображение</button>
            </div>
        </aside>

        <!-- Канвас на всю оставшуюся часть -->
<!--        <div class="canvas-container">-->
<!--            <div class="canvas-wrapper">-->
<!--                <canvas class="canvas" ref="canv"></canvas>-->
<!--            </div>-->
<!--        </div>-->
    </main>
</template>


<style scoped>
.black {
    color: black;
}

.main-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 20px;
    box-sizing: border-box;
}

form {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    z-index: 10;
}

.side-blocks {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 250px;
    position: fixed;
    left: 20px;
    top: 150px;
    z-index: 5;
}

.board-info,
.tools-panel {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
    width: 250px;
}

.tools-panel button,
.board-info button {
    width: 100%;
    margin-bottom: 10px;
    padding: 8px;
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #f9f9f9;
}

.canvas-container {
    flex: 1;
    /* margin-left: 290px; */
    margin-top: 20px;
    overflow: hidden;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #fff;
    width: 100vh;
}

.canvas-wrapper {
    display: inline-block;
    background: #fafafa;
    border: 2px dashed #ccc;
}

.canvas {
    width: 1600px;
    height: 900px;
    background: #fafafa;
    display: block;
}

.loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: rgba(255, 255, 255, 0.8);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>