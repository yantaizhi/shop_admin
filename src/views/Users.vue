<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <div>
      <el-input class="search" placeholder="请输入内容" v-model="query">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>

      <el-button type="success" plain @click="showAdd">添加用户</el-button>
    </div>
    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot="{row}">
          <el-switch
            v-model="row.mg_state"
            active-color="#13ce665"
            inactive-color="#ff4949"
            @change="changeUser(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            plain
            size="mini"
            @click="showEdit(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            plain
            size="mini"
            @click="del(row.id)"
          ></el-button>
          <el-button type="success" plain round size="mini" @click="showMod(row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      layout="total, sizes, prev, pager, next, jumper "
      :total="total"
      :current-page="pagenum"
      :page-sizes="[1,2,3,4,5]"
      :page-size="pagesize"
      @current-change="handleChange"
      @size-change="handleSizeChange"
    ></el-pagination>

    <el-dialog title="添加用户" :visible.sync="addVisible" width="35%">
      <el-form :model="form" label-width="80px" :rules="rules" ref="form" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input placeholder="请输入密码" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input placeholder="请输入手机号码" v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改用户" :visible.sync="editVisible" width="35%">
      <el-form :model="editForm" label-width="80px" :rules="rules" ref="editForm" status-icon>
        <el-form-item label="用户名">
          <el-input placeholder="请输入用户名" v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input placeholder="请输入手机号码" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配角色" :visible.sync="modVisible" width="35%">
      <el-form :model="modForm" label-width="80px" :rules="rules" ref="modForm" status-icon>
        <el-form-item label="用户名">
          <el-input placeholder="请输入用户名" v-model="modForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色列表" prop="rid">
          <el-select v-model="modForm.rid" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modVisible = false">取 消</el-button>
        <el-button type="primary" @click="mod">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      userList: [],
      roleList: [],
      query: '',
      pagenum: 1,
      pagesize: 5,
      total: 0,
      addVisible: false,
      editVisible: false,
      modVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        id: '',
        email: '',
        mobile: '',
        username: ''
      },
      modForm: {
        username: '',
        rid: '',
        id: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change']
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur', 'change']
          },
          {
            min: 6,
            max: 12,
            message: '长度在 6-12之间',
            trigger: ['blur', 'change']
          }
        ],
        email: [
          {
            type: 'email',
            message: '请输入邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确手机号',
            trigger: ['blur', 'change']
          }
        ],
        rid: [
          {
            required: true,
            message: '请选择角色',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async getList () {
      const { meta, data } = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.userList = data.users
        this.total = data.total
      }
    },
    async changeUser ({ id, mg_state: mgState }) {
      const { meta } = await this.$axios.put(`users/${id}/state/${mgState}`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.getList()
      } else {
        this.$message.error(meta.msg)
      }
    },
    async del (id) {
      try {
        await this.$confirm('你确定要删除吗？', '温馨提示', {
          type: 'waring'
        })
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch {
        this.$message.info('取消删除')
      }
    },
    handleChange (val) {
      this.pagenum = val
      this.getList()
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getList()
    },
    search () {
      this.getList()
    },
    showAdd () {
      this.addVisible = true
    },
    async add () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('users', this.form)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.$refs.form.resetFields()
          this.addVisible = false
          this.pagenum = Math.ceil((this.total + 1) / this.pagesize)
          this.getList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch {
        return false
      }
    },
    showEdit (row) {
      this.editVisible = true
      this.editForm = { ...row }
    },
    async edit () {
      try {
        await this.$refs.editForm.validate()
        const { meta } = await this.$axios.put(
          `users/${this.editForm.id}`,
          this.editForm
        )
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.$refs.editForm.resetFields()
          this.editVisible = false
          this.getList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch {
        return false
      }
    },
    async showMod (row) {
      this.modVisible = true
      this.modForm.id = row.id
      this.modForm.username = row.username

      const { meta, data } = await this.$axios.get(`users/${row.id}`)
      console.log(data)
      if (meta.status === 200) {
        if (data.rid === -1) {
          this.modForm.rid = ''
        } else {
          this.modForm.rid = data.rid
        }
      }
      console.log(this.modForm)
      const res = await this.$axios.get('roles')
      if (res.meta.status === 200) {
        this.roleList = res.data
      }
      console.log(this.roleList)
    },
    async mod () {
      try {
        const { id, rid } = this.modForm
        await this.$refs.modForm.validate()
        const { meta } = await this.$axios.put(`users/${id}/role`, { rid })
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.modVisible = false
          this.$refs.modForm.resetFields()
          this.getList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch {

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
</style>
