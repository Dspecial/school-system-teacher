<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<!-- 项目信息 -->
			<el-form :model="processInfo" ref="processInfo" label-width="110px" label-position="left" class="pl-3 pr-3">
				<h6 class="fs_20 font-weight-normal mb-3">项目信息</h6>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="上传编号">
							{{processInfo.process_number}}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="标题">
							{{processInfo.title}}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="创建人">
							{{processInfo.company_name}}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="创建时间">
							{{processInfo.createtime}}
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="进度内容">
							{{processInfo.content}}
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>

			<!-- 复核表单 -->
			<el-form ref="checkform" :model="checkform"  class="pl-3 pr-3" label-position="top" label-width="110px" :rules="rules" v-if="check_info == 1">
				<h6 class="fs_20 font-weight-normal mb-3">复核项目</h6>
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
		name: 'RecheckCheck',
		data () {
			return {
				id:'', // 复核id
				projectId:'',
				check_info:"",
				processInfo: {},
				detailInfo:[],
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
				this.projectId = this.$route.query.project_id;
				this.id = this.$route.query.id;
				this.$api.processList_check({
					id:this.id,
					project_id:this.projectId,
					function_type:1,
				}).then(data =>{
					if(data.code == 0){
						this.check_info = data.data.check_info;
						this.processInfo = data.data.project_process_info;
						this.detailInfo = data.data.project_process_detail_info;
					}else{
						this.$message.error(data.msg);
					}
				});
			},
			// 关闭编辑
			closedEdit(){
				this.$router.go(-1);//返回上一层
			},
      // form提交
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
          if (valid) {
						this.$api.processList_check({
							id:this.id,
							project_id:this.projectId,
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
		}
	}
</script>

<style>

</style>