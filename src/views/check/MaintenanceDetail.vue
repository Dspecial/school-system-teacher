<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<!-- 项目信息 -->
			<h6 class="fs_18 font-weight-normal mb-3">项目信息</h6>
			<el-form :model="maintenanceInfo" ref="maintenanceInfo" label-width="110px" label-position="left" class="pl-3 pr-3">
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="维保编号">
							{{maintenanceInfo.extend_number}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="申请年份">
							{{maintenanceInfo.projecttime}} 年
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="申请人">
							{{apply_info.name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="申请人所在部门">
							{{apply_info.depart_name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="维保企业名称">
							{{maintenanceInfo.company_name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="维保结束日期">
							{{maintenanceInfo.endtime}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="合同金额">
							{{maintenanceInfo.money}} 元
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="标题">
							{{maintenanceInfo.title}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="联系人">
							{{maintenanceInfo.contact_name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="联系电话">
							{{maintenanceInfo.contact_phone}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="审核状态">
							<span class="text-warning" v-if="check_info.check_state == 1">待审核</span>
							<span class="text-success" v-else-if="check_info.check_state == 2">审核成功</span>
							<span class="text-danger" v-else-if="check_info.check_state == 3">审核失败</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="创建时间">
							{{maintenanceInfo.createtime}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="审核时间">
							{{check_info.checktime}}
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="维保内容">
							{{maintenanceInfo.content}}
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="合同附件" class="file-form-item">
							<div class="d-flex align-items-center justify-content-between mb-2" v-for="(file,index) in maintenanceInfo.file_arr" :key="index">
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
					<el-col :span="24">
						<el-form-item label="付款节点">
							<template>
								<el-table :data="pay_info">
									<el-table-column prop="title" label="标题"></el-table-column>
									<el-table-column prop="money" label="金额"></el-table-column>
									<el-table-column prop="paytime" label="付款节点"></el-table-column>
									<el-table-column prop="is_pay" label="是否支付">
										<template slot-scope="scope">
											<span v-if="scope.row.is_pay == 1"><i class="dot bg-warning mr-1"></i>待支付</span>
											<span v-else><i class="dot bg-success mr-1"></i>已支付</span>
										</template>
									</el-table-column>
									<el-table-column prop="haspaytime" label="付款时间"></el-table-column>
								</el-table>
							</template>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>

			<!-- 审核信息 -->
			<div v-if="check_info.check_state != 1">
				<h6 class="fs_18 font-weight-normal mb-3">审核信息</h6>
				<el-form label-width="110px" label-position="left" class="pl-3 pr-3">
					<el-row :gutter="20">
						<el-col :span="8">
							<el-form-item label="审核人">
								{{check_info.checkname}}
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="审核时间">
								{{check_info.checktime}}
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="审核备注">
								{{check_info.remark}}
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-card>
	</div>
</template>

<script>
	import GlobalTips from "@/components/GlobalTips";
	import Breadcrumb from "@/components/Breadcrumb";
	export default {
		name: 'MaintenanceDetail',
		data () {
			return {
				ID:'',
				check_info:{},
				maintenanceInfo: {},
				apply_info:{},
				pay_info:[],
				checkform:{
					check_state:"",
					remark:"",
				},
			}
		},
		components: {
			GlobalTips,
			Breadcrumb,
		},
		mounted(){
			this.openEdit();
		},
		methods:{
			// dialog初始化
			openEdit(){
				this.ID = this.$route.query.id;
				this.$api.maintenance_detail({
					id:this.ID,
				}).then(data =>{
					if(data.code == 0){
						// 审核信息
						this.check_info = data.data.check_info;
						// 醒目维保信息
						this.maintenanceInfo = data.data.info;
						// 申请人信息
						this.apply_info = data.data.info.apply_info;
						// 付款节点
						this.pay_info = data.data.pay_info;
					}else{
						this.$message.error(data.msg);
					}
				});
			},
		}
	}
</script>

<style>

</style>