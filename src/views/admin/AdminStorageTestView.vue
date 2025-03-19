<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { storage } from '@/firebase_settings'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import imageCompression from 'browser-image-compression'
import { max } from 'date-fns'
import CorlogThumbnail from '@/components/CorlogThumbnail.vue'
const imageUrl = ref('')
const imageFile = ref<File>()
const files = ref<File[]>([])
const thumbnailUrl = ref('')

watch(files, async () => {
  if (!imageFile.value) return
  const options = {
    maxWidthOrHeight: 180,
    useWebWorker: true,
  }
  const thumbnail = await imageCompression(imageFile.value, options)
  thumbnailUrl.value = URL.createObjectURL(thumbnail)
})

const uploadImage = async () => {
  if (!files.value) return
  const options = {
    maxSizeMb: 1,
    useWebWorker: true,
  }
  for (const file of files.value) {
    const compressed = await imageCompression(file, options)
    const imagesRef = storageRef(storage, `images/${file.name}`)
    await uploadBytes(imagesRef, compressed)
  }
  alert('uploaded')
}
</script>
<template>
  <CorlogThumbnail :file="file" v-for="(file, idx) in files" :key="idx" />
  <v-file-input accept="image/*" label="File Input" v-model="files" multiple></v-file-input>
  <v-btn color="primary" @click="uploadImage">アップロード</v-btn>
</template>
