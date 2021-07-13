<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<h6 class="fs_18 font-weight-normal mb-3">{{titile}}</h6>
			<el-form :model="recheckForm" :rules="rules" ref="recheckForm" label-width="110px" label-position="top" class="pl-3 pr-3">
				<el-row :gutter="20">
					<el-col :span="24">
						<el-form-item label="评审状态" class="payment_item" required prop="sendjson">
							<div slot="label" class="d-flex justify-content-between">
								<span>评审状态</span>
								<span class="text-primary cursor-pointer" @click="addPro(recheckForm.sendjson)"><i class="el-icon-plus mr-1"></i>评审状态</span>
							</div>
							<template v-for="(cell,INDEX) in recheckForm.sendjson">
								<el-row type="flex" align="middle" :gutter="20" class="cell_row mb-3" :key="INDEX">
									<el-col :span="24">
										<el-select v-model="cell.expert_id" placeholder="请选择专家" class="w-100" clearable @change="changeCheck">
											<el-option
												v-for="item in expertOptions"
												:key="item.id"
												:label="item.e_name"
												:value="item.id"
												:disabled="item.isSelect">
											</el-option>
										</el-select>
									</el-col>
									<el-col :span="24">
										<el-select v-model="cell.is_pass" clearable placeholder="请选择是否通过" class="w-100">
											<el-option label="通过" value="1"></el-option>
											<el-option label="不通过" value="2"></el-option>
										</el-select>
									</el-col>
									<el-col :span="24">
										<el-input v-model="cell.content" placeholder="请输入评审意见"></el-input>
									</el-col>
									<el-col :span="2" class="text-right">
										<span class="text-danger cursor-pointer" @click="delField(recheckForm.sendjson,INDEX)">删除</span>
									</el-col>
								</el-row>
							</template>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="评审日期" prop="recheck_date">
							<el-date-picker 
								type="date" 
								placeholder="请选择评审日期，必须大于当前日期"
								:picker-options="startOption" 
								v-model="recheckForm.recheck_date" 
								value-format="yyyy-MM-dd"
								clearable
								style="width: 100%;"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="复审内容" prop="content">
							<el-input type="textarea" v-model="recheckForm.content" placeholder="请输入复审内容" :rows="3"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<div class="d-flex justify-content-end">
					<el-button type="primary" @click="submitForm('recheckForm')">确 定</el-button>
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
		name: 'RecheckCheckEdit',
		data () {
			return {
				projectId:'',
				titile:"复审编辑",
				expertOptions:[],
				isSelectArr:[],
				recheckForm: {
					sendjson:[{}],
					recheck_date:"",
					content:"",
        },
				startOption:{
					disabledDate: time =>{
						return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
					}
				},
        rules: {
					sendjson: [
            { required: true, message: '请选择评审状态', trigger: 'change' }
          ],
					recheck_date: [
            { required: true, message: '请选择评审日期', trigger: 'change' }
          ],
					content: [
            { required: true, message: '请输入复审内容', trigger: 'blur' }
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
			// 获取专家列表
			initExpert(){
				this.$api.projectExpert({
				}).then(data =>{
					if(data.code == 0){
						// 回调成功的方法
						this.expertOptions = data.data;
						this.expertOptions.map((item)=>{
							item.isSelect = false;
						})
					}else{
						this.$message.error(data.msg);
					}
				});
			},
			// 专家选择
			changeCheck(val){
				this.expertOptions.map((arr)=>{
					if(val == arr.id){
						arr.isSelect = true;
					}
				})
				this.$set(this.expertOptions);
			},
			// 添加审核流程
			addPro(item){
				item.push({});
			},
			// 删除字段
			delField(item,index){
				item.splice(index, 1);
			},
			// dialog初始化
			openEdit(){
				this.projectId = this.$route.query.id;
				this.initExpert();
				this.$api.recheckList_edit({
					function_type:1,
					id:this.projectId,
				}).then(data=>{
					if(data.code == 0){
						this.recheckForm.sendjson = JSON.parse(data.data.project_recheck_info.sendjson);
						this.recheckForm.recheck_date = data.data.project_recheck_info.recheck_date;
						this.recheckForm.content = data.data.project_recheck_info.content;
					}
				})
			},
			// 关闭编辑
			closedEdit(){
				this.$router.push({
          path:"/check/checkList",
        })
				// this.$router.go(-1);//返回上一层
			},
      // form提交
			submitForm(formName) {
				var _this = this;
				var newArr = new Array;
				var isArr = this.commonJs.isEmpty(this.recheckForm.sendjson[0]);
				if(!isArr){
					newArr = this.recheckForm.sendjson
				}
				this.$refs[formName].validate((valid) => {
          if (valid) {
						this.$api.recheckList_edit({
							function_type:2,
							id:this.projectId,
							sendjson:JSON.stringify( newArr ),
							recheck_date: this.recheckForm.recheck_date,
							content: this.recheckForm.content,
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