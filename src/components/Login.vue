<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <el-form
        class="elFrom"
        label-width="80px"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginForm"
      >
        <el-form-item label="用户名" prop="username"
          ><el-input
            prefix-icon="el-icon-user"
            v-model="loginForm.username"
          ></el-input
        ></el-form-item>
        <el-form-item label="密码" prop="password"
          ><el-input
            prefix-icon="el-icon-more"
            v-model="loginForm.password"
            type="password"
          ></el-input
        ></el-form-item>
        <el-form-item class="flex-even">
          <el-button type="primary" @click="validateLoginForm">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度3-5个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度3-20个字符', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginForm.resetFields()
    },
    validateLoginForm() {
      this.$refs.loginForm.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status != 200) {
          // this.$notify.error({
          //   title: "登录失败",
          //   message: "重新登录！",
          // });
          this.$message.error('登录失败！')
        } else {
          // this.$notify.success({
          //   title: "登录成功",
          //   message: "正在跳转！",
          // });
          // console.log(res)
          this.$message.success('正在跳转！')
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        }
      })
    },
  },
}
</script>

<style lang='less' scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .elFrom {
    position: absolute;
    top: 100px;
    width: 90%;
  }
  .flex-even {
    display: flex;
    justify-content: space-evenly;
  }
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    // top: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: lightcoral;
    }
  }
}
</style>