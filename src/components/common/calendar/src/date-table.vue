<script>
import fecha from '../utils/date';
import { range as rangeArr, getFirstDayOfMonth, getPrevMonthLastDays, getMonthDays, getI18nSettings, validateRangeInOneMonth } from '../utils/date-util';
import eventBus from '../utils/eventBus'
export default {
    data() {

        const dayNames = getI18nSettings().dayNames;
        return {
            DAYS: dayNames.slice(1).concat(dayNames[0]),
            pickedDelayedDays:0
        };
    },
  props: {
      transferToday:String,
      selectedDay: String, // formated date yyyy-MM-dd
      dueTime:Number,
      range: {
          type: Array,
          validator(val) {
            if (!(val && val.length)) return true;
            const [start, end] = val;
            return validateRangeInOneMonth(start, end);
          }
      },
     date: Date,
     hideHeader: Boolean
  },


  inject: ['elCalendar','readOnly'],

  methods: {
    toNestedArr(days) {
      return rangeArr(days.length / 7).map((_, index) => {
        const start = index * 7;
        return days.slice(start, start + 7);
      });
    },

    getFormateDate(day, type) {
      if (!day || ['prev', 'current', 'next'].indexOf(type) === -1) {
        throw new Error('invalid day or type');
      }
      let prefix = this.curMonthDatePrefix;
      if (type === 'prev') {
        prefix = this.prevMonthDatePrefix;
      } else if (type === 'next') {
        prefix = this.nextMonthDatePrefix;
      }
      day = `00${day}`.slice(-2);
      return `${prefix}-${day}`;
    },

    getCellClass({ text, type}) {

      const classes = [type];
      if (type === 'current') {
        const date = this.getFormateDate(text, type);
        if (date === this.selectedDay) {
          classes.push('is-selected');
        }
        if (date === this.formatedToday) {
          classes.push('is-today');
        }
          if(this.readOnly && date===this.getDelayedDay()){
              classes.push('DelayedDay');
          }

      }
      return classes;
    },

    pickDay({ text, type }) {
      const date = this.getFormateDate(text, type);
      this.$emit('pick', date);
    },

    cellRenderProxy({ text, type }) {
      let render = this.elCalendar.$scopedSlots.dateCell;
      if (!render) return <span>{ text }</span>;

      const day = this.getFormateDate(text, type);
        const date = new Date(day);
      const data = {
        isSelected: this.selectedDay === day,
        type: `${type}-month`,
        day
      };
      const dayCount=180;
      return render({ date, data,dayCount});
    },
      getDelayedDay(){
          console.log("into the getDelayedDay");
          let today=this.formatedToday;
          console.log("getDelayedDay",this.dueTime);
          let delayDay=this.AddMonth(today,this.dueTime);
          return delayDay;
      },
      add0(m){return m<10?'0'+m:m },
      /**
       * @return {string} 2019-05-23
       * @param {string} start date
       */
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
      //date1:小日期   date2:大日期
      DateMinus(date1,date2){
            var sdate = new Date(date1);
            var now = new Date(date2);
            var days = now.getTime() - sdate.getTime();
            var day = parseInt(days / (1000 * 60 * 60 * 24));
            return day;
    },
      delayCount({ text, type }){
          let render = this.elCalendar.$scopedSlots.dateCell;
          if (!render) return <span>{ text }</span>;
          const day = this.getFormateDate(text, type);
          const delayDay=this.AddMonth(day,this.dueTime);
          let minusCount= this.DateMinus(day,delayDay);
          return minusCount;
      },
      handlePickedDelayedDays(val){
          console.log(val);
          this.pickedDelayedDays=val;
      }

  },
 watch:{


 },
  computed: {

    prevMonthDatePrefix() {
      const temp = new Date(this.date.getTime());
      temp.setDate(0);
      return fecha.format(temp, 'yyyy-MM');
    },

    curMonthDatePrefix() {
      return fecha.format(this.date, 'yyyy-MM');
    },

    nextMonthDatePrefix() {
      const temp = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1);
      return fecha.format(temp, 'yyyy-MM');
    },

    formatedToday() {
      return this.elCalendar.formatedToday;
    },

    isInRange() {
      return this.range && this.range.length;
    },

    rows() {
      let days = [];
      // if range exists, should render days in range.
      if (this.isInRange) {
        const [start, end] = this.range;
        const currentMonthRange = rangeArr(end.getDate() - start.getDate() + 1).map((_, index) => ({
          text: start.getDate() + index,
          type: 'current'
        }));
        let remaining = currentMonthRange.length % 7;
        remaining = remaining === 0 ? 0 : 7 - remaining;
        const nextMonthRange = rangeArr(remaining).map((_, index) => ({
          text: index + 1,
          type: 'next'
        }));
        days = currentMonthRange.concat(nextMonthRange);
      } else {
        const date = this.date;
        const firstDay = getFirstDayOfMonth(date);
        const prevMonthDays = getPrevMonthLastDays(date, firstDay - 1).map(day => ({
          text: day,
          type: 'prev'
        }));
        const currentMonthDays = getMonthDays(date).map(day => ({
          text: day,
          type: 'current'
        }));
        days = [...prevMonthDays, ...currentMonthDays];
        const nextMonthDays = rangeArr(42 - days.length).map((_, index) => ({
          text: index + 1,
          type: 'next'
        }));
        days = days.concat(nextMonthDays);
      }
      return this.toNestedArr(days);
    }
  },
  created(){
        // 监听点击事件计算得到的到期天数；
      eventBus.$on("pickedDelayedDaysEvent",this.handlePickedDelayedDays);
  },

  render() {
    const thead = this.hideHeader ? null : (<thead>
      {
        this.DAYS.map(day => <th key={day}>{ day }</th>)
      }
    </thead>);
    return (
      <table
        class={{
          'el-calendar-table': true,
          'is-range': this.isInRange
        }}
        cellspacing="0"
        cellpadding="0">
        {
          thead
        }
        <tbody>
          {
            this.rows.map((row, index) => <tr
              class={{
                'el-calendar-table__row': true,
                'el-calendar-table__row--hide-border': index === 0 && this.hideHeader
              }}
              key={index}>
              {
                row.map((cell, key) => <td key={key}
                  class={ this.getCellClass(cell) }
                  onClick={this.pickDay.bind(this, cell)}>
                  <div class="el-calendar-day">
                    {
                      this.cellRenderProxy(cell)
                    }

                   <div  class="delayCount">
                    <span>
                  {this.pickedDelayedDays}{"天"}
                    </span>
                  </div>

                  </div>
                </td>)
              }
            </tr>)
          }
        </tbody>
      </table>);
  }

};
</script>
