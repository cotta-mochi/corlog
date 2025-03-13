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
  set: (value: Player['id'] | undefined) => emit('update:modelValue', value),
})

const updateWhoScores29 = (player: Player | undefined) => {
  emit('update:modelValue', player?.id)
}
</script>

<template>
  <div class="who-scores-29-prediction">
    <div class="who-scores-29-prediction__player">
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
        <v-card-title>29点目を取るのは？</v-card-title>
        <v-card-text>
          <TeamPlayerList
            :team="game.team1"
            :players="players"
            :selected-player="selected"
            @change="updateWhoScores29"
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
.who-scores-29-prediction {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
