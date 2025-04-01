<script setup lang="ts">
import type { Team } from '@/types'
import { computed } from 'vue'

const {
  team,
  isAlias = true,
  fontSize = '0.9rem',
} = defineProps<{
  team: Team
  isAlias?: boolean
  fontSize?: string
}>()

const teamName = computed(() => {
  return isAlias ? team.alias : team.name
})

const bgColor = computed(() => {
  return `rgb(${team.color.r} ${team.color.g} ${team.color.b})`
})
</script>

<template>
  <div class="team-label" :style="{ backgroundColor: bgColor, fontSize }">
    <span>{{ teamName }}</span>
  </div>
</template>

<style scoped lang="scss">
.team-label {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.5;
  text-align: center;
  color: #fff;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
  font-weight: bold;
  padding: 0.1rem 0.2rem;
  min-width: 4em;
}
</style>
