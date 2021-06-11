<template>
	<div class="page-header h-100 d-flex align-items-center">
		<div class="ml-auto d-flex align-items-center">
      <el-dropdown trigger="click">
        <el-badge :value="totalNews.length" :max="99" class="item">
          <i class="el-icon-bell fs_16"></i>
        </el-badge>
        <el-dropdown-menu slot="dropdown" :hidden="totalNews.length == 0">
          <div v-for="(news,index) in totalNews" :key="index" class="notice_dropdown">
            <el-dropdown-item v-if="news.type == 0"><i :class="'el-icon-tickets mr-2 text-warning fs_16'"></i>{{news.content}}</el-dropdown-item>
            <el-dropdown-item v-else><i :class="'el-icon-warning mr-2 text-danger fs_16'"></i>{{news.content}}</el-dropdown-item>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="d-flex align-items-center ml-3">
        <el-dropdown trigger="click">
          <div class="d-flex align-items-center">
      	    <span class="fs_14 ml-2">{{name}}</span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <div @click="logOut"><el-dropdown-item><i class="el-icon-user-solid fs_16"></i>退出登录</el-dropdown-item></div>
          </el-dropdown-menu>
        </el-dropdown>
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
        name:this.$cookies.get('application_userName'),
			}
		},
		components: {},
    mounted(){
      this.headerNotice();
    },
    methods:{
      // 点击退出登录
      logOut(){
        var type = this.$cookies.get('application_type');
        var isTpye = this.commonJs.isEmpty(this.$cookies.get('application_type')); // 是否有type，true 失效，没有；false 有
        if(!isTpye){
          if(type == 1){
            window.location.href = this.$globalUrl.baseURL + "/index/index?login=logout";
            this.$cookies.remove("application_token");
          }else{
            this.replaceUrl();
          }
        }else{
          this.replaceUrl();
        }
      },
      // 退出当前地址到login页面
      replaceUrl(){
        this.$router.replace({
          path: '/login',
          query: {
            redirect: this.$router.currentRoute.fullPath
          }
        });
        this.$cookies.remove("application_token");
      },
      // 消息提醒
      headerNotice(){
        this.$api.headerNotice({
				}).then(data=>{
					if(data.code == 0){
						this.totalNews = data.data.list;
					}else{
						this.$message.error(data.msg);
					}
				})
      },
    },

	}
</script>

<style>
.notice_dropdown{
  width: 300px;
}
.notice_dropdown .el-dropdown-menu__item{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>