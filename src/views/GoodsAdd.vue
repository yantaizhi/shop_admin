<template>
  <div class="goodsadd">
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="上传图片"></el-step>
      <el-step title="步骤 3" description="商品信息"></el-step>
    </el-steps>

    <el-tabs tab-position="left" v-model="activeTab" @tab-click="handleClick">
    <el-tab-pane label="基本信息">
      <el-form ref="form" label-width="80px" :model="form">
        <el-form-item label="商品名称">
          <el-input placeholder="请输入商品名称" v-model="form.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input placeholder="请输入商品名称"  v-model="form.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input placeholder="请输入商品名称" v-model="form.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input placeholder="请输入商品名称"  v-model="form.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-cascader @change="change"
          :props="props"
          v-model="form.goods_cat"
          :options="options">
          </el-cascader>
        </el-form-item>
        <el-form-item label="是否促销">
          <el-radio-group v-model="form.isSellGood">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-button @click="next" type="primary">下一步</el-button>
    </el-tab-pane>
    <el-tab-pane label="上传图片">
      <el-upload
        :on-success="handleSuccess"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :headers="headers"
        name="file"
        action="http://localhost:8888/api/private/v1/upload"
        list-type="picture-card"        >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-button type="primary" @click="next">下一步</el-button>
    </el-tab-pane>
    <el-tab-pane label="商品内容">
      <quill-editor v-model="form.goods_introduce"></quill-editor>
      <el-button type="primary" @click="add">添加</el-button>
    </el-tab-pane>
   </el-tabs>
   <el-dialog :visible.sync="dialogVisible">
     <img width="100%" :src="dialogImageUrl" alt="">

   </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      active: 0,
      activeTab: '0',
      form: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        isSellGood: 1
      },
      dialogImageUrl: '',
      dialogVisible: false,
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  methods: {
    handleClick (tab, event) {
      this.active = +tab.index
    },
    next () {
      this.active++
      this.activeTab = this.active + ''
    },
    change () {
      console.log(this.form.goods_cat)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove (file, fileList) {
      const path = file.response.data.tmp_path
      this.form.pics = this.form.pics.filter(item => item.pic !== path)
      console.log(file, fileList)
    },
    handleSuccess (response, file, fileList) {
      const { meta, data } = response
      if (meta.status === 200) {
        this.form.pics.push({
          pic: data.tmp_path
        })
      } else {
        this.$message.error(meta.msg)
      }
    },
    async add () {
      const { meta } = await this.$axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join(',')
      })
      if (meta.status === 201) {
        this.$message.success(meta.msg)
        this.$router.push('/goods')
      } else {
        this.$message.error(meta.msg)
      }
    }
  },
  async created () {
    const { meta, data } = await this.$axios.get('categories?type=3')
    if (meta.status === 200) {
      this.options = data
      console.log(data)
    } else {
      this.$message.error(meta.msg)
    }
  }
}
</script>
<style lang="less" scoped>
  .quill-editor{
    background-color: #fff;
    /deep/.ql-editor{
      min-height: 400px;
    }
  }
</style>
