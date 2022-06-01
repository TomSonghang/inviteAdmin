<template>
  <div class="login">
    <div class="slideShadow" v-show="showSlide">
      <transition>
        <div class="slideSty animated bounce">
          <slide-verify
            @success="onSuccess"
            @fail="onFail"
            :sildeText="text"
            :w="350"
            :h="175"
            ref="slideDiv"
          ></slide-verify>
          <div class="iconBtn">
            <i class="el-icon-circle-close" @click="showSlide = false"></i>
            <i class="el-icon-refresh" @click="refresh"></i>
          </div>
        </div>
      </transition>
    </div>
    <!--上面是滑动人机验证-->
    <div class="bgBox">
      <img src="@/assets/login-bg/loginBg.png" alt />
    </div>
    <div class="loginBox">
      <div class="logoWrap">
        <img src="@/assets/images/logo-web.png" alt class="logoWeb" />
      </div>
      <div class="loginH2">企业招聘后台</div>

      <div class="loginCon">
        <div class="titleDiv">
          <div class="title_box" @click="changeLoginWay">
            <div :class="active == 0 ? 'active' : ''">账号登录</div>
            <div :class="active == 1 ? 'active' : ''">短信登录</div>
          </div>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="loginForm">
          <template v-if="active == 0">
            <el-form-item prop="userId">
              <el-input
                placeholder="请输入账号"
                prefix-icon="el-icon-lock"
                v-model="ruleForm.userId"
              ></el-input>
            </el-form-item>
            <el-form-item prop="userPwd">
              <el-input
                placeholder="请输入密码"
                prefix-icon="el-icon-user"
                v-model="ruleForm.userPwd"
                show-password
              ></el-input>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item prop="userId">
              <el-input
                placeholder="请输入手机号"
                prefix-icon="el-icon-mobile"
                v-model="ruleForm.userId"
              ></el-input>
            </el-form-item>
            <div class="vifCode">
              <el-form-item prop="userPwd">
                <el-input
                  placeholder="请输入验证码"
                  prefix-icon="el-icon-key"
                  v-model="ruleForm.userPwd"
                ></el-input>
              </el-form-item>
              <el-button
                type="primary"
                round
                :disabled="disabled"
                class="getCodeBtn"
                @click="getCode"
                >获取验证码</el-button
              >
            </div>
          </template>
          <el-button
            type="primary"
            class="loginBtn"
            @click="loginYz('loginForm')"
            >登录</el-button
          >
        </el-form>
      </div>
      <div class="titleBox">
        <span>温馨提示：下载点金台APP并成功注册企业用户后方可使用。</span>
      </div>
      <div class="downApp">
        <el-popover placement="right" width="288" trigger="hover">
          <div>
            <div style="text-align: center;" class="scleCode">扫码下载App</div>
            <img src="@/assets/images/APP.png" alt />
          </div>
          <div slot="reference">下载点金台APP</div>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
import { GetLoginSecurityCode } from "@/api/login";
import Code from "@/api/statusCode";
import SlideVerify from "@/components/SlideVerify";
import MD5 from "js-md5";
export default {
  data() {
    return {
      disabled: false,
      notifyObj: null,
      text: "向右滑动",
      showSlide: false,
      ruleForm: {
        userId: "",
        userPwd: "",
        loginType: "",
      },
      rules: {
        userId: [
          { required: true, message: "请输入用户名/手机号", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码/验证码", trigger: "blur" },
        ],
      },
      active: 0, //0是账号登录  1是短信登录
    };
  },
  mounted() {},
  methods: {
    getCode() {
      //获取验证码
      if (this.ruleForm.userId) {
        this._GetLoginSecurityCode();
      } else {
        this.$message("请输入手机号");
      }
    },
    _GetLoginSecurityCode() {
      this.disabled = true;
      let data = {
        phoneNo: this.ruleForm.userId,
      };
      GetLoginSecurityCode(data).then((res) => {
        if (res.status === Code.SUCCESS_CODE) {
          this.$message({
            message: "验证码发送成功！",
            type: "success",
          });
          this.secondsSixty();
        } else {
          this.$message({
            message: res.message,
            type: "warning",
          });
          this.disabled = false;
        }
      });
    },
    secondsSixty() {
      let timer = null;
      timer = setTimeout(() => {
        this.disabled = false;
        clearTimeout(timer);
      }, 60000);
    },
    loginYz(from) {
      this.$refs[from].validate((valid) => {
        if (valid) {
          this.showSlide = true; //滑动验证
        } else {
          return;
        }
      });
    },
    onSuccess() {
      this.showSlide = false;
      this._login();
    },
    onFail() {
      this.$message.error("验证失败");
    },
    refresh() {
      this.$refs.slideDiv.reset();
    },
    changeLoginWay(e) {
      //选择登录模式
      if (e.target.innerText == "账号登录") {
        this.active = 0;
      } else if (e.target.innerText == "短信登录") {
        this.active = 1;
      } else {
        this.active = 0;
      }
      this.ruleForm.userPwd = "";
    },
    _login() {
      if (this.active == 0) {
        //账号登录，需要加密
        this.ruleForm.userPwd = MD5(this.ruleForm.userPwd); //MD5
        this.ruleForm.userPwd = this.ruleForm.userPwd.toUpperCase(); //大写
      }
      console.log(this.ruleForm);
      this.ruleForm.loginType = this.active ? "phonecode" : "password";
      this.$store
        .dispatch("user/_login", this.ruleForm)
        .then((res) => {
          console.log(res);
          if (res.status !== 1000) {
            this.refresh();
          } else {
            console.log(this.$route);
            console.log(`rouer:${this.$route.query.redirect}`);
            this.$router.push(this.$route.query.redirect).catch((e) => {
              console.log("重定向错误" + e);
            });
            if (this.notifyObj) {
              this.notifyObj.close();
            }
            this.notifyObj = null;
          }
        })
        .catch((error) => {
          this.refresh();
          this.$message.error(error);
        });
    },
    // shopTip() {
    //   this.notifyObj = this.$notify({
    //     title: "开发提示",
    //     message:
    //       '目前只设置了一个登录角色,管理员账号是:"admin",密码都是"djt123',
    //     duration: 0,
    //     iconClass: "el-icon-s-opportunity",
    //   });
    // },
  },
  components: {
    SlideVerify,
  },
};
</script>
<style lang="less" scoped>
.logoWrap {
  margin-bottom: 25px;
  img {
    display: block;
    margin: 0 auto;
  }
  .logoWeb {
    margin-top: 5px;
    width: 250px;
    height: auto;
  }
}
.downApp {
  text-decoration: underline;
  cursor: pointer;
  color: #999;
  text-align: center;
  font-size: 12px;
  padding-top: 12px;
  &:hover {
    color: #13b5b1;
  }
}
.scleCode {
  text-align: center;
  padding-bottom: 10px;
  font-size: 16px;
  color: #13b5b1;
}
.title_box {
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: space-between;
  div {
    font-size: 16px;
    color: #333;
  }
}
.login {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #fff;
  position: relative;
}
.bgBox {
  position: absolute;
  top: 0;
  left: 0;
  height: 450px;
  width: 100%;
  overflow: hidden;
  img {
    display: block;
    width: 100%;
    height: 100%;
    background-size: 100%;
  }
}
.loginBox {
  height: 450px;
  width: 450px;
  margin-left: -225px;
  position: absolute;
  top: 16%;
  left: 50%;
  // margin-top: -150px;
}
.loginH2 {
  font-size: 30px;
  color: #fff;
  text-align: center;
  font-weight: bold;
}
.loginCon {
  margin-top: 30px;
  background: #fff;
  border-radius: 4px;
  box-shadow: #2fd1ce 0px 3px 10px;
  .titleDiv {
    padding: 25px 25px 0 25px;
    background: #fff;
    position: relative;
    text-align: center;
    border-radius: 4px 4px 0 0;
    h3 {
      font-size: 22px;
      color: #13b5b1;
      font-weight: bold;
      padding-top: 23px;
    }
    p {
      font-size: 16px;
      color: #999;
      padding-top: 12px;
    }
    i {
      font-size: 65px;
      color: #ddd;
      position: absolute;
      right: 27px;
      top: 29px;
    }
  }
  .el-form {
    padding: 25px 25px 30px 25px;
    background: #fff;
    border-radius: 0 0 4px 4px;
  }
}
.loginBtn {
  width: 100%;
  background: #13b5b1;
  border: #2fd1ce;
}
.slideShadow {
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}
.slideSty {
  position: absolute;
  width: 380px;
  height: 311px;
  background: #e8e8e8;
  border: 1px solid #dcdcdc;
  left: 50%;
  top: 50%;
  margin-left: -188px;
  margin-top: -176px;
  z-index: 99;
  border-radius: 5px;
}
.iconBtn {
  padding: 9px 0 0 19px;
  color: #5f5f5f;
  border-top: 1px solid #d8d8d8;
  margin-top: 17px;
  i {
    font-size: 22px;
    cursor: pointer;
  }
  i:last-child {
    margin-left: 7px;
  }
}
.active {
  color: #13b5b1 !important;
}
.vifCode {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.getCodeBtn {
  height: 50px;
  margin-bottom: 22px;
  background-color: #13b5b1;
  border-radius: 50px;
  border: 1px solid #13b5b1;
  &:hover {
    background-color: #1dc9c6;
  }
}
</style>
<style>
.slideSty .slide-verify {
  margin: 13px auto 0 auto;
  width: 350px !important;
}
.slideSty .slide-verify-slider {
  width: 100% !important;
}
.slideSty .slide-verify-refresh-icon {
  display: none;
}
.titleBox {
  font-size: 14px;
  color: #999;
  padding-top: 20px;
  text-align: center;
}
</style>
