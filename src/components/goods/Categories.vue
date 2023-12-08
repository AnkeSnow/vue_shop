<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加分类 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCatDialog">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index
                class="tree-table" index-text="#" border :show-row-hover="false">

                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
                    <i class="el-icon-error" v-else style="color: lightgreen;"></i>
                </template>

                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>

                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini"
                        @click="showEditCatDialog(scope.row.cat_id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini"
                        @click="removeCate(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>

            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="querInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="querInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCatDialogVisible" width="50%" @close="addCateDialogClosed">

            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">

                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>

                <el-form-item label="父级分类">
                    <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps"
                        @change="parentCateChanged" clearable>
                    </el-cascader>
                </el-form-item>

            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addCatDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click='addCate'>确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑分类的对话框 -->
        <el-dialog title="修改分类" :visible.sync="editCatDialogVisible" width="50%">

            <el-form :model="editForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="100px">

                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="editForm.cat_name"></el-input>
                </el-form-item>

            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addCatDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click='editCate'>确 定</el-button>
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
            cateList: [], //商品分类的数据
            querInfo: {//分页数据
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            total: 0,// 总数据条数
            columns: [//表格各列的配置
                { label: '分类名称', prop: 'cat_name' },
                { label: '是否有效', type: 'template', template: 'isok' },
                { label: '排序', type: 'template', template: 'order' },
                { label: '操作', type: 'template', template: 'opt' },
            ],
            addCatDialogVisible: false,//添加分类的对话框的显示隐藏
            editCatDialogVisible: false,//编辑分类的对话框的显示隐藏
            addCateForm: {//添加分类的数据
                cat_name: '',
                cat_pid: 0,
                cat_level: 0
            },
            addCateFormRules: {//添加分类的校验规则
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            },
            parentCateList: [],//父级分类的数据列表
            cascaderProps: {//指定级联选择器的配置对象
                value: 'cat_id',
                label: 'cat_name',
                chlidren: 'chlidren',
                expandTrigger: 'hover',
                checkStrictly: true,
            },
            selectedKeys: [],// 选中的父级分类的id数组
            editForm: {},//修改分类获取到的数据
            editCateFormRules: {//修改分类的校验规则
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        async getCateList() {//获取商品分类的数据
            let res = await this.axios.get('categories', { params: this.querInfo })
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.cateList = res.data.result
            this.total = res.data.total
        },
        handleSizeChange(newSize) {//监听 pagesize 改变
            this.querInfo.pagesize = newSize
            this.getCateList()
        },
        handleCurrentChange(newSize) {//监听 pagenum 改变
            this.querInfo.pagenum = newSize
            this.getCateList()
        },
        showAddCatDialog() {//显示添加分类的对话框
            this.getParentCateList()
            this.addCatDialogVisible = true
        },
        async getParentCateList() {//获取父级分类的数据列表
            let res = await this.axios.get('categories', { params: { type: 2 } })
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.parentCateList = res.data
        },
        parentCateChanged() {//级联选择器的触发事件
            console.log(this.selectedKeys);
            if (this.selectedKeys.length > 0) {
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            } else {
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        },
        addCate() {//添加新的分类
            this.$refs.addCateFormRef.validate(async valid => {
                if (!valid) { return }
                let res = await this.axios.post('categories', this.addCateForm)
                if (res.meta.status !== 201) {
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
                this.getCateList()
                this.addCatDialogVisible = false
            })
        },
        addCateDialogClosed() {//添加分类对话框的关闭事件
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.cat_pid = 0
            this.addCateForm.cat_level = 0
        },
        async showEditCatDialog(id) {//显示编辑分类的对话框
            this.editCatDialogVisible = true
            let res = await this.axios.get(`categories/${id}`)
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.editForm = res.data
        },
        editCate() {//修改分类
            this.$refs.editCateFormRef.validate(async valid => {
                if (!valid) { return }
                let res = await this.axios.put(`categories/${this.editForm.cat_id}`, {
                    cat_name: this.editForm.cat_name
                })
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
                this.editCatDialogVisible = false
                this.getCateList()
            })
        },
        async removeCate(id) {//删除分类
            let confirmResult = await this.$confirm('此操作将永久删除该用户 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch((error) => { return error })
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            let res = await this.axios.delete(`categories/${id}`)
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            this.getCateList()
        }
    },
    components: {

    },
    created() {
        this.getCateList()
    }
};
</script>

<style scoped lang="less">
.el-row,
.tree-table {
    margin-bottom: 15px;
}

.el-cascader {
    width: 100%;
}
</style>
