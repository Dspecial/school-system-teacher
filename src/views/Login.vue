<template>
	<div class="login-container h-100">
		<div class="w-50 login d-flex">
			<div class="login-left">
				<el-image :src="loginBg" fit="fill" class="h-100"></el-image>
			</div>
			<div class="login-right">
				<el-form ref="loginForm" :model="loginForm" label-width="0" class="login-box" size="large"  @submit.native.prevent>
	        <div class="login-header mb-5">
	          <p class="fs_28 text-000 text-center">{{configName}}</p>
	        </div>
	        <el-form-item prop="username">
	          <el-input placeholder="账号" prefix-icon="el-icon-user-solid" v-model="loginForm.username" autocomplete="off">
	          </el-input>
	        </el-form-item>
	        <el-form-item prop="password">
	          <el-input :type="pwdType" placeholder="密码" prefix-icon="el-icon-lock" v-model="loginForm.password" autocomplete="off">
	            <i slot="suffix" :class="['el-input__icon icon cursor-pointer',suffixIcon]" @click="showPwd"></i>
	          </el-input>
	        </el-form-item>
	        <el-checkbox v-model="rememberPwd">记住密码</el-checkbox>
	        <el-form-item>
	          <el-button type="primary" class="w-100 fs_16 mt-5" native-type="submit" @click="onSubmit()">登录</el-button>
	        </el-form-item>
	      </el-form>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Login',
		components: {},
		data () {
			return {
				loginBg:require('@/assets/images/login_bg.png'),
        configName:"教师",
				loginForm: {
          username: '',
          password: ''
        },
        pwdType:"password",
        suffixIcon:'icon-eye2',
        rememberPwd:true,
			}
		},
		created() {
      let that = this;
    },
    mounted(){
      this.loginConfig();
    },
    methods:{
      // 获取身份
      loginConfig(){
        this.$api.loginConfig({
        }).then(data=>{
          if(data.code == 0){
            this.configName = data.data.application_name;
          }else{
            const h = this.$createElement;
            this.$notify({
              title: "获取失败",
              message: h('i', {
                style: 'color: teal'
              }, data.msg),
              type: 'warning',
              duration: 3000,
            });
          }
        })
      },
    	showPwd(){
        this.pwdType === 'password' ? this.pwdType = '' : this.pwdType = 'password';
        this.pwdType == '' ? this.suffixIcon = 'icon-eye-blocked2' : this.suffixIcon = 'icon-eye2';
      },
      onSubmit(){
        var that  = this;
        this.$api.login({
          name:this.loginForm.username,
          password:this.loginForm.password,
        }).then( data =>{
          if(data.code == 0){
            // 存值给cookies
            this.$cookies.set('application_token', data.data.token);
            this.$cookies.set('application_userId', data.data.id);
            this.$cookies.set('application_userName', data.data.name);
            this.$cookies.set('application_job_number', data.data.job_number);
            this.$cookies.set('application_type', data.data.type);

            // dxx：判断，如果初次进入，直接跳转home页面；如果在别的页面停留过久，token失效，则登录以后直接跳转到当前页面
            var redirect = this.$route.query.redirect;
            if(redirect != ''&& redirect != undefined){
              this.$router.push(redirect);
            }else{
              this.$router.push("/home");
            }
          }else{
            const h = this.$createElement;
            this.$notify({
              title: "登录失败",
              message: h('i', {
                style: 'color: teal'
              }, data.msg),
              type: 'warning',
              duration: 3000,
            });
          }

        });

      },
    },
	}
</script>

<style>

</style>