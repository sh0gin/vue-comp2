<script setup>
import {inject, onMounted, onUnmounted, ref, watch, watchEffect} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import Router from "@/router/index.js";

const apiUrl = inject('apiUrl');
const activeToken = inject('activeToken');
const route = useRoute()
const cords = ref([])
const activeDesk = ref();
const id = ref("");
const socket = ref()
let loaderTrue = ref(false);
const elementCounter = ref(0) // Для генерации уникальных ID
const deskElements = ref({
  "objects": []
})
const messages = ref([]);
const editingElement = ref(null)
const showEditModal = ref(false)
const router = useRouter()

// MODAL
const openEditModal = (element) => {
  editingElement.value = {...element}
  showEditModal.value = true
}

const saveElementChanges = async () => {
  const index = deskElements.value.objects.findIndex(el => el.id === editingElement.value.id)
  if (index !== -1) {
    editingElement.value.dateUpdated = new Date().toISOString()
    deskElements.value.objects[index] = {...editingElement.value};
    try {
      const response = await fetch(`${apiUrl.value}api/courses/${activeDesk.value.course.id}/element/${deskElements.value.objects[index].id}`, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${activeToken.value}`,
          "Content-Type": 'application/json',
        },
        body:
            JSON.stringify({
              structure: deskElements.value.objects[index]
            }),
      })
      const result = await response.json();
    } catch(e) {
      console.log(e)
    }
  }
  showEditModal.value = false
  editingElement.value = null


} // DONE

const cancelEdit = () => {
  showEditModal.value = false
  editingElement.value = null
} // DONE

const addElem = async () => {
  // router.push('/element')
  elementCounter.value++;
  const now = new Date().toISOString();

  const newElement = {


    id: elementCounter.value,
    width: 250,
    height: 400,
    left: Math.random() * 200 + 50, // Случайная позиция
    top: Math.random() * 200 + 50,
    backgroundColor: '#ffffff',
    borderColor: '#333333',
    borderWidth: 2,
    title: `Элемент ${elementCounter.value}`,
    contentTitle: `Заголовок элемента ${elementCounter.value}`, // Заголовок
    mainContentUrl: 'Ссылка на основной контент', // Ссылка на основной контент
    fileUrl: 'Ссылканафайл', // Ссылка на файл
    dateAdded: now, // Дата добавления
    dateUpdated: now, // Дата обновления
    isViewed: false, // Статус просмотра
    isVisible: true,
    tutorComment: 'Это коментарий от тьютора' // Комментарий тьютора
  };
  try {
    const response = await fetch(`${apiUrl.value}api/courses/${activeDesk.value.course.id}/new-element`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${activeToken.value}`,
        "Content-Type": 'application/json',
      },
      body:
          JSON.stringify({
            structure: newElement
          }),
    })

    const result = await response.json();

    newElement.id = result.data.id;

    const response2 = await fetch(`${apiUrl.value}api/courses/${activeDesk.value.course.id}/element/${result.data.id}`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${activeToken.value}`,
        "Content-Type": 'application/json',
      },
      body:
          JSON.stringify({
            structure: newElement
          }),
    })

    const result2 = await response2.json();

    deskElements.value.objects.push(newElement);

  } catch (e) {
    console.log(e)
  }


} // DONE

const save = async () => {
  console.log(JSON.stringify({
    ...activeDesk.value,
    structure: {objects: [...activeDesk.value.structure.objects, ...cords.value]}
  }));


  if (socket.value?.readyState === WebSocket.OPEN) {
    socket.value.send(JSON.stringify({
      type: 'update_board',
      boardId: activeDesk.value.id,
      token: activeToken.value, // если нужна авторизация
      data: {
        structure: {objects: [...activeDesk.value.structure.objects, ...cords.value]}
      }
    }));
  }
}

const removeElement = async (id) => {
  deskElements.value.objects = deskElements.value.objects.filter(el => el.id !== id);

  try {
    const response = await fetch(`${apiUrl.value}api/courses/${activeDesk.value.id}/element/${id}/del`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${activeToken.value}`,
        "Content-Type": 'application/json',
      }
    })
    console.log(response)
  } catch(e) {
    console.log(e)
  }

  cancelEdit()
} // DONE

const toggleVisibility = (element) => { // DONE
  element.isVisible = !element.isVisible
  element.dateUpdated = new Date().toISOString()
  editingElement.value = element;
  saveElementChanges();

}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
} // DONE

const findDesk = async () => {
  activeDesk.value = null;
  loaderTrue.value = true;
  try {
    const response = await fetch(`${apiUrl.value}api/courses/${id.value}`, {
      headers: {'Authorization': `Bearer ${activeToken.value}`}
    });
    const result = await response.json();
    activeDesk.value = result.data;
    const response2 = await fetch(`${apiUrl.value}api/courses/get-elements/${id.value}`, {
      headers: {'Authorization': `Bearer ${activeToken.value}`}
    });
    const result2 = await response2.json();
    deskElements.value.objects = result2.data.map((elem) => elem.structure);
    loaderTrue.value = false;

  } catch (e) {
    console.log(e);
  } finally {
    loaderTrue.value = false;
  }
} //DONE

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
}; // DONE websocket

const tooglePublic = async () => {
  try {
    const response = await fetch(`${apiUrl.value}api/courses/${activeDesk.value.course.id}`, {
      'method': 'PATCH',
      headers: {
        'Authorization': `Bearer ${activeToken.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_public: !activeDesk.value.course.is_public
      })
    });

    const result = await response.json();
    if (result.code == 200) {
      activeDesk.value.course.is_public = !activeDesk.value.course.is_public
    }
  } catch(e) {
    console.log(e)
  }
} // DONE


onMounted(async () => {
  connect();
  if (route.params.id) {
    id.value = route.params.id;
    await findDesk();
  };

  // (async () => await active())()
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.close();
  }
});

watch(
    () => messages.value,
    (val) => {
      console.log(val)
    }, {
      deep: true,
    })

</script>

<template>
  <header>
    <h1>Просмотр доски</h1>
  </header>
  <main class="main-layout">

    <div v-show="loaderTrue" class="loader">
      <div class="spinner"></div>
      <p>Загрузка...</p>
    </div>

    <!-- Блоки слева -->
    <aside class="side-blocks">
      <div class="board-info" v-show="activeDesk" v-if="!showEditModal">
        <h3>Информация о доске</h3>
        <p>
          <strong>Название:</strong>
          <span>{{ activeDesk?.course.title || 'Без названия' }}</span>
        </p>
        <button class="black" @click="tooglePublic">{{ activeDesk?.course.is_public ? 'Сделать приватной' : 'Сделать публичной' }}</button>
        <button class="black" @click="save">Сохранить</button>
      </div>

      <div class="tools-panel" v-if="!showEditModal">
        <h3>Инструменты</h3>
        <button class="black" @click="addElem">Добавить элемент курса</button>
      </div>
      <div v-if="showEditModal" class="edit-modal-overlay" @click="cancelEdit">
        <div class="edit-modal" @click.stop>
          <h3>Редактировать элемент</h3>
          <div class="edit-form">
            <input v-model="editingElement.title" placeholder="Название">
            <input v-model="editingElement.contentTitle" placeholder="Заголовок">
            <input v-model="editingElement.mainContentUrl" placeholder="Ссылка на контент">
            <input v-model="editingElement.fileUrl" placeholder="Ссылка на файл">
            <input v-model.number="editingElement.width" type="number" placeholder="Ширина">
            <input v-model.number="editingElement.height" type="number" placeholder="Высота">
            <input v-model.number="editingElement.left" type="number" placeholder="X">
            <input v-model.number="editingElement.top" type="number" placeholder="Y">
            <input v-model="editingElement.backgroundColor" type="color" placeholder="Цвет фона">
            <input v-model="editingElement.borderColor" type="color" placeholder="Цвет границы">
            <textarea v-model="editingElement.tutorComment" placeholder="Комментарий"></textarea>
            <div>
              <button @click="saveElementChanges">Сохранить</button>
              <button @click="cancelEdit">Отмена</button>
            </div>
          </div>
        </div>
      </div>
    </aside>
    <div class="desk">
      <div
          v-for="(element, key) in deskElements.objects"
          :key
          class="course-element"
          :style="{
                    width: element.width + 'px',
                    height: element.height + 'px',
                    left: element.left + 'px',
                    top: element.top + 'px',
                    backgroundColor: element.backgroundColor,
                    borderColor: element.borderColor,
                    borderWidth: element.borderWidth + 'px',
                }"
      >
        <div class="element-header">

          <span>{{ element.id }}</span>
          <div class="two-but">
            <button
                class="close-btn"
                @click.stop="toggleVisibility(element)"
                :class="{ 'hidden': !element.isVisible }"
            >
              {{ element.isVisible ? '👁' : '🙈' }}
            </button>
            <button class="close-btn" @click.stop="openEditModal(element)">✎</button>
            <button class="close-btn" @click.stop="removeElement(element.id)">×</button>
          </div>
        </div>
        <div class="element-content">
          <h4>{{ element.contentTitle }}</h4>

          <div v-if="element.mainContentUrl">
            <a :href="element.mainContentUrl" target="_blank">Основной контент</a>
          </div>

          <div v-if="element.fileUrl">
            <a :href="element.fileUrl" target="_blank">Файл</a>
          </div>

          <div>Дата добавления: {{ formatDate(element.dateAdded) }}</div>
          <div>Обновлено: {{ formatDate(element.dateUpdated) }}</div>

          <div class="checkbox">
            <input
                type="checkbox"
                v-model="element.isViewed"
            >
            <label>Просмотрено</label>
          </div>

          <div v-if="element.tutorComment">
            <strong>Комментарий:</strong> {{ element.tutorComment }}
          </div>
        </div>


      </div>

    </div>

  </main>
</template>


<style scoped>

.edit-modal-overlay {
  //position: fixed;
  //top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.edit-modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-height: 80vh;
  overflow-y: auto;
}

.edit-form input,
.edit-form textarea {
  width: 100%;
  margin: 5px 0;
  padding: 8px;
}

.edit-form button {
  margin: 5px;
  padding: 8px 16px;
}

.two-but {
  display: flex;
  gap: 15px;
}

.checkbox {
  display: flex;
  justify-content: center;
  align-content: center;
}

.element-content {
  padding: 15px;
  flex: 1;
  min-height: 100px;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: column;
  gap: 7px;
}

.element-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 10px 15px;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.close-btn {
  background: rgba(255, 255, 255, 0.3);
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: rotate(90deg);
}

.course-element {
  position: absolute;
  background-color: white;
  border: 2px solid #333;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: move;
  display: flex;
  flex-direction: column;
}

.course-element:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  transform: scale(1.01);
}

.desk {
  width: 1600px;
  height: 900px;
  border: 1px dashed gray;
  position: relative;
  left: -270px;
}

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
  top: 50px;
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