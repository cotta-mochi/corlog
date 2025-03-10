<script setup lang="ts">
import type { Game, Blog } from '@/types'
import { useGameStore } from '@/stores/gameStore'
import { useBlogStore } from '@/stores/BlogStore'
import { onMounted, ref } from 'vue'
import GameSummary from '@/components/GameSummary.vue'
import GameBlog from '@/components/GameBlog.vue'
import { PhPlus } from '@phosphor-icons/vue'
import { useRouter } from 'vue-router'
const { gameId } = defineProps<{
  gameId: Game['id']
}>()

const gameStore = useGameStore()
const blogStore = useBlogStore()
const router = useRouter()
const game = ref<Game>()
const blogs = ref<Blog[]>([])

onMounted(async () => {
  game.value = await gameStore.fetchGame(gameId)
  blogs.value = await blogStore.fetchBlogsByGameId(gameId)
})

const editBlog = (blog: Blog) => {
  router.push({
    name: 'blog-edit',
    params: {
      gameId: gameId,
      blogId: blog.id,
    },
  })
}

const deleteBlog = async (blog: Blog) => {
  if (confirm('この記録を削除しますか？')) {
    await blogStore.deleteBlog(blog.id)
    blogs.value = await blogStore.fetchBlogsByGameId(gameId)
  }
}
</script>

<template>
  <div v-if="game" class="game-detail">
    <GameSummary :game="game" />
    <ul class="game-detail__blog-list">
      <li v-for="blog in blogs" :key="blog.id" class="game-detail__blog-list-item inline-padding">
        <GameBlog :blog="blog" @edit="editBlog(blog)" @delete="deleteBlog(blog)" />
      </li>
    </ul>
    <div class="game-detail__empty-message inline-padding" v-if="blogs.length === 0">
      <p>この試合の記録がありません</p>
      <button
        class="game-detail__add-blog-button button button--primary"
        @click="router.push({ name: 'blog-add', params: { gameId: gameId } })"
      >
        <PhPlus size="18" weight="bold" />
        記録を作成する
      </button>
    </div>
    <button
      class="game-detail__add-blog-button button button--primary button--circle"
      v-if="blogs.length > 0"
      @click="router.push({ name: 'blog-add', params: { gameId: gameId } })"
    >
      <PhPlus size="18" weight="bold" />
    </button>
  </div>
  <div v-else>
    <p>データを取得しています...</p>
  </div>
</template>

<style scoped lang="scss">
.game-detail {
  &__blog-list {
    list-style: none;
    margin-top: 18px;
  }

  &__blog-list-item {
    padding-bottom: 12px;
    margin-bottom: 12px;

    &:not(:last-child) {
      border-bottom: 1px solid #ccc;
    }
  }

  &__empty-message {
    text-align: center;
  }

  &__add-blog-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 1.1rem;
    margin-top: 12px;
    padding: 8px 16px;
  }

  &__add-blog-button.button--circle {
    position: fixed;
    bottom: 12px;
    right: 12px;
    box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.5);
  }
}
</style>
