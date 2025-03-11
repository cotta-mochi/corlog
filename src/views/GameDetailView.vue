<script setup lang="ts">
import type { Game, Blog, Player, GameMvp } from '@/types'
import { useGameStore } from '@/stores/gameStore'
import { useBlogStore } from '@/stores/blogStore'
import { onMounted, ref } from 'vue'
import GameSummary from '@/components/GameSummary.vue'
import GameBlog from '@/components/GameBlog.vue'
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
const blogStore = useBlogStore()
const router = useRouter()
const game = ref<Game>()
const blogs = ref<Blog[]>([])
const players = ref<Player[]>([])
const mvp = ref<GameMvp>()

onMounted(async () => {
  game.value = await gameStore.fetchGame(gameId)
  blogs.value = await blogStore.fetchBlogsByGameId(gameId)
  players.value = await teamStore.fetchPlayers('694')
  mvp.value = await gameStore.fetchGameMvps(gameId)
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
    <ul class="game-detail__blog-list">
      <li v-for="blog in blogs" :key="blog.id" class="game-detail__blog-list-item inline-padding">
        <GameBlog :blog="blog" @edit="editBlog(blog)" @delete="deleteBlog(blog)" />
      </li>
    </ul>
    <div class="game-detail__empty-message inline-padding" v-if="blogs.length === 0">
      <p>この試合の記録がありません</p>
      <v-btn
        color="primary"
        size="large"
        class="game-detail__add-blog-button"
        font-weight="bold"
        @click="router.push({ name: 'blog-add', params: { gameId: gameId } })"
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
      class="game-detail__add-blog-button button--circle"
      v-if="blogs.length > 0"
      @click="router.push({ name: 'blog-add', params: { gameId: gameId } })"
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
    font-weight: 700;
  }

  &__add-blog-button.button--circle {
    position: fixed;
    bottom: 12px;
    right: 12px;
  }
}
</style>
