//权限url映射表
module.exports = {
    simple: {
        //基础字典获取
        'POST:/proxy/hospital/find_hospital': true,
        'GET:/system/dictionaryItem/use/all': true,
        'GET:/system/menu/use/all': true,
        'GET:/proxy/relation/customers': true,
        'GET:/proxy/relation/teams': true,
        //ueditor配置
        'GET:/proxy/common/uediter/': true,
        //登录认证
        'GET:/manage/sign/currentUser': true,
        'POST:/manage/sign/login': true,
        'GET:/manage/sign/logout': true,
        'POST:/manage/account/modifyPassword': true,
        //管理账户
        'GET:/manage/account': 'Account',
        'POST:/manage/account': 'Account_ADD',
        'PUT:/manage/account': 'Account_MODIFY',
        'POST:/manage/account/resetPassword': 'Account_RESET_PASSWORD',
        'GET:/system/role/account/roles': 'Account_ROLE',
        'POST:/system/role/authRoleToAccount': 'Account_ROLE',
        //系统字典
        'GET:/system/dictionaryType': 'Dictionary',
        'POST:/system/dictionaryType': 'Dictionary_ADD',
        'PUT:/system/dictionaryType': 'Dictionary_MODIFY',
        'POST:/system/dictionaryItem': 'Dictionary_ENUM_UPDATE',
        'PUT:/system/dictionaryItem': 'Dictionary_ENUM_UPDATE',
        //系统变量
        'GET:/system/systemVariable': 'SystemVariable',
        'POST:/system/systemVariable': 'SystemVariable_ADD',
        'PUT:/system/systemVariable': 'SystemVariable_MODIFY',
        //菜单
        'POST:/system/menu': 'Menu_ADD',
        'PUT:/system/menu': 'Menu_MODIFY',
        'PUT:/system/menu/order/change': 'Menu_MODIFY',
        //权限
        'GET:/system/role': ['Permission', 'Account_ROLE'],
        'POST:/system/role': 'Permission_ADD',
        'PUT:/system/role': 'Permission_AUTHORIZATION',
        /*****************************  业务权限  *******************************/
        //医院
        'POST:/proxy/hospital/add_update_hospital': 'Hospital_ADD',
        'POST:/proxy/hospital/del_hospital': 'Hospital_DELETE',
        //医生
        'GET:/proxy/doctor': 'Doctor',
        'POST:/proxy/doctor/new_update': true, //'Doctor_ADD',(站点直连添加账户)
        //团队
        'GET:/proxy/team': 'Team',
        'POST:/proxy/team/update': 'Team_MODIFY',
        'POST:/proxy/team': 'Team_ADD',
        //站点
        'GET:/proxy/customer': 'Customer',
        'GET:/proxy/relation/doctors': 'Customer',
        'POST:/proxy/customer/new_update': ['Customer_ADD', 'Customer_MODIFY'],
        'POST:/proxy/relation/new': 'Customer_ADDREL',
        'GET:/proxy/relation/del': 'Customer_DELETEREL',
        //诊断模板
        'GET:/proxy/template/find_template_report': 'Template',
        'POST:/proxy/template/add_update_template_report': ['Template_ADD', 'Template_MODIFY'],
        'POST:/proxy/template/del_template_report': 'Template_DELETE',
        //获取报告列表
        'GET:/proxy/workSearch/list': ['Reporting', 'Reported'],
        'POST:/proxy/workflow/update_del': ['Reporting_DELETE', 'Reported_DELETE'],
        //每日一例
        'GET:/proxy/discoveries/list': 'Dailycase',
        'POST:/proxy/discoveries/add': 'Reporting_ADD',
        'POST:/proxy/discoveries/update': 'Dailycase_MODIFY',
        'POST:/proxy/discoveries/delete': 'Dailycase_DELETE',
        //统计
        'GET:/proxy/work_stats/union/opc': 'PlatformStatistics',
        'GET:/proxy/work_stats/var/time_unit': 'PlatformStatistics',
        'GET:/proxy/work_stats/union/team': 'TeamStatistics',
        'GET:/proxy/workStats/opc': 'CustomerStatistics',
        'GET:/proxy/workStats/medical/summary': 'CustomerStatistics',
        //报告相关
        'GET:/proxy/workflow/history': true,
        'GET:/proxy/workflow/detail': true,
        'GET:/proxy/workflow/logs': true
    },
    reg: {
        //管理账户
        'DELETE:/manage/account/\\d+': 'Account_DELETE',
        //系统字典
        'DELETE:/system/dictionaryType/\\d+': 'Dictionary_DELETE',
        'GET:/system/dictionaryItem/getByType/\\w+': 'Dictionary_ENUM',
        'POST:/system/dictionaryItem/order/\\d+': 'Dictionary_ENUM_ORDER',
        'DELETE:/system/dictionaryItem/\\d+': 'Dictionary_ENUM_DELETE',
        //系统变量
        'DELETE:/system/systemVariable/\\d+': 'SystemVariable_DELETE',
        //菜单
        'DELETE:/system/menu/\\d+': 'Menu_DELETE',
        //权限
        'DELETE:/system/role/\\d+': 'Permission_DELETE',
        /*****************************  业务权限  *******************************/
        //团队
        'GET:/proxy/team/\\w+': 'Team_MODIFY'
    }
}