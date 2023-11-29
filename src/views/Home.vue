<template>
  <div class="homeBox">
    <el-container>
      <el-header>

        <div class="logoBox">
          <img src="@/assets/jingling_logo.0ada255b.png" alt="" @click="goHome">
          <h3>精灵购物平台管理系统</h3>
        </div>


        <el-popconfirm title="确定要退出吗？" @confirm="loginOut">
          <el-button slot="reference" type="info">退出</el-button>
        </el-popconfirm>
      </el-header>

      <el-container class="main">
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="toggleButton" @click="toggleCollapse">|||</div>
          <el-menu default-active="2" class="el-menu-vertical-demo" background-color="#303641" text-color="#fff"
            active-text-color="#349eff" unique-opened router :collapse="isCollapse" :collapse-transition="false">
            <el-submenu :index="item.id.toString()" v-for="(item, index) in myMenus" :key="item.id">
              <template slot="title">
                <i :class="iconList[index]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item :index="childItem.id.toString()" v-for="childItem in item.children" :key="childItem.id"
                :route="{ path: '/home/' + childItem.path }">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ childItem.authName }}</span>
                </template>
              </el-menu-item>

            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  props: {

  },
  data() {
    return {
      myMenus: [],
      iconList: [
        'el-icon-s-goods',
        'el-icon-s-help',
        'el-icon-s-cooperation',
        'el-icon-s-shop',
        'el-icon-s-claim',
      ],
      isCollapse: false
    };
  },
  methods: {
    goHome() {
      setTimeout(() => {
        this.$router.push('/home/welcome').catch((erro) => { })
      })
    },
    loginOut() {
      sessionStorage.removeItem('token')
      this.$router.push('/login').catch((erro) => { })
    },
    async getMenus() {
      let res = await this.axios.get('/menus')
      this.myMenus = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  },
  components: {

  },
  mounted() {
    this.getMenus()
  }
};
</script>

<style  lang="less">
.homeBox {
  width: 100%;
  height: 100%;

  >.el-container {
    width: 100%;
    height: 100%;

    >.el-header {
      height: 60px;
      background-color: #353c3e;
      padding-left: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;

      >.logoBox {
        height: 96%;
        display: flex;
        align-items: center;

        >h3 {
          color: white;
          font-weight: normal;
          font-size: 20px;
          margin-left: 15px;
        }

        >img {
          height: 90%;
          cursor: pointer;
        }
      }
    }

    >.main {
      height: 100%;

      >.el-aside {
        background-color: #303641;

        >.el-menu {
          border: none;
        }

        >.toggleButton {
          background-color: #4A5066;
          font-size: 10px;
          line-height: 24px;
          color: white;
          text-align: center;
          letter-spacing: 5px;
          cursor: pointer;
        }
      }

      >.el-main {
        background: url('@/assets/bj.jpg') no-repeat;
        color: white;
      }
    }
  }
}
</style>
