<template>
  <div class="error-403">
    <div class="error-content">
      <h1>403</h1>
      <h2>Доступ запрещён</h2>
      <p>Доступ запрещён.
        Авторизуйтесь или запросите доступ у преподавателя</p>
      <a href="/" class="back-link">← Вернуться на главную</a>
    </div>
  </div>
</template>

<style scoped>
.error-403 {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #333;
  text-align: center;
}

.error-content {
  padding: 2rem;
  max-width: 600px;
}

.error-content h1 {
  font-size: 6rem;
  margin: 0;
  color: #dc3545;
  font-weight: 700;
  line-height: 1;
}

.error-content h2 {
  font-size: 2rem;
  margin: 1rem 0 0.5rem;
  font-weight: 600;
}

.error-content p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.back-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #0d6efd;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.back-link:hover {
  background-color: #0b5ed7;
}
</style>