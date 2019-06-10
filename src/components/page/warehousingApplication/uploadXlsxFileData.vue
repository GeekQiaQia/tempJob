<template>
   <div>
       <div class="reviewContainer">
           <div class="fl uploadHeader">
               <div class="logo">
                   <img   src="../../../assets/img/logo_.png" alt>
               </div>
               <div class="fileName">
                   <span>{{uploadFileName}}</span>
               </div>
           </div>

           <div class="splitLine"></div>
           <div class="excelTable">
               <el-table
                       :data="tableData"
                       style="width: 99%"
                       max-height="600px">
                   <el-table-column
                           prop="orderNo"
                           label="序号"
                           width="50">
                   </el-table-column>
                   <el-table-column
                           prop="ticketNo"
                           label="票号"
                           width="200">
                   </el-table-column>
                   <el-table-column
                           prop="ticketAmount"
                           label="票面金额"
                           width="120">
                   </el-table-column>
                   <el-table-column
                           prop="draftDate"
                           label="出票日期"
                           width="120">
                   </el-table-column>
                   <el-table-column
                           prop="expireDate"
                           label="汇票到期日"
                           width="120">
                   </el-table-column>
                   <el-table-column
                           prop="drawer"
                           label="出票人"
                           width="200">
                   </el-table-column>
                   <el-table-column
                           prop="drawerAccountNo"
                           label="出票人账号"
                           width="150">
                   </el-table-column>
                   <el-table-column
                           prop="drawerBank"
                           label="出票人开户行"
                           width="120">
                   </el-table-column>
                   <el-table-column
                           prop="receiver"
                           label="收款人"
                           width="200">
                   </el-table-column>
                   <el-table-column
                           prop="receiverAccountNo"
                           label="收款人账号"
                           width="150">
                   </el-table-column>
                   <el-table-column
                           prop="receiverBank"
                           label="收款人开户行"
                           width="120">
                   </el-table-column>
                   <el-table-column
                           prop="accepter"
                           label="承兑人"
                           width="200">
                   </el-table-column>
                   <el-table-column
                           prop="accepterAccountNo"
                           label="承兑人账号"
                           width="150">
                   </el-table-column>
                   <el-table-column
                           prop="accepterBank"
                           label="承兑人开户行"
                           width="120">
                   </el-table-column>
                   <el-table-column
                           prop="accepterBankNo"
                           label="承兑人开户行行号"
                           width="169">
                   </el-table-column>
                   <el-table-column
                           prop="canTransfer"
                           label="是否可转让"
                           width="100">
                   </el-table-column>
                   <el-table-column
                           prop="stockPrice"
                           label="入库价格"
                           width="120">
                   </el-table-column>
                   <el-table-column
                           prop="calInterestType"
                           label="计息方式"
                           width="120">
                   </el-table-column>
                   <el-table-column
                           prop="eleRemitCost"
                           label="电汇费"
                           width="120">
                   </el-table-column>
               </el-table>
           </div>
           <div  v-show="tableData.length>0"class="uploadFooter">
               <el-button  @click="confirmUpload()" class="btn confirmBtn">确认上传</el-button>
               <el-button @click="cancelUpload()" class=" btn cancelBtn">取 消</el-button>
           </div>
       </div>
       <div id="errorTipDialog">
           <el-dialog title="提示" class="tipModel" width="88.58%"  top="18.11%" :before-close="cancelUpload" :visible.sync="dialogErrorTipVisible">
               <div class="errorTips">
                   <div class="tipContainer">
                   <span>
                       以下票面信息校验未通过，请根据模板规则修改后再上传，或者继续上传(不包含校验未通过票据)。
                   </span>
                   </div>
               </div>
               <el-table   max-height="200"  width="34px" :data="errData" >
                   <el-table-column property="orderNo" label="序号"  fixed width="50">

                   </el-table-column>
                   <el-table-column property="ticketNo" label="票号" width="300">
                       <template  slot-scope="scope">
                           <span  v-if="toCheckTicketNo(scope.row.ticketNo)">{{scope.row.ticketNo}}</span>
                           <span  class="redSpan" v-else>{{scope.row.ticketNo}}</span>
                       </template>
                   </el-table-column>

                   <el-table-column
                           prop="ticketAmount"
                           label="票面金额"
                           width="120">
                       <template  slot-scope="scope">
                           <span  v-if="toCheckTicketAmount(scope.row.ticketAmount)">{{scope.row.ticketAmount}}</span>
                           <span  class="redSpan" v-else>{{scope.row.ticketAmount}}</span>
                       </template>
                   </el-table-column>
                   <el-table-column
                           prop="draftDate"
                           label="出票日期"
                           width="120">
                       <template  slot-scope="scope">
                           <span  v-if="toCheckDateFormat(scope.row.draftDate)">{{scope.row.draftDate}}</span>
                           <span  class="redSpan" v-else>{{scope.row.draftDate}}</span>
                       </template>
                   </el-table-column>
                   <el-table-column
                           prop="expireDate"
                           label="汇票到期日"
                           width="120">
                       <template  slot-scope="scope">
                           <span  v-if="toCheckDateFormat(scope.row.expireDate)">{{scope.row.expireDate}}</span>
                           <span  class="redSpan" v-else>{{scope.row.expireDate}}</span>
                       </template>
                   </el-table-column>
                   <el-table-column
                           prop="drawer"
                           label="出票人"
                           width="100">
                       <template  slot-scope="scope">
                           <span  v-if="toCheckTenantName(scope.row.drawer)">{{scope.row.drawer}}</span>
                           <span  class="redSpan" v-else>{{scope.row.drawer}}</span>
                       </template>
                   </el-table-column>
                   <el-table-column
                           prop="drawerAccountNo"
                           label="出票人账号"
                           width="150">
                       <template  slot-scope="scope">
                           <span  v-if="toCheckAccountNo(scope.row.drawerAccountNo)">{{scope.row.drawerAccountNo}}</span>
                           <span  class="redSpan" v-else>{{scope.row.drawerAccountNo}}</span>
                       </template>
                   </el-table-column>
                   <el-table-column
                           prop="drawerBank"
                           label="出票人开户行"
                           width="120">
                   </el-table-column>
                   <el-table-column
                           prop="receiver"
                           label="收款人"
                           width="100">
                       <template  slot-scope="scope">
                           <span  v-if="toCheckTenantName(scope.row.receiver)">{{scope.row.receiver}}</span>
                           <span  class="redSpan" v-else>{{scope.row.receiver}}</span>
                       </template>
                   </el-table-column>
                   <el-table-column
                           prop="receiverAccountNo"
                           label="收款人账号"
                           width="150">
                       <template  slot-scope="scope">
                           <span  v-if="toCheckAccountNo(scope.row.receiverAccountNo)">{{scope.row.receiverAccountNo}}</span>
                           <span  class="redSpan" v-else>{{scope.row.receiverAccountNo}}</span>
                       </template>
                   </el-table-column>
                   <el-table-column
                           prop="receiverBank"
                           label="收款人开户行"
                           width="120">
                   </el-table-column>
                   <el-table-column
                           prop="accepter"
                           label="承兑人"
                           width="100">
                       <template  slot-scope="scope">
                           <span  v-if="toCheckTenantName(scope.row.accepter)">{{scope.row.accepter}}</span>
                           <span  class="redSpan" v-else>{{scope.row.accepter}}</span>
                       </template>
                   </el-table-column>
                   <el-table-column
                           prop="accepterAccountNo"
                           label="承兑人账号"
                           width="150">
                       <template  slot-scope="scope">
                           <span  v-if="toCheckAccountNo(scope.row.accepterAccountNo)">{{scope.row.accepterAccountNo}}</span>
                           <span  class="redSpan" v-else>{{scope.row.accepterAccountNo}}</span>
                       </template>
                   </el-table-column>
                   <el-table-column
                           prop="accepterBank"
                           label="承兑人开户行"
                           width="120">
                       <template  slot-scope="scope">
                           <span  v-if="toCheckAccepterInfo(scope.row.accepterBank)">{{scope.row.accepterBank}}</span>
                           <span  class="redSpan" v-else>{{scope.row.accepterBank}}</span>
                       </template>
                   </el-table-column>
                   <el-table-column
                           prop="accepterBankNo"
                           label="承兑人开户行行号"
                           width="169">
                       <template  slot-scope="scope">
                           <span  v-if="toCheckAccepterBankNo(scope.row.accepterBankNo)">{{scope.row.accepterBankNo}}</span>
                           <span  class="redSpan" v-else>{{scope.row.accepterBankNo}}</span>
                       </template>
                   </el-table-column>
                   <el-table-column
                           prop="canTransfer"
                           label="是否可转让"
                           width="100">
                       <template  slot-scope="scope">
                       <span  v-if="!toCheckCanTransfer(scope.row.canTransfer)">{{scope.row.canTransfer}}</span>
                       <span  class="redSpan" v-else>{{scope.row.canTransfer}}</span>
                   </template>
                   </el-table-column>
                   <el-table-column
                           prop="stockPrice"
                           label="入库价格"
                           width="120">
                       <template  slot-scope="scope">
                           <span  v-if="toCheckStockPrice(scope.row.stockPrice,scope.row.calInterestType)">{{scope.row.stockPrice}}</span>
                           <span  class="redSpan" v-else>{{scope.row.stockPrice}}</span>
                       </template>
                   </el-table-column>
                   <el-table-column
                           prop="calInterestType"
                           label="计息方式"
                           width="120">\
                       <template  slot-scope="scope">
                           <span  v-if="!toCheckCalInterestType(scope.row.calInterestType)">{{scope.row.calInterestType}}</span>
                           <span  class="redSpan" v-else>{{scope.row.calInterestType}}</span>
                       </template>
                   </el-table-column>
                   <el-table-column
                           fixed="right"
                           prop="eleRemitCost"
                           label="电汇费"
                           width="120">
                       <template  slot-scope="scope">
                           <span  v-if="toCheckEleRemitCost(scope.row.eleRemitCost)">{{scope.row.eleRemitCost}}</span>
                           <span  class="redSpan" v-else>{{scope.row.eleRemitCost}}</span>
                       </template>
                   </el-table-column>
               </el-table>
               <span slot="footer" class="dialog-footer uploadFooter " >
                <el-button  @click="confirmUpload()" class="btn confirmBtn">继续上传</el-button>
                <el-button @click="dialogErrorTipVisible=false; cancelUpload()" class=" btn cancelBtn">取 消</el-button>

           </span>
           </el-dialog>
       </div>
   </div>
</template>

<script>
    import {confirmBatchUpload} from "@/api/api";
    import eventBus from '../../common/bus'

    export default {
        name: "uploadXlsxFileData",
        data() {
            return {
                billInStockFlowData:{},
                tableData:[],
                rules:[{prop:"ticketNo",validator:this.toCheckTicketNo},
                    {prop:"ticketAmount",validator:this.toCheckTicketAmount},
                    {prop:"draftDate",validator:this.toCheckDateFormat},
                    {prop:"expireDate",validator:this.toCheckDateFormat},
                    {prop:"drawer",validator:this.toCheckTenantName},
                    {prop:"receiver",validator:this.toCheckTenantName},
                    {prop:"accepter",validator:this.toCheckTenantName},
                    {prop:"accepterAccountNo",validator:this.toCheckAccountNo},
                    {prop:"accepterBank",validator:this.toCheckAccepterInfo},
                    {prop:"accepterBankNo",validator:this.toCheckAccepterBankNo},
                    {prop:"canTransfer",validator:this.toCheckCanTransfer},
                    {prop:"stockPrice",validator:this.toCheckStockPrice},
                    {prop:"calInterestType",validator:this.toCheckCalInterestType},
                    {prop:"eleRemitCost",validator:this.toCheckEleRemitCost},
                ],
                convert:[
                    {prop:"canTransfer",convertTo:{1:"可转让",0:"不可转让"},},
                    {prop:"calInterestType",convertTo:{13001:"年息%",13002:"元/每十万"}}
                ],
                calInterestType:{13001:"年息%",13002:"元/每十万"},
                uploadFileName:"",
                dialogErrorTipVisible:false,
                errData:[],
                validData: [],
                uploadData:[]
            }
        },
        methods: {
            // 校验票号  required:true;
            toCheckTicketNo(value){
                {
                    let reg = /^\+?[1-9][0-9]*$/;
                    if(value==null){
                        return false;
                    }
                    let val=value.replace(/\s/g,'');
                    return reg.test(val) && (val.length === 16 || val.length === 30);
                }
            },
            // 校验票面金额 required:true; 输入数字，范围：0.01-10,000,000,000.00
            toCheckTicketAmount(value){
                let reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/;
                if(value===null || value===0){
                   return false;

                }
                return reg.test(value);
            },

            // 出票日期draftDate 校验是否为空 日期格式，2019-03-20
            // 汇票到期日  expireDate  校验是否为空 日期格式，2019-03-20
            toCheckDateFormat(value){

                value=value+"";
                ///传入格式是value:20190605 校验格式是2019-03-26；
                let year=value.substr(0,4),
                    month=value.substr(4,2),
                    day=value.substr(6,2);
                value=year+"-"+month+"-"+day;
                // 验证格式是否正确2019-03-20
                // 验证时间是否合法：(注意：此段必须放置在验证时间格式完成之后)
                let valideReg=/^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/;
                return valideReg.test(value);
            },
            //出票人drawer      required:true;
            // 出票人账号  drawerAccountNo     required:false;
            // 出票人开户行   required:false;

            // 收款人 receiver  required:true;
            // 收款人账号：receiverAccountNo 仅限数字； required:false;
            // 收款人开户行：required:false;

            // 承兑人 accepter  只能输入汉字 required:true
            // 37 承兑人账号 accepterAccountNo  只能输入数字 required:false;
            // 承兑人开户行 accepterBank 只能输入汉字 required:false;
            toCheckTenantName(value){
                let reg = /^[\u2E80-\u9FFF]+$/; //Unicode编码中的汉字范围
                return reg.test(value);
            },
            toCheckAccepterInfo(value){
                if(value!==""){
                    let reg = /^[\u2E80-\u9FFF]+$/; //Unicode编码中的汉字范围
                    return reg.test(value);
                }
                return true;
            },
            toCheckAccountNo(value){
                let reg = /^\+?[0-9][0-9]*$/;
                if(value===null||value===""){
                    return false;

                }
                return reg.test(value);
            },
            //承兑人开户行行号 accepterBankNo ;required:true;
            toCheckAccepterBankNo(value){
                let reg = /^\+?[0-9][0-9]*$/;
                if(value===null||value===""){
                   return false;

                }
                return reg.test(value);
            },
            // 是否可转让： 枚举类型；
            toCheckCanTransfer(value){

                if(value===""||value==null){
                    return false;
                }
                return value===0||value===1;
            },
            // 加天 plusDay    是否为空； required:false;
            // 入库剩余天数dayNum  是否为空； required:false;

            // stockPrice 入库价格  required:true;
            toCheckStockPrice(value,calInterestType){
                let reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/;
                if(value===null || value===0|| value===""){
                   return false;

                }
                if (reg.test(value)) {
                    if(calInterestType===13001||calInterestType===this.calInterestType["13001"]){
                        return 0 < parseFloat(value) && parseFloat(value) < 100;

                    }else if(calInterestType===13002||calInterestType===this.calInterestType["13002"]){
                        return 0 < parseFloat(value) && parseFloat(value) < 100000;
                    }
                }
            },
            /*
             入库计息方式(13001:%年息,13002:元/每十万):
             calInterestType required:false;
             * */
            toCheckCalInterestType(value){
                if(value ===""||value==null){
                    return false;
                }
                return value ==13001|| value ==13002 ;

            },
            // 入库利息：stockInterest required:false;


            // 电汇费  不可以为0； required:false;
            toCheckEleRemitCost(value){
                if(value===0||value==null){
                    return false;
                }
                let reg = /^\+?[1-9][0-9]*$/;
                return reg.test(value);
            },
            // 入库放款 payMoney ,不可以为0； required:false;
            toCheckPayMoney(value){
                return value !== 0;

            },

            handleSelectedFile (convertedData) {
                // 数据结构为对象数组；[{key:value},{key:value},{key:value}]
            },
            confirmUpload(){
                // do something upload
                let reqData=this.validData;
                if(reqData.length>0){
                    confirmBatchUpload(reqData)
                        .then(res=>{
                            if(res.data&&res.data.CODE==="200"){
                                // do something right ;
                                this.uploadData=res.data.RESULT;
                                this.$message({
                                    message:"excel数据上传成功",
                                    type:"success"
                                });
                                this.$router.push("/newWarehousing");
                            }else if(res.data.CODE==="5035"){
                                this.$message({
                                    message:"批次号ID不能为空!",
                                    type:"error"
                                });
                            }else if(res.data.CODE==="5036"){
                                this.$message({
                                    message:"Excel中的票不能为空!",
                                    type:"error"
                                });
                            }else if(res.data.CODE==="5037"){
                                this.$message({
                                    message:"批次号和票号都不存在!",
                                    type:"error"
                                });
                            }
                        })
                        .catch(err=>{
                            this.$message({
                                message:"上传失败",
                                type:"error"
                            });
                        })
                }else{
                    this.$message({
                        message:"上传票面信息校验未通过，请根据模板规则修改后再上传",
                        type:"error"
                    });
                }

            },
            cancelUpload(){
                // do something after cancel
                this.$router.push("/newWarehousing");
            },
            /**
             * validSource:[{key:value,key:value,key:value},{key:value,key:value,key:value}]
             * rules:[{prop:"",validator:""},{prop:"",validator:""},{prop:"",validator:""},{prop:"",validator:""}]
             * ArrayObject.some()/;map();
             *
             *     return boolean; true :存在不符合规则的条目；false; 全部符合条目； 同时返回有效的上传数据；
             * */
            checkPropValidity(validSource,rules){
                let errData=[],
                    validData=[];
                // 遍历每一条记录；
                for(let item of validSource){
                    let record;
                    // 校验每一个校验规则；
                    let checkResult= rules.filter(validate=>{
                       let value=item[validate["prop"]];
                       let checkValidator=validate.validator;
                        if(validate["prop"]==="stockPrice"){
                            // 如果是对stockprice的校验，则需要校验calInterestType的type，然后对其进行不同的校验；
                            return checkValidator(value,item["calInterestType"])===false;
                        }

                        record={"key":validate["prop"],"value":value,",result":checkValidator(value)};

                       return checkValidator(value)===false;
                    });
                    // 检查出来有错误的对象数组并进行格式化数组对象； [{prop: "draftDate","validator":f}, {prop: "draftDate","validator":f}]
                    // 当存在校验未通过的情况下，进行格式化处理；
                  if(checkResult.length>0){
                     // 如果校验未通过；则记录未通过记录；
                      let tempItem=this.convertObjValue(item,this.convert);
                      errData.push(tempItem);
                  }else{
                      //校验通过,则记录用过的item;
                      let validObj={};
                      validObj["batchId"]=item["batchId"];
                      validObj["ticketNo"]=item["ticketNo"];
                      validData.push(validObj);
                  }

                } // end of for in loop


                return {status:errData.length>0,errData,validData};
            } ,// end of checkPropValidity
            /*
            * convert object value;
             convert:[
                     {prop:"canTransfer",convertTo:{1:"可转让",0:"不可转让"},},
                    {prop:"calInterestType",convertTo:{1301:"%年息",13002:"元/每十万"}}
                 ]
            *   obj :Object;
            *   rule:Array;
            * */
            convertObjValue(obj,rule){
                let tempObj=obj;

                for(let item of rule){
                    let val=obj[item["prop"]];
                    let convertRule=item["convertTo"];
                    Object.keys(convertRule).some(function(key){
                        if(key==val){
                            //change the temp obj;
                            tempObj[item["prop"]]=convertRule[key];
                        }
                        return key===val;
                    });
                }
             return tempObj;
            },

            handleExcelData(val){
                let tableData=val.excelDatas;
                this.uploadFileName=val.fileName;
               this.toCheckValidate(tableData);
            },
            handleBillInStockFlowData(val){
                this.billInStockFlowData=val;
            },

            toCheckValidate(tableData){
                let  result= this.checkPropValidity(tableData,this.rules);
                let temp=tableData,
                tableDatas=[];
                for(let item of temp){
                    let tempItem=this.convertObjValue(item,this.convert);
                    tableDatas.push(tempItem);
                }
                this.tableData=tableDatas;

                if(result.status){
                    this.dialogErrorTipVisible=true;
                    this.errData=result.errData;
                    this.validData=result.validData;
                }else{
                    this.validData=result.validData;
                    this.$message({
                        message:"数据校验通过",
                        type:"success"
                    });
                }
            }
        },
        computed: {},
        watch: {},

        created: function () {
            eventBus.$on("excelDataEvent",this.handleExcelData);
            eventBus.$on("billInStockFlow",this.handleBillInStockFlowData);

        },
        mounted: function () {


        },
        updated: function () {

        },
        beforeDestroy() {
        eventBus.$off("excelDataEvent",this.handleExcelData);
        eventBus.$off("billInStockFlow",this.handleBillInStockFlowData);
        eventBus.$emit("uploadDataEvent",[this.uploadData,this.billInStockFlowData])
        }

    }
</script>
<style scoped lang="less" rel="stylesheet/less">
    @btn-blue:rgba(83,118,255,1);
    @bg-white:rgba(220,223,230,1);
    @color-confirm:rgba(255,255,255,1);
    @color-cancel:rgba(50,62,97,1);
    @color-error:rgba(245,108,108,1);
    @color-title:rgba(50,62,97,1);
    @error-tip:rgba(255,239,240,1);
    .tipModel{
        /deep/.el-dialog{

            height:410px;
            min-height:410px;
        }
        /deep/.el-dialog__body {
            padding: 7px 20px;
        }
        /deep/ .el-table{
            font-size:12px;
            .redSpan{
                color: red;
            }

        }
        .errorTips{
            width:708px;
            height:63px;
            background:@error-tip;
            padding: 1px 0px;
            border-radius:4px;
            & .tipContainer{
                width:621px;
                height:48px;
                font-size:14px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:@color-error;
                line-height:24px;
                margin:2.7% 8.73% 4.11% 8.73%;
            }
        }
    }
    .reviewContainer{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
    .splitLine{
        width:100%;
        height:2px;
        background:@bg-white;
    }
    .uploadHeader{
        width:100%;
        height:8.56%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        margin: 2% 0;
        align-items: center;
        .logo{
            width:105px;
            height:42px;
            margin-left:8.33%;
            background-size: 100% 100%;
            img{
                width:105px;
                height:42px;
            }
        }
        .fileName{
            width:25.1%;
            height:28.78%;
            font-size:18px;
            margin-left:27.36%;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color:@color-title;
            line-height:25px;
        }
    }

    .excelTable{
        width:100%;
       max-height: 600px;
        min-height: 500px;
    }
    .uploadFooter{
        width:100%;
        height:15.78%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        .btn{
            border-radius:4px;
            width:95px;
            height:40px;
            font-size:14px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            line-height:20px;
            &.confirmBtn{
                background:@btn-blue;
                color:@color-confirm;
            }
            &.cancelBtn{
                border:1px solid @bg-white;
                color:@color-cancel;
            }
        }

    }

</style>