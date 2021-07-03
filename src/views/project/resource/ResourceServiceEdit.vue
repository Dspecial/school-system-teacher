<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<h6 class="fs_18 font-weight-normal mb-3">资源发起工单</h6>
			<el-form :model="serviceForm" :rules="rules" ref="serviceForm" label-width="110px" label-position="top" class="pl-3 pr-3">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="项目" prop="project_id">
							<el-input v-model="serviceForm.projectName" placeholder="请输入项目" readonly></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="工单编号" prop="question_number">
							<el-input v-model="serviceForm.question_number" placeholder="请输入工单编号" readonly></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="工单标题" prop="title">
							<el-input v-model="serviceForm.title" placeholder="请输入工单标题"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="工单级别" prop="level">
							<el-select v-model="serviceForm.level" placeholder="请选择工单级别" class="w-100">
								<el-option
                  v-for="item in levelOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="问题描述" prop="question_content">
							<el-input type="textarea" v-model="serviceForm.question_content" placeholder="请输入问题描述" :rows="3"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="备注">
							<el-input type="textarea" v-model="serviceForm.remark" placeholder="请输入备注" :rows="3"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="工单附件">
							<el-upload
								class="my_upload"
								drag
								action="void"
								accept=".doc,.docx,.jpg,.png,.JPEG"
								:auto-upload="true"
								:http-request="myUpload"
								:show-file-list="true"
								:file-list="filesList"
								:before-upload="beforeUpload"
								:on-success="handleSuccess"
								:on-remove="handleRemove">
								<div class="el-upload__text"><i class="el-icon-upload"></i>将文档拖到此处，或<em>点击选择文档</em></div>
							</el-upload>
						</el-form-item>
					</el-col>
				</el-row>
				<div class="d-flex justify-content-end">
					<el-button type="primary" @click="submitForm('serviceForm')">确 定</el-button>
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
		name: 'ResourceServiceEdit',
		data () {
			return {
				levelOptions:[],
				serviceForm: {
					project_id:"",
					projectName:"",
					question_number:"",
					title:"",
					level:"",
					question_content:"",
					remark:"",
        },
				filesList:[],
				removeFilesArr:[],
        rules: {
					project_id: [
            { required: true, message: '请选择项目', trigger: 'change' }
          ],
					question_number: [
            { required: true, message: '请填写工单编号', trigger: 'blur' }
          ],
					title: [
            { required: true, message: '请填写工单标题', trigger: 'blur' }
          ],
					question_content: [
            { required: true, message: '请填写问题描述', trigger: 'blur' }
          ],
					level:[
            { required: true, message: '请选择工单级别', trigger: 'change' }
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
			// 获取项目
			initPro(){
				this.$api.getPro({
				}).then(data =>{
					if(data.code == 0){
						// 回调成功的方法
						var obj = {};
						obj = data.data.find((item)=>{
							return item.id == this.$route.query.project_id
						});
						this.serviceForm.projectName = obj.p_name;
					}else{
						this.$message.error(data.msg);
					}
				});
			},
			// 获取级别
      initlevelOptions(){
        this.$api.project_service_level({
        }).then(data=>{
          this.levelOptions = data;
        })
      },
			// dialog初始化
			openEdit(){
				this.initPro();
				this.initlevelOptions();
				// 项目id
				this.serviceForm.project_id = this.$route.query.project_id;
				// 资源id
				this.serviceForm.id = this.$route.query.id;
				// 工单编号
				var randnum = Math.floor(Math.random()*(9999-1000))+1000; // 四位随机数
				var number = this.$moment(new Date()).format('YYYYMMDDHHss');
				this.serviceForm.question_number = "S" + '_' +  number + '_' + randnum;
			},
			// 关闭编辑
			closedEdit(){
				this.$router.go(-1);//返回上一层
			},
      // form提交
			submitForm(formName) {
				var files = new Array();
        files = this.filesList.map((item)=>{
          return item.response.data.path;
        })
				this.$refs[formName].validate((valid) => {
          if (valid) {
						this.$api.resource_serviceAdd({
							project_id:this.serviceForm.project_id,
							id:this.serviceForm.id,
							question_number:this.serviceForm.question_number,
							title:this.serviceForm.title,
							level:this.serviceForm.level,
							question_content:this.serviceForm.question_content,
							remark:this.serviceForm.remark,
							files:files.join(","),
						}).then(data =>{
							if(data.code == 0){
								this.removeFilesArr.map((path)=>{
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
			/****  上传  ****/
			myUpload(params,formItem){
	      // 通过 FormData 对象上传文件
	      const formData = new FormData();
	      formData.append("question_number", this.serviceForm.question_number);
	      formData.append("file", params.file);
	      formData.append("user_token", this.$cookies.get("application_token"));

				this.$api.project_serviceUpload(formData).then(data =>{
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
			handleSuccess(res, file, fileList) {
				this.filesList = fileList;
      },
      // 移除上传文件
      handleRemove(file,fileList) {
      	var path;
      	if(file.status == 'success'){
          path = file.response.data.path;
        }else{
          return false
        }
				this.filesList = fileList;
				this.$message({message: '成功移除' + file.name, type: 'success'});

				if(this.removeFilesArr.indexOf(path) == -1){
					this.removeFilesArr.push(path);
				}
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
      
      // 上传前验证
      beforeUpload(file) {
				var isUpload = true;
      	// 验证大小等
				this.filesList.map((fff)=>{
					if(fff.name == file.name){
						this.$message.warning("请不要重复上传相同文件！");
						isUpload = false;
						return;
					}
				})
				return isUpload;
      },
		}
	}
</script>

<style>

</style>