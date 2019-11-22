<template>
  <div class="roles">
   <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="success" @click="show" plain>添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="roleList">
      <el-table-column type="expand">
        <template v-slot="{ row }">
         <el-row class="l1" v-for="l1 in row.children" v-bind:key="l1.id">
           <el-col :span="4">
             <el-tag @close="delRight(row.l1.id)" closable>{{l1.authName}}</el-tag>
           </el-col>

           <el-col :span="20">
             <el-row class="l2" v-for="l2 in l1.children" :key="l2.id">
               <el-col :span="4">
                 <el-tag @close=delRight(row,l2.id) closable type="success">{{l2.authName}}</el-tag>
               </el-col>
               <el-col :span="20">
                 <el-tag v-for="l3 in l2.children" :key="l3.id" class="l3" type="warning" @close="delRight(row,l3.id)" closable>{{l3.authName}}</el-tag>
               </el-col>
             </el-row>
           </el-col>
         </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column
        label="角色名称"
        prop="roleName">
      </el-table-column>
      <el-table-column
        label="描述"
        prop="roleDesc">
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button icon="el-icon-edit" plain size="mini" circle type="primary"></el-button>
          <el-button icon="el-icon-delete" plain size="mini" circle type="danger"></el-button>
          <el-button @click="showAssign(row)" icon="el-icon-edit" plain size="mini" round type="success">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignVisible"
      width="40%">

      <el-tree
        ref="tree"
        node-key="id"
        default-expand-all
        show-checkbox
        :data="data"
        :props="defaultProps"></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button @click="assignRight" type="primary">分 配</el-button>
      </span>
    </el-dialog>

    <el-dialog title="添加角色" :visible.sync="roleVisible">
      <el-form :model="roleForm" ref="roleForm">
        <el-form-item label="角色名称" label-width="100px">
          <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px">
          <el-input v-model="roleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      roleList: [],
      assignVisible: false,
      roleId: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleVisible: false,
      roleForm: {
        roleName: '',
        roleDesc: ''
      }
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const { meta, data } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.roleList = data
      }
    },
    async delRight (row, rightId) {
      const { meta, data } = await this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        row.children = data
        console.log(row.children)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async showAssign (row) {
      this.roleId = row.id
      this.assignVisible = true
      const { meta, data } = await this.$axios.get('rights/tree')
      if (meta.status === 200) {
        this.data = data
        console.log(this.data)

        const ids = []
        row.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              ids.push(l3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(ids)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async assignRight () {
      const ids = this.$refs.tree.getCheckedKeys()
      const halfs = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...ids, ...halfs].join(',')
      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.assignVisible = false
        this.getRoleList()
      } else {
        this.$message.error(meta.msg)
      }
    },
    show () {
      this.roleVisible = true
    },
    async add () {
      const { meta } = await this.$axios.post('roles', this.roleForm)
      if (meta.status === 201) {
        this.$message.success(meta.msg)
        this.$refs.roleForm.resetFields()
        this.roleVisible = false
        this.getRoleList()
      } else {
        this.$message.error(meta.msg)
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

.search {
  width: 300px;
  margin: 10px 10px 10px 0;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.el-button {
  margin-bottom: 10px;
}
.l1{
  margin-bottom: 10px;
  border-bottom: 1px dashed #ccc;
}
.l2{
  margin-bottom: 10px;
}
.l3{
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
