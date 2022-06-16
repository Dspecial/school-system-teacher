/*
 * @Author: dxx
 * @Email: dxxtalking@163.com
 * @Date: 2020-12-24 09:09:03
 * @LastEditors: dxx
 * @LastEditTime: 2022-06-16 15:28:29
 */
import {postToken,post,postJson,postUpload} from '@/core/axios.js';

export default {
	/*
		***登录
	 */
	// 登录
	login: p => postToken('/api/user.login/login', p),
	// 获取登录申请着的身份
	loginConfig: p => post('/api/ajax/get_sys_config', p),
	// 获取状态，判断是否单点登录
	isLogin_state: p => postToken('/api/ajax/get_type_no_state', p),
	// 单点登录获取token
	check_login: p => post('/api/ajax/check_login', p),

	/*
		***菜单
	 */
	// 菜单管理
	menu: p => postToken('/api/menu/index', p),
	// 获取所有的操作按钮
	menuButton: p => postToken('/api/menu/get_menu_buttom', p),
	// 操作权限
	menuState: p => postToken('/api/menu/check_menu_state', p),
	
	/*
		***头部
	 */
	// 消息提示
	headerNotice: p => postToken('/api/dashboard/get_index_notice', p),
	
	/*
		***首页
	 */
	// 获取信息处理
	dashboard_routine: p => postToken('/api/dashboard/get_last_routine', p),	
	// 获取项目状态数
	dashboard_state: p => postToken('/api/dashboard/get_my_project_state', p),
	// 获取首页获取付款信息
	dashboard_pay: p => postToken('/api/dashboard/project_pay_state', p),

	/*
		***项目管理
	 */
	// 项目管理列表
	projectList: p => postToken('/api/project.project/index', p),
	// 新增项目管理列表
	projectAdd: p => postToken('/api/project.project/add', p),
	// 编辑项目管理列表
	projectEdit: p => postToken('/api/project.project/edit', p),
	// 删除项目管理列表
	projectDel: p => postToken('/api/project.project/del', p),
	// 获取项目分类
	getProjectCate: p => postToken('/api/ajax/get_project_cate_list', p),
	// 获取负责人所在部门
	getDeptOptions: p => postToken('/api/ajax/getdepartlist', p),
	// 获取负责人
	getUser_dept: p => postToken('/api/ajax/get_user_list_by_department', p),
	// 获取企业列表
	getCompany: p => postToken('/api/ajax/get_company_list', p),
	// 获取表单
	getProjectForms: p => postToken('/api/ajax/get_project_forms', p),
	// 上传合同
	uploadAgree: p => postUpload('/api/upload/upload_agree', p),
	// 移除合同
	uploadDel: p => postToken('/api/upload/del_upload', p),
	// 项目详情
	projectDetail: p => postToken('/api/project.project/details', p),

	// 项目所有流程的文件上传
	uploadFile: p => postUpload('/api/upload/upload_file', p),

	// 付款节点
	projectPayNode: p => postToken('/api/project.project/pay_info', p),
	// 更新付款节点
	setPayNode: p => postToken('/api/project.project/pay_set_node', p),
	// 上传付款附件或凭证
	uploadPayNode: p => postUpload('/api/upload/upload_pay_file', p),

	// 提交审核
	projectCommit: p => postToken('/api/project.project/commit', p),
	// 跳过提交评审
	projectRecheck_skip: p => postToken('/api/project.project/skip_recheck', p),
	// 上传评审
	uploadRecheck: p => postUpload('/api/upload/upload_recheck', p),
	// 提交评审
	projectRecheck: p => postToken('/api/project.project/commit_recheck', p),
	// 获取专家列表(记录一个bug,已选人员不能再选，事务管理里面也有同一个问题;审核管理-资源审核-审核里面 先选分类 再选资源 也有这个问题)
	projectExpert: p => postToken('/api/ajax/get_expert_list', p),
	// 进入进度上传流程
	projectProcess: p => postToken('/api/project.project/to_process', p),
	// 进入验收流程
	projectAccept: p => postToken('/api/project.project/to_accept', p),
	// 提交验收流程
	projectAccept_send: p => postToken('/api/project.project/send_accept', p),
	
	// 评审记录-列表
	projectRecheck_list: p => postToken('/api/project.project/recheck_list', p),
	// 评审列表-详情
	projectRecheck_detail: p => postToken('/api/project.project/recheck_detail', p),
	// 项目进度记录-列表
	projectProcess_list: p => postToken('/api/project.project/process_list', p),
	// 进度记录-详情
	projectProcess_detail: p => postToken('/api/project.project/process_detail', p),
	// 进入实施流程
	projectRunning: p => postToken('/api/project.project/to_running', p),
	// 根据流程节点获取额外参数
	project_getExtraNodeForms: p => postToken('/api/ajax/get_extra_node_forms', p),

	// 项目维保
	projectMaintenance: p => postToken('/api/project.project/push_maintenance', p),
	// 项目维保-根据项目获取信息
	project_funds: p => postToken('/api/ajax/get_funds_by_project', p),
	// 维保上传文件
	projectMaintenance_Upload: p => postUpload('/api/upload/upload_extend_attach', p),

	// 项目工单列表
	project_serviceList: p => postToken('/api/service.serviceproject/index', p),
	// 工单级别
	project_service_level: p => postToken('/api/ajax/get_service_level', p),
	// 项目发起工单
	project_serviceAdd: p => postToken('/api/service.serviceproject/add', p),
	// 项目工单详情
	project_serviceDetail: p => postToken('/api/service.serviceproject/details', p),
	// 工单上传文件
	project_serviceUpload: p => postUpload('/api/upload/upload_service_attach', p),
	// 项目工单详情-新增问题
	project_serviceDetail_add: p => postToken('/api/service.serviceproject/details', p),

	// 申请资源
	project_apply_resource: p => postToken('/api/project.project/apply_resource', p),
	// 申请资源详情
	project_apply_resourceDetail: p => postToken('/api/resource.resource/applydetails', p),
	
	// 资源列表
	resourceList: p => postToken('/api/resource.resource/index', p),
	// 申请资源
	resourceAdd: p => postToken('/api/resource.resource/apply_resource', p),
	// 获取项目
	getPro: p => postToken('/api/ajax/get_my_project', p),
	// 获取资源分类
	getResource_cate: p => postToken('/api/ajax/get_resource_cate', p),
	// 获取资源列表
	getResource_list: p => postToken('/api/ajax/get_resource_list', p),
	// 获取资源详情
	getResource_info: p => postToken('/api/ajax/get_resource_info', p),
	// 获取资源列表
	getResource_cateParamsOption: p => postToken('/api/ajax/get_cate_form', p),
	// 编辑资源时-供应商列表
	getResource_supplier: p => postToken('/api/ajax/get_company_supplier', p),
	// 资源详情
	resourceDetail: p => postToken('/api/resource.resource/details', p),
	// 资源工单列表
	resource_serviceList: p => postToken('/api/service.serviceresource/index', p),
	// 资源发起工单
	resource_serviceAdd: p => postToken('/api/service.serviceresource/add', p),
	// 资源工单详情
	resource_serviceDetail: p => postToken('/api/service.serviceresource/details', p),

	// 维保列表
	maintenanceList: p => postToken('/api/project.maintenance/index', p),
	// 项目维保编辑
	maintenanceEdit: p => postToken('/api/project.maintenance/edit', p),
	// 维保详情
	maintenanceDetail: p => postToken('/api/project.maintenance/details', p),
	// 维保工单列表
	maintenance_serviceList: p => postToken('/api/service.servicemaintenance/index', p),
	// 维保发起工单
	maintenance_serviceAdd: p => postToken('/api/service.servicemaintenance/add', p),
	// 维保工单详情
	maintenance_serviceDetail: p => postToken('/api/service.serviceproject/details', p),
	// 维保工单详情-新增
	maintenance_serviceDetail_add: p => postToken('/api/service.serviceproject/details', p),		
	// 维保-付款节点
	maintenancePayNode: p => postToken('/api/project.maintenance/pay_info', p),
	// 维保-更新付款节点
	maintenanceSetPayNode: p => postToken('/api/project.maintenance/pay_set_node', p),
	// 维保-上传付款附件或凭证
	maintenanceUploadPayNode: p => postUpload('/api/upload/upload_pay_file', p),

	// 承办列表
	hosterList: p => postToken('/api/project.hosterproject/index', p),
	// 承办列表-编辑
	hosterEdit: p => postToken('/api/project.hosterproject/edit', p),
	// 承办列表-详情
	hosterDetail: p => postToken('/api/project.hosterproject/details', p),
	// 删除承办列表
	hosterDel: p => postToken('/api/project.hosterproject/del', p),

	// 承办-付款节点
	hosterPayNode: p => postToken('/api/project.hosterproject/pay_info', p),
	// 承办-更新付款节点
	hoster_setPayNode: p => postToken('/api/project.hosterproject/pay_set_node', p),

	// 承办-提交审核
	hosterCommit: p => postToken('/api/project.hosterproject/commit', p),
	// 承办-跳过提交评审
	hosterRecheck_skip: p => postToken('/api/project.hosterproject/skip_recheck', p),

	// 承办-提交评审
	hosterRecheck: p => postToken('/api/project.hosterproject/commit_recheck', p),

	// 承办-进入进度上传流程
	hosterProcess: p => postToken('/api/project.hosterproject/to_process', p),
	// 承办-进入验收流程
	hosterAccept: p => postToken('/api/project.hosterproject/to_accept', p),
	// 承办-提交验收流程
	hosterAccept_send: p => postToken('/api/project.hosterproject/send_accept', p),
	
	// 承办-评审记录-列表
	hosterRecheck_list: p => postToken('/api/project.hosterproject/recheck_list', p),
	// 承办-评审列表-详情
	hosterRecheck_detail: p => postToken('/api/project.hosterproject/recheck_detail', p),
	// 承办-项目进度记录-列表
	hosterProcess_list: p => postToken('/api/project.hosterproject/process_list', p),
	// 承办-进度记录-详情
	hosterProcess_detail: p => postToken('/api/project.hosterproject/process_detail', p),
	// 承办-进入实施流程
	hosterRunning: p => postToken('/api/project.hosterproject/to_running', p),

	// 承办-项目维保
	hosterMaintenance: p => postToken('/api/project.hosterproject/push_maintenance', p),

	// 承办-项目工单列表
	hoster_serviceList: p => postToken('/api/service.serviceproject/index', p),
	// 承办-项目发起工单
	hoster_serviceAdd: p => postToken('/api/service.serviceproject/add', p),
	// 承办-项目工单详情
	hoster_serviceDetail: p => postToken('/api/service.serviceproject/details', p),
	// 承办-项目工单详情-新增问题
	hoster_serviceDetail_add: p => postToken('/api/service.serviceproject/details', p),

	// 承办-申请资源
	hoster_apply_resource: p => postToken('/api/project.hosterproject/apply_resource', p),








	// 承办资源列表
	hosterResourceList: p => postToken('/api/undertake.resource/index', p),
	// 承办资源列表-删除
	hosterResourceDel: p => postToken('/api/undertake.resource/delete', p),
	// 承办资源列表-编辑
	hosterResourceEdit: p => postToken('/api/undertake.resource/edit', p),
	// 承办资源列表-提交
	hosterResourceAdd: p => postToken('/api/undertake.resource/add', p),
	// 承办资源列表-详情(好像没用到)
	hosterResourceDetail: p => postToken('/api/undertake.resource/edit', p),

	// 承办资源维护记录列表
	hosterResourceRecordList: p => postToken('/api/undertake.resource/record', p),

	// 款项信息列表
	paymentList: p => postToken('/api/project.payinfo/index', p),

	
	/*
		***部门项目
	 */
	// 项目列表
	manager_projectList: p => postToken('/api/manager.project/index', p),
	// 项目详情
	manager_projectDetail: p => postToken('/api/manager.project/details', p),

	// 项目授权-负责人选择
	manager_auth_user: (p, c) => postToken('/api/ajax/get_teacher_list', p, c = { showLoading:false }),
	// 项目授权
	manager_projectAuth: p => postToken('/api/manager.project/set_auth', p),

	// 维保列表
	manager_maintenanceList: p => postToken('/api/manager.maintenance/index', p),
	// 维保详情
	manager_maintenanceDetail: p => postToken('/api/manager.maintenance/details', p),
	// 维保授权
	manager_maintenanceAuth: p => postToken('/api/manager.maintenance/set_auth', p),

	// 资源列表
	manager_hosterResourceList: p => postToken('/api/manager.resource/index', p),
	// 资源详情
	manager_hosterResourceDetail: p => postToken('/api/manager.resource/edit', p),

	// 款项信息列表
	manager_paymentList: p => postToken('/api/manager.payinfo/index', p),

	
	/*
		***审核管理
	 */
	// 审核列表
	checkList: p => postToken('/api/checks.checks/index', p),

	// 初审列表
	firstCheckList: p => postToken('/api/checks.firstproject/index', p),
	// 编辑初审列表
	firstCheckList_edit: p => postToken('/api/checks.firstproject/edit', p),
	// 审核初审
	firstCheckList_check: p => postToken('/api/checks.firstproject/check_first_triall', p),
	// 审核初审文件预览
	file_preview: p => postToken('/api/ajax/preview', p),
	// 项目初审详情
	firstCheck_detail: p => postToken('/api/checks.firstproject/details', p),

	// 评审列表
	recheckList: p => postToken('/api/checks.recheckproject/index', p),
	// 评审编辑
	recheckList_edit: p => postToken('/api/checks.recheckproject/edit', p),
	// 评审
	recheckList_check: p => postToken('/api/checks.recheckproject/check_recheck', p),
	// 项目评审详情
	recheck_detail: p => postToken('/api/checks.recheckproject/details', p),

	// 实施列表
	forceList: p => postToken('/api/checks.forceproject/index', p),
	// 实施编辑
	forceList_edit: p => postToken('/api/checks.forceproject/edit', p),
	// 实施审核
	forceList_check: p => postToken('/api/checks.forceproject/check_force', p),
	// 实施详情
	force_detail: p => postToken('/api/checks.forceproject/details', p),

	// 进度提交列表
	processList: p => postToken('/api/checks.processproject/index', p),
	// 进度审核
	processList_check: p => postToken('/api/checks.processproject/check_process', p),
	// 进度详情
	process_detail: p => postToken('/api/checks.processproject/detail', p),

	// 验收审核列表
	acceptList: p => postToken('/api/checks.acceptproject/index', p),
	// 验收审核
	acceptList_check: p => postToken('/api/checks.acceptproject/check_accept', p),
	// 验收详情
	accept_detail: p => postToken('/api/checks.acceptproject/detail', p),

	// 项目维保编辑
	maintenance_edit: p => postToken('/api/checks.extendproject/edit', p),
	// 项目维保审核
	maintenanceList_check: p => postToken('/api/checks.extendproject/check_extend', p),
	// 项目维保详情
	maintenance_detail: p => postToken('/api/checks.extendproject/detail', p),

	// 审核列表里的node_id=13 资源审核列表
	// resourceListCheck: p => postToken('/api/checks.resourceproject/index', p),
	// 审核列表里的node_id=13  资源审核
	resourceCheck_check: p => postToken('/api/checks.resourceproject/check_resource', p),	
	// 审核列表里的node_id=13  资源审核详情
	resourceCheck_detail: p => postToken('/api/checks.resourceproject/details', p),	


	// 资源审核列表
	resourceCheckList: p => postToken('/api/checks.resourceapply/index', p),
	// 资源审核
	resourceCheckList_check: p => postToken('/api/checks.resourceapply/check_resource', p),	


	// 厂商密码更改申请列表
	companyapplyList: p => postToken('/api/company.companyapply/index', p),
	// 资源审核
	companyapplyList_check: p => postToken('/api/company.companyapply/check', p),	
	
	/*
		***信息管理
	 */
	// 个人信息
	personalInfo: p => postToken('/api/user.info/edit', p),
	// 账户信息
	accountInfo: p => postToken('/api/user.info/account', p),

	/*
		***消息管理
	 */
	// 消息列表
	noticeList: p => postToken('/api/notices.message/index', p),
	// 消息已读
	noticeIsread: p => postToken('/api/notices.message/is_read', p),

	/*
		***知识库管理
	 */
	// 知识库列表
	knowledgeList: p => postToken('/api/knowledge.knowledge/index', p),
	// 知识库分类
	knowledgeCate: p => postToken('/api/ajax/knowledge_cate', p),
	// 知识库详情
	knowledgeDetail: p => postToken('/api/knowledge.knowledge/details', p),
	// 知识库详情里文件预览
	knowledgePreview: p => postToken('/api/knowledge.knowledge/preview', p),
	// 知识库详情里文件下载
	knowledgeDownloadview: p => postToken('/api/knowledge.knowledge/downloadview', p),

	/*
		***事务管理
	 */
	// 事务列表（返回数据没有分页）
	routineList: p => postToken('/api/works.routine/index', p),
	// 发起事务
	routineAdd: p => postToken('/api/works.routine/add', p),
	// 编辑事务
	routineEdit: p => postToken('/api/works.routine/edit', p),
	// 删除事务
	routineDel: p => postToken('/api/works.routine/del', p),
	// 获取优先级
	routineLevel: p => postToken('/api/ajax/get_work_level', p),
	// 获取项目列表
	routineProject: p => postToken('/api/ajax/get_work_detail_info', p),
	// 获取处理用户列表
	routineUser: (p,c) => postToken('/api/ajax/get_works_user', p, c = { showLoading:false }),
	// 事务上传文件
	routineUpload: p => postUpload('/api/upload/upload_works_attach', p),
	// 事务删除上传文件
	routineUploadDel: p => postToken('/api/upload/del_upload', p),
	// 提交事务
	routineSubmit: p => postToken('/api/works.routine/submit', p),

	/*
		***我的项目
	*/
	// 我的项目列表
	my_projectList: p => postToken('/api/company.project/index', p),
	// 上传进度
	my_project_process: p => postToken('/api/company.project/send_process', p),
	// 进度上传文件
	my_project_processUpload: p => postUpload('/api/upload/upload_process_attach', p),
	// 删除进度上传文件
	processUploadDel: p => postToken('/api/upload/del_upload', p),
	// 上传验收
	my_project_accept: p => postToken('/api/company.project/send_accept', p),
	// 验收上传文件
	my_project_acceptUpload: p => postUpload('/api/upload/upload_accept_attach', p),
	// 进度记录 列表
	my_project_process_list: p => postToken('/api/company.project/process_list', p),
	// 进度记录-详情
	my_project_process_detail: p => postToken('/api/company.project/process_detail', p),
	// 我的项目详情
	my_projectDetail: p => postToken('/api/company.project/details', p),

	// 我的项目-维保列表
	my_maintenanceList: p => postToken('/api/company.maintenance/index', p),	
	// 我的项目-维保详情
	my_maintenance_detail: p => postToken('/api/company.maintenance/details', p),


	/*
		***我的资源
	*/
	// 我的资源列表
	my_resourceList: p => postToken('/api/companyresource.companyresource/index', p),
	// 添加记录
	my_push_record: p => postToken('/api/companyresource.companyresource/push_record', p),
	// 上传记录文件
	my_project_recordUpload: p => postUpload('/api/upload/upload_record_attach', p),
	// 删除记录文件
	recordUploadDel: p => postToken('/api/upload/del_upload', p),

	// 维护记录列表
	my_recordList: p => postToken('/api/companyresource.companyresource/record_index', p),
	// 记录详情
	my_recordDetail: p => postToken('/api/companyresource.companyresource/detail', p),

	/*
		***工单管理
	 */
	// 工单列表
	serviceList: p => postToken('/api/service.service/index', p),
	// 工单详情
	serviceDetail: p => postToken('/api/service.service/details', p),
	// 工单详情-添加
	serviceDetail_add: p => postToken('/api/service.service/details', p),
	/*
		***厂商管理
	 */
	// 厂商列表
	companyList: p => postToken('/api/company.companymanager/index', p),
	// 编辑厂商
	companyEdit: p => postToken('/api/company.companymanager/edit', p),
	// 新增厂商
	companyAdd: p => postToken('/api/company.companymanager/add', p),
	// 删除厂商
	companyDel: p => postToken('/api/company.companymanager/del', p),
	// 申请修改密码
	companyChangpwd: p => postToken('/api/company.companymanager/changpwd', p),
	// 申请修改密码列表
	companyChangpwdList: p => postToken('/api/company.companymanager/change_list', p),
}