<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row><el-button type="primary">添加角色</el-button></el-row>
      <el-table :data="rolesList" stripe border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item, inde) in scope.row.children"
              :key="item.id"
              style="margin: 5px"
              :class="['bdbottom', inde !== 0 ? '' : 'bdtop']"
              class="flex-center"
            >
              <el-col :span="5"
                ><el-tag
                  closable
                  @close="removeRightById(scope.row, item.id)"
                  >{{ item.authName }}</el-tag
                ><i class="el-icon-caret-right"></i
              ></el-col>
              <el-col :span="19">
                <el-row
                  v-for="(subItem, subInde) in item.children"
                  :key="subItem.id"
                  :class="['bdbottom', subInde !== 0 ? '' : 'bdtop']"
                  class="flex-center"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, subItem.id)"
                      >{{ subItem.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-row
                      v-for="(lastItem, lastInde) in subItem.children"
                      :key="lastItem.id"
                      :class="['bdbottom', lastInde !== 0 ? '' : 'bdtop']"
                    >
                      <el-col :span="20">
                        <el-tag
                          type="info"
                          closable
                          @close="removeRightById(scope.row, lastItem.id)"
                          >{{ lastItem.authName }}</el-tag
                        >
                        <!-- <i class="el-icon-caret-right"></i> -->
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            >
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <el-button
              type="info"
              icon="el-icon-setting"
              size="mini"
              @click="showRightDialogVisible(scope.row)"
              >分配权限</el-button
            >
          </template> </el-table-column
        >ast
      </el-table>
    </el-card>
    <el-dialog
      :visible="setRightDialogVisible"
      :before-close="() => (setRightDialogVisible = false)"
      title="分配权限"
      width="50%"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      >
      </el-tree>
      <span slot="footer">
        <el-button @click="setRightDialogVisible = false">取消</el-button>
        <el-button @click="allocateRights" type="primary">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      setRightDialogVisible: false,
      rolesList: [],
      rightsList: [],
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      defKeys: [],
      roleId: '',
    }
  },
  mounted() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败！')
      }
      this.rolesList = res.data
      //   console.log(res.data)
    },
    removeRightById(role, rightId) {
      this.$confirm('确认删除该权限？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
          )
          // console.log(res.data)
          if (res.meta.status !== 200) return this.$message.error('删除失败！')
          role.children = res.data
          return this.$message.success('删除成功！')
        })
        .catch(() => {
          return this.message.info('删除取消')
        })
    },
    async showRightDialogVisible(rowInfo) {
      this.roleId = rowInfo.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败！')
      }
      this.rightsList = res.data

      this.defKeys = []
      console.log(this.defKeys)
      this.getLeafKeys(rowInfo, this.defKeys)
      console.log(this.defKeys)
      this.setRightDialogVisible = true
    },
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((node) => {
        this.getLeafKeys(node, arr)
      })
    },
    async allocateRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      // console.log(keys)
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr,
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('成功！')
      this.getRolesList()
      this.setRightDialogVisible = false
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>