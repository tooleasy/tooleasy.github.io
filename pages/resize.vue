<template>
  <div class="container mx-auto p-4 max-w-2xl">
    <h1 class="text-2xl font-bold mb-6">图片尺寸调整</h1>
    
    <!-- 图片上传区域 -->
    <div
      class="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center"
      @drop.prevent="handleDrop"
      @dragover.prevent
      @dragenter.prevent
    >
      <input
        type="file"
        ref="fileInput"
        @change="handleFileSelect"
        accept="image/*"
        class="hidden"
      />
      <div v-if="isLoading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p class="mt-2 text-gray-600">正在处理图片...</p>
      </div>
      
      <div v-else-if="errorMessage" class="text-center py-8">
        <p class="text-red-500">{{ errorMessage }}</p>
        <button
          @click="errorMessage = '';"
          class="mt-4 text-blue-500 hover:text-blue-600"
        >
          重试
        </button>
      </div>
      
      <div v-else-if="!imageUrl" class="space-y-4">
        <div class="text-gray-500">
          拖拽图片到此处或
          <button
            @click="$refs.fileInput.click()"
            class="text-blue-500 hover:text-blue-600"
          >
            点击上传
          </button>
        </div>
        <p class="text-sm text-gray-400">支持 JPG、PNG 格式</p>
      </div>
      <img
        v-else
        :src="imageUrl"
        class="max-w-full max-h-[300px] mx-auto"
        alt="预览图"
      />
    </div>

    <!-- 尺寸调整控制面板 -->
    <div v-if="imageUrl" class="space-y-4">
      <div class="flex space-x-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">宽度 (px)</label>
          <input
            type="number"
            v-model="width"
            @input="handleWidthChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">高度 (px)</label>
          <input
            type="number"
            v-model="height"
            @input="handleHeightChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <input
          type="checkbox"
          id="maintainAspectRatio"
          v-model="maintainAspectRatio"
          class="rounded text-blue-500"
        />
        <label for="maintainAspectRatio" class="text-sm text-gray-700">
          保持宽高比
        </label>
      </div>

      <button
        @click="downloadImage"
        class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
      >
        下载调整后的图片
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const fileInput = ref(null)
const imageUrl = ref('')
const width = ref(0)
const height = ref(0)
const maintainAspectRatio = ref(true)
const aspectRatio = ref(1)
const isLoading = ref(false)
const errorMessage = ref('')

// 文件大小限制（10MB）
const MAX_FILE_SIZE = 10 * 1024 * 1024
// 支持的图片格式
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp']

// 处理文件选择
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    processImage(file)
  }
}

// 处理拖拽上传
const handleDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    processImage(file)
  }
}

// 处理图片
const validateFile = (file) => {
  if (!SUPPORTED_FORMATS.includes(file.type)) {
    errorMessage.value = '请上传 JPG、PNG 或 WebP 格式的图片'
    return false
  }
  if (file.size > MAX_FILE_SIZE) {
    errorMessage.value = '图片大小不能超过 10MB'
    return false
  }
  errorMessage.value = ''
  return true
}

const processImage = (file) => {
  if (!validateFile(file)) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      width.value = img.width
      height.value = img.height
      aspectRatio.value = img.width / img.height
      isLoading.value = false
    }
    img.onerror = () => {
      errorMessage.value = '图片加载失败，请重试'
      isLoading.value = false
    }
    img.src = e.target.result
    imageUrl.value = e.target.result
  }
  reader.onerror = () => {
    errorMessage.value = '图片读取失败，请重试'
    isLoading.value = false
  }
  reader.readAsDataURL(file)
}

// 处理宽度变化
const handleWidthChange = () => {
  if (maintainAspectRatio.value) {
    height.value = Math.round(width.value / aspectRatio.value)
  }
}

// 处理高度变化
const handleHeightChange = () => {
  if (maintainAspectRatio.value) {
    width.value = Math.round(height.value * aspectRatio.value)
  }
}

// 下载调整后的图片
const downloadImage = () => {
  const canvas = document.createElement('canvas')
  canvas.width = width.value
  canvas.height = height.value
  
  const ctx = canvas.getContext('2d')
  const img = new Image()
  img.onload = () => {
    ctx.drawImage(img, 0, 0, width.value, height.value)
    const link = document.createElement('a')
    link.download = 'resized-image.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }
  img.src = imageUrl.value
}
</script>