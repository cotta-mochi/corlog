<script setup lang="ts">
import { useReviewStore } from '@/stores/reviewStore'
import { ref, onMounted } from 'vue'
import type { Review } from '@/types'
import GameReview from '@/components/GameReview.vue'
import { PhPlus } from '@phosphor-icons/vue'
import { useRouter } from 'vue-router'
const props = defineProps<{
  gameId: string
}>()
const router = useRouter()

const reviews = ref<Review[]>([])
const reviewStore = useReviewStore()
onMounted(async () => {
  reviews.value = await reviewStore.fetchReviewsByGameId(props.gameId)
})

const editReview = (review: Review) => {
  router.push({ name: 'review-edit', params: { reviewId: review.id } })
}
const deleteReview = async (review: Review) => {
  if (!review.id) return
  if (confirm('本当に削除しますか？')) {
    await reviewStore.deleteReview(review.id)
    reviews.value = reviews.value.filter((b) => b.id !== review.id)
  }
}
const createReview = () => {
  router.push({ name: 'review-add' })
}
</script>

<template>
  <div class="game-reviews-list-wrapper">
    <ul class="game-reviews-list" v-if="reviews.length > 0">
      <li v-for="review in reviews" :key="review.id" class="game-reviews-list__item">
        <GameReview :review="review" :images="[]" @edit="editReview" @delete="deleteReview" />
      </li>
    </ul>
    <div class="game-reviews-list__empty" v-else>
      <p>観戦記録がありません</p>
      <button class="button button--primary add-review-button" @click="createReview">
        <PhPlus />
        観戦記録を作成する
      </button>
    </div>
    <button
      class="button button--circle button--primary add-review-button"
      @click="createReview"
      v-if="reviews.length > 0"
    >
      <PhPlus size="24" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.game-reviews-list {
  list-style: none;

  &__item {
    margin-bottom: 12px;
    padding: 8px 8px 20px;
    border-bottom: 1px solid #eee;
    &:last-child {
      margin-bottom: 0;
    }
  }
  &__empty {
    text-align: center;
    padding: 20px;

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      margin-top: 12px;
    }
  }
}
.add-review-button {
  font-size: 18px;
  padding: 1em;
}
.button--circle.add-review-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  width: 50px;
  font-size: 14px;
}
</style>
