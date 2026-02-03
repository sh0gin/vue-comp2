<script setup>
import CourseElem from "@/components/CourseElem.vue";
import {inject, onMounted, ref} from "vue";

const courses = ref([])
const activeToken = inject('activeToken');
const apiUrl = inject('apiUrl');
let loaderTrue = ref(false);

const loadData = async () => {
  loaderTrue.value = true;
  let response = await fetch(`${apiUrl.value}api/courses`, {
    'headers': {
      'content-type': 'application/json',
      'authorization': `Bearer ${activeToken.value}`,
    }
  })
  let result = await response.json()
  courses.value = result.data;
  loaderTrue.value = false;
  console.log(courses.value)
}

onMounted(async () => {
  await loadData();
})

</script>

<template>
  <header>
    <h1>Курсы</h1>
  </header>
<!--  <nav><a href="index.html">← Назад</a></nav>-->
  <main>
    <div v-show="loaderTrue" class="loader">
      <div class="spinner"></div>
      <p>Загрузка...</p>
    </div>
<!--    <div class="filters">-->
<!--      <label>Фильтр по лайкам:</label>-->
<!--      <select>-->
<!--        <option>Все</option>-->
<!--        <option>Более 10</option>-->
<!--        <option>Более 50</option>-->
<!--      </select>-->
<!--      <button disabled>Применить</button>-->
<!--    </div>-->
    <div class="board-list" v-for="elem in courses">
      <CourseElem
          :elem="elem"
      ></CourseElem>
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
  width: 90vw;
  display: flex;
  flex-wrap: wrap;
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