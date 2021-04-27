<template>
	<div class="login-container h-100">
		<div class="w-50 login d-flex">
			<div class="login-left">
				<el-image :src="loginBg" fit="fill" class="h-100"></el-image>
			</div>
			<div class="login-right">
				<el-form ref="loginForm" :model="form" label-width="0" class="login-box" size="large">
	        <div class="login-header mb-5">
	          <p class="fs_28 text-000 text-center">账号登录</p>
	        </div>
	        <el-form-item prop="username">
	          <el-input placeholder="账号" prefix-icon="el-icon-user-solid" v-model="form.username" autocomplete="off">
	          </el-input>
	        </el-form-item>
	        <el-form-item prop="password">
	          <el-input :type="pwdType" placeholder="密码" prefix-icon="el-icon-lock" v-model="form.password" autocomplete="off">
	            <i slot="suffix" :class="['el-input__icon icon cursor-pointer',suffixIcon]" @click="showPwd"></i>
	          </el-input>
	        </el-form-item>
	        <el-checkbox v-model="rememberPwd">记住密码</el-checkbox>
	        <el-form-item>
	          <el-button type="primary" class="w-100 fs_16 mt-5" v-on:click="onSubmit()">登录</el-button>
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
				form: {
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
      document.onkeydown = function(e) {
        var key = window.event.keyCode;
        if (key == 13) {
          that.onSubmit();
        }
      }
    },
    methods:{
    	showPwd(){
    		console.log(this.pwdType,'this.pwdType');
        this.pwdType === 'password' ? this.pwdType = '' : this.pwdType = 'password';
        this.pwdType == '' ? this.suffixIcon = 'icon-eye-blocked2' : this.suffixIcon = 'icon-eye2';

        console.log(this.pwdType,'this.pwdType');
      },
      onSubmit: function() {
        var that  = this;
        that.$router.push("/home");
        // this.MyAxios.post(this.GLOBAL.baseURL + "/user/login", {
        //   username: this.form.username,
        //   password: this.form.password,
        // }).then(data=>{
        //   if (data.result.code == 0) {
        //     that.$cookie.set('token', data.result.token);
        //     that.$router.push("/home");
        //     that.$notify.closeAll();
        //   } else {
        //     const h = that.$createElement;
        //     that.$notify({
        //       title: "登录失败",
        //       message: h('i', {
        //         style: 'color: teal'
        //       }, data.result.msg),
        //       type: 'warning'
        //     });
        //   }
        // })
      },
    },
	}
</script>

<style>

</style>