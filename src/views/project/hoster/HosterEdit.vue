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
						<el-form-item label="项目名称" prop="p_name">
							<el-input v-model="projectForm.p_name" placeholder="请输入项目名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="项目类别" prop="p_cate_id">
							<el-select v-model="projectForm.p_cate_id" clearable filterable placeholder="请选择项目类别" class="w-100" @change="cateChange">
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
								@change="yearChange"
								clearable>
              </el-date-picker>
						</el-form-item>
					</el-col>

					<!-- 新建完成项目is_commit == 0, 项目金额 -->
					<el-col :span="12" v-if="is_open_money == 2 && projectForm.is_commit != 1">
						<el-form-item prop="real_amount">
							<template slot="label">
								<span v-if="can_used_funds == 0">
									项目金额 
									<!-- <span class="text-danger">(本年度可用项目金额不足，请联系管理员)</span> -->
								</span>
								<span v-else>
									项目金额 
									<!-- <span class="text-danger">(年度可用预算 {{can_used_funds}} 元)</span> -->
								</span>
							</template>
							<el-input v-model.number="projectForm.real_amount" placeholder="请输入项目金额">
								<span slot="suffix" class="el-input__icon mr-2">元</span>
							</el-input>
						</el-form-item>
					</el-col>

					<!-- 新建完成项目is_commit == 1, 预算金额 -->
					<el-col :span="12" v-if="is_open_money == 2 && projectForm.is_commit == 1">
						<el-form-item prop="budget_amount">
							<template slot="label">
								<span v-if="can_used_funds == 0">
									预算金额 
									<!-- <span class="text-danger">(本年度可用项目金额不足，请联系管理员)</span> -->
								</span>
								<span v-else>
									预算金额 
									<!-- <span class="text-danger">(年度可用预算 {{can_used_funds}} 元)</span> -->
								</span>
							</template>
							<el-input v-model.number="projectForm.budget_amount" placeholder="请输入预算金额">
								<span slot="suffix" class="el-input__icon mr-2">元</span>
							</el-input>
						</el-form-item>
					</el-col>

					<el-col :span="12" v-if="is_need_company == 2">
						<el-form-item label="所属企业">
							<el-select v-model="projectForm.company_id" clearable placeholder="请选择所属企业" class="w-100">
								<el-option
									v-for="item in companyOptions"
									:key="item.id"
									:label="item.job_number"
									:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="24" v-if="projectForm.is_commit != 1 && is_open_money == 2">
						<el-form-item label="项目付款信息" class="payment_item">
							<div slot="label" class="d-flex justify-content-between">
								<span>项目付款信息</span>
								<span class="text-primary cursor-pointer" @click="addPay(projectForm.agree_payinfo)"><i class="el-icon-plus mr-1"></i>付款信息</span>
							</div>
							<template v-for="(cell,INDEX) in projectForm.agree_payinfo">
								<div :key="INDEX" class="mb-3 agree_pay_more_cell">
									<el-row type="flex" align="middle" :gutter="20" class="cell_row mb-3">
										<el-col :span="24">
											<el-input v-model="cell.title" placeholder="请输入标题"></el-input>
										</el-col>
										<el-col :span="24">
											<el-input v-model.number="cell.money" placeholder="请输入金额，必须为数值">
												<span slot="suffix" class="el-input__icon mr-2">元</span>
											</el-input>
										</el-col>
										<el-col :span="24">
											<el-date-picker type="date" placeholder="选择付款节点" clearable v-model="cell.paytime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
										</el-col>
									</el-row>
									<el-row type="flex" align="middle" :gutter="20" class="cell_row mb-3">
										<el-col :span="24">
											<el-date-picker type="date" placeholder="选择付款日期" clearable v-model="cell.haspaytime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
										</el-col>
										<el-col :span="24">
											<el-select v-model="cell.is_pay" clearable placeholder="请选择是否支付" class="w-100">
												<el-option label="待支付" value="1"></el-option>
												<el-option label="已支付" value="2"></el-option>
											</el-select>
										</el-col>
										<el-col :span="24">
											<el-input type="textarea" v-model="cell.remark" placeholder="请输入备注" :autosize="{ minRows: 1, maxRows: 1 }"></el-input>
										</el-col>
									</el-row>
									<el-row type="flex" align="top" :gutter="20" class="cell_row">
										<el-col :span="24">
											<div class="d-flex align-items-start justify-content-between">
												<el-upload
													class="my_upload"
													drag
													action="void"
													:accept="accept"
													:auto-upload="true"
													:http-request="myUpload_pay"
													:file-list="cell.files"
													:on-success="(res, file, fileList)=>handleSuccess_pay(res, file, fileList,cell)"
													:on-remove="(file, fileList)=>handleRemove_pay(file, fileList,cell)"
													:before-upload="(file)=>beforeUpload_pay(file,cell)">
													<div class="el-upload__text"><i class="el-icon-upload"></i>将付款凭证或附件拖到此处，或<em>点击选择付款凭证或附件</em></div>
												</el-upload>
											</div>
										</el-col>
										<el-col :span="2" class="text-right">
											<span class="text-danger cursor-pointer" @click="delpayField(projectForm.agree_payinfo,INDEX)">删除</span>
										</el-col>
									</el-row>
								</div>
							</template>
						</el-form-item>
					</el-col>

					<div v-for="(formItem,j) in projectForm.secondFrom" :key="j" >
						<!-- 字段类型:1=文本框,2=数字框,3=下拉单选,4=日期选择,5=文件上传(单选),6=文本域,7=富文本,
						8=时间选择,9=下拉多选,10=复选,11=单选,12=数组,13=图片上传(单选),14=图片上传(多选),15=文件上传(多选) -->
						<!-- 1=文本框 -->
						<el-col :span="12" v-if="formItem.name_type == 1">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-input v-model="formItem.value" :placeholder="formItem.placeholder"></el-input>
							</el-form-item>
						</el-col>
						<!-- 2=数字框 -->
						<el-col :span="12" v-else-if="formItem.name_type == 2">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false" 
							:rules="[{ type: 'number', message: formItem.title +'必须为数字值'}]">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-input v-model.number="formItem.value" :placeholder="formItem.placeholder">
									<span slot="suffix" class="el-input__icon mr-2">元</span>
								</el-input>
							</el-form-item>
						</el-col>
						<!-- 3=下拉单选 -->
						<el-col :span="12" v-else-if="formItem.name_type == 3">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-select v-model="formItem.value" clearable :placeholder="formItem.placeholder" class="w-100">
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
						<el-col :span="12" v-else-if="formItem.name_type == 4">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-date-picker 
								type="date" 
								:placeholder="formItem.placeholder"
								v-model="formItem.value" 
								value-format="yyyy-MM-dd"
								style="width: 100%;"
								clearable></el-date-picker>
							</el-form-item>
						</el-col>
						<!-- 5=文件上传(单选) -->
						<el-col :span="24" v-else-if="formItem.name_type == 5">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
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
						<el-col :span="24" v-else-if="formItem.name_type == 6">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-input type="textarea" v-model="formItem.value" :placeholder="formItem.placeholder"  :rows="3"></el-input>
							</el-form-item>
						</el-col>
						<!-- 7=富文本 -->
						<el-col :span="24" v-else-if="formItem.name_type == 7">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<vEditor v-model="formItem.value" class="pro_vEditor"></vEditor>
							</el-form-item>
						</el-col>
						<!-- 8=时间选择 -->
						<el-col :span="12" v-else-if="formItem.name_type == 8">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-date-picker 
								type="datetime" 
								:placeholder="formItem.placeholder"
								v-model="formItem.value" 
								value-format="yyyy-MM-dd HH:mm:ss"
								style="width: 100%;"
								clearable></el-date-picker>
							</el-form-item>
						</el-col>
						<!-- 9=下拉多选 -->
						<el-col :span="12" v-else-if="formItem.name_type == 9">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-select v-model="formItem.value" multiple  clearable :placeholder="formItem.placeholder" class="w-100">
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
						<el-col :span="12" v-else-if="formItem.name_type == 10">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-checkbox-group v-model="formItem.value">
									<template v-for="(checkbox,z) in formItem.extra_val">
										<el-checkbox :label="checkbox" :name="formItem.name" :key="z"></el-checkbox>
									</template>
								</el-checkbox-group>
							</el-form-item>
						</el-col>
						<!-- 11=单选 -->
						<el-col :span="12" v-else-if="formItem.name_type == 11">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-radio-group v-model="formItem.value">
									<template v-for="(radio,z) in formItem.extra_val">
										<el-radio :label="radio" :key="z"></el-radio>
									</template>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<!-- 12=数组 -->
						<el-col :span="24" v-else-if="formItem.name_type == 12">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false" class="payment_item">
								<div slot="label" class="d-flex justify-content-between">
									<div>
										<span>{{formItem.title}}</span>
										<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
									</div>
									<span class="text-primary cursor-pointer" @click="addPro(formItem.value,formItem.extra_val)"><i class="el-icon-plus mr-1"></i>添加</span>
								</div>
								<template v-for="(cell,INDEX) in formItem.value">
									<el-row type="flex" align="middle" :gutter="20" class="cell_row mb-3" :key="INDEX">
										<el-col :span="23" class="d-flex align-items-center">
											<el-input :key="x" v-for="(formCol,x) in formItem.extra_val" class="mr-3" v-model="cell[x]" :placeholder="'请输入'+ formCol.title"></el-input>
										</el-col>
										<el-col :span="1" class="text-right">
											<span class="text-danger cursor-pointer" @click="delField(formItem.value,INDEX)">删除</span>
										</el-col>
									</el-row>
								</template>
							</el-form-item>
						</el-col>
						<!-- 13=图片上传(单选) -->
						<el-col :span="24" v-else-if="formItem.name_type == 13">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
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
									:on-exceed="onExceed"
									:class="formItem.value.length>0?'limit_upload':''">
									<i class="el-icon-plus"></i>
								</el-upload>
							</el-form-item>
						</el-col>
						<!-- 14=图片上传(多选) -->
						<el-col :span="24" v-else-if="formItem.name_type == 14">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
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
						<el-col :span="24" v-else-if="formItem.name_type == 15">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
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

					</div>
					
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
		name: 'HosterEdit',
		data () {
			return {
				projectId:'',
				title:"新增项目",
				accept:".pdf,.doc,.docx,.xls,.xlsx,.zip,.jpg,.png,.JPEG",
				accept_file: ".pdf,.doc,.docx,.xls,.xlsx,.zip",
				accept_img:".jpg,.png,.JPEG",
				cateOptions:[],
				companyOptions:[],
				projectForm: {
					apply_number:"",
					apply_id:"",
					p_cate_id:"",
          p_name: "",
					is_commit:"",
					projecttime:this.$moment(new Date()).format('YYYY'),
					agree_payinfo:[{
						title: "",
						money: "",
						paytime: "",
						haspaytime: "",
						is_pay: "",
						remark: "",
						files: [],
					}],
					company_id: "",
					real_amount:"",
					budget_amount:"",
					secondFrom:{
					},
        },
				is_need_company:"1", // 是否开启企业选择
				is_open_money:"1", // 是否开启金额申请
				can_used_funds:'',
				removeFilesArr:[],
				startOption:{
					disabledDate: time =>{
						return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
					}
				},
        rules: {
					p_cate_id: [
            { required: true, message: '请选择项目类别', trigger: 'change' }
          ],
					p_name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' }
          ],
					is_commit: [
            { required: true, message: '请选择项目设置状态', trigger: 'change' }
          ],
					projecttime: [
            { required: true, message: '请选择申请年份', trigger: 'change' }
          ],
					company_id: [
            { required: true, message: '请选择合作企业', trigger: 'change' }
          ],
					real_amount: [
          	{ required: true, message: '请输入项目金额', trigger: 'blur' },
          	{ validator:this.commonJs.checkNumber,trigger: 'blur'},
          ],
					budget_amount: [
          	{ required: true, message: '请输入预算金额', trigger: 'blur' },
          	{ validator:this.commonJs.checkNumber,trigger: 'blur'},
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
						var datajson = data.data.forms_list;
						datajson.map((item)=>{
							if(item.name_type == 12){
								if(this.commonJs.isEmpty(item.value)){
									item.value = [{}];
								}
							}
						});
						this.projectForm.secondFrom = datajson;

						this.is_need_company = data.data.is_need_company;
						this.is_open_money = data.data.is_open_money;
						this.can_used_funds = data.data.can_used_funds;
					}else{
						this.$message.error(data.msg);
					}
				});
			},
			// 编辑的时候获取表单
			initProjectForms_edit(id,year){
				this.$api.getProjectForms({
					p_cate_id:id,
					years:year,
					id:this.projectId,
					type:1, // 项目编辑type = 1;后边的维保编辑，type = 2
				}).then(data =>{
					if(data.code == 0){
						// 回调成功的方法
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
				if(this.projectId){ // 编辑
					this.initProjectForms_edit(value,this.projectForm.projecttime);
				}else{ // 新增
					this.initProjectForms(value,this.projectForm.projecttime);
				}
			},
			// 年份change
			yearChange(value){
				if(this.projectId){ // 编辑
					this.initProjectForms_edit(this.projectForm.p_cate_id,value);
				}else{ // 新增
					this.initProjectForms(this.projectForm.p_cate_id,value);
				}
			},
			// 添加项目付款信息
			addPay(item){
				item.push({
					title: "",
					money: "",
					paytime: "",
					haspaytime: "",
					is_pay: "",
					remark: "",
					files: []
				});
			},
			// 删除字段
			delpayField(item,index){
				item.splice(index, 1);
			},

			// 添加
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
				this.initCate();
				this.initCompany();
				if(this.projectId){
					this.title = "编辑项目";
					this.$api.hosterEdit({
						id:this.projectId,
						function_type:1,
					}).then(data =>{
						if(data.code == 0){
							
							this.projectForm.apply_number = data.data.apply_number;

							this.projectForm.p_name = data.data.p_name;
							this.projectForm.p_cate_id = data.data.p_cate_id;
							this.projectForm.projecttime = data.data.projecttime.toString();
							this.projectForm.real_amount = data.data.real_amount;
							this.projectForm.budget_amount = data.data.budget_amount;
							
							this.projectForm.agree_payinfo = data.data.agree_payinfo;
							this.projectForm.company_id = data.data.company_id;
							this.projectForm.is_commit = data.data.is_commit;

							// 获取预算
							this.initProjectForms_edit(this.projectForm.p_cate_id,this.projectForm.projecttime);

							// 展示付款信息
							if(data.data.agree_payinfo.length > 0){
								// this.projectForm.is_commit = 0;
							}
							
							// 展示详细信息
							var datajson = data.data.datajson;
							datajson.map((item)=>{
								if(item.name_type == 5 || item.name_type == 13 || item.name_type == 14 || item.name_type == 15){
									item.value = [];
									if(!this.commonJs.isEmpty(item.file_arr)){
										item.value = item.file_arr
									}
								}
								if(item.name_type == 12){

									// console.log(item,'iiiii');
									return
									// if(){
									// 	item.value = [{}];
									// }
									
								}
							});
							this.projectForm.secondFrom = datajson;
						}else{
							this.$message.error(data.msg);
						}
					});
				}else{
					this.title = "新增项目";
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

				var payArr = new Array;
				var ispayArr = this.commonJs.isEmpty(this.projectForm.agree_payinfo[0]);
				if(!ispayArr){
					payArr = this.projectForm.agree_payinfo.map((item)=>{
						var filesArray = item.files.map((file)=>{
							if(this.commonJs.isEmpty(file.response)){
								return file.path;
							}else{
								return file.response.data.path;
							}
						});
						return {
							title: item.title,
							money: item.money,
							paytime: item.paytime,
							haspaytime: item.haspaytime,
							is_pay: item.is_pay,
							remark: item.remark,
							files:filesArray.join(","),
						}
					})
				}
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
							this.$api.hosterEdit({
								id:this.projectId,
								function_type:2,
								apply_number:this.projectForm.apply_number,
								p_cate_id:this.projectForm.p_cate_id,
								p_name:this.projectForm.p_name,
								projecttime:this.projectForm.projecttime,
								// is_commit:this.projectForm.is_commit,
								agree_payinfo:JSON.stringify( payArr ),
								company_id:this.projectForm.company_id,
								real_amount:this.projectForm.real_amount,
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
							// ..
						}
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

			/****  付款信息上传  ****/
			myUpload_pay(params){
	      // 通过 FormData 对象上传文件
	      const formData = new FormData();
	      formData.append("apply_number", this.projectForm.apply_number);
	      formData.append("file", params.file);
				formData.append("user_token", this.VueCookies.get("application_token"));

				this.$api.uploadPayNode(formData).then(data =>{
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
			handleSuccess_pay(res, file, fileList, cell) {
				cell.files = fileList;
      },
      // 移除上传文件
      handleRemove_pay(file,fileList,cell) {
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
				cell.files = fileList;
				this.$message({message: '成功移除' + file.name, type: 'success'});

				if(this.removeFilesArr.indexOf(path) == -1){
					this.removeFilesArr.push(path);
				}
      },

      // 上传前验证
      beforeUpload_pay(file,cell) {
				var isUpload = true;
      	// 验证大小等
				cell.files.map((fff)=>{
					if(fff.name == file.name){
						this.$message.warning("请不要重复上传相同文件！");
						isUpload = false;
						return;
					}
				})
				return isUpload;
      },

			/****  上传  ****/
			myUpload(params){
	      // 通过 FormData 对象上传文件
	      const formData = new FormData();
	      formData.append("apply_number", this.projectForm.apply_number);
	      formData.append("file", params.file);
				formData.append("user_token", this.VueCookies.get("application_token"));

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