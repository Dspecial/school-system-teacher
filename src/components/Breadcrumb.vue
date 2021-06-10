<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
		<el-breadcrumb-item>
			<span class="cursor-pointer" @click="goBack()">
				<i class="el-icon-back text-000"></i><span class="ml-2">返回</span>
			</span>
		</el-breadcrumb-item>
		<el-breadcrumb-item v-for="(item,index) in levelList" :key="index">
			<span class="no-redirect">{{item.meta.title}}</span>
		</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "Breadcrumb",
  created() {
    this.getBreadcrumb(); // 刷新时加载面包屑
  },
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route(to, from) {
      this.getBreadcrumb(); // 路由切换时候加载面包屑
    },
  },
  methods: {
		goBack(){
			this.$router.go(-1);
		},
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name);
      matched.splice(0,1);
      this.levelList = matched;
    }
  },
}
</script>

<style>
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
</style>
