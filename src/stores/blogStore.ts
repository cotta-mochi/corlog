import type { Blog } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBlogStore = defineStore('blog', () => {
  const blogs = ref<Blog[]>([])

  const fetchBlogsByGameId = async (gameId: string) => {
    const response = await fetch(`/api/game/${gameId}/blogs`)
    return await response.json()
  }

  const fetchBlog = async (blogId: string) => {
    const response = await fetch(`/api/blogs/${blogId}`)
    return await response.json()
  }

  const createBlog = async (gameId: string, blog: Blog) => {
    await fetch(`/api/game/${gameId}/blogs`, {
      method: 'POST',
      body: JSON.stringify(blog),
    })
  }

  const updateBlog = async (blog: Blog) => {
    await fetch(`/api/blogs/${blog.id}`, {
      method: 'PUT',
      body: JSON.stringify(blog),
    })
  }

  const deleteBlog = async (blogId: Blog['id']) => {
    await fetch(`/api/blogs/${blogId}`, {
      method: 'DELETE',
    })
  }

  return { blogs, fetchBlogsByGameId, fetchBlog, createBlog, updateBlog, deleteBlog }
})
