<script setup>
import {useRouter} from "vue-router";

const props = defineProps({
  elem: Object
})

const router = useRouter();

const go = () => {
  router.push(`/course/${props.elem.id}`)
}

</script>

<template>
  <div class="board-item cursor" @click="go" >
      <h3>{{ elem.title }}</h3>
      <p class="likes">{{ elem.description }}</p>
      <p class="likes">{{ elem.is_public ? "Публичная" : 'Приватная' }} доска</p>
  </div>
</template>

<style scoped>

.cursor {
  cursor: pointer;
  margin: 5px;
}

</style>