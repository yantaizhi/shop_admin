<template>
  <div class="login">
    <el-form ref="form" :rules="rules" :model="form" label-width="100px" status-icon>
      <img src="../assets/avatar.jpg" alt />
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
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
        ]
      }
    }
  },
  methods: {
    resetForm () {
      this.$refs.form.resetFields()
    },
    login () {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        console.log('该发送ajax')
        axios({
          method: 'post',
          url: 'http://localhost:8888/api/private/v1/login',
          data: this.form
        }).then(res => {
          console.log(res.data)
          const { meta, data } = res.data
          if (meta.status === 200) {
            localStorage.setItem('token', data.token)
            this.$router.push('/home')
            this.$message.success('登录成功')
          } else {
            // this.$message({
            //   type: 'error',
            //   message: res.data.meta.msg
            // })
            this.$message.error(meta.msg)
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  background-color: #2d434c;
  height: 100%;
  overflow: hidden;
  .el-form {
    background-color: #fff;
    width: 400px;
    margin: 200px auto;
    border-radius: 20px;
    padding: 75px 40px 15px;
    position: relative;
    img {
      position: absolute;
      top: -75px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 50%;
      border: 10px solid #fff;
    }
    el-button:last-child {
      margin-left: 80px;
    }
  }
}
</style>
