<template>
  <el-menu router :default-active="currentMenu" :unique-opened="true" class="el-menu-vertical-demo" text-color="rgba(255,255,255,0.8)" active-text-color="rgba(255,255,255,1)" @open="handleOpen" @close="handleClose" :collapse="isCollapse"  @select="handleselect">
    <!-- logo -->
    <div class="logo d-flex align-items-center justify-content-center">
    	<i class="icon-cube3 fs_24"></i>
    	<span class="fs_20 ml-2" v-if="!isCollapse">教师管理系统</span>
    </div>
    <!-- 为了做递归，所以把Menu抽出来做成一个组件 -->
    <Menu :menuDatas="menuDatas"></Menu>
  </el-menu>
</template>

<script>
  import Menu from './Menu.vue'
  import { sideBarData } from './sideBarData.js'
  import { fixedData } from './fixedMenu.js'
  import { globalBus } from '@/core/globalBus';

  export default {
    provide() {// 向兄弟组件传递重载菜单的方法
      return{
        reloadMenu: this.loadMenu
      }
    },
    name:"SideBar",
		data () {
			return {
        currentMenu: 'index', // SideBar里面当前高亮菜单的默认值
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
      
      // 修改了路由之后刷新菜单
      globalBus.$on('reMenu', () => {
        this.loadMenu()
      });
		},
    inject: ['reload'], // 注入重载的功能（注入依赖
		watch: {
	    $route(to, from) {
	      this.setCurrentMenu(); // 监听路由切换时，高亮菜单
        //this.reload();
	    },
	  },
    mounted(){
      this.loadMenu();

      window.onresize = () => {
        return (() => {
          this.mediaCollapse();
        })();
      };
      this.mediaCollapse();
    },

	  methods:{
      // 加载菜单
      loadMenu(){
        this.$api.menu({
        }).then(data =>{
          if(data.code == 0){
            var fixedMenu = fixedData.menu;// 写死的菜单
            this.menuDatas = [...fixedMenu,...data.data];
          }else{
            const h = this.$createElement;
            this.$notify({
              title: "加载失败",
              message: h('i', {
                style: 'color: teal'
              }, data.msg),
              type: 'warning',
              duration: 3000,
            });
          }
        });
      },
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