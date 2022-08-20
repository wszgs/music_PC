<template>
  <div class="top_nav">
    <!----------------logo----------------------->
    <div class="logo">
      <div class="icon">
        <i class="el-icon-eleme"></i>
      </div>
      <div class="text">网易云音乐</div>
    </div>

    <!-----------------------返回上下一页 -------------->
    <div class="path_btn">
      <div class="left" @click="$router.go(-1)">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="right" @click="$router.go(1)">
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>

    <!-- -------------------------搜索框 -------------------------->
    <div class="search">
      <el-input
        placeholder="请输入内容"
        v-model="searchValue"
        @input="searchClick"
        :clearable="true"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <div class="search_list">
        <ul>
          <li
            class="search_items"
            v-for="(item, index) in search_list"
            :key="index"
            @click="searchItemClick(item.id)"
          >
            {{ item.name }}-----{{ item.ar[0].name }}
          </li>
        </ul>
      </div>
    </div>

    <!-- ---------------------------登录部分--------------------- -->
    <div class="login">
      <div class="user_name">{{ $store.state.userInfo.nickname }}</div>
      <el-popover
        placement="bottom"
        width="400"
        trigger="click"
        v-model="isShow"
        popper-class="login_popover"
      >
        <div
          class="login_btn"
          slot="reference"
          v-show="!$store.state.userInfo.nickname"
        >
          登录
        </div>
        <h2 class="login_title">登录</h2>
        <el-form ref="dynamicValidateForm" label-width="60px">
          <!-- --------------------邮箱登录------------ -->
          <div class="mailboxLogin" v-show="loginTypeIndex == 1">
            <el-form-item prop="email" label="邮箱">
              <el-input
                v-model="mailboxLogin.email"
                placeholder="请输入网易云邮箱"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input
                type="password"
                v-model="mailboxLogin.password"
                autocomplete="off"
                placeholder="请输入邮箱密码"
                show-password
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item class="submit_btn">
              <el-button type="primary" @click="goLogin()"
                >提交 <i class="el-icon-loading" v-show="isLoading"></i
              ></el-button>
            </el-form-item>
          </div>

          <div class="qr_login" v-show="loginTypeIndex == 2">
            <img :src="QRimg" alt="" />
            <div class="qr_reset" @click.stop="QRBtnClick()">刷新二维码</div>
          </div>

          <!-- 手机+短信验证码登录 -->
          <div class="phone_login" v-show="loginTypeIndex == 3">
            <el-form-item prop="email" label="手机">
              <el-input
                v-model="phoneLogin.phone"
                placeholder="请输入手机号码"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="验证码">
              <el-input
                v-model="phoneLogin.captcha"
                placeholder="请输入验证码"
                clearable
              ></el-input>
              <el-button @click="captchaBtnClick()" :disabled="isDisabled">{{
                captchaText
              }}</el-button>
            </el-form-item>
            <el-form-item class="submit_btn">
              <el-button type="primary" @click="goPhoneLogin()"
                >提交 <i class="el-icon-loading" v-show="isLoading"></i
              ></el-button>
            </el-form-item>
          </div>

          <!-- 手机密码登录 -->
          <div class="phone_password_login" v-show="loginTypeIndex == 4">
            <el-form-item label="手机">
              <el-input
                v-model="phonePasswordLogin.phone"
                placeholder="请输入手机号码"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input
                type="password"
                v-model="phonePasswordLogin.password"
                placeholder="请输入密码"
                show-password
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item class="submit_btn">
              <el-button type="primary" @click="gophonePassword()"
                >提交 <i class="el-icon-loading" v-show="isLoading"></i
              ></el-button>
            </el-form-item>
          </div>
        </el-form>

        <!------------- 切换登录方式-------------- -->
        <div class="login_type">
          <span
            @click="loginTypeClick(1)"
            class="login_type_item"
            :class="{ active: loginTypeIndex == 1 }"
            >邮箱登录</span
          >
          <span
            @click="loginTypeClick(2)"
            class="login_type_item"
            :class="{ active: loginTypeIndex == 2 }"
            >扫码登录</span
          >
          <span
            @click="loginTypeClick(3)"
            class="login_type_item"
            :class="{ active: loginTypeIndex == 3 }"
            >手机验证码登录</span
          >
          <span
            @click="loginTypeClick(4)"
            class="login_type_item"
            :class="{ active: loginTypeIndex == 4 }"
            >手机密码登录</span
          >
        </div>
      </el-popover>
      <div
        v-show="$store.state.userInfo.nickname"
        class="out_login"
        @click.stop="gologout()"
      >
        退出
      </div>
    </div>
  </div>
</template>

<script>
import { getSearch } from "network/discovermusic.js";
import {
  login,
  QRcodeKey,
  QRcodeImg,
  QRcodeLoginCheck,
  logout,
  getCaptcha,
  phoneCaptcha,
  phonePassword,
  loginCheck,
} from "network/login.js";

export default {
  data() {
    return {
      loginTypeIndex: 1, //登录的类型1为邮箱登录、2为二维码登录、3为手机登录
      isShow: false, //是否显示登录窗口
      isLoading: false, //点击登录按钮是否显示加载图案的
      searchValue: "",
      search_list: [], //关键字请求回来的数据

      // -----------邮箱登录请求参数---------
      mailboxLogin: {
        email: "zgsheng321@163.com",
        password: "Wszgs18320611509",
      },
      // ------------二维码登录--------------------
      key: "", //生成二维码需要的key
      QRimg: "", //二维码

      // -----------------手机+短信验证码登录--------------------
      phoneLogin: {
        phone: "",
        captcha: "",
      },
      captchaText: "获取验证码",
      isDisabled: false,

      // ================手机密码登录===========
      phonePasswordLogin: {
        phone: "18320611509",
        password: "wszgs18320611509",
      },
    };
  },
  methods: {
    searchClick() {
      if (this.searchValue) {
        setTimeout(() => {
          getSearch(this.searchValue).then((res) => {
            this.search_list = res.result.songs;
          });
        }, 100);
      } else {
        this.search_list = "";
      }
    },

    searchItemClick(id) {
      this.$store.commit("changeSongDetail", id);
      this.$router.push({
        path: "songdetail",
      });

      this.search_list = "";
    },
    // ----------------------邮箱登录------------------
    goLogin() {
      this.isLoading = true;
      login(this.mailboxLogin).then((res) => {
        if (res.code == 200) {
          this.$store.commit("changeCookie", res.cookie);
          this.$store.commit("changedayUserInfo", res.profile);
          console.log("登录成功");
          this.mailboxLogin = {
            email: "",
            password: "",
          };
          this.$message({showClose: true,message: "恭喜你，登录成功",type: "success",});
          this.isShow = false;
          this.isLoading = false;
        } else if (res.code == 502) {
          this.$message({showClose: true, message: '账号密码错误',type: 'warning' });
          this.isLoading = false;
        } else if (res.code == 509) {
          this.$message({showClose: true, message: res.message,type: 'warning' });
          this.isLoading = false;
        }
      });
    },
    // ============二维码登录===============
    QRBtnClick() {
      // QRcodeKey获取key、QRcodeImg生成二维码、QRcodeLoginCheck检查是否扫码、loginCheck检查登录状态并返回用户信息
      QRcodeKey().then((res) => {
        if (res.code == 200) {
          this.key = res.data.unikey;
          QRcodeImg({ key: this.key }).then((res) => {
            if (res.code == 200) {
              this.QRimg = res.data.qrimg;

              // 间隔一秒检查是否扫码
              var timer = setInterval(() => {
                QRcodeLoginCheck({ key: this.key }).then((res) => {
                  console.log(res);
                  if (res.code == 803) {
                    this.$store.commit("changeCookie", res.cookie);
                    loginCheck({ cookie: this.$store.state.cookie }).then(
                      (res) => {
                        if (res.data.code == 200) {
                          console.log("登录成功");
                          this.$store.commit("changedayUserInfo",res.data.profile);
                        }
                      }
                    );
                    this.$message({showClose: true,message: "恭喜你，登录成功",type: "success",});
                    this.isShow = false;
                    clearInterval(timer);
                  }else if(res.code==800){
                    this.$message({showClose: true, message: '二维码已过期，请刷新二维码',type: 'warning' });
                  }               
                });
              }, 1000);

              // 20秒后不发送检查是否扫码
              setTimeout(()=>{
                  clearInterval(timer);
              },30000)
            }
          });
        }
      });
    },
    // -------------------切换登录方式-----------------
    loginTypeClick(index) {
      this.isLoading = false;
      this.loginTypeIndex = index;
      if(index==2){
        this.QRBtnClick()
      }
    },
    // ----------------------获取短信验证码----------------
    captchaBtnClick() {
      if (
        this.phoneLogin.phone.length == 11 &&
        this.captchaText == "获取验证码"
      ) {
        this.isDisabled = true;
        var num = 60;
        var timer = setInterval(() => {
          num -= 1;
          this.captchaText = num + "后再获取";
          if (num == 0) {
            this.captchaText = "获取验证码";
            clearInterval(timer);
            this.isDisabled = false;
          }
        }, 1000);
        getCaptcha({ phone: this.phoneLogin.phone }).then((res) => {
          if (res.code == 200) {
             this.$message({showClose: true,message: "短信已发送到你的手机",type: "success"});
          }
        });
      } else {
        this.$notify.error({
          title: "错误",
          message: "请正确填写你的手机号码",
          type: "success",
        });
      }
    },
    // ------------------点击按钮，手机+短信验证码登录===========
    goPhoneLogin() {
      this.isLoading = true;
      phoneCaptcha(this.phoneLogin).then((res) => {
        if (res.code == 200) {
          this.$store.commit("changeCookie", res.cookie);
          this.$store.commit("changedayUserInfo", res.profile);
          console.log("登录成功");
          this.$message({showClose: true,message: "恭喜你，登录成功",type: "success",});
          this.isShow = false;
          this.isLoading = false;
          this.phoneLogin = {
            phone: "",
            captcha: "",
          };
        }
      });
    },
    // ------------------------点击按钮，手机密码登录-------------
    gophonePassword() {
      this.isLoading = true;
      phonePassword(this.phonePasswordLogin).then((res) => {
        if (res.code == 200) {
          this.$store.commit("changeCookie", res.cookie);
          this.$store.commit("changedayUserInfo", res.profile);
          console.log("登录成功");
          this.$message({showClose: true,message: "恭喜你，登录成功",type: "success",});
          this.isShow = false;
          this.isLoading = false;
          this.phonePasswordLogin = {
            phone: "",
            password: "",
          };
        } else if (res.code == 502) {
          this.$message({showClose: true, message: '密码错误',type: 'warning' });
          this.isLoading = false;
        } else if (res.code == 400) {
          this.$message({showClose: true, message: '账号密码错误',type: 'warning' });
          this.isLoading = false;
        }
      });
    },

    // ---------------退出登录------------------------
    gologout() {
      logout({cookie: this.$store.state.cookie}).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.$message({showClose: true,message: "恭喜你，退出成功",type: "success",});
          this.$store.commit("changeCookie", "");
          this.$store.commit("changedayUserInfo", "");
        }
      });
    },
  },
};
</script>
<style  scoped>
.top_nav {
  height: 60px;
  background-color: #c20c0c;
  display: flex;
  justify-self: start;
  align-items: center;
}

/* -------------------logo----------------------- */
.logo {
  height: 60px;
  display: flex;
  justify-self: start;
  line-height: 60px;
  color: #fff;
  font-size: 18px;
  margin-left: 20px;
}
.logo .icon {
  font-size: 40px;
  margin-right: 5px;
}
.logo .text {
  font-weight: bold;
}

/* -------------返回上下页-------------------- */
.path_btn {
  display: flex;
  align-items: center;
  font-size: 20px;
  line-height: 60px;
  margin-left: 50px;
  color: #fff;
}
.path_btn .left {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  line-height: 30px;
  background-color: rgba(19, 20, 20, 0.151);
  text-align: center;
  cursor: pointer;
  margin-right: 10px;
}
.path_btn .right {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  line-height: 30px;
  background-color: rgba(19, 20, 20, 0.151);
  text-align: center;
  cursor: pointer;
}

.path_btn .left:active {
  background-color: #000;
}
.path_btn .right:active {
  background-color: #000;
}

/* -------------------搜索框 ----------------------- */
.search {
  margin-left: 30px;
  display: flex;
  align-items: center;
  position: relative;
}

.search_list {
  position: absolute;
  top: 50px;
  width: 400px;
  background-color: #fff;
  z-index: 999;
}
.search_items {
  font-size: 12px;
  height: 30px;
  line-height: 30px;
  border-bottom: 1px solid #ccc;
  padding-left: 10px;
}
.search_items img {
  width: 15px;
  height: 15px;
}
.search_items:hover {
  background-color: #ccc;
}

/* -------------------登录--------------- */
.login {
  width: 300px;
  display: flex;
  align-items: center;
  margin-left: 30px;
}
.login .user_name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 150px;
  color: #fff;
}
.login_btn,
.out_login {
  color: #fff;
  cursor: pointer;
}
.login_title {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
  margin-top: 10px;
}
.submit_btn {
  text-align: center;
}
.submit_btn button {
  width: 300px;
}

/* ----------登录方式切换--------- */
.login_type {
  position: absolute;
  bottom: 5px;
  left: 10px;
}
.login_type_item {
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 8px;
}
.login_type_item.active {
  background-color: cornflowerblue;
  color: #fff;
}

/* ----------二维码登录------------ */
.qr_login{
  text-align: center;
}
.qr_reset{
  width: 100px;
  margin:0 auto;
  padding: 5px 10px;
  cursor: pointer;
  background-color:lightcoral;
  color: #fff;
}
</style>