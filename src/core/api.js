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


	// 菜单管理
	menu: p => post('/api/menu/index', p),
	// 获取所有的操作按钮
	menuButton: p => post('/api/menu/get_menu_buttom', p),
	// 操作权限
	menuState: p => post('/api/menu/check_menu_state', p),

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
	// 上传合同
	uploadAgree: p => postUpload('/api/upload/upload_agree', p),
	// 移除合同
	uploadDel: p => post('/api/upload/del_upload', p),
	// 提交项目
	projectCommit: p => post('/api/project.project/commit', p),
	// 提交审核（没通）
	projectRecheck: p => post(' /api/project.project/commit_recheck', p),
	// 进入实施流程（没通）
	projectRunning: p => post('/api/project.project/to_running', p),
	// 进入验收流程（没通）
	projectAccept: p => post('/api/project.project/to_accept', p),

	// 资源列表（没通，不知道是哪个）
	resourceList: p => post('/api/companyresource.companyresource/index', p),

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
}