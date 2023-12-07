<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片式图 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" @input="getGoodsList" clearable>
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddpage">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- 表格区 -->
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="140px">
                    <template slot-scope="scope">
                        {{ scope.row.add_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-search"></el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete"
                            @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total" background>
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {
            queryInfo: {//查询参数对线
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            goodsList: [],//商品列表
            total: 0//总数据
        };
    },
    methods: {
        async getGoodsList() {//根据分页获取商品列表数据
            let res = await this.axios.get(`goods`, { params: this.queryInfo })
            if (res.meta.status !== 200) {
                return this.$message.erroe(res.meta.msg)
            }
            this.goodsList = res.data.goods
            this.total = res.data.total
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        handleCurrentChange(newpage) {
            this.queryInfo.pagenum = newpage
            this.getGoodsList()
        },
        async removeById(id) {//根据id删除当前商品
            let confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除！')
            }
            let res = await this.axios.delete(`goods/${id}`)
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
            this.getGoodsList()
        },
        goAddpage() {//跳转至添加页
            this.$router.push('/home/add').catch(err => err)
        }
    },
    components: {

    },
    created() {
        this.getGoodsList()
    },
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

.el-breadcrumb,
.el-row {
    margin-bottom: 15px;
}

.el-table {
    font-size: 12px;
}
</style>
