<template>
	<div class="globalTips mb-3 pt-2 pb-2 pl-3 pr-3">
		<div class="d-flex align-items-center">
			<i class="el-icon-warning mr-2"></i>
			<span>欢迎管理员登录管理后台！ID：{{id}} 姓名：{{name}} 当前时间：{{time}}</span>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'GlobalTips',
		data () {
			return {
				id:"1234",
				name:"张三",
				time:"2020-10-10 12:00:00",
			}
		},
		components: {}
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