<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<!-- 项目信息 -->
			<el-form :model="accept_info" ref="accept_info" label-width="110px" label-position="left" class="pl-3 pr-3">
				<h6 class="fs_20 font-weight-normal mb-3">项目信息</h6>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="验收编号">
							{{accept_info.accept_number}}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="企业名称">
							{{accept_info.job_number}}
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="验收备注">
							{{accept_info.remark}}
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="验收列表">
							<div class="accept_info_detial mb-3" v-for="(info,i) in accept_info_detial" :key="i">
								<p>{{info.title}}</p>
								<div class="d-flex align-items-center justify-content-between" v-for="(file,index) in info.files" :key="index">
									<div class="cursor-pointer view" @click="preview(file.path)" title="在线预览">
										<i class="el-icon-document mr-2"></i><span>{{file.name}}</span>
									</div>
									<div>
										<i class="el-icon-view cursor-pointer view mr-3" @click="preview(file.path)">  在线预览</i>
										<i class="el-icon-download cursor-pointer view" @click="downloadview(file)">  下载</i>
									</div>
								</div>
							</div>
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
		props:['editData'],
		name: 'AcceptCheck',
		data () {
			return {
				id:'', // 复核id
				projectId:'',
				check_info:"",
				accept_info: {},
				accept_info_detial:[],
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
				this.$api.acceptList_check({
					id:this.id,
					project_id:this.projectId,
					function_type:1,
				}).then(data =>{
					if(data.code == 0){
						this.check_info = data.data.check_info;
						this.accept_info = data.data.accept_info;
						this.accept_info_detial = data.data.accept_info_detial;
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
						this.$api.acceptList_check({
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