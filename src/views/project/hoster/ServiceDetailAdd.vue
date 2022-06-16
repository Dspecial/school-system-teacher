<template>
	<el-dialog
	  :title="serviceData.title"
	  :visible.sync="serviceData.dialog"
	  width="65%" top="10vh"
	  @open="openEdit"
	  @closed="closedEdit('serviceForm')"
	  :before-close="handleClose">
	  <el-form :model="serviceForm" :rules="rules" ref="serviceForm" label-position="top">
	  	<el-form-item label="问题汇总" class="payment_item">
        <div slot="label" class="d-flex justify-content-between">
          <span>问题汇总</span>
          <span class="text-primary cursor-pointer" @click="addPro(serviceForm.service_list)"><i class="el-icon-plus mr-1"></i>问题</span>
        </div>
        <template v-for="(cell,INDEX) in serviceForm.service_list">
          <el-row type="flex" align="middle" :gutter="20" class="cell_row mb-3" :key="INDEX">
            <el-col :span="5">
              <el-input type="textarea" v-model="cell.module_name" placeholder="请输入模块名称" autosize></el-input>
            </el-col>
            <el-col :span="8">
              <el-input type="textarea" v-model="cell.question_title" placeholder="请输入问题简述" autosize></el-input>
            </el-col>
            <el-col :span="3">
              <el-select v-model="cell.level" clearable placeholder="请选择优先度" class="w-100">
                <el-option label="低" value="1"></el-option>
                <el-option label="中" value="2"></el-option>
                <el-option label="高" value="3"></el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-date-picker
                class="w-100"
                v-model="cell.discovery_date"
                type="date"
                align="right"
                value-format="yyyy-MM-dd"
                placeholder="请选择发现日"
                clearable>
              </el-date-picker>
            </el-col>
            <el-col :span="3">
              <el-input v-model="cell.discovery_name" placeholder="请输入发现人" autosize></el-input>
            </el-col>
            <el-col :span="1" class="text-right">
              <span class="text-danger cursor-pointer" @click="delField(serviceForm.service_list,INDEX)">删除</span>
            </el-col>
          </el-row>
        </template>
      </el-form-item>
      <el-form-item label="校方备注">
        <el-input type="textarea" v-model="serviceForm.school_remark" placeholder="请输入校方备注" :rows="3"></el-input>
      </el-form-item>
      <el-form-item label="工单附件">
        <el-upload
          class="my_upload"
          drag
          action="void"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.jpg,.png,.JPEG"
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
		  <div class="text-center">
		  	<el-button @click="closedEdit('serviceForm')">取 消</el-button>
	    	<el-button type="primary" @click="submitForm('serviceForm')">确 定</el-button>
		  </div>
	  </el-form>
	</el-dialog>
</template>

<script>
	export default {
		name: 'ServiceDetailAdd',
		props: ['serviceData'],
		inject: ['loadData'],
		data () {
			return {
				// 新增
				serviceForm:{
					service_list:[{}],
          school_remark:"",
				},
        filesList:[],
				removeFilesArr:[],
				rules: {
        },
			}
		},
		components: {},
		mounted(){

		},
		methods:{
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
        if(this.commonJs.isEmpty(this.serviceData.worksheetInfo.school_files)){
					this.filesList = [];
				}else{
					this.filesList = this.serviceData.worksheetInfo.school_files;
				}
        this.serviceForm.school_remark = this.serviceData.worksheetInfo.school_remark;
			},
			// dialog关闭
			closedEdit(formName){
				this.handleClose();
				this.resetForm(formName);
			},
			// 右上角x关闭
			handleClose(){
				this.serviceData.dialog = false;
			},

			// form提交
			submitForm(formName) {
				var _this = this;
        var files = new Array();
        files = this.filesList.map((item)=>{
					if(item.isExist){
						return item.path;
					}else{
						return item.response.data.path;
					}
        });
        var service_list = new Array;
				var isArr = this.commonJs.isEmpty(this.serviceForm.service_list[0]);
				if(!isArr){
					service_list = this.serviceForm.service_list
				}

        this.$refs[formName].validate((valid) => {
          if (valid) {
          	this.$api.hoster_serviceDetail_add({
              id:this.$route.query.id,
              service_list:JSON.stringify( service_list ),
							remark:this.serviceForm.school_remark,
							school_files:files.join(","),
              function_type:2,
            }).then(data => {
              if(data.code == 0){
                _this.handleClose();
                _this.resetForm(formName);
                _this.loadData();
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
      // 表单重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.serviceForm.service_list = [{}];
      },

      /****  上传  ****/
			myUpload(params,formItem){
	      // 通过 FormData 对象上传文件
	      const formData = new FormData();
	      formData.append("apply_number", this.serviceData.apply_number);
	      formData.append("type", 'gongdan/' + this.serviceData.worksheetInfo.question_number);
	      formData.append("file", params.file);
	      formData.append("user_token", this.VueCookies.get("application_token"));

				this.$api.uploadFile(formData).then(data =>{
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
		},
	}
</script>

<style>

</style>