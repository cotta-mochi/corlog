<script setup lang="ts">
import type { Player, Team } from '@/types'
import { computed } from 'vue'
const props = defineProps<{
  team: Team
  player: Player
  isSmall?: boolean
  isText?: boolean
}>()

const teamColor = computed(() => {
  if (props.isText) {
    return 'transparent'
  }
  return `rgb(${props.team.color.r}, ${props.team.color.g}, ${props.team.color.b})`
})
</script>

<template>
  <a
    :href="player.linkUrl"
    target="_blank"
    class="player"
    :class="{ 'is-small': isSmall, 'is-text': isText }"
    v-if="isSmall || isText"
    :style="{ backgroundColor: teamColor }"
  >
    <div class="player__number text-bold font-roboto">#{{ player.number }}</div>
    <div class="player__alias">{{ player.alias }}</div>
  </a>
  <div class="player" v-else>
    <div class="player__inner">
      <div class="player__number" :style="{ backgroundColor: teamColor }">#{{ player.number }}</div>
      <div class="player__name">{{ player.name }}</div>
      <p class="player__position">{{ player.position }}</p>
    </div>
    <v-btn
      v-if="player.linkUrl"
      size="small"
      color="accent"
      variant="text"
      append-icon="mdi-open-in-new"
      :href="player.linkUrl"
      target="_blank"
      @click.stop=""
      >選手ページ</v-btn
    >
  </div>
</template>

<style lang="scss" scoped>
.player {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__inner {
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: auto 1fr;
    align-items: center;
    column-gap: 0.5rem;
  }

  &__number {
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #fff;
    width: 3rem;
    font-size: 1rem;
    font-weight: bold;
    grid-row: 1 / 3;
  }

  &__name {
    font-weight: bold;
    grid-row: 1 / 2;
    grid-column: 2 / 3;
  }

  &__position {
    font-size: 0.8rem;
    grid-row: 2 / 3;
    grid-column: 2 / 3;
  }

  &.is-small {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    aspect-ratio: 1;
    border-radius: 50%;
    color: #fff;
    line-height: 1;
  }

  &.is-small &__number {
    font-size: 1rem;
    aspect-ratio: auto;
  }

  &.is-small &__alias {
    font-size: 10px;
  }

  &.is-text {
    color: var(--color-accent) !important;
    flex-direction: row;
    align-items: center;
    gap: 2px;
    aspect-ratio: auto;
    width: fit-content;
    color: #fff;
    font-size: 12px;
  }

  &.is-text &__number {
    font-size: 12px;
    aspect-ratio: auto;
    width: auto;
    line-height: 1;
    color: var(--color-accent) !important;
  }

  &.is-text &__alias {
    font-size: 12px;
    font-weight: bold;
    line-height: 1;
  }
}
</style>
