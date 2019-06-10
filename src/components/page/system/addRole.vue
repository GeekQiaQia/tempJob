<template>
  <div class="addRole">
    <div class="roleName">
      <label for>角色名称</label>
      <div class="roleInput">
        <el-input v-model="input"></el-input>
      </div>
    </div>
    <p class="select">选择权限</p>
    <ul class="manage">
      <li v-for="(item,index) in arr">
        <el-checkbox
          :indeterminate="item.isIndeterminate"
          v-model="!item.isIndeterminate"
          @change="handleCheckAllChange(item.isIndeterminate,Object.keys(item)[0])"
        >{{Object.keys(item)[0]}}</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="item.checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox
            v-for="city in item[Object.keys(item)[0]]"
            :label="city"
            :key="city.id"
          >{{city.permissionName}}</el-checkbox>
        </el-checkbox-group>
      </li> 
    </ul>
    <div class="switchRole">
      <span>启用角色</span>
      <el-switch v-model="value" active-color="#A3ADC8" inactive-color="#5376FF" @change="handleChange"></el-switch>
      <span>停用角色</span>
    </div>
    <div class="footer">
      <el-button @click="handleBuild">创建</el-button>
      <el-button @click="handleb">取消</el-button>
    </div>
  </div>
</template>
<script>
import { findListForRole, authRole, getAuthRole } from "@/api/api";
export default {
  name: "addRole",
  data() {
    return {
      checkAll: true,
      value: false,
      cities: ["上海", "北京", "广州", "深圳"],
      arr: [],
      input: "",
      selectedDatas: [] // 选中数组集合
    };
  },
  methods: {
    handleChange(value) {
      this.value=value;
    },
    handleBuild() {
      let selectedDatas = this.selectedDatas;
      selectedDatas.map(function(v, i) {
        // delete v["permissionName"];
        // delete v["resourceName"];
      });
      if(!this.input) {
          this.$message.error('角色名称不能为空');
          return
      }
      if(selectedDatas.length==0) {
          this.$message.error('请先勾选权限项');
          return
      }
      let roleStatus
      if(this.value){
        roleStatus=6000
      }else {
        roleStatus=6001
      }
      authRole({
        roleName: this.input,
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
    handleb() {
      this.$router.push('/roleManage')
    },
    handleCheckAllChange(value_, val_) {
      let arr = this.arr;
      let selectedDatas = this.selectedDatas;
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
    findListForRole() {
      findListForRole({ reqType: "1" }).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          let arr = [];
          res.data.RESULT.map(function(item, inx) {
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
                    resourceName: item.resourceName
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
                        resourceName: item_.resourceName
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
          for(let i=arr.length-1;i>=0;i--){
            if(arr[i][Object.keys(arr[i])[0]].length==0){
              arr.splice(i,1);
            }
          }
          this.arr = arr;
        }
      });
    }
  },
  created() {
    this.findListForRole();
  }
};
</script>
<style scoped>
.addRole {
  padding: 16px 0 0 32px;
}
.roleName label {
  line-height: 32px;
  float: left;
  font-weight: 600;
}
.roleInput {
  width: 374px;
  margin-left: 78px;
}
.manage{
  padding-left: 22px
}
.manage li {
  margin-bottom: 30px;
}
p.select {
  margin: 24px 0 16px 0;
  font-weight: 600;
}
.switchRole {
  color:#606266;
  margin-bottom: 40px;
}
.switchRole > div{
  padding:0 20px;
}
.footer button{
  width: 95px;
  height: 40px;
}
.footer button:nth-child(1){
  color:#fff;
  background:rgba(83,118,255,1);
}
.footer button:nth-child(2){
  color:#323E61;
  background:#fff;
}
</style>