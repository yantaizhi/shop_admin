<template>
  <div class="rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      :data="rightList">
      <el-table-column type="index"></el-table-column>
      <el-table-column
        prop="authName"
        label="权限管理">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径">
      </el-table-column>
      <el-table-column
        prop="level"
        label="层级">
        <template v-slot="{ row }">
          <p v-if="row.level === '0'">一级</p>
          <p v-if="row.level === '1'">二级</p>
          <p v-if="row.level === '2'">三级</p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rightList: []
    }
  },
  async created () {
    const { meta, data } = await this.$axios.get('rights/list')
    if (meta.status === 200) {
      this.rightList = data
      console.log(this.rightList)
    } else {
      this.$message.error(meta.msg)
    }
  }
}
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
