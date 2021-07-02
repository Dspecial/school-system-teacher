<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<h6 class="fs_20 font-weight-normal mb-3">{{title}}</h6>
			<el-form :model="projectForm" :rules="rules" ref="projectForm" label-width="110px" label-position="top" class="pl-3 pr-3">
				<el-row :gutter="20">
					<el-col :span="12" v-if="!this.projectId">
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
					<el-col :span="12">
						<el-form-item label="项目名称" prop="p_name">
							<el-input v-model="projectForm.p_name" placeholder="请输入项目名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="所属企业" prop="company_id">
							<el-select v-model="projectForm.company_id" filterable placeholder="请选择所属企业" class="w-100">
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
						<el-form-item label="录入时间" prop="recordtime">
							<el-date-picker type="date" placeholder="选择录入时间，必须大于当前日期" v-model="projectForm.recordtime" value-format="yyyy-MM-dd" :picker-options="startOption" style="width: 100%;"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="项目启动时间" prop="starttime">
							<el-date-picker type="date" placeholder="选择项目启动时间，必须大于当前日期" v-model="projectForm.starttime" value-format="yyyy-MM-dd" :picker-options="startOption" style="width: 100%;"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="项目完成时间" prop="successtime">
							<el-date-picker type="date" placeholder="选择项目完成时间，必须大于项目启动时间" v-model="projectForm.successtime" value-format="yyyy-MM-dd" :picker-options="successOption" style="width: 100%;"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="合同金额" prop="budget_amount">
							<el-input v-model.number="projectForm.budget_amount" placeholder="请输入合同金额，必须为数值">
								<span slot="suffix" class="el-input__icon mr-2">元</span>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="合同编号" prop="agree_number">
							<el-input v-model="projectForm.agree_number" placeholder="请输入合同编号"></el-input>
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
									:file-list="fileList"
									:on-success="handleSuccess"
									:on-remove="handleRemove"
									:before-upload="beforeUpload">
									<div class="el-upload__text"><i class="el-icon-upload"></i>将文档拖到此处，或<em>点击选择文档</em></div>
								</el-upload>
							</div>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="项目付款信息" class="payment_item" required>
							<div slot="label" class="d-flex justify-content-between">
								<span>项目付款信息</span>
								<span class="text-primary cursor-pointer" @click="addPro(projectForm.agree_payinfo)"><i class="el-icon-plus mr-1"></i>付款信息</span>
							</div>
							<template v-for="(cell,INDEX) in projectForm.agree_payinfo">
								<el-row type="flex" align="middle" :gutter="20" class="cell_row mb-3" :key="INDEX">
									<el-col :span="24">
										<el-input v-model="cell.title" placeholder="请输入标题"></el-input>
									</el-col>
									<el-col :span="24">
										<el-input v-model.number="cell.money" placeholder="请输入合同金额，必须为数值"></el-input>
									</el-col>
									<el-col :span="24">
										<el-date-picker type="date" placeholder="选择付款节点，必须大于当前日期" v-model="cell.paytime" value-format="yyyy-MM-dd" :picker-options="startOption" style="width: 100%;"></el-date-picker>
									</el-col>
									<el-col :span="2" class="text-right">
										<span class="text-danger cursor-pointer" @click="delField(projectForm.agree_payinfo,INDEX)">删除</span>
									</el-col>
								</el-row>
							</template>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="项目介绍">
							<el-input type="textarea" v-model="projectForm.p_biref" placeholder="请输入项目介绍" :rows="3"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="建设背景与目标" prop="construction_b_o">
							<vEditor v-model="projectForm.construction_b_o" class="pro_vEditor"></vEditor>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="主要内容">
							<vEditor v-model="projectForm.content" class="pro_vEditor"></vEditor>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="调研情况">
							<vEditor v-model="projectForm.research_situation" class="pro_vEditor"></vEditor>
						</el-form-item>
					</el-col>
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
				accept: ".pdf,.doc,.docx,.xls,.xlsx,.zip",
				fileList:[],
				cateOptions:[],
				companyOptions:[],
				startOption:{
					disabledDate: time =>{
						return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
					}
				},
				successOption: {
					disabledDate: time =>{
						let start = this.projectForm.starttime;
            if(start){
              return time.getTime() < new Date(start).getTime();
            }
					}
				},
				projectForm: {
					apply_number:"",
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
					successtime:"",
					agree_payinfo:[{}],
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
          	{ validator:(rule, value, callback) => {
								if (!Number(value)) {
									callback(new Error('合同金额必须是数值'));
								}else{
									callback();
								}
            	},trigger: 'blur'
          	},
          ],
					construction_b_o: [
            { required: true, message: '请输入建设背景与目标', trigger: 'blur' }
          ],
					recordtime: [
            { required: true, message: '请选择录入时间', trigger: 'change' }
          ],
					starttime: [
            { required: true, message: '请输入项目启动时间', trigger: 'change' }
          ],
					successtime: [
            { required: true, message: '请输入项目完成时间', trigger: 'change' }
          ],
					agreefile: [
            { required: true, message: '请上传合同文件', trigger: 'change' }
          ],
					agree_payinfo:[
            { required: true, message: '请填写项目付款信息', trigger: 'blur' }
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
			// 添加审核流程
			addPro(item){
				item.push({});
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
							this.projectForm = data.data;
							let arrList = [];
							for (let i in data.data.agreefile) {
								var obj = {};
								var a = data.data.agreefile[i].split("/");
								var b = a[a.length -1];
								obj.name = b;
								obj.url = this.$globalUrl.baseURL + data.data.agreefile[i];
								obj.path = data.data.agreefile[i];
								obj.isExist = true;
								arrList.push(obj);
							}
							this.fileList = arrList;
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
			},
      // form提交
			submitForm(formName) {
				var _this = this;
				var payArr = new Array;
				var isArr = this.commonJs.isEmpty(this.projectForm.agree_payinfo[0]);
				if(!isArr){
					payArr = this.projectForm.agree_payinfo
				}
				this.$refs[formName].validate((valid) => {
          if (valid) {
						if(this.projectId){ // 编辑
							this.$api.projectEdit({
								id:this.projectId,
								function_type:1,
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
								successtime:this.projectForm.successtime,
								company_id:this.projectForm.company_id,
								agree_payinfo:JSON.stringify( payArr ),
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
						}else{ // 新增
							this.$api.projectAdd({
								apply_number:this.projectForm.apply_number,
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
								successtime:this.projectForm.successtime,
								company_id:this.projectForm.company_id,
								agree_payinfo:JSON.stringify( payArr ),
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
						}
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
	      formData.append("apply_number", this.projectForm.apply_number);
	      formData.append("file", params.file);
	      formData.append("user_token", this.$cookies.get("application_token"));

				this.$api.uploadAgree(formData).then(data =>{
					if(data.code == 0){
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
      	this.$api.uploadDel({
      		path:path,
      	}).then(data =>{
					if(data.code == 0){
						this.fileList = fileList;
						this.projectForm.agreefile.some((item, i)=>{
							if(item = path){
								this.projectForm.agreefile.splice(i, 1);
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