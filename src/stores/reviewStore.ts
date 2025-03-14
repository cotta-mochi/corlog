import type { Review, Game } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { gameReviewService } from '@/services/gameReviewService'

export const useReviewStore = defineStore('review', () => {
  const reviews = ref<Review[]>([])

  const fetchReviewsByGameId = async (gameId: string) => {
    return await gameReviewService.fetchReviewsByGameId(gameId)
  }

  const fetchMyReviews = async (gameId?: Game['id']) => {
    return await gameReviewService.fetchMyReviews(gameId)
  }

  const fetchReview = async (reviewId: string) => {
    return await gameReviewService.fetchReview(reviewId)
  }

  const createReview = async (gameId: string, review: Review) => {
    return await gameReviewService.createReview(gameId, review)
  }

  const updateReview = async (review: Review) => {
    return await gameReviewService.updateReview(review)
  }

  const deleteReview = async (reviewId: Review['id']) => {
    return await gameReviewService.deleteReview(reviewId)
  }

  return {
    reviews,
    fetchReviewsByGameId,
    fetchReview,
    createReview,
    updateReview,
    deleteReview,
    fetchMyReviews,
  }
})
