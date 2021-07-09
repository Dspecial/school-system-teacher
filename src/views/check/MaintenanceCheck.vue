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
											<span v-else-if="scope.row.is_pay == 2"><i class="dot bg-success mr-1"></i>已支付</span>
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

		<el-card class="mt-3 bg-white" v-if="check_info.check_state == 1">	
			<!-- 维保审核 -->
			<h6 class="fs_18 font-weight-normal mb-3">维保审核</h6>
			<el-form ref="checkform" :model="checkform"  class="pl-3 pr-3" label-position="top" label-width="110px" :rules="rules">
				<el-form-item label="审核状态" prop="check_state">
					<el-radio-group v-model="checkform.check_state">
						<el-radio :label="2">通过</el-radio>
						<el-radio :label="3">驳回</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="审核备注">
					<el-input type="textarea" v-model="checkform.remark" placeholder="请输入审核备注" :rows="3"></el-input>
				</el-form-item>
				<div class="d-flex justify-content-end">
					<el-button type="primary" @click="submitForm('checkform')">确 定</el-button>
					<el-button @click="closedEdit">取 消</el-button>
				</div>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import GlobalTips from "@/components/GlobalTips";
	import Breadcrumb from "@/components/Breadcrumb";
	export default {
		name: 'MaintenanceCheck',
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
				rules:{
					check_state:[
						{ required: true, message: '请选择审核状态', trigger: 'change' }
					],
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
				this.$api.maintenanceList_check({
					id:this.ID,
					function_type:1,
				}).then(data =>{
					if(data.code == 0){
						// 审核信息
						this.check_info = data.data.check_info;
						// 项目维保信息
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
			// 关闭编辑
			closedEdit(){
				// this.$router.go(-1);//返回上一层
				this.$router.push({
          path:"/check/checkList",
        })
			},
      // form提交
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
          if (valid) {
						this.$api.maintenanceList_check({
							id:this.ID,
							function_type:2,
							check_state:this.checkform.check_state,
							remark:this.checkform.remark,
						}).then(data =>{
							if(data.code == 0){
								this.$message({
									message: data.msg,
									type: 'success'
								});
								this.closedEdit();
							}else{
								this.$message.error(data.msg);
							}
						});
          } else {
            console.log('error submit!!');
            return false;
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
				a.href = this.$globalUrl.baseURL + file.path;
				document.body.appendChild(a);
				a.click(); // 触发a标签的click事件
				document.body.removeChild(a);
			},

		}
	}
</script>

<style>

</style>