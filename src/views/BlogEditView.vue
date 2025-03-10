<script setup lang="ts">
import type { Game, Blog } from '@/types'
import { ref, onMounted, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useBlogStore } from '@/stores/blogStore'
import GameSummary from '@/components/GameSummary.vue'
import { useRouter } from 'vue-router'

const { gameId = undefined, blogId = undefined } = defineProps<{
  gameId?: Game['id']
  blogId?: Blog['id']
}>()

const game = ref<Game | null>(null)
const blog = ref<Blog | null>(null)
const isEdit = computed(() => blogId !== undefined)
const content = ref('')
const contentInput = ref<HTMLTextAreaElement | null>(null)
const router = useRouter()
const gameStore = useGameStore()
const gameSummaryIsExpanded = ref(false)
onMounted(async () => {
  if (isEdit.value && blogId) {
    const blogStore = useBlogStore()
    blog.value = await blogStore.fetchBlog(blogId)
    if (!blog.value) {
      throw new Error('記事が見つかりません')
    }
    content.value = blog.value.content
    game.value = await gameStore.fetchGame(blog.value.gameId)
  } else if (gameId) {
    game.value = await gameStore.fetchGame(gameId)
  }
})

const onSubmit = async () => {
  if (isEdit.value) {
    await updateBlog()
  } else {
    await createBlog()
  }
}

const createBlog = async () => {
  if (!gameId) return
  const now = new Date().toISOString()
  const blogStore = useBlogStore()
  await blogStore.createBlog(gameId, {
    content: content.value,
    gameId: gameId,
    createdAt: now,
    updatedAt: now,
  })
  router.push(`/game/${gameId}`)
}

const updateBlog = async () => {
  if (!blogId || !blog.value) return
  const now = new Date().toISOString()
  const blogStore = useBlogStore()
  await blogStore.updateBlog({
    ...blog.value,
    content: content.value,
    updatedAt: now,
  })
  router.push(`/game/${blog.value.gameId}`)
}

onMounted(() => {
  if (contentInput.value) {
    contentInput.value.focus()
  }
})
</script>

<template>
  <div class="blog-edit-view">
    <form class="blog-edit-form" @submit.prevent="onSubmit">
      <div class="blog-edit-form__field">
        <textarea
          id="content"
          rows="10"
          v-model="content"
          placeholder="記事を入力してください"
          ref="contentInput"
        ></textarea>
      </div>
      <button type="submit" class="button button--primary blog-edit-form__submit-button">
        投稿
      </button>
    </form>
    <div
      v-if="game"
      class="blog-edit-view__game-summary"
      :class="{ 'blog-edit-view__game-summary--expanded': gameSummaryIsExpanded }"
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
.blog-edit-view {
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

.blog-edit-form {
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
