<template>
	<el-dialog
	  :title="pwdData.title"
	  :visible.sync="pwdData.dialog"
	  width="30%"
	  @open="openEdit"
	  @closed="closedEdit('pwdForm')"
	  :before-close="handleClose">
	  <el-form :model="pwdForm" :rules="rules" ref="pwdForm" label-width="120px">
		  <el-form-item label="设置密码" prop="set_pwd">
		    <el-input v-model="pwdForm.set_pwd" placeholder="请输入需要设置的密码"></el-input>
		  </el-form-item>
			<el-form-item label="备注">
				<el-input type="textarea" v-model="pwdForm.remark" placeholder="请输入备注" :rows="3"></el-input>
			</el-form-item>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="closedEdit('pwdForm')">取 消</el-button>
	    <el-button type="primary" @click="submitForm('pwdForm')">确 定</el-button>
	  </span>
	</el-dialog>
</template>

<script>
	export default {
		props:['pwdData'],
		inject: ['loadData'],
		name: 'MfuserChangepwd',
		data () {
			return {
				pwdForm:{
					set_pwd:"",
					remark:"",
				},
				roleOptions:[
				],
				rules: {
          set_pwd: [
            { required: true, message: '请输入申请修改的密码', trigger: 'blur' }
          ],
        }
			}
		},
		components: {},
		mounted(){
			
		},
		methods:{
			// dialog初始化
			openEdit(){
				var _this = this;

			},
			// dialog关闭
			closedEdit(formName){
				this.handleClose();
				this.resetForm(formName);
			},
			// 右上角x关闭
			handleClose(){
				this.pwdData.dialog = false;
			},
			// form提交
			submitForm(formName) {
				var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
						this.$api.companyChangpwd({
							id:this.pwdData.id,
							set_pwd:this.pwdForm.set_pwd,
							remark:this.pwdForm.remark,
						}).then(data =>{
							if(data.code == 0){
								_this.$message.success(data.msg);
								_this.handleClose();
								_this.resetForm(formName);
								_this.loadData();
							}else{
								this.$message.error(data.msg);
							}
						});
          }else {
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