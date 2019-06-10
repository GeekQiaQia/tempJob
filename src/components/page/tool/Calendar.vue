<template>
   <div>

       <div id="Calendar">
           <div id="selectCalendar">
               <co-calendar :read-only="false" @yearSelectedEvent="handleYearSelectedEvent"  >
                   <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
                   <template slot="description">
                       <span>开票日</span>
                   </template>
                   <template
                           slot="dateCell"
                           slot-scope="{date, data}">
                       <p :class="data.isSelected ? 'is-selected' : ''">
                           {{ data.day.split('-')[2] }}
                       </p>
                   </template>
               </co-calendar>
           </div>
           <div class="splitCalendar"></div>
           <div id="resultCalendar">
              <div class="dateTips">

                  <span class="today">{{this.formatDate(new Date())}} {{weekend}}</span>
                  <div class="dynamicDay">
                      <span class="delayDay">{{todayMinusCount}}</span><span class="day">天</span>
                  </div>
              </div>
               <co-calendar :read-only="readOnly"  >
                   <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
                   <template slot="description">
                       <span>到期日</span>
                   </template>
                   <template
                           slot="dateCell"
                           slot-scope="{date, data}">
                       <p :class="data.isSelected ? 'is-selected' : ''">
                           {{ data.day.split('-')[2] }}
                       </p>
                   </template>
               </co-calendar>
           </div>
       </div>
       <div id="CalendarTips">
           <span>周末、节假日加天系统已自动计算</span>
       </div>
   </div>
</template>

<script>
    import {getDaysUrl} from '../../../api/api'
    import eventBus from '../../common/calendar/utils/eventBus'

    export default {
        name: "Calendar",
        data() {
            return {
                readOnly:true,
                weekend:"",
                pickedDay:"",
                pickedDelayDay:"",
                delayDay:"",
                minusCount:"",
                todayMinusCount:"",
                todayYearSelectDelayedDay:"",
                durTime:6
            }
        },
        methods: {
            /*
            * 处理年类型选择，将计算到期日以及加天到期天数；
            * */
            handleYearSelectedEvent(val) {
                this.durTime = val;
                // 计算新的到期日；
                console.log(this.pickedDay);

                // 重新计算得到=未加天到期日
                let yearSelectDelayedDay = this.AddMonth(this.pickedDay, this.durTime);
                this.todayYearSelectDelayedDay = this.AddMonth(this.formatDate(new Date()), this.durTime);
                console.log(yearSelectDelayedDay);
                console.log(this.todayYearSelectDelayedDay);
                // 请求得到加天到期日以及加天到期天数；
                this.toGetCurrentPlusDay(this.todayYearSelectDelayedDay);
                // 请求计算选择日的加天计算日期；
                this.toGetPlusDay(yearSelectDelayedDay);

            },
            getTodayDelayedDay(val) {
                //[today/day,delayDay, minusCount]
                console.log("delayDayEvent choosed delayYear", val);
                this.pickedDay = val[0];
                this.pickedDelayDay = val[1];
                // this.minusCount=val[2];
                this.toInitCurrentPlusDay(this.pickedDelayDay);

            },
            add0(m) {
                return m < 10 ? '0' + m : m
            },
            AddMonth(date, num) {
                date = new Date(date);
                let delayDay = date.setMonth(date.getMonth() + num);
                let time = new Date(delayDay);
                let y = time.getFullYear();
                let m = time.getMonth() + 1;
                let d = time.getDate();
                return y + '-' + this.add0(m) + '-' + this.add0(d);

            },
            DateMinus(date1, date2) {
                console.log(date1, date2);
                var sdate = new Date(date1);
                var now = new Date(date2);
                var days = now.getTime() - sdate.getTime();
                var day = parseInt(days / (1000 * 60 * 60 * 24));
                return day;
            },
            /**
             *  return: new DATE:计算得到加天日期；
             * */
            toGetPlusDate(dateObj, days) {
                console.log(dateObj);
                let date = new Date(dateObj);
                date.setDate(date.getDate() + days);
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let mm = "'" + month + "'";
                let dd = "'" + day + "'";

                if (mm.length == 3) {
                    month = "0" + month;
                }
                if (dd.length == 3) {
                    day = "0" + day;
                }
                return date.getFullYear() + "-" + month + "-" + day;
            },
            /*
            *  return:；
            *           minusCount：加天后的天数
            *           pickedDelayDay：加天后的到期日
            *  paranms: delayDay:未加天之前的到期日；
            * */
            toGetPlusDay(delayDay) {
                console.log(delayDay);
                // 将格式化字符串日期数值化处理；
                let reqDelayDay = parseInt(delayDay.split("-").join(""));
                let reqData = {
                    maturityDate: reqDelayDay
                };
                //{differDays: 183,plusDay: 0}
                getDaysUrl(reqData)
                    .then(res => {
                        console.log(res);
                        if (res && res.data) {
                            if (res.data.CODE === "200") {
                                let plusDay = res.data.RESULT.plusDay;
                                this.pickedDelayDay = this.toGetPlusDate(delayDay, plusDay);
                                console.log(this.toGetPlusDate(delayDay, plusDay));
                                this.minusCount = this.DateMinus(this.pickedDay, this.pickedDelayDay);
                                console.log(this.pickedDelayDay,this.minusCount);
                                // 向展示组件发送加天以后的到期日；
                                eventBus.$emit("delayedDayEvent", this.pickedDelayDay);
                                // 向date-table.vue 渲染组件，传递计算到期天数
                                eventBus.$emit("pickedDelayedDaysEvent", this.minusCount);

                                // 如果加天大于0;则修改当前的加天后日期：pickedDelayDay and  加天后的到期天数：minusCount;
                                // if (plusDay > 0) {
                                //     console.log(this.toGetPlusDate(delayDay, plusDay));
                                //     this.minusCount = this.DateMinus(this.pickedDay, this.pickedDelayDay);
                                //     console.log(this.pickedDelayDay,this.minusCount);
                                //     // 向展示组件发送加天以后的到期日；
                                //     eventBus.$emit("delayedDayEvent", this.pickedDelayDay);
                                //     // 向date-table.vue 渲染组件，传递计算到期天数
                                //     eventBus.$emit("pickedDelayedDaysEvent", this.minusCount);
                                // } else {
                                //
                                //     this.minusCount = this.DateMinus(this.pickedDay, this.pickedDelayDay);
                                //     // 向展示组件发送加天以后的到期日；
                                //     eventBus.$emit("delayedDayEvent", this.pickedDelayDay);
                                //     // 向date-table.vue 渲染组件，传递计算到期天数
                                //     eventBus.$emit("pickedDelayedDaysEvent", this.minusCount);
                                // }
                            }
                        }
                    })
                    .catch(err => {
                        this.$message({
                            message:"请求异常",
                            type: "error"
                        });
                    })
            },
            /*
            * 获取当天加天后的天数；
            * */
            toGetCurrentPlusDay(delayDay) {
                console.log(delayDay);
                // 将格式化字符串日期数值化处理；
                let reqDelayDay = parseInt(delayDay.split("-").join(""));
                let reqData = {
                    maturityDate: reqDelayDay
                };
                getDaysUrl(reqData)
                    .then(res => {
                        console.log(res);
                        if (res && res.data) {
                            if (res.data.CODE === "200") {
                                let plusDay = res.data.RESULT.plusDay;
                                console.log(this.toGetPlusDate(delayDay, plusDay));
                                this.pickedDelayDay = this.toGetPlusDate(delayDay, plusDay);
                                this.todayMinusCount = this.DateMinus(this.formatDate(new Date()), this.pickedDelayDay);
                                console.log("----------------------------", this.pickedDelayDay,this.todayMinusCount);
                                // 发送做初始化赋值；
                                //eventBus.$emit("delayedDayEvent", this.pickedDelayDay);
                                // 如果加天大于0;则修改当前的加天后日期：pickedDelayDay and  加天后的到期天数：minusCount;
                                // if (plusDay > 0) {
                                //     this.todayMinusCount = this.DateMinus(this.formatDate(new Date()), this.pickedDelayDay);
                                //     console.log("----------------------------", this.todayMinusCount);
                                //     // 向展示组件发送加天以后的到期日；
                                //    // eventBus.$emit("delayedDayEvent", this.pickedDelayDay);
                                // } else {
                                //     this.todayMinusCount = this.DateMinus(this.formatDate(new Date()), this.pickedDelayDay);
                                //     console.log("----------------------------", this.todayMinusCount);
                                //     // 向展示组件发送加天以后的到期日；
                                //     //eventBus.$emit("delayedDayEvent", this.pickedDelayDay);
                                // }
                            }
                        }
                    })
                    .catch(err => {
                        this.$message({
                            message: "请求异常",
                            type: "error"
                        });
                    })
            },
            toInitCurrentPlusDay(delayDay){
                console.log(delayDay);
                // 将格式化字符串日期数值化处理；
                let reqDelayDay = parseInt(delayDay.split("-").join(""));
                let reqData = {
                    maturityDate: reqDelayDay
                };
                getDaysUrl(reqData)
                    .then(res => {
                        console.log(res);
                        if (res && res.data) {
                            if (res.data.CODE === "200") {
                                let plusDay = res.data.RESULT.plusDay;
                                console.log(this.toGetPlusDate(delayDay, plusDay));
                                this.pickedDelayDay = this.toGetPlusDate(delayDay, plusDay);
                                this.todayMinusCount = this.DateMinus(this.formatDate(new Date()), this.pickedDelayDay);
                                console.log("----------------------------", this.pickedDelayDay,this.todayMinusCount);
                                // 发送做初始化赋值；
                                eventBus.$emit("delayedDayEvent", this.pickedDelayDay);
                                // 如果加天大于0;则修改当前的加天后日期：pickedDelayDay and  加天后的到期天数：minusCount;
                                // if (plusDay > 0) {
                                //     this.todayMinusCount = this.DateMinus(this.formatDate(new Date()), this.pickedDelayDay);
                                //     console.log("----------------------------", this.todayMinusCount);
                                //     // 向展示组件发送加天以后的到期日；
                                //    // eventBus.$emit("delayedDayEvent", this.pickedDelayDay);
                                // } else {
                                //     this.todayMinusCount = this.DateMinus(this.formatDate(new Date()), this.pickedDelayDay);
                                //     console.log("----------------------------", this.todayMinusCount);
                                //     // 向展示组件发送加天以后的到期日；
                                //     //eventBus.$emit("delayedDayEvent", this.pickedDelayDay);
                                // }
                            }
                        }
                    })
                    .catch(err => {
                        this.$message({
                            message: "请求异常",
                            type: "error"
                        });
                    })
            },
            handlePickedDayEvent(val) {
                console.log("pickedDayEvent choosed delayDay:", val);
                // 获得点击选择的日期以及对应的到期日
                this.pickedDay = val[0];
                this.pickedDelayDay = val[1];
                // 得到对应到期日的加天日期以及加天天数；
                this.toGetPlusDay(val[1]);
            },
            formatDate (date) {
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? '0' + m : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                let weekdays=new Array(7);
                weekdays[0]="星期天";
                weekdays[1]="星期一";
                weekdays[2]="星期二";
                weekdays[3]="星期三";
                weekdays[4]="星期四";
                weekdays[5]="星期五";
                weekdays[6]="星期六";
                this.weekend=weekdays[date.getDay()];
                return y + '-' + m + '-' + d;
            },
            // formatDate(dateObj, mask, i18nSettings) {
            //
            //     if (typeof dateObj === 'number') {
            //         dateObj = new Date(dateObj);
            //     }
            //     let fullDate = dateObj.toString().slice(0, 10);
            //     return fullDate;
            //
            // },
        },
        computed: {},
        created: function () {
            eventBus.$on("todayDelayedDayEvent",this.getTodayDelayedDay);
            eventBus.$on("pickedDayEvent",this.handlePickedDayEvent)
        },
        mounted: function () {

        },
        updated: function () {

        },
        beforeDestroy() {

        }
    }
</script>

<style scoped lang="less" rel="stylesheet/less">
    #Calendar{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-end;
        .splitCalendar{
            width: 9px;
            height: 70vh;
            margin-left: 13px;
            background: #d4cece1c;
            background:  -webkit-gradient(linear, right top, left top, from(#efefef7a), to(#e8e8e800)); /* Safari 5.1 - 6.0 */
            background:  -o-gradient(linear, right top, left top, from(#efefef7a), to(#e8e8e800)); /* Opera 11.1 - 12.0 */
            background:  -moz-gradient(linear, right top, left top, from(#efefef7a), to(#e8e8e800)); /* Firefox 3.6 - 15 */
            text-shadow: 13px 15px 31px rgba(0, 0, 0, 0.16);
        }
        /deep/ #selectCalendar{
            width: 55.89%;
            margin-left: 4vw;
            .el-calendar__header{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                flex-wrap: nowrap;
            }
            .el-calendar__description{
                width:54px;
                height:26px;
                font-size:18px;
                font-family:"PingFangSC-Medium";
                font-weight:500;
                color:rgba(89,102,137,1);
                line-height:26px;
            }
            .el-calendar__title{
                width:auto;
                height:26px;
                font-size:18px;
                font-family:"PingFangSC-Medium";
                font-weight:500;
                color:rgba(89,102,137,1);
                line-height:26px;
            }
            .el-calendar__button-group{
                margin-right: -1vw;
            }
            #selectBtn{
                width: 20vw;
                margin-top: 3vh;
                margin-left: 34vw;
                margin-bottom: 14px;
                height: auto;
                .el-button+.el-button{
                    margin-left: -1px;
                }
                .btn{
                    width:82px;
                    height:32px;
                    border-radius:4px 0px 0px 4px;
                    &.fullSelected{
                        background:rgba(83,118,255,1);
                        color: #ffffff;
                }
                    &.halfSelected{
                        color: #ffffff;
                        background:rgba(83,118,255,1);
                    }
                }
            }

            & .el-calendar-table {
                & .el-calendar-table__row{
                    .delayCount{
                        display: none;
                    }
                     td.is-selected{
                        .delayCount{
                            display: block;
                        }
                    }
                    td:nth-last-child(1){
                        .delayCount{
                            display: none;
                        }
                    }
                    td:nth-last-child(2){
                        .delayCount{
                            display: none;
                        }
                    }
                   & .current{
                       & .el-calendar-day{
                           & .delayCount{
                               width: auto;
                               height: 20px;
                               /*border: 1px solid;*/
                               margin-left: 25px;
                               font-size: 13px;
                               margin-top: 8px;
                               font-family:DINCond-Black;
                               font-weight:900;
                               color:rgba(89,102,137,1);
                           }
                       }
                   }
                }

            }


            .el-calendar-table td.is-today{
                & p{
                    display: inline-block;
                    width:36px;
                    height:36px;
                    border-radius:20px;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    color: white;
                    align-items: center;
                    background:linear-gradient(180deg,rgba(255,195,55,1) 0%,rgba(255,164,67,1) 100%);
                }
            }
            .el-calendar-table td.is-selected{
                 p{
                     width:36px;
                     height:36px;
                     border-radius:20px;
                     display: flex;
                     flex-direction: row;
                     justify-content: center;
                     color: white;
                     align-items: center;
                     background:linear-gradient(180deg,rgba(119,132,255,1) 0%,rgba(97,123,255,1) 100%);

                 }
             }
        }
        /deep/ #resultCalendar{
            width:30.89%;
            margin-left:1vw;
            height:72.33%;
           // box-shadow:0px 2px 12px 0px rgba(0,0,0,0.06);
           .dateTips{
               position: relative;
               color:rgba(255,255,255,1);
               height: 18vh;
               background-image: url("../../../assets/img/calendar.png");
               background-repeat: no-repeat;
               background-size: 100% 100%;
               .today{
                   width:148px;
                   height:22px;
                   font-size:16px;
                   font-family:"PingFangSC-Medium";
                   font-weight:500;
                   letter-spacing: 2px;
                   line-height:22px;
                   text-shadow:0px 2px 11px rgba(0,0,0,0.16);

                   position: absolute;
                   margin-top: 17px;
                   margin-left: 14px;
               }
               .dynamicDay{
                   display: flex;
                   flex-direction: row;
                   justify-content: flex-start;
                   align-items: center;
                   .delayDay{
                       margin-left: 40px;
                       margin-top: 39px;
                       width:87px;
                       height:48px;
                       font-size:41px;
                       font-family:DINCond-Black;
                       font-weight:900;

                       line-height:48px;
                       text-shadow:0px 2px 11px rgba(26,49,85,0.16);
                   }
                   .day{
                      margin-top: 54px;
                   }
               }

           }
            img{
                width:100%;
            }
            & .el-calendar{
                height:60%;
                #selectBtn{
                    display: none;
                }
                .el-calendar__header{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: nowrap;
                }
                .el-calendar__description{
                    width:54px;
                    height:26px;
                    font-size:18px;
                    font-family:"PingFangSC-Medium";
                    font-weight:500;
                    color:rgba(89,102,137,1);
                    line-height:26px;
                }
                .el-calendar__title{
                    margin-right:10vw;
                    width:auto;
                    height:26px;
                    font-size:18px;
                    font-family:"PingFangSC-Medium";
                    font-weight:500;
                    color:rgba(89,102,137,1);
                    line-height:26px;
                }
                & .el-calendar-table .el-calendar-day{
                    height: 6vh;
                }
                .el-calendar__button-group{
                    display: none;
                }

            }
            & .el-calendar-table {
                & .el-calendar-table__row{
                    & .el-calendar-day{
                        & .delayCount{
                            display: none;
                        }
                    }
                }

            }
            & .el-calendar-table {
                & .el-calendar-table__row{
                    & .DelayedDay{
                        & .el-calendar-day{
                           p{
                               width:36px;
                               height:36px;
                               border-radius:20px;
                               display: flex;
                               flex-direction: row;
                               justify-content: center;
                               color: white;
                               align-items: center;
                               background:linear-gradient(180deg,rgba(255,195,55,1) 0%,rgba(255,164,67,1) 100%);
                           }
                        }
                    }

                }

            }
            .el-calendar-table td.is-selected{
                p{
                    width:36px;
                    height:36px;
                    border-radius:20px;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    color: white;
                    align-items: center;
                    background:linear-gradient(180deg,rgba(119,132,255,1) 0%,rgba(97,123,255,1) 100%);

                }
            }
            .el-calendar-table tr td:first-child{
                border-left: 0px solid #EBEEF5;
            }
            .el-calendar-table td{
                /* border-bottom: 1px solid #EBEEF5; */
                /* border-right: 1px solid #EBEEF5; */
                border-bottom: 0px solid #EBEEF5;
                border-right: 0px solid #EBEEF5;
            }
        }
    }
    #CalendarTips{
        margin-left: 4vw;
        span{
            width:14.58%;
            height:20px;
            font-size:14px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(163,173,200,1);
            line-height:20px;
        }
    }

</style>