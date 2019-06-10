<template>
  <div class="personalCenter">
    <header>
      <div class="fl">基本信息</div>
      <div class="fr">
        <el-button @click="handleEdit(false)" v-if="edit==false">
          编辑
        </el-button>
        <el-button @click="handleEdit(true)" v-else>
          保存
        </el-button>
      </div>
    </header>
    <div class="img">
      <img src alt>
    </div>
    <div class="content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item prop="userName" class="name" label="登录手机：">
          <span v-if="!edit">{{ruleForm.userName}}</span>
          <el-input v-model="ruleForm.userName" placeholder="登录手机" style="width:213px" v-else maxlength="11" disabled></el-input>
        </el-form-item>
        <el-form-item prop="nickname" class="name" label="姓名：">
          <span v-if="!edit">{{ruleForm.nickname}}</span>
          <el-input v-model="ruleForm.nickname" placeholder="姓名" style="width:213px" v-else></el-input>
        </el-form-item>
        <el-form-item label="生日：" prop="birthday" class="name">
          <span v-if="!edit">{{ruleForm.birthday}}</span>
          <el-date-picker
            v-else
            type="date"
            placeholder="选择日期"
            v-model="ruleForm.birthday"
            value-format="yyyy-MM-dd"
            style="width:213px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="email" class="name" label="邮箱：">
          <span v-if="!edit">{{ruleForm.email}}</span>
          <el-input v-model="ruleForm.email" placeholder="邮箱" style="width:213px" v-else></el-input>
        </el-form-item>
        <el-form-item prop="departmentName" class="name" label="部门：">
          <span v-if="!edit">{{ruleForm.departmentName}}</span>
          <el-input v-model="ruleForm.departmentName" placeholder="部门" style="width:213px" v-else disabled></el-input>
        </el-form-item>
        <el-form-item prop="jobType" class="name" label="岗位：">
          <span v-if="!edit"><i v-for="itemitem in jobs" v-if="itemitem.value==ruleForm.jobType">{{itemitem.label}}</i></span>
          <el-select v-model="ruleForm.jobType" placeholder="岗位"  v-else style="width:213px" disabled>
              <el-option
                v-for="item in jobs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="roleName" class="name" label="角色：">
          <span v-if="!edit">{{ruleForm.roleName}}</span>
          <el-input v-model="ruleForm.roleName" placeholder="角色" style="width:213px" v-else disabled></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { userInfoEditor,userInfoDetail } from "@/api/api";

export default {
  data() {
       // 手机号校验
    var check_mobile = (rule, value, callback) => {
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
    var checkedEmail=(rule, value, callback) =>{
        var reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
         if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("邮箱输入不正确"));
      }
    };
    return {
      edit: false,
      jobs:[{label:'业务岗',value:1103},{label:'复核岗',value:1100},{label:'审批岗',value:1101},{label:'终审岗',value:1102}],
      ruleForm: {
        userName: "",
        nickname: "",
        email: "",
        departmentName: "",
        jobType: "",
        roleName: "",
        birthday: ""
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur",validator:check_mobile }
        ],
        email: [
          { required: true, message: "请输入用户名", trigger: "blur",validator:checkedEmail }
        ],
        // password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    handleEdit(value) {
      if (value == false) {
        this.edit = true;
      } else {
        let ruleForm = this.ruleForm;
        ruleForm.birthday =
          ruleForm.birthday.substr(0, 4) +
          ruleForm.birthday.substr(5, 2) +
          ruleForm.birthday.substr(8, 2);
        this.edit = false;
        this.submitForm("ruleForm", ruleForm);
      }
    },
    submitForm(formName, param) {
      let that = this;

      that.$refs[formName].validate(valid => {
        if (valid) {
          userInfoEditor(param).then(res => {
            if (res.data && res.data.CODE == 200) {
              this.$message({
                message: res.data.MESSAGE,
                type: "success"
              });
            } else {
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
  },
  created() {
    userInfoDetail({}).then(res=>{
           if (res.data && res.data.CODE == 200) {
            let ruleForm = res.data.RESULT;
            if(!ruleForm.birthday){
              ruleForm.birthday='';
            }else {
              ruleForm.birthday=ruleForm.birthday+'';
            }
            this.ruleForm=ruleForm
              this.$message({
                message: res.data.MESSAGE,
                type: "success"
              });
            } else {
              this.$message({
                message: res.data.MESSAGE,
                type: "error"
              });
        }
    })
  }
};
</script>
<style scoped>
.personalCenter header {
  padding: 17px 38px 0 32px;
  height: 65px;
  font-size: 16px;
  font-weight: 600;
}
.personalCenter header .fl {
  padding-top: 8px;
}
.personalCenter header .fr button {
  width: 78px;
  height: 32px;
  background: rgba(83, 118, 255, 1);
  border-radius: 2px;
  color: #fff;
}
.personalCenter .img {
  padding-left: 76px;
  height: 78px;

  margin-bottom: 28px;
}
.personalCenter .img img {
  height: 78px;
  width: 76px;
  display: block;
  background: linear-gradient(
    117deg,
    rgba(211, 212, 255, 1) 0%,
    rgba(181, 168, 255, 1) 100%
  );
  border-radius: 50%;
}
.personalCenter .content {
  padding-left: 54px;
}
</style>
