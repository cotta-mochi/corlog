<script setup lang="ts">
import type { Blog } from '@/types'
import { format } from 'date-fns'
import BlogMenu from '@/components/BlogMenu.vue'

defineProps<{
  blog: Blog
}>()

const emit = defineEmits<{
  (e: 'edit', blog: Blog): void
  (e: 'delete', blog: Blog): void
}>()
</script>

<template>
  <article class="blog">
    <header class="blog__header">
      <BlogMenu @edit="emit('edit', blog)" @delete="emit('delete', blog)" />
    </header>
    <p class="blog__content">{{ blog.content }}</p>
    <footer class="blog__footer">
      <p class="blog__date">
        <span>{{ format(new Date(blog.createdAt), 'yyyy/MM/dd HH:mm') }}作成</span>
        <span>{{ format(new Date(blog.updatedAt), 'yyyy/MM/dd HH:mm') }}更新</span>
      </p>
    </footer>
  </article>
</template>

<style scoped lang="scss">
.blog {
  &__header {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 4px;
  }
  &__title {
    word-break: break-all;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 0.05em;
    flex-grow: 1;
    line-height: 1.3;
  }
  &__content {
    margin-top: 8px;
    word-break: break-all;
    white-space: pre-wrap;
    line-height: 1.8;
    font-size: 14px;
    letter-spacing: 0.05em;
  }
  &__footer {
    margin-top: 8px;
  }
  &__date {
    order: -1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    font-size: 11px;
    color: #999;
    line-height: 1.1;
  }
}
</style>
