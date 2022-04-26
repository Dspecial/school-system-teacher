<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<!-- 厂商信息 -->
			<h6 class="fs_18 font-weight-normal mb-3">厂商信息</h6>
			<el-form :model="companyInfo" ref="companyInfo" label-width="110px" label-position="left" class="pl-3 pr-3">
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="厂商名称">
							{{companyInfo.job_number}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="审核状态">
							<span class="text-warning" v-if="companyInfo.status == 1">待审核</span>
							<span class="text-success" v-else-if="companyInfo.status == 2">审核成功</span>
							<span class="text-danger" v-else-if="companyInfo.status == 3">审核失败</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>

		<!-- 申请信息 -->
		<el-card class="mt-3 bg-white">
			<h6 class="fs_18 font-weight-normal mb-3">申请信息</h6>
			<el-form label-width="110px" label-position="left" class="pl-3 pr-3">
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="申请人">
							{{companyInfo.name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="申请人所在部门">
							{{companyInfo.depart_name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="申请备注">
							{{companyInfo.remark}}
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>

		<!-- 审核信息 -->
		<el-card class="mt-3 bg-white" v-if="companyInfo.status != 1">
			<h6 class="fs_18 font-weight-normal mb-3">审核信息</h6>
			<el-form label-width="110px" label-position="left" class="pl-3 pr-3">
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="审核人">
							{{companyInfo.checkname}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="审核时间">
							{{companyInfo.checktime}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="审核备注">
							{{companyInfo.check_remark}}
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>

		<el-card class="mt-3 bg-white" v-if="companyInfo.status == 1">	
			<!-- 修改密码审核 -->
			<h6 class="fs_18 font-weight-normal mb-3">修改密码审核</h6>
			<el-form ref="checkform" :model="checkform"  class="pl-3 pr-3" label-position="top" label-width="110px" :rules="rules">
				<el-form-item label="重置密码值" prop="set_pwd">
					<el-input v-model="checkform.set_pwd" placeholder="请输入重置密码值"></el-input>
				</el-form-item>
				<el-form-item label="审核状态" prop="status">
					<el-radio-group v-model="checkform.status">
						<el-radio :label="2">通过</el-radio>
						<el-radio :label="3">驳回</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="审核备注">
					<el-input type="textarea" v-model="checkform.check_remark" placeholder="请输入审核备注" :rows="3"></el-input>
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
		name: 'CompanyapplyListCheck',
		data () {
			return {
				id:'',
				companyInfo: {},

				checkform:{
					set_pwd:"",
					status:"",
					check_remark:"",
				},
				rules:{
					set_pwd:[
						{ required: true, message: '请输入重置密码值', trigger: 'blur' }
					],
					status:[
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
				this.$api.companyapplyList_check({
					id:this.ID,
					function_type:1,
				}).then(data =>{
					if(data.code == 0){
						this.companyInfo = data.data;
						this.checkform.set_pwd = data.data.set_pwd;
					}else{
						this.$message.error(data.msg);
					}
				});
			},

			// 关闭编辑
			closedEdit(){
				// this.$router.go(-1);//返回上一层
				this.$router.push({
          path:"/check/companyapplyList",
        })
			},

      // form提交
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
          if (valid) {
						this.$api.companyapplyList_check({
							id:this.ID,
							function_type:2,
							set_pwd:this.checkform.set_pwd,
							status:this.checkform.status,
							check_remark:this.checkform.check_remark,
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
		}
	}
</script>

<style>

</style>