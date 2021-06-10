<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<!-- 项目信息 -->
			<el-form :model="projectInfo" ref="projectInfo" label-width="110px" label-position="left" class="pl-3 pr-3">
				<h6 class="fs_20 font-weight-normal mb-3">项目信息</h6>
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="项目名称">
							{{projectInfo.p_name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="项目编号">
							{{projectInfo.apply_number}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="创建人">
							{{recheckInfo.name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="创建时间">
							{{recheckInfo.createtime}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="审核状态">
							<span class="text-warning" v-if="check_info.check_state == 1">待审核</span>
							<span class="text-success" v-else-if="check_info.check_state == 2">审核成功</span>
							<span class="text-danger" v-else-if="check_info.check_state == 3">审核失败</span>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="评审概要">
							{{recheckInfo.content}}
						</el-form-item>
					</el-col>

					<el-col :span="24">
						<el-form-item label="评审信息">
							<template>
								<el-table
									:data="detailInfo"
									style="width: 100%">
									<el-table-column
										prop="e_name"
										label="评审人">
									</el-table-column>
									<el-table-column
										prop="content"
										label="评审内容">
									</el-table-column>
									<el-table-column
										prop="is_pass"
										label="是否通过">
										<template slot-scope="scope">
											<span v-if="scope.row.is_pass == 1"><i class="dot bg-success mr-1"></i>通过</span>
											<span v-else><i class="dot bg-danger mr-1"></i>不通过</span>
										</template>
									</el-table-column>
								</el-table>
							</template>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>

			<!-- 审核信息 -->
			<el-form label-width="110px" label-position="left" class="pl-3 pr-3" v-if="check_info.check_state != 1">
				<h6 class="fs_20 font-weight-normal mb-3">审核信息</h6>
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
						<el-form-item label="审核部门">
							{{check_info.checkgroup}}
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="审核备注">
							{{check_info.remark}}
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>

		<el-card class="mt-3 bg-white" v-if="check_info.check_state == 1">		
			<!-- 复审项目 -->
			<el-form ref="checkform" :model="checkform"  class="pl-3 pr-3" label-position="top" label-width="110px" :rules="rules">
				<h6 class="fs_20 font-weight-normal mb-3">复审项目</h6>
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
		name: 'RecheckCheck',
		data () {
			return {
				ID:"",
				check_info:{},
				projectInfo: {},
				recheckInfo:{},
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
				this.ID = this.$route.query.id;
				this.$api.recheckList_check({
					id:this.ID,
					function_type:1,
				}).then(data =>{
					if(data.code == 0){
						this.check_info = data.data.check_info;
						this.projectInfo = data.data.project_info;
						this.recheckInfo = data.data.project_recheck_info;
						this.detailInfo = data.data.project_recheck_detail_info;
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
						this.$api.recheckList_check({
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
		}
	}
</script>

<style>

</style>