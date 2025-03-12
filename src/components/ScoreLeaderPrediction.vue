<script setup lang="ts">
import type { Game, Player } from '@/types'
import { computed } from 'vue'
import TeamPlayerList from '@/components/TeamPlayerList.vue'
const props = defineProps<{
  game: Game
  players: Player[]
  modelValue: Player['id'] | undefined
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Player['id'] | undefined): void
}>()

const selected = computed({
  get: () => props.players.find((player) => player.id === props.modelValue),
  set: (value: Player | undefined) => emit('update:modelValue', value?.id),
})

const updateScoreLeader = (player: Player | undefined) => {
  emit('update:modelValue', player?.id)
}
</script>
<template>
  <div>
    <TeamPlayerList
      :team="game.team1"
      :players="players"
      :selected-player="selected"
      @change="updateScoreLeader"
    />
  </div>
</template>
