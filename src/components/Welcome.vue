<template>
    <div class="welComeBox">
        <img src="@/assets/jinglingBg2.png" alt="">
        <h1>
            欢迎来到<span>精灵购物</span>平台管理系统
        </h1>
        <div class="text">
            <p>老陈前端课堂版权所有©2023</p>
            <p>@ChenFuguo互联网技术传播者</p>
        </div>
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
.welComeBox {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    >img {
        width: 500px;
    }

    >h1 {
        letter-spacing: 10px;
        font-size: 40px;

        >span {
            color: rgb(6, 248, 252);
            font-size: 70px;
        }
    }

    >.text {
        height: 40%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        font-size: 12px;

        >p {
            margin-bottom: 5px;
        }
    }
}
</style>
