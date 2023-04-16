<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<h6 class="fs_18 font-weight-normal mb-3">{{title}}</h6>
			<el-form :model="resourceForm" :rules="rules" ref="resourceForm" label-width="110px" label-position="top" class="pl-3 pr-3">
				<el-row :gutter="20">
					<el-col :span="12" v-if="!this.projectId">
						<el-form-item label="项目" prop="project_id">
							<el-select v-model="resourceForm.project_id" clearable placeholder="请选择项目" class="w-100">
								<el-option
									v-for="item in proOptions"
									:key="item.id"
									:label="item.p_name"
									:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="资源分类" prop="resource_cate_id">
							<el-cascader class="w-100" v-model="resourceForm.resource_cate_id" placeholder="请选择资源分类" 
							clearable 
							:options="cateOptions" 
							:props="{value:'id',label:'cate_name',children:'children',checkStrictly: false}"
							@change="cateChange">
					    </el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="资源" prop="resource_id">
							<el-select v-model="resourceForm.resource_id" clearable placeholder="请选择资源" class="w-100" @change="resourceChange">
								<el-option
									v-for="item in listOptions"
									:key="item.id"
									:label="item.name"
									:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if="resourceForm.detailjson.length>0">
						<el-form-item label="资源详细">
							<el-row :gutter="20" class="re_detail_json">
								<el-col :span="6" v-for="(item,index) in resourceForm.detailjson" :key="index" class="pl-3 pr-3 pt-2 pb-2">
									<p class="mb-2 text-primary">{{item.title}}</p>
									<p class="m-0">{{item.val}}</p>
								</el-col>
							</el-row>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="申请备注">
							<el-input type="textarea" v-model="resourceForm.remark" placeholder="请输入申请备注" :rows="3"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<div class="d-flex justify-content-end">
					<el-button type="primary" @click="submitForm('resourceForm')">确 定</el-button>
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
		props:['editData'],
		name: 'ResourceEdit',
		data () {
			return {
				title:"",
				projectId:'',
				proOptions:[],
				cateOptions:[],
				listOptions:[],
				resourceForm: {
					project_id:"",
					resource_cate_id:"",
					resource_id:"",
					detailjson:[],
          apply_remark: "",
        },
        rules: {
					project_id: [
            { required: true, message: '请选择项目', trigger: 'change' }
          ],
					resource_cate_id: [
            { required: true, message: '请选择资源分类', trigger: 'change' }
          ],
					resource_id: [
            { required: true, message: '请选择资源', trigger: 'change' }
          ],
        }
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
			// 获取项目
			initPro(){
				this.$api.getPro({
				}).then(data =>{
					if(data.code == 0){
						// 回调成功的方法
						this.proOptions = data.data;
					}else{
						this.$message.error(data.msg);
					}
				});
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
			cateChange(value){
				// this.initResource(val);
				if(value.length > 2){
					this.isExpand = true;
					var cate_id = value[value.length-1]
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
			// 资源分类选择
			resourceChange(val){
				this.initResourceInfo(val);
			},
			// 获取资源详情
			initResourceInfo(resource_id){
				this.$api.getResource_info({
					resource_id:resource_id,
				}).then(data =>{
					if(data.code == 0){
						// 回调成功的方法
						this.resourceForm.detailjson = data.data.detailjson;
					}else{
						this.$message.error(data.msg);
					}
				});
			},
			// dialog初始化
			openEdit(){
				this.projectId = this.$route.query.id;
				this.initPro();
				this.initCate();
				if(this.projectId){
					this.title = "编辑资源";
					this.$api.resourceEdit({
						id:this.projectId,
						function_type:2,
					}).then(data =>{
						if(data.code == 0){
							this.resourceForm = data.data;
							this.cateChange(data.data.cate_id);
						}else{
							this.$message.error(data.msg);
						}
					});
				}else{
					this.title = "申请资源";
				}
			},
			// 关闭编辑
			closedEdit(){
				this.$router.go(-1);//返回上一层
			},
      // form提交
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
          if (valid) {
						if(this.projectId){ // 编辑
							this.$api.resourceEdit({
								id:this.projectId,
								function_type:1,
								project_id:this.resourceForm.project_id,
								resource_id:this.resourceForm.resource_id,
								apply_remark:this.resourceForm.apply_remark,
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
							this.$api.resourceAdd({
								project_id:this.resourceForm.project_id,
								resource_id:this.resourceForm.resource_id,
								apply_remark:this.resourceForm.apply_remark,
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
		}
	}
</script>

<style>

</style>