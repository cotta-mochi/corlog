<script setup lang="ts">
import { differenceInSeconds } from 'date-fns'
import { ref, computed } from 'vue'

const props = defineProps<{
  date: Date
}>()

const diff = ref(differenceInSeconds(props.date, new Date()))

const countdownText = computed(() => {
  const days = Math.floor(diff.value / 86400)
  const hours = Math.floor((diff.value % 86400) / 3600)
  const minutes = Math.floor((diff.value % 3600) / 60)
  const seconds = diff.value % 60
  return `${days > 0 ? days + '日 ' : ''}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

setInterval(() => {
  diff.value = differenceInSeconds(props.date, new Date())
}, 1000)
</script>

<template>
  <div class="countdown-timer">
    <p class="countdown-timer__text">
      試合開始まで
      <span class="countdown-timer__text-value font-roboto">{{ countdownText }}</span>
    </p>
  </div>
</template>

<style scoped lang="scss">
.countdown-timer {
  color: #fff;
  line-height: 1;
  letter-spacing: 0.05em;

  &__text {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 0.8rem;
  }

  &__text-value {
    font-size: 1.2rem;
    font-weight: 600;
  }
}
</style>
