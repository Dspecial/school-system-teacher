<template>
	<el-dialog
	  :title="mfuserData.title"
	  :visible.sync="mfuserData.dialog"
	  width="30%"
	  @open="openEdit"
	  @closed="closedEdit('mfuserForm')"
	  :before-close="handleClose">
	  <el-form :model="mfuserForm" :rules="rules" ref="mfuserForm" label-width="120px">
	  	<el-form-item label="企业名称" prop="job_number">
		    <el-input v-model="mfuserForm.job_number" placeholder="请输入企业名称"></el-input>
		  </el-form-item>
		  <el-form-item label="营业执照编码" prop="sys_id">
		    <el-input v-model="mfuserForm.sys_id" placeholder="请输入营业执照编码"></el-input>
		  </el-form-item>
		  <el-form-item label="负责人姓名" prop="name">
		    <el-input v-model="mfuserForm.name" placeholder="请输入负责人姓名"></el-input>
		  </el-form-item>
		  <el-form-item label="性别" prop="sex">
		    <el-radio-group v-model="mfuserForm.sex">
			    <el-radio label="1">男</el-radio>
			    <el-radio label="2">女</el-radio>
			  </el-radio-group>
		  </el-form-item>
		  <el-form-item label="设置密码" prop="password" v-if="!mfuserData.isEdit">
		    <el-input v-model="mfuserForm.password" placeholder="请输入密码，默认123456"></el-input>
		  </el-form-item>
		  <!-- <el-form-item label="修改密码" prop="password2" v-else>
		    <el-input v-model="mfuserForm.password2" placeholder="请修改密码，不填写默认不修改"></el-input>
		  </el-form-item> -->
		  <el-form-item label="手机号码" prop="phone">
		    <el-input v-model="mfuserForm.phone" placeholder="请输入手机号码"></el-input>
		  </el-form-item>
		  <el-form-item label="电子邮箱" prop="email">
		    <el-input v-model="mfuserForm.email" placeholder="请输入电子邮箱"></el-input>
		  </el-form-item>
	  </el-form>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="closedEdit('mfuserForm')">取 消</el-button>
	    <el-button type="primary" @click="submitForm('mfuserForm')">确 定</el-button>
	  </span>
	</el-dialog>
</template>

<script>
	export default {
		props:['mfuserData'],
		inject: ['loadData'],
		name: 'MuserEdit',
		data () {
			var validatePass = (rule, value, callback) => {
	      if (!this.$commonJs.checkSpecialKey(value)) {
	        callback(new Error("不能含有特殊字符！！"));
	      } else {
	        callback();
	      }
	    };
			return {
				mfuserForm:{
					id:"",
					job_number:"",
					sys_id:"",
					name:"",
					sex:"",
					password:"",
					password2:"",
					phone:"",
					email:"",
				},
				roleOptions:[
				],
				rules: {
          job_number: [
            { required: true, message: '请输入企业名称', trigger: 'blur' }
          ],
          sys_id: [
            { required: true, message: '请输入营业执照编码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入负责人姓名', trigger: 'blur' },
          ],
          sex: [
            { required: true, message: '请选择负责人性别', trigger: 'change' }
          ],
          phone: [
            { required: true, validator: this.commonJs.checkPhone, trigger: 'blur' },
          ],
          email: [
          	{ required: true, validator: this.commonJs.checkEmail, trigger: 'blur' },
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
				if(this.mfuserData.isEdit){ // 编辑
					this.$api.companyEdit({
						id:this.mfuserData.id,
						func_type:2,
					}).then(data => {
						if(data.code == 0){
								this.mfuserForm.id = data.data.id;
								this.mfuserForm.job_number = data.data.job_number;
								this.mfuserForm.sys_id = data.data.sys_id;
								this.mfuserForm.name = data.data.name;
								this.mfuserForm.sex = data.data.sex;
								this.mfuserForm.phone = data.data.phone;
								this.mfuserForm.email = data.data.email;
								this.mfuserForm.is_normal = data.data.is_normal;
						}else{
							this.$message.error(data.msg);
						}
					})
				}else{ // 新增
					
				}
			},
			// dialog关闭
			closedEdit(formName){
				this.handleClose();
				this.resetForm(formName);
			},
			// 右上角x关闭
			handleClose(){
				this.mfuserData.dialog = false;
			},
			// form提交
			submitForm(formName) {
				var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
          	if(this.mfuserData.isEdit){ // 编辑后提交
          		this.$api.companyEdit({
          			id:this.mfuserForm.id,
	          		job_number:this.mfuserForm.job_number,
	          		sys_id:this.mfuserForm.sys_id,
	          		name:this.mfuserForm.name,
	          		sex:this.mfuserForm.sex,
	          		// password:this.mfuserForm.password2,
	          		phone:this.mfuserForm.phone,
	          		email:this.mfuserForm.email,
	          		func_type:1,
	          	}).then(data =>{
	          		if(data.code == 0){
									_this.handleClose();
									_this.resetForm(formName);
									_this.loadData();
	          		}else{
	          			this.$message.error(data.msg);
	          		}
	          	});
          	}else{ // 新增后提交
          		var psw;
          		if(this.mfuserForm.password){
	          		psw = this.mfuserForm.password;
	          	}else{
	          		psw = '123456';
	          	}
          		this.$api.companyAdd({
	          		job_number:this.mfuserForm.job_number,
	          		sys_id:this.mfuserForm.sys_id,
	          		name:this.mfuserForm.name,
	          		sex:this.mfuserForm.sex,
	          		password:psw,
	          		phone:this.mfuserForm.phone,
	          		email:this.mfuserForm.email,
	          	}).then(data =>{
	          		if(data.code == 0){
									_this.handleClose();
									_this.resetForm(formName);
									_this.loadData();
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
      // 表单重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
		}
	}
</script>

<style>

</style>