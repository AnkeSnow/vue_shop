<template>
    <div class="childIndexBox">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">

            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfoL.query" clearable @input="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = !addDialogVisible">添加用户</el-button>
                </el-col>
            </el-row>


            <el-table :data="userList" style="width: 100%" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="修改角色" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini"
                                @click="showEditDialog(scope.row.id)"></el-button>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="删除角色" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                @click="removeUserById(scope.row.id)"></el-button>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"
                                @click="setRole(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>

            </el-table>


            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfoL.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfoL.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>

        </el-card>

        <!-- 添加用户的对话框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <!-- 内容区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户对话框 -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配角色对话框 -->
        <el-dialog title="分配角色" :visible.sync="SetRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
            <div>
                <p>当前用户:{{ userInfo.username }}</p>
                <p>当前角色:{{ userInfo.role_name }}</p>
                <p>分配新角色：
                    <el-select v-model="selectedRoleId" placeholder="请选择">
                        <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button>取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        let checkEmail = (rule, value, callback) => {
            let regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (regEmail.test(value)) {
                return callback()
            }
            callback(new Error('请输入合法的邮箱'))
        }
        let checkMobil = (rule, value, callback) => {
            let regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-90]|14[57])[0-9]{8}$/
            if (regMobile.test(value)) {
                return callback()
            }
            callback(new Error('请输入合法的手机号'))
        }
        return {
            // 控制修改用户对话框的显示
            editDialogVisible: false,
            addDialogVisible: false,
            userList: [],
            total: 0,
            queryInfoL: {
                query: '',
                pagenum: 1,
                pagesize: 2
            },
            // 添加用户的表单数据
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: '',
            },
            // 添加用户的表单验证
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机', trigger: 'blur' },
                    { validator: checkMobil, trigger: 'blur' }
                ]
            },
            // 用户编辑数据
            editForm: [],
            // 用户编辑的表单验证
            editFormRules: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机', trigger: 'blur' },
                    { validator: checkMobil, trigger: 'blur' }
                ]
            },
            // 分配角色
            SetRoleDialogVisible: false,
            // 需要被分配角色的信息
            userInfo: {},
            // 所有角色的数据列表
            rolesList: {},
            // 已选中的Id值
            selectedRoleId: ''
        };
    },
    methods: {
        async getUserList() {
            let res = await this.axios.get('/users', {
                params: this.queryInfoL
            })
            // console.log(res);
            if (res.meta.status != 200) {
                return
            }
            this.userList = res.data.users;
            this.total = res.data.total
        },
        handleSizeChange(newSize) {

            this.queryInfoL.pagesize = newSize;
            this.getUserList()
        },
        handleCurrentChange(newSize) {
            this.queryInfoL.pagenum = newSize;
            this.getUserList()
        },
        // 修改用户状态
        async userStateChanged(userinfo) {
            let res = await this.axios.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if (res.meta.status != 200) {
                userinfo.mg_state = !userinfo.mg_state
                return this.$message.error('更新用户状态失败')
            }
            this.$message.success('更新用户状态成功')
        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        // 点击按钮添加校验
        addUser() {
            this.$refs.addFormRef.validate(async (valid) => {
                if (!valid) { return }
                let res = await this.axios.post('users', this.addForm)
                if (res.meta.status != 201) {
                    this.$message.error('添加用户失败')
                }
                this.$message.success('添加用户成功')
                this.addDialogVisible = false
                this.getUserList()
            })
        },
        // 展示修改用户的对话框
        async showEditDialog(id) {
            let res = await this.axios.get(`users/${id}`)
            if (res.meta.status != 200) {
                return this.$message.error('查询用户失败')
            }
            this.editForm = res.data
            this.editDialogVisible = true
            // console.log(res);
        },
        // 监听修改用户的对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        // 修改用户信息并提交
        editUserInfo() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) { return }
                let res = await this.axios.put(`users/${this.editForm.id}`, {
                    email: this.editForm.email,
                    mobile: this.editForm.mobile
                })
                if (res.meta.status != 200) {
                    return this.$message.error('更新用户信息失败')
                }
                this.editDialogVisible = false
                this.getUserList()
                this.$message.success('更新用户信息成功')
            })
        },
        // 根据id删除用户信息
        async removeUserById(id) {
            let confirmResult = await this.$confirm('此操作将永久删除该用户 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch((error) => { return error })
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            let res = await this.axios.delete(`users/${id}`)
            if (res.meta.status != 200) {
                return this.$message.error('删除用户失败')
            }
            this.$message.success('删除用户成功!')
            this.getUserList()
        },
        // 展示分配角色的对话框
        async setRole(userInfo) {
            this.SetRoleDialogVisible = true
            let res = await this.axios.get('roles')
            if (res.meta.status != 200) {
                return this.$message.error(res.meta.msg)
            }
            this.rolesList = res.data
            this.userInfo = userInfo
        },
        // 分配角色
        async saveRoleInfo() {
            if (!this.selectedRoleId) {
                return this.$message.error('请选择要分配的的角色')
            }
            let res = await this.axios.put(`users/${this.userInfo.id}/role`, {
                rid: this.selectedRoleId
            })
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            this.getUserList()
            this.SetRoleDialogVisible = false
        },
        // 分配角色对话框的关闭事件
        setRoleDialogClosed() {
            this.selectedRoleId = ''
            this.userInfo = []
        }
    },
    components: {

    },
    mounted() {
        this.getUserList()
    }
};
</script>

<style scoped lang="less">
.childIndexBox {
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

    .el-row {
        margin-bottom: 15px;
    }

    .el-table {
        font-size: 12px;
    }

    .el-card {
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
    }

    .el-pagination {
        margin-top: 15px;
    }
}
</style>
