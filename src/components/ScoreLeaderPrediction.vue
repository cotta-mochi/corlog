<script setup lang="ts">
import type { Game, Player } from '@/types'
import { computed, ref } from 'vue'
import TeamPlayerList from '@/components/TeamPlayerList.vue'
import PlayerComponent from '@/components/Player.vue'
const props = defineProps<{
  game: Game
  players: Player[]
  modelValue: Player['id'] | undefined
}>()

const dialog = ref(false)

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
  <div class="score-leader-prediction">
    <div class="score-leader-prediction__player">
      <PlayerComponent
        :player="selected"
        :team="game.team1"
        v-if="selected"
        @click="dialog = true"
      />
      <v-btn variant="outlined" color="primary" @click="dialog = true" v-if="!selected">
        選手を選ぶ
      </v-btn>
    </div>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title>スコアリーダーは誰？</v-card-title>
        <v-card-text>
          <TeamPlayerList
            :players="players"
            :team="game.team1"
            :selected-player="selected"
            @change="updateScoreLeader"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false">閉じる</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.score-leader-prediction {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
