<script setup>

</script>

<template>
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