<template>
	<div class="globalTips mb-3 pt-2 pb-2 pl-3 pr-3">
		<div class="d-flex align-items-center">
			<i class="el-icon-warning mr-2"></i>
			<span>欢迎登录{{systemName}}！ID：{{userId}} 姓名：{{userName}} 当前时间：{{time}}</span>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'GlobalTips',
		data () {
			return {
				systemName:'管理后台',
				userId:"1234",
				userName:"张三",
				time:"2020-10-10 12:00:00",
			}
		},
		components: {},
		mounted(){
			this.loginConfig();
			this.userId = this.$cookies.get('application_userId');
			this.userName = this.$cookies.get('application_userName');
			this.time = this.getDayjsTime();
		},
		methods:{
			// 获取系统名称
      loginConfig(){
        this.$api.loginConfig({
        }).then(data=>{
          if(data.code == 0){
            this.systemName = data.data.system_name;
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
			getDayjsTime () {
	      let dayjsTime = this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
	      return dayjsTime
	    }
		},
	}
</script>

<style>
	.globalTips{
		background: #EDF5FF;
		border: 1px solid #97C3FF;
		border-radius: 4px;
	}
	.globalTips i {
		color: #1677FF;
		font-size: 18px;
	}
</style>