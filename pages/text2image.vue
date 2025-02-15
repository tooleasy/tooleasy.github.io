<template>
    <div class="container">
      <el-card class="card-container" shadow="never">
        <template #header>
          <div class="text-center">
            <h2 class="title">文字转图片</h2>
          </div>
        </template>
  
        <!-- 文本输入区域 -->
        <el-form label-width="100px">
          <el-form-item label="文本内容">
            <el-input
              v-model="text"
              type="textarea"
              :rows="4"
              placeholder="请输入要转换的文本内容"
              class="input-text"
            />
          </el-form-item>
  
          <!-- 字体样式设置 -->
          <el-form-item label="字体样式">
            <el-select v-model="fontFamily" class="select-font-family">
              <el-option label="默认" value="Arial" />
              <el-option label="优雅" value="'Times New Roman'" />
              <el-option label="可爱" value="'Comic Sans MS'" />
            </el-select>
          </el-form-item>
  
          <!-- 字体大小设置 -->
          <el-form-item label="字体大小">
            <el-slider
              v-model="fontSize"
              :min="12"
              :max="72"
              :format-tooltip="value => `${value}px`"
              class="slider-font-size"
            />
          </el-form-item>
  
          <!-- 字体颜色设置 -->
          <el-form-item label="字体颜色">
            <el-color-picker v-model="textColor" />
          </el-form-item>
  
          <!-- 背景颜色设置 -->
          <el-form-item label="背景颜色">
            <el-color-picker v-model="backgroundColor" />
          </el-form-item>
  
          <!-- 图片尺寸设置 -->
          <el-form-item label="图片尺寸">
            <el-radio-group v-model="imageSize" class="image-size-selector">
              <el-radio-button value="square">方形 1:1</el-radio-button>
              <el-radio-button value="portrait">竖版 4:5</el-radio-button>
              <el-radio-button value="story">故事 9:16</el-radio-button>
            </el-radio-group>
          </el-form-item>
  
          <!-- 边距设置 -->
          <el-form-item label="边距设置">
            <el-row :gutter="20">
              <el-col :span="6">
                <div>上边距</div>
                <el-slider
                  v-model="padding.top"
                  :min="0"
                  :max="100"
                  :format-tooltip="value => `${value}px`"
                />
              </el-col>
              <el-col :span="6">
                <div>下边距</div>
                <el-slider
                  v-model="padding.bottom"
                  :min="0"
                  :max="100"
                  :format-tooltip="value => `${value}px`"
                />
              </el-col>
              <el-col :span="6">
                <div>左边距</div>
                <el-slider
                  v-model="padding.left"
                  :min="0"
                  :max="100"
                  :format-tooltip="value => `${value}px`"
                />
              </el-col>
              <el-col :span="6">
                <div>右边距</div>
                <el-slider
                  v-model="padding.right"
                  :min="0"
                  :max="100"
                  :format-tooltip="value => `${value}px`"
                />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
  
        <!-- 预览区域 -->
        <div class="preview-container-wrapper">
          <div v-for="(page, index) in pages" :key="index" class="preview-container" :style="previewStyle(index)">
            <div ref="textCanvas" class="text-canvas" :style="textStyle(index)">
              {{ page || '预览效果' }}
            </div>
          </div>
        </div>
  
        <!-- 操作按钮 -->
        <div class="text-center mt-4">
          <el-button type="primary" @click="generateImage" :disabled="!text" class="generate-button">
            生成图片
          </el-button>
        </div>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch, onMounted } from 'vue'
  import html2canvas from 'html2canvas'
  import { ElMessage } from 'element-plus'
  import JSZip from 'jszip'

  const text = ref('')
  const fontFamily = ref('Arial')
  const fontSize = ref(14)  // 设置默认字体大小为 14px
  const textColor = ref('#333333')
  const backgroundColor = ref('#ffffff')
  const imageSize = ref('square')
  const textCanvas = ref(null)
  const pages = ref([])
  const padding = ref({
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  })

  const previewStyle = (index) => {
    const sizes = {
      square: { width: '400px', height: '400px' },
      portrait: { width: '400px', height: '500px' },
      story: { width: '400px', height: '711px' }
    }
  
    return {
      ...sizes[imageSize.value],
      backgroundColor: backgroundColor.value,
      margin: '20px auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderRadius: '8px',
      boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
      position: 'relative',
      paddingBottom: index === pages.value.length - 1 ? `${padding.value.bottom}px` : '0'
    }
  }
  
  const textStyle = (index) => ({
    fontFamily: fontFamily.value,
    fontSize: `${fontSize.value}px`,  // 文字大小为 14px
    color: textColor.value,
    padding: `${padding.value.top}px ${padding.value.right}px ${padding.value.bottom}px ${padding.value.left}px`,
    margin: '20px',
    textAlign: 'left',  // 将文本布局改为左对齐
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.8'
  })
  
  // 计算分页逻辑
  const calculatePages = () => {
    if (!text.value) {
      pages.value = ['预览效果']
      return
    }
  
    const containerWidth = 400 - (padding.value.left + padding.value.right + 40); // 减去内外边距
    const containerHeight = {
      square: 400,
      portrait: 500,
      story: 711
    }[imageSize.value] - (padding.value.top + padding.value.bottom + 40); // 减去内外边距
  
    const lineHeight = fontSize.value * 1.8;
    const charsPerLine = Math.floor(containerWidth / (fontSize.value * 0.6));
    const linesPerPage = Math.floor(containerHeight / lineHeight);
  
    // 将文本按换行符分割
    const paragraphs = text.value.split('\n');
    const newPages = [];
    let currentPage = '';
    let currentLines = 0;
  
    paragraphs.forEach(paragraph => {
      if (paragraph === '') {
        currentLines++;
        if (currentLines >= linesPerPage) {
          newPages.push(currentPage.trim());
          currentPage = '';
          currentLines = 1;
        } else {
          currentPage += '\n';
        }
        return;
      }
  
      const words = paragraph.split(/(?<=\s)/); // 按空格分词，保留空格
      words.forEach(word => {
        const testLine = currentPage.split('\n').pop() + word;
        
        if (testLine.length <= charsPerLine) {
          currentPage += word;
        } else {
          currentLines++;
          if (currentLines >= linesPerPage) {
            newPages.push(currentPage.trim());
            currentPage = word;
            currentLines = 1;
          } else {
            currentPage += '\n' + word;
          }
        }
      });
  
      currentLines++;
      if (currentLines >= linesPerPage) {
        newPages.push(currentPage.trim());
        currentPage = '';
        currentLines = 0;
      } else {
        currentPage += '\n';
      }
    });
  
    if (currentPage.trim()) {
      newPages.push(currentPage.trim());
    }
  
    pages.value = newPages.length > 0 ? newPages : ['预览效果'];
  }
  
  // 延迟计算分页
  const debouncedCalculatePages = (() => {
    let timer;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(calculatePages, 300);
    }
  })();
  
  // 生成并下载图片
  const generateImage = async () => {
    if (!textCanvas.value || pages.value.length === 0) return;
  
    try {
      const zip = new JSZip();
      const images = zip.folder('images');
  
      // 遍历每一页生成图片
      for (let i = 0; i < pages.value.length; i++) {
        currentPage.value = i;
  
        await new Promise(resolve => setTimeout(resolve, 100)); // 等待渲染
  
        const canvas = await html2canvas(textCanvas.value.parentElement, {
          backgroundColor: backgroundColor.value,
          scale: 2 // 提高渲染质量
        });
  
        const base64Data = canvas.toDataURL('image/png').split(',')[1];
        images.file(`text-image-${i + 1}.png`, base64Data, { base64: true });
      }
  
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'text-images.zip';
      link.click();
      URL.revokeObjectURL(link.href);
  
      ElMessage.success('图片生成成功');
    } catch (error) {
      console.error('生成图片失败:', error);
      ElMessage.error('生成图片失败，请重试');
    }
  }
  
  // 监听文本和样式变化
  watch([text, fontSize, fontFamily, padding, imageSize, textColor, backgroundColor], debouncedCalculatePages);
  
  // 初始化
  onMounted(() => {
    calculatePages();
  });
  </script>
  
  <style scoped>
  .container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .card-container {
    border-radius: 10px;
    padding: 20px;
    background-color: #f9f9f9;
  }
  
  .title {
    font-size: 24px;
    color: #333;
    font-weight: bold;
  }
  
  .input-text {
    border-radius: 8px;
  }
  
  .select-font-family, .slider-font-size {
    width: 100%;
  }
  
  .image-size-selector {
    display: flex;
    gap: 10px;
  }
  
  .generate-button {
    background-color: #409EFF;
    border-color: #409EFF;
    color: white;
  }
  
  .preview-container-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    margin-top: 20px;
  }
  
  .preview-container {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  .text-canvas {
    max-width: 100%;
    transition: all 0.3s ease;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    text-align: left;  /* 改为左对齐 */
    word-break: break-word;
    white-space: pre-wrap;
  }
  .text-canvas img {
    display: inline-block;  /* 确保图片在文本行内显示 */
    max-width: 100%;
    height: auto;
  }

  .text-canvas span, .text-canvas img {
    display: inline-block;
    vertical-align: middle;  /* 保证文本与 emoji 在同一基线上 */
  }
  .text-canvas .emoji {
    white-space: nowrap;  /* 保证 emoji 后面的空格不会导致换行 */
  }
  </style>
  