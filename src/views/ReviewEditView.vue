<script setup lang="ts">
import type { Game, Review, ReviewImage } from '@/types'
import { ref, onMounted, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useReviewStore } from '@/stores/reviewStore'
import GameSummary from '@/components/GameSummary.vue'
import { useRouter } from 'vue-router'
import CorlogThumbnail from '@/components/CorlogThumbnail.vue'

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
const imageFiles = ref<File[]>([])
const imagesInput = ref<HTMLInputElement | null>()
onMounted(async () => {
  if (isEdit.value && reviewId) {
    const reviewStore = useReviewStore()
    review.value = await reviewStore.fetchReview(reviewId)
    console.log(review.value)
    if (!review.value) {
      throw new Error('記事が見つかりません')
    }
    content.value = review.value.content
    // review.value.images?.forEach(async (imagePath) => {
    //   const res = await fetch(imagePath)
    //   const blob = await res.blob()
    //   const file = new File([image], image)
    //   imageFiles.value.push(file)
    // })
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
  // let images: Array<ReviewImage> = []
  // if (imageFiles.value.length > 0 && gameId !== undefined) {
  //   console.log('upload images')
  //   images = await reviewStore.uploadImages(gameId, imageFiles.value)
  //   console.log(images)
  // }
  await reviewStore.updateReview(
    {
      ...review.value,
      content: content.value,
      updatedAt: now,
    },
    imageFiles.value,
  )
  router.push(`/game/${review.value.gameId}`)
}

onMounted(() => {
  if (contentInput.value) {
    contentInput.value.focus()
  }
})

const selectImages = () => {
  if (imagesInput.value) {
    imagesInput.value.click()
  }
}
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
      <ul class="review-edit-form__thumnails">
        <li v-for="(image, idx) in imageFiles" :key="idx">
          <CorlogThumbnail :file="image" />
        </li>
      </ul>
      <v-file-input
        accept="image/*"
        label="File Input"
        v-model="imageFiles"
        multiple
        ref="imagesInput"
        v-show="false"
      ></v-file-input>
      <div class="review-edit-form__buttons">
        <v-btn icon="mdi-image" variant="outlined" @click="selectImages"></v-btn>
        <v-btn
          :loading="isLoading"
          color="primary"
          type="submit"
          class="review-edit-form__submit-button button"
          ><span style="font-weight: bold">投稿</span></v-btn
        >
      </div>
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

  &__thumnails {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 2px;
    margin-bottom: 12px;
  }

  &__buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }

  &__submit-button {
    width: 80px;
    font-size: 16px;
    display: block;
  }
}
</style>
