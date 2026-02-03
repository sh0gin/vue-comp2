<script setup>
import { inject } from 'vue';
import {useRouter} from "vue-router";

const apiUrl = inject('apiUrl');
const activeToken = inject('activeToken');

const router = useRouter();

const logout = async () => {
  let response = await fetch(`${apiUrl.value}api/logout`, {
  'headers': {
    'content-type': 'application/json',
    'authorization': `Bearer ${activeToken.value}`,
  }
})
  localStorage.removeItem('activeToken');
  activeToken.value = null;
  router.push('/login')

}
</script>

<template>
    <header>
        <nav>
            <ul>
                <li v-if="!activeToken">
                    <router-link class="nav-link" to="/register">Регистрация</router-link>
                </li>
                <li  v-if="!activeToken"> <router-link class="nav-link" to="/login">Вход</router-link>
                </li>
<!--                <li><router-link class="nav-link" to="/create-board">Создать доску</router-link></li>-->
                <li><router-link class="nav-link" to="/courses">Публичные доски</router-link></li>
<!--                <li><router-link class="nav-link" to="/pages-board">Рисовать</router-link></li>-->
                <li  v-if="activeToken"> <a class="nav-link" @click="logout">Выход</a>
                </li>
            </ul>
        </nav>
    </header>
</template>

<style></style>