<template>
	<div class="application_detail">
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3">
			<h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">资源详情</h4>
			<el-form :model="resourceForm" ref="resourceForm" label-width="110px" label-position="left">
				<div class="resourceAdd_form mb-3 pl-3 pr-3 pt-3">
					<h4 class="fs_18 font-weight-semibold m-0 mb-3 text-primary">基础信息</h4>
					<el-row :gutter="20">
						<el-col :span="8">
							<el-form-item label="资源名称" prop="name">
								{{ resourceForm.name }}
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="数量" prop="number">
								{{ resourceForm.number }}
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="供应商">
								{{ resourceForm.supplier_name }}
							</el-form-item>
						</el-col>
						<el-col :span="8">  
							<el-form-item label="所属分类" prop="cate_id">
								{{ resourceForm.cate_name }}
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="是否使用" prop="is_use">
								{{ resourceForm.is_use}}
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="使用类型" prop="type">
								{{ resourceForm.type == 1?"永久":"临时"}}
							</el-form-item>
						</el-col>
						<el-col :span="8" v-if="resourceForm.type == '2'">
							{{ resourceForm.usetime }}
						</el-col>
						<el-col :span="8">
							<el-form-item label="备注" prop="remark">
								{{ resourceForm.remark }}
							</el-form-item>
						</el-col>
					</el-row>
				</div>

				<div class="resourceAdd_form mb-3 pl-3 pr-3 pt-3" v-if="isExpand">
					<h4 class="fs_18 font-weight-semibold m-0 mb-3 text-primary">拓展参数</h4>
					<el-row :gutter="20">
						<div v-for="(field, index) in resourceForm.fieldArray" :key="index">
							<!-- 字段类型:1=文本框,2=数字框,3=下拉单选,4=日期选择,5=文件上传,6=文本域 -->
							<el-col :span="8" v-if="field.name_type !== 5">
								<el-form-item :label="field.title" :required="field.is_required == 2">
									{{ field.val }}
								</el-form-item>
							</el-col>

							<el-col :span="24" v-if="field.name_type == 5">
								<el-form-item :label="field.title">
									<div class="d-flex align-items-center justify-content-between mb-2" v-for="(file,j) in field.file_arr" :key="j">
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
						</div>
					</el-row>
				</div>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import Breadcrumb from "@/components/Breadcrumb";
	import BaseEcharts from "@/components/echarts/BaseEcharts"
	export default {
		name: 'HosterResourceDetail',
		components: {
			Breadcrumb,
			"my-echart":BaseEcharts,
		},
		data () {
			return {
				resourceForm:{
					id:"",
					name:"",
					number:"",
					supplier_id:"",
					supplier_name:"",
					cate_id:"",
					is_use:"2", // 默认2禁用
					remark:"",
					type:"2",
					usetime:"",
					fieldArray:[],
				},
				supplierOptions:[],
				cateOptions:[],
				isExpand:false,// 是否显示拓展参数
			}
		},
		mounted(){
			this.initData();
    },
		methods:{

			handleChange(value){
				if(value.length > 2){
					this.isExpand = true;
					var cate_id = value[value.length-1]
					this.initParams(cate_id);
				}else{
					this.isExpand = false;
				}
			},
			// 获取供应商
			initSupplierOptions(supplier_id){
				this.$api.getResource_supplier({
        }).then(data=>{
          if(data.code == 0){
            this.supplierOptions = data.data;
						this.supplierOptions.forEach((item,index)=>{
							if(item.id == supplier_id){
								this.resourceForm.supplier_name = item.name;
							}
						});
          }else{
            this.$message.error(data.msg);
          }
        });
			},

			// 获取自定义参数
			initParams(cate_id){
				this.$api.getResource_cateParamsOption({
					cate_id:cate_id,
					function_type:1,
        }).then(data=>{
          if(data.code == 0){
            this.resourceForm.fieldArray = data.data;
          }else{
            this.$message.error(data.msg);
          }
        });
			},

			// 获取数据
			initData(){
				this.$api.hosterResourceDetail({
					id:this.$route.query.id,
					function_type:2,
				}).then(data => {
					if(data.code == 0){
						this.resourceForm.id = data.data.id;
						this.resourceForm.name = data.data.name;
						this.resourceForm.number = data.data.number;
						this.resourceForm.supplier_id = data.data.supplier_id;
						this.initSupplierOptions(this.resourceForm.supplier_id);
						this.resourceForm.type = data.data.type;
						this.resourceForm.usetime = data.data.usetime != 0?data.data.usetime:"";
						this.resourceForm.remark = data.data.remark;

						if(data.data.is_use == 1){
							this.resourceForm.is_use = '使用中'; // 使用中
						}else{
							this.resourceForm.is_use = '禁用'; // 禁用
						}

						
						var all_parent = data.data.all_parent;
						all_parent.forEach(obj => {
							if(obj.id == data.data.cate_id){
								this.resourceForm.cate_name = obj.cate_name;
							}
						});
						if(all_parent.length > 2){
							this.isExpand = true;
							this.resourceForm.fieldArray = data.data.detailjson
						}
					}
				})
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
		},
	}
</script>

<style>

</style>