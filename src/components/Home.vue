<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button></el-header
    >
    <el-container>
      <el-aside :width="isCollapse ? 'auto' : '180px'">
        <div class="toggle-button" @click="toggleCollapse">| | |</div>
        <el-menu
          background-color="#333744"
          text-color="white"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="`el-icon-${iconsObj[item.id]}`"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main><router-view></router-view> </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Welcome from './Welcome.vue'
export default {
  data() {
    return {
      menuList: [],
      activePath: '',
      iconsObj: {
        125: 'user-solid',
        103: 's-cooperation',
        101: 's-goods',
        102: 's-order',
        145: 'data-line',
      },
      isCollapse: false,
    }
  },
  components: {
    // Welcome,
  },
  mounted() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },

  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menuList = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
  },
}
</script>

<style lang="less" scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  background-color: #373d41;
  color: white;
  > div {
    display: flex;
    align-items: center;
    > span {
      padding-left: 15px;
    }
  }
  img {
    width: 50px;
    height: 50px;
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.el-container {
  height: 100%;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: coral;
  // display: flex;
  // justify-content: center;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
  box-sizing: border-box;
}
</style>