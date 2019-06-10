import Calendar from './src/index.js';
const components=[Calendar];
const install = function(Vue, opts = {}) {

    components.forEach(component => {
        Vue.component(component.name, component);
    });
};

export default install
if(typeof module==="object"&&module.exports){
    module.exports.install=install;
}
/* istanbul ignore if */
// if (typeof window !== 'undefined' && window.Vue) {
//     console.log(window.Vue);
//     install(window.Vue);
// }
//
// export default {
//     Calendar
// }