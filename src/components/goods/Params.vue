<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>阐述列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 头部警告 -->
            <el-alert title="注意！只允许为第三级分类设置相关参数！" show-icon type="warning" :closable="false">
            </el-alert>

            <el-row>
                <el-col>
                    <span>选择商品分类：</span>
                    <el-cascader v-model="selectedCateKeys" :options="cateList" :props="cateProps"
                        @change="handleChange"></el-cascader>
                </el-col>
            </el-row>

            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button size="mini" type="primary" :disabled="isBtnDisabled" class="addButton"
                        @click="addDialogVisible = true">添加参数</el-button>

                    <el-table :data="manyTableData" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable
                                    @close="handleClose(index, scope.row)">
                                    {{ item }}
                                </el-tag>
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                                    ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New
                                    Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#">
                        </el-table-column>
                        <el-table-column prop="attr_name" label="参数名称">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                    @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                    @click="removeParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="静态属性" name="only">
                    <el-button size="mini" type="primary" :disabled="isBtnDisabled" class="addButton"
                        @click="addDialogVisible = true">添加属性</el-button>

                    <el-table :data="onlyTableData" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable
                                    @close="handleClose(index, scope.row)">
                                    {{ item }}
                                </el-tag>
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                                    ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New
                                    Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#">
                        </el-table-column>
                        <el-table-column prop="attr_name" label="属性名称">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                    @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加参数对话框 -->
        <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改参数对话框 -->
        <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cateList: [],//商品分类的数据
            cateProps: {//级联选择框的配置对象 
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'

            },
            selectedCateKeys: [],//级联选择框选中的ID
            activeName: 'many',//被激活的页签名称
            manyTableData: [],//动态参数的数据
            onlyTableData: [],//静态属性的数据
            addDialogVisible: false,//控制添加对话框的显示隐藏
            addForm: {},//这是添加参数的表单数据
            addFormRules: {//添加表单的验证规则
                attr_name: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' }
                ]
            },
            editDialogVisible: false,//控制修改对话框的显示隐藏
            editForm: {},//修改表单的数据绑定
            editFormRules: {//修改表单的校验规则
                attr_name: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' }
                ]
            },

        };
    },
    methods: {
        async getCateList() {//获取所有的商品分类列表
            let res = await this.axios.get('categories')
            if (res.meta.status !== 200) {
                return this.$message.erroe(res.meta.msg)
            }
            this.cateList = res.data
        },
        handleChange() {//级联选择框选中触发
            this.getParamsDtat()
        },
        handleTabClick() {//tab页签点击的事件
            this.getParamsDtat()
        },
        async getParamsDtat() {//获取参数的列表数据
            if (this.selectedCateKeys.length !== 3) {
                this.selectedCateKeys = []
                this.manyTableData = []
                this.onlyTableData = []
                return
            }
            let res = await this.axios.get(`categories/${this.cateID}/attributes`, {
                params: { sel: this.activeName }
            })
            if (res.meta.status !== 200) {
                return this.$message.erroe(res.meta.msg)
            }
            res.data.forEach(item => {
                if (item.attr_vals.includes('，')) {
                    item.attr_vals = item.attr_vals.replace(/，/g, ',')
                }
                if (item.attr_vals) {
                    item.attr_vals = item.attr_vals.split(',')
                } else {
                    item.attr_vals = []
                }
                item.inputVisible = false
                item.inputValue = ''
            })
            if (this.activeName === 'many') {
                this.manyTableData = res.data
            } else {
                this.onlyTableData = res.data
            }
            console.log(this.manyTableData);
        },
        addDialogClosed() {//添加对话框的关闭事件
            this.$refs.addFormRef.resetFields()
        },
        addParams() {//添加参数
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return
                let res = await this.axios.post(`categories/${this.cateID}/attributes`, {
                    attr_name: this.addForm.attr_name,
                    attr_sel: this.activeName
                })
                if (res.meta.status !== 201) {
                    return this.$message.erroe(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
                this.addDialogVisible = false
                this.getParamsDtat()
            })
        },
        async showEditDialog(id) {//展示修改对话框
            let res = await this.axios.get(`categories/${this.cateID}/attributes/${id}`, {
                attr_sel: this.activeName
            })
            if (res.meta.status !== 200) {
                return this.$message.erroe(res.meta.msg)
            }
            this.editForm = res.data
            this.editDialogVisible = true
        },
        editDialogClosed() {//修改对话框的关闭事件
            this.$refs.editFormRef.resetFields()
        },
        editParams() {//修改参数的事件
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return
                let res = await this.axios.put(`categories/${this.cateID}/attributes/${this.editForm.attr_id}`, {
                    attr_name: this.editForm.attr_name,
                    attr_sel: this.activeName
                })
                if (res.meta.status !== 200) {
                    return this.$message.erroe(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
                this.getParamsDtat()
                this.editDialogVisible = false
            })
        },
        async removeParams(id) {//删除参数的事件
            const confirmResult = await this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)

            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除！')
            }

            let res = await this.axios.delete(`categories/${this.cateID}/attributes/${id}`)
            console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            this.getParamsDtat()
        },
        async handleInputConfirm(row) {//文本失去焦点或摁下了enter的事件
            if (row.inputValue.trim().length === 0) {
                row.inputValue = ''
                row.inputVisible = false
                return
            }
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            row.inputVisible = false
            this.saveAttrVals(row)
        },
        async saveAttrVals(row) {//将attr_vals保存到数据库
            let res = await this.axios.put(`categories/${this.cateID}/attributes/${row.attr_id}`, {
                attr_name: row.attr_name,
                attr_sel: row.attr_sel,
                attr_vals: row.attr_vals.join('，')
            })
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
        },
        showInput(row) {//展示文本框的显示
            row.inputVisible = true
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleClose(i, row) {//删除tag的事件
            row.attr_vals.splice(i, 1)
            this.saveAttrVals(row)
        }
    },
    computed: {
        isBtnDisabled() {//添加参数和添加属性的禁用
            if (this.selectedCateKeys.length !== 3) {
                return true
            }
            return false
        },
        cateID() {//当前选中的三级分类的id
            if (this.selectedCateKeys.length === 3) {
                return this.selectedCateKeys[2]
            }
            return null
        },
        titleText() {
            if (this.activeName === 'many') {
                return '动态参数'
            } else {
                return '静态属性'
            }
        }
    },
    created() {
        this.getCateList()
    }
};
</script>

<style scoped lang="less">
.el-breadcrumb {
    margin-bottom: 15px;
}

.el-alert,
.addButton {
    margin-bottom: 20px;
}

.el-tag {
    margin: 5px;
}

.input-new-tag {
    width: 120px;
}
</style>
