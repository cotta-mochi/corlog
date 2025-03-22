<script lang="ts" setup>
import imageCompression from 'browser-image-compression'
import { watch, ref, onMounted } from 'vue'
const { file, maxWidthOrHeight = 180 } = defineProps<{
  file: File | undefined
  maxWidthOrHeight?: number
}>()
const thumbnailUrl = ref('')
const compress = async () => {
  if (!file) return
  const options = {
    maxWidthOrHeight: maxWidthOrHeight * 2,
    useWebWorker: true,
  }
  const thumbnail = await imageCompression(file, options)
  thumbnailUrl.value = URL.createObjectURL(thumbnail)
}
onMounted(async () => {
  await compress()
})
watch(
  () => file,
  async () => {
    await compress()
  },
)
</script>
<template>
  <div class="thumbnail" :style="{ width: `${maxWidthOrHeight}px` }">
    <img :src="thumbnailUrl" alt="" />
  </div>
</template>
<style lang="scss" scoped>
.thumbnail {
  max-width: 100%;
  aspect-ratio: 1;
}
.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
