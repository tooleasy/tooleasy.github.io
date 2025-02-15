<template>
  <footer class="bg-gray-50 border-t">
    <el-row justify="center" align="middle" class="w-full min-h-[80px]">
      <!-- el-row 用于创建行布局，justify="center" 使内容水平居中，align="middle" 使内容垂直居中 -->
      <el-col :span="24">
        <!-- el-col 用于创建列布局，span="24" 表示占据整行 -->
        <div class="text-center">
          <p class="text-gray-600 text-sm">&copy; 2025 OutEasy</p>
        </div>
      </el-col>
    </el-row>
  </footer>
</template>

<style scoped>
footer {
  border-top: 1px solid #ffffff; /* 对应 border-t 的样式 */
}

.text-center {
  text-align: center;
}

.text-gray-600 {
  color: #4b5563; /* 对应 text-gray-600 的颜色 */
}

.text-sm {
  font-size: 0.875rem; /* 对应 text-sm 的样式 */
}
</style>
