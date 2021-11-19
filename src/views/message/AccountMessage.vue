<template>
	<div>
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<el-card class="mt-3 bg-white">
			<h6 class="fs_18 font-weight-normal mb-3">账户信息</h6>
			<el-form :model="accountForm" :rules="rules" ref="accountForm" label-width="120px" class="pl-3 pr-3">
				<el-form-item label="银行账号" prop="account">
					<el-input v-model="accountForm.account" placeholder="请输入银行账号"></el-input>
				</el-form-item>
				<el-form-item label="所属银行" prop="bank">
					<el-input v-model="accountForm.bank" placeholder="请输入所属银行"></el-input>
				</el-form-item>
				<el-form-item label="支行信息" prop="bank_attach">
					<el-input v-model="accountForm.bank_attach" placeholder="请输入支行信息"></el-input>
				</el-form-item>
				<el-form-item label="企业地址" prop="address">
					<el-input v-model="accountForm.address" placeholder="请输入企业地址"></el-input>
				</el-form-item>
				<div class="d-flex justify-content-end">
					<el-button type="primary" @click="submitForm('accountForm')">确 定</el-button>
					<el-button @click="closedEdit('accountForm')">取 消</el-button>
				</div>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import GlobalTips from "@/components/GlobalTips";
	export default {
		name: 'AccountMessage',
		data () {
			return {
				accountForm:{
					account:"",
					bank:"",
					bank_attach:"",
					address:""
				},
				rules: {
          account: [
            { required: true, message: '请输入银行账号', trigger: 'blur' }
          ],
					bank: [
            { required: true, message: '请输入所属银行', trigger: 'blur' }
          ],
					bank_attach: [
            { required: true, message: '请输入支行信息', trigger: 'blur' }
          ],
					address: [
            { required: true, message: '请输入企业地址', trigger: 'blur' }
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
				this.$api.accountInfo({
					function_type:2,
				}).then(data=>{
					if(data.code == 0){
						if(data.data){
							this.accountForm = data.data
						}
					}
				})
			},

			// form提交
			submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
						this.$api.accountInfo({
							account:this.accountForm.account,
							bank:this.accountForm.bank,
							bank_attach:this.accountForm.bank_attach,
							address:this.accountForm.address
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