import countDown from './countDown.vue'

function install(Vue,options={}){
    Vue.component('count-down', countDown)
}
export default install
if(typeof module==="object"&&module.exports){
    module.exports.install=install;
}