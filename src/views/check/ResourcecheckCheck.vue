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
						<el-form-item label="资源名称">
							{{projectInfo.name}}
						</el-form-item>
					</el-col>
          <el-col :span="8">
						<el-form-item label="审核状态">
              <span class="text-primary" v-if="projectInfo.status == 1">待审核</span>
              <span class="text-success" v-else-if="projectInfo.status == 2">审核成功</span>
              <span class="text-success" v-else-if="projectInfo.status == 3">审核失败</span>
						</el-form-item>
					</el-col>
          <el-col :span="8">
						<el-form-item label="申请时间">
							{{projectInfo.applytime}}
						</el-form-item>
					</el-col>
          <el-col :span="8">
						<el-form-item label="审核时间">
							{{projectInfo.checktime}}
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="资源备注">
							{{projectInfo.re_remark}}
						</el-form-item>
					</el-col>
          <el-col :span="24">
						<el-form-item label="申请备注">
							{{projectInfo.apply_remark}}
						</el-form-item>
					</el-col>
          <el-col :span="24">
						<el-form-item label="审核备注">
							{{projectInfo.remark}}
						</el-form-item>
					</el-col>

					<el-col :span="24">
						<el-form-item label="资源详细参数">
              <el-row :gutter="20" class="re_detail_json" v-if="details.length>0">
								<el-col :span="6" v-for="(item,index) in details" :key="index" class="pl-3 pr-3 pt-2 pb-2">
									<p class="mb-2 text-primary">{{item.title}}</p>
									<p class="m-0">{{item.val}}</p>
								</el-col>
							</el-row>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			
			<!-- 审核表单 -->
			<el-form ref="checkform" :model="checkform"  class="pl-3 pr-3" label-position="top" label-width="110px" :rules="rules">
				<h6 class="fs_20 font-weight-normal mb-3">审核资源</h6>
				<el-form-item label="审核状态" prop="status">
					<el-radio-group v-model="checkform.status">
						<el-radio :label="2">审核成功</el-radio>
						<el-radio :label="3">审核失败</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="资源备注">
					<el-input type="textarea" v-model="checkform.re_remark" placeholder="请输入资源备注" :rows="3"></el-input>
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
		name: 'ResourceCheck',
		data () {
			return {
				id:'', // 复核id
				check_info:"",
				details:[],
				projectInfo: {},
				checkform:{
					status:"",
					re_remark:"",
					remark:"",
				},
				rules:{
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
				this.id = this.$route.query.id;
				this.$api.resourceListCheck_check({
					id:this.id,
					function_type:1,
				}).then(data =>{
					if(data.code == 0){
						this.projectInfo = data.data;
						this.details = data.data.resource_info.detailjson;
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
						this.$api.resourceListCheck_check({
							id:this.id,
							function_type:2,
							status:this.checkform.status,
							re_remark:this.checkform.re_remark,
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