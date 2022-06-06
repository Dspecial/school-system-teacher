<template>
  <div class="h-100">
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <Breadcrumb></Breadcrumb>
    <div class="mt-3 service-container2">
      <div class="d-flex h-100">
        <div class="left d-flex flex-column mr-3 h-100">
          <el-card class="h-100" style="overflow-y:auto">
            <el-form :model="serviceForm" :rules="rules" ref="serviceForm" label-position="top">
              <el-form-item label="问题汇总">
                <data-tables-server :data="service_list" layout="table" :table-props="tableProps">
                  <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
                  <el-table-column prop="module_name" label="模块名称"></el-table-column>
                  <el-table-column label="问题简述" width="150">
                    <template slot-scope="scope">
                      <el-popover
                        placement="top-start"
                        title="问题简述"
                        width="200"
                        trigger="hover"
                        :content="scope.row.question_title">
                        <span class="text-truncate" slot="reference">{{scope.row.question_title}}</span>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column prop="level" label="优先度">
                    <template slot-scope="scope">
                      <span v-if="scope.row.level == 1">低</span>
                      <span v-else-if="scope.row.level == 2">中</span>
                      <span v-else-if="scope.row.level == 3">高</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="discovery_date" label="发现日" width="100"></el-table-column>
                  <el-table-column prop="discovery_name" label="发现人"></el-table-column>
                  <el-table-column prop="is_resolve" label="是否解决" width="100">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.is_resolve" clearable placeholder="请选择是否解决" class="w-100">
                        <el-option label="否" value="1"></el-option>
                        <el-option label="是" value="2"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column prop="resolve_predict_date" label="预计解决日" width="150">
                    <template slot-scope="scope">
                      <el-date-picker
                        class="w-100"
                        v-model="scope.row.resolve_predict_date"
                        type="date"
                        align="right"
                        value-format="yyyy-MM-dd"
                        placeholder="请输入预计解决日"
                        clearable>
                      </el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column prop="resolve_real_date" label="实际解决日" width="150">
                    <template slot-scope="scope">
                      <el-date-picker
                        class="w-100"
                        v-model="scope.row.resolve_real_date"
                        type="date"
                        align="right"
                        value-format="yyyy-MM-dd"
                        placeholder="请输入实际解决日"
                        clearable>
                      </el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column prop="resolve_name" label="企业解决人" width="150">
                    <template slot-scope="scope">
                      <el-input placeholder="请输入企业解决人" v-model="scope.row.resolve_name" clearable></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="resolve_remark" label="备注" width="150">
                    <template slot-scope="scope">
                      <el-input placeholder="请输入企业解决人" v-model="scope.row.resolve_remark" clearable></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="updatetime" label="更新日期" width="100"></el-table-column>
                </data-tables-server>
              </el-form-item>
              <el-form-item label="企业备注">
                <el-input type="textarea" v-model="serviceForm.remark" placeholder="请输入备注" :rows="3"></el-input>
              </el-form-item>
              <el-form-item label="企业附件">
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
              <div class="text-right pb-3">
                <el-button @click="closedEdit('serviceForm')">取 消</el-button>
                <el-button type="primary" @click="submitForm('serviceForm')">确 定</el-button>
              </div>
            </el-form>
          </el-card>
        </div>
        <el-card class="right bg-white h-100 p-3">
          <h6 class="fs_18 font-weight-normal mb-3">工单信息</h6>
          <div class="mt-3 worksheetInfo">
            <p class="mb-3 text-truncate"><span class="opacity-60 mr-2">工单编号：</span>{{worksheetInfo.question_number}}</p>
            <p class="mb-3 text-truncate"><span class="opacity-60 mr-2">标题：</span>{{worksheetInfo.title}}</p>
						<p class="mb-3 text-truncate"><span class="opacity-60 mr-2">问题描述：</span>{{worksheetInfo.question_content}}</p>
						<p class="mb-3 text-truncate"><span class="opacity-60 mr-2">优先级：</span>{{worksheetInfo.level}}</p>
						<p class="mb-3 text-truncate"><span class="opacity-60 mr-2">工单状态：</span>
              <span v-if="worksheetInfo.status == 1"><i class="dot bg-warning mr-1"></i>待受理</span>
              <span v-else-if="worksheetInfo.status == 2"><i class="dot bg-primary mr-1"></i>已受理</span>
              <span v-else-if="worksheetInfo.status == 3"><i class="dot bg-success mr-1"></i>已完成</span>
            </p>
						<p class="mb-3 text-truncate"><span class="opacity-60 mr-2">提交时间：</span>{{worksheetInfo.createtime}}</p>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
  import GlobalTips from "@/components/GlobalTips";
	import Breadcrumb from "@/components/Breadcrumb";

  export default {
    name:"ServiceDetail",
    components:{
      GlobalTips,
      Breadcrumb,
    },
    provide() {
      return {
        loadData: this.initDetail
      }
    },
    data(){
      return {
        apply_number:"",
        // 问题汇总
        service_list:[],
        tableProps:{
          'max-height':500,
        },
        serviceData:{},
        // 新增
				serviceForm:{
          remark:"",
				},
        filesList:[],
				removeFilesArr:[],
				rules: {
        },
        // 工单信息
        worksheetInfo:{
        },
      }
    },
    created(){

    },
    mounted(){
      this.initDetail();
    },
    computed:{

    },
    updated() {

    },
    methods:{
      // 自增序列
      indexMethod(index) { 
        return ++index;
      },

      // 获取工单详情信息
      initDetail(){
        this.$api.serviceDetail({
          id:this.$route.query.id,
          function_type:1,
        }).then(data=>{
          if(data.code == 0){
            this.service_list = data.data.service_list;
            this.worksheetInfo = data.data.info;
            if(this.commonJs.isEmpty(data.data.info.company_files)){
              this.filesList = [];
            }else{
              this.filesList = data.data.info.company_files;
            }
            this.serviceForm.remark = data.data.info.remark;
          }
        });
        
        this.$api.projectEdit({
          id:this.$route.query.project_id,
          function_type:2,
        }).then(data =>{
          if(data.code == 0){
            this.apply_number = data.data.apply_number;
          }else{
            this.$message.error(data.msg);
          }
        });
      },

      // 添加问题
      handleAdd(){
        this.serviceData.title = "更新";
        this.serviceData.dialog = true;
        this.serviceData.worksheetInfo = this.worksheetInfo;
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

      // 关闭编辑
			closedEdit(){
				this.initDetail();
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
        var newArr = new Array;
				newArr = this.service_list.map((item,index)=>{
          return {
            id:item.id,
            is_resolve:item.is_resolve,
            resolve_predict_date:item.resolve_predict_date,
            resolve_real_date:item.resolve_real_date,
            resolve_name:item.resolve_name,
            resolve_remark:item.resolve_remark,
          }
        });
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm("此操作对应教师会接收消息提醒, 是否继续?", "提示", {
              type: 'warning'
            }).then(() => {
              this.$api.serviceDetail_add({
                id:this.$route.query.id,
                service_list:JSON.stringify( newArr ),
                remark:this.serviceForm.remark,
                company_files:files.join(","),
                function_type:2,
              }).then(data => {
                if(data.code == 0){
                  _this.resetForm(formName);
                  _this.initDetail();
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

      // 表单重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      /****  上传  ****/
			myUpload(params,formItem){
	      // 通过 FormData 对象上传文件
	      const formData = new FormData();
	      formData.append("apply_number", this.apply_number);
	      formData.append("type", 'gongdan/' + this.worksheetInfo.question_number);
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

<style lang="scss" scoped>

</style>