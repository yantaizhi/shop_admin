<template>
  <div class="category">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button class="btn" type="success" plain>添加分类</el-button>
    <el-table
      :data="categoryList"
      style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column
        prop="cat_name"
        label="分类名称">
      </el-table-column>
      <el-table-column
        prop="name"
        label="是否有效">
        <template v-slot="{ row }">
          {{row.cat_deleted ? '是':'否'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="cat_level"
        label="层级">
      </el-table-column>
      <el-table-column label="操作">
        <el-button size="mini" plain icon="el-icon-edit" circle type="primary"></el-button>
        <el-button size="mini" plain icon="el-icon-delete" circle type="danger"></el-button>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>
<script>
export default {
  data () {
    return {
      categoryList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0
    }
  },
  created () {
    this.getCategory()
  },
  methods: {
    async getCategory () {
      const { meta, data } = await this.$axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.categoryList = data.result
        console.log(this.categoryList)
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCategory()
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
.btn{
  margin:10px 0 10px 10px;
}

</style>
