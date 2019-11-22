<template>
  <div class="roles">
   <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
export default {}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  height: 40px;
  line-height: 40px;
  background-color: #eaeef1;
  padding-left: 10px;
}

.search {
  width: 300px;
  margin: 10px 10px 10px 0;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
