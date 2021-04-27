<template>
	<div class="page-header h-100 d-flex align-items-center">
		<div class="ml-auto d-flex align-items-center">
			<i class="el-icon-search fs_16 mr-4"></i>
      <el-dropdown trigger="click">
        <el-badge :value="totalNews.length" :max="99" class="item">
          <i class="el-icon-bell fs_16"></i>
        </el-badge>
        <el-dropdown-menu slot="dropdown" :hidden="totalNews.length == 0">
          <div v-for="(news,index) in totalNews" :key="index">
            <el-dropdown-item v-if="news.status == 0"><i :class="'el-icon-tickets mr-2 text-warning fs_16'"></i>{{news.content}}</el-dropdown-item>
            <el-dropdown-item v-else><i :class="'el-icon-warning mr-2 text-danger fs_16'"></i>{{news.content}}</el-dropdown-item>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="d-flex align-items-center ml-4">
      	<el-avatar :size="28" :src="avatarUrl"></el-avatar><span class="fs_14 ml-2">{{name}}</span>
      </div>
    </div>
	</div>
</template>

<script>
	export default {
		name: 'Header',
		data () {
			return {
				// 消息列表
				totalNews:[
          {
           status:"0",//0:消息通知；1:报警
           content:"京A-888888 需要保养"
          },
          {
           status:"1",//0:消息通知；1:报警
           content:"京A-888888 未系安全带"
          },
          {
           status:"0",//0:消息通知；1:报警
           content:"京A-123456 需要保养"
          },
          {
           status:"1",//0:消息通知；1:报警
           content:"京A-888888 与 京A-123456 发生碰撞"
          },
        ],
        // 头像
        avatarUrl:require("@/assets/images/avatar.jpg"),
        name:'用户名'
			}
		},
		components: {},

	}
</script>

<style>

</style>