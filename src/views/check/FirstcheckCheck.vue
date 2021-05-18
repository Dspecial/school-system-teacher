<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<!-- 项目明细 -->
			<el-form :model="projectForm" ref="projectForm" label-width="110px" label-position="left" class="pl-3 pr-3">
				<h6 class="fs_20 font-weight-normal mb-3">项目明细</h6>
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="项目名称">
							{{projectForm.p_name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="所属公司">
							{{projectForm.company_name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="申请人">
							{{projectForm.apply_name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="录入时间" prop="recordtime">
							{{projectForm.recordtime}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="项目启动时间" prop="recordtime">
							{{projectForm.starttime}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="项目完成时间" prop="recordtime">
							{{projectForm.successtime}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="合同金额" prop="budget_amount">
							{{projectForm.budget_amount}} 元
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="合同编号" prop="budget_amount">
							{{projectForm.agree_number}}
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="合同文件" prop="agreefile">
							<div class="d-flex align-items-center justify-content-between" v-for="(file,index) in fileList" :key="index">
								<div class="cursor-pointer view" @click="preview(file.path)" title="在线预览">
									<i class="el-icon-document mr-2"></i><span>{{file.name}}</span>
								</div>
								<div class="opacity-80">
									<i class="el-icon-view cursor-pointer view mr-3" @click="preview(file.path)">  在线预览</i>
									<i class="el-icon-download cursor-pointer view" @click="downloadview(file)">  下载</i>
								</div>
							</div>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="项目付款信息" class="payment_item">
							<template>
								<el-table
									:data="projectForm.agree_payinfo"
									style="width: 100%">
									<el-table-column
										prop="title"
										label="标题">
									</el-table-column>
									<el-table-column
										prop="money"
										label="付款节点">
									</el-table-column>
									<el-table-column
										prop="paytime"
										label="录入时间">
									</el-table-column>
								</el-table>
							</template>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>

			<!-- 审核表单 -->
			<el-form ref="checkform" :model="checkform" class="pl-3 pr-3" label-position="top" label-width="110px" :rules="rules" v-if="check_info == 1">
				<h6 class="fs_20 font-weight-normal mb-3">审核项目</h6>
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
		name: 'FirstcheckCheck',
		data () {
			return {
				projectId:'',
				check_info:"",
				titile:"编辑初审项目",
				fileList:[],
				projectForm: {
        },
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
				this.projectId = this.$route.query.id;
				this.$api.firstCheckList_check({
					project_id:this.projectId,
					function_type:1,
				}).then(data =>{
					if(data.code == 0){
						this.check_info = data.data.check_info;

						this.projectForm = data.data.info;
						let arrList = [];
						for (let i in data.data.info.agreefile) {
							var obj = {};
							var a = data.data.info.agreefile[i].path.split("/");
							var b = a[a.length -1];
							obj.name = b;
							obj.url = this.$globalUrl.baseURL + data.data.info.agreefile[i].path;
							obj.path = data.data.info.agreefile[i].path;
							obj.isExist = true;
							arrList.push(obj);
						}
						this.fileList = arrList;
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
			// 关闭编辑
			closedEdit(){
				this.$router.go(-1);//返回上一层
			},
      // form提交
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
          if (valid) {
						this.$api.firstCheckList_check({
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