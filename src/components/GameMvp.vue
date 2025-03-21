<script setup lang="ts">
import TeamPlayerSelector from '@/components/TeamPlayerSelector.vue'
import TeamPlayerList from '@/components/TeamPlayerList.vue'
import type { Player, Team, Game, GameMvp } from '@/types'
import { ref } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const { gameId, players, team, mvp } = defineProps<{
  gameId: Game['id']
  players: Player[]
  team: Team
  mvp?: GameMvp
}>()

const emit = defineEmits<{
  (e: 'update:mvp', mvp: GameMvp | undefined): void
}>()

const dialog = ref(false)
const selectedPlayer = ref<Player | undefined>(mvp?.player)
const reason = ref<string>(mvp?.reason ?? '')

const gameStore = useGameStore()

const selectPlayer = (player: Player | undefined) => {
  console.log('selectPlayer', player)
  selectedPlayer.value = player
}

const updateMvp = async () => {
  const data: GameMvp = {
    gameId,
    player: selectedPlayer.value,
    reason: reason.value,
  }
  await gameStore.updateGameMvp(gameId, data)
  emit('update:mvp', data)
  dialog.value = false
}
</script>

<template>
  <div class="game-mvp inline-padding">
    <div class="game-mvp__player">
      <TeamPlayerSelector
        :player="mvp?.player"
        :color="team.color"
        v-if="mvp?.player !== undefined"
        @click="dialog = true"
      />
      <v-btn color="#aaa" icon flat v-else class="game-mvp__player-no-player" @click="dialog = true"
        >未設定</v-btn
      >
    </div>
    <div class="game-mvp__reason" v-if="mvp?.reason">
      <p class="game-mvp__reason-inner">{{ mvp?.reason }}</p>
    </div>
    <v-dialog v-model="dialog" width="100%">
      <v-card>
        <v-card-title>MVPを1人選択してください</v-card-title>
        <v-card-text>
          <TeamPlayerList
            :players="players"
            :team="team"
            :selected-player="selectedPlayer"
            @change="selectPlayer"
          />
          <v-textarea v-model="reason" label="選出理由" />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false">キャンセル</v-btn>
          <v-btn @click="updateMvp">決定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.game-mvp {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__player-no-player {
    cursor: pointer;
    font-size: 0.8rem;
  }

  &__reason {
    display: flex;
    justify-content: center;
    font-size: 1rem;
    width: 80%;
    border-radius: 10px;
    margin-top: 10px;
    padding: 0.5rem 1rem;
    background-color: rgb(var(--color-accent-rgb) / 0.1);

    &-inner {
      word-break: break-all;
      white-space: pre-wrap;
      text-align: left;
      width: fit-content;
      font-size: 0.85rem;
    }
  }
}
</style>
