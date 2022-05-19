<template>
	<div class="application_detail">
		<Breadcrumb></Breadcrumb>
		<el-row class="mt-3" :gutter="20" type="flex">
			<el-col :span="24">
				<el-card class="h-100">
					<h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">项目基本信息</h4>
					<div class="d-flex align-items-center flex-wrap">
						<p class="w-100 mb-3"><span class="opacity-60 mr-2">项目编号：</span>{{basic.apply_number}}</p>
						<p class="w-100 mb-3"><span class="opacity-60 mr-2">项目名称：</span>{{basic.p_name}}</p>
						<p class="w-100 mb-3" v-if="basic.budget_amount != 0"><span class="opacity-60 mr-2">预算金额：</span>{{basic.budget_amount}}</p>
						<p class="w-100 mb-3" v-if="basic.real_amount != 0"><span class="opacity-60 mr-2">项目金额：</span>{{basic.real_amount}}</p>
						<p class="w-100 mb-3"><span class="opacity-60 mr-2">项目类别：</span>{{basic.category_name}}</p>
						<p class="w-100 mb-3"><span class="opacity-60 mr-2">项目年份：</span>{{basic.projecttime}}</p>
						<p class="w-100 mb-0"><span class="opacity-60 mr-2">申请人所在部门：</span>{{basic.apply_user_depart}}</p>
					</div>
				</el-card>
			</el-col>

			<el-col :span="24" v-if="!commonJs.isEmpty(company_info)">
				<el-card class="h-100 company_info">
					<h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">厂商详情</h4>
					<div class="d-flex align-items-center flex-wrap">
						<p class="w-100 mb-3"><span class="opacity-60 mr-2">企业名称：</span>{{company_info.job_number}}</p>
						<p class="w-100 mb-3"><span class="opacity-60 mr-2">企业电话：</span>{{company_info.phone}}</p>
						<p class="w-100 mb-3"><span class="opacity-60 mr-2">联系地址：</span>{{company_info.address}}</p>
						<p class="w-100 mb-3"><span class="opacity-60 mr-2">企业开户行：</span>{{company_info.bank_info}}</p>
						<p class="w-100 mb-3"><span class="opacity-60 mr-2">企业账户：</span>{{company_info.account}}</p>
						<p class="w-100 m-0"><span class="opacity-60 mr-2">项目负责人：</span>{{company_info.name}}</p>
					</div>
				</el-card>
			</el-col>

			<el-col :span="24" v-if="!commonJs.isEmpty(money_data)">
				<el-card class="h-100">
					<h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">当前节点付款情况</h4>
					<my-echart :id="'echarts'" :data="option" height="230px"></my-echart>
				</el-card>
			</el-col>
		</el-row>

		<!-- 表单值-详细信息 -->
		<el-card class="mt-3">
			<h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">详细信息</h4>
			<el-form class="form_json" label-position="left">
				<el-row :gutter="20">
					<template v-for="(formItem,j) in dataJson">
						<el-col :span="24" :key="j" v-if="formItem.name_type == 5 || formItem.name_type == 13 || formItem.name_type == 14 || formItem.name_type == 15">
							<el-form-item :label="formItem.title+'：'" class="file-form-item">
								<div class="d-flex align-items-center justify-content-between mb-2" v-for="(file,index) in formItem.file_arr" :key="index">
									<div class="cursor-pointer view" @click="preview(file.path)" title="在线预览">
										<i class="el-icon-document mr-2"></i><span>{{file.name}}</span>
									</div>
									<div class="opacity-80 ml-5 pl-5">
										<i class="el-icon-view cursor-pointer view mr-3" @click="preview(file.path)"></i>
										<i class="el-icon-download cursor-pointer view" @click="downloadview(file)"></i>
									</div>
								</div>
							</el-form-item>
						</el-col>
						<el-col :span="24" :key="j" v-else-if="formItem.name_type == 12" >
							<el-form-item :label="formItem.title+'：'" label-width="110px" class="json-form-item">
								<div class="w-100 d-flex align-items-center pb-1 mb-1" v-for="(cell,index) in formItem.value" :key="index">
									<p class="m-0 w-100 pl-2 pr-2 pt-1 pb-1" v-for="(item,k) in cell" :key="k">{{item}}</p>
								</div>
							</el-form-item>
						</el-col>
						<el-col :span="12" :key="j" v-else-if="formItem.name_type == 9 || formItem.name_type == 10">
							<el-form-item :label="formItem.title+'：'">
								{{formItem.value.join(",")}}
							</el-form-item>
						</el-col>
						<el-col :span="12" :key="j" v-else-if="formItem.name_type == 7">
							<el-form-item :label="formItem.title+'：'">
								<span v-html="formItem.value"></span>
							</el-form-item>
						</el-col>
						<el-col :span="12" :key="j" v-else>
							<el-form-item :label="formItem.title+'：'">
								{{formItem.value}}
							</el-form-item>
						</el-col>
					</template>
				</el-row>
			</el-form>
		</el-card>

		<!-- 项目状态 -->
		<el-card class="mt-3">
			<h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">项目状态</h4>
			<el-steps :active="statusActive" finish-status="success" align-center>
				<el-step :title="status.name" v-for="(status,index) in statusSteps" :key="index"></el-step>
			</el-steps>
		</el-card>

		<!-- 审核记录 -->
		<el-card class="mt-3">
			<div class="d-flex justify-content-between align-items-center">
				<h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">审核记录</h4>
				<div :class="['toggleMenu cursor-pointer text-primary',showMore ? 'menu_arrow' : '']" @click="changeFoldState"  v-if="checkListAll.length > 5">
					<span>{{showMore?'展开':'收起'}}</span><i class="el-icon-arrow-up ml-1"></i>
				</div>
			</div>
			<el-table :data="checkList">		
				<el-table-column prop="pname" label="节点名称"></el-table-column>
				<el-table-column prop="groupname" label="审核部门"></el-table-column>
				<el-table-column prop="load_check_name" label="待审核人"></el-table-column>
				<el-table-column prop="check_state" label="审核状态">
          <template slot-scope="scope">
            <span v-if="scope.row.check_state == 1"><i class="dot bg-primary mr-1"></i>待审核</span>
            <span v-else-if="scope.row.check_state == 2"><i class="dot bg-success mr-1"></i>审核成功</span>
            <span v-else-if="scope.row.check_state == 3"><i class="dot bg-danger mr-1"></i>审核失败</span>
          </template>
        </el-table-column>
				<el-table-column prop="checkname" label="审核人"></el-table-column>
				<el-table-column prop="remark" label="审核备注"></el-table-column>
				<el-table-column prop="createtime" label="创建时间"></el-table-column>
				<el-table-column prop="checktime" label="审核时间"></el-table-column>
			</el-table>
		</el-card>


		<!-- 评审记录 -->
		<el-card class="mt-3" v-if="recheckListAll.length > 0">
			<div class="d-flex justify-content-between align-items-center">
				<h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">评审记录</h4>
				<div :class="['toggleMenu cursor-pointer text-primary',showMoreRecheck ? 'menu_arrow' : '']" @click="changeFoldStateRecheck"  v-if="recheckListAll.length > 5">
					<span>{{showMoreRecheck?'展开':'收起'}}</span><i class="el-icon-arrow-up ml-1"></i>
				</div>
			</div>
			<el-table :data="recheckList" :default-expand-all="false" :row-class-name="getRowClassRecheck">
				<el-table-column type="expand" label="" width="50">
					<template slot-scope="scope">
						<el-table :data="scope.row.recheck_detail">
							<el-table-column prop="e_name" label="审核人"></el-table-column>
							<el-table-column prop="is_pass" label="是否通过">
								<template slot-scope="scope">
									<span v-if="scope.row.is_pass == 1"><i class="dot bg-success mr-1"></i>通过</span>
									<span v-else-if="scope.row.is_pass == 2"><i class="dot bg-danger mr-1"></i>不通过</span>
								</template>
							</el-table-column>
							<el-table-column prop="content" label="审核内容"></el-table-column>
						</el-table>
					</template>
				</el-table-column>
				<el-table-column prop="recheck_number" label="评审编号"></el-table-column>
				<el-table-column prop="check_state" label="评审状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1"><i class="dot bg-primary mr-1"></i>待审核</span>
            <span v-else-if="scope.row.status == 2"><i class="dot bg-success mr-1"></i>审核成功</span>
            <span v-else-if="scope.row.status == 3"><i class="dot bg-danger mr-1"></i>审核失败</span>
          </template>
        </el-table-column>
				<el-table-column prop="checkname" label="审核人"></el-table-column>
				<el-table-column prop="content" label="评审内容"></el-table-column>
				<el-table-column prop="createtime" label="创建时间"></el-table-column>
				<el-table-column prop="recheck_date" label="评审时间"></el-table-column>
			</el-table>
		</el-card>

		<!-- 进度上传记录 -->
		<el-card class="mt-3" v-if="processListAll.length > 0">
			<div class="d-flex justify-content-between align-items-center">
				<h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">进度上传记录</h4>
				<div :class="['toggleMenu cursor-pointer text-primary',showMoreProcess ? 'menu_arrow' : '']" @click="changeFoldStateProcess"  v-if="processListAll.length > 5">
					<span>{{showMoreProcess?'展开':'收起'}}</span><i class="el-icon-arrow-up ml-1"></i>
				</div>
			</div>
			<el-table :data="processList" :default-expand-all="false" :row-class-name="getRowClassProcess">
				<el-table-column type="expand" label="" width="50">
					<template slot-scope="scope">
						<div class="d-flex align-items-center justify-content-between files_list" v-for="(file,index) in scope.row.files" :key="index">
							<div class="cursor-pointer view" @click="preview(file.path)" title="在线预览">
								<i class="el-icon-document mr-2"></i><span>{{file.name}}</span>
							</div>
							<div class="opacity-80">
								<i class="el-icon-view cursor-pointer view mr-3" @click="preview(file.path)"></i>
								<i class="el-icon-download cursor-pointer view" @click="downloadview(file)"></i>
							</div>
						</div>
					</template>
				</el-table-column>		
				<el-table-column prop="process_number" label="进度编号"></el-table-column>
				<el-table-column prop="title" label="进度标题"></el-table-column>
				<el-table-column prop="status" label="审核状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1"><i class="dot bg-primary mr-1"></i>待审核</span>
            <span v-else-if="scope.row.status == 2"><i class="dot bg-success mr-1"></i>审核成功</span>
            <span v-else-if="scope.row.status == 3"><i class="dot bg-danger mr-1"></i>审核失败</span>
          </template>
        </el-table-column>
				<el-table-column prop="content" label="进度内容"></el-table-column>
				<el-table-column prop="remark" label="进度备注"></el-table-column>
			</el-table>
		</el-card>

		<!-- 验收记录 -->
		<el-card class="mt-3" v-if="acceptForm">
			<div class="d-flex justify-content-between align-items-center">
				<h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">验收记录</h4>
				<div :class="['toggleMenu cursor-pointer text-primary',showMoreAccept ? 'menu_arrow' : '']" @click="changeFoldStateAccept"  v-if="accept_info_all.length > 5">
					<span>{{showMoreAccept?'展开':'收起'}}</span><i class="el-icon-arrow-up ml-1"></i>
				</div>
			</div>
			<el-form :model="acceptForm" class="form_json" label-position="left">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="验收编号">
							{{acceptForm.accept_number}}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="创建时间">
							{{acceptForm.createtime}}
						</el-form-item>
					</el-col>

					<el-col :span="24">
						<el-form-item label="验收列表" class="file-form-item">
							<div class="accept_info_detial mb-2" v-for="(info,i) in accept_info" :key="i">
								<p>{{info.title}}</p>
								<div class="d-flex align-items-center justify-content-between ml-3 opacity-80" v-for="(file,index) in info.files" :key="index">
									<div class="cursor-pointer view" @click="preview(file.path)" title="在线预览">
										<i class="el-icon-document mr-2"></i><span>{{file.name}}</span>
									</div>
									<div class="opacity-80 ml-3">
										<i class="el-icon-view cursor-pointer view mr-3" @click="preview(file.path)"></i>
										<i class="el-icon-download cursor-pointer view" @click="downloadview(file)"></i>
									</div>
								</div>
							</div>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>

		<!-- 合同付款节点 -->
		<el-card class="mt-3" v-if="tableData.length != 0">
			<h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">合同付款节点</h4>
			<el-table :data="tableData" :default-expand-all="true" :row-class-name="getRowClass">
				<!-- <el-table-column type="expand" label="" width="50">
					<template slot-scope="scope">
						<div class="d-flex align-items-center justify-content-between files_list" v-for="(file,index) in scope.row.files" :key="index">
							<div class="cursor-pointer view" @click="preview(file.path)" title="在线预览">
								<i class="el-icon-document mr-2"></i><span>{{file.name}}</span>
							</div>
							<div class="opacity-80">
								<i class="el-icon-view cursor-pointer view mr-3" @click="preview(file.path)"></i>
								<i class="el-icon-download cursor-pointer view" @click="downloadview(file)"></i>
							</div>
						</div>
					</template>
				</el-table-column> -->
				<el-table-column prop="title" label="标题"></el-table-column>
				<el-table-column prop="money" label="金额"></el-table-column>
				<el-table-column prop="paytime" label="付款节点"></el-table-column>
				<el-table-column prop="is_pay" label="是否支付">
					<template slot-scope="scope">
						<span v-if="scope.row.is_pay == 1"><i class="dot bg-warning mr-1"></i>待支付</span>
						<span v-else-if="scope.row.is_pay == 2"><i class="dot bg-success mr-1"></i>已支付</span>
					</template>
				</el-table-column>
				<el-table-column prop="haspaytime" label="付款时间"></el-table-column>
				<el-table-column prop="remark" label="备注"></el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
	import Breadcrumb from "@/components/Breadcrumb";
	import BaseEcharts from "@/components/echarts/BaseEcharts"
	export default {
		name: 'ProjectDetail',
		components: {
			Breadcrumb,
			"my-echart":BaseEcharts,
		},
		data () {
			return {
				// 项目基本信息
				basic:{},
				// 厂商详情
				company_info:{},
				// 当前节点付款情况 -图
				option:{
			    tooltip: {
		        trigger: 'item',
		        formatter: '{a} <br/>{b} : {c} ({d}%)'
			    },
			    legend: {
		        orient: 'horizontal',
		        x: 'center',
		        bottom: '0',
		        icon: 'circle',
		        itemWidth: 10,
		        data: ['未付款', '已付款']
			    },
			    series: [
		        {
	            name: '金额',
	            type: 'pie',
	            radius: ['50%', '70%'],
	            center: ['50%', '48%'],
	            label: {
                formatter: `{b|{b}：}{c} 元 {per|{d}%}`,
                fontSize: 16,
                rich: {
                  per: {
                    color: '#eee',
                    backgroundColor: '#334455',
                    padding: [6, 6],
                    borderRadius: 4,
                  }
                }
            	},
	            data: [
                {value: 7000, name: '未付款'},
                {value: 3000, name: '已付款'},
	            ],
	            hoverOffset:5,
	            emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
	            }
		        }
			    ]
				},
				money_data:[],
				// 合同附件
				agreefiles:[],
				// 当前节点电子文档下拉选项
				edValue:"0",
				// 表单值
				dataJson:[],
				//项目状态
				statusActive:0,
				statusSteps:[],
				// 审核记录
				checkList:[],
				checkListAll:[],
				showMore: true,

				// 评审记录
				recheckList:[],
				recheckListAll:[],
				showMoreRecheck: true,

				// 进度上传记录
				processList:[],
				processListAll:[],
				showMoreProcess: true,

				// 验收记录
				acceptForm:{},
				accept_info:[],
				accept_info_all:[],
				showMoreAccept:true,

				// 合同付款节点
				tableProps: {
          
        },
        tableData: [],
        total: 0, //总条数
        currentPage: 1, //当前页
        pageSize: 15, //每页显示条数
			}
		},
		mounted(){
			this.initData();
    },
		methods:{
			// 获取数据
			initData(){
				this.$api.hosterDetail({
					id:this.$route.query.id
				}).then(data => {
					if(data.code == 0){
						this.basic = data.data.info;
						// 厂商信息
						this.company_info = data.data.company_info;
						// 当前付款节点--图
						this.money_data = data.data.money_data;
						this.option.series[0].data = data.data.money_data;
						// 表单值-详细信息
						this.dataJson = data.data.info.datajson;
						// 项目状态
						this.statusSteps = data.data.project_node;
						data.data.project_node.map((node,index)=>{
							if(data.data.info.current_node_id == node.id){
								this.statusActive = index;
							}
						})
						// 审核记录
						this.checkListAll = data.data.check_list;
						// 默认情况下审核记录
						if(data.data.check_list.length < 5){
							this.checkList = this.checkListAll;
						}else{
							this.checkList = this.checkListAll.slice(0,5);
						}

						// 评审记录
						this.recheckListAll = data.data.recheck_list;
						// 默认情况下评审记录
						if(data.data.recheck_list.length < 5){
							this.recheckList = this.recheckListAll;
						}else{
							this.recheckList = this.recheckListAll.slice(0,5);
						}

						// 进度上传记录
						this.processListAll = data.data.process_list;
						// 默认情况下上传记录
						if(data.data.process_list.length < 5){
							this.processList = this.processListAll;
						}else{
							this.processList = this.processListAll.slice(0,5);
						}

						// 验收记录
						this.acceptForm = data.data.project_accept_info;
						if(this.acceptForm){
							this.accept_info_all = data.data.project_accept_info.accept_info
							// 默认情况下验收记录
							if(data.data.project_accept_info.accept_info.length < 5){
								this.accept_info = this.accept_info_all;
							}else{
								this.accept_info = this.accept_info_all.slice(0,5);
							}
						}else{
							// console.log('666');
						}

						// 合同付款节点
						this.tableData = data.data.pay_info;
					}
				})
			},
			// 审核列表展开收起
			changeFoldState() {
				if(this.showMore){ // 展开
					this.checkList = this.checkListAll;
					this.showMore = false;
				}else{
					this.checkList = this.checkListAll.slice(0,5);
					this.showMore = true;
				}
			},

			// 评审审核列表展开收起
			changeFoldStateRecheck() {
				if(this.showMoreRecheck){ // 展开
					this.recheckList = this.recheckListAll;
					this.showMoreRecheck = false;
				}else{
					this.recheckList = this.recheckListAll.slice(0,5);
					this.showMoreRecheck = true;
				}
			},

			// 进度上传记录列表展开收起
			changeFoldStateProcess() {
				if(this.showMoreProcess){ // 展开
					this.processList = this.processListAll;
					this.showMoreProcess = false;
				}else{
					this.processList = this.processListAll.slice(0,5);
					this.showMoreProcess = true;
				}
			},

			// 验收列表展示收起
			changeFoldStateAccept() {
				if(this.showMoreAccept){ // 展开
					this.accept_info = this.accept_info_all;
					this.showMoreAccept = false;
				}else{
					this.accept_info = this.accept_info_all.slice(0,5);
					this.showMoreAccept = true;
				}
			},

			// 自增序列
      indexMethod(index) { 
        return ++index;
      },
			// 判断表格是否有子项，无子项不显示展开按钮
			getRowClassRecheck (row) {
				if (!row.row.recheck_detail) {
					return 'row-expand-cover'
				}
			},
			// 判断表格是否有子项，无子项不显示展开按钮
			getRowClassProcess (row) {
				if (!row.row.files) {
					return 'row-expand-cover'
				}
			},
			// 判断表格是否有子项，无子项不显示展开按钮
			getRowClass (row) {
				if (row.row.is_pay == 1) {
					return 'row-expand-cover'
				}
			},
      // 加载数据
      loadData(queryInfo) { 
        let _this = this;
        if (queryInfo != null) {
          this.currentPage = queryInfo.page;
          this.pageSize = queryInfo.pageSize;
        }
      },

			// 预览文件
			preview(path){
				this.$api.file_preview({
					path:path,
				}).then(data=>{
					if(data.code == 0){
						let a = document.createElement('a');
						a.style = 'display: none'; // 创建一个隐藏的a标签
						a.target = "_blank";
						a.href = data.data;
						document.body.appendChild(a);
						a.click();
					}else{
						this.$message.error(data.msg)
					}
				})
			},
			
			// 下载文件
			downloadview(file){
				let a = document.createElement('a'); 
				a.style = 'display: none'; // 创建一个隐藏的a标签
				a.download = file.name;
				a.href = this.$globalUrl.baseURL + file.path;
				document.body.appendChild(a);
				a.click(); // 触发a标签的click事件
				document.body.removeChild(a);
			},
		},
	}
</script>

<style>

</style>