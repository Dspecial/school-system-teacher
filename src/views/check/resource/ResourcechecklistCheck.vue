<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<!-- 项目信息 -->
			<h6 class="fs_18 font-weight-normal mb-3">项目信息</h6>
			<el-form :model="projectInfo" ref="projectInfo" label-width="110px" label-position="left" class="pl-3 pr-3">
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
						<el-form-item label="审核状态">
							<span class="text-warning" v-if="check_info.check_state == 1">待审核</span>
							<span class="text-success" v-else-if="check_info.check_state == 2">审核成功</span>
							<span class="text-danger" v-else-if="check_info.check_state == 3">审核失败</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>

			<!-- 资源申请信息 -->
			<div>
				<h6 class="fs_18 font-weight-normal mb-3">资源申请信息</h6>
				<el-form label-width="110px" label-position="left" class="pl-3 pr-3">
					<el-row :gutter="20">
						<el-col :span="8">
							<el-form-item label="申请人">
								{{resourceInfo.apply_name}}
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="申请部门">
								{{resourceInfo.depart_name}}
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="申请资源备注">
								{{resourceInfo.apply_remark}}
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>

			<!-- 审核信息 -->
			<div v-if="check_info.check_state != 1">
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
			</div>
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
													<template v-for="(field, index) in cell.detailjson">
														<!-- 字段类型:1=文本框,2=数字框,3=下拉单选,4=日期选择,5=文件上传,6=文本域 -->
														<el-col :span="6" v-if="field.name_type == 1" :key="index">
															<el-form-item :label="field.title" :required="field.is_required == 2">
																<el-input v-model="field.val" :placeholder="field.placeholder == ''?'请输入'+field.title:field.placeholder"></el-input>
															</el-form-item>
														</el-col>
														<el-col :span="6" v-if="field.name_type == 2" :key="index">
															<el-form-item :label="field.title" :required="field.is_required == 2">
																<el-input v-model.number="field.val" :placeholder="field.placeholder == ''?'请输入'+field.title:field.placeholder"></el-input>
															</el-form-item>
														</el-col>

														<el-col :span="6" v-if="field.name_type == 3" :key="index">
															<el-form-item :label="field.title" :required="field.is_required == 2">
																<el-select v-model="field.val" :placeholder="field.placeholder == ''?'请选择'+field.title:field.placeholder" class="w-100" clearable>
																	<el-option v-for="(option,j) in field.extra_val" :label="option" :value="option" :key="j"></el-option>
																</el-select>
															</el-form-item>
														</el-col>
														<el-col :span="6" v-if="field.name_type == 4" :key="index">
															<el-form-item :label="field.title" :required="field.is_required == 2">
																<el-date-picker v-model="field.val" type="date" :placeholder="field.placeholder == ''?'请选择'+field.title:field.placeholder" clearable class="w-100"></el-date-picker>
															</el-form-item>
														</el-col>

														<el-col :span="24" v-if="field.name_type == 5" :key="index">
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

														<el-col :span="24" v-if="field.name_type == 6" :key="index">
															<el-form-item :label="field.title" :required="field.is_required == 2">
																<el-input type="textarea" v-model="field.val" :placeholder="field.placeholder == ''?'请输入'+field.title:field.placeholder" :autosize="{ minRows: 3, maxRows: 8 }"></el-input>
															</el-form-item>
														</el-col>
													</template>
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
				resourceInfo:{},
				check_info:{},

				cateOptions:[],
				supplierOptions:[],

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
				this.initSupplierOptions();
				this.ID = this.$route.query.id;
				this.$api.resourceCheckList_check({
					id:this.ID,
					function_type:1,
				}).then(data =>{
					if(data.code == 0){
						this.projectInfo = data.data.info;
						// 资源申请信息
						this.resourceInfo = data.data.resource_apply_info;
						// 审核信息
						this.check_info =  data.data.check_info;
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
			// 关闭编辑
			closedEdit(){
				// this.$router.go(-1);//返回上一层
				this.$router.push({
          path:"/check/resourceList",
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
						this.$api.resourceCheckList_check({
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
		}
	}
</script>

<style>

</style>