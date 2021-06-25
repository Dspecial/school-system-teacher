/*
* @Author: dxx
* @Email: dxxtalking@163.com
* @Date:   2021-03-16 13:53:24
* @Last Modified by:   dxx
* @Last Modified time: 2021-03-16 13:54:06
*/
import {post,postJson,postUpload} from '@/core/axios.js';

export default {
	/*
		***登录
	 */
	// 登录
	login: p => post('/api/user.login/login', p),
	// 获取登录申请着的身份
	loginConfig: p => post('/api/ajax/get_sys_config', p),
	// 获取状态，判断是否单点登录
	isLogin_state: p => post('/api/ajax/get_type_no_state', p),

	/*
		***菜单
	 */
	// 菜单管理
	menu: p => post('/api/menu/index', p),
	// 获取所有的操作按钮
	menuButton: p => post('/api/menu/get_menu_buttom', p),
	// 操作权限
	menuState: p => post('/api/menu/check_menu_state', p),

	/*
		***头部
	 */
	// 消息提示
	headerNotice: p => post('/api/dashboard/get_index_notice', p),
	
	/*
		***首页
	 */
	// 获取信息处理
	dashboard_routine: p => post('/api/dashboard/get_last_routine', p),	
	// 获取项目状态数
	dashboard_state: p => post('/api/dashboard/get_my_project_state', p),
	// 获取首页获取付款信息
	dashboard_pay: p => post('/api/dashboard/project_pay_state', p),
	/*
		***项目管理
	 */
	// 项目管理列表
	projectList: p => post('/api/project.project/index', p),
	// 新增项目管理列表
	projectAdd: p => post('/api/project.project/add', p),
	// 编辑项目管理列表
	projectEdit: p => post('/api/project.project/edit', p),
	// 删除项目管理列表
	projectDel: p => post('/api/project.project/del', p),
	// 获取项目分类
	getProjectCate: p => post('/api/ajax/get_project_cate_list', p),
	// 获取企业列表
	getCompany: p => post('/api/ajax/get_company_list', p),
	// 获取表单
	getProjectForms: p => post('/api/ajax/get_project_forms', p),
	// 上传合同
	uploadAgree: p => postUpload('/api/upload/upload_agree', p),
	// 移除合同
	uploadDel: p => post('/api/upload/del_upload', p),
	// 项目详情
	projectDetail: p => post('/api/project.project/details', p),

	// 付款节点
	projectPayNode: p => post('/api/project.project/pay_info', p),
	// 更新付款节点
	setPayNode: p => post('/api/project.project/pay_set_node', p),
	// 上传付款附件或凭证
	uploadPayNode: p => postUpload('/api/upload/upload_pay_file', p),

	// 提交审核
	projectCommit: p => post('/api/project.project/commit', p),
	// 提交复审
	projectRecheck: p => post('/api/project.project/commit_recheck', p),
	// 获取专家列表(记录一个bug,已选人员不能再选，事务管理里面也有同一个问题;审核管理-资源审核-审核里面 先选分类 再选资源 也有这个问题)
	projectExpert: p => post('/api/ajax/get_expert_list', p),
	// 进入进度上传流程
	projectProcess: p => post('/api/project.project/to_process', p),
	// 进入验收流程
	projectAccept: p => post('/api/project.project/to_accept', p),
	// 复审记录-列表
	projectRecheck_list: p => post('/api/project.project/recheck_list', p),
	// 复审列表-详情
	projectRecheck_detail: p => post('/api/project.project/recheck_detail', p),
	// 项目进度记录-列表
	projectProcess_list: p => post('/api/project.project/process_list', p),
	// 进度记录-详情
	projectProcess_detail: p => post('/api/project.project/process_detail', p),
	// 进入实施流程
	projectRunning: p => post('/api/project.project/to_running', p),
	// 项目维保
	projectMaintenance: p => post('/api/project.project/to_running', p),
	// 资源申请
	project_resource_Application: p => post('/api/project.project/to_running', p),
	// 项目工单列表
	project_serviceList: p => post('/api/service.serviceproject/index', p),
	// 工单级别
	project_service_level: p => post('/api/ajax/get_service_level', p),
	// 项目发起工单
	project_serviceAdd: p => post('/api/service.serviceproject/add', p),
	// 项目工单详情
	project_serviceDetail: p => post('/api/service.serviceproject/details', p),
	// 工单上传文件
	project_serviceUpload: p => postUpload('/api/upload/upload_service_attach', p),


	// 资源列表
	resourceList: p => post('/api/resource.resource/index', p),
	// 申请资源
	resourceAdd: p => post('/api/resource.resource/apply_resource', p),
	// 获取项目
	getPro: p => post('/api/ajax/get_my_project', p),
	// 获取资源分类
	getResource_cate: p => post('/api/ajax/get_resource_cate', p),
	// 获取资源列表
	getResource_list: p => post('/api/ajax/get_resource_list', p),
	// 获取资源详情
	getResource_info: p => post('/api/ajax/get_resource_info', p),
	// 资源详情
	resourceDetail: p => post('/api/resource.resource/details', p),

	// 资源工单列表
	resource_serviceList: p => post('/api/service.serviceresource/index', p),
	// 资源发起工单
	resource_serviceAdd: p => post('/api/service.serviceresource/add', p),
	// 资源工单详情
	resource_serviceDetail: p => post('/api/service.serviceresource/details', p),

	/*
		***审核管理
	 */
	// 审核列表
	checkList: p => post('/api/checks.checks/index', p),

	// 初审列表
	firstCheckList: p => post('/api/checks.firstproject/index', p),
	// 编辑初审列表
	firstCheckList_edit: p => post('/api/checks.firstproject/edit', p),
	// 审核初审
	firstCheckList_check: p => post('/api/checks.firstproject/check_first_triall', p),
	// 审核初审文件预览
	file_preview: p => post('/api/ajax/preview', p),
	// 项目初审详情
	firstCheck_detail: p => post('/api/checks.firstproject/details', p),

	// 复审列表
	recheckList: p => post('/api/checks.recheckproject/index', p),
	// 复审
	recheckList_check: p => post('/api/checks.recheckproject/check_recheck', p),
	// 项目复审详情
	recheck_detail: p => post('/api/checks.recheckproject/details', p),

	// 实施列表
	forceList: p => post('/api/checks.forceproject/index', p),
	// 实施审核
	forceList_check: p => post('/api/checks.forceproject/check_force', p),
	// 实施详情
	force_detail: p => post('/api/checks.forceproject/details', p),

	// 进度提交列表
	processList: p => post('/api/checks.processproject/index', p),
	// 进度审核
	processList_check: p => post('/api/checks.processproject/check_process', p),
	// 进度详情
	process_detail: p => post('/api/checks.processproject/detail', p),

	// 验收审核列表
	acceptList: p => post('/api/checks.acceptproject/index', p),
	// 验收审核
	acceptList_check: p => post('/api/checks.acceptproject/check_accept', p),
	// 验收详情
	accept_detail: p => post('/api/checks.acceptproject/detail', p),

	// 资源审核列表
	resourceListCheck: p => post('/api/checks.resourceproject/index', p),
	// 资源审核
	resourceCheck_check: p => post('/api/checks.resourceproject/check_resource', p),	
	// 资源审核详情
	resourceCheck_detail: p => post('/api/checks.resourceproject/details', p),	

	/*
		***信息管理
	 */
	// 个人信息
	personalInfo: p => post('/api/user.info/edit', p),
	// 账户信息
	accountInfo: p => post('/api/user.info/account', p),

	/*
		***消息管理
	 */
	// 消息列表
	noticeList: p => post('/api/notices.message/index', p),
	// 消息已读
	noticeIsread: p => post('/api/notices.message/is_read', p),

	/*
		***知识库管理
	 */
	// 知识库列表
	knowledgeList: p => post('/api/knowledge.knowledge/index', p),
	// 知识库分类
	knowledgeCate: p => post('/api/ajax/knowledge_cate', p),
	// 知识库详情
	knowledgeDetail: p => post('/api/knowledge.knowledge/details', p),
	// 知识库详情里文件预览
	knowledgePreview: p => post('/api/knowledge.knowledge/preview', p),
	// 知识库详情里文件下载
	knowledgeDownloadview: p => post('/api/knowledge.knowledge/downloadview', p),

	/*
		***事务管理
	 */
	// 事务列表（返回数据没有分页）
	routineList: p => post('/api/works.routine/index', p),
	// 发起事务
	routineAdd: p => post('/api/works.routine/add', p),
	// 编辑事务
	routineEdit: p => post('/api/works.routine/edit', p),
	// 删除事务
	routineDel: p => post('/api/works.routine/del', p),
	// 获取优先级
	routineLevel: p => post('/api/ajax/get_work_level', p),
	// 获取项目列表
	routineProject: p => post('/api/ajax/get_work_detail_info', p),
	// 获取处理用户列表
	routineUser: p => post('/api/ajax/get_works_user', p),
	// 事务上传文件
	routineUpload: p => postUpload('/api/upload/upload_works_attach', p),
	// 事务删除上传文件
	routineUploadDel: p => post('/api/upload/del_upload', p),
	// 提交事务
	routineSubmit: p => post('/api/works.routine/submit', p),

	/*
		***我的项目
	*/
	// 我的项目列表
	my_projectList: p => post('/api/company.project/index', p),
	// 上传进度
	my_project_process: p => post('/api/company.project/send_process', p),
	// 进度上传文件
	my_project_processUpload: p => postUpload('/api/upload/upload_process_attach', p),
	// 删除进度上传文件
	processUploadDel: p => post('/api/upload/del_upload', p),
	// 上传验收
	my_project_accept: p => post('/api/company.project/send_accept', p),
	// 验收上传文件
	my_project_acceptUpload: p => postUpload('/api/upload/upload_accept_attach', p),
	// 进度记录 列表
	my_project_process_list: p => post('/api/company.project/process_list', p),
	// 进度记录-详情
	my_project_process_detail: p => post('/api/company.project/process_detail', p),
	// 我的项目详情
	my_projectDetail: p => post('/api/company.project/details', p),
	/*
		***我的资源
	*/
	// 我的资源列表
	my_resourceList: p => post('/api/companyresource.companyresource/index', p),
	// 添加记录
	my_push_record: p => post('/api/companyresource.companyresource/push_record', p),
	// 上传记录文件
	my_project_recordUpload: p => postUpload('/api/upload/upload_record_attach', p),
	// 删除记录文件
	recordUploadDel: p => post('/api/upload/del_upload', p),

	// 维护记录列表
	my_recordList: p => post('/api/companyresource.companyresource/record_index', p),
	// 记录详情
	my_recordDetail: p => post('/api/companyresource.companyresource/detail', p),

	/*
		***工单管理
	 */
	// 工单列表
	serviceList: p => post('/api/service.service/index', p),
	// 工单详情
	serviceDetail: p => post('/api/service.service/details', p),
}