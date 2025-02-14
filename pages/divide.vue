<template>
  <div class="container">
    <el-card>
      <template #header>
        <div class="text-center">
          <span class="text-xl font-medium">图片分割</span>
        </div>
      </template>

      <!-- 图片上传区域 -->
      <el-upload
          class="upload-area"
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

      <div v-if="isLoading" class="text-center">
        <el-icon class="is-loading" :size="24"><loading /></el-icon>
        <div class="text-gray-600">正在处理图片...</div>
      </div>

      <div v-else-if="errorMessage" class="text-center">
        <el-alert
            :title="errorMessage"
            type="error"
            :closable="false"
        />
        <el-button type="primary" @click="errorMessage = ''">
          重试
        </el-button>
      </div>

      <div v-else-if="imageUrl" class="image-container">
        <!-- 图片预览 -->
        <el-image
            :src="imageUrl"
            fit="contain"
            class="preview-image"
        />

        <!-- 分割参数设置 -->
        <el-form class="mt-4">
          <el-form-item label="分割设置">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-input-number
                    v-model="rows"
                    :min="1"
                    :max="10"
                    label="行数"
                    placeholder="行数"
                />
              </el-col>
              <el-col :span="12">
                <el-input-number
                    v-model="cols"
                    :min="1"
                    :max="10"
                    label="列数"
                    placeholder="列数"
                />
              </el-col>
            </el-row>
          </el-form-item>

          <el-button
              type="primary"
              @click="divideImage"
              :loading="isProcessing"
          >
            开始分割
          </el-button>
        </el-form>

        <!-- 分割结果预览 -->
        <div v-if="dividedImages.length > 0" class="divided-images mt-4">
          <h3 class="text-lg font-medium mb-2">分割结果预览</h3>
          <div class="grid-container" :style="gridStyle">
            <div v-for="(image, index) in dividedImages" :key="index" class="grid-item">
              <el-image
                  :src="image"
                  fit="contain"
                  class="divided-image"
              />
            </div>
          </div>
          <div class="mt-4 text-right">
            <el-button type="primary" @click="downloadAll">
              下载全部
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { UploadFilled, Loading } from '@element-plus/icons-vue'
import JSZip from 'jszip'

// 状态变量
const imageUrl = ref('')
const originalImage = ref(null)
const rows = ref(2)
const cols = ref(2)
const isLoading = ref(false)
const isProcessing = ref(false)
const errorMessage = ref('')
const dividedImages = ref([])

// 文件大小限制（10MB）
const MAX_FILE_SIZE = 10 * 1024 * 1024
// 支持的图片格式
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png']

// 计算分割预览网格样式
const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${cols.value}, 1fr)`,
  gap: '10px',
  marginTop: '10px'
}))

// 处理文件选择
const handleFileSelect = async (uploadFile) => {
  const file = uploadFile.raw
  if (!validateFile(file)) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        imageUrl.value = e.target.result
        originalImage.value = img
        isLoading.value = false
      }
      img.onerror = () => {
        errorMessage.value = '图片加载失败'
        isLoading.value = false
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  } catch (error) {
    errorMessage.value = '图片处理失败'
    isLoading.value = false
  }
}

// 验证文件
const validateFile = (file) => {
  if (!SUPPORTED_FORMATS.includes(file.type)) {
    ElMessage.error('请上传 JPG 或 PNG 格式的图片')
    return false
  }
  if (file.size > MAX_FILE_SIZE) {
    ElMessage.error('图片大小不能超过 10MB')
    return false
  }
  return true
}

// 分割图片
const divideImage = async () => {
  if (!originalImage.value) return

  isProcessing.value = true
  dividedImages.value = []

  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = originalImage.value

    const segmentWidth = img.width / cols.value
    const segmentHeight = img.height / rows.value

    for (let i = 0; i < rows.value; i++) {
      for (let j = 0; j < cols.value; j++) {
        canvas.width = segmentWidth
        canvas.height = segmentHeight

        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // 绘制分割后的图片部分
        ctx.drawImage(
            img,
            j * segmentWidth,
            i * segmentHeight,
            segmentWidth,
            segmentHeight,
            0,
            0,
            segmentWidth,
            segmentHeight
        )

        // 将分割后的图片添加到数组
        dividedImages.value.push(canvas.toDataURL('image/png'))
      }
    }
  } catch (error) {
    ElMessage.error('图片分割失败')
  } finally {
    isProcessing.value = false
  }
}

// 下载所有分割后的图片
const downloadAll = async () => {
  const zip = new JSZip()
  const folder = zip.folder('divided-images')

  dividedImages.value.forEach((dataUrl, index) => {
    const base64Data = dataUrl.replace(/^data:image\/(png|jpg);base64,/, '')
    folder.file(`divided-image-${index + 1}.png`, base64Data, { base64: true })
  })

  try {
    const content = await zip.generateAsync({ type: 'blob' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(content)
    link.download = 'divided-images.zip'
    link.click()
    URL.revokeObjectURL(link.href)
  } catch (error) {
    ElMessage.error('打包下载失败')
  }
}
</script>

<style scoped>
.image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.preview-image {
  max-width: 100%;
  max-height: 400px;
  margin-bottom: 20px;
}

.divided-images {
  width: 100%;
}

.grid-item {
  border: 1px solid #eee;
  padding: 5px;
  background: #fff;
}

.divided-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>