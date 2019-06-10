import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/warehousingApplication'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            // meta: { resourceName: '自述文件' },
            children: [
                // {
                //     path: '/dashboard',
                //     component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                //     meta: { resourceName: '首页' }
                // },
                {
                    path: '/warehousingApplication',
                    component: resolve => require(['../components/page/warehousingApplication/warehousingApplication.vue'], resolve),
                    meta: { resourceName: '入库申请',title:true }
                }, 
                { 
                    path: '/newWarehousing',
                    component: resolve => require(['../components/page/warehousingApplication/newWarehousing.vue'], resolve),
                    meta: { resourceName: '新增入库',title:true }
                },
                { 
                    path: '/editWarehousing',
                    component: resolve => require(['../components/page/warehousingApplication/editWarehousing.vue'], resolve),
                    meta: { resourceName: '修改入库',title:true }
                },
                {
                    path: '/warehousingReview',
                    component: resolve => require(['../components/page/warehousingApplication/warehousingReview.vue'], resolve),
                    meta: { resourceName: '入库复核' ,title:true}
                },
                {
                    path: '/warehousingApproval',
                    component: resolve => require(['../components/page/warehousingApplication/warehousingApproval.vue'], resolve),
                    meta: { resourceName: '入库审批' ,title:true }
                }, 
                {
                    path: '/finalAppeal',
                    component: resolve => require(['../components/page/warehousingApplication/finalAppeal.vue'], resolve),
                    meta: { resourceName: '入库终审' ,title:true }
                },
                {
                    path: '/businessDetails',
                    component: resolve => require(['../components/page/warehousingApplication/businessDetails.vue'], resolve),
                    meta: { resourceName: '业务单详情',title:true},
                    name:'businessDetails' 
                },
                
                {
                    path: '/outgoingApplication',
                    component: resolve => require(['../components/page/outgoingApplication/outgoingApplication.vue'], resolve),
                    meta: { resourceName: '出库申请' }
                },
                {
                    path: '/outboundReview',
                    component: resolve => require(['../components/page/outgoingApplication/outboundReview.vue'], resolve),
                    meta: { resourceName: '出库复核',title:true }
                },// 先移库再出库
                {
                    path: '/outboundApproval',
                    component: resolve => require(['../components/page/outgoingApplication/outboundApproval.vue'], resolve),
                    meta: { resourceName: '出库审批',title:true }
                },

                {
                    path: '/deliveryFinalAppeal',
                    component: resolve => require(['../components/page/outgoingApplication/deliveryFinalAppeal.vue'], resolve),
                    meta: { resourceName: '出库终审',title:true }
                },
                {
                    path: '/modifyTheOutbound',
                    component: resolve => require(['../components/page/outgoingApplication/modifyTheOutbound.vue'], resolve),
                    meta: { resourceName: '修改出库',title:true }
                },// 直接出库（修改）
                {
                    path: '/modifyMoveLibrary',
                    component: resolve => require(['../components/page/outgoingApplication/modifyMoveLibrary.vue'], resolve),
                    meta: { resourceName: '修改移库',title:true }
                },
                {
                    path: '/ModifyMoveOutLibrary',
                    component: resolve => require(['../components/page/outgoingApplication/ModifyMoveOutLibrary.vue'], resolve),
                    meta: { resourceName: '修改出库',title:true }
                },
                {
                    path: '/outBusinessDetails',
                    component: resolve => require(['../components/page/outgoingApplication/outBusinessDetails.vue'], resolve),
                    meta: { resourceName: '业务单详情',title:true  }
                },// 出库台账详情
              
                {
                    path: '/outgoingBill',
                    component: resolve => require(['../components/page/inventoryManagement/outgoingBill.vue'], resolve),
                    meta: { resourceName: '待出库票据',title:true }
                },
                {
                    path: '/inventoryManagement',
                    component: resolve => require(['../components/page/inventoryManagement/inventoryManagement.vue'], resolve),
                    meta: { resourceName: '库存管理' }
                },
                // {
                //     path: '/inventoryDetail',
                //     component: resolve => require(['../components/page/inventoryManagement/inventoryDetail.vue'], resolve),
                //     meta: { resourceName: '业务单详情',title:true  }//库存详情
                // },
               
                {
                    path: '/theNewOutbound',
                    component: resolve => require(['../components/page/inventoryManagement/theNewOutbound.vue'], resolve),
                    meta: { resourceName: '新增出库',title:true }
                },//直接出库
             
                {
                    path: '/newMoveLibrary',
                    component: resolve => require(['../components/page/inventoryManagement/newMoveLibrary.vue'], resolve),
                    meta: { resourceName: '新增移库',title:true }
                },// 移库出库（移库）
                {
                    path: '/inventoryWarehouse',
                    component: resolve => require(['../components/page/inventoryManagement/inventoryWarehouse.vue'], resolve),
                    meta: { resourceName: '确认出库',title:true }
                },// 移库出库（确认出库）
                {
                    path: '/businessStatistics',
                    component: resolve => require(['../components/page/businessStatistics/businessStatistics.vue'], resolve),
                    meta: { resourceName: '业务统计' }
                },
                {
                    path: '/businessAccount',
                    component: resolve => require(['../components/page/businessStatistics/businessAccount.vue'], resolve),
                    meta: { resourceName: '业务台账' }
                },
                {
                    path: '/organizeStructure',
                    component: resolve => require(['../components/page/system/organizeStructure.vue'], resolve),
                    meta: { resourceName: '组织架构' }
                },
                {
                    path: '/roleManage',
                    component: resolve => require(['../components/page/system/roleManage.vue'], resolve),
                    meta: { resourceName: '角色管理' }
                },
                {
                    path: '/addRole',
                    component: resolve => require(['../components/page/system/addRole.vue'], resolve),
                    meta: { resourceName: '添加角色' ,title:true},
                },
                {
                    path: '/roleInfo',
                    component: resolve => require(['../components/page/system/roleInfo.vue'], resolve),
                    meta: { resourceName: '角色详情',title:true }
                },
                {
                    path: '/tenantManage',
                    component: resolve => require(['../components/page/tenant/tenantManage.vue'], resolve),
                    meta: { resourceName: '租户管理' }
                },
           
                {
                    path: '/personalCenter',
                    component: resolve => require(['../components/page/personalCenter/personalCenter.vue'], resolve),
                    meta: { resourceName: '个人中心',title:true }
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: { resourceName: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: { resourceName: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: { resourceName: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: { resourceName: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: { resourceName: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: { resourceName: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve),
                    meta: { resourceName: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: resolve => require(['../components/page/DragDialog.vue'], resolve),
                    meta: { resourceName: '拖拽弹框' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { resourceName: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { resourceName: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { resourceName: '403' }
                },
                {
                    path: '/demo',
                    component: resolve => require(['../components/page/demo.vue'], resolve),
                    meta: { resourceName: 'demo' }
                },
                {
                    path: '/calendar',
                    component: resolve => require(['../components/page/tool/Calendar.vue'], resolve),
                    meta: { resourceName: '贴现日历', title:true}
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/forgetPassword',
            component: resolve => require(['../components/page/forgetPassword.vue'], resolve),
            meta: { resourceName: '忘记密码',title:true }
        },
        {
            path: '/setPassword',
            component: resolve => require(['../components/page/setPassword.vue'], resolve),
            meta: { resourceName: '设置密码' ,title:true}
        },

        {
            path: '/uploadExcelData',
            name:"reviewExcel",
            component: resolve => require(['../components/page/warehousingApplication/uploadXlsxFileData.vue'], resolve),
            meta: { resourceName: '批量上传' ,title:true}
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
