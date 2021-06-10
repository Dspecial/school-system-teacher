<template>
	<el-dialog
	  :title="payData.title"
	  :visible.sync="payData.dialog"
	  width="30%"
	  @open="openEdit"
	  @closed="closedEdit('payForm')"
	  :before-close="handleClose">
	  <el-form :model="payForm" :rules="rules" ref="payForm" label-width="130px">
		  <el-form-item label="付款日期" prop="haspaytime">
				<el-date-picker type="date" placeholder="选择付款日期，必须大于当前日期" v-model="payForm.haspaytime" 
				value-format="yyyy-MM-dd" :picker-options="startOption" style="width: 100%;"></el-date-picker>
			</el-form-item>
			<el-form-item label="付款凭证或附件">
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
			<el-form-item label="简介">
		  	<el-input type="textarea" v-model="payForm.remark" placeholder="请输入备注" :autosize="{ minRows: 3, maxRows: 8 }"></el-input>
		  </el-form-item>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="closedEdit('payForm')">取 消</el-button>
	    <el-button type="primary" @click="submitForm('payForm')">确 定</el-button>
	  </span>
	</el-dialog>
</template>

<script>
	import globalUrl from '@/core/globalUrl.js';
	export default {
		props:['payData'],
		inject: ['loadData'],
		name: 'SetPaynode',
		data () {
			return {
				pidOptions:[],
				payForm:{
					id:"",
					pid:"",
					pid_all:[],
					cate_name:"",
					is_show:"",
					files:[],
				},
				accept: ".jpg,.png,.JGEG,.pdf,.doc,.docx,.xls,.xlsx,.zip",
				fileList:[],
				removeFilesArr:[],
				startOption:{
					disabledDate: time =>{
						return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
					}
				},
				rules: {
          haspaytime: [
            { required: true, message: '请选择付款日', trigger: 'change' }
          ],
        }
			}
		},
		components: {},
		mounted(){

		},
		methods:{
			// dialog初始化
			openEdit(){
				this.apply_number = this.payData.apply_number;
			},
			// dialog关闭
			closedEdit(formName){
				this.handleClose();
				this.resetForm(formName);
			},
			// 右上角x关闭
			handleClose(){
				this.payData.dialog = false;
				this.fileList = [];
				this.removeFilesArr = [];
			},
			// form提交
			submitForm(formName) {
				var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
          	this.$api.setPayNode({
							id:this.payData.id,
							haspaytime:this.payForm.haspaytime,
							remark:this.payForm.remark,
							files:this.payForm.files.join(","),
						}).then(data => {
							if(data.code == 0){
								_this.removeFilesArr.map((path)=>{
									_this.removeFile(path);
								})
								_this.handleClose();
								_this.resetForm(formName);
								_this.loadData();
							}else{
								this.$message.error(data.msg);
							}
						})
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
			myUpload(params){
	      // 通过 FormData 对象上传文件
	      const formData = new FormData();
				formData.append("apply_number", this.apply_number);
	      formData.append("file", params.file);
	      formData.append("user_token", this.$cookies.get("application_token"));

				this.$api.uploadPayNode(formData).then(data =>{
					if(data.code == 0){
						// 回调成功的方法
						params.onSuccess(data);
						this.$message.success(data.msg);
						this.payForm.files.push(data.data.path);
					}else{
						this.$message.error(data.msg);
					}
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
      		if(file.status == 'success'){
						path = file.response.data.path;
					}else{
						return false
					}
      	}
      	this.fileList = fileList;
				this.payForm.files.some((item, i)=>{
					if(item = path){
						this.payForm.files.splice(i, 1);
						//在数组的some方法中，如果return true，就会立即终止这个数组的后续循环
						return true
					}
				});
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
				this.fileList.map((fff)=>{
					if(fff.name == file.name){
						this.$message.warning("请不要重复上传相同文件！");
						isUpload = false;
						return
					}
				})
				return isUpload;
      },
		}
	}
</script>

<style>

</style>