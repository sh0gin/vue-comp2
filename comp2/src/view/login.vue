<script setup>
import { reactive, ref, inject } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();
let email = ref("");
let password = ref("");
let errors = reactive({
    email_error: null,
    password_error: null,
})

const apiUrl = inject('apiUrl');
const activeToken = inject('activeToken');

const login = async () => {
    Object.keys(errors).forEach(element => {
        errors[element] = null
    });

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
        email: email.value,
        password: password.value,
    })

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
    }

    let response = await fetch(`${apiUrl.value}api/login`, requestOptions);
    const result = await response.json();

    if (response.status == 200) {
        
        localStorage.setItem('activeToken', result.token);
        router.push('/index');
    } else if (response.status == 400) {
        errors.email_error = 'Поле необходимо заполнить';
        errors.password_error = 'Поле необходимо заполнить';
    } else if (response.status == 401) {
        errors.password_error = 'Логин или пароль неверные';
    }


    if ("errors" in result) {
        Object.keys(result.errors).forEach(elem => {
            errors[`${elem}_error`] = result.errors[elem] ? result.errors[elem][0] : null;
        })
    }



}

</script>

<template>
    <header>
        <h1>Вход</h1>
    </header>
    <nav><router-link class="nav-link" to="/index">← Назад</router-link></nav>
    <main>
        <form @submit.prevent="login()">
            <label>Email: <input v-model="email" name="email"></label>
            <span v-if="errors.email_error" class="error-text">{{ errors.email_error }}</span>

            <label>Пароль: <input v-model="password" name="password"></label>
            <span v-if="errors.password_error" class="error-text">{{ errors.password_error }}</span>

            <button type="submit">Войти</button>
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
</style>