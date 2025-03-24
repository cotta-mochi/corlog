<script setup lang="ts">
import type { Review, ReviewImage } from '@/types'
import { format } from 'date-fns'
import ReviewMenu from '@/components/ReviewMenu.vue'
import CorlogThumbnail from '@/components/CorlogThumbnail.vue'

defineProps<{
  review: Review
  images: ReviewImage[]
}>()

const emit = defineEmits<{
  (e: 'edit', review: Review): void
  (e: 'delete', review: Review): void
}>()
</script>

<template>
  <article class="review">
    <header class="review__header">
      <ReviewMenu @edit="emit('edit', review)" @delete="emit('delete', review)" />
    </header>
    <p class="review__content">{{ review.content }}</p>
    <ul class="review__images mt-5" v-if="images !== undefined && images.length > 0">
      <li v-for="image in images" :key="image.id">
        <img :src="image.url" />
      </li>
    </ul>
    <footer class="review__footer">
      <p class="review__date">
        <span>{{ format(new Date(review.createdAt), 'yyyy/MM/dd HH:mm') }}作成</span>
        <span>{{ format(new Date(review.updatedAt), 'yyyy/MM/dd HH:mm') }}更新</span>
      </p>
    </footer>
  </article>
</template>

<style scoped lang="scss">
.review {
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
  &__images {
    display: grid;
    gap: 2px;
    grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));

    > li {
      aspect-ratio: 1;
    }

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
