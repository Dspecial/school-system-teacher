<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<!-- 项目基本信息 -->
		<el-card class="mt-3 bg-white">
			<h6 class="fs_18 font-weight-normal mb-3">项目基本信息</h6>
			<el-form label-width="140px" label-position="left" class="pl-3 pr-3">
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="项目编号">
							{{projectInfo.apply_number}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="项目名称">
							{{projectInfo.p_name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="申请类别">
							{{projectInfo.pname}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="申请人">
							{{projectInfo.name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="申请人所在部门">
							{{projectInfo.depart_name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="项目年份">
							{{projectInfo.projecttime}} 年
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="预算金额" v-if="projectInfo.budget_amount != 0">
							{{projectInfo.budget_amount}} 元
						</el-form-item>
					</el-col>
					<template v-for="(formItem,j) in projectInfo.dataJson">
						<el-col :span="24" :key="j" v-if="formItem.name_type == 5 || formItem.name_type == 13 || formItem.name_type == 14 || formItem.name_type == 15">
							<el-form-item :label="formItem.title">
								<div class="d-flex align-items-center justify-content-between mb-2" v-for="(file,index) in formItem.file_arr" :key="index">
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
						<el-col :span="24" :key="j" v-else-if="formItem.name_type == 12" >
							<el-form-item :label="formItem.title" class="json-form-item">
								<div class="w-100 d-flex align-items-center pb-1 mb-1" v-for="(cell,index) in formItem.value" :key="index">
									<p class="m-0 w-100 pl-2 pr-2" v-for="(item,k) in cell" :key="k">{{item}}</p>
								</div>
							</el-form-item>
						</el-col>
						<el-col :span="8" :key="j" v-else-if="formItem.name_type == 9 || formItem.name_type == 10">
							<el-form-item :label="formItem.title">
								{{formItem.value.join(",")}}
							</el-form-item>
						</el-col>
						<el-col :span="8" :key="j" v-else-if="formItem.name_type == 7">
							<el-form-item :label="formItem.title">
								<span v-html="formItem.value"></span>
							</el-form-item>
						</el-col>
						<el-col :span="8" :key="j" v-else>
							<el-form-item :label="formItem.title">
								{{formItem.value}}
							</el-form-item>
						</el-col>
					</template>
				</el-row>
			</el-form>
		</el-card>

		<el-card class="mt-3 bg-white">
			<h6 class="fs_18 font-weight-normal mb-3">{{titile}}</h6>
			<el-form :model="recheckForm" :rules="rules" ref="recheckForm" label-width="110px" label-position="top" class="pl-3 pr-3">
				<el-row :gutter="20">
					<el-col :span="24">
						<el-form-item label="评审状态" class="payment_item" required prop="sendjson">
							<div slot="label" class="d-flex justify-content-between">
								<span>评审状态</span>
								<span class="text-primary cursor-pointer" @click="addPro(recheckForm.sendjson)"><i class="el-icon-plus mr-1"></i>评审状态</span>
							</div>
							<template v-for="(cell,INDEX) in recheckForm.sendjson">
								<el-row type="flex" align="middle" :gutter="20" class="cell_row mb-3" :key="INDEX">
									<el-col :span="24">
										<el-select v-model="cell.expert_id" placeholder="请选择专家" class="w-100" clearable @change="changeCheck">
											<el-option
												v-for="item in expertOptions"
												:key="item.id"
												:label="item.e_name"
												:value="item.id"
												:disabled="item.isSelect">
											</el-option>
										</el-select>
									</el-col>
									<el-col :span="24">
										<el-select v-model="cell.is_pass" clearable placeholder="请选择是否通过" class="w-100">
											<el-option label="通过" value="1"></el-option>
											<el-option label="不通过" value="2"></el-option>
										</el-select>
									</el-col>
									<el-col :span="24">
										<el-input v-model="cell.content" placeholder="请输入评审意见"></el-input>
									</el-col>
									<el-col :span="2" class="text-right">
										<span class="text-danger cursor-pointer" @click="delField(recheckForm.sendjson,INDEX)">删除</span>
									</el-col>
								</el-row>
							</template>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="评审日期" prop="recheck_date">
							<el-date-picker 
								type="date" 
								placeholder="请选择评审日期，必须大于当前日期"
								:picker-options="startOption" 
								v-model="recheckForm.recheck_date" 
								value-format="yyyy-MM-dd"
								clearable
								style="width: 100%;"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="评审内容" prop="content">
							<el-input type="textarea" v-model="recheckForm.content" placeholder="请输入评审内容" :rows="3"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="方案附件" prop="planattach">
							<el-upload
								class="my_upload"
								drag
								action="void"
								accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.jpg,.png,.JPEG"
								:auto-upload="true"
								:http-request="myUploadPlan"
								:show-file-list="true"
								:file-list="filesListPlan"
								:before-upload="beforeUploadPlan"
								:on-success="handleSuccessPlan"
								:on-remove="handleRemovePlan">
								<div class="el-upload__text"><i class="el-icon-upload"></i>将文档拖到此处，或<em>点击选择文档</em></div>
							</el-upload>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="专家签字附件" prop="expertattch">
							<el-upload
								class="my_upload"
								drag
								action="void"
								accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.jpg,.png,.JPEG"
								:auto-upload="true"
								:http-request="myUploadExpert"
								:show-file-list="true"
								:file-list="filesListExpert"
								:before-upload="beforeUploadExpert"
								:on-success="handleSuccessExpert"
								:on-remove="handleRemoveExpert">
								<div class="el-upload__text"><i class="el-icon-upload"></i>将文档拖到此处，或<em>点击选择文档</em></div>
							</el-upload>
						</el-form-item>
					</el-col>
				</el-row>
				<div class="d-flex justify-content-end">
					<el-button type="primary" @click="submitForm('recheckForm')">确 定</el-button>
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
		name: 'RecheckCheckEdit',
		data () {
			return {
				// 项目基本信息
				projectInfo: {},
				// 评审（评审）相关
				projectId:'',
				titile:"评审编辑",
				expertOptions:[],
				isSelectArr:[],
				recheckForm: {
					sendjson:[{}],
					recheck_date:"",
					content:"",
        },
				filesListPlan:[],
				removeFilesPlanArr:[],
				filesListExpert:[],
				removeFilesExpertArr:[],
				startOption:{
					disabledDate: time =>{
						return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
					}
				},
        rules: {
					sendjson: [
            { required: true, message: '请选择评审状态', trigger: 'change' }
          ],
					recheck_date: [
            { required: true, message: '请选择评审日期', trigger: 'change' }
          ],
					content: [
            { required: true, message: '请输入评审内容', trigger: 'blur' }
          ],
        }
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
			// 获取专家列表
			initExpert(){
				this.$api.projectExpert({
				}).then(data =>{
					if(data.code == 0){
						// 回调成功的方法
						this.expertOptions = data.data;
						this.expertOptions.map((item)=>{
							item.isSelect = false;
						})
					}else{
						this.$message.error(data.msg);
					}
				});
			},
			// 专家选择
			changeCheck(val){
				this.expertOptions.map((arr)=>{
					if(val == arr.id){
						arr.isSelect = true;
					}
				})
				this.$set(this.expertOptions);
			},
			// 添加审核流程
			addPro(item){
				item.push({});
			},
			// 删除字段
			delField(item,index){
				item.splice(index, 1);
			},
			// dialog初始化
			openEdit(){
				this.projectId = this.$route.query.id;
				this.initExpert();
				this.$api.recheckList_edit({
					function_type:1,
					id:this.projectId,
				}).then(data=>{
					if(data.code == 0){
						// 项目基本信息
						this.projectInfo = data.data.info;
						this.projectInfo.dataJson = data.data.info.datajson;
						// 评审（复审）相关
						this.recheckForm.sendjson = JSON.parse(data.data.project_recheck_info.sendjson);
						this.recheckForm.recheck_date = data.data.project_recheck_info.recheck_date;
						this.recheckForm.content = data.data.project_recheck_info.content;
						this.filesListPlan = data.data.project_recheck_info.planattach;
						this.filesListExpert = data.data.project_recheck_info.expertattch;
					}
				})
			},
			// 关闭编辑
			closedEdit(){
				this.$router.push({
          path:"/check/checkList",
        })
				// this.$router.go(-1);//返回上一层
			},
      // form提交
			submitForm(formName) {
				var _this = this;
				var newArr = new Array;
				var isArr = this.commonJs.isEmpty(this.recheckForm.sendjson[0]);
				if(!isArr){
					newArr = this.recheckForm.sendjson
				}
				var planattachArr = this.filesListPlan.map((item)=>{
					if(item.isExist){
						return item.path;
					}else{
						return item.response.data.path
					}
				})
				var expertattchArr = this.filesListExpert.map((item)=>{
					if(item.isExist){
						return item.path;
					}else{
						return item.response.data.path
					}
				})
				this.$refs[formName].validate((valid) => {
          if (valid) {
						this.$api.recheckList_edit({
							function_type:2,
							id:this.projectId,
							sendjson:JSON.stringify( newArr ),
							recheck_date: this.recheckForm.recheck_date,
							content: this.recheckForm.content,
							planattach:planattachArr.join(','),
							expertattch:expertattchArr.join(','),
						}).then(data =>{
							if(data.code == 0){
								this.removeFilesPlanArr.map((path)=>{
									_this.removeFile(path);
								})
								this.removeFilesExpertArr.map((path)=>{
									_this.removeFile(path);
								})
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

						/****  上传  ****/
			myUploadPlan(params){
	      // 通过 FormData 对象上传文件
	      const formData = new FormData();
	      formData.append("apply_number", this.projectInfo.apply_number);
	      formData.append("file", params.file);
	      formData.append("user_token", this.VueCookies.get("application_token"));

				this.$api.uploadRecheck(formData).then(data =>{
					if(data.code == 0){
						// 回调成功的方法
						params.onSuccess(data);
						this.$message.success(data.msg);
					}else{
						this.$message.error(data.msg);
					}
				});
			},
			
      // 上传成功
			handleSuccessPlan(res, file, fileList) {
				this.filesListPlan = fileList;
      },

      // 移除上传文件
      handleRemovePlan(file,fileList) {
      	var path;
				if(file.status == 'success'){
					if(file.isExist){ // 原先上传已存在的
						path = file.path;
					}else{ // 刚刚上传的
						path = file.response.data.path;
					}
					this.filesListPlan = fileList;
					this.$message({message: '成功移除' + file.name, type: 'success'});

					if(this.removeFilesPlanArr.indexOf(path) == -1){
						this.removeFilesPlanArr.push(path);
					}
				}
      },
      
      // 上传前验证
      beforeUploadPlan(file) {
				var isUpload = true;
      	// 验证大小等
				this.filesListPlan.map((fff)=>{
					if(fff.name == file.name){
						this.$message.warning("请不要重复上传相同文件！");
						isUpload = false;
						return;
					}
				})
				return isUpload;
      },

			/****  上传  ****/
			myUploadExpert(params){
	      // 通过 FormData 对象上传文件
	      const formData = new FormData();
	      formData.append("apply_number", this.projectInfo.apply_number);
	      formData.append("file", params.file);
	      formData.append("user_token", this.VueCookies.get("application_token"));

				this.$api.uploadRecheck(formData).then(data =>{
					if(data.code == 0){
						// 回调成功的方法
						params.onSuccess(data);
						this.$message.success(data.msg);
					}else{
						this.$message.error(data.msg);
					}
				});
			},
			
      // 上传成功
			handleSuccessExpert(res, file, fileList) {
				this.filesListExpert = fileList;
      },

      // 移除上传文件
      handleRemoveExpert(file,fileList) {
      	var path;
				if(file.status == 'success'){
					if(file.isExist){ // 原先上传已存在的
						path = file.path;
					}else{ // 刚刚上传的
						path = file.response.data.path;
					}
					this.filesListExpert = fileList;
					this.$message({message: '成功移除' + file.name, type: 'success'});

					if(this.removeFilesExpertArr.indexOf(path) == -1){
						this.removeFilesExpertArr.push(path);
					}
				}
      },

      // 上传前验证
      beforeUploadExpert(file) {
				var isUpload = true;
      	// 验证大小等
				this.filesListExpert.map((fff)=>{
					if(fff.name == file.name){
						this.$message.warning("请不要重复上传相同文件！");
						isUpload = false;
						return;
					}
				})
				return isUpload;
      },

			// 删除调接口
			removeFile(path){
				this.$api.uploadDel({
      		path:path,
      	}).then(data =>{
					if(data.code == 0){
						// this.$message.success("文件更新成功");
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