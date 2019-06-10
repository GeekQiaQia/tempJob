<template>
  <div class="el-calendar">
    <div id="selectBtn">
      <el-button class="btn" :class='{"halfSelected":halfYear}' @click="selectHalfDelay()" >半年</el-button>
      <el-button class="btn" :class='{"fullSelected":fullYear}' @click="selectFullDelay()" >一年</el-button>
    </div>
    <div class="el-calendar__header">
      <div class="el-calendar__description">
        <slot name="description"></slot>
      </div>
      <div class="el-calendar__title">
        {{ i18nDate }}
      </div>
      <div
        class="el-calendar__button-group"
        v-if="validatedRange.length === 0">
        <el-button-group>
          <el-button
            type="plain"
            size="mini"
            @click="selectDate('prev-month')">
            {{ t('el.datepicker.prevMonth') }}
          </el-button>
          <el-button
            type="plain"
            size="mini"
            @click="selectDate('today')">
            {{ t('el.datepicker.today') }}
          </el-button>
          <el-button
            type="plain"
            size="mini"
            @click="selectDate('next-month')">
            {{ t('el.datepicker.nextMonth') }}
          </el-button>
        </el-button-group>
      </div>
    </div>
    <div
      class="el-calendar__body"
      v-if="validatedRange.length === 0"
      key="no-range">
      <date-table
        :date="date"
        :selected-day="realSelectedDay"
        :due-time="durTime"
        @pick="pickDay" />
    </div>
    <div
      v-else
      class="el-calendar__body"
      key="has-range">
      <date-table
        v-for="(range, index) in validatedRange"
        :key="index"
        :date="range[0]"
        :selected-day="realSelectedDay"
        :due-time="durTime"
        :range="range"
        :hide-header="index !== 0"
        @pick="pickDay" />
    </div>
  </div>
</template>

<script>
  import Locale from '../mixins/locale';
  import fecha from '../utils/date';
  import DateTable from './date-table';
  import eventBus from '../utils/eventBus'
  import {validateRangeInOneMonth} from '../utils/date-util';

  const validTypes = ['prev-month', 'today', 'next-month'];
const oneDay = 86400000;

export default {
  name: 'CoCalendar',

  data() {
    return {
      selectedDay: '',
      durTime:6,
      halfYear:true,
      fullYear:false,
      type:this.readOnly,
      now: new Date()
    };
  },
  mixins: [Locale],

  components: {
    DateTable
  },

  props: {
    pickedDay:String,
    readOnly:Boolean,
    value: [Date, String, Number],
    range: {
      type: Array,
      validator(range) {
        if (Array.isArray(range)) {
          return range.length === 2 && range.every(
            item => typeof item === 'string' ||
            typeof item === 'number' ||
            item instanceof Date);
        } else {
          return true;
        }
      }
    }
  },

  provide() {
    return {
      elCalendar: this,
      readOnly:this.readOnly
    };
  },

  methods: {
    //date1:小日期   date2:大日期
    DateMinus(date1,date2){
      var sdate = new Date(date1);
      var now = new Date(date2);
      var days = now.getTime() - sdate.getTime();
      var day = parseInt(days / (1000 * 60 * 60 * 24));
      return day;
    },
    /*
    * 初始化，获取当天的加天到期日；加天到期日到calendar.vue 计算显示；
    * */
    handleTodayDelayedDayEvent(){
      const day = this.formatedToday;
      const delayDay=this.AddMonth(day,this.durTime);
      console.log(day,delayDay);
      let minusCount= this.DateMinus(day,delayDay);
      return [day,delayDay, minusCount];
    },
    /**
     * 当点击到期类型选择的时候，需要做两件事情：
     * 1.当前选择的到期日的重新计算；
     * 2.当前选择的加天到期天数的计算；
     * */
    selectHalfDelay(event){
      console.log("selectHalfDelay",this.halfYear);
      this.halfYear = !this.halfYear;
      this.fullYear = !this.fullYear;
      if(this.durTime===6){
        this.durTime=12;
      }else if(this.durTime===12){
        this.durTime=6;
      }
      this.$emit("yearSelectedEvent",this.durTime);
      console.log(this.durTime);
    },
    /**
     * 当点击到期类型选择的时候，需要做两件事情：
     * 1.当前选择的到期日的重新计算；
     * 2.当前选择的加天到期天数的计算；
     * */
    selectFullDelay(event){
      console.log("selectFullDelay");
      this.halfYear = !this.halfYear;
      this.fullYear = !this.fullYear;
      if(this.durTime===6){
        this.durTime=12;
      }else if(this.durTime===12){
        this.durTime=6;
      }
      this.$emit("yearSelectedEvent",this.durTime);
      console.log(this.durTime);
  },
    pickDay(day) {
      console.log(day,this.readOnly);
      if(!this.readOnly){
        // 选择点击日历
        this.getPickedDelayedDate(day);
      }
      this.realSelectedDay = day;
    },
    add0(m){return m<10?'0'+m:m },
    AddMonth(date, num)
    {
      date=new Date(date);
      let delayDay=date.setMonth(date.getMonth() + num);
      let time = new Date(delayDay);
      let y = time.getFullYear();
      let m = time.getMonth()+1;
      let d = time.getDate();
      return y+'-'+this.add0(m)+'-'+this.add0(d);

    },
    /*
    * 获取选择了到期年限以后的，已经选择的到期日未加天之前的到期日；
    * 到期日=is-selected date
    * */
    getYearSelectedDelayedDate(){
      console.log("main.vue into the delayed day");
      let today=this.formatedToday;
      let dueTime=this.durTime;
      console.log(this.durTime);
      let delayDay=this.AddMonth(today,dueTime);
      // 选择已经选择的到期日；
      eventBus.$emit("pickedDayEvent",[today,delayDay]);
      //this.pickDay(delayDay);
    },
    /*
    *  return:当前点击选择日期的非加天，半年或者一年的到期日；
    * */
    getPickedDelayedDate(value){
      let pickedDate=value;
      let delayDay=this.AddMonth(pickedDate,this.durTime);
      console.log(" choose picked day event");
      eventBus.$emit("pickedDayEvent",[pickedDate,delayDay]);

    },
    selectDate(type) {
      if (validTypes.indexOf(type) === -1) {
        throw new Error(`invalid type ${type}`);
      }
      let day = '';
      if (type === 'prev-month') {
        day = `${this.prevMonthDatePrefix}-01`;
        console.log(this.prevMonthDatePrefix);
        console.log(day);
      } else if (type === 'next-month') {
        day = `${this.nextMonthDatePrefix}-01`;
        console.log(this.nextMonthDatePrefix);
      } else {
        console.log("today");
        day = this.formatedToday;
        console.log(day);
      }

      if (day === this.formatedDate) return;
      this.pickDay(day);
    },

    toDate(val) {
      if (!val) {
        throw new Error('invalid val');
      }
      return val instanceof Date ? val : new Date(val);
    },
    /*
    * 处理点击到期期限时间段；半年/一年；
    * 如果是展示到期日日历，
    * 则获取到期对应的当前已经选择的日期的到期日；
    * */
    handleYearSelectedEvent (arg) {
      console.log(arg);
      if(this.type){
        // 获取展示日历中点击日期；
        this.getYearSelectedDelayedDate();
      }
  },
    handleDelayDayEvent(val){

      console.log("calendar type is ",this.readOnly,this.selectedDay," delayedDayEvent choosed pickedDay:",val);

      if(this.readOnly){
        this.pickDay(val)
      }
    }
  },

  computed: {
    prevMonthDatePrefix() {
      const temp = new Date(this.date.getTime());
      temp.setDate(0);
      console.log(temp);
      return fecha.format(temp, 'yyyy-MM');
    },

    curMonthDatePrefix() {
      return fecha.format(this.date, 'yyyy-MM');
    },

    nextMonthDatePrefix() {
      const temp = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
      return fecha.format(temp, 'yyyy-MM');
    },

    formatedDate() {
      console.log(fecha);
      return fecha.format(this.date, 'yyyy-MM-dd');
    },

    i18nDate() {
      const year = this.formatedDate.slice(0, 4);
      console.log(this.formatedDate.slice(5, 7));
      const month = this.formatedDate.slice(5, 7).replace(/^(0+)/, '');
      console.log("----------------------------------------",month);
      return `${year} ${this.t('el.datepicker.year')} ${this.t('el.datepicker.month' + month)}`;
    },

    formatedToday() {
      return fecha.format(this.now, 'yyyy-MM-dd');
    },

    realSelectedDay: {
      get() {
        if (!this.value) return this.selectedDay;
        return this.formatedDate;
      },
      set(val) {
        this.selectedDay = val;
        const date = new Date(val);
        this.$emit('input', date);
      }
    },

    date() {
      if (!this.value) {
        if (this.realSelectedDay) {
          return new Date(this.selectedDay);
        } else if (this.validatedRange.length) {
          return this.validatedRange[0][0];
        }
        return this.now;
      } else {
        return this.toDate(this.value);
      }
    },

    // if range is valid, we get a two-digit array
    validatedRange() {
      let range = this.range;
      if (!range) return [];
      const expetedMap = {
        0: {
          value: 1,
          message: 'start of range should be Monday.'
        },
        1: {
          value: 0,
          message: 'end of range should be Sunday.'
        }
      };
      range = range.reduce((prev, val, index) => {
        const date = this.toDate(val);
        if (date.getDay() !== expetedMap[index].value) {
          console.warn('[ElementCalendar]', expetedMap[index].message, ' invalid range will be ignored');
        } else {
          prev = prev.concat(date);
        }
        return prev;
      }, []);
      if (range.length === 2) {
        const [start, end] = range;
        if (start > end) {
          console.warn('[ElementCalendar]end time should be greater than start time');
          return [];
        }
        // start time and end time in one month
        if (validateRangeInOneMonth(start, end)) {
          return [
            [start, end]
          ];
        }
        const data = [];
        let startDay = new Date(start.getFullYear(), start.getMonth() + 1, 1);
        const lastDay = this.toDate(startDay.getTime() - oneDay);
        if (!validateRangeInOneMonth(startDay, end)) {
          console.warn('[ElementCalendar]start time and end time interval must not exceed two months');
          return [];
        }
        data.push([
          start,
          lastDay
        ]);
        let interval = startDay.getDay();
        interval = interval <= 1 ? Math.abs(interval - 1) : (8 - interval);
        startDay = this.toDate(startDay.getTime() + interval * oneDay);
        if (startDay.getDate() < end.getDate()) {
          data.push([
            startDay,
            end
          ]);
        }
        return data;
      }
      return [];
    }
  },
  mounted(){
    // if(this.type){
    //   this.getDelayedDate();
    // }
  },
  created() {
    // 监听半年/一年到期类型选择
    //eventBus.$on("yearSelectedEvent",this.handleYearSelectedEvent);
    // 监听获取加天到期日；
    eventBus.$on("delayedDayEvent",this.handleDelayDayEvent);
    // 在初始化时候，获取当天的加天到期日；发送过去一个数组；[day,delayDay, minusCount]
    eventBus.$emit("todayDelayedDayEvent",this.handleTodayDelayedDayEvent());
  },
  beforeDestroy() {

  }

};
</script>
