<script setup lang="ts">
import { useBlogStore } from '@/stores/blogStore'
import { ref, onMounted } from 'vue'
import type { Blog } from '@/types'
import GameBlog from '@/components/GameBlog.vue'
import { PhPlus } from '@phosphor-icons/vue'
import { useRouter } from 'vue-router'
const props = defineProps<{
  gameId: string
}>()
const router = useRouter()

const blogs = ref<Blog[]>([])
const blogStore = useBlogStore()
onMounted(async () => {
  blogs.value = await blogStore.fetchBlogsByGameId(props.gameId)
})

const editBlog = (blog: Blog) => {
  router.push({ name: 'blog-edit', params: { blogId: blog.id } })
}
const deleteBlog = async (blog: Blog) => {
  if (!blog.id) return
  if (confirm('本当に削除しますか？')) {
    await blogStore.deleteBlog(blog.id)
    blogs.value = blogs.value.filter((b) => b.id !== blog.id)
  }
}
const createBlog = () => {
  router.push({ name: 'blog-add' })
}
</script>

<template>
  <div class="game-blogs-list-wrapper">
    <ul class="game-blogs-list" v-if="blogs.length > 0">
      <li v-for="blog in blogs" :key="blog.id" class="game-blogs-list__item">
        <GameBlog :blog="blog" @edit="editBlog" @delete="deleteBlog" />
      </li>
    </ul>
    <div class="game-blogs-list__empty" v-else>
      <p>観戦記録がありません</p>
      <button class="button button--primary add-blog-button" @click="createBlog">
        <PhPlus />
        観戦記録を作成する
      </button>
    </div>
    <button
      class="button button--circle button--primary add-blog-button"
      @click="createBlog"
      v-if="blogs.length > 0"
    >
      <PhPlus size="24" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.game-blogs-list {
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
.add-blog-button {
  font-size: 18px;
  padding: 1em;
}
.button--circle.add-blog-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  width: 50px;
  font-size: 14px;
}
</style>
