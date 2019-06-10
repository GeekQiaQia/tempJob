<template>
  <div class="tenantManage">
    <div class="nav clearfix">
      <div class="clearfix">
        <div class="tab clearfix">
          <div class="fl">租户类型：</div>
          <ul class="fl clearfix">
            <li
              v-for="(item,index) in billType"
              v-on:click="addClass_billType(index)"
              v-bind:class="{ischeck:index==billType_current}"
            >{{item}}</li>
          </ul>
        </div>
        <div class="tab clearfix">
          <div class="fl">创建时间：</div>
          <el-date-picker
            v-model="createDate"
            type="date"
            placeholder="选择日期"
            @change="handleDate"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </div>
      </div>
      <div class="clearfix">
        <!-- <div class="tab clearfix">
          <div class="fl">所在区域：</div>
          <ul class="fl clearfix">
            <li
              v-for="(item,index) in region"
              v-on:click="handleRegion(index)"
              v-bind:class="{ischeck:index==region_current}"
            >{{item}}</li>
          </ul>
        </div>-->
        <div class="tab clearfix">
          <div class="fl">视图：</div>
          <ul class="fl clearfix">
            <li
              v-for="(item,index) in view"
              v-on:click="handleView(index)"
              v-bind:class="{ischeck:index==view_current}"
            >{{item}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="banner" v-if="view_current==0">
      <ul class="clearfix">
        <li>
          <el-button type="text" @click="tenant_build">
            <i class="el-icon-lx-daochu"></i>
            <span>新建</span>
          </el-button>
        </li>
        <li>
          <el-button type="text" @click="saveTenantStatus(7000)">
            <span>启用</span>
          </el-button>
        </li>
        <li>
          <el-button type="text" @click="saveTenantStatus(7001)">
            <span>停用</span>
          </el-button>
        </li>
      </ul>
    </div>
    <!-- <div class="banner" v-else>
      <ul class="clearfix">
        <li>
          <el-button type="text" @click="saveAuthUserStatus(9000)">
            <i class="el-icon-lx-daochu"></i>
            <span>启用</span>
          </el-button>
        </li>
        <li>
          <el-button type="text" @click="saveAuthUserStatus(9001)">
            <i class="el-icon-lx-daochu"></i>
            <span>停用</span>
          </el-button>
        </li>
      </ul>
    </div>-->
    <div class="content" v-if="view_current==0">
      <el-table
        ref="multipleTable"
        :data="tableData3"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55">111</el-table-column>
        <el-table-column prop="tenantName" label="租户全称" min-width="120" width="200">
          <template slot-scope="scope">
            <span
              @click="handleDetail(scope.row['id'])"
              style="cursor:pointer"
            >{{scope.row['tenantName']}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tenantShortName" label="租户简称" min-width="120"></el-table-column>
        <el-table-column prop="detailAddress" label="详细地址" min-width="120"></el-table-column>
        <el-table-column prop="codeDescRentLevel" label="租户类型" min-width="100"></el-table-column>
        <el-table-column prop="salesPerson" label="客户归属" min-width="100"></el-table-column>
        <el-table-column prop="codeDescTenantStatus" label="状态" min-width="100"></el-table-column>
      </el-table>
    </div>
    <div class="content" v-else>
      <el-table
        ref="multipleTable_"
        :data="tableData4"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange_"
      >
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column prop="nickname" label="姓名" min-width="120" :key="Math.random()"></el-table-column>
        <el-table-column prop="sexCode" label="性别" min-width="120" :key="Math.random()">
          <template slot-scope="scope">
            <span>{{ scope.row['sexCode'] ==3000 ? '女' : '男'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="账号" min-width="120" :key="Math.random()"></el-table-column>
        <el-table-column prop="tenantName" label="所属租户" min-width="140" :key="Math.random()"></el-table-column>
        <el-table-column prop="rentLevel" label="租户类型" min-width="100" :key="Math.random()">
          <template slot-scope="scope">
            <span>{{ scope.row['rentLevel'] ==1000 ? '试用' : (scope.row['rentLevel'] ==1001 ? '普通' : '高级')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="departmentName" label="所在部门" min-width="100" :key="Math.random()"></el-table-column>
        <el-table-column prop="codeDescPost" label="部门职务" min-width="100" :key="Math.random()"></el-table-column>
        <el-table-column prop="mobile" label="联系电话" min-width="110" :key="Math.random()"></el-table-column>
        <el-table-column prop="fixphone" label="固定电话" min-width="120" :key="Math.random()"></el-table-column>
        <el-table-column prop="detailAddress" label="详细地址" min-width="100" :key="Math.random()"></el-table-column>
        <el-table-column prop="salesPerson" label="租户归属" min-width="100" :key="Math.random()"></el-table-column>
        <el-table-column prop="createDate" label="创建日期" min-width="100" :key="Math.random()">
          <template slot-scope="scope">
            <span>{{ scope.row['createDate'] && scope.row['createDate'].substr(0,10) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="添加租户" :visible.sync="dialogVisible" width="642px" :before-close="handleClose">
      <div class="content_dialog clearfix">
        <el-form :model="addTenant" :rules="rules" ref="addTenant" label-width="110px">
          <div class="content_dialog_head clearfix">
            <div>
              <p>
                <i></i>
                <span>基础信息：</span>
              </p>
              <ul>
                <li class="fl" style="margin-right:12px">
                  <el-form-item label="租户全称：" prop="tenantName">
                    <el-input
                      v-model="addTenant.tenantName"
                      class="input193"
                      @blur="handletenantName"
                    ></el-input>
                  </el-form-item>
                </li>
                <li class="fl">
                  <el-form-item label="租户简称：" prop="tenantShortName">
                    <el-input v-model="addTenant.tenantShortName" class="input160"></el-input>
                  </el-form-item>
                </li>
                <li class="fl" style="margin-right:12px">
                  <el-form-item label="类型：" prop="rentLevel_">
                    <el-select v-model="rentLevel_" placeholder="请选择类型" class="input193">
                      <el-option
                        v-for="item in rentLevels"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </li>
                <li class="fl">
                  <el-form-item label="固定电话：" prop="fixphone">
                    <el-input v-model="addTenant.fixphone" class="input160"></el-input>
                  </el-form-item>
                </li>

                <li class="fl">
                  <!-- <label for class="label">地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：</label>
                  <div class="label_input">-->
                  <!-- <el-select v-model="value" placeholder="试用" class="select94">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                      <el-select v-model="value" placeholder="试用" class="select94">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                  </el-select>-->
                  <!-- <el-input style="width:282px" v-model="addTenant.detailAddress"></el-input> -->
                  <!-- </div> -->
                  <el-form-item label="地址：" prop="detailAddress">
                    <el-input v-model="addTenant.detailAddress" class="input282"></el-input>
                  </el-form-item>
                </li>
              </ul>
            </div>
            <div>
              <p>
                <span>&nbsp;</span>
              </p>
              <ul></ul>
            </div>
          </div>
          <div class="content_dialog_head clearfix" style="padding-top:16px">
            <div class="fl">
              <p>
                <i></i>
                <span>归属信息</span>
              </p>
              <ul>
                <li>
                  <el-form-item label="客户归属：" prop="salesPerson">
                    <el-input v-model="addTenant.salesPerson"></el-input>
                  </el-form-item>
                </li>
              </ul>
            </div>
            <div class="fl" style="padding-left:14px">
              <p>
                <i></i>
                <span>使用信息</span>
              </p>
              <ul>
                <li>
                  <el-form-item label="账号数限制：" prop="maxAccountNum">
                    <el-input v-model.number="addTenant.maxAccountNum" class="input160"></el-input>
                  </el-form-item>
                </li>
              </ul>
            </div>
          </div>
          <div class="content_dialog_head clearfix" style="padding-top:16px">
            <div class="fl">
              <p>
                <i></i>
                <span>管理员信息</span>
              </p>
              <ul>
                <li>
                  <el-form-item label="管理员账号：" prop="manageAccount">
                    <el-input v-model.number="addTenant.manageAccount" maxlength="11"></el-input>
                  </el-form-item>
                </li>
              </ul>
            </div>
            <div class="fl" style="padding-left:14px">
              <p>
                <i style="background:#fff"></i>
                <span></span>
              </p>
              <ul>
                <li>
                  <el-form-item label="管理员姓名：" prop="manageName">
                    <el-input v-model.number="addTenant.manageName" class="input160"></el-input>
                  </el-form-item>
                </li>
              </ul>
            </div>
          </div>
          <div class="content_dialog_head clearfix">
            <div class="fl">
              <ul>
                <li class="another_li">
                  <span>启用租户</span>
                  <el-switch v-model="tenantStatus" active-color="#A3ADC8" inactive-color="#5376FF"></el-switch>
                  <span>停用租户</span>
                </li>
              </ul>
            </div>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('addTenant')">创建</el-button>
        <el-button @click="dialogVisible = false;addTenant={};resetForm('addTenant')">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="租户信息" :visible.sync="dialogVisible_" width="642px">
      <div class="content_dialog clearfix">
        <el-form :model="tenantDetail" :rules="rules" ref="tenantDetail" label-width="110px">
          <div class="content_dialog_head clearfix">
            <ul>
              <li class="another_li">
                <i>{{tenantDetail.tenantName}}</i>
                <span>启用租户</span>
                <el-switch
                  v-model="tenantDetail.tenantStatus"
                  active-color="#A3ADC8"
                  inactive-color="#5376FF"
                ></el-switch>
                <span>停用租户</span>
                <div class="role_edit fr" @click="handleEdit" v-if="!editStatus">
                  <el-button>
                    <i class="el-icon-lx-anniubianji"></i>
                    <span>编辑</span>
                  </el-button>
                </div>
                <div class="role_edit fr" v-else>
                  <el-button @click="handleSaveMember_">
                    <i class="el-icon-lx-anniubianji"></i>
                    <span>取消</span>
                  </el-button>
                  <el-button @click="submitForm_('tenantDetail')">
                    <i class="el-icon-lx-anniubianji"></i>
                    <span>保存</span>
                  </el-button>
                </div>
              </li>
              <li class="another_li another_li_">
                <label for class>租户类型：</label>
                <span>{{tenantDetail.codeDescRentLevel}}</span>
                <label for class>客户归属：</label>
                <span>{{tenantDetail.salesPerson}}</span>
                <label for class>创建日期：</label>
                <span>{{tenantDetail.createDate}}</span>
              </li>
            </ul>
          </div>
          <div class="content_dialog_head clearfix">
            <div>
              <p>
                <i></i>
                <span>基础信息：</span>
              </p>
              <ul>
                <li class="fl" style="margin-right:44px;margin-bottom:18px">
                  <label for class="label" style="width:98px">租户全称：</label>
                  <div class="label_input input193" style="margin-left:110px">
                    <span>{{tenantDetail.tenantName}}</span>
                    <!-- <el-input v-else v-model="tenantDetail.tenantName"></el-input> -->
                  </div>
                </li>
                <li class="fl" style="margin-bottom:18px">
                  <label for class="label" style="width:75px">租户简称：</label>
                  <div class="label_input input160" style="margin-left:88px">
                    <span>{{tenantDetail.tenantShortName}}</span>
                    <!-- <el-input v-else v-model="tenantDetail.tenantShortName"></el-input> -->
                  </div>
                </li>
                <li class="fl" style="margin-right:21px">
                  <el-form-item label="类型：" prop="rentLevel_">
                    <div v-if="!editStatus" class="input193">{{tenantDetail.codeDescRentLevel}}</div>
                    <el-select
                      v-model="tenantDetail.codeDescRentLevel"
                      placeholder="请选择类型"
                      class="input193"
                      v-else
                      @change="handleType"
                    >
                      <el-option
                        v-for="item in rentLevels"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </li>
                <li class="fl">
                  <el-form-item label="固定电话：" prop="fixphone">
                    <div v-if="!editStatus" class="input160">{{tenantDetail.fixphone}}</div>
                    <el-input v-model="tenantDetail.fixphone" v-else class="input160"></el-input>
                  </el-form-item>
                </li>
                <li class="fl">
                  <el-form-item label="地址：" prop="detailAddress">
                    <span v-if="!editStatus">{{tenantDetail.detailAddress}}</span>
                    <el-input v-model="tenantDetail.detailAddress" class="input282" v-else></el-input>
                  </el-form-item>
                </li>
              </ul>
            </div>
            <div>
              <p>
                <span>&nbsp;</span>
              </p>
              <ul></ul>
            </div>
          </div>
          <div class="content_dialog_head clearfix" style="padding-top:16px">
            <div class="fl">
              <p>
                <i></i>
                <span>归属信息</span>
              </p>
              <ul>
                <li>
                  <el-form-item label="客户归属：" prop="salesPerson">
                    <span v-if="!editStatus">{{tenantDetail.salesPerson}}</span>
                    <el-input v-model="tenantDetail.salesPerson" v-else></el-input>
                  </el-form-item>
                </li>
              </ul>
            </div>
            <div class="fl" style="padding-left:24px">
              <p>
                <i></i>
                <span>使用信息</span>
              </p>
              <ul>
                <li>
                  <el-form-item label="账号数限制：" prop="maxAccountNum">
                    <span v-if="!editStatus">{{tenantDetail.maxAccountNum}}</span>
                    <el-input v-model.number="tenantDetail.maxAccountNum" v-else class="input160"></el-input>
                  </el-form-item>
                </li>
                <li>
                  <el-form-item label="当前数量：" prop="accountNumNow">
                    <span>{{tenantDetail.accountNumNow}}</span>
                    <!-- <el-input v-model.number="tenantDetail.accountNumNow" v-else class="input160"></el-input> -->
                  </el-form-item>
                </li>
              </ul>
            </div>
          </div>
          <div class="content_dialog_head clearfix" style="padding-top:16px">
            <div class="fl">
              <p>
                <i></i>
                <span>管理员信息</span>
              </p>
              <ul>
                <li>
                  <el-form-item label="管理员账号：" prop="manageAccount_">
                    <span>{{tenantDetail.manageAccount}}</span>
                    <!-- <el-input v-model.number="tenantDetail.manageAccount" maxlength="11" v-else></el-input> -->
                  </el-form-item>
                </li>
              </ul>
            </div>
            <div class="fl" style="padding-left:24px">
              <p>
                <i style="background:#fff;"></i>
                <span></span>
              </p>
              <ul>
                <li>
                  <el-form-item label="管理员姓名：" prop="manageName_">
                    <span>{{tenantDetail.manageName}}</span>
                    <!-- <el-input v-model.number="tenantDetail.manageName" v-else class="input160"></el-input> -->
                  </el-form-item>
                </li>
              </ul>
            </div>
          </div>
        </el-form>
      </div>
    </el-dialog>
    <div class="page" v-if="count-0>=10">
      <!-- <el-pagination
        background
        layout="prev, pager, next"
        :total="count"
        @current-change="handlePage"
        :current-page.sync="currentPage"
      ></el-pagination>-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handlePage"
        :current-page.sync="currentPage"
        :page-sizes="[10, 50, 100, 200]"
        :page-size="pageSize"
        layout="sizes, prev, pager, next"
        :total="count"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  tenantManage,
  saveTenantStatus,
  saveAuthUserStatus,
  tenantAdd,
  tenantDetail,
  tenantEdit,
  authCheck
} from "@/api/api";
export default {
  name: "tenantManage",
  data() {
    let that = this;
    var check_maxAccountNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("不为0的正整数数字"));
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
    var check_fixphone = (rule, value, callback) => {
      var reg = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
      if (reg.test(value)) {
        callback();
      } else {
        return callback(new Error("格式输入不正确"));
      }
      // setTimeout(() => {
      //   if (!Number.isInteger(value)) {
      //     callback(new Error("请输入数字值"));
      //   } else {
      //     // if (value < 18) {
      //     //   callback(new Error('必须年满18岁'));
      //     // } else {
      //     callback();
      //     // }
      //   }
      // }, 1000);
    };
    var check_manageAccount = (rule, value, callback) => {
      var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (reg.test(value)) {
        callback();
      } else {
        return callback(new Error("请输入正确的手机号"));
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
    var check_tenantName = (rule, value, callback) => {
      var reg = /^[\u2E80-\u9FFF]+$/; //Unicode编码中的汉字范围
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入中文"));
      }
    };
    return {
      currentPage: 1,
      rentLevel: "",
      count: 1,
      createDate: "",
      keys: 4000,
      tenantStatus: 7000,
      pageSize: 10,
      addTenant: {
        tenantName: "",
        tenantShortName: "",
        fixphone: "",
        detailAddress: "",
        salesPerson: "",
        maxAccountNum: "",
        manageAccount: "",
        manageName: ""
      },
      rules: {
        tenantName: [
          {
            validator: check_tenantName,
            trigger: "blur",
            required: true,
            message: "请输入租户全称"
          }
        ], //租户全称
        fixphone: [{ validator: check_fixphone, required: true }], //固定电话
        detailAddress: [{ required: true, message: "请输入地址" }], //地址
        salesPerson: [{ required: true, message: "请输入客户归属" }], //客户归属
        manageName: [{ required: true, message: "请输入管理员姓名" }], //管理员姓名
        maxAccountNum: [
          { required: true, validator: check_maxAccountNum, trigger: "blur" }
        ], //账号数限制
        manageAccount: [
          { required: true, validator: check_manageAccount, trigger: "blur" }
        ] //管理员账号
      },
      rentLevel_: "1000",
      tenantDetail: {}, // 租户详情

      value: "",
      value3: "",
      value2: "",
      editStatus: false,
      billType_current: 0,
      dialogVisible: false,
      dialogVisible_: false,
      billType: ["全部", "试用", "普通", "高级"],
      region_current: 0,
      region: ["全部"],
      view_current: 0,
      view: ["租户", "账号"],
      tableData3: [],
      tableData4: [],
      rentLevels: [
        {
          value: "1000",
          label: "试用"
        },
        {
          value: "1001",
          label: "普通"
        },
        {
          value: "1002",
          label: "高级"
        }
      ],
      multipleSelection: [],
      multipleSelection_: []
    };
  },
  methods: {
    tenant_build(value) {
      this.rentLevel_ = "1000";
      this.dialogVisible = true;
      let that = this;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.tenantManage();
    },
    handletenantName() {
      let tenantName = this.addTenant.tenantName;
      var reg = /^[\u2E80-\u9FFF]+$/; //Unicode编码中的汉字范围
      if (reg.test(tenantName)) {
        authCheck({ tenantName: tenantName }).then(res => {
          if (res && res.data && res.data.CODE == "200") {
          } else {
            this.$message.error(res && res.data && res.data.MESSAGE);
          }
        });
      }
    },
    handleClose(done) {
      this.$refs["addTenant"].resetFields();
      //   this.$confirm("确认关闭？")
      //     .then(_ => {
      done();
      //     })
      //     .catch(_ => {});
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogVisible = false;
          this.tenantAdd();
          // alert('submit!');
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    submitForm_(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.handleSaveMember();
          // alert('submit!');
        } else {
          return false;
        }
      });
    },
    handleType(value) {
      if (value == "1000") {
        this.tenantDetail.codeDescRentLevel = "试用";
      } else if (value == "1001") {
        this.tenantDetail.codeDescRentLevel = "普通";
      } else {
        this.tenantDetail.codeDescRentLevel = "高级";
      }
    },
    handleSaveMember() {
      this.editStatus = !this.editStatus;
      this.tenantBuild();
    },
    handleSaveMember_() {
      this.editStatus = !this.editStatus;
    },
    handlePage(value) {
      this.tenantManage(value);
    },
    //租户详情
    handleDetail(id) {
      this.dialogVisible_ = true;
      this.tenantDetail = {};
      this.editStatus = false;
      tenantDetail({ id: id }).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          let tenantDetail = res.data.RESULT;
          if (tenantDetail.tenantStatus == 7000) {
            tenantDetail.tenantStatus = false;
          } else if (tenantDetail.tenantStatus == 7001) {
            tenantDetail.tenantStatus = true;
          }
          tenantDetail.createDate =
            tenantDetail.createDate && tenantDetail.createDate.substr(0, 10);
          this.tenantDetail = tenantDetail;
        }else {
          this.$message.error(res.data.MESSAGE);
        }
      });
    },
    tenantBuild() {
      this.dialogVisible_ = false;
      let tenantDetail = this.tenantDetail;
      if (tenantDetail.codeDescRentLevel == "试用") {
        tenantDetail.rentLevel = 1000;
      } else if (tenantDetail.codeDescRentLevel == "普通") {
        tenantDetail.rentLevel = 1001;
      } else if (tenantDetail.codeDescRentLevel == "高级") {
        tenantDetail.rentLevel = 1002;
      }
      if (tenantDetail.tenantStatus) {
        tenantDetail.tenantStatus = 7001;
      } else {
        tenantDetail.tenantStatus = 7000;
      }
      let param = {};
      param.id = tenantDetail.id;
      param.tenantName = tenantDetail.tenantName;
      param.tenantStatus = tenantDetail.tenantStatus;
      param.rentLevel = tenantDetail.rentLevel;
      param.salesPerson = tenantDetail.salesPerson;
      param.tenantName = tenantDetail.tenantName;
      param.tenantShortName = tenantDetail.tenantShortName;
      param.fixphone = tenantDetail.fixphone;
      param.detailAddress = tenantDetail.detailAddress;
      param.maxAccountNum = tenantDetail.maxAccountNum;
      param.manageAccount = tenantDetail.manageAccount;
      param.manageName = tenantDetail.manageName;
      tenantEdit(param).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          this.$message({
            message: res.data.MESSAGE,
            type: "success"
          });
          this.tenantManage();
        } else {
          this.$message.error(res && res.data && res.data.MESSAGE);
        }
      });
    },
    handleEdit() {
      this.editStatus = !this.editStatus;
    },
    handleDate(value) {
      this.createDate = value;
      this.tenantManage();
    },
    saveTenantStatus(tenantStatus) {
      let param = {
        tenantList: this.multipleSelection,
        tenantStatus: tenantStatus
      };
      saveTenantStatus(param).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          this.$message({
            message: res.data.MESSAGE,
            type: "success"
          });
          this.tenantManage();
        } else {
          this.$message.error(res && res.data && res.data.MESSAGE);
        }
      });
    },

    // 账户启停
    saveAuthUserStatus(tenantStatus) {
      let multipleSelection_ = this.multipleSelection_;
      if (multipleSelection_.length == 0) {
        this.$message.error("请先选择启停项");
        return;
      }
      let param = {
        tenantList: multipleSelection_,
        tenantStatus: tenantStatus
      };
      saveAuthUserStatus(param).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          this.$message({
            message: res.data.MESSAGE,
            type: "success"
          });
          this.tenantManage();
        } else {
          this.$message.error(res && res.data && res.data.MESSAGE);
        }
      });
    },
    tenantAdd() {
      let rentLevel_ = this.rentLevel_;
      if (rentLevel_ == "试用") {
        rentLevel_ = 1000;
      } else if (rentLevel_ == "普通") {
        rentLevel_ = 1001;
      } else if (rentLevel_ == "高级") {
        rentLevel_ = 1002;
      }
      let tenantStatus;
      if (!this.tenantStatus) {
        tenantStatus = 7000;
      } else {
        tenantStatus = 7001;
      }
      let addTenant = this.addTenant;
      addTenant.rentLevel = rentLevel_;
      addTenant.tenantStatus = tenantStatus;
      // 添加租户
      tenantAdd(addTenant).then(res => {
        this.$refs["addTenant"].resetFields();
        if (res && res.data && res.data.CODE == "200") {
          this.$message({
            message: res.data.MESSAGE,
            type: "success"
          });
          this.tenantManage();
        } else {
          this.$message.error(res && res.data && res.data.MESSAGE);
        }
      });
    },
    addClass_billType(index) {
      this.billType_current = index;
      if (this.billType[index] == "试用") {
        this.rentLevel = 1000;
      } else if (this.billType[index] == "普通") {
        this.rentLevel = 1001;
      } else if (this.billType[index] == "高级") {
        this.rentLevel = 1002;
      } else {
        this.rentLevel = "";
      }
      this.tenantManage();
    },
    handleRegion(index) {
      this.region_current = index;
      this.tenantManage();
    },
    handleView(index) {
      this.view_current = index;
      if (this.view[index] == "租户") {
        this.keys = 4000;
      } else {
        this.keys = 4001;
      }
      this.tenantManage();
    },
    handleSelectionChange(val) {
      let multipleSelection = [];

      val &&
        val.map(function(v, i) {
          multipleSelection.push({ id: v.id });
        });
      this.multipleSelection = multipleSelection;
    },
    handleSelectionChange_(val) {
      let multipleSelection_ = [];
      val &&
        val.map(function(v, i) {
          multipleSelection_.push({ id: v.id });
        });
      this.multipleSelection_ = multipleSelection_;
    },
    tenantManage(pageNo) {
      if (!pageNo) {
        this.currentPage = 1;
      }
      let pageSize = this.pageSize;
      tenantManage({
        rentLevel: this.rentLevel,
        startTime: this.createDate,
        keys: this.keys,
        pageNo: pageNo || 1,
        pageSize: pageSize || 10
      }).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          if (this.view_current == 0) {
            this.tableData3 = res.data.RESULT.list;
            this.count = res.data.RESULT.count;
          } else {
            this.tableData4 = res.data.RESULT.list;
            this.count = res.data.RESULT.count;
          }
        }
      });
    }
  },
  created() {
    this.tenantManage();
  }
};
</script>

<style scoped>
.content_dialog {
  /* padding-left: 8px; */
}
.tenantManage {
  font-size: 14px;
  padding: 21px 32px 0 32px;
}
.tenantManage .nav {
  color: #596689;
}
.tenantManage .nav > div {
  float: left;
  margin-right: 175px;
}
.tenantManage .nav .tab {
  line-height: 30px;
  height: 30px;
}
.tenantManage .nav > div .tab {
  margin-bottom: 24px;
}
.tenantManage .nav > div .tab > div:nth-child(1) {
  font-weight: 600;
  width: 78px;
}
.tenantManage .nav ul li {
  float: left;
  padding: 0 12px;
  margin-left: 8px;
  cursor: pointer;
}
.tenantManage .nav ul li:nth-child(1) {
  margin-left: 0;
}
.tenantManage .nav ul li.ischeck {
  background: rgba(229, 237, 255, 1);
  border-radius: 2px;
  color: #5376ff;
}
.tenantManage .banner {
  margin-bottom: 24px;
}

.tenantManage .banner li {
  float: left;
  margin-right: 5px;
  text-align: center;
  width: 78px;
  height: 32px;
  line-height: 32px;
  background: rgba(83, 118, 255, 1);
  border-radius: 2px;
}
.tenantManage .banner li button {
  width: 100%;
  color: #fff;
}
.tenantManage .banner li a {
  display: block;
  width: 100%;
  height: 100%;
  color: #fff;
}
.tenantManage .banner li span {
  margin-left: 5px;
}
.tenantManage .content {
  min-height: 440px;
}
.tenantManage .page {
  margin-top: 24px;
  text-align: right;
}

.content_dialog_head > div.fl {
  width: 50%;
}
.content_dialog_head > div li {
  /* margin-bottom: 6px; */
}
.content_dialog_head > div p {
  margin-bottom: 16px;
}
.content_dialog_head > div p i {
  display: inline-block;
  width: 2px;
  height: 14px;
  background: rgba(83, 118, 255, 1);
  border-radius: 1px;
  vertical-align: middle;
  margin-right: 8px;
}
.content_dialog_head > div p span {
  font-weight: 600;
  vertical-align: middle;
  color: rgba(83, 118, 255, 1);
}
.content_dialog_head .label {
  text-align: right;
  float: left;
  width: 85px;
  line-height: 32px;
  margin-right: 8px;
  /* color: rgba(163, 173, 200, 1); */
}

.content_dialog_head .label_input {
  margin-left: 93px;
  line-height: 32px;
}

.content_dialog_head .input193 {
  width: 193px;
}

.content_dialog_head .input160 {
  width: 160px;
}
.content_dialog_head .input282 {
  width: 282px;
}

.content_dialog_head .select94 {
  width: 94px;
  margin-right: 9px;
}

.el-dialog {
  width: 642px !important;
}
.dialog-footer button {
  width: 95px;
  height: 40px;
  background: rgba(83, 118, 255, 1);
}
.dialog-footer button:nth-child(2) {
  background: #fff;
}
.el-switch {
  height: 26px;
  margin: 0 44px;
}
.another_li .el-switch {
  margin: 0 44px;
}
.content_dialog_head .another_li {
  margin-left: 10px;
  margin-bottom: 0px;
}
.content_dialog_head .another_li button {
  width: 78px;
  height: 32px;
  background: rgba(83, 118, 255, 1);
  float: right;
  color: #fff;
  margin-right: 12px;
}
.another_li > i {
  font-size: 16px;
  margin-right: 32px;
}
.another_li span:nth-child(3) {
  color: #596689;
}
.content_dialog_head .another_li_ {
  margin: 24px 0 16px 10px;
}
.another_li_ label {
  /* color: rgba(163, 173, 200, 1); */
  width: 84px;
}
.another_li_ span {
  display: inline-block;
}
.another_li_ span:nth-child(2) {
  width: 120px;
}
.another_li_ span:nth-child(4) {
  width: 171px;
}
</style>
