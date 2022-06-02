<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<h6 class="fs_18 font-weight-normal mb-3">进度上传<span class="ml-2 text-warning opacity-80 fs_14">Tips: 一经提交无法修改删除</span></h6>
			<el-form :model="processForm" :rules="rules" ref="processForm" label-width="110px" label-position="top" class="pl-3 pr-3">
				<el-form-item label="进度标题" prop="title">
					<el-input v-model="processForm.title" placeholder="请输入进度标题"></el-input>
				</el-form-item>
				<el-form-item label="进度内容" prop="content">
					<el-input type="textarea" v-model="processForm.content" placeholder="请输入进度内容" :rows="3"></el-input>
				</el-form-item>
				<el-form-item label="附件">
					<div class="d-flex align-items-start justify-content-between">
						<el-upload
							class="my_upload"
							drag
							action="void"
							:accept="accept"
							:auto-upload="true"
							:http-request="myUpload"
							:file-list="fileList"
							:on-success="handleSuccess"
							:on-remove="handleRemove"
							:before-upload="beforeUpload">
							<div class="el-upload__text"><i class="el-icon-upload"></i>将文档拖到此处，或<em>点击选择文档</em></div>
						</el-upload>
					</div>
				</el-form-item>
				<div class="d-flex justify-content-end">
					<el-button type="primary" @click="submitForm('processForm')">提 交</el-button>
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
		name: 'ProjectRecheck',
		data () {
			return {
				projectId:'',
				apply_number:"",
				accept: ".pdf,.doc,.docx,.xls,.xlsx,.zip",
				fileList:[],
				processForm: {
					title:"",
					content:"",
					files:[],
					process_number:"",
        },
        rules: {
					title: [
            { required: true, message: '请填写进度标题', trigger: 'blur' }
          ],
					content: [
            { required: true, message: '请填写进度内容', trigger: 'blur' }
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
			// dialog初始化
			openEdit(){
				this.projectId = this.$route.query.id;
				var randnum = Math.floor(Math.random()*(9999-1000))+1000; // 四位随机数
				var number = this.$moment(new Date()).format('YYYYMMDDHHss');
				this.processForm.process_number = number + randnum;

				this.$api.my_projectDetail({
					id:this.$route.query.id
				}).then(data => {
					if(data.code == 0){
						this.apply_number = data.data.info.apply_number;
					}
				})
			},
			// 关闭编辑
			closedEdit(){
				this.$router.go(-1);//返回上一层
			},
      // form提交
			submitForm(formName) {
				var _this = this;
				this.$refs[formName].validate((valid) => {
          if (valid) {
						this.$confirm("一经提交无法修改删除, 是否继续?", "提示", {
							type: 'warning'
						}).then(() => {
							this.$api.my_project_process({
								project_id:this.projectId,
								process_number:this.processForm.process_number,
								title:this.processForm.title,
								content:this.processForm.content,
								files:this.processForm.files,
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
						}).catch(() => {

						});
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

			/****  上传  ****/
			myUpload(params){
	      // 通过 FormData 对象上传文件
	      const formData = new FormData();
	      formData.append("apply_number", this.apply_number);
	      formData.append("type", 'jindu/'+ this.processForm.process_number);
	      formData.append("file", params.file);
	      formData.append("user_token", this.VueCookies.get("application_token"));

				this.$api.uploadFile(formData).then(data =>{
					if(data.code == 0){
						// 回调成功的方法
						params.onSuccess(data);
						this.$message({
							message: data.msg,
							type: 'success'
						});
						this.processForm.files.push(data.data.path);
					}else{
						this.$message.error(data.msg);
					}
				}).catch(err => {
					params.onError(err)
				});
			},
      // 上传成功
			handleSuccess(res, file, fileList) {
				this.fileList = fileList;
      },
      // 移除上传文件
      handleRemove(file,fileList) {
      	var path;
      	if(file.isExist){ // 原先上传已存在的
      		path = file.path;
      	}else{ // 刚刚上传的
      		path = file.response.data.path;
      	}
      	this.$api.processUploadDel({
      		path:path,
      	}).then(data =>{
					if(data.code == 0){
						// this.$refs.upload.abort(); //取消上传
						this.fileList = fileList;
						this.processForm.files.some((item, i)=>{
							if(item = path){
								this.processForm.files.splice(i, 1);
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
      	return true;
      },
		}
	}
</script>

<style>

</style>