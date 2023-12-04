<template>
    <div class="rloesBox">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addUserDialog">添加角色</el-button>
                </el-col>
            </el-row>

            <el-table :data="rolesList" style="width: 100%" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row v-for="(item1, index1) in scope.row.children" :key="item1.id"
                            :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRolesById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级权限 -->
                            <el-col :span="19">
                                <el-row v-for="(item2, index2) in item1.children" :key="item2.id" :span="6"
                                    :class="[index2 == 0 ? '' : 'bdtop', 'vcenter']">
                                    <!-- 二级 -->
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRolesById(scope.row, item2.id)">
                                            {{ item2.authName }}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 三级 -->
                                    <el-col :span="18">
                                        <el-tag v-for="(item3, index3) in item2.children" type="warning" :key="item3.id"
                                            closable @close="removeRolesById(scope.row, item3.id)">
                                            {{ item3.authName }}
                                        </el-tag>

                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>

                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserDialog(scope.row.id)">
                            编辑
                        </el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRolesUser(scope.row.id)">
                            删除
                        </el-button>
                        <el-button type="warning" icon="el-icon-search" size="mini"
                            @click="showSetRightDialog(scope.row)">分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加角色的对话框 -->
        <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addUserDialogClosed()">
            <el-form :model="addUserList" ref="addUserFormRef" :rules="addUserRules" label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addUserList.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addUserList.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRolesUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改角色的对话框 -->
        <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%">
            <el-form :model="editForm" ref="editFormRef" label-width="70px">
                <el-form-item label="角色名称">
                    <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="editForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRolesUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配权限的的对话框 -->
        <el-dialog title="分配权限" :visible.sync="SetRightDialogVisible" width="50%" @close="setRightDialogClosed">
            <el-tree :data="rightList" :props="treeProps" show-checkbox node-key="id" default-expand-all
                :default-checked-keys="defKeys" ref="treeRef">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="SetRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click=allotRights>确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {
            // 角色列表
            rolesList: [],
            // 修改角色的对话框的显示隐藏
            editDialogVisible: false,
            // 根据id获取到的修改角色获取数据
            editForm: [],
            // 添加角色的对话框的显示隐藏
            addDialogVisible: false,
            // 添加角色的表单绑定数据
            addUserList: {
                roleName: '',
                roleDesc: ''
            },
            // 添加角色的校验规则
            addUserRules: {
                roleName: [
                    { trigger: 'blur' },
                ],
                roleDesc: [
                    { trigger: 'blur' },
                ]

            },
            // 分配权限对话框的显示隐藏
            SetRightDialogVisible: false,
            // 权限数据
            rightList: [],
            // 权力列表的展示规则
            treeProps: {
                label: 'authName',
                children: 'children'
            },
            // 默认选中的数据
            defKeys: [],
            // 角色id
            roleId: ''
        };
    },
    methods: {
        async getRolesList() {
            let res = await this.axios.get('roles')
            if (res.meta.status != 200) {
                return this.$message.error(res.meta.msg)
            }
            this.rolesList = res.data
        },
        // 根据id获取角色
        async editUserDialog(id) {
            let res = await this.axios.get(`roles/${id}`)
            if (res.meta.status != 200) {
                return this.$message.error(res.meta.msg)
            }
            this.editForm = res.data
            this.editDialogVisible = true
        },
        // 添加角色展示对话框的打开
        addUserDialog() {
            this.addDialogVisible = true
        },
        // 关闭添加角色的对话框触发重置事件
        addUserDialogClosed() {
            this.$refs.addUserFormRef.resetFields()
        },
        // 添加角色
        async addRolesUser() {
            let res = await this.axios.post('roles', this.addUserList)
            if (res.meta.status != 201) {
                return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg);
            this.addDialogVisible = false;
            this.getRolesList();
        },
        // 删除角色
        async removeRolesUser(id) {
            let confirmResult = await this.$confirm('此操作将永久删除该用户 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch((error) => { return error })
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            let res = await this.axios.delete(`roles/${id}`)
            if (res.meta.status != 200) {
                return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg);
            this.getRolesList()
        },
        // 修改角色
        async editRolesUser() {
            let res = await this.axios.put(`roles/${this.editForm.roleId}`, {
                roleName: this.editForm.roleName,
                roleDesc: this.editForm.roleDesc
            })
            if (res.meta.status != 200) {
                return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            this.editDialogVisible = false
            this.getRolesList()
        },
        // 删除角色指定权限
        async removeRolesById(role, rightID) {
            let confirmResult = await this.$confirm('此操作将永久删除该用户 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch((error) => { return error })
            if (confirmResult != 'confirm') {
                return this.$message.info("取消了删除!")
            }
            let res = await this.axios.delete(`roles/${role.id}/rights/${rightID}`)
            if (res.meta.status != 200) {
                return this.$message.erroe(res.meta.msg)
            }
            role.children = res.data
            this.$message.success(res.meta.msg)
        },
        // 分配权限的对话框的开关
        async showSetRightDialog(role) {
            this.roleId = role.id
            let res = await this.axios.get('rights/tree')
            if (res.meta.status != 200) {
                return this.$message.error(res.meta.msg)
            }
            this.rightList = res.data
            this.getLeafKeys(role, this.defKeys)
            this.SetRightDialogVisible = true
        },
        // 通过递归的形式，获取角色下所有的三级权限的id，并保存到defKeys数组中
        getLeafKeys(node, arr) {
            if (!node.children) {
                return arr.push(node.id)
            }
            node.children.forEach(item => {
                this.getLeafKeys(item, arr)
            })
        },
        // 分配权限的对话框关闭的事件
        setRightDialogClosed() {
            this.defKeys = []
        },

        async allotRights() {// 点击角色分配权限
            let keys = [...this.$refs.treeRef.getCheckedKeys(), this.$refs.treeRef.getHalfCheckedKeys()]
            let idStr = keys.join(',')
            let res = await this.axios.post(`roles/${this.roleId}/rights`, {
                rids: idStr
            })
            if (res.meta.status !== 200) {
                return this.$message.erroe(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            this.getRolesList()
            this.SetRightDialogVisible = false
        }
    },
    components: {

    },
    created() {
        this.getRolesList()
    }
};
</script>

<style scoped lang="less">
::v-deep .el-breadcrumb__inner {
    color: #fff;
    font-size: 12px;
}

.el-breadcrumb__item:last-child ::v-deep .el-breadcrumb__inner {
    color: #fff;
    font-size: 12px;
}

.el-breadcrumb {
    margin-bottom: 15px;
}

.el-table {
    font-size: 12px;
    margin-top: 15px;
}

.el-tag {
    margin: 7px;
}

.bdbottom {
    border-bottom: 1px solid #eee;
}

.bdtop {
    border-top: 1px solid #eee;
}

.vcenter {
    display: flex;
    align-items: center;
}
</style>
