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
  
          <!-- 背景设置 -->
          <el-form-item label="背景设置">
            <el-tabs>
              <el-tab-pane label="预设背景">
                <div class="preset-backgrounds">
                  <el-radio-group v-model="backgroundImage" class="background-selector">
                    <el-radio-button v-for="bg in presetBackgrounds" :key="bg.name" :value="bg.url">
                      {{ bg.name }}
                    </el-radio-button>
                  </el-radio-group>
                </div>
              </el-tab-pane>
              <el-tab-pane label="上传背景">
                <el-upload
                  class="background-uploader"
                  action="#"
                  :auto-upload="false"
                  :show-file-list="false"
                  accept="image/*"
                  @change="handleBackgroundUpload"
                >
                  <el-button type="primary">选择背景图片</el-button>
                </el-upload>
              </el-tab-pane>
            </el-tabs>
            <div class="mt-4">
              <div class="mb-2">背景透明度</div>
              <el-slider
                v-model="backgroundOpacity"
                :min="0"
                :max="1"
                :step="0.1"
                :format-tooltip="value => `${Math.round(value * 100)}%`"
              />
            </div>
          </el-form-item>
  
          <!-- 图片尺寸设置 -->
          <el-form-item label="图片尺寸">
            <el-radio-group v-model="imageSize" class="image-size-selector">
              <el-radio-button value="square">方形 1:1</el-radio-button>
              <el-radio-button value="portrait">竖版 4:5</el-radio-button>
              <el-radio-button value="story">故事 9:16</el-radio-button>
            </el-radio-group>
          </el-form-item>
  
          <!-- 水印设置 -->
          <el-form-item label="水印设置">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-input v-model="watermarkText" placeholder="请输入水印文本" />
              </el-col>
              <el-col :span="12">
                <el-select v-model="watermarkPosition" placeholder="选择水印位置">
                  <el-option label="左上角" value="leftTop" />
                  <el-option label="右上角" value="rightTop" />
                  <el-option label="左下角" value="leftBottom" />
                  <el-option label="右下角" value="rightBottom" />
                </el-select>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="mt-4">
              <el-col :span="12">
                <div>水印大小</div>
                <el-slider
                  v-model="watermarkSize"
                  :min="12"
                  :max="36"
                  :format-tooltip="value => `${value}px`"
                />
              </el-col>
              <el-col :span="12">
                <div>水印颜色</div>
                <el-color-picker
                  v-model="watermarkColor"
                  show-alpha
                />
              </el-col>
            </el-row>
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
              <div class="watermark" :style="watermarkStyle()">{{ watermarkText }}</div>
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
  // 水印设置
  const watermarkText = ref('ToolEasy')
  const watermarkSize = ref(14)
  const watermarkColor = ref('rgba(0, 0, 0, 0.1)')
  const watermarkPosition = ref('rightBottom') // 水印位置：leftTop, rightTop, leftBottom, rightBottom
  const imageSize = ref('square')
  const textCanvas = ref(null)
  const pages = ref([])
  const backgroundImage = ref('')
  const backgroundOpacity = ref(0.5)
  const presetBackgrounds = [
    { name: '简约白', url: '' },
    { name: '渐变蓝', url: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)' },
    { name: '暖阳橙', url: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)' },
    { name: '薄荷绿', url: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)' },
    { name: '梦幻紫', url: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)' }
  ]
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
      margin: '20px auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderRadius: '8px',
      boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
      position: 'relative',
      paddingBottom: `${padding.value.bottom}px`, // 修改: 确保 padding-bottom 正确应用
      '--background-color': backgroundColor.value,
      '--background-image': backgroundImage.value ? 
        (backgroundImage.value.startsWith('data:') ? 
          `url(${backgroundImage.value})` : 
          backgroundImage.value) : 
        'none',
      '--background-opacity': backgroundImage.value ? backgroundOpacity.value : 1
    }
  
  }

  const handleBackgroundUpload = (file) => {
    if (!file || !file.raw) {
      ElMessage.error('上传文件失败，请重试');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        backgroundImage.value = e.target.result;
        ElMessage.success('背景图片上传成功');
      } else {
        ElMessage.error('图片读取失败，请重试');
      }
    };
    reader.onerror = () => {
      ElMessage.error('图片读取失败，请重试');
    };
    reader.readAsDataURL(file.raw);
  };

  const watermarkStyle = () => {
    const position = {
      leftTop: { top: '10px', left: '10px' },
      rightTop: { top: '10px', right: '10px' },
      leftBottom: { bottom: '10px', left: '10px' },
      rightBottom: { bottom: '10px', right: '10px' }
    }[watermarkPosition.value]

    return {
      position: 'absolute',
      fontSize: `${watermarkSize.value}px`,
      color: watermarkColor.value,
      ...position,
      zIndex: 3,
      pointerEvents: 'none',
      userSelect: 'none',
      fontFamily: 'Arial'
    }
  }

  const textStyle = (index) => ({
    fontFamily: fontFamily.value,
    fontSize: `${fontSize.value}px`,
    color: textColor.value,
    padding: `${padding.value.top}px ${padding.value.right}px ${padding.value.bottom}px ${padding.value.left}px`, // 修改: 确保 padding-bottom 正确应用
    margin: '20px',
    textAlign: 'left',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.8',
    position: 'relative', // 新增定位
    zIndex: 2 // 确保文字在最上层
  })

  const calculatePages = () => {
    if (!text.value) {
      pages.value = ['预览效果'];
      return;
    }

    // 计算有效区域宽度和高度（减去上下左右的边距）
    const effectiveWidth = 400 - (padding.value.left + padding.value.right + 40); // 宽度减去边距
    const effectiveHeight = {
      square: 400,
      portrait: 500,
      story: 711
    }[imageSize.value] - (padding.value.top + padding.value.bottom + 40); // 高度减去边距

    const lineHeight = fontSize.value * 1.8; // 每行的高度
    const charsPerLine = Math.floor(effectiveWidth / (fontSize.value * 0.6)); // 每行能容纳的字符数
    const linesPerPage = Math.floor(effectiveHeight / lineHeight); // 每页能显示的行数
    const paragraphs = text.value.split('\n'); // 根据换行符分割文本段落
    let pagesContent = []; // 用于存储分页后的内容
    let currentPage = ''; // 当前页的内容
    let currentLineCount = 0; // 当前页的行数
    let isFirstParagraph = true; // 标记是否是第一个段落

    paragraphs.forEach(paragraph => {
      // 处理段落之间的换行
      if (!isFirstParagraph) {
        if (currentLineCount >= linesPerPage) {
          pagesContent.push(currentPage.trim());
          currentPage = '';
          currentLineCount = 0;
        }
      }
      isFirstParagraph = false;

      if (paragraph.trim() === '') {
        // 处理空行
        if (currentLineCount >= linesPerPage) {
          pagesContent.push(currentPage.trim());
          currentPage = '';
          currentLineCount = 0;
        } else {
          //currentPage += '\n';
          currentLineCount++;
        }
        return;
      }

      // 将段落按照最大字符数分割成多行
      let remainingText = paragraph;
      while (remainingText.length > 0) {
        // 计算当前行可以容纳的文本
        let currentLineText = remainingText.slice(0, charsPerLine);
        let breakIndex = charsPerLine;

        // 如果没有到达文本末尾，尝试在单词边界处截断
        if (remainingText.length > charsPerLine) {
          const lastSpaceIndex = currentLineText.lastIndexOf(' ');
          if (lastSpaceIndex > 0) {
            breakIndex = lastSpaceIndex + 1;
            currentLineText = remainingText.slice(0, lastSpaceIndex);
          }
        }

        // 检查是否需要新建页面
        if (currentLineCount >= linesPerPage) {
          pagesContent.push(currentPage.trim());
          currentPage = currentLineText;
          currentLineCount = 1;
        } else {
          currentPage += (currentPage ? '\n' : '') + currentLineText;
          currentLineCount++;
        }

        // 更新剩余文本
        remainingText = remainingText.slice(breakIndex).trim();
      }
    });

    // 处理最后一页
    if (currentPage.trim()) {
      pagesContent.push(currentPage.trim());
    }

    // 确保分页内容不为空
    pages.value = pagesContent.length > 0 ? pagesContent : ['预览效果'];
  };

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
      const previewContainers = document.querySelectorAll('.preview-container');
      for (let i = 0; i < pages.value.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100)); // 等待渲染
  
        const canvas = await html2canvas(previewContainers[i], {
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
  
  .preview-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--background-color);
    z-index: 1;
  }
  
  .preview-container::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: var(--background-image);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: var(--background-opacity);
    z-index: 1;
  }
  .text-canvas {
    mix-blend-mode: normal !important; /* 确保文字不受混合模式影响 */
    max-width: 100%;
    width: 100%;
    height: 100%;
    padding: inherit;
    box-sizing: border-box;
    overflow: hidden;
    word-break: break-word;
    white-space: pre-wrap;
    line-height: 1.8;
    position: relative;
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
  

  