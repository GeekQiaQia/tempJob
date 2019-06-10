<template>
  <div class="login_">
    <div class="top clearfix">
      <div class="fl">
        <img src="../../assets/img/logo_.png" alt>
      </div>
      <div class="fr">联系我们：021-60654047</div>
    </div>
    <div class="main clearfix">
      <div class="fl">
        <img src="../../assets/img/login_bg.png" alt>
      </div>
      <div class="fr">
        <p>忘记密码</p>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px">
          <!-- <div class="icon_phone">登录手机</div> -->
          <el-form-item prop="username" class="name">
            <span>手机</span>
            <el-input v-model="ruleForm.username"  style="width:320px;font-size:16px;">
            </el-input>
          </el-form-item>
          <!-- <div style="position:relative;height:32px;line-height:32px"><span class="icon_" :class="ruleForm.password ?'':'active'">密码</span></div> -->
          <el-form-item prop="password" class="name name_">
            <span>密码</span>
            <el-input
              type="password"
              v-model="ruleForm.password"
              @keyup.enter.native="submitForm('ruleForm')"
              style="width:320px;font-size:24px;"
            >
            </el-input>
          </el-form-item>
          <div class="forget"><router-link :to="{path:'/forgetPassword'}">忘记密码</router-link></div>
          <div class="login-btn">
            <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { login, agent } from "@/api/api";
export default {
  data: function() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  created() {},
  methods: {
    handPassword(value){
      debugger
    },
    submitForm(formName) {
      let that = this;
      that.$refs[formName].validate(valid => {
        if (valid) {
          localStorage.setItem("ms_username", that.ruleForm.username);
          login({
            username: that.ruleForm.username,
            password: that.ruleForm.password
          }).then(res => {
            if (res.data && res.data.CODE == 200) {
              localStorage.setItem("status_", that.ruleForm.username);
              localStorage.setItem("status_login",JSON.stringify(res.data.RESULT));
              that.$router.push("/warehousingApplication");
            } else {
              that.$router.push("/login");
              this.$message({
                message: res.data.errorMsg,
                type: "error"
              });
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.login_ {
  width: 1200px;
  margin:0 auto;
}
.top {
  width: 1200px;
  margin: 12px auto 182px;
}
.top .fr {
  color: rgba(89, 102, 137, 1);
  height: 42px;
  line-height: 42px;
}
.top img {
  width: 105px;
  height: 42px;
}
.main {
  width: 1040px;
  margin: 0 auto;
}
.main .fl img {
  width: 647px;
  height: 450px;
}
.main .fr p {
  font-size: 18px;
  font-weight: 600;
  color: rgba(89, 102, 137, 1);
  padding-top: 90px;
  padding-bottom: 40px;
}
.name {
  /* padding-top: 35px; */
  position: relative;
}
.name_{
  padding-top:40px;
}
.name span{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 100000;
}
.name  .el-input__inner{
  padding-left:40px;
}
.login-btn {
  padding-top: 24px;
}
.login-btn button {
  width: 168px;
  height: 36px;
  background: linear-gradient(
      131deg,
      rgba(83, 118, 255, 1) 0%,
      rgba(125, 135, 255, 1) 100%
    )
    rgba(255, 255, 255, 0.48);
  border-radius: 4px;
}
.icon_phone{
  padding:32px 0 10px 0;
}
/* .icon_{
  position: absolute;
  left: 0;
  top:0px;
} */
/* .icon_.active{
     top: 32px;
    z-index: 10000;
} */
.forget{
  text-align: right;
}
.forget a{
  color:#A3ADC8;
}
</style>