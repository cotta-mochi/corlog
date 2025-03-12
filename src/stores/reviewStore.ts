import type { Review, Game } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

export const useReviewStore = defineStore('review', () => {
  const reviews = ref<Review[]>([])

  const fetchReviewsByGameId = async (gameId: string) => {
    return await api.fetchReviewsByGameId(gameId)
  }

  const fetchMyReviews = async (gameId?: Game['id']) => {
    return await api.fetchMyReviews(gameId)
  }

  const fetchReview = async (reviewId: string) => {
    return await api.fetchReview(reviewId)
  }

  const createReview = async (gameId: string, review: Review) => {
    return await api.createReview(gameId, review)
  }

  const updateReview = async (review: Review) => {
    return await api.updateReview(review)
  }

  const deleteReview = async (reviewId: Review['id']) => {
    return await api.deleteReview(reviewId)
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
