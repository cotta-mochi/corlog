<script setup lang="ts">
import TeamPlayer from '@/components/TeamPlayer.vue'
import type { Player, Team } from '@/types'
defineProps<{
  players: Player[]
  team: Team
  selectedPlayer?: Player
}>()

const emit = defineEmits<{
  (e: 'change', player: Player | undefined): void
}>()

const handleChange = (checked: { player: Player; checked: boolean }) => {
  if (checked.checked) {
    emit('change', checked.player)
  } else {
    emit('change', undefined)
  }
}
</script>

<template>
  <div class="team-player-list inline-padding">
    <TeamPlayer
      v-for="player in players"
      :key="player.id"
      :player="player"
      :color="team.color"
      :checked="player.id === selectedPlayer?.id"
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
