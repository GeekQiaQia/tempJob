<template>
  <div class="roleManage">
    <!-- <div class="nav clearfix">
      <div class="nav_section">
        <div class="tab clearfix">
          <div class="fl">票据类型：</div>
          <ul class="fl clearfix">
            <li
              v-for="(item,index) in billType"
              v-on:click="addClass_billType(index)"
              v-bind:class="{ischeck:index==billType_current}"
            >{{item.title}}</li>
          </ul>
        </div>
        <div class="tab clearfix">
          <div class="fl">申请状态：</div>
          <ul class="fl clearfix">
            <li
              v-for="(item,index) in applyStatus"
              v-on:click="addClass_applyStatus(index)"
              v-bind:class="{ischeck:index==applyStatus_current}"
            >{{item.title}}</li>
          </ul>
        </div>
      </div>
      <div class="nav_section">
        <div class="tab clearfix">
          <div class="fl">介质：</div>
          <ul class="fl clearfix">
            <li
              v-for="(item,index) in medium"
              v-on:click="addClass_medium(index)"
              v-bind:class="{ischeck:index==medium_current}"
            >{{item.title}}</li>
          </ul>
        </div>
        <div class="tab clearfix">
          <div class="fl">申请时间：</div>
          <el-date-picker
            v-model="value1"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions2"
          ></el-date-picker>
        </div>
      </div>
      <div class="nav_section">
        <div class="tab clearfix">
          <div class="fl">入库方式：</div>
          <ul class="fl clearfix">
            <li
              v-for="(item,index) in warehousingMmode"
              v-on:click="addClass_warehousingMmode(index)"
              v-bind:class="{ischeck:index==warehousingMmode_current}"
            >{{item.title}}</li>
          </ul>
        </div>
      </div>
    </div>-->
    <div class="search_">
      <el-input
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="input_"
        clearable
        @keyup.enter.native="searchEnterFun"
      ></el-input>
    </div>
    <div class="banner">
      <ul class="clearfix">
        <li>
          <router-link to="/addRole">
            <span>添加角色</span>
          </router-link>
        </li>
        <li>
          <el-button type="text" @click="batchUpdate(0)">
            <span>启用</span>
          </el-button>
        </li>
        <li>
          <el-button type="text" @click="batchUpdate(1)">
            <span>停用</span>
          </el-button>
        </li>
      </ul>
    </div>
    <div class="con">
      <el-table
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="roleName" label="角色名" min-width="120">
          <template slot-scope="scope">
            <router-link
              :to="{path:'/roleInfo',query:{id:scope.row['id']}}"
            >{{scope.row['roleName']}}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="accountNum" label="使用人数" min-width="120"></el-table-column>
        <el-table-column prop="createNickname" label="创建人" min-width="120"></el-table-column>
        <el-table-column prop="roleStatusName" label="状态" min-width="120"></el-table-column>
        <el-table-column prop="updateDate" label="最后更新日期" min-width="120"></el-table-column>
      </el-table>
    </div>
    <div class="page" v-if="count-0>=10">
      <!-- <el-pagination background layout="prev, pager, next" :total="count"  @current-change="handlePage"></el-pagination> -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handlePage"
          :current-page.sync="currentPage"
          :page-sizes="[10, 50, 100, 200]"
          :page-size="pageSize"
          layout="sizes, prev, pager, next"
          :total="count">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  roleSearchList,
  batchUpdate
} from "@/api/api";
export default {
  name: "roleManage",
  data() {
    return {
      pageSize:10,
      currentPage:1,
      list: [],
      count:1,
      value1: "",
      input_: "",
      pageNo:1,
      billType_current: 0,
      billType: [{ title: "全部" }, { title: "银承" }, { title: "商承" }],
      applyStatus_current: 0,
      checkList: ["复选框 A"],
      applyStatus: [
        { title: "全部" },
        { title: "待审核" },
        { title: "已拒绝" },
        { title: "待审核" },
        { title: "已拒绝" }
      ],
      medium_current: 0,
      medium: [{ title: "全部" }, { title: "银承" }, { title: "商承" }],
      warehousingMmode_current: 0,
      warehousingMmode: [
        { title: "全部" },
        { title: "签票" },
        { title: "买入" }
      ],
      transferable_current: 0,
      transferable: [
        { title: "全部" },
        { title: "可转让" },
        { title: "不可转让" }
      ],
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      list: [
        // {
        //   roleName: "曹大哥",
        //   accountNum: "10000",
        //   createNickname: "哈哈",
        //   roleStatusName: "在建",
        //   updateDate: "2015666"
        // }
      ],
      multipleSelection: []
    };
  },
  methods: {
     handleSizeChange(val) {
      this.pageSize=val;
      this.currentPage=1;
      this.roleSearchList()
    },
    handlePage(value){
      this.pageNo=value
      this.roleSearchList();
    },
    batchUpdate(value){
      let roleStatus;
      if(value==0){
          roleStatus='6001'
      }else if(value==1){
          roleStatus='6000'
      }
      batchUpdate({updateRoleList:this.multipleSelection,roleStatus:roleStatus}).then(res=>{
        if (res && res.data && res.data.CODE == "200") {
          this.$message({
            message: res.data.MESSAGE,
            type: "success"
          });
          this.roleSearchList();
        } else {
          this.$message.error(res && res.data && res.data.MESSAGE);
        }
      })
    },
    addClass_billType(index) {
      this.billType_current = index;
    },
    addClass_applyStatus(index) {
      this.applyStatus_current = index;
    },
    addClass_medium(index) {
      this.medium_current = index;
    },
    addClass_warehousingMmode(index) {
      this.warehousingMmode_current = index;
    },
    addClass_transferable(index) {
      this.transferable_current = index;
    },
    handleSelectionChange(val) {
      let multipleSelection = [];
      val &&
        val.map(function(v, i) {
          multipleSelection.push({ id: v.id });
        });
      this.multipleSelection = multipleSelection;
    },
    searchEnterFun(e) {
      var keyCode = window.event ? e.keyCode : e.which;
      if (keyCode == 13) {
        this.roleSearchList();
      }
    },
    roleSearchList(param) {
      let params={
        roleName: this.input_,
        pageNo:this.pageNo,
        pageSize:this.pageSize
      }
      roleSearchList(params).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          this.list = res.data.RESULT.list;
          this.count=res.data.RESULT.count
        }
      });
    }
  },
  created() {
    this.roleSearchList({ roleName:this.input_ });
  },
};
</script>

<style scoped>
.search_ {
  margin-bottom: 16px;
  padding-right: 42px;
}
.roleManage {
  font-size: 14px;
  padding: 21px 0px 0 32px;
}
.roleManage .nav {
  color: #596689;
}
.roleManage .nav .nav_section {
  float: left;
}
.roleManage .nav .nav_section:nth-child(1) {
  margin-right: 45px;
}
.roleManage .nav .nav_section:nth-child(2) {
  margin-right: 12px;
}
.roleManage .nav .tab {
  line-height: 38px;
  height: 38px;
}
.roleManage .nav .tab > div:nth-child(1) {
  width: 78px;
  font-weight: 600;
}
.roleManage .nav .tab {
  margin-bottom: 24px;
}
.roleManage .nav ul li {
  float: left;
  padding: 0 12px;
  margin-left: 8px;
  cursor: pointer;
}
.roleManage .nav ul li:nth-child(1) {
  margin-left: 0;
}
.roleManage .nav ul li.ischeck {
  background: rgba(229, 237, 255, 1);
  border-radius: 2px;
}
.roleManage .banner {
  margin-bottom: 16px;
}
.roleManage .banner li {
  float: left;
  margin-right: 5px;
  text-align: center;
  width: 78px;
  height: 32px;
  line-height: 32px;
  background: rgba(83, 118, 255, 1);
  border-radius: 2px;
}
.roleManage .banner li a {
  display: block;
  width: 100%;
  height: 100%;
  color: #fff;
}
.roleManage .banner li button {
  color: #fff;
}
.roleManage .banner li span {
  margin-left: 5px;
}
.roleManage .con {
  position: relative;
  min-height: 440px;
  padding-right: 42px;
}
.roleManage .con > ul {
  position: absolute;
  right: 34px;
  top: 9px;
  z-index: 1000;
  padding: 5px;
  cursor: pointer;
  background: #fff;
}
.roleManage .con > ul li {
  width: 3px;
  height: 3px;
  margin-bottom: 2px;
  border-radius: 50%;
  background: rgba(163, 173, 200, 1);
}
.roleManage .con a {
  color: rgba(83, 118, 255, 1);
}
.roleManage .page {
  margin-top: 24px;
  text-align: right;
}
.el-range-editor--small.el-input__inner {
  width: 342px;
}
.el-checkbox {
  padding-left: 35px;
  width: 33%;
  margin-right: 0;
  margin-bottom: 20px;
  box-sizing: border-box;
}
.el-checkbox:last-child {
  margin-bottom: 0px;
}
</style>
