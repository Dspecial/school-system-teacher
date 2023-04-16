<template>
	<el-container class="page-container">
	  <el-aside width="auto">
    	<SideBar/>
    </el-aside>
	  <el-container>
	    <el-header><Header/></el-header>
	    <el-main class="page">
    		<!-- <Breadcrumb></Breadcrumb> -->
    		<router-view v-if="isRouterAlive"></router-view>
    		<el-backtop target=".el-main" :visibility-height="300"></el-backtop>
	    </el-main>
	  </el-container>
	</el-container>
</template>

<script>
	import Header from '@/components/Header'
	import SideBar from '@/components/sidebar/SideBar'

	export default {
		name: 'Home',
		// 点击页面侧边栏重载功能的实现（该处提供了提供给后代组件的数据/方法）
    provide() {
      return{
        reload: this.reload
      }
    },
		components: {
			Header,
			SideBar
		},
		data () {
			return {
				isRouterAlive:true,
				parentTitle:"",
				currentTitle:"",
			}
		},
		watch:{
		  $route(to,from){
		  	// console.log(to,from);
		  	// $("main.el-main").scrollTop(0);
		  }
		},
		methods:{
			//页面重新载入函数
			reload () {
				this.isRouterAlive = false;
				this.$nextTick(function () {
					this.isRouterAlive = true
				})
			},
		},
		computed: {
	  },
    beforeCreate(){

    }
	}
</script>
