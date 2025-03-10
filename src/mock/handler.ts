import { http, HttpResponse } from 'msw'
import { games } from './data/games'
import { blogs } from './data/blogs'
import type { Blog } from '@/types'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const handlers = [
  http.get('/api/game', () => {
    return HttpResponse.json(games)
  }),
  http.get('/api/game/:gameId', ({ params }) => {
    const game = games.find((game) => game.id === params.gameId)
    return HttpResponse.json(game)
  }),
  http.get('/api/game/:gameId/blogs', ({ params }) => {
    const filteredBlogs = blogs.filter((blog) => blog.gameId === params.gameId)
    return HttpResponse.json(filteredBlogs)
  }),
  http.post('/api/game/:gameId/blogs', async ({ request }) => {
    await sleep(3000)
    const blog = (await request.json()) as Blog
    blogs.push({ ...blog, id: String(blogs.length + 1) })
    return HttpResponse.json(blogs)
  }),
  http.get('/api/blogs/:blogId', ({ params }) => {
    const blog = blogs.find((blog) => blog.id === params.blogId)
    return HttpResponse.json(blog)
  }),
  http.put('/api/blogs/:blogId', async ({ params, request }) => {
    const blog = (await request.json()) as Blog
    const index = blogs.findIndex((blog) => blog.id === params.blogId)
    blogs[index] = blog
    return HttpResponse.json(blogs)
  }),
  http.delete('/api/blogs/:blogId', ({ params }) => {
    const index = blogs.findIndex((blog) => blog.id === params.blogId)
    blogs.splice(index, 1)
    return HttpResponse.json(blogs)
  }),
]
