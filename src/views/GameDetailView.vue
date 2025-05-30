<script setup lang="ts">
import type { Game, Review, Player, GameMvp, ReviewImage } from '@/types'
import { useGameStore } from '@/stores/gameStore'
import { useReviewStore } from '@/stores/reviewStore'
import { computed, onMounted, ref } from 'vue'
import GameSummary from '@/components/GameSummary.vue'
import GameReview from '@/components/GameReview.vue'
import { PhPencil } from '@phosphor-icons/vue'
import { useRouter } from 'vue-router'
import GameSatisfaction from '@/components/GameSatisfaction.vue'
import GameMvpComponent from '@/components/GameMvp.vue'
import { useTeamStore } from '@/stores/teamStore'
import GamePredictionResult from '@/components/GamePredictionResult.vue'
const { gameId } = defineProps<{
  gameId: Game['id']
}>()

const gameStore = useGameStore()
const teamStore = useTeamStore()
const reviewStore = useReviewStore()
const router = useRouter()
const game = ref<Game>()
const reviews = ref<Review[]>([])
const images = ref<ReviewImage[]>([])
const players = ref<Player[]>([])
const mvp = ref<GameMvp>()

onMounted(async () => {
  game.value = await gameStore.fetchGame(gameId)
  reviews.value = await reviewStore.fetchMyReviews(gameId)
  if (reviews.value.length > 0) {
    for (const review of reviews.value) {
      const reviewImages = await reviewStore.fetchImages(review.id)
      images.value.push(...reviewImages)
    }
  }
  players.value = await teamStore.fetchPlayers('694', new Date(game.value?.date ?? ''))
  mvp.value = await gameStore.fetchGameMvps(gameId)
})

const isGameFinished = computed(() => {
  return game.value?.status === 'finished'
})

const editReview = (review: Review) => {
  router.push({
    name: 'review-edit',
    params: {
      gameId: gameId,
      reviewId: review.id,
    },
  })
}

const deleteReview = async (review: Review) => {
  if (confirm('この記録を削除しますか？')) {
    await reviewStore.deleteReview(review.id)
    reviews.value = await reviewStore.fetchMyReviews(gameId)
  }
}

const updateMvp = async () => {
  mvp.value = await gameStore.fetchGameMvps(gameId)
}
</script>

<template>
  <div v-if="game" class="game-detail">
    <GameSummary :game="game" />
    <div class="game-detail__empty-message inline-padding" v-if="reviews.length === 0">
      <v-btn
        color="primary"
        size="large"
        rounded
        variant="outlined"
        class="game-detail__add-review-button"
        @click="router.push({ name: 'review-add', params: { gameId: gameId } })"
      >
        <template v-slot:append>
          <PhPencil size="18" weight="bold" />
        </template>
        <span>感想を書く</span>
      </v-btn>
    </div>
    <ul class="game-detail__review-list">
      <li
        v-for="review in reviews"
        :key="review.id"
        class="game-detail__review-list-item inline-padding"
      >
        <GameReview
          :review="review"
          :images="images"
          @edit="editReview(review)"
          @delete="deleteReview(review)"
        />
      </li>
    </ul>
    <h2 class="corlog-heading mt-10 mb-4">試合の満足度</h2>
    <GameSatisfaction :game-id="gameId" />
    <h2 class="corlog-heading mt-10 mb-4">個人的MVP</h2>
    <GameMvpComponent
      :game-id="gameId"
      :players="players ?? []"
      :team="game.team1"
      :mvp="mvp"
      @update:mvp="updateMvp"
    />
    <template v-if="isGameFinished">
      <h2 class="corlog-heading mt-10 mb-4">予想結果</h2>
      <GamePredictionResult
        :game="game"
        :players="players"
        v-if="isGameFinished"
      ></GamePredictionResult>
    </template>
  </div>
  <div v-else>
    <p>データを取得しています...</p>
  </div>
</template>

<style scoped lang="scss">
.game-detail {
  &__review-list {
    list-style: none;
    margin-top: 18px;
  }

  &__review-list-item {
    padding-bottom: 12px;
    margin-bottom: 12px;

    &:not(:last-child) {
      border-bottom: 1px solid #ccc;
    }
  }

  &__empty-message {
    text-align: center;
  }

  &__add-review-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    font-size: 1rem;
    margin-top: 12px;
  }
}
</style>
