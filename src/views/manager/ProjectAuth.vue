<template>
	<el-dialog
	  :title="authData.title"
	  :visible.sync="authData.dialog"
	  width="30%"
	  @open="openEdit"
	  @closed="closedEdit('authForm')"
	  :before-close="handleClose">
	  <el-form :model="authForm" :rules="rules" ref="authForm" label-width="120px">
	  	<el-form-item label="绑定人员" prop="auth_ids">
				<el-select class="w-100" popper-class="params_select" 
					v-model="authForm.auth_ids" 
					clearable 
					filterable
					multiple
					:filter-method="getUserList"
					placeholder="下拉选择或搜索输入姓名/企业/部门"
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
	  </el-form>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="closedEdit('authForm')">取 消</el-button>
	    <el-button type="primary" @click="submitForm('authForm')">确 定</el-button>
	  </span>
	</el-dialog>
</template>

<script>
	export default {
		props:['authData'],
		inject: ['loadData'],
		name: 'ProjectAuth',
		data () {
			return {
				authForm:{
					auth_ids:[],
				},
				uidOptions:[],
				total: 0, //总条数
        currentPage: 1, //当前页
        pageSize: 6, //每页显示条数
				uid_query:"",
				rules: {
          auth_ids: [
            { required: true, message: '请选择负责人', trigger: 'change' }
          ],
        }
			}
		},
		components: {},
		mounted(){
			
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
				this.$api.manager_projectAuth({
					id:this.authData.id,
					function_type:2,
				}).then(data => {
					if(data.code == 0){
						if(data.data.auth_ids !== ""){
							this.authForm.auth_ids = data.data.auth_ids.split(",");
						}else{
							this.authForm.auth_ids = [];
						}
					}else{
						this.$message.error(data.msg);
					}
				})
			},
			// dialog关闭
			closedEdit(formName){
				this.handleClose();
				this.resetForm(formName);
			},
			// 右上角x关闭
			handleClose(){
				this.authData.dialog = false;
			},
			// form提交
			submitForm(formName) {
				var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
          	this.$api.manager_projectAuth({
							id:this.authData.id,
							auth_ids:this.authForm.auth_ids.join(","),
							function_type:1,
						}).then(data =>{
							if(data.code == 0){
								_this.handleClose();
								_this.resetForm(formName);
								_this.loadData();
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
      // 表单重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
		}
	}
</script>

<style>

</style>