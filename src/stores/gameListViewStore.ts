import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useGameListViewStore = defineStore('gameListView', () => {
  type ViewModeType = 'list' | 'calendar'
  type PageSetting = {
    year: number
    month: number
    viewMode: ViewModeType
  }
  const STORAGE_KEY = 'GameListView'

  const prevSetting = getSetting()
  const year = ref(prevSetting.year)
  const month = ref(prevSetting.month)
  const viewMode = ref(prevSetting.viewMode)

  function getSetting(): PageSetting {
    const lastSetting = localStorage.getItem(STORAGE_KEY)
    const now = new Date()
    return lastSetting !== null
      ? JSON.parse(lastSetting)
      : {
          year: now.getFullYear(),
          month: now.getMonth(),
          viewMode: 'list',
        }
  }

  function saveSetting() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        year: year.value,
        month: month.value,
        viewMode: viewMode.value,
      }),
    )
  }

  function updateYear(value: number) {
    year.value = value
    saveSetting()
  }

  function updateMonth(value: number) {
    month.value = value
    saveSetting()
  }

  function updateViewMode(value: ViewModeType) {
    viewMode.value = value
    saveSetting()
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY)
    const initialSetting = getSetting()
    updateYear(initialSetting.year)
    updateMonth(initialSetting.month)
    updateViewMode(initialSetting.viewMode)
  }

  return {
    year,
    month,
    viewMode,
    updateYear,
    updateMonth,
    updateViewMode,
    reset,
  }
})
