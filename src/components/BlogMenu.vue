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
  <div class="blog-menu">
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
  </div>
</template>

<style scoped lang="scss">
.blog-menu {
  position: relative;

  &__list {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #fff;
    border: 1px solid #ccc;
  }

  &__item + &__item {
    border-top: 1px solid #ccc;
  }

  &__button {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px;
    word-break: keep-all;
    min-width: 70px;
    letter-spacing: 0.1em;
    line-height: 1.1;
    font-size: 1rem;
  }
}
</style>
