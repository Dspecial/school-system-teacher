<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<h6 class="fs_18 font-weight-normal mb-3">添加记录</h6>
			<el-form :model="recordForm" :rules="rules" ref="recordForm" label-width="110px" label-position="top" class="pl-3 pr-3">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="添加编号" prop="record_number">
							<el-input v-model="recordForm.record_number" placeholder="请输入添加编号" readonly></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="记录标题" prop="title">
							<el-input v-model="recordForm.title" placeholder="请输入记录标题"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="记录内容" prop="desc">
							<el-input type="textarea" v-model="recordForm.desc" placeholder="请输入记录内容" :rows="3"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="记录文件">
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
					</el-col>
				</el-row>
				<div class="d-flex justify-content-end">
					<el-button type="primary" @click="submitForm('recordForm')">确 定</el-button>
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
		name: 'myResourceRecord',
		data () {
			return {
				resourceId:'',
				accept: ".pdf,.doc,.docx,.xls,.xlsx,.zip",
				recordForm: {
					record_number:"",
          title: "",
					desc: "",
					files:[],
        },
				fileList:[],
        rules: {
					record_number: [
            { required: true, message: '请输入记录编号', trigger: 'blur' }
          ],
					title: [
            { required: true, message: '请输入标题', trigger: 'blur' }
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
		watch:{
		},
		methods:{
			// dialog初始化
			openEdit(){
				this.resourceId = this.$route.query.id;
				var nowTime = this.$moment(new Date()).format('YYYYMMDDHHmmss');
				this.recordForm.record_number = "R" + nowTime; // 记录编号
			},
			// 关闭编辑
			closedEdit(){
				this.$router.go(-1);//返回上一层
			},
      // form提交
			submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
						this.$api.my_push_record({
							resource_id:this.resourceId,
							record_number:this.recordForm.record_number,
							title:this.recordForm.title,
							desc:this.recordForm.desc,
							files:this.recordForm.files.length>0?this.recordForm.files.join(","):'',
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

			/****  上传  ****/
			myUpload(params){
	      // 通过 FormData 对象上传文件
	      const formData = new FormData();
	      formData.append("record_number", this.recordForm.record_number);
	      formData.append("file", params.file);
	      formData.append("user_token", this.VueCookies.get("application_token"));
				this.$api.my_project_recordUpload(formData).then(data =>{
					if(data.code == 0){
						// 回调成功的方法
						params.onSuccess(data);
						this.$message({
							message: data.msg,
							type: 'success'
						});
						this.recordForm.files.push(data.data.path);
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
      	this.$api.recordUploadDel({
      		path:path,
      	}).then(data =>{
					if(data.code == 0){
						// this.$refs.upload.abort(); //取消上传
						this.fileList = fileList;
						this.recordForm.files.some((item, i)=>{
							if(item = path){
								this.recordForm.files.splice(i, 1);
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