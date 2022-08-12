<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
            placeholder="请输入..."
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="用户名"> </el-table-column>
        <el-table-column prop="email" label="邮箱" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="confirmDelete(scope.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="info"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :total="total"
        :page-size="queryInfo.pagesize"
        :page-sizes="[1, 2, 5, 10, 20, 30]"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      :before-close="(_) => (addDialogVisible = false)"
      :visible="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <span slot="title">用户注册</span>

      <el-form
        :model="addForm"
        ref="addFormRef"
        label-width="70px"
        :rules="addFormRules"
      >
        <el-form-item label="用户名:" prop="username"
          ><el-input v-model="addForm.username"></el-input
        ></el-form-item>
        <el-form-item label="密码:" prop="password"
          ><el-input
            v-model="addForm.password"
            type="password"
            show-password
          ></el-input
        ></el-form-item>
        <el-form-item label="邮箱:" prop="email"
          ><el-input v-model="addForm.email" type="email"></el-input
        ></el-form-item>
        <el-form-item label="电话:" prop="mobile"
          ><el-input v-model="addForm.mobile"></el-input
        ></el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addUser"> 确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :before-close="(_) => (editDialogVisible = false)"
      :visible="editDialogVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <span slot="title">用户修改</span>

      <el-form
        :model="editForm"
        ref="editFormRef"
        label-width="70px"
        :rules="addFormRules"
      >
        <el-form-item label="用户名:" prop="username"
          ><el-input v-model="editForm.username" disabled></el-input
        ></el-form-item>
        <el-form-item label="邮箱:" prop="email"
          ><el-input v-model="editForm.email"></el-input
        ></el-form-item>
        <el-form-item label="电话:" prop="mobile"
          ><el-input v-model="editForm.mobile"></el-input
        ></el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateUser(currentId)">
          确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)$/
      if (regEmail.test(value)) return cb()
      cb(new Error('邮箱不合法！'))
    }

    var checkMobile = (rule, value, cb) => {
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) return cb()
      cb(new Error('电话不合法！'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      userList: [],
      total: 2,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      currentId: '',
      editForm: {},
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度3-10个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度3-10个字符', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
    }
  },
  mounted() {
    this.getUserList()
  },

  methods: {
    updateEditFormById(id) {
      this.editForm = this.userList.filter((user) => user.id === id)[0]
    },
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      })
      //   console.log(res.data)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('更新成功')
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('表单验证失败！请重新输入！')
        }
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加请求失败！')
        }
        this.addDialogVisible = false
        this.getUserList()
        this.$message.success('新用户添加成功！')
      })
    },
    showEditDialog({ id }) {
      this.updateEditFormById(id)
      this.currentId = id
      this.editDialogVisible = true
      return this.$message.success('获取用户信息成功！')
    },
    updateUser(id) {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          this.updateEditFormById(id)
          return this.$message.error('表单验证不通过')
        }
        const { data: res } = await this.$http.put('users/' + id, this.editForm)
        if (res.meta.status !== 200) {
          this.updateEditFormById(id)
          return this.$message.error('更新失败')
        }
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('更新成功')
      })
    },
    editDialogClosed() {
      this.getUserList()
      this.updateEditFormById(this.currentId)
    },
    confirmDelete(id) {
      this.$confirm('确认删除？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败！')
          }
          this.getUserList()
          this.$message.success('删除成功！')
        })
        .catch((err) => {
          return this.$message.info('已取消删除！')
        })
    },
  },
}
</script>

<style>
</style>