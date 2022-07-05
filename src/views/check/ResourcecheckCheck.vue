<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<!-- 项目基本信息 -->
			<h6 class="fs_18 font-weight-normal mb-3">项目基本信息</h6>
			<el-form :model="projectInfo" ref="projectInfo" label-width="110px" label-position="left" class="pl-3 pr-3">
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="项目编号">
							{{projectInfo.apply_number}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="项目名称">
							{{projectInfo.p_name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="申请类别">
							{{projectInfo.category_name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="申请人">
							{{projectInfo.name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="申请人所在部门">
							{{projectInfo.depart_name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="年份">
							{{projectInfo.projecttime}} 年
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="预算金额" v-if="projectInfo.budget_amount != 0">
							{{projectInfo.budget_amount}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="项目金额" v-if="projectInfo.real_amount != 0">
							{{projectInfo.real_amount}}
						</el-form-item>
					</el-col>
					<template v-for="(formItem,j) in dataJson">
						<el-col :span="24" :key="j" v-if="formItem.name_type == 5 || formItem.name_type == 13 || formItem.name_type == 14 || formItem.name_type == 15">
							<el-form-item :label="formItem.title" class="file-form-item">
								<div class="d-flex align-items-center justify-content-between mb-2" v-for="(file,index) in formItem.file_arr" :key="index">
									<div class="cursor-pointer view">
										<i class="el-icon-document mr-2"></i><span>{{file.name}}</span>
									</div>
									<div class="opacity-80 ml-5 pl-5">
										<!-- <i class="el-icon-view cursor-pointer view mr-3" @click="preview(file.path)"></i> -->
										<i class="el-icon-download cursor-pointer view" @click="downloadview(file)"></i>
									</div>
								</div>
							</el-form-item>
						</el-col>
						<el-col :span="24" :key="j" v-else-if="formItem.name_type == 12" >
							<el-form-item :label="formItem.title" label-width="110px"  class="json-form-item">
								<div class="w-100 d-flex align-items-center pb-1 mb-1" v-for="(cell,index) in formItem.value" :key="index">
									<p class="m-0 w-100 pl-2 pr-2" v-for="(item,k) in cell" :key="k">{{item}}</p>
								</div>
							</el-form-item>
						</el-col>
						<el-col :span="8" :key="j" v-else-if="formItem.name_type == 9 || formItem.name_type == 10">
							<el-form-item :label="formItem.title">
								{{formItem.value.join(",")}}
							</el-form-item>
						</el-col>
						<el-col :span="8" :key="j" v-else-if="formItem.name_type == 7">
							<el-form-item :label="formItem.title">
								<span v-html="formItem.value"></span>
							</el-form-item>
						</el-col>
						<el-col :span="8" :key="j" v-else>
							<el-form-item :label="formItem.title">
								{{formItem.value}}
							</el-form-item>
						</el-col>
					</template>
				</el-row>
			</el-form>
		</el-card>

		<!-- 审核信息 -->
		<el-card class="mt-3 bg-white" v-if="check_info.check_state != 1">
			<h6 class="fs_18 font-weight-normal mb-3">审核信息</h6>
			<el-form label-width="110px" label-position="left" class="pl-3 pr-3">
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="审核人">
							{{check_info.checkname}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="审核时间">
							{{check_info.checktime}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="审核备注">
							{{check_info.remark}}
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>

		<!-- 操作记录（审核） -->
		<el-card class="mt-3">
			<div class="d-flex justify-content-between align-items-center">
				<h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">操作记录</h4>
				<div :class="['toggleMenu cursor-pointer text-primary',showMore ? 'menu_arrow' : '']" @click="changeFoldState"  v-if="checkListAll.length > 5">
					<span>{{showMore?'展开':'收起'}}</span><i class="el-icon-arrow-up ml-1"></i>
				</div>
			</div>
			<el-table :data="checkList">		
				<el-table-column prop="pname" label="节点名称"></el-table-column>
				<el-table-column prop="groupname" label="操作部门"></el-table-column>
				<el-table-column prop="load_check_name" label="待操作人"></el-table-column>
				<el-table-column prop="check_state" label="操作状态">
          <template slot-scope="scope">
            <span v-if="scope.row.check_state == 1"><i class="dot bg-primary mr-1"></i>待审核</span>
            <span v-else-if="scope.row.check_state == 2"><i class="dot bg-success mr-1"></i>审核成功</span>
            <span v-else-if="scope.row.check_state == 3"><i class="dot bg-danger mr-1"></i>审核失败</span>
						<span v-else-if="scope.row.check_state == 4"><i class="dot bg-blue mr-1"></i>待提交</span>
						<span v-else-if="scope.row.check_state == 5"><i class="dot bg-cyan mr-1"></i>已提交</span>
          </template>
        </el-table-column>
				<el-table-column prop="checkname" label="操作人"></el-table-column>
				<el-table-column prop="remark" label="操作备注"></el-table-column>
				<el-table-column prop="createtime" label="创建时间"></el-table-column>
				<el-table-column prop="checktime" label="操作时间"></el-table-column>
			</el-table>
		</el-card>
		
		<el-card class="mt-3 bg-white" v-if="check_info.check_state == 1">	
			<!-- 资源审核 -->
			<h6 class="fs_18 font-weight-normal mb-3">资源审核</h6>
			<el-form ref="checkform" :model="checkform"  class="pl-3 pr-3" label-position="top" label-width="110px" :rules="rules">
				<el-form-item label="绑定资源" class="payment_item"  v-if="check_info.node_id == 14">
					<div slot="label" class="d-flex justify-content-between">
						<!-- check_info.node_id == 14 可以绑定资源；check_info.node_id == 13 无 -->
						<span>绑定资源</span>
						<span class="text-primary cursor-pointer" @click="addPro(checkform.bindResources)"><i class="el-icon-plus mr-1"></i>资源</span>
					</div>
					<template v-for="(cell,INDEX) in checkform.bindResources">
						<div class="cell_row" :key="INDEX">
							<hr class="hr_cell mb-3" v-if="INDEX > 0"/>
							<div class="d-flex align-items-end justify-content-between">
								<div style="width:95%">
									<el-row align="middle" :gutter="20">
										<el-col :span="6" class="mb-2">
											<el-input v-model="cell.name" placeholder="请输入资源名称"></el-input>
										</el-col>
										<el-col :span="6" class="mb-2">
											<el-cascader class="w-100" v-model="cell.cate_id" placeholder="请选择资源分类" 
												clearable 
												:options="cateOptions" 
												:props="{value:'id',label:'cate_name',children:'children',checkStrictly: false}"
												@change="cateChange(cell)">
											</el-cascader>
										</el-col>
										<el-col :span="6" class="mb-2">
											<el-select v-model="cell.supplier_id" clearable filterable placeholder="请选择供应商" class="w-100">
												<template v-for="(item,index) in supplierOptions">
													<el-option :label="item.name" :value="item.id" :key="index"></el-option>
												</template>
											</el-select>
										</el-col>
										<el-col :span="6" class="mb-2">
											<el-input v-model.number="cell.number" placeholder="请输入数量"></el-input>
										</el-col>
										<el-col :span="6" class="mb-2">
											<el-radio-group v-model="cell.type">
												<el-radio :label="'1'">永久使用</el-radio>
												<el-radio :label="'2'">临时使用</el-radio>
											</el-radio-group>
										</el-col>
										<el-col :span="6" v-if="cell.type == '2'" class="mb-2">
											<el-date-picker v-model="cell.usetime" type="date" clearable placeholder="选择具体到期时间" value-format="yyyy-MM-dd" class="w-100"></el-date-picker>
										</el-col>
										<el-col :span="cell.type == '2'?12:18" class="mb-2">
											<el-input v-model="cell.remark" placeholder="请输入备注"></el-input>
										</el-col>
										<el-col :span="24" v-if="cell.detailjson.length != 0">
											<div class="resourceAdd_form pt-1 pl-3 pr-3 pb-3">
												<p class="text-primary m-0 mb-1">资源拓展值</p>
												<el-row :gutter="20">
													<div v-for="(field, index) in cell.detailjson" :key="index">
														<!-- 字段类型:1=文本框,2=数字框,3=下拉单选,4=日期选择,5=文件上传,6=文本域 -->
														<el-col :span="6" v-if="field.name_type == 1">
															<el-form-item :label="field.title" :required="field.is_required == 2">
																<el-input v-model="field.val" :placeholder="field.placeholder == ''?'请输入'+field.title:field.placeholder"></el-input>
															</el-form-item>
														</el-col>
														<el-col :span="6" v-if="field.name_type == 2">
															<el-form-item :label="field.title" :required="field.is_required == 2">
																<el-input v-model.number="field.val" :placeholder="field.placeholder == ''?'请输入'+field.title:field.placeholder"></el-input>
															</el-form-item>
														</el-col>

														<el-col :span="6" v-if="field.name_type == 3">
															<el-form-item :label="field.title" :required="field.is_required == 2">
																<el-select v-model="field.val" :placeholder="field.placeholder == ''?'请选择'+field.title:field.placeholder" class="w-100" clearable>
																	<el-option v-for="(option,j) in field.extra_val" :label="option" :value="option" :key="j"></el-option>
																</el-select>
															</el-form-item>
														</el-col>
														<el-col :span="6" v-if="field.name_type == 4">
															<el-form-item :label="field.title" :required="field.is_required == 2">
																<el-date-picker v-model="field.val" type="date" :placeholder="field.placeholder == ''?'请选择'+field.title:field.placeholder" clearable class="w-100"></el-date-picker>
															</el-form-item>
														</el-col>

														<el-col :span="24" v-if="field.name_type == 5">
															<el-form-item :label="field.title" :required="field.is_required == 2">
																<el-upload
																	action="#"
																	drag
																	:auto-upload="false"
																	:on-success="handleAvatarSuccess"
																	:before-upload="beforeAvatarUpload">
																	<i class="el-icon-upload"></i>
																	<div class="el-upload__text">将{{ field.title }}文件拖到此处，或<em>点击上传</em></div>
																</el-upload>
															</el-form-item>
														</el-col>

														<el-col :span="24" v-if="field.name_type == 6">
															<el-form-item :label="field.title" :required="field.is_required == 2">
																<el-input type="textarea" v-model="field.val" :placeholder="field.placeholder == ''?'请输入'+field.title:field.placeholder" :autosize="{ minRows: 3, maxRows: 8 }"></el-input>
															</el-form-item>
														</el-col>
													</div>
												</el-row>
											</div>
										</el-col>
									</el-row>
								</div>
								<div class="text-right" style="width:5%">
									<span class="text-danger cursor-pointer" @click="delField(checkform.bindResources,INDEX)">删除</span>
								</div>
							</div>
						</div>
					</template>
				</el-form-item>
				<el-form-item label="审核状态" prop="check_state">
					<el-radio-group v-model="checkform.check_state">
						<el-radio :label="2">通过</el-radio>
						<el-radio :label="3">驳回</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="承办人" prop="hoster_ids" v-if="need_set_charge == 1 && checkform.check_state == 2">
					<el-select class="w-25" popper-class="params_select" 
						v-model="checkform.hoster_ids" 
						clearable 
						filterable
						multiple
						:filter-method="getUserList"
						placeholder="下拉选择或搜索输入姓名/工号/部门"
						@clear="selectClear">
						<el-option
							v-for="item in uidOptions"
							:key="item.id.toString()"
							:label="item.name"
							:value="item.id.toString()">
							{{item.name + '---' +item.job_number + '---' +item.depart_name}}
						</el-option>
						<el-pagination
							class="text-center"
							small
							@size-change="sizeChange"
							@current-change="currentChange"
							:current-page.sync="currentPage"
							:total="total"
							:page-size.sync="pageSize"
							layout="prev,pager,next,total"
							>
						</el-pagination>
					</el-select>
				</el-form-item>
				<el-form-item label="审核备注">
					<el-input type="textarea" v-model="checkform.remark" placeholder="请输入审核备注" :rows="3"></el-input>
				</el-form-item>
				<div class="d-flex justify-content-end">
					<el-button type="primary" @click="submitForm('checkform')">确 定</el-button>
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
		name: 'ResourcecheckCheck',
		data () {
			return {
				id:'',
				projectInfo: {},
				dataJson:{},
				check_info:{},

				cateOptions:[],
				supplierOptions:[],

				// 操作记录（审核）
				checkList:[],
				checkListAll:[],
				showMore: false,
				// 承办人
				need_set_charge:1,
				uidOptions:[],
				total: 0, //总条数
        currentPage: 1, //当前页
        pageSize: 6, //每页显示条数
				uid_query:"",
				checkform:{
					bindResources:[{
						name:"",
						cate_id:"",
						supplier_id:"",
						number:"",
						type:"2",
						usetime:"",
						remark:"",
						detailjson:[],
					}],
					hoster_ids:[],
					check_state:"",
					remark:"",
				},
				rules:{
					hoster_ids:[
						{ required: true, message: '请选择承办人', trigger: 'change' }
					],
					check_state:[
						{ required: true, message: '请选择审核状态', trigger: 'change' }
					],
				},
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
			// 获取人员列表
			getUserList(query){
				this.uid_query = query;
				this.$api.manager_auth_user({
					page:this.currentPage,
          limit:this.pageSize,
					keywords:query,
					type:1,
        }).then(data=>{
          if(data.code == 0){
						this.total = data.data.total;
            this.uidOptions = data.data.data;
          }else{
            this.$message.error(data.msg);
          }
        });
			},
			// 每页显示的条数改变
			sizeChange() {
				this.currentPage = 1;
				this.getUserList();
			},
			// current-change用于监听页数改变，而内容也发生改变
			currentChange(){
				this.getUserList(this.uid_query);
			},
			selectClear(){
				this.currentPage = 1;
				this.uid_query = "";
				this.getUserList();
			},
			// dialog初始化
			openEdit(){
				this.initCate();
				this.initSupplierOptions();
				this.ID = this.$route.query.id;
				// 人员回显
				this.$api.manager_auth_user({// 展示所有的人员，不分页
        }).then(data=>{
          if(data.code == 0){
						// 先获取所有的数据
            this.uidOptions = data.data;
						// 再分页获取
						this.selectClear();
          }else{
            this.$message.error(data.msg);
          }
        });
				this.$api.resourceCheck_check({
					id:this.ID,
					function_type:1,
				}).then(data =>{
					if(data.code == 0){
						this.projectInfo = data.data.info;
						// 表单值
						this.dataJson = data.data.info.datajson;
						// 审核信息
						this.check_info =  data.data.check_info;

						// 操作记录（审核）
						this.checkListAll = data.data.check_log_list;
						// 默认情况下操作记录（审核）
						if(data.data.check_log_list.length < 5){
							this.checkList = this.checkListAll;
						}else{
							this.checkList = this.checkListAll;
						}
						
						this.need_set_charge = data.data.need_set_charge;

						if(data.data.need_set_charge == 1){
							if(data.data.info.hoster_ids){
								this.checkform.hoster_ids = data.data.info.hoster_ids.split(",");
							}else{
								this.checkform.hoster_ids = [];
							}
						}
					}else{
						this.$message.error(data.msg);
					}
				});
			},
			// 添加绑定资源
			addPro(item){
				item.push({
					name:"",
					cate_id:"",
					supplier_id:"",
					number:"",
					type:"2",
					usetime:"",
					remark:"",
					detailjson:[],
				});
			},
			// 删除字段
			delField(item,index){
				item.splice(index, 1);
			},
			// 获取资源分类
			initCate(){
				this.$api.getResource_cate({
				}).then(data =>{
					if(data.code == 0){
						// 回调成功的方法
						this.cateOptions = data.data;
					}else{
						this.$message.error(data.msg);
					}
				});
			},
			// 资源分类选择
			cateChange(cell){
				cell.detailjson = []; // 清空资源拓展值
				if(cell.cate_id.length > 2){
					var cate_id = cell.cate_id[cell.cate_id.length-1]
					this.initParams(cate_id,cell);
				}
			},
			// 资源分类选择后获取资源拓展值
			initParams(cate_id,cell){
				this.$api.getResource_cateParamsOption({
					cate_id:cate_id,
					function_type:1,
        }).then(data=>{
          if(data.code == 0){
            cell.detailjson = data.data;
						this.$set(this.checkform.bindResources);
          }else{
            this.$message.error(data.msg);
          }
        });
			},
			// 获取供应商
			initSupplierOptions(){
				this.$api.getResource_supplier({
        }).then(data=>{
          if(data.code == 0){
            this.supplierOptions = data.data;
          }else{
            this.$message.error(data.msg);
          }
        });
			},
			// 上传成功
			handleAvatarSuccess(res, file) {
        // this.imageUrl = URL.createObjectURL(file.raw);
      },
      // 上传前验证
      beforeAvatarUpload(file) {
        const isPic = file.type === 'image/gif' || file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
        const isLt = file.size / 1024  < 100;
        if (!isPic) {
          this.$message.error('上传头像图片只能是 GIF、JPG、JPEG、PNG 格式!');
          return isPic
        }
        if (!isLt) {
          this.$message.error('上传Logo图片大小不能超过 100kb!');
          return isLt
        }
        return isPic && isLt;
      },
			// 审核列表展开收起
			changeFoldState() {
				if(this.showMore){ // 展开
					this.checkList = this.checkListAll;
					this.showMore = false;
				}else{
					this.checkList = this.checkListAll.slice(0,5);
					this.showMore = true;
				}
			},
			// 关闭编辑
			closedEdit(){
				// this.$router.go(-1);//返回上一层
				this.$router.push({
          path:"/check/checkList",
        })
			},
      // form提交
			submitForm(formName) {
				var resourcejson = new Array;
				var isArr = this.checkform.bindResources.length > 0;
				if(isArr){
					resourcejson = this.checkform.bindResources.map((item)=>{
						var cate_id = item.cate_id[item.cate_id.length - 1];
						var new_arr = item.detailjson.map(obj => {
          		return {
          			"name":obj.name,
          			"val":obj.val
          		}
          	});
						return {
							name:item.name,
							cate_id:cate_id,
							supplier_id:item.supplier_id,
							number:item.number,
							type:item.type,
							usetime:item.usetime,
							remark:item.remark,
							detailjson:JSON.stringify(new_arr),
						}
					});
				}else{
					resourcejson.push({});
				};
				this.$refs[formName].validate((valid) => {
          if (valid) {
						this.$api.resourceCheck_check({
							id:this.ID,
							function_type:2,
							hoster_ids:this.checkform.hoster_ids.join(","),
							check_state:this.checkform.check_state,
							resourcejson:JSON.stringify( resourcejson ),
							remark:this.checkform.remark,
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
		}
	}
</script>

<style>

</style>