<template>
  <div class="home">
    <el-container>
      <el-header>
        <div class="logo"></div>
        <div class="title">
          <h1>电商管理系统</h1>
        </div>
        <div class="logout">
          欢迎你，×××
          <a href="javascript:;" @click="logout">退出</a>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            router
            unique-opened
            :default-active="defaultActive"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-submenu :index="submenu.path" v-for="submenu in menuList" :key="submenu.id">
              <template v-slot:title>
                <i class="el-icon-location"></i>
                <span>{{submenu.authName}}</span>
              </template>
              <el-menu-item :index="item.path" v-for="item in submenu.children" :key="item.id">
                <i class="el-icon-menu"></i>
                <span slot="title">{{item.authName}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>

export default {
  data () {
    return {
      menuList: []
    }
  },
  async created () {
    const { data, meta } = await this.$axios.get('menus')

    if (meta.status === 200) {
      this.menuList = data
    }
  },
  methods: {
    async logout () {
      try {
        await this.$confirm('你确定要退出吗?', '温馨提示', {
          type: 'warning'
        })
        this.$router.push('/login')
        localStorage.removeItem('token')
        this.$message.success('退出成功')
      } catch {
        this.$message.info('已取消')
      }
    }
  },
  computed: {
    defaultActive () {
      return this.$route.path.slice(1).split('-')[0]
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  height: 100%;
  > .el-container {
    height: 100%;
  }
  .el-header {
    background-color: #b3c1cd;
    display: flex;
    .logo,
    .logout {
      width: 180px;
    }
    .logo {
      background: url("../assets/logo.png") no-repeat center center/contain;
    }
    .title {
      flex: 1;
      text-align: center;
      h1 {
        color: #fff;
        line-height: 60px;
      }
    }
    .logout {
      line-height: 60px;
      text-align: right;
      a {
        color: orange;
        text-decoration: none;
      }
    }
  }

  .el-aside {
    background-color: #545c64;
    .el-submenu {
      width: 200px;
    }
  }

  .el-main {
    background-color: #eaeef1;
  }
}
</style>
