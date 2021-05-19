<template>
	<div class="application_detail">
		<!-- 登录信息 -->
		<global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-row class="mt-3" :gutter="20" type="flex">
			<el-col :span="6">
				<el-card class="h-100">
					<h4 class="fs_16 font-weight-semibold m-0 text-000 mb-3">项目基本信息</h4>
					<div class="d-flex align-items-center flex-wrap">
						<p class="w-100"><span class="opacity-60 mr-2">项目编号:</span>{{basic.apply_number}}</p>
						<p class="w-50"><span class="opacity-60 mr-2">项目名称:</span>{{basic.p_name}}</p>
						<p class="w-50"><span class="opacity-60 mr-2">项目类型:</span>{{basic.category_name}}</p>
						<p class="w-50"><span class="opacity-60 mr-2">项目年份:</span>{{basic.projecttime}}</p>
						<p class="w-50"><span class="opacity-60 mr-2">项目状态: </span>{{basic.current_node_text}}</p>
						<p class="w-100"><span class="opacity-60 mr-2">申请人所在部门:</span>{{basic.apply_user_depart}}</p>
						<p class="w-100"><span class="opacity-60 mr-2">合同编号:</span>{{basic.agree_number}}</p>
						<p class="w-50 m-0"><span class="opacity-60 mr-2">合同金额: </span>{{basic.budget_amount}}元</p>
					</div>
					<div class="mt-3 progress-demo">
						<div class="d-flex justify-content-between mb-2">
							<span class="paid">{{basic.paidPercentage}}%</span>
							<span class="unPaid">{{100 - basic.paidPercentage}}%</span>
						</div>
						<el-progress :percentage="basic.paidPercentage" :show-text="false" :stroke-width="10" status="success"></el-progress>
						<div class="d-flex justify-content-center mt-2">
							<span class="mr-2"><i class="icon-primitive-dot text-success"></i>已付款</span>
							<span class="ml-2"><i class="icon-primitive-dot text-grey-300"></i>未付款</span>
						</div>
					</div>
				</el-card>
			</el-col>

			<el-col :span="6">
				<el-card class="h-100 manufacturer">
					<h4 class="fs_16 font-weight-semibold m-0 text-000 mb-3">厂商详情</h4>
					<div class="d-flex align-items-center flex-wrap">
						<p class="w-100"><span class="opacity-60 mr-2">公司名称:</span>{{company_info.job_number}}</p>
						<p class="w-100"><span class="opacity-60 mr-2">公司电话:</span>{{company_info.phone}}</p>
						<p class="w-100"><span class="opacity-60 mr-2">联系地址:</span>{{company_info.address}}</p>
						<p class="w-100"><span class="opacity-60 mr-2">公司开户行:</span>{{company_info.bank_info}}</p>
						<p class="w-100"><span class="opacity-60 mr-2">公司账户:</span>{{company_info.account}}</p>
						<p class="w-100 m-0"><span class="opacity-60 mr-2">项目负责人:</span>{{company_info.name}}</p>
					</div>
				</el-card>
			</el-col>

			<el-col :span="8">
				<el-card class="h-100">
					<h4 class="fs_16 font-weight-semibold m-0 text-000 mb-3">当前节点应付款</h4>
					<my-echart :id="'echarts'" :data="option" height="230px"></my-echart>
				</el-card>
			</el-col>

			<el-col :span="6">
				<el-card class="h-100">
					<div class="d-flex align-items-center justify-content-between">
						<h4 class="fs_16 font-weight-semibold m-0 text-000">合同附件</h4>
					</div>
					<template v-for="(file,index) in agreefiles">
						<div class="detail_files  mt-3 d-flex align-items-center justify-content-between" :key="index">
							<div class="d-flex align-items-center">
								<img src="@/assets/images/csv.png" alt="" width="16" class="mr-2"/>
								<span>{{file.name}}</span>
							</div>
							<div class="opacity-80 cursor-pointer">
								<span @click="preview(file.path)"><i class="el-icon-view mr-1"></i></span>
								<span @click="downloadview(file)"><i class="el-icon-download mr-1"></i></span>
							</div>
						</div>
					</template>
				</el-card>
			</el-col>
		</el-row>

		<!-- 项目状态 -->
		<el-card class="mt-3">
			<h4 class="fs_16 font-weight-semibold m-0 text-000 mb-3">项目状态</h4>
			<el-steps :active="statusActive" finish-status="success" align-center>
				<el-step :title="status.name" v-for="(status,index) in statusSteps" :key="index"></el-step>
			</el-steps>
		</el-card>

		<!-- 合同付款节点 -->
		<el-card class="mt-3">
			<h4 class="fs_16 font-weight-semibold m-0 text-000 mb-3">合同付款节点</h4>
			<data-tables-server :data="tableData" layout="table,pagination" :total="total" :current-page="currentPage" :page-size="pageSize" :pagination-props="{ background: true, pageSizes: [15,30,45,60] }" :table-props="tableProps">
				<el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
				<el-table-column prop="title" label="标题"></el-table-column>
				<el-table-column prop="money" label="金额"></el-table-column>
				<el-table-column prop="paytime" label="付款节点"></el-table-column>
				<el-table-column prop="createtime" label="创建时间"></el-table-column>
			</data-tables-server>
		</el-card>
	</div>
</template>

<script>
	import GlobalTips from "@/components/GlobalTips";
	import Breadcrumb from "@/components/Breadcrumb";
	import BaseEcharts from "@/components/echarts/BaseEcharts"
	export default {
		name: 'firstCheckDetail',
		data () {
			return {
				// 项目基本信息
				basic:{},
				// 厂商详情
				company_info:{},
				// 当前节点应付款 -图
				option:{
			    tooltip: {
		        trigger: 'item',
		        formatter: '{a} <br/>{b} : {c} ({d}%)'
			    },
			    legend: {
		        orient: 'horizontal',
		        x: 'center',
		        bottom: '-5',
		        icon: 'circle',
		        itemWidth: 10,
			    },
			    series: [
		        {
	            name: '应付款',
	            type: 'pie',
	            radius: ['50%', '70%'],
	            center: ['50%', '45%'],
	            label: {
                fontSize: 14,
            	},
	            data: [
                {value: 7000, name: '未付款'},
                {value: 3000, name: '应付款'},
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
				// 合同附件
				agreefiles:[],
				//项目状态
				statusActive:0,
				statusSteps:[],
				// 任务信息
				tableProps: {
          'max-height': 670,
        },
        tableData: [],
        total: 0, //总条数
        currentPage: 1, //当前页
        pageSize: 15, //每页显示条数
			}
		},
		components: {
			GlobalTips,
			Breadcrumb,
			"my-echart":BaseEcharts,
		},
		mounted(){
			this.initData();
		},
		methods:{
			// 自增序列
      indexMethod(index) { 
        return ++index;
      },
			// 初始化
			initData(){
				this.projectId = this.$route.query.id;
				this.$api.firstCheck_detail({
					id:this.projectId,
				}).then(data =>{
					if(data.code == 0){
						// 项目信息
						this.basic = data.data.info;
						this.basic.paidPercentage = (data.data.info.has_pay_money/(data.data.info.has_pay_money + data.data.info.no_pay_money)).toFixed(2)*100
						data.data.project_node.map((item,index)=>{
							if(item.id == data.data.info.current_node_id){
								this.basic.current_node_text = item.name;
							}
						});
						// 厂商信息
						this.company_info = data.data.company_info;
						// 当前付款节点--图
						this.option = {
							series:[{
								data:data.data.money_data	
							}]
						};
						// 文件
						this.agreefiles = data.data.info.agreefile;
						// 项目状态
						this.statusActive = data.data.info.current_node_id - 1;
						this.statusSteps = data.data.project_node;
						// 合同付款节点
						this.tableData = data.data.pay_info;
					}else{
						this.$message.error(data.msg);
					}
				});
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
				a.href = file.path;
				document.body.appendChild(a);
				a.click(); // 触发a标签的click事件
				document.body.removeChild(a);
			},
		}
	}
</script>

<style>

</style>