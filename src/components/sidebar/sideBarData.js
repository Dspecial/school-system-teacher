/*
* @Author: dxx
* @Email: dxxtalking@163.com
* @Date:   2020-12-24 11:19:21
* @Last Modified by:   dxx
* @Last Modified time: 2020-12-24 15:32:56
*/
export const sideBarData = {
	menu:[
		{
			id:"01",
			icon:"el-icon-house",
			name:"我的工作台",
			route:"/index",
			childs:null,
		},
		{
			id:"02",
			icon:"el-icon-circle-check",
			name:"项目管理",
			route:"/project",
			childs:[
				{
					id:"02-01",
					icon:"",
					name:"项目申请",
					route:"/project/application",
					childs:null,
				},
				{
					id:"02-02",
					icon:"",
					name:"项目进程",
					route:"/project/progress",
					childs:null,
				},
				{
					id:"02-03",
					icon:"",
					name:"资源管理",
					route:"/project/resource",
					childs:null,
				},
			],
		},
		{
			id:"03",
			icon:"el-icon-message",
			name:"信息管理",
			route:"/message",
			childs:null,
		},
		{
			id:"04",
			icon:"el-icon-document",
			name:"文档资源管理",
			route:"/document",
			childs:null,
		},
	],
}