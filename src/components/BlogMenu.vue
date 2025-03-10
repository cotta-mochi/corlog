<script setup lang="ts">
import { ref } from 'vue'
import { PhDotsThreeVertical, PhPencilLine, PhTrash } from '@phosphor-icons/vue'
const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
}>()

const isOpen = ref(false)
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <span v-bind="props">
        <PhDotsThreeVertical size="18" weight="bold" />
      </span>
    </template>
    <v-list>
      <v-list-item @click="emit('edit')" density="compact">
        <span class="blog-menu__item"><PhPencilLine size="18" weight="bold" />編集</span>
      </v-list-item>
      <v-list-item @click="emit('delete')" density="compact">
        <span class="blog-menu__item text-red"><PhTrash size="18" weight="bold" />削除</span>
      </v-list-item>
    </v-list>
  </v-menu>
  <!-- <div class="blog-menu">
    <button class="blog-menu__toggle-button" @click="isOpen = !isOpen">
      <PhDotsThreeVertical size="18" weight="bold" />
    </button>
    <ul class="blog-menu__list" v-show="isOpen">
      <li class="blog-menu__item">
        <button class="blog-menu__button" @click="emit('edit')">
          <PhPencilLine size="18" weight="bold" />編集
        </button>
      </li>
      <li class="blog-menu__item">
        <button class="blog-menu__button text-red" @click="emit('delete')">
          <PhTrash size="18" weight="bold" />削除
        </button>
      </li>
    </ul>
  </div> -->
</template>

<style scoped lang="scss">
.blog-menu {
  position: relative;

  &__item {
    display: flex;
    align-items: center;
    gap: 4px;
    word-break: keep-all;
  }
}
</style>
