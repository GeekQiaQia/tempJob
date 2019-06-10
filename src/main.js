import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';
import countDown from './components/common/countDown/countDown';
import calendar from './components/common/calendar/index'


import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';
import './assets/css/iconfont.css'
import './components/common/directives';
import "babel-polyfill";
Vue.use(countDown);
Vue.use(calendar);
import checkData from './components/common/checkData'
Vue.prototype.checkData = checkData;


Vue.config.productionTip = false;
Vue.use(ElementUI, {
    size: 'small'
});
Vue.prototype.$axios = axios;

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('ms_username');
    const status_ = localStorage.getItem('status_');
    if (status_) {
        next()
    } else {
        if (to.path == "/login") {
            next()
        } else if(to.path == "/forgetPassword"){
            next()
        }else {
            next('/login')
        }
    }
});


new Vue({
    router,
    render: h => h(App)
}).$mount('#app');