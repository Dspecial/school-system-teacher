<template>
  <el-menu router :default-active="currentMenu" :unique-opened="true" class="el-menu-vertical-demo" text-color="rgba(255,255,255,0.8)" active-text-color="rgba(255,255,255,1)" @open="handleOpen" @close="handleClose" :collapse="isCollapse"  @select="handleselect">
    <!-- logo -->
    <div class="logo d-flex align-items-center justify-content-center">
    	<i class="icon-cube3 fs_24"></i>
    	<span class="fs_20 ml-2" v-if="!isCollapse">项目管理系统</span>
    </div>
    <!-- 为了做递归，所以把Menu抽出来做成一个组件 -->
    <Menu :menuDatas="menuDatas"></Menu>
  </el-menu>
</template>

<script>
  import Menu from './Menu.vue'
  import {sideBarData} from './sideBarData.js'
  import {globalBus} from '@/core/globalBus';

  export default {
		data () {
			return {
        currentMenu: 'personnelList', // SideBar里面当前高亮菜单的默认值
				menuDatas: sideBarData.menu,
        isCollapse:false,
			}
		},
		components: {
			Menu
		},
		computed: {

		},
		created () {
			this.setCurrentMenu(); // 刷新时，高亮菜单
      this.mediaCollapse();
		},
    inject: ['reload'], // 注入重载的功能（注入依赖
		watch: {
	    $route(to, from) {
	      this.setCurrentMenu(); // 监听路由切换时，高亮菜单
        //this.reload();
	    },
	  },
    mounted(){
      window.onresize = () => {
        return (() => {
          this.mediaCollapse();
        })();
      };

      this.mediaCollapse();

    },

	  methods:{
      // 高亮菜单
      setCurrentMenu(){
        var path = this.$route.path.split('#');
        var pathArr = path[0].split('/');
        var num = pathArr.length;
        if(num<4){ // 二级页面
          this.currentMenu = path[0];
        }else{ // 三级页面
          this.currentMenu = pathArr.slice(0,pathArr.length-1).join("/");
        }
      },
	  	handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleselect(){
        this.reload();  // 点击侧边栏重新载入页面
      },
      toggleCollapse(){
        this.isCollapse = !this.isCollapse;
      },
      mediaCollapse(){
        let screenW = document.body.clientWidth;
        if(screenW < 1440){
          this.isCollapse = true;
        }else{
          this.isCollapse = false;
        }
      }
	  },
	}
</script>