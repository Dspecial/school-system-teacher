<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<h6 class="fs_20 font-weight-normal mb-3">{{titile}}</h6>
			<el-form :model="projectForm" :rules="rules" ref="projectForm" label-width="110px" label-position="top" class="pl-3 pr-3">
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="项目类别" prop="p_cate_id">
							<el-select v-model="projectForm.p_cate_id" placeholder="请选择项目类别" class="w-100">
								<el-option
									v-for="item in cateOptions"
									:key="item.id"
									:label="item.name"
									:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="项目名称" prop="p_name">
							<el-input v-model="projectForm.p_name" placeholder="请输入项目名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="合同金额" prop="budget_amount">
							<el-input v-model.number="projectForm.budget_amount" placeholder="请输入合同金额"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="合同编号" prop="agree_number">
							<el-input v-model="projectForm.agree_number" placeholder="请输入合同编号"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="录入时间" prop="recordtime">
							<el-date-picker type="date" placeholder="选择日期" v-model="projectForm.recordtime" style="width: 100%;"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="项目启动时间" prop="starttime">
							<el-date-picker type="date" placeholder="选择日期" v-model="projectForm.starttime" style="width: 100%;"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="所属公司" prop="company_id">
							<el-select v-model="projectForm.company_id" placeholder="请选择所属公司" class="w-100">
								<el-option
									v-for="item in companyOptions"
									:key="item.id"
									:label="item.job_number"
									:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="项目介绍">
							<el-input type="textarea" v-model="projectForm.p_biref" placeholder="请输入项目介绍" :rows="3"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="建设背景与目标" prop="construction_b_o">
							<vEditor v-model="projectForm.construction_b_o"></vEditor>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="主要内容">
							<vEditor v-model="projectForm.content"></vEditor>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="调研情况">
							<vEditor v-model="projectForm.research_situation"></vEditor>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="合同文件" prop="agreefile">
							<div class="d-flex align-items-start justify-content-between">
								<el-upload
									class="my_upload"
									drag
									action="void"
									:accept="accept"
									:auto-upload="true"
									:http-request="myUpload"
									:file-list="projectForm.agreefile"
									:on-success="handleSuccess"
									:on-remove="handleRemove"
									:before-upload="beforeUpload">
									<div class="el-upload__text"><i class="el-icon-upload"></i>将文档拖到此处，或<em>点击选择文档</em></div>
								</el-upload>
							</div>
						</el-form-item>
					</el-col>
				</el-row>
				<div class="d-flex justify-content-end">
					<el-button type="primary" @click="submitForm('projectForm')">确 定</el-button>
					<el-button @click="closedEdit('projectForm')">取 消</el-button>
				</div>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import GlobalTips from "@/components/GlobalTips";
	import Breadcrumb from "@/components/Breadcrumb";
	import vEditor from "@/components/quill-editor/ue";
	export default {
		props:['editData'],
		name: 'ProjectEdit',
		data () {
			return {
				projectId:'',
				titile:"新增项目",
				accept: ".pdf,.doc,.docx,.xls,.xlsx,.zip",
				cateOptions:[],
				companyOptions:[],
				projectForm: {
					p_cate_id:"",
          p_name: "",
					company_id: "",
          budget_amount:"",
					agree_number: "",
          p_biref:"",
          construction_b_o:"",
          content:"",
          research_situation:"",
					agreefile: [],
          recordtime:"",
          starttime:"",
        },
        rules: {
					p_cate_id: [
            { required: true, message: '请选择项目类别', trigger: 'change' }
          ],
					p_name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' }
          ],
					company_id: [
            { required: true, message: '请选择合作企业', trigger: 'change' }
          ],
					agree_number: [
            { required: true, message: '请输入合同编号', trigger: 'blur' }
          ],
					budget_amount: [
          	{ required: true, message: '请输入合同金额', trigger: 'blur' },
          	{ type: 'number', message: '合同金额必须为数字值'}
          ],
					construction_b_o: [
            { required: true, message: '请输入建设背景与目标', trigger: 'blur' }
          ],
					recordtime: [
            { type: 'date', required: true, message: '请选择录入时间', trigger: 'change' }
          ],
					starttime: [
            { type: 'date', required: true, message: '请输入项目启动时间', trigger: 'change' }
          ],
					agreefile: [
            { required: true, message: '请上传合同文件', trigger: 'change' }
          ],
        }
			}
		},
		components: {
			GlobalTips,
			Breadcrumb,
			vEditor
		},
		mounted(){
			this.openEdit();
		},
		methods:{
			// 获取项目分类
			initCate(){
				this.$api.getProjectCate({
				}).then(data =>{
					if(data.code == 0){
						// 回调成功的方法
						this.cateOptions = data.data;
					}else{
						this.$message.error(data.msg);
					}
				});
			},
			// 获取企业列表
			initCompany(){
				this.$api.getCompany({
				}).then(data =>{
					if(data.code == 0){
						// 回调成功的方法
						this.companyOptions = data.data;
					}else{
						this.$message.error(data.msg);
					}
				});
			},
			// dialog初始化
			openEdit(){
				this.projectId = this.$route.query.id;
				this.initCate();
				this.initCompany();

			},
			// dialog关闭
			closedEdit(formName){
				this.handleClose();
				this.resetForm(formName);
			},
			// 右上角x关闭
			handleClose(){
				this.editData.dialog = false;
			},
      // form提交
			submitForm(formName) {
				var _this = this;
				var randnum = Math.floor(Math.random()*(9999-1000))+1000; // 四位随机数
        this.$refs[formName].validate((valid) => {
          if (valid) {
						if(this.projectId){ // 编辑

						}else{ // 新增
							this.$api.projectAdd({
								apply_number:this.$cookies.get('job_number') + '_' +  new Date().getTime() + '_' + randnum,
								p_cate_id:this.projectForm.p_cate_id,
								p_name:this.projectForm.p_name,
								budget_amount:this.projectForm.budget_amount,
								p_biref:this.projectForm.p_biref,
								construction_b_o:this.projectForm.construction_b_o,
								content:this.projectForm.content,
								research_situation:this.projectForm.research_situation,
								agree_number:this.projectForm.agree_number,
								agreefile:this.projectForm.agreefile.join(","),
								recordtime:this.projectForm.recordtime,
								starttime:this.projectForm.starttime,
								company_id:this.projectForm.company_id,
							}).then(data =>{
								if(data.code == 0){
									console.log(data,'5555');
									// 回调成功的方法
									_this.handleClose();
									_this.resetForm(formName);
									
								}else{
									this.$message.error(data.msg);
								}
							});
						}
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 表单重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

			/****  上传  ****/
			// type=2 文档上传
			myUpload(params){
	      // 通过 FormData 对象上传文件
	      const formData = new FormData();
	      formData.append("type", this.projectForm.apply_number);
	      formData.append("file", params.file);
	      formData.append("user_token", this.VueCookies.get("token"));

				this.$api.uploadAgree(formData).then(data =>{
					if(data.code == 0){

						console.log(data.data,'dddd');
						// 回调成功的方法
						params.onSuccess(data);
						this.$message.success(data.msg);
						this.projectForm.agreefile.push(data.data.path);
					}else{
						this.$message.error(data.msg);
					}
				});
			},
      // 上传成功
			handleSuccess(res, file, fileList) {
				this.projectForm.agreefile = fileList;
      },
      // 移除上传文件
      handleRemove(file,fileList) {
      	var path;
      	if(file.isExist){ // 原先上传已存在的
      		path = file.path;
      	}else{ // 刚刚上传的
      		path = file.response.data.path;
      	}
      	this.$api.kl_contentUploadDel({
      		path:path,
      	}).then(data =>{
					if(data.code == 0){
						// this.$refs.upload.abort(); //取消上传
						this.fileList = fileList;
						this.contentForm.fileContent.some((item, i)=>{
							if(item = path){
								this.contentForm.fileContent.splice(i, 1);
								//在数组的some方法中，如果return true，就会立即终止这个数组的后续循环
								return true
							}
						});

						this.$message({message: '成功移除' + file.name, type: 'success'});
					}else{
						this.$message.error(data.msg);
					}
				});
      },

      // 上传前验证
      beforeUpload(file) {
      	// 验证大小等
      	
      },
		}
	}
</script>

<style>

</style>