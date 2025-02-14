<template>
  <div class="container">
    <el-card>
      <template #header>
        <div class="text-center">
          <span class="text-xl font-medium">图片裁剪</span>
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
        <!-- 裁剪区域 -->
        <img ref="imageRef" :src="imageUrl" alt="Crop Image" class="cropper" />

        <!-- 裁剪控制面板 -->
        <el-form class="mt-4">
          <el-form-item label="裁剪比例">
            <el-radio-group v-model="aspectRatioOption" @change="handleAspectRatioChange">
              <el-radio-button value="free">自由裁剪</el-radio-button>
              <el-radio-button value="1:1">1:1</el-radio-button>
              <el-radio-button value="4:3">4:3</el-radio-button>
              <el-radio-button value="16:9">16:9</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item>
            <el-button-group>
              <el-button @click="rotateLeft">
                <el-icon><refresh-left /></el-icon>
                向左旋转
              </el-button>
              <el-button @click="rotateRight">
                <el-icon><refresh-right /></el-icon>
                向右旋转
              </el-button>
              <el-button @click="flipHorizontal">
                <el-icon><sort /></el-icon>
                水平翻转
              </el-button>
              <el-button @click="flipVertical">
                <el-icon><sort /></el-icon>
                垂直翻转
              </el-button>
            </el-button-group>
          </el-form-item>

          <el-button
              type="primary"
              @click="cropImage"
          >
            下载裁剪后的图片
          </el-button>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { UploadFilled, Loading, RefreshLeft, RefreshRight, Sort } from '@element-plus/icons-vue'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

const imageUrl = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const imageRef = ref(null)
const cropper = ref(null)
const aspectRatioOption = ref('free')
const aspectRatio = ref(NaN)

// 文件大小限制（10MB）
const MAX_FILE_SIZE = 10 * 1024 * 1024
// 支持的图片格式
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png']

// 验证文件
const validateFile = (file) => {
  if (!SUPPORTED_FORMATS.includes(file.type)) {
    errorMessage.value = '不支持的文件格式'
    return false
  }
  if (file.size > MAX_FILE_SIZE) {
    errorMessage.value = '文件大小不能超过10MB'
    return false
  }
  return true
}

// 处理文件选择
const handleFileSelect = async (uploadFile) => {
  const file = uploadFile.raw
  if (!validateFile(file)) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const reader = new FileReader()
    reader.onload = (e) => {
      imageUrl.value = e.target.result
      // 确保图片加载完成后再初始化裁剪器
      nextTick(() => {
        cropper.value = new Cropper(imageRef.value, {
          aspectRatio: aspectRatio.value,
          viewMode: 2,
          guides: true,
          background: true,
          rotatable: true,
          scalable: true,
          zoomable: true,
          center: true,
          autoCrop: true,
          minContainerWidth: 500,
          minContainerHeight: 400,
        })
      })
      isLoading.value = false
    }
    reader.onerror = () => {
      console.error('图片加载失败');
      errorMessage.value = '图片加载失败'
      isLoading.value = false
    }
    reader.readAsDataURL(file)
  } catch (error) {
    errorMessage.value = '图片处理失败'
    isLoading.value = false
  }
}

// 处理裁剪比例变化
const handleAspectRatioChange = (value) => {
  let ratio
  switch (value) {
    case 'free':
      ratio = NaN
      console.log(ratio)
      break
    case '1:1':
      ratio = 1
      console.log(ratio)
      break
    case '4:3':
      ratio = 4/3
      console.log(ratio)
      break
    case '16:9':
      ratio = 16/9
      console.log(ratio)
      break
  }
  aspectRatio.value = ratio
  // 直接调用裁剪器的setAspectRatio方法来更新比例
  if (cropper.value) {
    cropper.value.setAspectRatio(ratio)
  }
}

// 向左旋转
const rotateLeft = () => {
  if (cropper.value) {
    cropper.value.rotate(-90)
  }
}

// 水平翻转
const flipHorizontal = () => {
  if (cropper.value) {
    console.log(cropper.value)
    cropper.value.scaleX(-cropper.value.getImageData().scaleX || -1)
  }
}

// 垂直翻转
const flipVertical = () => {
  if (cropper.value) {
    console.log(cropper.value)
    cropper.value.scaleY(-cropper.value.getImageData().scaleY || -1)
  }
}

// 向右旋转
const rotateRight = () => {
  if (cropper.value) {
    cropper.value.rotate(90)
  }
}

// 裁剪并下载图片
const cropImage = () => {
  if (cropper.value) {
    const canvas = cropper.value.getCroppedCanvas()
    const link = document.createElement('a')
    link.download = 'cropped-image.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }
}
</script>

<style scoped>
.image-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 20px;
}

.cropper {
  width: 100%;
  height: 500px;
  background-color: #f5f5f5;
  min-height: 400px;
}

.upload-area {
  width: 100%;
  padding: 20px;
  border: 2px dashed #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #409eff;
}

.el-icon--upload {
  font-size: 48px;
  color: #909399;
  margin-bottom: 16px;
}

.el-upload__text {
  color: #606266;
  font-size: 14px;
  text-align: center;
}

.el-upload__text em {
  color: #409eff;
  font-style: normal;
}

el-form {
  width: 100%;
  margin-top: 20px;
}

el-button {
  margin-top: 20px;
}
</style>