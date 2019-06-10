import axios from 'axios';
axios.defaults.withCredentials = true;
import qs from "qs";
import router from '../router'

let base = 'https://pjfunconsole.purang.com';
// let base = 'http://10.10.29.68:8882';

axios.interceptors.response.use(function (response) {

    if (response && response.data && response.data.CODE ===401) {
        router.push({ path: '/login' })
    } else {
        return response
    }
});


// 经纪人
export const agent = params => { return axios.get(`${base}/front/querybrokerinfo.htm?brokerName=${params}`) };

// 网点
export const branchWebsits = params => { return axios.get(`${base}/front/querybranchorginfo.htm`) };

//banner
export const login = params => { return axios.post(`${base}/rest/login`, qs.stringify(params)) };

// 左侧菜单栏生成
export const sidebarList = params => { return axios.post(`${base}/rest/auth/resource/findList/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

// 3.角色列表查询接口
export const roleSearchList = params => { return axios.post(`${base}/rest/auth/authRole/list/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

// 4.新增角色资源权限树
export const findListForRole = params => { return axios.post(`${base}/rest/auth/resource/findListForRole/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

// 01租户管理

export const tenantManage = params => { return axios.post(`${base}/rest/auth/tenant/listOne/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

// 保存角色权限

export const authRole = params => { return axios.post(`${base}/rest/auth/authRole/save/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };
// 查询指定角色权限树

export const getAuthRole = params => { return axios.post(`${base}/rest/auth/authRole/get/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

// 退出
export const restLogout = params => { return axios.post(`${base}/rest/restLogout`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

// 租户管理(启用/停用)
export const saveTenantStatus = params => { return axios.post(`${base}/rest/auth/tenant/saveTenantStatus/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

// 租户管理(新增)
export const tenantAdd = params => { return axios.post(`${base}/rest/auth/tenant/saveSuper/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

// 员工管理(启用/停用)
export const saveAuthUserStatus = params => { return axios.post(`${base}/rest/auth/authUser/saveAuthUserStatus/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

// 8.显示租户组织架构树

export const organizeTree = params => { return axios.post(`${base}/rest/auth/department/findList/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

// 4.批量更新角色状态

export const batchUpdate = params => { return axios.post(`${base}/rest/auth/authRole/batchUpdate/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };


//5租户详情

export const tenantDetail = params => { return axios.post(`${base}/rest/auth/tenant/get/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };


//5租户详情修改

export const tenantEdit = params => { return axios.post(`${base}/rest/auth/tenant/save/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };


//员工查询(带部门)

export const userSearch = params => { return axios.post(`${base}/rest/auth/authUser/listTwo/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };



//部门保存

export const saveTree = params => { return axios.post(`${base}/rest/auth/department/saveTree/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };



//员工添加部门查询

export const listDepartmentBox = params => { return axios.post(`${base}/rest/auth/department/listDepartmentBox/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };


//员工添加角色查询

export const authorSearch = params => { return axios.post(`${base}/rest/auth/authRole/listBox/json `, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

// 员工添加

export const authAdds = params => { return axios.post(`${base}/rest/auth/authUser/addUser/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

// 单个员工详情

export const userDetail = params => { return axios.post(`${base}/rest/auth/authUser/userDetail/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

// 员工编辑

export const changeUser = params => { return axios.post(`${base}/rest/auth/authUser/changeUser/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

// 租户校验

export const authCheck = params => { return axios.post(`${base}/rest/auth/tenant/checkoutTenantName/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

// 27.新增入库(获取申请人姓名,部门)

export const getCurrentUser = params => { return axios.post(`${base}/rest/auth/authUser/getCurrentUser/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

// 28.新增入库

export const saveInStockBusinessNo = params => { return axios.post(`${base}/rest/bill/billInStockFlow/saveInStockBusinessNo/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };


// 31.入库查询

export const queryInStockFlowBussiness = params => { return axios.post(`${base}/rest/bill/billInStockFlow/queryInStockFlowBussiness/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

//32.业务单详情

export const getBussinessDetail = params => { return axios.post(`${base}/rest/bill/billInStockFlow/getBussinessDetail/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

//37.出库列表查询接口

export const billOutStockFlow = params => { return axios.post(`${base}/rest/bill/billOutStockFlow/list/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

//34.票据库存列表

export const ticket_list = params => { return axios.post(`${base}/rest/bill/ticket/list/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

//35.票据批量出库-票据详情列表接口

export const listSelected = params => { return axios.post(`${base}/rest/bill/ticket/listSelected/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

//36 9.加天接口

export const getDaysUrl = params => { return axios.post(`${base}/rest/bill/ticket/getDays/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };


//7.审核

export const saveReviewStatus = params => { return axios.post(`${base}/rest/bill/billInStockFlow/saveReviewStatus/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };


//31.移库-出库/出库复核/审批/终审详情页


export const billOutStockFlow_ = params => { return axios.post(`${base}/rest/bill/billOutStockFlow/get/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };
// 新增移库申请人

export const authUser_findList= params => { return axios.post(`${base}/rest/auth/authUser/findList/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

//29.票据移库/出库单详情页提交/复核/审批/终审

export const billOutStockFlow_save= params => { return axios.post(`${base}/rest/bill/billOutStockFlow/save/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

// 3.新增入库(票号校验)
export const checkTicketNo= params => { return axios.post(`${base}/rest/bill/ticket/checkTicketNo/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

//4.用户信息修改(个人中心)
export const userInfoEditor= params => { return axios.post(`${base}/rest/auth/authUser/userInfoEditor/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

//3.用户详情(个人中心)

export const userInfoDetail= params => { return axios.post(`${base}/rest/auth/authUser/userInfoDetail/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };
//5.员工修改登陆密码(个人中心)
export const userUpdatePassword= params => { return axios.post(`${base}/rest/auth/authUser/userUpdatePassword/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };


//6.统计台账(入库/出库)
export const getTotalForm= params => { return axios.post(`${base}/rest/bill/billInStockFlow/getTotalForm/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

// 7 忘记密码（发送手机验证码）
export const getverifyCode= params => { return axios.post(`${base}/rest/auth/authUser/passwordFind/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };
// 7 忘记密码（校验手机号码和验证码）
export const checkVerifyCode= params => { return axios.post(`${base}/rest/auth/authUser/checkVerifyCode/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };
// 7 忘记密码（设置新密码）
export const setNewPassword= params => { return axios.post(`${base}/rest/auth/authUser/newPassword/json`, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }) };

// 批量上传 excel 文件上传；
export const uploadExcelFile=`${base}/rest/bill/billInStockFlow/analysisDataBatchUpload/json`;
//export const downloadExcelFile=`${base}/rest/bill/billInStockFlow/downUploadTemplate/json`;
export const downloadExcelFile=params=>{return axios({
    url: 'http://localhost:8080/img/img.146655c9.jpg',
    method: 'GET',
    responseType: 'blob',
})};


export const selectBatchUploadRecord=params=>{return axios.post(`${base}/rest/bill/billInStockFlow/selectBatchUploadRecord/json`,params,{ headers:{'Content-Type': 'application/json;charset=UTF-8'}})};
// 上传确认上传的数据；
export const confirmBatchUpload=params=>{return axios.post(`${base}/rest/bill/billInStockFlow/selectConfirmBatchUploadRecord/json`,params,{ headers:{'Content-Type': 'application/json;charset=UTF-8'}})};

