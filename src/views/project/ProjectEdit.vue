<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<h6 class="fs_20 font-weight-normal mb-3">{{title}}</h6>
			<el-form :model="projectForm" :rules="rules" ref="projectForm" label-width="110px" label-position="top" class="pl-3 pr-3">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="项目类别" prop="p_cate_id">
							<el-select v-model="projectForm.p_cate_id" placeholder="请选择项目类别" class="w-100" @change="cateChange">
								<el-option
									v-for="item in cateOptions"
									:key="item.id"
									:label="item.name"
									:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="申请年份" prop="projecttime">
							<el-date-picker
                placeholder="请选择申请年份"
                v-model="projectForm.projecttime"
                type="year"
                class="w-100"
                value-format="yyyy"
								format="yyyy"
								@change="yearChange">
              </el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="项目名称" prop="p_name">
							<el-input v-model="projectForm.p_name" placeholder="请输入项目名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="is_need_company == 2">
						<el-form-item label="所属公司">
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
					<el-col :span="12" v-if="is_open_money == 2">
						<el-form-item prop="budget_amount">
							<template slot="label">
								<span v-if="can_used_funds == 0">
									预算金额 <span class="text-danger">(本年度可用预算金额不足，请联系管理员)</span>
								</span>
								<span v-else>
									预算金额 <span class="text-danger">(年度可用预算 {{can_used_funds}} 元)</span>
								</span>
							</template>
							<el-input v-model.number="projectForm.budget_amount" placeholder="请输入预算金额">
								<span slot="suffix" class="el-input__icon mr-2">元</span>
							</el-input>
						</el-form-item>
					</el-col>
					<template v-for="(formItem,j) in projectForm.secondFrom">
						<!-- 字段类型:1=文本框,2=数字框,3=下拉单选,4=日期选择,5=文件上传(单选),6=文本域,7=富文本,
						8=时间选择,9=下拉多选,10=复选,11=单选,12=数组,13=图片上传(单选),14=图片上传(多选),15=文件上传(多选) -->
						<!-- 1=文本框 -->
						<el-col :span="12" :key="j" v-if="formItem.name_type == 1">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<el-input v-model="formItem.value" :placeholder="formItem.placeholder"></el-input>
							</el-form-item>
						</el-col>
						<!-- 2=数字框 -->
						<el-col :span="12" :key="j" v-else-if="formItem.name_type == 2">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false" 
							:rules="[{ type: 'number', message: formItem.title +'必须为数字值'}]">
								<el-input v-model.number="formItem.value" :placeholder="formItem.placeholder">
									<span slot="suffix" class="el-input__icon mr-2">元</span>
								</el-input>
							</el-form-item>
						</el-col>
						<!-- 3=下拉单选 -->
						<el-col :span="12" :key="j" v-else-if="formItem.name_type == 3">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<el-select v-model="formItem.value" :placeholder="formItem.placeholder" class="w-100">
									<el-option
										v-for="item in formItem.extra_val"
										:key="item"
										:label="item"
										:value="item">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<!-- 4=日期选择 -->
						<el-col :span="12" :key="j" v-else-if="formItem.name_type == 4">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<el-date-picker 
								type="date" 
								:placeholder="formItem.placeholder"
								v-model="formItem.value" 
								value-format="yyyy-MM-dd"
								style="width: 100%;"></el-date-picker>
							</el-form-item>
						</el-col>
						<!-- 5=文件上传(单选) -->
						<el-col :span="24" :key="j" v-else-if="formItem.name_type == 5">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<div class="d-flex align-items-start justify-content-between">
									<el-upload
										class="my_upload"
										drag
										:limit="1"
										action="void"
										:accept="accept_file"
										:auto-upload="true"
										:http-request="myUpload"
										:file-list="formItem.value"
										:on-success="(res, file, fileList)=>handleSuccess(res, file, fileList,formItem)"
										:on-remove="(file, fileList)=>handleRemove(file, fileList,formItem)"
										:before-upload="(file)=>beforeUpload(file,formItem)"
										:on-exceed="onExceed">
										<div class="el-upload__text"><i class="el-icon-upload"></i>将文档拖到此处，或<em>点击选择文档</em></div>
									</el-upload>
								</div>
							</el-form-item>
						</el-col>
						<!-- 6=文本域 -->
						<el-col :span="24" :key="j" v-else-if="formItem.name_type == 6">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<el-input type="textarea" v-model="formItem.value" :placeholder="formItem.placeholder"  :rows="3"></el-input>
							</el-form-item>
						</el-col>
						<!-- 7=富文本 -->
						<el-col :span="24" :key="j" v-else-if="formItem.name_type == 7">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<vEditor v-model="formItem.value" class="pro_vEditor"></vEditor>
							</el-form-item>
						</el-col>
						<!-- 8=时间选择 -->
						<el-col :span="12" :key="j" v-else-if="formItem.name_type == 8">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<el-date-picker 
								type="datetime" 
								:placeholder="formItem.placeholder"
								v-model="formItem.value" 
								value-format="yyyy-MM-dd HH:mm:ss"
								style="width: 100%;"></el-date-picker>
							</el-form-item>
						</el-col>
						<!-- 9=下拉多选 -->
						<el-col :span="12" :key="j" v-else-if="formItem.name_type == 9">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<el-select v-model="formItem.value" multiple collapse-tags :placeholder="formItem.placeholder" class="w-100">
									<el-option
										v-for="item in formItem.extra_val"
										:key="item"
										:label="item"
										:value="item">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<!-- 10=复选 -->
						<el-col :span="12" :key="j" v-else-if="formItem.name_type == 10">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<el-checkbox-group v-model="formItem.value">
									<template v-for="(checkbox,z) in formItem.extra_val">
										<el-checkbox :label="checkbox" :name="formItem.name" :key="z"></el-checkbox>
									</template>
								</el-checkbox-group>
							</el-form-item>
						</el-col>
						<!-- 11=单选 -->
						<el-col :span="12" :key="j" v-else-if="formItem.name_type == 11">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<el-radio-group v-model="formItem.value">
									<template v-for="(radio,z) in formItem.extra_val">
										<el-radio :label="radio" :key="z"></el-radio>
									</template>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<!-- 12=数组 -->
						<el-col :span="24" :key="j" v-else-if="formItem.name_type == 12">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false" class="payment_item">
								<div slot="label" class="d-flex justify-content-between">
									<span>{{formItem.title}}</span>
									<span class="text-primary cursor-pointer" @click="addPro(formItem.value,formItem.extra_val)"><i class="el-icon-plus mr-1"></i>添加</span>
								</div>
								<template v-for="(cell,INDEX) in formItem.value">
									<el-row type="flex" align="middle" :gutter="20" class="cell_row mb-3" :key="INDEX">
										<el-col :span="24" :key="x" v-for="(formCol,x) in formItem.extra_val">
											<el-input v-model="cell[x]" :placeholder="'请输入'+ formCol.title"></el-input>
										</el-col>
										<el-col :span="3" class="text-right">
											<span class="text-danger cursor-pointer" @click="delField(formItem.value,INDEX)">删除</span>
										</el-col>
									</el-row>
								</template>
							</el-form-item>
						</el-col>
						<!-- 13=图片上传(单选) -->
						<el-col :span="24" :key="j" v-else-if="formItem.name_type == 13">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<el-upload
									action="void"
									:accept="accept_img"
									:limit="1"
									list-type="picture-card"
									:auto-upload="true"
									:http-request="myUpload"
									:file-list="formItem.value"
									:on-success="(res, file, fileList)=>handleSuccess(res, file, fileList,formItem)"
									:on-remove="(file, fileList)=>handleRemove(file, fileList,formItem)"
									:before-upload="(file)=>beforeUpload(file,formItem)"
									:on-exceed="onExceed">
									<i class="el-icon-plus"></i>
								</el-upload>
							</el-form-item>
						</el-col>
						<!-- 14=图片上传(多选) -->
						<el-col :span="24" :key="j" v-else-if="formItem.name_type == 14">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<el-upload
									action="void"
									:accept="accept_img"
									list-type="picture-card"
									:auto-upload="true"
									:http-request="myUpload"
									:file-list="formItem.value"
									:on-success="(res, file, fileList)=>handleSuccess(res, file, fileList,formItem)"
									:on-remove="(file, fileList)=>handleRemove(file, fileList,formItem)"
									:before-upload="(file)=>beforeUpload(file,formItem)">
									<i class="el-icon-plus"></i>
								</el-upload>
							</el-form-item>
						</el-col>
						<!-- 15=文件上传(多选) -->
						<el-col :span="24" :key="j" v-else-if="formItem.name_type == 15">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<div class="d-flex align-items-start justify-content-between">
									<el-upload
										class="my_upload"
										drag
										action="void"
										:accept="accept_file"
										:auto-upload="true"
										:http-request="myUpload"
										:file-list="formItem.value"
										:on-success="(res, file, fileList)=>handleSuccess(res, file, fileList,formItem)"
										:on-remove="(file, fileList)=>handleRemove(file, fileList,formItem)"
										:before-upload="(file)=>beforeUpload(file,formItem)">
										<div class="el-upload__text"><i class="el-icon-upload"></i>将文档拖到此处，或<em>点击选择文档</em></div>
									</el-upload>
								</div>
							</el-form-item>
						</el-col>

					</template>

				</el-row>
				<div class="d-flex justify-content-end">
					<el-button type="primary" @click="submitForm('projectForm')">确 定</el-button>
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
		props:['editData'],
		name: 'ProjectEdit',
		data () {
			return {
				projectId:'',
				title:"新增项目",
				accept_file: ".pdf,.doc,.docx,.xls,.xlsx,.zip",
				accept_img:".jpg,.png,.JPEG",
				cateOptions:[],
				companyOptions:[],
				projectForm: {
					apply_number:"",
					p_cate_id:"",
          p_name: "",
					projecttime:this.$moment(new Date()).format('YYYY'),
					company_id: "",
					budget_amount:"",
					secondFrom:{
					},
        },
				is_need_company:"1", // 是否开启企业选择
				is_open_money:"1", // 是否开启金额申请
				can_used_funds:'',
				removeFilesArr:[],
        rules: {
					p_cate_id: [
            { required: true, message: '请选择项目类别', trigger: 'change' }
          ],
					p_name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' }
          ],
					projecttime: [
            { required: true, message: '请选择申请年份', trigger: 'change' }
          ],
					company_id: [
            { required: true, message: '请选择所属公司', trigger: 'change' }
          ],
					budget_amount: [
          	{ required: true, message: '请输入预算金额', trigger: 'blur' },
          	{ validator:(rule, value, callback) => {
								if (!Number(value)) {
									callback(new Error('预算金额必须是数值'));
								}else{
									callback();
								}
            	},trigger: 'blur'
          	},
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
			// 获取表单
			initProjectForms(id,year){
				this.$api.getProjectForms({
					p_cate_id:id,
					years:year,
				}).then(data =>{
					if(data.code == 0){
						// 回调成功的方法
						this.projectForm.secondFrom = data.data.forms_list;
						this.is_need_company = data.data.is_need_company;
						this.is_open_money = data.data.is_open_money;
						this.can_used_funds = data.data.can_used_funds;
					}else{
						this.$message.error(data.msg);
					}
				});
			},
			// 项目分类change
			cateChange(value){
				this.initProjectForms(value,this.projectForm.projecttime);
			},
			// 年份change
			yearChange(value){
				this.initProjectForms(this.projectForm.p_cate_id,value);
			},
			// 添加审核流程
			addPro(item,length){
				var array = new Array();
				for(var i=0;i<length.length;i++){
					array.push('')
				};
				item.push(array);
			},
			// 删除字段
			delField(item,index){
				item.splice(index, 1);
			},
			blurChange(cell){
				// 清空已选人员
				cell.check_ids = [];
			},
			// dialog初始化
			openEdit(){
				this.projectId = this.$route.query.id;
				var randnum = Math.floor(Math.random()*(9999-1000))+1000; // 四位随机数
				var number = this.$moment(new Date()).format('YYYYMMDDHHss');
				this.initCate();
				this.initCompany();
				if(this.projectId){
					this.title = "编辑项目";
					this.$api.projectEdit({
						id:this.projectId,
						function_type:2,
					}).then(data =>{
						if(data.code == 0){
							this.projectForm.apply_number = data.data.apply_number;
							this.projectForm.p_cate_id = data.data.p_cate_id;
							this.projectForm.p_name = data.data.p_name;
							this.projectForm.projecttime = data.data.projecttime.toString();
							if(data.data.company_id == 0){
								this.projectForm.company_id = '';
							}else{
								this.projectForm.company_id = data.data.company_id;
							}
							var datajson = data.data.datajson;
							datajson.map((item)=>{
								if(item.name_type == 5 || item.name_type == 13 || item.name_type == 14 || item.name_type == 15){
									item.value = [];
									if(!this.commonJs.isEmpty(item.file_arr)){
										item.value = item.file_arr
									}
								}
							});
							this.projectForm.secondFrom = datajson;
						}else{
							this.$message.error(data.msg);
						}
					});
				}else{
					this.title = "新增项目";
					this.projectForm.apply_number = this.$cookies.get('application_job_number') + '_' +  number + '_' + randnum;
				}
			},
			// 关闭编辑
			closedEdit(){
				this.$router.go(-1);//返回上一层
				this.fileList = [];
				this.removeFilesArr = [];
			},
      // form提交
			submitForm(formName) {
				var _this = this;
				var senddata = new Array;
				var isArr = this.commonJs.isEmpty(this.projectForm.secondFrom);
				if(!isArr){
					senddata = this.projectForm.secondFrom.map((item)=>{
						if(item.name_type == 5 || item.name_type == 13 || item.name_type == 14 || item.name_type == 15){
							var nameArray = item.value.map((file)=>{
								if(this.commonJs.isEmpty(file.response)){
									return file.path;
								}else{
									return file.response.data.path;
								}
							});
							return {
								"name":item.name,
								"value":nameArray.join(","),
							}
						}else{
							return {
								"name":item.name,
								"value":item.value,
							}
						}
					});
				};
				this.$refs[formName].validate((valid) => {
          if (valid) {
						if(this.projectId){ // 编辑
							this.$api.projectEdit({
								id:this.projectId,
								function_type:1,
								apply_number:this.projectForm.apply_number,
								p_cate_id:this.projectForm.p_cate_id,
								p_name:this.projectForm.p_name,
								projecttime:this.projectForm.projecttime,
								company_id:this.projectForm.company_id,
								budget_amount:this.projectForm.budget_amount,
								senddata:JSON.stringify(senddata),
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
						}else{ // 新增
							this.$api.projectAdd({
								apply_number:this.projectForm.apply_number,
								p_cate_id:this.projectForm.p_cate_id,
								p_name:this.projectForm.p_name,
								projecttime:this.projectForm.projecttime,
								company_id:this.projectForm.company_id,
								budget_amount:this.projectForm.budget_amount,
								senddata:JSON.stringify(senddata),
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
						}
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
	      formData.append("apply_number", this.projectForm.apply_number);
	      formData.append("file", params.file);
	      formData.append("user_token", this.$cookies.get("application_token"));

				this.$api.uploadAgree(formData).then(data =>{
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
			handleSuccess(res, file, fileList, formItem) {
				formItem.value = fileList;
      },
      // 移除上传文件
      handleRemove(file,fileList,formItem) {
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
				formItem.value = fileList;
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
      beforeUpload(file,formItem) {
				var isUpload = true;
      	// 验证大小等
				formItem.value.map((fff)=>{
					if(fff.name == file.name){
						this.$message.warning("请不要重复上传相同文件！");
						isUpload = false;
						return;
					}
				})
				return isUpload;
      },
			// 文件超出限制
			onExceed(file,fileList){
				this.$message.error("只能上传一个文件哦，可以先删除再重新上传！");
			},
		}
	}
</script>

<style>

</style>