<template>
    <div class="rightsBox">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-table :data="rightsList" style="width: 100%" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="权限名称" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级" prop="level">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                        <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
                        <el-tag v-else="scope.row.level === '2'" type="warning">三级</el-tag>
                    </template>
                </el-table-column>

            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {
            rightsList: []
        };
    },
    methods: {
        async getRightsList() {
            let res = await this.axios.get(`rights/list`)
            if (res.meta.status != 200) {
                return this.$message.error('获取权限列表失败！')
            }
            this.rightsList = res.data
        }
    },
    components: {

    },
    created() {
        this.getRightsList()
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
}
</style>
