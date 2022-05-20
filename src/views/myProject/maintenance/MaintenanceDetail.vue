<template>
	<div class="application_detail">
		<Breadcrumb></Breadcrumb>
		<el-row class="mt-3" :gutter="20" type="flex">
			<el-col :span="24">
				<el-card class="h-100">
					<h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">项目基本信息</h4>
					<div class="d-flex align-items-center flex-wrap">
						<p class="w-100 mb-3"><span class="opacity-60 mr-2">维保编号：</span>{{basic.extend_number}}</p>
						<p class="w-100 mb-3"><span class="opacity-60 mr-2">维保标题：</span>{{basic.title}}</p>
						<p class="w-100 mb-3"><span class="opacity-60 mr-2">维保内容：</span>{{basic.content}}</p>
						<p class="w-50 mb-3"><span class="opacity-60 mr-2">项目年份：</span>{{basic.projecttime}}</p>
						<p class="w-50 mb-3"><span class="opacity-60 mr-2">金额：</span>{{basic.money}}</p>
						<p class="w-50 mb-3"><span class="opacity-60 mr-2">企业联系人：</span>{{basic.contact_name}}</p>
						<p class="w-50 mb-3"><span class="opacity-60 mr-2">企业联系方式：</span>{{basic.contact_phone}}</p>
						<p class="w-100 mb-3"><span class="opacity-60 mr-2">创建时间：</span>{{basic.createtime}}</p>
						<p class="w-100 mb-0"><span class="opacity-60 mr-2">维保时间：</span>{{basic.endtime}}</p>
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

		<!-- 合同附件 -->
		<el-card class="mt-3" v-if="basic.files && basic.files.length > 0">
			<h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">合同附件</h4>
			<div class="d-flex align-items-center justify-content-between mb-2" v-for="(file,index) in basic.files" :key="index">
				<div class="cursor-pointer view" @click="preview(file.path)" title="在线预览">
					<i class="el-icon-document mr-2"></i><span>{{file.name}}</span>
				</div>
				<div class="opacity-80 ml-5 pl-5">
					<i class="el-icon-view cursor-pointer view mr-3" @click="preview(file.path)"></i>
					<i class="el-icon-download cursor-pointer view" @click="downloadview(file)"></i>
				</div>
			</div>
		</el-card>

		<!-- 审核记录 -->
		<!-- <el-card class="mt-3">
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
		</el-card> -->

		<!-- 合同规定付款计划 -->
		<el-card class="mt-3 bg-white" v-if="tableData.length != 0">
			<h6 class="fs_18 font-weight-normal mb-3">合同规定付款计划</h6>
			<el-form label-width="110px" label-position="left">
				<el-table :data="tableData" :default-expand-all="false" :row-class-name="getRowClass">
					<el-table-column type="expand" label="" width="50">
						<template slot-scope="scope">
							<el-table :data="scope.row.pay_list">
								<el-table-column prop="real_money" label="实际金额"></el-table-column>
								<el-table-column prop="haspaytime" label="已付款节点"></el-table-column>
								<el-table-column prop="remark" label="备注"></el-table-column>
								<el-table-column prop="files" label="付款凭证或附件">
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
							</el-table>
						</template>
					</el-table-column>
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
			</el-form>
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
				statusActive:7,
				statusSteps:[],
				// 审核记录
				checkList:[],
				checkListAll:[],
				showMore: true,
				// 合同规定付款计划
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
				this.$api.my_maintenance_detail({
					id:this.$route.query.id
				}).then(data => {
					if(data.code == 0){
						this.basic = data.data.info;
						// 厂商信息
						this.company_info = data.data.company_info;
						// 当前付款节点--图
						this.money_data = data.data.money_data;
						this.option.series[0].data = data.data.money_data;

						// 审核记录
						this.checkListAll = data.data.check_list;
						// 默认情况下审核记录
						if(data.data.check_list.length < 5){
							this.checkList = this.checkListAll;
						}else{
							this.checkList = this.checkListAll.slice(0,5);
						}
						// 合同规定付款计划
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
			// 自增序列
      indexMethod(index) { 
        return ++index;
      },
			// 判断表格是否有子项，无子项不显示展开按钮
			getRowClass (row) {
				if (row.row.pay_list.length == 0) {
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