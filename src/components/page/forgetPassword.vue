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
      <div name="forgetPwd" v-show="!hasCheckedCode" class="rightForm">
        <p>忘记密码</p>
        <el-form :model="ruleForm" :rules="rulesPhone" ref="forgetPwd" label-width="0px">
           <div class="icon_phone">登录手机</div>
          <el-form-item prop="phoneNum" class="name">
            <el-input
                    type="text"
                    autofocus=true
                    v-model="ruleForm.phoneNum"
                    placeholder="请输入登录手机号码"
                    style="width:320px;font-size:16px;">
            </el-input>
          </el-form-item>
          <el-form-item prop="verifyCode" class="name name_">
            <el-input
                    @keyup.enter.native="toCheckVerifyCode('forgetPwd')"
                    type="text"
                    v-model="ruleForm.verifyCode"
                    placeholder="验证码"
                    style="width:320px;">
              <el-button slot="append" class="verification" :class="{disabledBtn:hasSendCode}"  :disabled="hasSendCode"  @click="sendVerifyCode">
                <count-down v-if="hasSendCode"  ref="sendCode" @onTimeout="handleTimeout" seconds="60" name="getCode" tips="s后重新发送"></count-down>
                <div v-show="!hasSendCode">{{tipMessage}}</div>
              </el-button>
            </el-input>
          </el-form-item>
          <div class="login-btn " :class="{disabledBtn:isDisabled}" >
            <el-button type="primary"    :disabled="isDisabled" @click="toCheckVerifyCode('forgetPwd')">下一步</el-button>
            <div class="forget"><router-link :to="{path:'/login'}">返回登录</router-link></div>
          </div>
        </el-form>
      </div>

      <div name="setPwd"  v-show="hasCheckedCode" class="rightForm">
        <p>设置新密码</p>
        <el-form :model="ruleFormPwd" :rules="rulesPwd" ref="setPwd" label-width="0px">
          <div class="icon_phone">设置新密码</div>
          <el-form-item prop="passwordOne" class="name">
            <el-input
                    type="password"
                    autofocus=true
                    autocomplete="off"
                    v-model="ruleFormPwd.passwordOne"
                    placeholder="请输入新密码"
                    style="width:320px;font-size:16px;">
            </el-input>
          </el-form-item>
          <el-form-item prop="passwordTwo" class="name name_">
            <el-input
                    @keyup.enter.native="toSetNewPwd('setPwd')"
                    type="password"
                    autocomplete="off"
                    v-model="ruleFormPwd.passwordTwo"
                    placeholder="确认新密码"
                    style="width:320px;">
            </el-input>
          </el-form-item>
          <div class="login-btn "  >
            <el-button type="primary"     @click="toSetNewPwd('setPwd')">设置</el-button>
            <div class="forget"><router-link :to="{path:'/login'}">返回登录</router-link></div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { getverifyCode,checkVerifyCode,setNewPassword } from "@/api/api";
export default {
  data: function() {
    let check_mobile = (rule, value, callback) => {
      let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if(value===""){
        callback(new Error("请输入手机号码"));
      }

      if (reg.test(value)) {
        callback();
      } else {
        return callback(new Error("手机号格式错误"));
      }
    };
    let check_verifyCode = (rule, value, callback) =>{
     if(value===""){
       this.isDisabled=true;
       callback(new Error("请输入验证码"));
     }else{
       this.isDisabled=false;
       callback();
     }

    };
    let validateNewPwd=(rule,value,callback)=>{
      if(value===""){
        callback(new Error("请输入新密码"));
      }else if(this.ruleFormPwd.passwordTwo!==""){
        this.$refs.setPwd.validateField("passwordTwo");
      }else {
        callback();
      }
      callback();
    };
    let validateCheckPwd=(rule,value,callback)=>{
      if(value===""){
        callback("请再次输入密码");
      }else if(value!==this.ruleFormPwd.passwordOne){
        callback(new Error("两次密码输入不一致"));
      } else{
        callback();
      }
      callback();
    };
    return {
      hasCheckedCode:false,
      tipMessage:"发送验证码",
      isDisabled:true,
      hasSendCode:false,
      ruleFormPwd:{
        passwordOne:"",
        passwordTwo:""
      },
      ruleForm: {
        phoneNum: "",
        verifyCode: ""
      },
      rulesPhone: {
        phoneNum: [{ validator:check_mobile, trigger: "blur" }],
        verifyCode: [{ validator:check_verifyCode, trigger: "blur" }]
      },
      rulesPwd:{
        passwordOne: [{ validator:validateNewPwd, trigger: "blur" }],
        passwordTwo: [{ validator:validateCheckPwd, trigger: "blur" }]
      }
    };
  },
  created() {},
  methods: {
    // 设置新密码
    toSetNewPwd(formName){
      let that = this;
      that.$refs[formName].validate(valid => {
        if (valid) {
          // do something right;
          let reqData={"userName":that.ruleForm.phoneNum,"passwordOne":that.ruleFormPwd.passwordOne,"passwordTwo":that.ruleFormPwd.passwordTwo};
          setNewPassword(reqData)
                  .then(res=>{
                    if(res.data&&res.data.CODE==="200"){
                      that.$router.push("/login");
                      this.$message({
                        message:"温馨提示:新密码设置成功",
                        type:"success"
                      });
                    }
                  })
                  .catch(err=>{
                    this.$message({
                      message:err.toString(),
                      type:"error"
                    });
                  });
        } else {
          return false;
        }
      });
    },
    // 倒计时结束执行函数；
    handleTimeout(){
      this.hasSendCode=!this.hasSendCode;
    },
    // 点击验证码请求之前，判断手机号码是否符合规则；
    checkMobilePhone(value){
      let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if(value===""){
        this.$message({
          message:"请输入手机号码",
          type:"error"
        });
        return false;
      }

      if (reg.test(value)) {
       return true;
      } else {
        this.$message({
          message:"手机号格式错误",
          type:"error"
        });
        return false;
      }
    },
    // 发送验证码请求；
    sendVerifyCode(){
      //判断手机号码是否符合规则
    if(this.checkMobilePhone(this.ruleForm.phoneNum)){
      let reqData={"userName":this.ruleForm.phoneNum};
      getverifyCode(reqData)
              .then(res=>{
                if(res.data&&res.data.CODE==="1007"){
                  this.hasSendCode=false;
                  this.$message({
                    message:"该手机号尚未注册！",
                    type:"warning"
                  });
                }else if(res.data.CODE==="1034"){
                  this.hasSendCode=false;
                  this.$message.error('登录手机号码不能为空');
                }else if(res.data.CODE==="1035"){
                  that.hasSendCode=false;
                  this.$message.error('该手机号无验证码请求记录，请检查登录手机号');
                }else if(res.data.CODE==="1039"){
                  this.hasSendCode=false;
                  this.$message.error('很抱歉，验证码发送失败，请您稍后再试');
                }else if(res.data.CODE==="200"){
                  this.hasSendCode=true;
                  this.$message({
                    message:"手机验证码发送成功，请在规定时间内完成验证",
                    type:"success"
                  });
                }
              })
              .catch(err=>{
                this.hasSendCode=false;
                this.$message({
                  message:err.toString(),
                  type:"error"
                });
              });
    }
    },
    handPassword(value){
      debugger
    },
    // 校验验证码以及下一步操作；
    toCheckVerifyCode(formName) {
      let that = this;
      that.isDisabled=false;
      that.$refs[formName].validate(valid => {
        if (valid) {
          // do something right;
          // 发送请求校验手机号码和校验码是否正确；
          let reqData={"userName":that.ruleForm.phoneNum,"mobileVerifyCode":that.ruleForm.verifyCode};
          checkVerifyCode(reqData)
                  .then(res=>{
                    if(res.data&&res.data.CODE==="1007"){
                      that.hasSendCode=false;
                      this.$message({
                        message:"该手机号尚未注册！",
                        type:"warning"
                      });
                    }else if(res.data.CODE==="1034"){
                      that.hasSendCode=false;
                      this.$message.error('登录手机号码不能为空');
                    }else if(res.data.CODE==="1035"){
                      that.hasSendCode=false;
                      this.$message.error('该手机号无验证码请求记录，请检查登录手机号');
                    }else if(res.data.CODE==="1036"){
                      that.hasSendCode=false;
                      this.$message.error('同一手机号一天最多接收10条验证码!');
                    }else if(res.data.CODE==="1037"){
                      that.hasSendCode=false;
                      this.$message.error('验证码超时!');
                    }else if(res.data.CODE==="1038"){
                      that.hasSendCode=false;
                      this.$message.error('验证码输入错误!');
                    }else if(res.data.CODE==="200"){
                      that.hasCheckedCode=true;
                      this.$message({
                        message:"验证码校验正确",
                        type:"success"
                      });
                    }
                  })
                  .catch(err=>{
                    this.hasSendCode=false;
                    this.$message({
                      message:err.toString(),
                      type:"error"
                    });
                  });
        } else {
          return false;
        }
      });
    }
  },
  watch:{},
  computed:{},
  mounted() {
  }
};
</script>
<style scoped lang="less" rel="stylesheet/less">

  .counter{
    font-size: 13px;
    margin-left: -8px;
  }
  /deep/ .el-form-item__error{
    left:220px;
  }
  /deep/ .el-input-group__append, .el-input-group__prepend{
    background:rgba(83,118,255,1);
    font-size:14px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(255,255,255,1);
  }
  .verification{
    width:98px;
    height:32px;
    border-radius:2px;
    background:rgba(83,118,255,1);
  }
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
   display: flex;
   flex-direction: row;
   flex-wrap: nowrap;
  margin-left: 12.85vw;
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
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.login-btn button {
  width: 168px;
  height: 36px;
  background:linear-gradient(131deg,rgba(83,118,255,1) 0%,rgba(125,135,255,1) 100%) rgba(255,255,255,0.48);
  border-radius:4px;
}
.disabledBtn{
  opacity: 0.5;
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
  margin-left: 12.22%;
  font-size:14px;
  font-family:PingFangSC-Medium;
  font-weight:500;

  line-height:14px;
}
.forget a{
  color:rgba(83,118,255,1);
}
</style>