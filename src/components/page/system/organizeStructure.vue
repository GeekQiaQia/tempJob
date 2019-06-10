<template>
  <div class="organizeStructure">
    <div class="custom-tree-container">
      <div>
        <span>{{data5_name}}</span>
        <!-- <span><i class="el-icon-lx-anniubianji"></i></span> -->
        <span v-if="organizeStatus">
          <i class="el-icon-success" style="color:#5376FF;cursor:pointer" @click="handleSave"></i>
          <i class="el-icon-error" style="color:#A3ADC8;cursor:pointer" @click="handleCancel"></i>
        </span>
        <span v-else>
          <i
            class="el-icon-lx-anniubianji"
            style="color:#5376FF;cursor:pointer"
            @click="handleSave_"
          ></i>
        </span>
      </div>
      <el-tree
        :props="defaultProps"
        :data="data5"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span v-if="organizeStatus">
            <el-button type="text" size="mini" @click="() => append(data)">新建子部门</el-button>
            <el-button
              type="text"
              size="mini"
              class="del"
              v-if="node.label=='全公司'"
              style="width:26px"
            ></el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)"
              class="del"
              v-else
            >删除</el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <div class="organizeStructure_right">
      <div class="banner">
        <ul>
          <li>
            <el-button type="text" @click="autherAdd">
              <span>添加员工</span>
            </el-button>
          </li>
          <li>
            <el-button type="text" @click="saveAuthUserStatus(9000)">
              <span>启用</span>
            </el-button>
          </li>
          <li>
            <el-button type="text" @click="saveAuthUserStatus(9001)">
              <span>停用</span>
            </el-button>
          </li>
          <!-- <li>
            <router-link to="/warehousingReview">
              <i class="el-icon-lx-daochu"></i>
              <span>导出</span>
            </router-link>
          </li>-->
        </ul>
      </div>
      <div>
        <el-table
          :data="tableData"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange_"
        >
          <el-table-column type="selection" min-width="40"></el-table-column>
          <el-table-column
            label="日期"
            v-for="(v,i) in columns"
            :prop="v.field"
            :label="v.title"
            :min-width="v.width"
          >
            <template slot-scope="scope">
              <span v-if="(v.field !='mobile' && v.field !='createDate')">{{scope.row[v.field]}}</span>
              <span
                v-else-if="v.field =='createDate'"
              >{{scope.row[v.field] && scope.row[v.field].substr(0,10)}}</span>
              <span
                v-else
                @click="handleDetail(scope.row.id)"
                style="cursor:pointer"
              >{{scope.row[v.field]}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="添加员工" :visible.sync="dialogVisible" width="642px" :before-close="handleClose">
      <div class="content_dialog clearfix">
        <el-form :model="newEmployee" :rules="rules" ref="newEmployee" label-width="100px">
          <div class="content_dialog_head clearfix">
            <div class="fl">
              <p>
                <i></i>
                <span>账号信息：</span>
              </p>
              <ul class="clearfix">
                <li class="clearfix">
                  <!-- <label for class="label">登录手机：</label>
                    <div class="label_input">
                      <el-input v-model="newEmployee.mobile" maxlength="13"></el-input>
                  </div>-->
                  <el-form-item label="登录手机：" prop="mobile">
                    <el-input v-model.number="newEmployee.mobile" maxlength="11"></el-input>
                  </el-form-item>
                </li>
                <li class="clearfix">
                  <el-form-item label="姓名：" prop="nickname">
                    <el-input v-model.number="newEmployee.nickname" class="input160"></el-input>
                  </el-form-item>
                </li>
                <li class="clearfix">
                  <el-form-item label="角色：" prop="roleId">
                    <el-select v-model="newEmployee.roleId" class="input193">
                      <el-option
                        v-for="item in authorSearch__"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </li>
              </ul>
            </div>
            <div class="fl">
              <p>
                <i></i>
                <span>部门信息</span>
              </p>
              <ul>
                <li>
                  <el-form-item label="所属部门：" prop="departmentId">
                    <el-select
                      v-model="newEmployee.departmentId"
                      placeholder="请选择"
                      @change="handleDepartment"
                    >
                      <el-option
                        v-for="item in ownDepartment"
                        :key="item.id"
                        :label="item.departmentName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </li>
                <li>
                  <el-form-item label="职位：" prop="add_leaderUserName">
                    <el-select v-model="add_leaderUserName" @change="handlePosition">
                      <el-option
                        v-for="item in members"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </li>
                <li>
                  <el-form-item label="岗位：" prop="jobType">
                    <el-select v-model="add_jobType">
                      <el-option
                        v-for="item in [{label:'业务岗',value:'业务岗'},{label:'复核岗',value:'复核岗'},{label:'审批岗',value:'审批岗'},{label:'终审岗',value:'终审岗'}]"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </li>
              </ul>
            </div>
          </div>
          <div class="content_dialog_head clearfix">
            <div class="fl">
              <p>
                <i></i>
                <span>个人信息</span>
              </p>
              <ul>
                <li>
                  <!-- <label for class="label">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：</label>
                  <div class="label_input">
                  </div>-->
                  <el-form-item label="性别：" prop="sexCode">
                    <el-select v-model="add_sexCode" @change="handleSex">
                      <el-option
                        v-for="item in [{label:'男',value:'男'},{label:'女',value:'女'}]"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </li>
                <li>
                  <!-- <label for class="label">生&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日：</label>
                  <div class="label_input">
                  </div>-->
                  <el-form-item label="生日：" prop="birthday">
                    <el-date-picker
                      v-model="newEmployee.birthday"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyyMMdd"
                    ></el-date-picker>
                  </el-form-item>
                </li>
              </ul>
            </div>
            <div class="fl">
              <p>
                <span>&nbsp;</span>
              </p>
              <ul>
                <li>
                  <!-- <label for class="label">邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱：</label>
                    <div class="label_input">
                  </div>-->
                  <el-form-item label="邮箱：" prop="email">
                    <el-input v-model="newEmployee.email"></el-input>
                  </el-form-item>
                </li>
                <li>
                  <!-- <label for class="label">QQ：</label>
                  <div class="label_input">
                    <el-input v-model="newEmployee.qq"></el-input>
                  </div>-->
                  <el-form-item label="QQ：" prop="qq">
                    <el-input v-model="newEmployee.qq"></el-input>
                  </el-form-item>
                </li>
              </ul>
            </div>
          </div>
          <div class="content_dialog_head clearfix">
            <div class="fl">
              <ul>
                <li class="another_li">
                  <span>启用账号</span>
                  <el-switch
                    v-model="userStatus"
                    active-color="#A3ADC8"
                    inactive-color="#5376FF"
                    @change="handleAccount"
                  ></el-switch>
                  <span>停用账号</span>
                </li>
              </ul>
            </div>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('newEmployee')">创建</el-button>
        <el-button @click="dialogVisible = false;resetForm('newEmployee')">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="员工信息" :visible.sync="dialogVisible_" width="642px">
      <div class="content_dialog clearfix">
        <el-form :model="memberDetail" :rules="rules" ref="memberDetail" label-width="110px">
          <div class="content_dialog_head clearfix">
            <ul>
              <li class="another_li">
                <i>{{memberDetail.mobile}}</i>
                <span>启用账号</span>
                <el-switch
                  v-model="memberDetail.userStatus==9000 ? false : true"
                  active-color="#A3ADC8"
                  inactive-color="#5376FF"
                  @change="handleSwitch"
                ></el-switch>
                <span>停用账号</span>
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
                  <el-button @click="submitForm_('memberDetail')">
                    <i class="el-icon-lx-anniubianji"></i>
                    <span>保存</span>
                  </el-button>
                </div>
              </li>
              <li class="another_li another_li_">
                <label for class>部门负责人：</label>
                <span>{{memberDetail.leaderUserId ? memberDetail.leadUserName:'无'}}</span>
                <label for class>创建日期：</label>
                <span>{{memberDetail.createDate && memberDetail.createDate.substr(0,10)}}</span>
              </li>
            </ul>
          </div>
          <div class="content_dialog_head clearfix">
            <div class="fl">
              <p>
                <i></i>
                <span>账号信息：</span>
              </p>
              <ul class="clearfix">
                <li class="clearfix">
                  <el-form-item label="登录手机：" prop="mobile">
                    <span v-if="!editStatus">{{memberDetail.mobile}}</span>
                    <el-input v-else v-model.number="memberDetail.mobile" maxlength="11"></el-input>
                  </el-form-item>
                </li>
                <li class="clearfix">
                  <el-form-item label="姓名：" prop="nickname">
                    <span v-if="!editStatus">{{memberDetail.nickname}}</span>
                    <el-input v-else v-model="memberDetail.nickname"></el-input>
                  </el-form-item>
                </li>
                <li class="clearfix">
                  <el-form-item label="角色：" prop="roleId">
                    <span
                      v-if="!editStatus || memberDetail.roleName=='超级管理员'"
                    >{{memberDetail.roleName}}</span>
                    <el-select
                      v-model="memberDetail.roleId"
                      placeholder="请选择"
                      @change="handleRole"
                      v-else
                    >
                      <el-option
                        v-for="item in authorSearch__"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </li>
              </ul>
            </div>
            <div class="fl">
              <p>
                <i></i>
                <span>部门信息</span>
              </p>
              <ul>
                <li class="clearfix">
                  <el-form-item label="所属部门：" prop="departmentName">
                    <span v-if="!editStatus">{{memberDetail.departmentName}}</span>
                    <el-select
                      v-model="memberDetail.departmentName"
                      placeholder="请选择"
                      @change="handleDepartment_"
                      v-else
                    >
                      <el-option
                        v-for="item in ownDepartment"
                        :key="item.id"
                        :label="item.departmentName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </li>
                <li class="clearfix">
                  <el-form-item label="职位：" prop="leaderUserName">
                    <span v-if="!editStatus">{{memberDetail.leaderUserName}}</span>
                    <el-select v-model="memberDetail.leaderUserName" placeholder="请选择" v-else>
                      <el-option
                        v-for="item in members"
                        :key="item.label"
                        :label="item.label"
                        :value="item.label"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </li>
                <li class="clearfix">
                  <el-form-item label="岗位：" prop="jobType_">
                    <span
                      v-if="!editStatus"
                    >{{memberDetail.jobType && (memberDetail.jobType==1100 ? '复核岗':(memberDetail.jobType==1101 ? '审批岗' :(memberDetail.jobType==1103 ? '业务岗' :'终审岗')))}}</span>
                    <el-select
                      v-model="memberDetail.jobType"
                      placeholder="请选择"
                      @change="handleFlowPost_"
                      v-else
                    >
                      <el-option
                        v-for="item in [{label:'业务岗',value:1103},{label:'复核岗',value:1100},{label:'审批岗',value:1101},{label:'终审岗',value:1102}]"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </li>
              </ul>
            </div>
          </div>
          <div class="content_dialog_head clearfix">
            <div class="fl">
              <p>
                <i></i>
                <span>个人信息</span>
              </p>
              <ul>
                <li class="clearfix">
                  <el-form-item label="性别：" prop="sexCode">
                    <span v-if="!editStatus">{{memberDetail.sexCode==3000 ? '女':'男'}}</span>
                    <el-select
                      v-model="memberDetail.sexCode"
                      placeholder="请选择"
                      v-else
                      @change="handleSex_"
                    >
                      <el-option
                        v-for="item in [{label:'男',value:3001},{label:'女',value:3000}]"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </li>
                <li class="clearfix">
                  <el-form-item label="生日：" prop="birthday">
                    <span
                      v-if="!editStatus"
                    >{{memberDetail.birthday ? ((memberDetail.birthday).substr(0,4)+'-'+(memberDetail.birthday).substr(4,2)+'-'+(memberDetail.birthday).substr(6,2)) : ''}}</span>
                    <el-date-picker
                      v-model="memberDetail.birthday"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyyMMdd"
                      @change="handleDate_"
                      v-else
                    ></el-date-picker>
                  </el-form-item>
                </li>
              </ul>
            </div>
            <div class="fl">
              <p>
                <span>&nbsp;</span>
              </p>
              <ul>
                <li class="clearfix">
                  <el-form-item label="邮箱：" prop="email">
                    <span v-if="!editStatus">{{memberDetail.email}}</span>
                    <el-input v-else v-model="memberDetail.email"></el-input>
                  </el-form-item>
                </li>
                <li class="clearfix">
                  <el-form-item label="QQ：" prop="qq">
                    <span v-if="!editStatus">{{memberDetail.qq}}</span>
                    <el-input v-else v-model="memberDetail.qq"></el-input>
                  </el-form-item>
                </li>
              </ul>
            </div>
          </div>
        </el-form>
      </div>
    </el-dialog>
    <div class="page" v-if="count-0>=10">
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
let id = 1000;
import {
  organizeTree,
  userSearch,
  saveTree,
  listDepartmentBox,
  authorSearch,
  authAdds,
  userDetail,
  changeUser,
  saveAuthUserStatus
} from "@/api/api";
export default {
  name: "organizeStructure",
  data() {
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
    var check_mobile = (rule, value, callback) => {
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
    var checkedEmail = (rule, value, callback) => {
      var reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("邮箱输入不正确"));
      }
    };
    return {
      rules: {
        mobile: [{ required: true, validator: check_mobile, trigger: "blur" }], //登录手机
        email: [{ required: true, validator: checkedEmail, trigger: "blur" }], // 邮箱
        nickname: [{ required: true, message: "请输入姓名" }], //姓名
        roleId: [{ required: true, message: "请输入角色", trigger: "change" }], //角色
        departmentId: [{ required: true, message: "请输入部门" }], //所属部门
        departmentName: [{ required: true, message: "请输入部门" }] //所属部门
      },
      pageSize: 10,
      currentPage: 1,
      memberDetail: {},
      seletctedRole: "",
      authorSearch__: [],
      department: "",
      ownDepartment: [],
      editStatus: false,
      organizeStatus: false,
      data5: [],
      defaultProps: {
        children: "childrenDeptList",
        label: "departmentName"
      },
      count: 0,
      tableData: [],
      columns: [
        { field: "mobile", title: "登录手机", width: 160 },
        { field: "nickname", title: "姓名", width: 140 },
        { field: "departmentName", title: "所属部门", width: 120 },
        { field: "roleName", title: "角色", width: 120 },
        { field: "codeDescUserStatus", title: "状态", width: 120 },
        { field: "createByName", title: "创建人", width: 120 },
        { field: "createDate", title: "创建时间", width: 120 }
      ],
      dialogVisible: false,
      dialogVisible_: false,
      formLabelAlign: {
        user: "",
        region: "",
        type: ""
      },
      value: "",
      value1: true,
      value2: true,
      members: [],
      userStatus: false,
      userStatus_: 9000,
      jobType_: "",
      data5_name: "",
      add_leaderUserName: "员工",
      add_sexCode: "男",
      add_jobType: "业务岗",
      arr_ids: [],
      str_ids: "",
      newEmployee: {
        mobile: "",
        departmentId: "",
        nickname: "",
        sexCode: 3000,
        birthday: "",
        email: "",
        qq: "",
        jobType: "1103",
        roleId: ""
      },
      multipleSelection: [],
      data5_temp:[],
    };
  },
  mounted() {},
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.userSearch();
    },
    handleSwitch(value) {
      if (!value) {
        this.memberDetail.userStatus = 9000;
      } else {
        this.memberDetail.userStatus = 9001;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.handleBuild();
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

    handleDate_(value) {
      this.memberDetail.birthday = value;
    },
    handleRole(value) {
      let authorSearch__ = this.authorSearch__;
      let memberDetail = this.memberDetail;
      authorSearch__ &&
        authorSearch__.map(function(v, i) {
          if (value == v.id) {
            memberDetail.roleName = v.roleName;
            memberDetail.roleId = v.id;
          }
        });
      this.memberDetail = memberDetail;
    },
    // 信息 岗位选择
    handleFlowPost_(value) {
      this.memberDetail.jobType = value;
    },

    // 信息 性别选中
    handleSex_(value) {
      this.memberDetail.sexCode = value;
    },
    // 信息 选中效果
    handleSelectionChange_(val) {
      let multipleSelection = [];
      val &&
        val.map(function(v, i) {
          multipleSelection.push({ id: v.id });
        });
      this.multipleSelection = multipleSelection;
    },
    // 账户启停
    saveAuthUserStatus(tenantStatus) {
      let param = {
        authUserList: this.multipleSelection,
        userStatus: tenantStatus
      };
      saveAuthUserStatus(param).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          this.$message({
            message: res.data.MESSAGE,
            type: "success"
          });
          this.userSearch();
        } else {
          this.$message.error(res && res.data && res.data.MESSAGE);
        }
      });
    },
    authorSearch_() {
      let that = this;
      authorSearch({ roleStatus: 6001 }).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          that.authorSearch__ = res.data.RESULT.list;
        } else {
          that.$message.error(res.data.MESSAGE);
        }
      });
    },
    //员工详情
    handleDetail(id) {
      this.dialogVisible_ = true;
      this.editStatus = false;
      let memberDetail = {};
      let that = this;
      userDetail({ id: id }).then(res => {
        that.$refs["memberDetail"].resetFields();
        memberDetail = res.data.RESULT;
        memberDetail.birthday = memberDetail.birthday
          ? memberDetail.birthday + ""
          : "";
        this.memberDetail = memberDetail;
        this.jobType_ = res.data.RESULT.jobType;
        if (memberDetail.leaderUserId) {
          if (memberDetail.leaderUserName == "员工") {
            this.members = [{ label: "员工", value: "员工" }];
          } else if (memberDetail.leaderUserName == "部门负责人") {
            this.members = [
              { label: "员工", value: "员工" },
              { label: "部门负责人", value: "部门负责人" }
            ];
          }
        } else {
          this.members = [
            { label: "员工", value: "员工" },
            { label: "部门负责人", value: "部门负责人" }
          ];
        }
      });
      this.listDepartmentBox();
      this.authorSearch_();
    },
    // 页数
    handlePage(value) {
      this.userSearch(value);
    },
    // 添加员工启用/停用账号
    handleAccount(value) {
      this.userStatus = value;
    },
    // 员工信息保存
    handleSaveMember() {
      this.editStatus = !this.editStatus;
      //       mobile	登陆手机
      // departmentId	所属部门id
      // nickname	姓名
      // leaderUserName	职位
      // roleId	角色id
      // jobType	1100:复核岗/1101:审批岗/1102:终审岗
      // sexCode	性别
      // email	邮箱
      // birthday	生日
      // qq	QQ
      let param = {};
      let memberDetail = this.memberDetail;
      param.id = memberDetail.id;
      param.mobile = memberDetail.mobile;
      param.departmentId = memberDetail.departmentId;
      param.nickname = memberDetail.nickname;
      param.leaderUserName = memberDetail.leaderUserName;
      param.roleId = memberDetail.roleId;
      param.jobType = memberDetail.jobType;
      param.sexCode = memberDetail.sexCode;
      param.email = memberDetail.email;
      param.birthday = memberDetail.birthday;
      param.qq = memberDetail.qq;
      param.jobType = memberDetail.jobType;
      param.userStatus = memberDetail.userStatus;
      changeUser(param).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          this.dialogVisible_ = false;
          this.userSearch();
          this.$message({
            message: res.data.MESSAGE,
            type: "success"
          });
        } else {
          this.$message.error(res && res.data && res.data.MESSAGE);
        }
      });
    },
    // 员工信息取消
    handleSaveMember_() {
      this.editStatus = !this.editStatus;
    },
    // 新建员工（创建）
    handleBuild() {
      // mobile	登陆手机	必传
      // departmentId	所属部门id	必传
      // nickname	姓名	必传
      // leaderUserName	职位	必传
      // roleId	角色id	必传
      // jobType	1100:复核岗/1101:审批岗/1102:终审岗	可为空
      // sexCode	性别	必传
      // email	邮箱	必传
      // birthday	生日	必传
      // qq	QQ	必传
      // 添加员工创建
      let userStatus_;
      let add_sexCode;
      let add_jobType = this.add_jobType;
      if (this.userStatus == false) {
        userStatus_ = 9000;
      } else {
        userStatus_ = 9001;
      }
      if (this.add_sexCode == "男") {
        add_sexCode = 3000;
      } else {
        add_sexCode = 3001;
      }
      if (add_jobType == "业务岗") {
        add_jobType = 1103;
      } else if (add_jobType == "复核岗") {
        add_jobType = 1100;
      } else if (add_jobType == "审批岗") {
        add_jobType = 1101;
      } else {
        add_jobType = 1102;
      }
      let newEmployee = this.newEmployee;
      newEmployee.userStatus = userStatus_;
      newEmployee.sexCode = add_sexCode;
      newEmployee.jobType = add_jobType;
      newEmployee.leaderUserName = this.add_leaderUserName;
      authAdds(newEmployee).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          this.$message({
            message: res.data.MESSAGE,
            type: "success"
          });
          this.dialogVisible = false;
          this.$refs["newEmployee"].resetFields();
          this.userSearch();
        } else {
          this.$message.error(res && res.data && res.data.MESSAGE);
        }
      });
    },
    // 性别
    handleSex(value) {
      this.add_sexCode = value;
    },
    // 添加所属部门
    handleDepartment(value) {
      this.newEmployee.departmentId = value;
      this.add_leaderUserName = "员工";
      let ownDepartment = this.ownDepartment;
      let leaderUserId;
      ownDepartment &&
        ownDepartment.map(function(v, i) {
          if (value == v.id) {
            leaderUserId = v.leaderUserId;
          }
        });
      if (leaderUserId) {
        this.members = [{ label: "员工", value: "员工" }];
      } else {
        this.members = [
          { label: "员工", value: "员工" },
          { label: "部门负责人", value: "部门负责人" }
        ];
      }
    },
    handlePosition(value) {
      this.add_leaderUserName = value;
    },
    // 详情所属部门
    handleDepartment_(value) {
      let ownDepartment = this.ownDepartment;
      let memberDetail = JSON.parse(JSON.stringify(this.memberDetail));
      let leaderUserId;
      ownDepartment &&
        ownDepartment.map(function(v, i) {
          if (value == v.id) {
            leaderUserId = v.leaderUserId;
            memberDetail.departmentName = v.departmentName;
            memberDetail.departmentId = v.id;
          }
        });
      this.memberDetail = memberDetail;
      if (leaderUserId) {
        this.members = [{ label: "员工" }];
      } else {
        this.members = [{ label: "员工" }, { label: "部门负责人" }];
      }
    },
    // 部门查询
    listDepartmentBox() {
      listDepartmentBox({}).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          this.ownDepartment = res.data.RESULT;
        } else {
          this.$message.error(res && res.data && res.data.MESSAGE);
        }
      });
    },

    // 添加员工
    autherAdd() {
      this.dialogVisible = true;
      this.newEmployee = {
        mobile: "",
        departmentId: "",
        nickname: "",
        sexCode: 3000,
        birthday: "",
        email: "",
        qq: "",
        jobType: "1103",
        roleId: ""
      };
      (this.add_leaderUserName = "员工"),
        (this.add_sexCode = "男"),
        (this.add_jobType = "业务岗"),
        this.listDepartmentBox();
      this.authorSearch_();
    },
    handleSave_() {
      this.organizeStatus = true;
    },
    saveTree(param, callback) {
      let that = this;
      saveTree(param).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          this.$message({
            message: res.data.MESSAGE,
            type: "success"
          });
          callback && callback();
        } else {
          this.$message.error(res && res.data && res.data.MESSAGE);
        }
      });
    },
    handleSave() {
      let that = this;
      this.organizeStatus = false;
      this.arr_ids;
      if (this.arr_ids.length == 0) {
        this.saveTree({ childrenDeptList: that.data5 }, ()=> {
          this.arr_ids = [];
          this.str_ids = "";
          this.organizeTree();
        });
      } else {
        this.saveTree(
          { childrenDeptList: that.data5, deleteDepartmentList: this.arr_ids },
          ()=>  {
            this.arr_ids = [];
            this.str_ids = "";
            this.organizeTree();
          }
        );
      }
    },
    handleCancel() {
      this.organizeStatus = false;
      this.data5=this.data5_temp
    },
    userSearch(value) {
      let pageSize = this.pageSize;
      userSearch({ pageNo: value || 1, pageSize: pageSize }).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          this.tableData = res.data.RESULT.list;
          this.count = res.data.RESULT.count;
        }
      });
    },
    handleEdit() {
      this.editStatus = !this.editStatus;
    },
    handleClose(done) {
      this.$refs["newEmployee"].resetFields();
      done();
    },
    append(data_) {
      let that = this;
      this.$prompt("请输入部门名称", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          let str = value.replace(/\s*/g,"")
          if(!str){
             that.$message({
              type: "info",
              message: "部门名称不能为空"
            });
            return
          }
          const newChild = {
            departmentName: value,
            childrenDeptList: []
          };
          if (!data_.childrenDeptList) {
            that.$set(data_, "childrenDeptList", []);
          }
          data_.childrenDeptList.push(newChild);
          that.data5;
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    remove(node, data) {
      const parent = node.parent;
      const childrenDeptList = parent.data.childrenDeptList || parent.data;
      const index = childrenDeptList.findIndex(d => d.id === data.id);
      let obj = childrenDeptList[index];
      let arr_ids = JSON.parse(JSON.stringify(this.arr_ids));
      let str_ids = JSON.parse(JSON.stringify(this.str_ids));
      for (var item in obj) {
        if (item == "id" && str_ids.indexOf(obj["id"]) == -1) {
          str_ids += obj["id"] + ",";
          arr_ids.push({ id: obj["id"] });
        }
        obj.childrenDeptList &&
          obj.childrenDeptList.map(function(v, i) {
            if (v.id && str_ids.indexOf(v.id) == -1) {
              str_ids += v.id + ",";
              arr_ids.push({ id: v.id });
            }
            v.childrenDeptList &&
              v.childrenDeptList.map(function(val, i) {
                if (val.id && str_ids.indexOf(val.id) == -1) {
                  str_ids += val.id + ",";
                  arr_ids.push({ id: val.id });
                }
                val.childrenDeptList &&
                  val.childrenDeptList.map(function(vall, i) {
                    // if(vall.id)arr_ids.push({id:vall.id})
                    if (vall.id && str_ids.indexOf(vall.id) == -1) {
                      str_ids += vall.id + ",";
                      arr_ids.push({ id: vall.id });
                    }
                    vall.childrenDeptList &&
                      vall.childrenDeptList.map(function(valll, i) {
                        // if(valll.id)arr_ids.push({id:valll.id})
                        if (valll.id && str_ids.indexOf(valll.id) == -1) {
                          str_ids += valll.id + ",";
                          arr_ids.push({ id: valll.id });
                        }
                      });
                  });
              });
          });
      }
      this.arr_ids = arr_ids;
      this.str_ids = str_ids;
      // childrenDeptList.splice(index, 1);
      childrenDeptList.splice(index, 1);
      // this.saveTree({ childrenDeptList: this.data5,'deleteDepartmentList':this.arr_ids  })
    },
    organizeTree() {
      organizeTree({ reqType: 1 }).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          let data5;
          if (res.data.RESULT.length == 0) {
            // data5 = [{ departmentName: "新建" }, { departmentName: "新建1" }];
          } else {
            data5 = res.data.RESULT.departmentList;
          }
          this.data5 = JSON.parse(JSON.stringify(data5));
          this.data5_temp=JSON.parse(JSON.stringify(data5));
          this.data5_name = res.data.RESULT.tenantName;
        }
      });
    }
  },
  created() {
    this.organizeTree();
    this.userSearch();
  }
};
</script>

<style scoped>
.page {
  margin-top: 24px;
  text-align: right;
}
.custom-tree-container {
  float: left;
  width: 320px;
}
.custom-tree-container > div {
  margin-bottom: 28px;
}
.custom-tree-container > div i {
  margin-left: 9px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.organizeStructure {
  padding: 23px 40px 23px 27px;
}
.organizeStructure_right {
  margin-left: 345px;
}

.banner {
  margin-bottom: 15px;
}
.banner ul {
  height: 32px;
}
.banner li {
  float: left;
  margin-right: 5px;
  text-align: center;
  width: 78px;
  height: 32px;
  line-height: 32px;
  background: rgba(83, 118, 255, 1);
  border-radius: 2px;
}
.banner li > button {
  width: 100%;
  color: #fff;
}
.banner li a {
  display: block;
  width: 100%;
  height: 100%;
  color: #fff;
}
.banner li span {
  margin-left: 5px;
}
.del {
  color: #fa5555;
}

.content_dialog_head > div {
  width: 50%;
}
.content_dialog_head > div li {
  margin-bottom: 16px;
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
  width: 80px;
  line-height: 32px;
  margin-right: 8px;
  color: rgba(163, 173, 200, 1);
}

.content_dialog_head .label_input {
  margin-left: 88px;
  line-height: 32px;
}
.el-dialog {
  width: 642px !important;
}
.dialog-footer button {
  width: 95px;
  height: 40px;
}
.dialog-footer button:nth-child(1) {
  background: rgba(83, 118, 255, 1);
}
.el-switch {
  height: 26px;
  margin: 0 20px;
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
  margin-right: 22px;
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
  color: rgba(163, 173, 200, 1);
  width: 84px;
}
.another_li_ label:nth-child(3) {
  margin-left: 84px;
}
</style>
