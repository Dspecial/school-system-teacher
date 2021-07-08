<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<h6 class="fs_18 font-weight-normal mb-3">{{title}}</h6>
			<el-form :model="maintenanceForm" :rules="rules" ref="maintenanceForm" label-width="110px" label-position="top" class="pl-3 pr-3">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="编号" prop="extend_number">
							<el-input v-model="maintenanceForm.extend_number" placeholder="请输入编号" readonly></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="所属企业" prop="company_id">
							<el-select v-model="maintenanceForm.company_id" clearable filterable placeholder="请选择所属企业" class="w-100">
								<el-option
									v-for="item in companyOptions"
									:key="item.id"
									:label="item.job_number"
									:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="申请年份" prop="projecttime">
							<el-date-picker
                placeholder="请选择申请年份"
                v-model="maintenanceForm.projecttime"
                type="year"
                class="w-100"
                value-format="yyyy"
								format="yyyy"
								clearable
								@change="yearChange">
              </el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item prop="money">
							<template slot="label">
								<span v-if="can_used_funds == 0">
									合同金额 <span class="text-danger">(本年度可用预算金额不足，请联系管理员)</span>
								</span>
								<span v-else>
									合同金额 <span class="text-danger">(年度可用预算 {{can_used_funds}} 元)</span>
								</span>
							</template>
							<el-input v-model.number="maintenanceForm.money" placeholder="请输入合同金额">
								<span slot="suffix" class="el-input__icon mr-2">元</span>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="标题" prop="title">
							<el-input v-model="maintenanceForm.title" placeholder="请输入标题"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="联系人" prop="contact_name">
							<el-input v-model="maintenanceForm.contact_name" placeholder="请输入联系人"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="联系电话" prop="contact_phone">
							<el-input v-model="maintenanceForm.contact_phone" placeholder="请输入联系电话"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="合同编号">
							<el-input v-model="maintenanceForm.agree_number" placeholder="请输入合同编号"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="结束时间" prop="endtime">
							<el-date-picker type="date" placeholder="选择结束时间，必须大于当前日期" v-model="maintenanceForm.endtime" 
							value-format="yyyy-MM-dd" :picker-options="startOption" style="width: 100%;" clearable></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="内容" prop="content">
							<el-input type="textarea" v-model="maintenanceForm.content" placeholder="请输入内容" :rows="3"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if="maintenanceForm.money > 0">
						<el-form-item label="合同付款信息" class="payment_item" required>
							<div slot="label" class="d-flex justify-content-between">
								<span>合同付款信息</span>
								<span class="text-primary cursor-pointer" @click="addPayinfo(agree_payinfo)"><i class="el-icon-plus mr-1"></i>付款信息</span>
							</div>
							<template v-for="(cell,INDEX) in agree_payinfo">
								<el-row type="flex" align="middle" :gutter="20" class="cell_row mb-3" :key="INDEX">
									<el-col :span="24">
										<el-input v-model="cell.title" placeholder="请输入标题"></el-input>
									</el-col>
									<el-col :span="24">
										<el-input v-model="cell.money" placeholder="请输入合同金额，必须为数值，单位元">
											<span slot="suffix" class="el-input__icon mr-2">元</span>
										</el-input>
									</el-col>
									<el-col :span="24">
										<el-date-picker clearable type="date" placeholder="选择付款节点，必须大于当前日期" v-model="cell.paytime" value-format="yyyy-MM-dd" :picker-options="startOption" style="width: 100%;"></el-date-picker>
									</el-col>
									<el-col :span="2" class="text-right">
										<span class="text-danger cursor-pointer" @click="delPayinfo(agree_payinfo,INDEX)">删除</span>
									</el-col>
								</el-row>
							</template>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="合同附件">
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
					</el-col>
				</el-row>
				<div class="d-flex justify-content-end">
					<el-button type="primary" @click="submitForm('maintenanceForm')">确 定</el-button>
					<el-button @click="closedEdit">取 消</el-button>
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
		name: 'MaintenanceEdit',
		data () {
			return {
				ID:'',
				project_id:"",
				title:"项目维保",
				companyOptions:[],
				maintenanceForm: {
					extend_number:"",
					company_id:"",
					projecttime:this.$moment(new Date()).format('YYYY'),
					money:"",
					title:"",
					contact_name:"",
					contact_phone:"",
					agree_number:"",
					endtime:"",
					content:"",
					files:[],
        },
				agree_payinfo:[],
				filesList:[],
				removeFilesArr:[],
				can_used_funds:"",
        rules: {
					extend_number: [
            { required: true, message: '请填写编号', trigger: 'blur' }
          ],
					company_id: [
            { required: true, message: '请选择所属企业', trigger: 'change' }
          ],
					projecttime: [
            { required: true, message: '请选择申请年份', trigger: 'change' }
          ],
					money: [
          	{ required: true, message: '请填写合同金额', trigger: 'blur' },
          	{ validator:(rule, value, callback) => {
								if (!Number(value)) {
									callback(new Error('项目金额必须是数值'));
								}else{
									callback();
								}
            	},trigger: 'blur'
          	},
          ],
					title: [
            { required: true, message: '请填写标题', trigger: 'blur' }
          ],
					contact_name: [
            { required: true, message: '请填写联系人', trigger: 'blur' }
          ],
					contact_phone: [
            { required: true, message: '请填写联系电话', trigger: 'blur' }
          ],
					agree_number: [
            { required: true, message: '请填写合同编号', trigger: 'blur' }
          ],
					endtime:[
            { required: true, message: '请选择结束时间', trigger: 'change' }
          ],
					content: [
            { required: true, message: '请填写内容', trigger: 'blur' }
          ],
        },
				startOption:{
					disabledDate: time =>{
						return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
					}
				},
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

			// 添加付款节点
			addPayinfo(item){
				item.push({});
			},
			// 删除付款节点
			delPayinfo(item,index){
				item.splice(index, 1);
			},

			// 根据项目获取信息
			initFunds(years){
				this.$api.project_funds({
					id:this.project_id,
					years:years,
				}).then(data=>{
					if(data.code == 0){
						// 可用预算金额
						this.can_used_funds = data.data.can_used_funds;
					}
				})
			},

			// 年份change
			yearChange(value){
				this.initFunds(value);
			},

			// dialog初始化
			openEdit(){
				this.initCompany();
				this.ID = this.$route.query.id; // 维保id
				this.$api.maintenance_edit({
					id:this.ID,
					function_type:2,
				}).then(data=>{
					this.maintenanceForm = data.data.info;
					this.maintenanceForm.projecttime = data.data.info.projecttime.toString();
					
					// 项目id
					this.project_id = data.data.info.project_id;
					this.initFunds(this.maintenanceForm.projecttime);
					// 合同付款节点
					this.agree_payinfo = data.data.pay_info.map(item=>{
						return {
							title:item.title,
							money:item.money,
							paytime:item.paytime,
						}
					});
					// 合同附件
					this.filesList = data.data.info.file_arr;
				})
			},

			// 关闭编辑
			closedEdit(){
				this.$router.go(-1);//返回上一层
				this.filesList = [];
				this.removeFilesArr = [];
			},

      // form提交
			submitForm(formName) {
				var _this = this;
				var payArr = new Array;
				var isArr2 = this.commonJs.isEmpty(this.agree_payinfo[0]);
				if(!isArr2){
					payArr = this.agree_payinfo
				}
				var files = new Array();
        files = this.filesList.map((item)=>{
					if(item.isExist){
						return item.path;
					}else{
						return item.response.data.path;
					}
        });

				this.$refs[formName].validate((valid) => {
          if (valid) {
						this.$api.maintenance_edit({
							id:this.ID,
							function_type:1,
							extend_number:this.maintenanceForm.extend_number,
							company_id:this.maintenanceForm.company_id,
							projecttime:this.maintenanceForm.projecttime,
							money:this.maintenanceForm.money,
							title:this.maintenanceForm.title,
							contact_name:this.maintenanceForm.contact_name,
							contact_phone:this.maintenanceForm.contact_phone,
							agree_number:this.maintenanceForm.agree_number,
							endtime:this.maintenanceForm.endtime,
							content:this.maintenanceForm.content,
							agree_payinfo:JSON.stringify( payArr ),
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
			myUpload(params){
	      // 通过 FormData 对象上传文件
	      const formData = new FormData();
	      formData.append("extend_number", this.maintenanceForm.extend_number);
	      formData.append("file", params.file);
	      formData.append("user_token", this.$cookies.get("application_token"));

				this.$api.projectMaintenance_Upload(formData).then(data =>{
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
      	if(file.isExist){ // 原先上传已存在的
      		path = file.path;
      	}else{ // 刚刚上传的
      		path = file.response.data.path;
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