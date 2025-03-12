<script setup lang="ts">
import type { Game, Review } from '@/types'
import { ref, onMounted, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useReviewStore } from '@/stores/reviewStore'
import GameSummary from '@/components/GameSummary.vue'
import { useRouter } from 'vue-router'

const { gameId = undefined, reviewId = undefined } = defineProps<{
  gameId?: Game['id']
  reviewId?: Review['id']
}>()

const game = ref<Game | null>(null)
const review = ref<Review | null>(null)
const isEdit = computed(() => reviewId !== undefined)
const content = ref('')
const contentInput = ref<HTMLTextAreaElement | null>(null)
const router = useRouter()
const gameStore = useGameStore()
const gameSummaryIsExpanded = ref(false)
const isLoading = ref(false)
onMounted(async () => {
  if (isEdit.value && reviewId) {
    const reviewStore = useReviewStore()
    review.value = await reviewStore.fetchReview(reviewId)
    if (!review.value) {
      throw new Error('記事が見つかりません')
    }
    content.value = review.value.content
    game.value = await gameStore.fetchGame(review.value.gameId)
  } else if (gameId) {
    game.value = await gameStore.fetchGame(gameId)
  }
})

const onSubmit = async () => {
  isLoading.value = true
  if (isEdit.value) {
    await updateReview()
  } else {
    await createReview()
  }
  isLoading.value = false
}

const createReview = async () => {
  if (!gameId) return
  const now = new Date().toISOString()
  const reviewStore = useReviewStore()
  await reviewStore.createReview(gameId, {
    content: content.value,
    gameId: gameId,
    createdAt: now,
    updatedAt: now,
  })
  router.push(`/game/${gameId}`)
}

const updateReview = async () => {
  if (!reviewId || !review.value) return
  const now = new Date().toISOString()
  const reviewStore = useReviewStore()
  await reviewStore.updateReview({
    ...review.value,
    content: content.value,
    updatedAt: now,
  })
  router.push(`/game/${review.value.gameId}`)
}

onMounted(() => {
  if (contentInput.value) {
    contentInput.value.focus()
  }
})
</script>

<template>
  <div class="review-edit-view">
    <form class="review-edit-form" @submit.prevent="onSubmit">
      <div class="review-edit-form__field">
        <textarea
          id="content"
          rows="10"
          v-model="content"
          placeholder="記事を入力してください"
          ref="contentInput"
        ></textarea>
      </div>
      <v-btn
        :loading="isLoading"
        color="primary"
        type="submit"
        class="review-edit-form__submit-button button"
        ><span style="font-weight: bold">投稿</span></v-btn
      >
    </form>
    <div
      v-if="game"
      class="review-edit-view__game-summary"
      :class="{ 'review-edit-view__game-summary--expanded': gameSummaryIsExpanded }"
    >
      <GameSummary
        :game="game"
        :is-expanded="gameSummaryIsExpanded"
        :is-toggleable="true"
        @update:is-expanded="gameSummaryIsExpanded = !gameSummaryIsExpanded"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.review-edit-view {
  min-height: 100%;
  display: grid;
  grid-template-rows: 1fr auto;

  &__game-summary {
    box-shadow: 0 -2px 8px 0 rgba(0, 0, 0, 0.2);
  }

  &__game-summary--expanded {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
  }
}

.review-edit-form {
  padding: 12px;
  &__field {
    margin-bottom: 12px;
    label {
      display: block;
      margin-bottom: 4px;
      font-size: 12px;
    }
    input,
    textarea {
      width: 100%;
      padding: 8px;
      border: 0;
      outline: none;
      appearance: none;
    }
  }
  .button {
    margin-top: 12px;
  }

  &__submit-button {
    width: 80px;
    font-size: 16px;
    display: block;
    margin-left: auto;
  }
}
</style>
