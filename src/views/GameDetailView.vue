<script setup lang="ts">
import type { Game, Review, Player, GameMvp } from '@/types'
import { useGameStore } from '@/stores/gameStore'
import { useReviewStore } from '@/stores/reviewStore'
import { onMounted, ref } from 'vue'
import GameSummary from '@/components/GameSummary.vue'
import GameReview from '@/components/GameReview.vue'
import { PhPlus } from '@phosphor-icons/vue'
import { useRouter } from 'vue-router'
import GameSatisfaction from '@/components/GameSatisfaction.vue'
import GameMvpComponent from '@/components/GameMvp.vue'
import { useTeamStore } from '@/stores/teamStore'
const { gameId } = defineProps<{
  gameId: Game['id']
}>()

const gameStore = useGameStore()
const teamStore = useTeamStore()
const reviewStore = useReviewStore()
const router = useRouter()
const game = ref<Game>()
const reviews = ref<Review[]>([])
const players = ref<Player[]>([])
const mvp = ref<GameMvp>()

onMounted(async () => {
  game.value = await gameStore.fetchGame(gameId)
  reviews.value = await reviewStore.fetchMyReviews(gameId)
  console.log(game.value?.date)
  players.value = await teamStore.fetchPlayers('694', new Date(game.value?.date ?? ''))
  mvp.value = await gameStore.fetchGameMvps(gameId)
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
    <h2 class="game-detail__heading">試合の満足度</h2>
    <GameSatisfaction :game-id="gameId" />
    <h2 class="game-detail__heading">MVP</h2>
    <GameMvpComponent
      :game-id="gameId"
      :players="players ?? []"
      :team="game.team1"
      :mvp="mvp"
      @update:mvp="updateMvp"
    />
    <ul class="game-detail__review-list">
      <li
        v-for="review in reviews"
        :key="review.id"
        class="game-detail__review-list-item inline-padding"
      >
        <GameReview :review="review" @edit="editReview(review)" @delete="deleteReview(review)" />
      </li>
    </ul>
    <div class="game-detail__empty-message inline-padding" v-if="reviews.length === 0">
      <p>この試合の記録がありません</p>
      <v-btn
        color="primary"
        size="large"
        class="game-detail__add-review-button"
        font-weight="bold"
        @click="router.push({ name: 'review-add', params: { gameId: gameId } })"
      >
        <template v-slot:prepend>
          <PhPlus size="18" weight="bold" />
        </template>
        <span>記録を作成する</span>
      </v-btn>
    </div>
    <v-btn
      color="primary"
      icon="mdi-plus"
      class="game-detail__add-review-button button--circle"
      v-if="reviews.length > 0"
      @click="router.push({ name: 'review-add', params: { gameId: gameId } })"
    >
      <PhPlus size="24" weight="bold" />
    </v-btn>
  </div>
  <div v-else>
    <p>データを取得しています...</p>
  </div>
</template>

<style scoped lang="scss">
.game-detail {
  &__heading {
    position: relative;
    font-size: 1.2rem;
    font-weight: 700;
    margin-top: 1rem;
    margin-bottom: 8px;
    padding-bottom: 4px;
    text-align: center;

    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 24px;
      height: 4px;
      background-color: var(--color-accent);
    }
  }

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
    gap: 4px;
    font-size: 1.1rem;
    margin-top: 12px;
    padding: 8px 16px;
    font-weight: 700;
  }

  &__add-review-button.button--circle {
    position: fixed;
    bottom: 12px;
    right: 12px;
  }
}
</style>
