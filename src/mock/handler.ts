import { http, HttpResponse } from 'msw'
import { games } from './data/games'
import { teams } from './data/teams'
import { reviews } from './data/reviews'
import { teamPlayersLog } from './data/teamPlayers'
import type { Review, GameSatisfaction, GameMvp } from '@/types'
import { gameSatisfactions } from './data/gameSatisfactions'
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const gameMvps: GameMvp[] = []

export const handlers = [
  http.get('/api/game', () => {
    return HttpResponse.json(games)
  }),
  http.get('/api/game/:gameId', ({ params }) => {
    const game = games.find((game) => game.id === params.gameId)
    return HttpResponse.json(game)
  }),
  http.get('/api/game/:gameId/reviews', ({ params }) => {
    const filteredReviews = reviews.filter((review) => review.gameId === params.gameId)
    return HttpResponse.json(filteredReviews)
  }),
  http.post('/api/game/:gameId/reviews', async ({ request }) => {
    await sleep(3000)
    const review = (await request.json()) as Review
    reviews.push({ ...review, id: String(reviews.length + 1) })
    return HttpResponse.json(reviews)
  }),
  http.get('/api/reviews/:reviewId', ({ params }) => {
    const review = reviews.find((review) => review.id === params.reviewId)
    return HttpResponse.json(review)
  }),
  http.put('/api/reviews/:reviewId', async ({ params, request }) => {
    const review = (await request.json()) as Review
    const index = reviews.findIndex((review) => review.id === params.reviewId)
    reviews[index] = review
    return HttpResponse.json(reviews)
  }),
  http.delete('/api/reviews/:reviewId', ({ params }) => {
    const index = reviews.findIndex((review) => review.id === params.reviewId)
    reviews.splice(index, 1)
    return HttpResponse.json(reviews)
  }),
  http.get('/api/game/:gameId/satisfaction', ({ params }) => {
    let gameSatisfaction: GameSatisfaction | undefined = gameSatisfactions.find(
      (gameSatisfaction) => gameSatisfaction.gameId === params.gameId,
    )
    if (!gameSatisfaction) {
      gameSatisfaction = { gameId: params.gameId as string, satisfaction: undefined }
      gameSatisfactions.push(gameSatisfaction)
    }
    return HttpResponse.json(gameSatisfaction)
  }),
  http.put('/api/game/:gameId/satisfaction', async ({ params, request }) => {
    const gameSatisfaction = (await request.json()) as GameSatisfaction
    const index = gameSatisfactions.findIndex(
      (gameSatisfaction) => gameSatisfaction.gameId === params.gameId,
    )
    gameSatisfactions[index] = gameSatisfaction
    return HttpResponse.json(gameSatisfactions)
  }),
  http.get('/api/game/:gameId/mvp', ({ params }) => {
    let mvp = gameMvps.find((mvp) => mvp.gameId === params.gameId)
    if (!mvp) {
      mvp = { gameId: params.gameId as string, player: undefined, reason: '' }
      gameMvps.push(mvp)
    }
    return HttpResponse.json(mvp)
  }),
  http.put('/api/game/:gameId/mvp', async ({ params, request }) => {
    const mvp = (await request.json()) as GameMvp
    const index = gameMvps.findIndex((mvp) => mvp.gameId === params.gameId)
    gameMvps[index] = mvp
    return HttpResponse.json(gameMvps)
  }),
  http.get('/api/team/:teamId', ({ params }) => {
    const team = teams.find((team) => team.id === params.teamId)
    return HttpResponse.json(team)
  }),
  http.get('/api/team/:teamId/players', ({ params }) => {
    const players = teamPlayersLog.find((log) => log.teamId === params.teamId)?.players
    return HttpResponse.json(players)
  }),
]
