<script setup>
import {inject, reactive, ref} from 'vue';
import {useRouter} from 'vue-router';


const router = useRouter();

let email = ref("");
let password = ref("");
let password_repeat = ref("");
let errors = reactive({
  password_repeat_error: null,
  email_error: null,
  password_error: null,
})

const apiUrl = inject('apiUrl');

async function register() {
  Object.keys(errors).forEach(element => {
    errors[element] = null
  });

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    email: email.value,
    password: password.value,
    password_repeat: password_repeat.value,
  })

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  }

  let response = await fetch(`${apiUrl.value}api/register`, requestOptions);
  const result = await response.json();
  if (response.status == 201) {
    router.push("/login");
  } else if (response.status == 422) {
    Object.keys(result.data.errors).forEach(elem => {
      errors[`${elem}_error`] = result.data.errors[elem] ? result.data.errors[elem][0] : null;
    })
  }

}

</script>

<template>
  <header>
    <h1>Регистрация</h1>
  </header>
  <nav>
    <router-link class="nav-link" to="/index">← Назад</router-link>
  </nav>
  <main>
    <form @submit.prevent='register()'>
      <label>Email: <input name="email" v-model="email"></label>
      <span v-if="errors.email_error" class="error-text">{{ errors.email_error }}</span>
      <label>Пароль (8+ символов, цифры и спецсимволы):
        <input name="password" type="password" v-model="password">
        <span v-if="errors.password_error" class="error-text">{{ errors.password_error }}</span>
      </label>
      <label>Повтор пароля: <input name="password_repeat" type="password" v-model="password_repeat"></label>
      <span v-if="errors.password_repeat_error" class="error-text">{{ errors.password_repeat_error }}</span>

      <button type="submit">Зарегистрироваться</button>
    </form>
  </main>
</template>

<style>
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