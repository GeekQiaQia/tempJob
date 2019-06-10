<script> 
// 手机号校验
const check_mobile = (rule, value, callback) => {
  var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (reg.test(value)) {
    callback();
  } else {
    return callback(new Error("手机号格式错误"));
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
// 行号、账号等首字母可为零数字校验
const check_zero_digit = (rule, value, callback) => {
  var reg = /^\+?[0-9][0-9]*$/;
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

// 校验只能输入中文(必填)
const check_chinese = (rule, value, callback) => {
  var reg = /^[\u2E80-\u9FFF]+$/; //Unicode编码中的汉字范围
  if (reg.test(value)) {
    callback();
  } else {
    callback(new Error("请输入中文"));
  }
};
// 校验只能输入中文(非必填)
var check_chinese_not = (rule, value, callback) => {
  if (value == "" || value == null) {
    callback();
    return;
  }
  var reg = /^[\u2E80-\u9FFF]+$/; //Unicode编码中的汉字范围
  if (reg.test(value)) {
    callback();
  } else {
    callback(new Error("请输入中文"));
  }
};
// 剩余期限计算
var DateCalculate = (value, val) => {
  let time;
  if ((value + "").indexOf("-") == -1) {
    time =
      (value + "").substr(0, 4) +
      "-" +
      (value + "").substr(4, 2) +
      "-" +
      (value + "").substr(6, 2);
  } else {
    time = value;
  }
  let inDayNum;
  let day = Math.ceil((new Date(time + "") - new Date()) / (3600 * 1000 * 24));
  if (day < 0) {
    return (inDayNum = 0);
  } else {
    return (inDayNum = day - 0 + (val - 0));
  }
};
export default {
  check_mobile,
  check_zero_digit,
  check_chinese,
  check_chinese_not,
  DateCalculate
};
</script>
