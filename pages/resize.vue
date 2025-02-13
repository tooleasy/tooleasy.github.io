<template>
  <div class="container mx-auto p-4 max-w-2xl">
    <el-card>
      <template #header>
        <div class="text-center">
          <span class="text-xl font-medium">图片尺寸调整</span>
        </div>
      </template>

      <!-- 图片上传区域 -->
      <el-upload
          class="upload-area mb-6"
          drag
          :auto-upload="false"
          :show-file-list="false"
          accept="image/*"
          :on-change="handleFileSelect"
      >
        <template #trigger>
          <div v-if="!imageUrl && !isLoading && !errorMessage" class="text-center">
            <el-icon class="el-icon--upload mx-auto block"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖拽图片到此处或 <em>点击上传</em>
            </div>
            <div class="text-sm text-gray-400 mt-2">支持 JPG、PNG 格式</div>
          </div>
        </template>
      </el-upload>

      <div v-if="isLoading" class="text-center py-8">
        <el-icon class="is-loading mb-2" :size="24"><loading /></el-icon>
        <div class="text-gray-600">正在处理图片...</div>
      </div>

      <div v-else-if="errorMessage" class="text-center py-8">
        <el-alert
            :title="errorMessage"
            type="error"
            :closable="false"
            class="mb-4"
        />
        <el-button type="primary" @click="errorMessage = ''">
          重试
        </el-button>
      </div>

      <el-image
          v-else-if="imageUrl"
          :src="imageUrl"
          fit="contain"
          class="mx-auto block max-h-[300px] mt-4"
      />

      <!-- 尺寸调整控制面板 -->
      <el-form v-if="imageUrl" class="mt-6 w-full max-w-3xl mx-auto">
        <el-form-item label="缩放比例" class="mb-6">
          <el-row class="items-center justify-center">
            <el-col :span="16">
              <el-slider
                  v-model="scale"
                  :min="1"
                  :max="100"
                  :format-tooltip="value => `${value}%`"
                  @input="handleScaleChange"
              />
            </el-col>
            <el-col :span="8" class="text-right">
              <span class="text-gray-600">{{ scale }}%</span>
            </el-col>
          </el-row>
        </el-form-item>

        <el-button
            type="primary"
            @click="downloadImage"
            class="w-full mx-auto block"
        >
          下载调整后的图片
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { UploadFilled, Loading } from '@element-plus/icons-vue'

const fileInput = ref(null)
const imageUrl = ref('')
const originalImageUrl = ref('')
const scale = ref(100)
const width = ref(0)
const height = ref(0)
const originalWidth = ref(0)
const originalHeight = ref(0)
const isLoading = ref(false)
const errorMessage = ref('')

// 文件大小限制（10MB）
const MAX_FILE_SIZE = 10 * 1024 * 1024
// 支持的图片格式
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp']

// 处理文件选择
const handleFileSelect = (uploadFile) => {
  const file = uploadFile.raw
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
      originalWidth.value = img.width
      originalHeight.value = img.height
      width.value = img.width
      height.value = img.height
      scale.value = 100
      isLoading.value = false
    }
    img.onerror = () => {
      errorMessage.value = '图片加载失败，请重试'
      isLoading.value = false
    }
    img.src = e.target.result
    imageUrl.value = e.target.result
    originalImageUrl.value = e.target.result
  }
  reader.onerror = () => {
    errorMessage.value = '图片读取失败，请重试'
    isLoading.value = false
  }
  reader.readAsDataURL(file)
}

// 处理缩放比例变化
const handleScaleChange = () => {
  width.value = Math.round(originalWidth.value * scale.value / 100)
  height.value = Math.round(originalHeight.value * scale.value / 100)

  // 更新预览图片
  const canvas = document.createElement('canvas')
  canvas.width = width.value
  canvas.height = height.value

  const ctx = canvas.getContext('2d')
  const img = new Image()
  img.onload = () => {
    ctx.drawImage(img, 0, 0, width.value, height.value)
    imageUrl.value = canvas.toDataURL('image/png')
  }
  img.src = originalImageUrl.value
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
