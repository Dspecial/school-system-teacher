<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<!-- 项目信息 -->
			<el-form :model="projectInfo" ref="projectInfo" label-width="110px" label-position="left" class="pl-3 pr-3">
				<h6 class="fs_20 font-weight-normal mb-3">项目信息</h6>
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="项目名称">
							{{projectInfo.p_name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="项目类别">
							{{projectInfo.category_name}}
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
					<el-col :span="8">
						<el-form-item label="审核状态">
							<span class="text-warning" v-if="check_info.check_state == 1">待审核</span>
							<span class="text-success" v-else-if="check_info.check_state == 2">审核成功</span>
							<span class="text-danger" v-else-if="check_info.check_state == 3">审核失败</span>
						</el-form-item>
					</el-col>

					<template v-for="(formItem,j) in dataJson">
						<el-col :span="24" :key="j" v-if="formItem.name_type == 5 || formItem.name_type == 13 || formItem.name_type == 14 || formItem.name_type == 15">
							<el-form-item :label="formItem.title" class="file-form-item">
								<div class="d-flex align-items-center justify-content-between mb-2" v-for="(file,index) in formItem.file_arr" :key="index">
									<div class="cursor-pointer view" @click="preview(file.path)" title="在线预览">
										<i class="el-icon-document mr-2"></i><span>{{file.name}}</span>
									</div>
									<div class="opacity-80 ml-5 pl-5">
										<i class="el-icon-view cursor-pointer view mr-3" @click="preview(file.path)"></i>
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

			<!-- 审核信息 -->
			<el-form label-width="110px" label-position="left" class="pl-3 pr-3" v-if="check_info.check_state != 1">
				<h6 class="fs_20 font-weight-normal mb-3">审核信息</h6>
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

		<el-card class="mt-3 bg-white" v-if="check_info.check_state == 1">	
			<!-- 资源审核 -->
			<el-form ref="checkform" :model="checkform"  class="pl-3 pr-3" label-position="top" label-width="110px" :rules="rules">
				<h6 class="fs_20 font-weight-normal mb-3">资源审核</h6>
				<el-form-item label="资源选择" class="payment_item"  v-if="need_show_choose_resource == 1">
					<div slot="label" class="d-flex justify-content-between">
						<span>绑定资源</span>
						<span class="text-primary cursor-pointer mr-2" @click="addPro(checkform.bindResources)"><i class="el-icon-plus mr-1"></i>资源</span>
					</div>
					<template v-for="(cell,INDEX) in checkform.bindResources">
						<div class="cell_row mb-3" :key="INDEX">
							<el-row type="flex" align="middle" :gutter="20">
								<el-col :span="24">
									<el-cascader class="w-100" v-model="cell.resource_cate_id" placeholder="请选择资源分类" 
										clearable 
										:options="cateOptions" 
										:props="{value:'id',label:'cate_name',children:'children',checkStrictly: false}"
										@change="cateChange(cell)">
									</el-cascader>
								</el-col>
								<el-col :span="24">
									<el-select v-model="cell.resource_id" placeholder="请选择资源名称" class="w-100" @change="resourceChange(cell)">
										<el-option
											v-for="item in listOptions"
											:key="item.id"
											:label="item.name"
											:value="item.id">
										</el-option>
									</el-select>
								</el-col>
								<el-col :span="24">
									<el-input v-model="cell.remark" placeholder="请输入备注"></el-input>
								</el-col>
								<el-col :span="2" class="text-right">
									<span class="text-danger cursor-pointer" @click="delField(checkform.bindResources,INDEX)">删除</span>
								</el-col>
							</el-row>
							<el-row type="flex" align="middle" :gutter="20" class="mt-2" v-if="cell.detailjson.length != 0">
								<el-col :span="24">
									<el-form-item label="资源详细">
										<el-row :gutter="20" class="re_detail_json">
											<el-col :span="6" v-for="(item,index) in cell.detailjson" :key="index" class="pl-3 pr-3 pt-2 pb-2">
												<p class="mb-2 text-primary">{{item.title}}</p>
												<p class="m-0">{{item.val}}</p>
											</el-col>
										</el-row>
									</el-form-item>
								</el-col>
							</el-row>
						</div>
					</template>
				</el-form-item>

				<el-form-item label="审核状态" prop="check_state">
					<el-radio-group v-model="checkform.check_state">
						<el-radio :label="2">通过</el-radio>
						<el-radio :label="3">驳回</el-radio>
					</el-radio-group>
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

				need_show_choose_resource:"",// 是否出现绑定资源  1 可以绑定 2 无
				cateOptions:[],
				listOptions:[],

				checkform:{
					bindResources:[{
						resource_cate_id:"",
						resource_id:"",
						remark:"",
						detailjson:[],
					}],
					check_state:"",
					remark:"",
				},
				rules:{
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
			// dialog初始化
			openEdit(){
				this.initCate();
				this.ID = this.$route.query.id;
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
						// 是否绑定资源
						this.need_show_choose_resource = data.data.need_show_choose_resource;
					}else{
						this.$message.error(data.msg);
					}
				});
			},
			// 添加绑定资源
			addPro(item){
				item.push({
					resource_cate_id:"",
					resource_id:"",
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
				cell.resource_id = ""; // 清空资源
				cell.detailjson = []; // 清空资源详细
				if(cell.resource_cate_id.length > 2){
					this.isExpand = true;
					var cate_id = cell.resource_cate_id[cell.resource_cate_id.length-1]
					this.initResource(cate_id);
				}else{
					this.isExpand = false;
				}
			},
			// 获取资源
			initResource(cate_id){
				this.$api.getResource_list({
					cate_id:cate_id,
				}).then(data =>{
					if(data.code == 0){
						// 回调成功的方法
						this.listOptions = data.data;
					}else{
						this.$message.error(data.msg);
					}
				});
			},
			// 资源选择
			resourceChange(cell){
				this.$set(this.checkform.bindResources);
				this.initResourceInfo(cell);
			},
			// 获取资源详情
			initResourceInfo(cell){
				this.$api.getResource_info({
					resource_id:cell.resource_id,
				}).then(data =>{
					if(data.code == 0){
						// 回调成功的方法
						cell.detailjson = data.data.detailjson;
						this.$set(this.checkform.bindResources);
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
				var resourcejson = new Array;
				var isArr = this.commonJs.isEmpty(this.checkform.bindResources[0]);
				if(!isArr){
					resourcejson = this.checkform.bindResources.map((item)=>{
						return {
							"id":item.resource_id,
							"re_remark":item.remark,
						}
					});
				};
				
				this.$refs[formName].validate((valid) => {
          if (valid) {
						this.$api.resourceCheck_check({
							id:this.ID,
							function_type:2,
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
				a.href = file.path;
				document.body.appendChild(a);
				a.click(); // 触发a标签的click事件
				document.body.removeChild(a);
			},
		}
	}
</script>

<style>

</style>