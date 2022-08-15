<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意！只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>
      <el-row style="margin: 15px 0; font-size: medium">
        <span>选择商品分类:</span>
        <el-cascader
          style="width: 40%; margin: 0 15px"
          expand-trigger="hover"
          :options="cateList"
          :props="cateProps"
          v-model="selectedCateKeys"
          @change="handleChange"
          clearable
        ></el-cascader>
      </el-row>
      <el-tabs v-model="activeName" @click="handleTabClick">
        <el-tab-pane name="many" label="动态参数">
          <el-button
            type="primary"
            size="mini"
            :disabled="!isSelected"
            @click="dialogVisible = true"
            >添加参数</el-button
          >
          <el-table border stripe :data="manyTableData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="deleteTag(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  v-if="scope.row.inputVisible"
                  class="tagInput"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ 新标签</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作" width="200px">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="only" label="静态属性 ">
          <el-button
            type="primary"
            size="mini"
            :disabled="!isSelected"
            @click="dialogVisible = true"
            >添加属性</el-button
          >
          <el-table border stripe :data="onlyTableData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="deleteTag(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  v-if="scope.row.inputVisible"
                  class="tagInput"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ 新标签</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作" width="200px">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :visible="dialogVisible"
      width="30%"
      :before-close="() => (dialogVisible = false)"
      @close="addDialogClose"
    >
      <span slot="title"
        >添加{{ activeName === 'many' ? '动态' : '静态' }}参数</span
      >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="right"
      >
        <el-form-item prop="attr_name" :label="titleText">
          <el-input v-model="addForm.attr_name"> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="info" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addAttribute">确定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog
      :visible="editDialogVisible"
      width="30%"
      :before-close="() => (editDialogVisible = false)"
      @close="editDialogClose"
    >
      <span slot="title"
        >修改{{ activeName === 'many' ? '动态' : '静态' }}参数</span
      >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        label-position="right"
      >
        <el-form-item prop="attr_name" :label="titleText">
          <el-input v-model="editForm.attr_name"> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="info" @click="editDialogVisible = false"
          >取消</el-button
        >
        <el-button type="primary" @click="editAttribute">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      selectedCateKeys: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      dialogVisible: false,
      // inputVisible: false,
      // inputValue: '',
      editDialogVisible: false,
      currentCateId: '',
      activeName: 'many',
      isSelected: false,
      manyTableData: [],
      onlyTableData: [],
      addForm: {
        attr_name: '',
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入属性名称', trigger: 'blur' },
        ],
      },
      editForm: {
        attr_name: '',
      },
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入属性名称', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    titleText() {
      return this.activeName === 'many' ? '动态参数' : '静态参数'
    },
  },

  mounted() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据失败！')
      }
      this.cateList = res.data
    },
    handleChange() {
      this.getParamsData()
    },
    async getParamsData() {
      if (this.selectedCateKeys.length === 3) {
        this.isSelected = true
        this.currentCateId = this.selectedCateKeys[2]
        const { data: res } = await this.$http.get(
          `categories/${this.currentCateId}/attributes`,
          {
            params: { sel: this.activeName },
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数数据失败！')
        }
        // console.log(res.data)

        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          item.inputVisible = false
          item.inputValue = ''
        })
        // console.log(res.data)
        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      } else {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        this.isSelected = false
      }
    },
    handleTabClick() {
      this.getParamsData()
    },
    addAttribute() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('验证表单失败！')
        }
        const { data: res } = await this.$http.post(
          `categories/${this.currentCateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败！')
        }
        this.getParamsData()
        this.$message.success('添加成功！')
        this.dialogVisible = false
      })
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    editAttribute() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('验证表单失败！')
        }
        const { data: res } = await this.$http.put(
          `categories/${this.currentCateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新失败！')
        }
        this.getParamsData()
        this.$message.success('更新成功！')
        this.editDialogVisible = false
      })
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.currentCateId}/attributes/${id}`,
        {
          params: { attr_sel: this.activeName },
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('请求失败！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    async removeParams(id) {
      await this.$confirm('确认删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${this.currentCateId}/attributes/${id}`
          )
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败！')
          }
          this.getParamsData()
          return this.$message.success('删除成功！')
        })
        .catch(() => {
          return this.$message.info('已取消删除！')
        })
    },
    handleInputConfirm(rowInfo) {
      if (rowInfo.inputValue.trim().length !== 0) {
        rowInfo.attr_vals.push(rowInfo.inputValue.trim())
        rowInfo.inputValue = ''
        this.saveAttrVals(rowInfo)
      }
      rowInfo.inputVisible = false
    },
    showInput(rowInfo) {
      rowInfo.inputValue = ''
      rowInfo.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.focus()
      })
    },
    async saveAttrVals(rowInfo) {
      const { data: res } = await this.$http.put(
        `categories/${this.currentCateId}/attributes/${rowInfo.attr_id}`,
        {
          attr_name: rowInfo.attr_name,
          attr_sel: rowInfo.attr_sel,
          attr_vals: rowInfo.attr_vals.join(' '),
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改标签失败！')
      }
      rowInfo = res.data
      return this.$message.success('修改标签成功！')
    },
    deleteTag(index, rowInfo) {
      rowInfo.attr_vals.splice(index, 1)
      this.saveAttrVals(rowInfo)
    },
  },
}
</script>

<style>
.tagInput {
  min-width: 100px;
  width: 100px;
}
</style>