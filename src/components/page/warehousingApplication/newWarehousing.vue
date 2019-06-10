<template>
    <div class="newWarehousing">
    <el-form :model="billInStockFlow"  ref="billInStockFlow" label-width="110px" :rules="rules">
      <header class="clearfix">
        <ul class="fl">
          <el-form-item label="入库方式：" prop="inStockType">
            <el-select v-model="billInStockFlow.inStockType" placeholder="请选择" class="input193">
              <el-option
                v-for="item in [{label:'买入',value:'21001'},{label:'签票',value:'21002'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="转让企业：" prop="receiveCompany">
            <el-input v-model="billInStockFlow.receiveCompany" class="input348" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="开 户 行：" prop="openAccountBank">
            <el-input v-model="billInStockFlow.openAccountBank" class="input348"></el-input>
          </el-form-item>
          <div class="clearfix" style="min-width:462px;">
              <el-form-item label="联 系 人：" prop="contactPerson"  class="fl">
                <el-input v-model="billInStockFlow.contactPerson" class="input106" placeholder="请输入姓名" maxlength="10"></el-input>
              </el-form-item>
                <el-form-item prop="contactPhone" class="fl library">
                <el-input v-model.number="billInStockFlow.contactPhone" style="width:116px" placeholder="请输入电话" maxlength="11" class="input106"></el-input>
              </el-form-item>
              <el-form-item prop="postName"  class="fl library">
                <el-input v-model="billInStockFlow.postName" style="width:111px" placeholder="请输入职务" maxlength="10"></el-input>
              </el-form-item>
          </div>
        
          <el-form-item label="备   注：" prop="remark">
            <el-input v-model="billInStockFlow.remark" class="input348" maxlength="100"></el-input>
          </el-form-item>
        </ul>
        <ul class="fl">
          <el-form-item label="打款方式：" prop="payType">
            <el-radio v-model="billInStockFlow.payType" label="40001">先背</el-radio>
            <el-radio v-model="billInStockFlow.payType" label="40002">先打</el-radio>
          </el-form-item>
          <el-form-item label="账 号：" prop="accountNo">
            <el-input
              v-model="billInStockFlow.accountNo"
              class="input348"
              placeholder="请输入账号"
            ></el-input>
          </el-form-item>
          <el-form-item label="大额行号：" prop="bigLineNo">
            <el-input v-model="billInStockFlow.bigLineNo" class="input348"></el-input>
          </el-form-item>
          <el-form-item label="申 请 人：" prop="applyUserName">
            <el-input v-model="department_nickName.nickname" class="input106" disabled placeholder="请输入姓名"></el-input>
            <el-input v-model="department_nickName.departmentName" class="input106" disabled placeholder="请输入部门"></el-input>
          </el-form-item>
        </ul>
      </header>
      <nav class="info">
        <div class="infoHead clearfix">
          <div class="fl">
            票据信息
            <i></i>
          </div>
          <div class="fr upload-btn" @click="uploadExcelFileData()">
            <i class="el-icon-lx-piliangshangchuan "></i> <span>批量上传</span>
          </div>
        </div>
      </nav>
      <div>
         <el-form-item label="票据类型：" prop="ticketType" class="fl">
           <el-select v-model="billInStockFlow.ticketType" placeholder="请选择" style="width:106px">
              <el-option
                v-for="item in [{label:'银票',value:'12001'},{label:'商票',value:'12002'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
      </el-form-item>
      <el-form-item label="票据介质：" prop="mediaType"  class="fl">
        <el-select v-model="billInStockFlow.mediaType" placeholder="请选择" style="width:106px">
              <el-option
                v-for="item in [{label:'电票',value:'11001'},{label:'纸票',value:'11002'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
      </el-form-item>
      </div>
      <div class="section ">
        <el-table  
          :data="data"
          style="width: 100%"
          max-height="300px"
          highlight-current-row
          header-row-class-name="headClass">
           <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center"
          >
          </el-table-column>
          <el-table-column
            size="medium"
            v-for="(v,i) in master_user.columns"
            :prop="v.field"
            :label="v.title"
            :min-width="v.width"
            align="center"
          >
            <template slot-scope="scope">
              <div>
                <span v-if="v.field=='canTransfer'">{{scope.row[v.field]==1 ? '可转让':'不可转让'}}</span>
                <span v-else-if="v.field=='ticketNo'" style="color:rgba(83, 118, 255, 1);cursor:pointer" @click="handleView(scope.row)">{{scope.row[v.field]}}</span>
                <span v-else-if="v.field=='calInterestType'">{{scope.row[v.field]==13001 ? '年息%':(scope.row[v.field]==13002 ? '元/每十万':'')}}</span>
                <span v-else>{{scope.row[v.field]}}</span>
              </div>
            </template>
          </el-table-column>
           <el-table-column
            fixed="right"
            label="操作"
            width="50">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleEditItem(scope.row,scope.$index)">编辑</el-button>
            </template>
          </el-table-column>
            <el-table-column
            fixed="right"
            label="操作"
            width="50">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleDel(scope.row,scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="addRow" @click="addMasterUser()">
          <i class="el-icon-circle-plus-outline"></i>
          <span>继续添加</span>
        </div>
        <div class="total">
          <div class="top">
            <i class="el-icon-lx-heji"></i>
            <span style="margin-left:7px">合计</span>
          </div>
          <ul class="clearfix">
            <li>
              <div class="txt">票面金额</div>
              <div class="num">{{ticketAmountTotal}}</div>
            </li>
            <li>
              <div class="txt">入库放款</div>
              <div class="num">{{inPayMoneyTotal}}</div>
            </li>
          </ul>
        </div>
        <div class="newBtn">
          <el-button  type="primary"  @click="handleSubmit('billInStockFlow')">确认</el-button>
          <el-button>取消</el-button>
        </div>
      </div>
    </el-form>
    <el-dialog
      title="票面信息"
      :visible.sync="dialogVisible"
      :close-on-click-modal='false'
      width="1184px">
        <div class="AddCoupon clearfix">
          <el-form
            :model="listItem"
            :rules="rules"
            ref="listItem"
            label-width="112px"
            class="demo-ruleForm"
          >
            <div class="fl" style="margin-right:32px">
              <p class="line_">
                <span></span>
                <i>票面信息</i>
              </p>
              <div class="coupon_info">
                <div class="top clearfix">
                  <el-form-item label="出票日期：" prop="draftDate" class="inputleft">
                    <el-date-picker
                      v-model="listItem.draftDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd"
                      class="input248"
                      v-if="editStatus"
                    ></el-date-picker>
                    <div class="input248" v-else>{{listItem.draftDate}}</div>
                  </el-form-item>
                  <el-form-item label="票据状态：" prop="checkPass">
                    <div class="input248" style="height:34px"></div>
                  </el-form-item>
                  <el-form-item label="汇票到期日：" prop="expireDate" class="inputleft">
                    <el-date-picker
                      v-model="listItem.expireDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd"
                      class="input248"
                      v-if="editStatus"
                      @change="handleExpireDate"
                    ></el-date-picker>
                    <div class="input248" v-else>{{listItem.expireDate}}</div>
                  </el-form-item>
                  <el-form-item label="票据号码：" prop="ticketNo">
                    <el-input
                      v-model="listItem.ticketNo"
                      class="input248"
                      v-if="editStatus"
                      placeholder="请输入票据号码"
                      @blur="handleCheckTicketNo(listItem.ticketNo)"
                    ></el-input>
                    <div class="input248" v-else>{{listItem.ticketNo}}</div>
                  </el-form-item>
                </div>
                <div class="table_info">
                  <div class="drawer_info">
                    <ul class="person clearfix">
                      <li class="one">出票人</li>
                      <li>
                        <p class="specil">
                          <el-form-item label="全称" prop="drawer">
                            <el-input v-model="listItem.drawer" class="input291 drawer"
                                v-if="editStatus"
                                placeholder="请输入全称"
                                maxlength="100"
                            ></el-input>
                            <div class="input291 border_" v-else>{{listItem.drawer}}</div>
                          </el-form-item>
                        </p>
                        <p class="specil two">
                          <el-form-item label="账号" prop="drawerAccountNo">
                            <el-input v-model="listItem.drawerAccountNo" v-if="editStatus" placeholder="请输入账号"></el-input>
                            <div v-else  class="input291 border_" style="border-top: none;border-bottom: none;">{{listItem.drawerAccountNo}}</div>
                          </el-form-item>
                        </p>
                        <p class="specil three">
                          <el-form-item label="开户银行" prop="drawerBank">
                            <el-input v-model.number="listItem.drawerBank" v-if="editStatus" placeholder="请输入开户银行" class="drawerBank"></el-input>
                            <div v-else class="input291 border_">{{listItem.drawerBank}}</div>
                          </el-form-item>
                        </p>
                      </li>
                    </ul>
                    <ul class="person clearfix">
                      <li class="one">收款人</li>
                      <li>
                        <p class="specil">
                          <el-form-item label="全称" prop="receiver">
                            <el-input v-model="listItem.receiver" class="input291 receiver" placeholder="请输入全称" v-if="editStatus" maxlength="100"></el-input>
                            <div v-else  class="input291 border_">{{listItem.receiver}}</div>
                          </el-form-item>
                        </p>
                        <p class="specil two">
                          <el-form-item label="账号" prop="receiverAccountNo">
                            <el-input v-model="listItem.receiverAccountNo" placeholder="请输入账号" v-if="editStatus"></el-input>
                            <div v-else  class="input291 border_">{{listItem.receiverAccountNo}}</div>
                          </el-form-item>
                        </p>
                        <p class="specil three">
                          <el-form-item label="开户银行" prop="receiverBank">
                            <el-input v-model="listItem.receiverBank" placeholder="请输入开户银行" v-if="editStatus" class='receiverBank'></el-input>
                            <div v-else  class="input291 border_">{{listItem.receiverBank}}</div>
                          </el-form-item>
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div class="guarantee_info">
                    <ul class="person clearfix">
                      <li class="guarantee_name" style="text-align:center">出票保证信息</li>
                      <li class="guarantee_name_ input291" style="padding-left:12px">保证人名称：</li>
                      <li class="guarantee_name_" style="width:210px">保证人地址：</li>
                      <li class="guarantee_name_" style="width:190px">保证日期：</li>
                    </ul>
                  </div>
                  <div class="guarantee_info">
                    <ul class="person clearfix">
                      <li
                        class="guarantee_name"
                        style="text-align:center;border:1px solid rgba(89, 102, 137, 0.12);border-left:none;"
                      >票据金额</li>
                      <li class="guarantee_name_ moneyAmount">
                        <el-form-item label="人民币（小写）" prop="ticketAmount">
                          <el-input v-model="listItem.ticketAmount" style="width:151px" placeholder="请输入票面金额" v-if="editStatus" @blur="handleticketAmount(listItem.ticketAmount)"></el-input>
                          <div v-else  class="input291 border_"  style="width:150px">{{listItem.ticketAmount}}</div>
                        </el-form-item>
                      </li>
                      <li
                        class="guarantee_name"
                        style="width:404px;border:1px solid rgba(89, 102, 137, 0.12);border-left:none;padding-left:12px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
                      >人民币（大写）&nbsp; &nbsp;&nbsp;&nbsp;{{ticketAmount_big}}</li>
                    </ul>
                  </div>
                  <div class="drawer_info clearfix">
                    <ul class="person clearfix">
                      <li class="acceptor_info">承兑人信息</li>
                      <li class="acceptor_">
                        <p class="specil acceptor_o">
                          <el-form-item label="全称" prop="accepter">
                            <el-input v-model="listItem.accepter" style="width:221px" placeholder="请输入全称" v-if='editStatus'></el-input>
                          <div v-else  class="input291 border_" style="width: 220px;">{{listItem.accepter}}</div>
                          </el-form-item>
                        </p>
                        <p class="specil acceptor_t">
                          <el-form-item label="账号" prop="accepterAccountNo" >
                            <el-input
                              v-model="listItem.accepterAccountNo"
                              style="width:221px"
                                placeholder="请输入账号"
                                v-if='editStatus'
                            ></el-input>
                            <div v-else  class="input291 border_"  style="width: 220px;">{{listItem.accepterAccountNo}}</div>
                          </el-form-item>
                        </p>
                      </li>
                    </ul>
                    <ul class="person clearfix">
                      <li class="acceptor_ guarantee_name_">
                        <p class="specil acceptor_o">
                          <el-form-item label="开户行行号" prop="accepterBankNo">
                            <el-input v-model="listItem.accepterBankNo" style="width:263px"  placeholder="请输入开户行行号" v-if='editStatus'></el-input>
                            <div v-else  class="input291 border_" style="width:263px">{{listItem.accepterBankNo}}</div>
                          </el-form-item>
                        </p>
                        <p class="specil acceptor_t">
                          <el-form-item label="开户行名称" prop="accepterBank">
                            <el-input v-model="listItem.accepterBank" style="width:263px" placeholder="请输入开户行名称" v-if='editStatus'></el-input>
                            <div v-else class="input291 border_" style="width:263px">{{listItem.accepterBank}}</div>
                          </el-form-item>
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div class="other clearfix">
                    <ul class="fl one">
                      <li>交易合同号</li>
                      <li>是否转让</li>
                    </ul>
                    <ul class="fl other_blank">
                      <li></li>
                      <li  style="padding-top: 15px;">
                        <el-form-item  prop="canTransfer" label-width='0'>
                          <el-radio-group v-model="listItem.canTransfer" :disabled="editStatus==0">
                            <el-radio label="1">可转让</el-radio>
                            <el-radio label="0">不可转让</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </li>
                    </ul>
                    <ul class="fl three">
                      <li>承 兑 信 息</li>
                    </ul>
                    <ul class="fl four">
                      <li>出票人承诺：本汇票请予以承兑，到期无条件付款</li>
                      <li><p>
                        承兑人承诺：本汇票已经承兑，到期无条件付款</p><p style="padding-left: 76px;font-weight:600;">承兑日期：</p></li>
                    </ul>
                  </div>
                  <div class="guarantee_info pro_info clearfix">
                    <ul class="person clearfix">
                      <li class="guarantee_name" style="text-align:center">承兑保证信息</li>
                      <li class="guarantee_name_ input291" style="padding-left:12px">保证人名称：</li>
                      <li class="guarantee_name_" style="width:210px">保证人地址：</li>
                      <li class="guarantee_name_" style="width:190px;padding-left: 14px;">保证日期：</li>
                    </ul>
                  </div>
                  <div class="last clearfix">
                    <ul class="fl one">
                      <li>
                        评级信息（
                        <span>由出票 人、承兑人自己记 载，仅供参考</span> ）
                      </li>
                    </ul>
                    <ul class="fl two">
                      <li>出票人</li>
                      <li>承兑人</li>
                    </ul>
                    <ul class="three clearfix">
                      <li>
                        <p style="width:222px;">评级主体：</p>
                        <p style="width:210px;">信用等级：</p>
                        <p>评级到期日：</p>
                      </li>
                      <li>
                        <p style="width:222px;">评级主体：</p>
                        <p style="width:210px;">信用等级：</p>
                        <p>评级到期日：</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="fl">
              <p class="line_">
                <span></span>
                <i>报价信息</i>
              </p>
              <div class="info_add">
                <el-form-item label="计息方式：" prop="calInterestType">
                  <el-select v-model="listItem.calInterestType" placeholder="请选择" class="input160" v-if='editStatus' @change="handlecalInterestType(listItem.calInterestType)">
                    <el-option
                      v-for="item in [{label:'年息%',value:13001},{label:'元/每十万',value:13002}]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select v-if='editStatus'>
                  <span v-else>{{listItem.calInterestType==13001 ? '年息%' :'元/每十万'}}</span>
                </el-form-item>
                <el-form-item label="入库价格：" prop="stockPrice">
                  <el-input
                    v-model="listItem.stockPrice"
                    auto-complete="off"
                    class="input160"
                    placeholder="请输入入库价格"
                    v-if='editStatus'
                    @blur="handleStockPrice(listItem.stockPrice)"
                  ></el-input>
                  <span v-else>{{listItem.stockPrice}}</span>
                </el-form-item>
                <el-form-item label="加天：" prop="plusDay">
                  <el-input
                    v-model="listItem.plusDay"
                    auto-complete="off"
                    class="input160"
                    placeholder="请输入加天"
                    v-if='editStatus'
                    disabled
                  ></el-input>
                  <span v-else>{{listItem.plusDay}}</span>
                </el-form-item>
                <el-form-item label="入库剩余天数：" prop="dayNum">
                  <el-input
                    v-model="listItem.dayNum"
                    auto-complete="off"
                    class="input160"
                    placeholder="请输入入库剩余天数"
                    v-if='editStatus'
                    disabled
                  ></el-input>
                  <span v-else>{{listItem.dayNum}}</span>
                </el-form-item>
                <el-form-item label="入库利息：" prop="stockInterest">
                  <el-input
                    v-model="listItem.stockInterest"
                    auto-complete="off"
                    class="input160"
                    v-if='editStatus'
                    disabled
                  ></el-input>
                  <span v-else>{{listItem.stockInterest}}</span>
                </el-form-item>
                <el-form-item label="电汇费：" prop="eleRemitCost">
                  <el-input
                    v-model="listItem.eleRemitCost"
                    auto-complete="off"
                    class="input160"
                    placeholder="请输入电汇费"
                    v-if='editStatus'
                    maxlength="5"
                    @blur="handleeleRemitCost(listItem.eleRemitCost)"
                  ></el-input>
                  <span v-else>{{listItem.eleRemitCost}}</span>
                </el-form-item>
                <el-form-item label="入库放款：" prop="payMoney">
                  <el-input
                    v-model="listItem.payMoney"
                    auto-complete="off"
                    class="input160"
                    v-if='editStatus'
                    disabled
                  ></el-input>
                  <span v-else>{{listItem.payMoney}}</span>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer" v-if="editStatus==1">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAddTableItem('listItem')">确 定</el-button>
        </span>
        <span slot="footer" class="dialog-footer" v-if="editStatus==2">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleEditSure('listItem')">确 定</el-button>
        </span>
    </el-dialog>
    <div id="uploadFile">
      <el-dialog
              title="批量上传"
              :visible.sync="uploadDialogVisible"
              width="36.81vw"
              top="20.11vh"
              customClass="upload-content"
              :before-close="handleClose">
        <el-upload
                class="upload-excel"
                drag
                show-file-list
                :limit="uploadLimit"
                :on-exceed="handleExceed"
                :before-upload="beforeUploadExcel"
                :on-success="handleUploadSuccess"
                :on-error="handleUploadError"
                :action="actionUrl"
                multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>浏览文件上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传一个xlsx/xls格式文件，且不超过10MB <em class="download" @click="fetchTemplate">下载模板</em> </div>
        </el-upload>
        <span slot="footer" class="dialog-footer  uploadFooter">
                <el-button type="primary"  :disabled="canReview" class="btn confirmBtn" @click="uploadDialogVisible = false;reviewExcelData()">预览</el-button>
                <el-button class=" btn cancelBtn" @click="uploadDialogVisible = false">取 消</el-button>
             </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getCurrentUser,
  saveInStockBusinessNo,
  getDaysUrl,
  checkTicketNo,
  uploadExcelFile,
  downloadExcelFile,
  selectBatchUploadRecord
} from "@/api/api";
import eventBus from "../../common/bus";
export default {
  name: "newWarehousing",
  data() {
    let that = this;
    var check_maxAccountNum_ = (rule, value, callback) => {
      var reg = /^\+?[0-9][0-9]*$/;
      if (value == null || value == "") {
        callback();
        return;
      }
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入数字"));
      }
    };
    var check_eleRemitCost = (rule, value, callback) => {
      if (value == null || value == "") {
        callback();
      }
      var reg = /^([1-9]\d*|[0]{1,1})$/;
      if (value == null) {
        callback(new Error("请输入数字"));
        return;
      }
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入数字"));
      }
    };

    // 入库价格校验
    var check_stockPrice = (rule, value, callback) => {
      // 输入数字，当计息方式是年息%时，范围：0.01-99.99即小数点前两位后两位
      // 当计息方式是 元/每十万，范围：0.01-99999.99
      var reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/;
      if (value == null || value == 0) {
        callback(new Error("请输入正确入库价格"));
        return;
      }
      if (reg.test(value)) {
        if (that.listItem.calInterestType == 13001) {
          if (0 < parseFloat(value) && parseFloat(value) < 100) {
            callback();
          } else {
            callback(new Error("请输入正确入库价格"));
          }
        } else if (that.listItem.calInterestType == 13002) {
          if (0 < parseFloat(value) && parseFloat(value) < 100000) {
            callback();
          } else {
            callback(new Error("请输入正确入库价格"));
          }
        }
      } else {
        callback(new Error("请输入正确入库价格"));
      }
    };

    var check_ticketAmount = (rule, value, callback) => {
      var reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/;
      if (value == null || value == 0) {
        callback(new Error("请输入正确数字"));
        return;
      }
      if (reg.test(value)) {
        let value_ = parseFloat(value);
        if (value_ > 0.01 && value_ < 10000000000) {
          callback();
        } else {
          callback(new Error("请输入数字"));
        }
      } else {
        callback(new Error("请输入数字"));
      }
    };
    // 校验票号
    const check_ticketNo = (rule, value, callback) => {
      var reg = /^\+?[0-9][0-9]*$/;
      if (value == null) {
        callback(new Error("请输入正确票号"));
        return;
      }
      // let val=value.replace(/\s/g,'');
      if (reg.test(value)) {
        if (that.billInStockFlow.mediaType == 11001) {
          if (value.length == 30) {
            callback();
          } else {
            callback(new Error("请输入正确票号"));
          }
        } else if (that.billInStockFlow.mediaType == 11002) {
          if (value.length == 16) {
            callback();
          } else {
            callback(new Error("请输入正确票号"));
          }
        }
      } else {
        callback(new Error("请输入正确票号"));
      }
    };
    return {
      publicPath: "",
      excelDatas: [],
      convertRule: [
        { prop: "draftDate", convert: this.formDate },
        { prop: "expireDate", convert: this.formDate }
      ],
      canReview: true,
      fileName: "",
      downloadUrl: downloadExcelFile,
      actionUrl: uploadExcelFile,
      batchId: "-145195201859610179",

      ticketAmount_big: "", //人民币大写

      _index: 0,
      uploadLimit: 1,
      uploadDialogVisible: false,
      listItem: {
        ticketNo: null,
        drawer: "",
        drawerAccountNo: "",
        drawerBank: "",
        receiver: "",
        receiverAccountNo: "",
        receiverBank: "",
        accepter: "",
        accepterAccountNo: "",
        accepterBank: "",
        accepterBankNo: "",
        ticketAmount: "",
        draftDate: "",
        expireDate: "",
        plusDay: "",
        dayNum: "",
        canTransfer: "1",
        stockPrice: "",
        calInterestType: 13001,
        stockInterest: "",
        eleRemitCost: "",
        payMoney: ""
      },
      editStatus: 1, // 1添加 2编辑 0查看
      dialogVisible: false,
      inPayMoneyTotal: 0,
      ticketAmountTotal: 0,
      eleRemitCostTotal: 0,
      dialogVisible_: false,
      billInStockFlow: {
        ticketNo: null,
        inStockType: "21001",
        payType: "40001",
        receiveCompany: "",
        accountNo: "",
        openAccountBank: "",
        bigLineNo: "",
        contactPerson: "",
        contactPhone: "",
        postName: "",
        applyUserName: "",
        ticketType: "12001",
        mediaType: "11001",
        remark: "",
        departmentId: ""
      },
      billInStockFlow_temp: {},
      department_nickName: {},
      master_user: {
        sel: null, //选中行
        columns: [
          { field: "ticketNo", title: "票号", width: 230 },
          { field: "ticketAmount", title: "票面金额", width: 100 },
          { field: "draftDate", title: "出票日", width: 140 },
          { field: "expireDate", title: "到期日", width: 140 },
          { field: "drawer", title: "出票人", width: 100 },
          { field: "receiver", title: "收款人", width: 100 },
          { field: "accepter", title: "承兑人", width: 100 },
          { field: "accepterBankNo", title: "承兑人开户行行号", width: 140 },
          { field: "plusDay", title: "加天", width: 100 },
          { field: "dayNum", title: "入库剩余天数", width: 120 },
          { field: "stockPrice", title: "入库价格", width: 100 },
          { field: "calInterestType", title: "计息方式", width: 130 },
          { field: "stockInterest", title: "入库利息", width: 100 },
          { field: "eleRemitCost", title: "电汇费", width: 100 },
          { field: "payMoney", title: "入库放款", width: 100 }
        ]
      },
      data: [],
      rules: {
        receiveCompany: [
          {
            validator: this.checkData.check_chinese,
            trigger: "blur",
            required: true,
            message: "请输入正确企业名称"
          }
        ], //收款企业
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        age_: [{ required: true, message: "请选择入库方式" }], //入库方式
        inStockType: [{ message: "请选择入库方式", trigger: "blur" }], //入库方式
        payType: [{ required: true, message: "请选择支付方式" }], //支付方式
        openAccountBank: [
          {
            required: true,
            validator: this.checkData.check_chinese,
            message: "请输入正确开户行"
          }
        ], //开户行
        contactPerson: [
          {
            required: true,
            message: "请输入正确联系人",
            validator: this.checkData.check_chinese
          }
        ], //联系人
        bigLineNo: [
          {
            required: true,
            message: "请输入正确大额行号",
            validator: this.checkData.check_zero_digit
          }
        ], //大额行号
        accountNo: [
          {
            required: true,
            validator: this.checkData.check_zero_digit,
            trigger: "blur",
            message: "请输入正确账号"
          }
        ],
        ticketAmount: [
          {
            required: true,
            validator: check_ticketAmount,
            trigger: "blur",
            message: "请输入正确票面金额"
          }
        ], //票面金额
        contactPhone: [
          {
            required: true,
            validator: this.checkData.check_mobile,
            trigger: "blur"
          }
        ], //账号
        postName: [
          {
            validator: this.checkData.check_chinese_not,
            trigger: "blur",
            message: "请输入正确职务"
          }
        ], // 职务
        ticketNo: [
          {
            required: true,
            validator: check_ticketNo,
            trigger: "blur",
            message: "请输入正确票号"
          }
        ], //票号
        eleRemitCost: [
          {
            validator: check_eleRemitCost,
            trigger: "blur",
            message: "请输入整数电汇费"
          }
        ], //电汇费
        draftDate: [{ required: true, message: "请选择日期" }], //日期
        expireDate: [{ required: true, message: "请选择日期" }], //日期
        drawer: [
          {
            required: true,
            validator: this.checkData.check_chinese,
            message: "请输入正确全称"
          }
        ], //出票人
        drawerAccountNo: [
          { validator: check_maxAccountNum_, message: "请输入正确账号" }
        ], //出票人账号
        drawerBank: [
          {
            validator: this.checkData.check_chinese_not,
            message: "请输入正确开户行"
          }
        ], //出票人银行
        receiverAccountNo: [
          { validator: check_maxAccountNum_, message: "请输入正确账号" }
        ],
        receiverBank: [
          {
            validator: this.checkData.check_chinese_not,
            message: "请输入正确开户行"
          }
        ], // 收款人开户行
        accepterAccountNo: [
          { validator: check_maxAccountNum_, message: "请输入正确账号" }
        ], //承兑人账号
        accepterBankNo: [
          {
            required: true,
            validator: this.checkData.check_zero_digit,
            message: "请输入正确开户行行号"
          }
        ], //承兑人开户行行号
        receiver: [
          {
            required: true,
            validator: this.checkData.check_chinese,
            message: "请输入正确全称"
          }
        ], //收款人
        accepterBank: [
          {
            validator: this.checkData.check_chinese_not,
            message: "请输入正确开户行名称"
          }
        ], //承兑人开户行名称
        accepter: [
          {
            required: true,
            validator: this.checkData.check_chinese,
            message: "请输入正确全称"
          }
        ], //承兑人
        stockPrice: [
          { required: true, validator: check_stockPrice, trigger: "blur" }
        ] //入库价格
      }
    };
  },
  methods: {
    fetchTemplate() {
      window.open("./file/【票+】批量上传模板.xls");
    },
    handleClose(done) {
      this.$confirm("确定取消上传吗")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleUploadError(err, file, fileList) {
      if (err) {
        this.$message({
          message: "文件上传失败",
          type: "error"
        });
      }
    },
    handleUploadSuccess(response, file, fileList) {
      //{"MESSAGE":"Excel数据导入成功!","CODE":"200","batchId":"-145195201859610179"}
      this.canReview = true;
      if (response && response.CODE === "200") {
        this.batchId = response.batchId;
        this.fileName = file.name;
        if (fileList.length == 1) {
          this.canReview = false;
        }
        this.$message({
          message: "文件上传成功",
          type: "success"
        });
      } else if (response.CODE === "300") {
        this.$message({
          message: "模板类型不支持",
          type: "warning"
        });
      } else if (response.CODE === "404") {
        this.$message({
          message: "未找到Action请求",
          type: "error"
        });
      } else if (response.CODE === "5038") {
        this.$message({
          message: "excel数据不能为空",
          type: "error"
        });
      } else if (response.CODE === "5039") {
        this.$message({
          message: "文件类型只支持xls和xlsx!",
          type: "error"
        });
      } else if (response.CODE === "5040") {
        this.$message({
          message: "数据类型不正确!",
          type: "error"
        });
      } else if (response.CODE === "5041") {
        this.$message({
          message: "数据类型格式不正确!",
          type: "error"
        });
      } else if (response.CODE === "5042") {
        this.$message({
          message: "入库计息方式格式不正确!",
          type: "error"
        });
      } else if (response.CODE === "5033") {
        this.$message({
          message: "Excel不能为空!",
          type: "error"
        });
      } else if (response.CODE === "5034") {
        this.$message({
          message: "Excel解析失败!",
          type: "error"
        });
      } else if (response.CODE === "401") {
        this.$router.push("/login");
      } else {
        this.$message({
          message: `文件上传失败`,
          type: "error"
        });
      }
    },
    reviewExcelData() {
      //{"batchId":121212212}
      let that = this;
      let reqData = { batchId: this.batchId };
      selectBatchUploadRecord(reqData)
        .then(res => {
          if (res.data && res.data.CODE === "200") {
            this.excelDatas = res.data.RESULT;
            this.$router.push({ name: "reviewExcel" });
          } else if (res.data.CODE === "300") {
            this.$message({
              message: "模板类型不支持",
              type: "warning"
            });
          } else if (res.data.CODE === "404") {
            this.$message({
              message: "未找到Action请求",
              type: "error"
            });
          } else if (res.data.CODE === "5043") {
            this.$message({
              message: "批次号不能为空!",
              type: "error"
            });
          } else if (res.data.CODE === "401") {
            this.$router.push("/login");
          }
        })
        .catch(err => {
          this.$message({
            message: "预览数据查询失败",
            type: "error"
          });
        });
    },
    // 上传excel文件之前进行文件类型检查，文件大小检查；
    beforeUploadExcel(file) {

      const isExcel =
        file.name.split(".")[1] === "xlsx" || file.name.split(".")[1] === "xls";
      const isLt10M = file.size / 1024 / 1024 < 2;
      if (!isExcel) {
        this.$message.error("上传文件只能是 xlsx/xls 格式!");
      }
      if (!isLt10M) {
        this.$message.error("上传文件大小不能超过 10MB!");
      }
      return isExcel && isLt10M;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `只能选择${this.uploadLimit}个excel文件，本次选择了 ${
          files.length
        } 个文件`
      );
    },
    // 读取excel 表格内容
    uploadExcelFileData() {
      this.uploadDialogVisible = true;
    },
    // 票面信息动态变化
    handleChangeTicket() {
      if (this.listItem.calInterestType == 13001) {
        if (
          (this.listItem.dayNum || this.listItem.dayNum == 0) &&
          this.listItem.stockPrice
        ) {
          this.listItem.stockInterest =
            (
              ((this.listItem.ticketAmount - 0) *
                (this.listItem.stockPrice - 0) *
                (this.listItem.dayNum - 0)) /
              36000
            ).toFixed(2) - 0;
        }
      } else {
        if (this.listItem.ticketAmount) {
          let stockPrice = this.listItem.stockPrice;
          var reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/;
          if (stockPrice == null || stockPrice == 0) {
            return;
          }
          if (reg.test(stockPrice)) {
            this.listItem.stockInterest =
              (
                ((this.listItem.ticketAmount - 0) / 100000) *
                (stockPrice - 0)
              ).toFixed(2) - 0;
          }
        }
      }
      if (this.listItem.ticketAmount) {
        let eleRemitCost = this.listItem.eleRemitCost;
        if (eleRemitCost) {
          eleRemitCost = this.listItem.eleRemitCost;
        } else {
          eleRemitCost = 0;
        }
        let stockInterest = this.listItem.stockInterest;
        if (stockInterest) {
          stockInterest = this.listItem.stockInterest;
        } else {
          stockInterest = 0;
        }
        //入库放款
        let payMoney =
          this.listItem.ticketAmount - stockInterest - eleRemitCost;
        if (payMoney <= 0) {
          payMoney = 0;
        }
        this.listItem.payMoney = payMoney.toFixed(2);
      }
    },
    handleeleRemitCost(value) {
      if (value == null) {
        return;
      }
      var reg = /^([1-9]\d*|[0]{1,1})$/;
      if (reg.test(value) || value == "") {
        this.handleChangeTicket();
      } else {
        return;
      }
    },
    // 票面金额
    handleticketAmount(value) {
      var reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/;
      if (value == null || value == 0) {
        return;
      }
      if (reg.test(value)) {
        let ticketAmount = value && parseFloat(value).toFixed(2);
        this.listItem.ticketAmount = ticketAmount;
        this.handleChangeTicket();
        this.ticketAmount_big = this.smalltoBIG(ticketAmount);
      }
    },
    smalltoBIG(n) {
      var fraction = ["角", "分"];
      var digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
      var unit = [["元", "万", "亿"], ["", "拾", "佰", "仟"]];
      var head = n < 0 ? "欠" : "";
      n = Math.abs(n);

      var s = "";

      for (var i = 0; i < fraction.length; i++) {
        s += (
          digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
        ).replace(/零./, "");
      }
      s = s || "整";
      n = Math.floor(n);

      for (var i = 0; i < unit[0].length && n > 0; i++) {
        var p = "";
        for (var j = 0; j < unit[1].length && n > 0; j++) {
          p = digit[n % 10] + unit[1][j] + p;
          n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
      }
      return (
        head +
        s
          .replace(/(零.)*零元/, "元")
          .replace(/(零.)+/g, "零")
          .replace(/^整$/, "零元整")
      );
    },
    handlecalInterestType(value) {
      this.handleChangeTicket();
    },
    // 入库价格
    handleStockPrice(value) {
      var reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/;
      if (value == null || value == 0) {
        return;
      }

      if (reg.test(value)) {
        if (this.listItem.calInterestType == 13001) {
          if (0 < parseFloat(value) && parseFloat(value) < 100) {
            this.listItem.stockPrice = value && parseFloat(value).toFixed(2);
            this.handleChangeTicket();
          } else {
            return;
          }
        } else if (this.listItem.calInterestType == 13002) {
          if (0 < parseFloat(value) && parseFloat(value) < 100000) {
            this.listItem.stockPrice = value && parseFloat(value).toFixed(2);
            this.handleChangeTicket();
          } else {
            return;
          }
        }
      }
      // 计息方式是年息%，则入库利息=票面金额*实际年息*天数/36000
      // 计息方式是元/每十万，公式=票面金额/100000*每十万扣点
      // debugger
      // this.listItem.ticketAmount
      // this.listItem.stockPrice
    },
    // 编辑确定
    handleEditSure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let listItem = JSON.parse(JSON.stringify(this.listItem));
          let data = this.data;
          data.splice(this._index, 1, listItem);
          let ticketAmountTotal = 0;
          let inPayMoneyTotal = 0;
          let eleRemitCostTotal = 0;

          data &&
            data.map(function(v, i) {
              ticketAmountTotal += v.ticketAmount - 0;
              inPayMoneyTotal += v.payMoney - 0;
              eleRemitCostTotal += v.eleRemitCost - 0;
            });
          this.data = data;
          this.ticketAmountTotal = ticketAmountTotal.toFixed(2);
          this.inPayMoneyTotal = inPayMoneyTotal.toFixed(2);
          this.eleRemitCostTotal = eleRemitCostTotal.toFixed(2);
          this.dialogVisible = false;
        } else {
          return false;
        }
      });
    },
    // 添加确定
    handleAddTableItem(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogVisible = false;
          let listItem = JSON.parse(JSON.stringify(this.listItem));
          let data = JSON.parse(JSON.stringify(this.data));
          data.push(listItem);
          let ticketAmountTotal = 0;
          let inPayMoneyTotal = 0;
          let eleRemitCostTotal = 0;

          data &&
            data.map(function(v, i) {
              ticketAmountTotal += v.ticketAmount - 0;
              inPayMoneyTotal += v.payMoney - 0;
              eleRemitCostTotal += v.eleRemitCost - 0;
            });
          this.data = data;
          this.ticketAmountTotal = ticketAmountTotal.toFixed(2);
          this.eleRemitCostTotal = eleRemitCostTotal.toFixed(2);
          this.inPayMoneyTotal = inPayMoneyTotal.toFixed(2);
        } else {
          return false;
        }
      });
    },
    handleEditItem(value, value_) {
      this._index = value_;
      this.dialogVisible = true;
      this.editStatus = 2;
      // this.listItem=JSON.parse(JSON.stringify(value));
      this.listItem = JSON.parse(JSON.stringify(value));
      let data = this.data;
      let ticketAmountTotal = 0;
      let inPayMoneyTotal = 0;
      let eleRemitCostTotal = 0;
      data &&
        data.map(function(v, i) {
          ticketAmountTotal += v.ticketAmount - 0;
          inPayMoneyTotal += v.payMoney - 0;
          eleRemitCostTotal += v.eleRemitCost - 0;
        });
      this.data = data;
      this.ticketAmountTotal = ticketAmountTotal.toFixed(2);
      this.inPayMoneyTotal = inPayMoneyTotal.toFixed(2);
      this.eleRemitCostTotal = eleRemitCostTotal.toFixed(2);
    },
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let billInStockFlow = this.billInStockFlow;
          let department_nickName = this.department_nickName;
          billInStockFlow.applyUserName = department_nickName.nickname;
          billInStockFlow.departmentId = department_nickName.departmentId;
          billInStockFlow.ticketNum = this.data.length;
          let tableData = JSON.parse(JSON.stringify(this.data));
          let flag = true;
          let mediaType = this.billInStockFlow.mediaType;
          tableData &&
            tableData.map(function(v, i) {
              let draftDate = v.draftDate;
              let expireDate = v.expireDate;
              if (draftDate) {
                v.draftDate =
                  draftDate.substr(0, 4) +
                  "" +
                  draftDate.substr(5, 2) +
                  "" +
                  draftDate.substr(8, 2);
              }
              if (expireDate) {
                v.expireDate =
                  expireDate.substr(0, 4) +
                  "" +
                  expireDate.substr(5, 2) +
                  "" +
                  expireDate.substr(8, 2);
              }
              if (mediaType == 11001) {
                if (v.ticketNo.length != 30) {
                  flag = false;
                  return;
                }
              }
              if (mediaType == 11002) {
                if (v.ticketNo.length != 16) {
                  flag = false;
                  return;
                }
              }
            });
          if (!flag) {
            this.$message({
              message: "票据信息所属票据介质必须一致",
              type: "warning"
            });
            return;
          }
          billInStockFlow.ticketList = tableData;
          billInStockFlow.applyUserNameList = [];
          billInStockFlow.ticketAmountTotal = this.ticketAmountTotal;
          billInStockFlow.inPayMoneyTotal = this.inPayMoneyTotal;
          billInStockFlow.eleRemitCostTotal = this.eleRemitCostTotal;
          this.billInStockFlow_temp = billInStockFlow;
          this.saveInStockBusinessNo(billInStockFlow);
        } else {
          return false;
        }
      });
    },
    handleCheckTicketNo(value) {
      function checkNumber(theObj) {
        var reg = /^\+?[1-9][0-9]*$/;
        if (theObj == null) {
          callback(new Error("请输入数字"));
          return;
        }
        let val = theObj.replace(/\s/g, "");
        if (reg.test(val) && (val.length == 16 || val.length == 30)) {
          return true;
        } else {
          return false;
        }
      }
      if (value) {
        checkTicketNo({ ticketNo: value.replace(/\s/g, "") }).then(res => {
          if (res && res.data && res.data.CODE == "200") {
          } else {
            if (res && res.data && res.data.CODE == "200") {
              this.$message({
                message: res.data.MESSAGE,
                type: "warn"
              });
            }
            return;
          }
        });
      }
    },
    // 汇票到期日 加天计算
    handleExpireDate(value) {
      let that = this;
      that.getDaysUrl(value, function(result) {
        if (result && (result.plusDay || result.plusDay == 0)) {
          that.listItem.plusDay = result.plusDay;
          let day =
            Math.ceil((new Date(value) - new Date()) / (3600 * 1000 * 24)) +
            result.plusDay;
          if (day < 0) {
            that.listItem.dayNum = 0;
          } else {
            that.listItem.dayNum = day;
          }
          that.handleChangeTicket();
        }
      });
    },
    // 加天
    getDaysUrl(value, callback) {
      let dateTime =
        value && value.substr(0, 4) + value.substr(5, 2) + value.substr(8, 2);
      getDaysUrl({
        maturityDate: dateTime
      }).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          let result = res.data.RESULT;
          callback && callback(result);
        }
      });
    },
    handleDel(value, val_) {
      this.editStatus = 1;
      // this.listItem=JSON.parse(JSON.stringify(value));
      let value_ = JSON.parse(JSON.stringify(value));
      let data = this.data;
      let ticketAmountTotal = this.ticketAmountTotal;
      let inPayMoneyTotal = this.inPayMoneyTotal;
      let eleRemitCostTotal = this.eleRemitCostTotal;
      data &&
        data.map(function(v, i) {
          if (v.ticketNo == value_.ticketNo) {
            ticketAmountTotal = ticketAmountTotal - v.ticketAmount;
            inPayMoneyTotal = inPayMoneyTotal - v.payMoney;
            eleRemitCostTotal = eleRemitCostTotal - v.payMoney;
          }
        });
      data.splice(val_, 1);
      this.data = data;
      this.ticketAmountTotal = ticketAmountTotal.toFixed(2);
      this.inPayMoneyTotal = inPayMoneyTotal.toFixed(2);
      this.eleRemitCostTotal = eleRemitCostTotal.toFixed(2);
    },
    handleView(row) {
      this.dialogVisible = true;
      this.editStatus = 0;
      this.listItem=JSON.parse(JSON.stringify(row))
    },

    //添加账号
    addMasterUser() {
      this.dialogVisible = true;
      this.editStatus = 1;
      this.listItem = {
        ticketNo: null,
        drawer: "",
        drawerAccountNo: "",
        drawerBank: "",
        receiver: "",
        receiverAccountNo: "",
        receiverBank: "",
        accepter: "",
        accepterAccountNo: "",
        accepterBank: "",
        accepterBankNo: "",
        ticketAmount: "",
        draftDate: "",
        expireDate: "",
        plusDay: "",
        dayNum: "",
        canTransfer: "1",
        stockPrice: "",
        calInterestType: 13001,
        stockInterest: "",
        eleRemitCost: "",
        payMoney: ""
      };
      if (this.$refs["listItem"]) {
        this.$refs["listItem"].resetFields();
      }
    },
    // 28.新增入库
    saveInStockBusinessNo(param) {
      saveInStockBusinessNo(param).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          this.$message({
            message: res.data.MESSAGE,
            type: "success"
          });
          this.$router.push("/warehousingApplication");
        } else {
          this.billInStockFlow = this.billInStockFlow_temp;
          this.$message({
            message: res.data.MESSAGE,
            type: "warning"
          });
        }
      });
    },
    formDate(conDate) {
      let formDate = "";
      if (conDate) {
        conDate = conDate + "";
        ///传入格式是value:20190605 校验格式是2019-03-26；
        let year = conDate.substr(0, 4),
          month = conDate.substr(4, 2),
          day = conDate.substr(6, 2);
        formDate = year + "-" + month + "-" + day;
      }
      return formDate;
    },
    /*
    *
    * [{"prop":"draftDate","convert":this.formDate},
        {"prop":"expireDate","convert":this.formDate},

      ];
    * */
    handleUploadData(val) {
      let  convertDate = this.convertRule,
           tempTable = val[0],
           ticketAmountTotal = 0,
           inPayMoneyTotal = 0,
           eleRemitCostTotal = 0,
           that=this;
      this.billInStockFlow=val[1];
      for (let item of tempTable) {
        convertDate.map(function(rule) {
          let value = item[rule["prop"]];
          let conValue = rule["convert"](value);
          item[rule["prop"]] = conValue;
        });
        item.ticketNo = item.ticketNo.replace(/\s/g, "");
        this.getDaysUrl(item.expireDate, function(result) {
          if (result && (result.plusDay || result.plusDay == 0)) {
            item.plusDay = result.plusDay;
            let day =
              Math.ceil(
                (new Date(item.expireDate) - new Date()) / (3600 * 1000 * 24)
              ) + result.plusDay;
            if (day < 0) {
              item.dayNum = 0;
            } else {
              item.dayNum = day;
            }
            if (item.calInterestType == 13001) {
              if ((item.dayNum || item.dayNum == 0) && item.stockPrice) {
                item.stockInterest =
                  (
                    ((item.ticketAmount - 0) *
                      (item.stockPrice - 0) *
                      (item.dayNum - 0)) /
                    36000
                  ).toFixed(2) - 0;
              }
            } else {
              if (item.ticketAmount) {
                let stockPrice = item.stockPrice;
                var reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/;
                if (stockPrice == null || stockPrice == 0) {
                  return;
                }
                if (reg.test(stockPrice)) {
                  item.stockInterest =
                    (
                      ((item.ticketAmount - 0) / 100000) *
                      (stockPrice - 0)
                    ).toFixed(2) - 0;
                }
              }

            }
            if (item.ticketAmount || item.ticketAmount == 0) {
              ticketAmountTotal += item.ticketAmount - 0;
              that.ticketAmountTotal = ticketAmountTotal.toFixed(2);
            }

            if (item.eleRemitCost || item.eleRemitCost == 0) {
              eleRemitCostTotal += item.eleRemitCost - 0;
              that.eleRemitCostTotal = eleRemitCostTotal.toFixed(2);
            }
            if (item.ticketAmount) {
              let eleRemitCost = item.eleRemitCost;
              if (eleRemitCost) {
                eleRemitCost = item.eleRemitCost;
              } else {
                eleRemitCost = 0;
              }
              let stockInterest = item.stockInterest;
              if (stockInterest) {
                stockInterest = item.stockInterest;
              } else {
                stockInterest = 0;
              }
              //入库放款
              let payMoney = item.ticketAmount - stockInterest - eleRemitCost;
              if (payMoney <= 0) {
                payMoney = 0;
              }
              item.payMoney = payMoney.toFixed(2);
              if (item.payMoney || item.payMoney == 0) {
                inPayMoneyTotal += item.payMoney - 0;
                that.inPayMoneyTotal = inPayMoneyTotal.toFixed(2);
              }
            }
          }
        });
      }
      this.data = tempTable;
      console.log(tempTable)
    }
  },
  created() {
    eventBus.$on("uploadDataEvent", this.handleUploadData);
    getCurrentUser({}).then(res => {
      if (res && res.data && res.data.CODE == "200") {
        this.department_nickName = res.data.RESULT;
      }
    });
  },
  beforeDestroy() {
    eventBus.$off("uploadDataEvent", this.handleUploadData);
    let transData = {
      excelDatas: this.excelDatas,
      fileName: this.fileName
    };
    let billInStockFlow=this.billInStockFlow;
    eventBus.$emit("billInStockFlow",billInStockFlow);
    eventBus.$emit("excelDataEvent", transData);
  },
  destroyed() {
  }
};
</script>

<style scoped lang="less" rel="stylesheet/less">
@btn-blue: rgba(83, 118, 255, 1);
@bg-white: rgba(220, 223, 230, 1);
@color-confirm: rgba(255, 255, 255, 1);
@color-cancel: rgba(50, 62, 97, 1);
#uploadFile {
  /deep/ .upload-content {
    width: 36.81vw;
    min-height: 37.11vh;
    & .el-dialog__body {
      padding: 1% 3.67%;
      & .upload-excel {
        width: 100%;
        & .el-upload {
          width: inherit;
          height: 22vh;
          & .el-upload-dragger {
            width: inherit;
            height: inherit;
          }
          & .el-upload__text {
            em {
              font-family: PingFangSC-Regular;
              font-weight: 400;
              color: rgba(83, 118, 255, 1);
            }
          }
        }
        & .el-upload__tip em {
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(83, 118, 255, 1);
          cursor: pointer;
        }
      }
    }
    & .uploadFooter {
      width: 100%;
      height: 15.78%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      .btn {
        border-radius: 4px;
        width: 95px;
        height: 40px;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        line-height: 20px;
        &.confirmBtn {
          background: @btn-blue;
          color: @color-confirm;
        }
        &.cancelBtn {
          border: 1px solid @bg-white;
          color: @color-cancel;
        }
      }
    }
  }
}
.upload-btn{
  cursor: pointer;
}
.border_ {
  height: 32px;
  border: 1px solid rgba(89, 102, 137, 0.12);
  padding-left: 10px;
}
.info_add {
  padding-top: 12px;
}
.input160 {
  width: 160px;
}
.last {
  font-weight: 600;
}
.last span {
  font-size: 12px;
}
.last .one li {
  width: 112px;
  border-right: 1px solid rgba(89, 102, 137, 0.12);
}
.last .two {
  line-height: 32px;
  width: 66px;
  border-right: 1px solid rgba(89, 102, 137, 0.12);
}
.last .two li {
  height: 32px;
}
.last .two li:nth-child(1) {
  border-bottom: 1px solid rgba(89, 102, 137, 0.12);
}
.last .three {
  margin-left: 182px;
}
.last .three li {
  line-height: 32px;
  height: 32px;
}
.last .three li:nth-child(1) {
  border-bottom: 1px solid rgba(89, 102, 137, 0.12);
}
.last .three p {
  float: left;
}
.pro_info {
  border-bottom: 1px solid rgba(89, 102, 137, 0.12);
}
.other {
  text-align: center;
  font-weight: 600;
}
.other .one li {
  width: 112px;
  height: 32px;
  line-height: 32px;
  border-bottom: 1px solid rgba(89, 102, 137, 0.12);
  border-right: 1px solid rgba(89, 102, 137, 0.12);
}
.other .one li:nth-child(2) {
  height: 66px;
  line-height: 66px;
}
.other .other_blank li {
  width: 290px;
  height: 32px;
  border-bottom: 1px solid rgba(89, 102, 137, 0.12);
}
.other .other_blank li:nth-child(2) {
  height: 66px;
  line-height: 66px;
}
.other .three li {
  height: 98px;
  width: 40px;
  padding: 12px;
  border: 1px solid rgba(89, 102, 137, 0.12);
}
.four li {
  width: 364px;
  height: 32px;
  line-height: 32px;
  border-bottom: 1px solid rgba(89, 102, 137, 0.12);
  font-weight: 400;
}
.four li:nth-child(2) {
  height: 66px;
}
.newWarehousing {
  padding: 16px 32px;
}
.person {
  float: left;
}
.person li {
  float: left;
  font-weight: 600;
}
.person .one {
  padding: 12px;
  width: 42px;
  height: 97px;
  border-right: 1px solid rgba(89, 102, 137, 0.12);
  border-top: 1px solid rgba(89, 102, 137, 0.12);
  border-bottom: 1px solid rgba(89, 102, 137, 0.12);
}
.guarantee_info li {
  height: 32px;
  line-height: 32px;
  float: left;
}
.guarantee_name {
  width: 112px;
  border-right: 1px solid rgba(89, 102, 137, 0.12);
}
.acceptor_info {
  text-align: center;
  width: 112px;
  height: 64px;
  line-height: 64px;
  border-right: 1px solid rgba(89, 102, 137, 0.12);
  border-bottom: 1px solid rgba(89, 102, 137, 0.12);
}

.input291 {
  width: 291px;
}

.input248 {
  width: 248px;
}
.top .el-form-item {
  float: left;
}
.inputleft {
  margin-right: 37px;
}
.coupon_info {
  margin: 15px 10px;
  width: 808px;
  height: 548px;
  padding: 16px 0;
  background: linear-gradient(
    112deg,
    rgba(238, 247, 252, 1) 0%,
    rgba(238, 246, 249, 1) 15%,
    rgba(255, 238, 225, 0.46) 46%,
    rgba(240, 246, 250, 1) 83%,
    rgba(238, 247, 252, 1) 100%
  );
  border-radius: 8px;
}
.line_ i,
span {
  vertical-align: middle;
}
.line_ span {
  display: inline-block;
  width: 2px;
  height: 14px;
  background: rgba(83, 118, 255, 1);
  border-radius: 1px;
  margin-right: 8px;
}
.line_ i {
  display: inline-block;
  color: #5376ff;
}
.newWarehousing header > ul {
  /* margin-right: 174px; */
  width: 50%;
}
.newWarehousing header ul > label {
  display: block;
  margin-bottom: 24px;
}
.newWarehousing header ul > label > span {
  margin-right: 10px;
  font-weight: 600;
}
.newWarehousing .infoHead {
  border-bottom: 2px solid #e6e9f0;
}
.newWarehousing .infoHead div {
  padding-bottom: 8px;
}
.newWarehousing .infoHead .fl {
  padding-left: 12px;
  position: relative;
  color: #5376ff;
}
.newWarehousing .infoHead .fl i {
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 80px;
  height: 3px;
  background: #5376ff;
}
.newWarehousing .info {
  margin-bottom: 25px;
}
.newWarehousing .section .headClass {
  color: #a3adc8;
}
.newWarehousing .section .addRow {
  margin-top: 25px;
  color: #5376ff;
  display: inline-block;
  cursor: pointer;
}
.newWarehousing .section .addRow i {
  margin-right: 8px;
}
.newWarehousing .section .total {
  margin-top: 27px;
}
.newWarehousing .section .total .top {
  margin-bottom: 16px;
  color: #596689;
}
.newWarehousing .section .total li {
  padding: 16px 16px 0 16px;
  text-align: center;
  margin-right: 24px;
  float: left;
  width: 176px;
  height: 78px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
  border-radius: 4px;
}
.newWarehousing .section .total li .txt {
  line-height: 26px;
  font-size: 12px;
  color: rgba(163, 173, 200, 1);
}
.newWarehousing .section .total li .num {
  line-height: 26px;
  font-size: 18px;
  font-weight: 600;
  color: rgba(50, 62, 97, 1);
}
.newBtn {
  margin-top: 40px;
}
.newBtn button {
  width: 95px;
  height: 40px;
  background: rgba(83, 118, 255, 1);
  border-radius: 4px;
  color: #fff;
}

.newBtn button:nth-child(2) {
  color: #323e61;
  background: none;
}
.input280.el-input {
  width: 280px;
}
.input348.el-input {
  width: 352px;
}
.input170.el-input {
  width: 170px;
  margin-right: 8px;
}
.input106.el-input {
  width: 108px;
  margin-right: 8px;
}
</style>
