<script setup>
import { inject } from 'vue';

const apiUrl = inject('apiUrl');
const activeToken = inject('activeToken');


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
                <li><router-link class="nav-link" to="/create-board">Создать доску</router-link>
                </li>
                <li><router-link class="nav-link" to="/public-boards">Публичные доски</router-link></li>
                <li><router-link class="nav-link" to="/view-board">Рисовать</router-link></li>
            </ul>
        </nav>
    </header>
</template>

<style></style>