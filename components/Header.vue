<template>
  <header>
    <div class="container mx-auto px-4">
      <el-row  :gutter="20" >
        <el-col :span="2">
          <el-menu mode="horizontal" router :ellipsis="false">
            <el-menu-item index="/">
              <span>OutEasy</span>
            </el-menu-item>
          </el-menu>
        </el-col>

        <el-col :span="4">
          <el-menu mode="horizontal" router :ellipsis="false">
            <el-menu-item index="/resize">
              <span>图片调整</span>
            </el-menu-item>
            <el-menu-item index="/compress">
              <span>图片压缩</span>
            </el-menu-item>
            <el-menu-item index="/divide">
              <span>图片分割</span>
            </el-menu-item>
          </el-menu>
        </el-col>

        <el-col :offset="14">
        </el-col>
      </el-row>
    </div>
  </header>
</template>

<script setup>
</script>
