<template>
  <div class="roleInfo">
    <div class="financeCheck">
      <div class="role_edit" @click="editStatusFun" v-if="!editStatus_">
        <el-button>
          <i class="el-icon-lx-anniubianji"></i>
          <span>编辑</span>
        </el-button>
      </div>
      <div class="role_edit" v-else>
        <el-button @click="editStatusFun_">
          <!-- <i class="el-icon-lx-anniubianji"></i> -->
          <span>保存</span>
        </el-button>
        <el-button @click="editStatusFun__">
          <!-- <i class="el-icon-lx-anniubianji"></i> -->
          <span>取消</span>
        </el-button>
      </div>
      <!-- <p class="financeCheck_use">
        <i>财务审核员</i>
        <span>启用角色</span>
        <el-switch v-model="value" active-color="#A3ADC8" inactive-color="#5376FF"></el-switch>
        <span>禁用角色</span>
      </p>
      <p class="role_detail">
        <span>授权人数：</span>
        <el-input v-if="editStatus_" placeholder="12"></el-input>
        <i v-else>12</i>
        <span>授权人数：</span>
        <el-input v-if="editStatus_"></el-input>
        <i v-else>12</i>
        <span>授权人数：</span>
        <el-input v-if="editStatus_"></el-input>
        <i v-else>12</i>
      </p>-->
    </div>
    <div class="roleName clearfix">
      <div class="switchRole">
        <i>{{roleName}}</i> 
        <span>启用角色</span>
        <el-switch v-model="value" active-color="#A3ADC8" inactive-color="#5376FF" :disabled="!editStatus_" @change="handleChange"></el-switch>
        <span>停用角色</span>
      </div>
      <label for>角色名称</label>
      <div class="roleInput">
        <el-input v-if="editStatus_" v-model="roleName"></el-input>
        <span v-else>{{roleName}}</span>
      </div>
    </div>
    <ul class="manage">
      <p>选择权限</p>
      <li v-for="(item,index) in arr">
        <el-checkbox
          :indeterminate="item.isIndeterminate"
          v-model="!item.isIndeterminate"
          @change="handleCheckAllChange(item.isIndeterminate,Object.keys(item)[0])"
          :disabled="!editStatus_"
        >{{Object.keys(item)[0]}}</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="item.checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox
            v-for="city in item[Object.keys(item)[0]]"
            :label="city"
            :key="city.id"
            :disabled="!editStatus_"
          >{{city.permissionName}}</el-checkbox>
        </el-checkbox-group>
      </li>
    </ul>
  </div>
</template>
<script>
import { getAuthRole, authRole } from "@/api/api";
export default {
  name:'roleInfo',
  data() {
    return {
      value: false,
      editStatus_: false,
      checkAll: true,
      arr: [],
      input: "",
      selectedDatas: [], // 选中数组集合
      roleName: "",
      id: ""
    };
  },
  methods: {
    handleChange(value){
      this.value=value;
    },
    handleBuild() {
      let selectedDatas = this.selectedDatas;
      // selectedDatas.map(function(v, i) {
      //   delete v["permissionName"];
      //   delete v["resourceName"];
      //   delete v["permSelected"];
      // });
      let value=this.value;
      let roleStatus;
      if(value){
        roleStatus=6000;
      }else {
        roleStatus=6001;
      }
      authRole({
        id: this.id,
        roleName: this.roleName,
        roleStatus: roleStatus,
        permissionList: selectedDatas
      }).then(res => {
        if (res.data && res.data.CODE == 200) {
          this.$message({
            message: "保存角色成功",
            type: "success"
          });
          this.$router.push('/roleManage')
        } else {
          this.$message.error(res && res.data && res.data.MESSAGE);
        }
      });
    },
    editStatusFun() {
      this.editStatus_ = true;
    },
    editStatusFun_() {
      this.editStatus_ = false;
      this.handleBuild();
    },
    editStatusFun__() {
      this.editStatus_ = false;
      this.getAuthRole();
    },
    handleCheckAllChange(value_, val_) {
      // this.checkedCities = val ? cityOptions : [];
      // this.isIndeterminate = false;
      let arr = this.arr;
      let selectedDatas = this.selectedDatas;
      // selectedDatas &&
      //   selectedDatas.map(function(vall, inxx) {
      //     if (value_) {
      //       if (vall.resourceName == val_) {
      //         selectedDatas.splice(inxx, 1);
      //       }
      //     }
      //   });
      var i = selectedDatas.length;
      while (i--) {
        if (selectedDatas[i].resourceName == val_) {
          selectedDatas.splice(i, 1);
        }
      }

      arr &&
        arr.map(function(val, inx) {
          if (Object.keys(val)[0] == val_) {
            val.isIndeterminate = !value_;
            if (value_) {
              selectedDatas = selectedDatas.concat(val[Object.keys(val)[0]]);
              val.checkedCities = val[Object.keys(val)[0]];
            } else {
              val.checkedCities = [];
            }
          }
        });
      this.selectedDatas = selectedDatas;
      this.arr = arr;
    },
    handleCheckedCitiesChange(value) {
      let arr = this.arr;
      let selectedDatas = this.selectedDatas;
      // let checkedCount = value.length;
      // this.checkAll = checkedCount === this.cities.length;
      // this.isIndeterminate =
      //   checkedCount > 0 && checkedCount < this.cities.length;
      let obj = {};
      value.map(function(val, inx) {
        if (obj[val.resourceName]) {
          obj[val.resourceName] += 1;
        } else {
          obj[val.resourceName] = 1;
        }
      });
      arr.map(function(val, inx) {
        for (var item in obj) {
          Object.keys(val)[0];
          if (Object.keys(val)[0] == item) {
            if (obj[item] == val[Object.keys(val)[0]].length) {
              val.isIndeterminate = false;
            } else {
              val.isIndeterminate = true;
            }
          }
        }
      });
      selectedDatas.map(function(v, i) {
        if (v.resourceName == value[0].resourceName) {
          selectedDatas.splice(i, 1);
        }
      });
      var i = selectedDatas.length;
      while (i--) {
        if (selectedDatas[i].resourceName == value[0].resourceName) {
          selectedDatas.splice(i, 1);
          // if (selectedDatas[i].resourceName == val_) {
          // }
        }
      }
      selectedDatas = selectedDatas.concat(value);
      this.selectedDatas = selectedDatas;
      this.arr = arr;
    },
    getAuthRole() {
      let id = this.$route.query.id;
      let selectedDatas = [];
      getAuthRole({ id: id }).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          let arr = [];
          res.data.RESULT.resourcesList.map(function(item, inx) {
            if (!item.leafResource) {
              let obj = {};
              obj[item.resourceName] = [];
              obj.isIndeterminate = true;
              obj.checkedCities = [];
              item.childrenResourceList.map(function(item_, inx_) {
                if (item_.leafResource) {
                  obj[item.resourceName].push({
                    permissionName: item_.permissionName,
                    id: item_.permissionId,
                    permissionKey: item_.permissionKey,
                    resourceName: item.resourceName,
                    permSelected: item_.permSelected
                  });
                } else {
                  let obj = {};
                  obj[item_.resourceName] = [];
                  obj.isIndeterminate = true;
                  obj.checkedCities = [];
                  item_.childrenResourceList.map(function(item__, inx__) {
                    if (item__.leafResource) {
                      obj[item_.resourceName].push({
                        permissionName: item__.permissionName,
                        id: item__.permissionId,
                        permissionKey: item__.permissionKey,
                        resourceName: item_.resourceName,
                        permSelected: item__.permSelected
                      });
                    } else {
                    }
                  });
                  arr.push(obj);
                }
              });
              arr.push(obj);
            }
          });
          if(res.data.RESULT.roleStatus==6001){
            this.value=false
          }else {
            this.value=true
          }
          this.roleName = res.data.RESULT.roleName;
          this.id = res.data.RESULT.id;
          arr.map(function(val, inx) {
            val[Object.keys(val)[0]].map(function(v, i) {
              if (v.permSelected == true) {
                val.checkedCities.push(v);
                selectedDatas.push(v);
              }
            });
            if (val.checkedCities.length == val[Object.keys(val)[0]].length) {
              val.isIndeterminate = false;
            }
          });
          for(let i=arr.length-1;i>=0;i--){
            if(arr[i][Object.keys(arr[i])[0]].length==0){
              arr.splice(i,1);
            }
          }
          this.arr = arr;
          this.selectedDatas = selectedDatas;
        }
      });
    }
  },
  created() {
    this.getAuthRole();
  }
};
</script>
<style scoped>
.switchRole {
  font-weight: 600;
  color: #606266;
  margin-bottom: 30px;
}
.switchRole i {
  font-size: 16px;
  color: rgba(89, 102, 137, 1);
  margin-right: 32px;
}
.switchRole > div {
  padding: 0 20px;
}
.switchRole span:nth-child(2){
  color:#5376FF;
}
.roleInfo {
  padding: 16px 0 0 32px;
}
.roleName label {
  line-height: 32px;
  float: left;
  font-weight: 600;
}
.roleInput {
  line-height: 32px;
  width: 374px;
  margin-left: 78px;
  font-weight: 600;
}
.manage li {
  margin-bottom: 30px;
}
.manage > p {
  margin: 24px 0 16px 0;
  font-weight: 600;
}
.financeCheck_use {
  margin-bottom: 30px;
}
.financeCheck_use > div {
  margin: 0 19px;
}
.financeCheck_use i {
  font-size: 16px;
  font-weight: 600;
  margin-right: 32px;
}
.financeCheck_use span:nth-child(2) {
  font-weight: 600;
  color: rgba(83, 118, 255, 1);
}
.role_detail {
  margin-bottom: 25px;
  padding-left: 22px;
}
.role_detail > div {
  display: inline-block;
  width: 80px;
  margin-right: 80px;
}
.role_detail span {
  color: rgba(163, 173, 200, 1);
}
.role_detail i {
  margin-right: 80px;
}
.role_edit {
  float: right;
  margin-right: 38px;
}
.role_edit button {
  background: #5376ff;
  color: #fff;
}
.el-checkbox__inner {
  background: #dbdee4;
}
</style>