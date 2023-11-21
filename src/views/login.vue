<template>
  <div class="loginBox">
    <div class="loginMain">

      <div class="avatarBox">
        <img src="@/assets/headPortrait.jpg" alt="">
      </div>

      <el-form :model="loginInof" :rules="loginRules" ref="loginForm">
        <el-form-item prop="username">
          <el-input v-model="loginInof.username" placeholder="请输入用户名" prefix-icon="el-icon-user-solid"
            @input="checkValidate('loginForm')" prop="username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginInof.password" show-password placeholder="请输入密码" prefix-icon="el-icon-lock"
            prop="password" @input="checkValidate('loginForm')">
          </el-input>
        </el-form-item>
        <el-form-item class="buttonBox">
          <el-button type="primary" :disabled="isDisabled" @click="loginGo">登录</el-button>
          <el-button type="info" @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>


    </div>


    <Vcode :show="isShow" @success="success" @close="close" />

  </div>
</template>

<script>
import Vcode from "vue-puzzle-vcode";

export default {
  props: {

  },
  data() {
    return {
      // button禁用
      isShow: false,
      isDisabled: true,
      loginInof: {
        username: 'admin',
        password: '123456',
      },
      // 校验规则
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change' }
        ]
      }
    };
  },
  methods: {
    // 表单进行验证
    checkValidate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isDisabled = false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    async success() {
      this.isShow = false;

      // let res = await this.axios.post('/login', {
      //   username: this.loginInof.username,
      //   password: this.loginInof.password
      // })

      let res = await this.axios.post('/login', this.loginInof)

      console.log('登录后的数据', res);

      if (res.meta.status == 200) {
        this.$message({
          message: res.meta.msg,
          type: 'success',
          duration: 2000,
          onClose: () => {
            this.$router.push('/home').catch((erro) => { })
          }
        });
        sessionStorage.setItem('token', res.data.token)
      } else {
        this.$message({
          message: res.meta.msg,
          type: 'error',
          duration: 2000
        });
      }
    },
    close() {
      this.isShow = false;
    },

    loginGo() {
      this.isShow = true
    }
  },
  components: {
    Vcode
  },
  computed: {

  },
  mounted() {
    this.checkValidate('loginForm')
  }

};
</script>

<style scoped lang="less">
.loginBox {
  width: 100%;
  height: 100%;
  background: url(@/assets/bj.jpg) no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;

  >.loginMain {
    width: 400px;
    height: 300px;
    background-color: #fff;
    border-radius: 10px;
    position: relative;


    >.avatarBox {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 10px;
      box-shadow: 0 0 10px #fff;
      background-color: rgba(255, 255, 255, .7);

      >img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    >.el-form {
      width: 100%;
      position: absolute;
      bottom: 0;
      padding: 10px;
      box-sizing: border-box;


      >.buttonBox {
        display: flex;
        justify-content: flex-end;
      }
    }


  }
}
</style>
