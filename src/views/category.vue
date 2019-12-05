<template>
  <div class="category">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button class="btn" type="success" plain @click="showAdd">添加分类</el-button>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
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
      layout="total,sizes,prev, pager, next"
      :current-page="pagenum"
      :total="total"
      :page-size="pagesize"
      :page-sizes="[5,10,15,20,25]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
    </el-pagination>

    <!-- 添加对话框 -->
  <el-dialog title="添加商品分类"
  :visible.sync="dialogVisible" width="35%">

    <el-form :model="form" label-width="80px" ref="form" :rules="rules">
      <el-form-item label="分类名称"  prop="cat_name">
        <el-input v-model="form.cat_name" placeholder="请输入分类名称" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="父级名称" prop="cat_pid">

       <el-cascader
        clearable
        v-model="form.cat_pid"
        :options="options"
        :props="props"></el-cascader>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="add">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      categoryList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      loading: false,
      dialogVisible: false,
      form: {
        cat_name: '',
        cat_pid: [],
        cat_level: ''
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }
        ]
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      }
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
        // console.log(this.categoryList)
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getCategory()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCategory()
    },
    async showAdd () {
      this.dialogVisible = true
      const { meta, data } = await this.$axios.get('categories?type=2')
      if (meta.status === 200) {
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async add () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('categories', {
          cat_name: this.form.cat_name,
          cat_pid: this.form.cat_pid[this.form.cat_pid.length - 1] || 0,
          cat_level: this.form.cat_pid.length
        })
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.visible = false
          this.$refs.form.resetFields()
          this.getCategory()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
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
