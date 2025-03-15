<script setup lang="ts">
import TeamPlayerSelector from '@/components/TeamPlayerSelector.vue'
import type { Player, Team } from '@/types'
const { selectedPlayer, isMultiSelect = false } = defineProps<{
  players: Player[]
  team: Team
  isMultiSelect?: boolean
  selectedPlayer?: Player | Player[]
}>()

if (isMultiSelect && !Array.isArray(selectedPlayer)) {
  throw new Error('selectedPlayer must be an array when isMultiSelect is true')
}

const emit = defineEmits<{
  (e: 'change', player: Player | undefined): void
}>()

const handleChange = (checked: { player: Player; checked: boolean }) => {
  if (isMultiSelect) {
    emit('change', checked)
    return
  }
  if (checked.checked) {
    emit('change', checked.player)
  } else {
    emit('change', undefined)
  }
}

const isChecked = (player: Player) => {
  if (Array.isArray(selectedPlayer)) {
    return selectedPlayer.some((p) => p.id === player.id)
  }
  return selectedPlayer?.id === player.id
}
</script>

<template>
  <div class="team-player-list inline-padding">
    <TeamPlayerSelector
      v-for="player in players"
      :key="player.id"
      :player="player"
      :color="team.color"
      :checked="isChecked(player)"
      @change="handleChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.team-player-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 10px;
}
</style>
