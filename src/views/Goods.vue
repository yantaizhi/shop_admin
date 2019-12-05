<template>
  <div class="goods">
    <el-button @click="show" type="success" plain>添加商品</el-button>

    <!-- 渲染表格 -->
    <el-table :data="goodsList">
      <el-table-column
        type="index"
        :index="indexMethod"
        width="50">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格"
        width="120">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量">
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template v-slot="{row}">
          <p>{{ row.add_time | time }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template v-slot="{ row }">
          <el-button type="success" icon="el-icon-edit" plain size="mini" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="total, sizes, prev, pager, next"
      :current-page="pagenum"
      :page-sizes="[5,10,15,20,25]"
      :page-size="pagesize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange">
    </el-pagination>
  </div>
</template>
<script>
export default {
  data () {
    return {
      pagenum: 1,
      pagesize: 5,
      goodsList: [],
      total: 0
    }
  },
  created () {
    this.getGoods()
  },
  methods: {
    show () {
      this.$router.push('/goods-add')
    },
    async getGoods () {
      const { meta, data } = await this.$axios.get('goods', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      console.log(data)
      if (meta.status === 200) {
        this.goodsList = data.goods
        this.total = data.total
        console.log(this.goodsList)
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getGoods()
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getGoods()
    },
    indexMethod (index) {
      return index + 1 + (this.pagenum - 1) * this.pagesize
    }
  }
}
</script>
<style lang="less" scoped>
  .el-button{
    margin: 10px 0 10px 0
  }
</style>
