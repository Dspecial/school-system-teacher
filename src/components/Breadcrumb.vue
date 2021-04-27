<template>
	<div class="fs_16 cursor-pointer" @click="goBack()">
		<i class="el-icon-back text-000"></i><span class="ml-2">返回上级</span>
	</div>
</template>

<script>
	export default {
		name: 'Breadcrumb',
		data () {
			return {}
		},
		components: {},
		methods:{
			goBack(){
				this.$router.go(-1);
			},
		},
	}
</script>

<style>

</style>