<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <div id="main" style="width: 750px;height:400px;"></div>
        </el-card>

    </div>
</template>

<script>
import * as echarts from 'echarts';
import _ from 'lodash'
export default {
    props: {

    },
    data() {
        return {
            options: {
                title: {
                    text: '用户来源'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#E9EEF3'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        boundaryGap: false
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ]
            }
        };
    },
    methods: {

    },
    components: {

    },
    async mounted() {
        var myChart = echarts.init(document.getElementById('main'));

        let res = await this.axios.get(`reports/type/1`)
        if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
        }

        let result = _.merge(res.data, this.options)
        myChart.setOption(result);
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
</style>
