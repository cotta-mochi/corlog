<script setup lang="ts">
import { computed } from 'vue'
const { location } = defineProps<{ location: string }>()
const googleMapUrl = computed(() => {
  const url = new URL('https://www.google.com/maps')
  url.searchParams.set('q', location)
  return url.href
})
</script>
<template>
  <a class="google-map-link" :href="googleMapUrl" target="_blank"
    ><v-icon icon="mdi-map-marker" class="google-map-link__icon"></v-icon>{{ location }}</a
  >
</template>
<style lang="scss" scoped>
.google-map-link {
  position: relative;
  display: inline-block;
  color: inherit;
  text-decoration: none;
  padding-inline: 20px;

  &__icon {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
  &:hover {
    text-decoration: underline;
  }
}
</style>
