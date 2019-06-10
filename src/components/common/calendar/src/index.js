import CoCalendar from './main';

// function install(Vue,options={}){
//   Vue.component(CoCalendar.name, CoCalendar)
// }
// export default install
// if(typeof module==="object"&&module.exports){
//   module.exports.install=install;
// }

/* istanbul ignore next */
CoCalendar.install = function(Vue) {
  Vue.component(CoCalendar.name, CoCalendar);
};

export default CoCalendar;