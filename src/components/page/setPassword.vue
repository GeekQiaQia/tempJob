<template>
  <div class="setPassword login_">
    <div class="top clearfix">
      <div class="fl">
        <img src="../../assets/img/logo_.png" alt>
      </div>
      <div class="fr">联系我们：021-60654047</div>
    </div>
    <div class="main clearfix setPassword_main">
      <div class="fl">
        <img src="../../assets/img/login_bg.png" alt>
      </div>
      <div class="fr">
        <p>设置新密码</p>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px">
          <!-- <div class="icon_phone">登录手机</div> -->
          <el-form-item prop="userPassword" class="name ">
            <span>旧密码</span>
            <el-input v-model="ruleForm.userPassword"  style="width:320px;font-size:16px;">
            </el-input>
          </el-form-item>
          <el-form-item prop="passwordOne" class="name">
            <span>设置新密码</span>
            <el-input v-model="ruleForm.passwordOne"  style="width:320px;font-size:16px;">
            </el-input>
          </el-form-item>
          <!-- <div style="position:relative;height:32px;line-height:32px"><span class="icon_" :class="ruleForm.password ?'':'active'">密码</span></div> -->
          <el-form-item prop="passwordTwo" class="name">
            <span>确认新密码</span>
            <el-input
              v-model="ruleForm.passwordTwo"
              style="width:320px;font-size:16px;"
            >
            </el-input>
          </el-form-item>
          <div class="login-btn">
            <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button> <router-link :to="{path:'/login'}">返回登录</router-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { login, agent ,userUpdatePassword} from "@/api/api";
export default {
  data: function() {
    return {
      ruleForm: {
        userPassword: "",
        passwordOne: "",
        passwordTwo: ""
      },
      rules: {
        userPassword: [{ required: true, message: "请输入密码", trigger: "blur" }],
        passwordOne: [{ required: true, message: "请输入密码", trigger: "blur" }],
        passwordTwo: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  created() {},
  methods: {
    submitForm(formName) {
      let that = this;
      that.$refs[formName].validate(valid => {
        if (valid) {
          userUpdatePassword({
            userPassword: that.ruleForm.userPassword,
            passwordOne: that.ruleForm.passwordOne,
            passwordTwo: that.ruleForm.passwordTwo
          }).then(res => {
            if (res.data && res.data.CODE == 200) {
              that.$router.push("/warehousingApplication");
            } else {
              that.$router.push("/login");
              this.$message({
                message: res.data.MESSAGE,
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
.setPassword {
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
.setPassword  .el-input__inner{
  padding-left:78px;
}
.login-btn {
  padding-top: 24px;
}
.login-btn a{
  color:#5376FF;
  margin-left: 32px;
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