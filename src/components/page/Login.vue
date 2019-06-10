<template>
  <div class="login_">
    <div class="top clearfix">
      <div class="fl login-logo">
      <img src="../../assets/img/logo_.png" alt>
     </div>
      <div class="fr login-contact">联系我们：021-60654047</div>
    </div>
    <div class="main clearfix">
      <img src="../../assets/img/login_bg.png" alt>
      <div class="rightForm  login_main">
        <p>欢迎登录票+</p>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px">
           <div class="icon_phone">登录手机</div>
          <el-form-item prop="username" class="name">
            <label for="">手机</label>
            <el-input v-model="ruleForm.username"  style="width:320px;font-size:16px;color:#596689" maxlength="11">
            </el-input>
          </el-form-item>
          <!-- <div style="position:relative;height:32px;line-height:32px"><span class="icon_" :class="ruleForm.password ?'':'active'">密码</span></div> -->
          <el-form-item prop="password" class="name name_">
            <label>密码</label>
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
    // 手机号校验
    var check_mobile = (rule, value, callback) => {
      if(value=="admin"){
        callback();
        return
      }
      var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (reg.test(value)) {
        callback();
      } else {
        return callback(new Error("手机号格式错误"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          // if (value < 18) {
          //   callback(new Error('必须年满18岁'));
          // } else {
          callback();
          // }
        }
      }, 1000);
    };
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" ,validator: check_mobile,}
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
<style scoped lang="less" rel="stylesheet/less">
.login_ {
  width: 100vw;
  .top {
    width: 100vw;
    margin-top: 1.33vh;
    .login-logo{
      margin-left: 8.33vw;
    }
    .login-contact{
      margin-right: 8.33%;
    }
    .fr {
      color: rgba(89, 102, 137, 1);
      height: 42px;
      line-height: 42px;
    }
    img {
      width: 105px;
      height: 42px;
    }

  }
}

.main {
  width: 1040px;
  margin-top: 20.22vh;
  margin-bottom: 23.78vh;
  margin-left: 12.85vw;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
img {
  width: 647px;
  height: 450px;
}
.rightForm{
  margin-left: 5.21vw;
}

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
.name label{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 100000;
}
.name  .el-input__inner{
  padding-left:40px;
  color:#596689 !important;
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