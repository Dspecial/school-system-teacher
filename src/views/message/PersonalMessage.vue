<template>
	<div>
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<el-card class="mt-3 bg-white">
			<h6 class="fs_18 font-weight-normal mb-3">账户信息</h6>
			<el-form :model="personalForm" :rules="rules" ref="personalForm" label-width="120px" class="pl-3 pr-3">
				<el-form-item label="企业名称" prop="job_number">
					<el-input v-model="personalForm.job_number" placeholder="请输入企业名称"></el-input>
				</el-form-item>
				<el-form-item label="营业执照编码" prop="sys_id">
					<el-input v-model="personalForm.sys_id" placeholder="请输入营业执照编码" :readonly="true"></el-input>
				</el-form-item>
				<el-form-item label="负责人姓名" prop="name">
					<el-input v-model="personalForm.name" placeholder="请输入负责人姓名"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="personalForm.sex" prop="sex">
						<el-radio label="1">男</el-radio>
						<el-radio label="2">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="personalForm.password2" placeholder="请修改密码,不填写默认不修改"></el-input>
				</el-form-item>
				<el-form-item label="手机号码" prop="phone">
					<el-input v-model="personalForm.phone" placeholder="请输入手机号码"></el-input>
				</el-form-item>
				<el-form-item label="电子邮箱" prop="email">
					<el-input v-model="personalForm.email" placeholder="请输入电子邮箱"></el-input>
				</el-form-item>
				<div class="d-flex justify-content-end">
					<el-button type="primary" @click="submitForm('personalForm')">确 定</el-button>
					<el-button @click="closedEdit('personalForm')">取 消</el-button>
				</div>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import GlobalTips from "@/components/GlobalTips";
	export default {
		name: 'PersonalMessage',
		data () {
			return {
				personalForm:{
					job_number:"",
					name:"",
					sys_id:"",
					password:"",
					password2:"",
					phone:"",
					email:"",
					sex:"",
				},
				rules: {
          job_number: [
            { required: true, message: '请输入企业名称', trigger: 'blur' }
          ],
					name: [
            { required: true, message: '请输入负责人姓名', trigger: 'blur' }
          ],
					sys_id: [
            { required: true, message: '请输入营业执照编码', trigger: 'blur' }
          ],
					passWord: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { 
            	trigger: 'blur',
            	validator: (rule, value, callback) => {
			          var passwordreg = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}/
			          if (!passwordreg.test(value)) {
			            callback(new Error('密码必须由数字、字母、特殊字符组合,请输入6-16位'))
			          }else{
			            callback()
			          }
		        	}
      			}
          ],
          phone: [
            { required: true, validator: this.commonJs.checkPhone, trigger: 'blur' },
          ],
          email: [
          	{ required: true, validator: this.commonJs.checkEmail, trigger: 'blur' },
          ],
					sex: [
            { required: true, message: '请选择性别', trigger: 'change' }
          ],
        }
			}
		},
		components: {
			GlobalTips
		},
		mounted(){
			this.loadData();
		},
		methods:{
			loadData(){
				this.$api.personalInfo({
					func_type:2,
				}).then(data=>{
					if(data.code == 0){
						this.personalForm = data.data
					}
				})
			},

			// form提交
			submitForm(formName) {
				// var newpassword = this.personalForm.password2?this.personalForm.password2:'';
        this.$refs[formName].validate((valid) => {
          if (valid) {
						this.$api.personalInfo({
							job_number:this.personalForm.job_number,
							name:this.personalForm.name,
							sys_id:this.personalForm.sys_id,
							password:this.personalForm.password2,
							phone:this.personalForm.phone,
							email:this.personalForm.email,
							sex:this.personalForm.sex,
							func_type:1,
						}).then(data =>{
							if(data.code == 0){
								this.$message({
                  message: data.msg,
                  type: 'success'
                });
								this.loadData();
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
		},
	}
</script>

<style>

</style>