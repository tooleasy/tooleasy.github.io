<template>
  <header>
    <div class="container mx-auto px-4">
      <el-row  :gutter="20" >
        <!-- el-row 用于创建行布局，justify="space-between" 使内容两端对齐，align="middle" 使内容垂直居中 -->
        <el-col :span="2">
          <!-- el-col 用于创建列布局，span="6" 可以调整宽度，这里是占据六分之一的宽度 -->
          <el-menu mode="horizontal" router :ellipsis="false">
            <el-menu-item index="/">
              <span>OutEasy</span>
            </el-menu-item>
          </el-menu>
        </el-col>

        <el-col :span="2">
          <!-- 这里给中间部分设置了 span="12"，让它占据剩余空间 -->
          <el-menu mode="horizontal" router :ellipsis="false">
            <el-menu-item index="/resize">
              <span>图片调整</span>
            </el-menu-item>
          </el-menu>
        </el-col>

        <el-col :offset="20">
        </el-col>
      </el-row>
    </div>
  </header>
</template>

<script setup>
</script>
