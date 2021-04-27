<template>
	<div class="application_detail">
		<Breadcrumb></Breadcrumb>
		<el-row class="mt-3" :gutter="20" type="flex">
			<el-col :span="6">
				<el-card class="h-100">
					<h4 class="fs_16 font-weight-semibold m-0 text-000 mb-3">项目基本信息</h4>
					<div class="d-flex align-items-center flex-wrap">
						<p class="w-50"><span class="opacity-60 mr-2">项目编号:</span>{{basic.id}}</p>
						<p class="w-50"><span class="opacity-60 mr-2">建设方式:</span>{{basic.constructionMode}}</p>
						<p class="w-100"><span class="opacity-60 mr-2">项目名称:</span>{{basic.name}}</p>
						<p class="w-50"><span class="opacity-60 mr-2">项目类型:</span>{{basic.type}}</p>
						<p class="w-50"><span class="opacity-60 mr-2">项目属性:</span>{{basic.type}}</p>
						<p class="w-50"><span class="opacity-60 mr-2">项目负责人:</span>{{basic.applicant}}</p>
						<p class="w-100"><span class="opacity-60 mr-2">合同编号:</span>{{basic.contractNo}}</p>
						<p class="w-50 m-0"><span class="opacity-60 mr-2">合同金额: </span>{{basic.contractAmount}}元</p>
						<p class="w-50 m-0"><span class="opacity-60 mr-2">合同状态: </span>{{basic.contractState}}</p>
					</div>
					<div class="mt-3 progress-demo">
						<div class="d-flex justify-content-between mb-2">
							<span class="paid">{{basic.paidPercentage}}%</span>
							<span class="unPaid">{{100 - basic.paidPercentage}}%</span>
						</div>
						<el-progress :percentage="60" :show-text="false" :stroke-width="10" status="success"></el-progress>
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
						<p class="w-100"><span class="opacity-60 mr-2">公司名称:</span>{{manufacturer.companyName}}</p>
						<p class="w-100"><span class="opacity-60 mr-2">公司电话:</span>{{manufacturer.companyTel}}</p>
						<p class="w-100"><span class="opacity-60 mr-2">联系地址:</span>{{manufacturer.address}}</p>
						<p class="w-100"><span class="opacity-60 mr-2">公司开户行:</span>{{manufacturer.bankName}}</p>
						<p class="w-100"><span class="opacity-60 mr-2">公司账户:</span>{{manufacturer.bankAccount}}</p>
						<p class="w-100 m-0"><span class="opacity-60 mr-2">项目负责人:</span>{{manufacturer.director}}</p>
					</div>
				</el-card>
			</el-col>

			<el-col :span="6">
				<el-card class="h-100">
					<h4 class="fs_16 font-weight-semibold m-0 text-000 mb-3">当前节点应付款</h4>
					<my-echart :id="'echarts'" :data="option" height="230px"></my-echart>
				</el-card>
			</el-col>

			<el-col :span="6">
				<el-card class="h-100">
					<div class="d-flex align-items-center justify-content-between">
						<h4 class="fs_16 font-weight-semibold m-0 text-000">当前节点电子文档</h4>
						<el-select v-model="edValue" placeholder="请选择" class="w-30">
					    <el-option label="全部" value="0"></el-option>
					    <el-option label="教务处" value="1"></el-option>
					  </el-select>
					</div>
					<el-row :gutter="20" type="flex" justify="space-between" class="flex-wrap">
						<el-col :span="6" v-for="(i,index) in 8" :key="index" class="mt-3 text-center">
							<img src="@/assets/images/csv.png" alt="" width="42" />
							<p class="m-0 mt-2">文档1</p>
						</el-col>
					</el-row>
				</el-card>
			</el-col>
		</el-row>

		<!-- 项目状态 -->
		<el-card class="mt-3">
			<h4 class="fs_16 font-weight-semibold m-0 text-000 mb-3">项目状态</h4>
			<el-steps :active="statusActive" finish-status="success" align-center>
			  <el-step :title="status.title" v-for="(status,index) in statusSteps" :key="index"></el-step>
			</el-steps>
		</el-card>

		<!-- 当前节点任务信息 -->
		<el-card class="mt-3">
			<h4 class="fs_16 font-weight-semibold m-0 text-000 mb-3">当前节点任务信息</h4>
      <data-tables-server :data="tableData" layout="table,pagination" :total="total" :current-page="currentPage":page-size="pageSize" :pagination-props="{ background: true, pageSizes: [15,30,45,60] }" @query-change="loadData" :table-props="tableProps">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="type" label="任务类型"></el-table-column>
        <el-table-column prop="title" label="标题" width="500"></el-table-column>
        <el-table-column prop="status" label="处理状态"></el-table-column>
        <el-table-column prop="time" label="问题时间"></el-table-column>
      </data-tables-server>
    </el-card>
	</div>
</template>

<script>
	import Breadcrumb from "@/components/Breadcrumb";
	import BaseEcharts from "@/components/echarts/BaseEcharts"
	export default {
		name: 'ApplicationDetail',
		components: {
			Breadcrumb,
			"my-echart":BaseEcharts,
		},
		data () {
			return {
				// 项目基本信息
				basic:{
					id:"001",
					constructionMode:"中标公司",
      		name:"学生管理项目",
					type:"建设类",
      		attribute:"一般项目",
      		applicant:"DXD12张三",
      		contractNo:"123u1238213921321",
      		contractAmount:"520000",
      		contractState:"已签订",
      		paidPercentage:60,
				},
				// 厂商详情
				manufacturer:{
					companyName:"xxxxx软件股份有限公司",
					companyTel:"0519-68227371",
					address:"xxx路xx号xxx路xx号xxx路xx号",
					bankName:"建设银行武进分行",
					bankAccount:"6222202817271722172",
					director:"李四",
				},
				// 当前节点应付款 -图
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
		        data: ['未付款', '应付款']
			    },
			    series: [
		        {
	            name: '资金',
	            type: 'pie',
	            radius: ['50%', '70%'],
	            center: ['50%', '48%'],
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
				// 当前节点电子文档下拉选项
				edValue:"0",
				//项目状态
				statusActive:7,
				statusSteps:[
					{
						title:"项目资料",
					},
					{
						title:"招标材料",
					},
					{
						title:"招标确定",
					},
					{
						title:"合同状态",
					},
					{
						title:"实施状态",
					},
					{
						title:"试运行状态",
					},
					{
						title:"验收状态",
					},
					{
						title:"结尾款状态",
					},
					{
						title:"归档状态",
					},
				],
				// 任务信息
				tableProps: {
          'max-height': 670,
        },
        tableData: [
        	{
            id:"XD123321",
            type:"维保",
            title: "XXXX项目，出现系统故障请xx公司快速排出并提交对应文件",
            status: "未处理",
        		time:"2020.12.24",
        	},
        	{
            id:"XD123321",
            type:"维保",
            title: "XXXX项目，出现系统故障请xx公司快速排出并提交对应文件",
            status: "未处理",
        		time:"2020.12.24",
        	},
        	{
            id:"XD123321",
            type:"维保",
            title: "XXXX项目，出现系统故障请xx公司快速排出并提交对应文件",
            status: "未处理",
        		time:"2020.12.24",
        	},
        	{
            id:"XD123321",
            type:"维保",
            title: "XXXX项目，出现系统故障请xx公司快速排出并提交对应文件",
            status: "未处理",
        		time:"2020.12.24",
        	},
        	{
            id:"XD123321",
            type:"维保",
            title: "XXXX项目，出现系统故障请xx公司快速排出并提交对应文件",
            status: "未处理",
        		time:"2020.12.24",
        	},
        ],
        total: 0, //总条数
        currentPage: 1, //当前页
        pageSize: 15, //每页显示条数
			}
		},
		mounted(){
      this.total = this.tableData.length;
    },
		methods:{
			// 自增序列
      indexMethod(index) { 
        return ++index;
      },
      // 加载数据
      loadData(queryInfo) { 
        let _this = this;
        if (queryInfo != null) {
          this.currentPage = queryInfo.page;
          this.pageSize = queryInfo.pageSize;
        }
        // this.MyAxios.post(this.globalUrl.baseURL + "/forklift/achievements/achievements_list", {
        //   page: this.currentPage,
        //   limit: this.pageSize,
        //   name: this.filters[0].value
        // }).then(data => {
        //   if (data) {
        //     if (data.code == 0) {
        //       _this.total = data.count;
        //       _this.tableData = data.data;
        //     } else {
        //       _this.$message.error("接口失败");
        //     }
        //   }
        // })
      },
		},
	}
</script>

<style>

</style>