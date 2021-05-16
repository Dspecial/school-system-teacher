<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<h6 class="fs_20 font-weight-normal mb-3">上传验收</h6>
			<el-form ref="acceptForm" :model="acceptForm" label-width="110px" label-position="top" class="pl-3 pr-3" :rules="rules">
				<el-form-item label="项目名称" prop="project_name">
					<el-input v-model="acceptForm.project_name" placeholder="请输入项目名称" readonly></el-input>
				</el-form-item>
				<el-form-item label="验收列表">
					<div v-for="(item,index) in acceptForm.accept_info" :key="index" class="mb-3">
						<p class="m-0 mb-3">{{item.title}}</p>
						<el-upload
							class="my_upload"
							drag
							action="void"
							:accept="accept"
							:auto-upload="true"
							:http-request="myUpload.bind(null, item)"
							:file-list="fileList[index]"
							:on-success="handleSuccess.bind(null, index)"
							:on-remove="handleRemove.bind(null, index)"
							:before-upload="beforeUpload">
							<div class="el-upload__text"><i class="el-icon-upload"></i>将文档拖到此处，或<em>点击选择文档</em></div>
						</el-upload>
					</div>
				</el-form-item>
				<el-row v-if="!commonJs.isEmpty(acceptForm.project_accept_info)" :gutter="20">
					<el-col :span="8">
						<el-form-item label="审核状态" label-position="left">
							<el-input v-model="acceptForm.project_accept_info.status == 1?'待审核':acceptForm.project_accept_info.status == 2?'审核成功':'审核失败'" placeholder="" readonly></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="审核备注" label-position="left">
							<el-input v-model="acceptForm.project_accept_info.remark" placeholder="" readonly></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="审核时间" label-position="left">
							<el-input v-model="acceptForm.project_accept_info.checktime" placeholder="" readonly></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<div class="d-flex justify-content-end">
					<el-button type="primary" @click="submitForm('acceptForm')">确 定</el-button>
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
		name: 'MyprojectAccept',
		data () {
			return {
				projectId:'',
				accept: ".pdf,.doc,.docx,.xls,.xlsx,.zip",
				fileList:[],
				titile:"上传验收",
				acceptForm: {
					project_name:"",
					accept_number:"",
          accept_info:[],
					project_accept_info:'',
        },
        rules: {
					project_name: [
            { required: true, message: '请填写项目名称', trigger: 'change' }
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
				this.$api.my_project_accept({
					project_id:this.projectId,
					function_type:1,
				}).then(data =>{
					if(data.code == 0){
						this.acceptForm.project_name = data.data.project_name;
						this.acceptForm.accept_info = data.data.accept_info;
						this.acceptForm.accept_number = number + randnum;
						this.acceptForm.project_accept_info = data.data.project_accept_info;

						data.data.accept_info.map((info,j)=>{
							let arrList = [];
							for (let i in info.files) {
								var obj = {};
								var a = info.files[i].split("/");
								var b = a[a.length -1];
								obj.name = b;
								obj.url = this.$globalUrl.baseURL + info.files[i];
								obj.path = info.files[i];
								obj.isExist = true;
								arrList.push(obj);
								this.fileList.push(arrList)
							}
						});

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
				var submit_able = true;
				var pro_acc_info = this.acceptForm.project_accept_info;
				if(pro_acc_info.status == 2 || pro_acc_info.status == 3){
					submit_able = false;
				}else{
					submit_able = true;
				}
				var _this = this;
				var sendjson = this.acceptForm.accept_info.map((item)=>{
					return {"accept_id":item.id,"files":item.files.join(",")}
				});
				this.$refs[formName].validate((valid) => {
          if (valid) {
						if(submit_able){
							this.$api.my_project_accept({
								project_id:this.projectId,
								function_type:2,
								accept_number:this.acceptForm.accept_number,
								sendjson:JSON.stringify( sendjson ),
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
						}else{
							this.$message.error("已经提交过，不能再次提交");
						}
						
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
			/****  上传  ****/
			myUpload(item,params){
	      // 通过 FormData 对象上传文件
	      const formData = new FormData();
	      formData.append("accept_number", this.acceptForm.accept_number);
	      formData.append("file", params.file);
	      formData.append("user_token", this.$cookies.get("application_token"));
				this.$api.my_project_acceptUpload(formData).then(data =>{
					if(data.code == 0){
						// 回调成功的方法
						params.onSuccess(data);
						this.$message({
							message: data.msg,
							type: 'success'
						});
						item.files.push(data.data.path);
					}else{
						this.$message.error(data.msg);
					}
				}).catch(err => {
					params.onError(err)
				});
			},
      // 上传成功
			handleSuccess(index, res, file, fileList) {
				this.fileList[index] = fileList;
      },
      // 移除上传文件
      handleRemove(index,file,fileList) {
      	var path;
      	if(file.isExist){ // 原先上传已存在的
      		path = file.path;
      	}else{ // 刚刚上传的
      		path = file.response.data.path;
      	}
      	this.$api.routineUploadDel({
      		path:path,
      	}).then(data =>{
					if(data.code == 0){
						// this.$refs.upload.abort(); //取消上传
						this.fileList[index] = fileList;
						this.acceptForm.accept_info[index].files.some((item, i)=>{
							if(item = path){
								this.acceptForm.accept_info[index].files.splice(i, 1);
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