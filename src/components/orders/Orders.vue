<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {

        };
    },
    methods: {

    },
    components: {

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

.el-breadcrumb {
    margin-bottom: 15px;
}
</style>
