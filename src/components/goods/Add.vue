<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片式图 -->
        <el-card>
            <!-- 提示区 -->
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false
                ">
            </el-alert>
            <!-- 步骤条 -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <!-- tab栏 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width=" 100px" label-position="top">
                <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cateProps"
                                @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="商品参数" name="1">
                        <!-- 渲染表单的item项 -->
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                            <!-- 复选框 -->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="cbitem" v-for="(cbitem, index) in item.attr_vals" :key="index" border>

                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="商品图片" name="3">
                        <!-- action表示图片要上传的接口 -->
                        <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove"
                            list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>

                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addForm.goods_introducs">

                        </quill-editor>
                        <el-button type="primary" class="addBut" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>

        <!-- 图片预览 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="previewPath" alt="" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'
export default {
    props: {

    },
    data() {
        return {
            activeIndex: '0',
            addForm: {//添加商品的表单数据
                goods_name: '',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                goods_cat: [],
                pics: [],
                goods_introducs: '',
                attrs: []
            },
            addFormRules: {//添加商品的校验规则
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' }
                ],
                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' }
                ],
                goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' }
                ],
                goods_cat: [
                    { required: true, message: '请选中商品分类', trigger: 'blur' }
                ]
            },
            cateList: [],//获取到的商品分类数据
            cateProps: {
                expandTrigger: 'hover',
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
            },
            manyTableData: [],//动态参数列表的数据
            onlyTableData: [],//静态属性列表数据

            uploadURL: 'http://www.chenfuguo.cn:8899/api/private/v1/upload',
            headerObj: {//请求头
                Authorization: sessionStorage.getItem('token')
            },
            previewPath: '',
            previewVisible: false,
        };
    },
    methods: {
        async getCateList() {//获取所有商品分类数据
            let res = await this.axios.get(`categories`)
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.cateList = res.data
        },
        handleChange() {//级联选择器变化的事件
            if (this.addForm.goods_cat.length !== 3) {
                this.addForm.goods_cat = []
            }
        },
        beforeTabLeave(activeName, oldActiveName) {//tab切换前的判定事件
            if (oldActiveName == '0' && this.addForm.goods_cat.length !== 3) {
                this.$message.error('请先选择商品分类！')
                return false
            }
        },
        async tabClicked() {//tab切换事件
            if (this.activeIndex === '1') {
                let res = await this.axios.get(`categories/${this.catId}/attributes`, {
                    params: { sel: 'many' }
                })
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg)
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
                });
                this.manyTableData = res.data
            }
            if (this.activeIndex === '2') {
                let res = await this.axios.get(`categories/${this.catId}/attributes`, {
                    params: { sel: 'only' }
                })
                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg)
                }
                this.onlyTableData = res.data
            }
        },
        handlePreview(file) {//图片预览事件
            console.log(file);
            this.previewPath = file.response.data.url
            this.previewVisible = true
        },
        handleRemove(file) {//图片删除列表
            let filePath = file.response.data.tmp_path
            let i = this.addForm.pics.findIndex(x => {
                x.pic === filePath
            })
            this.addForm.pics.splice(i, 1)
        },
        handleSuccess(response) {//图片上传成功的事件
            let picInfo = { pics: response.data.tmp_path }
            this.addForm.pics.push(picInfo)
        },
        add() {//添加商品
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) {
                    return this.$message.error('请填写必要的表单项')
                }
                let form = _.cloneDeep(this.addForm)
                form.goods_cat = form.goods_cat.join(',')
                this.manyTableData.forEach(item => {
                    let newInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals.join(' ')
                    }
                    this.addForm.attrs.push(newInfo)
                })

                this.onlyTableData.forEach(item => {
                    let newInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals
                    }
                    this.addForm.attrs.push(newInfo)
                })
                form.attrs = this.addForm.attrs
                let res = await this.axios.post('goods', form)
                if (res.meta.status !== 201) {
                    return this.$message.error(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
                this.$router.push('/home/goods')
            })
        }
    },
    components: {

    },
    created() {
        this.getCateList()
    },
    computed: {
        catId() {//获取id
            if (this.addForm.goods_cat.length === 3) {
                return this.addForm.goods_cat[2]
            }
            return null
        }
    }
};
</script>

<style scoped lang="less">
.el-breadcrumb {
    margin-bottom: 15px;
}

.el-steps {
    margin: 15px 0;
}

.el-step__title {
    font-size: 13px;
}

.el-checkbox {
    margin: 0;
}

.previewImg {
    width: 100%;
}


.quill-editor /deep/ .ql-container {
    min-height: 400px;
}

.addBut {
    margin-top: 15px;
}
</style>
