<template>
  <div class="nav_menu">
    <template v-for="menuData in menuDatas">
      <!-- 不分组 -->
      <!-- 不分组只有一级菜单 -->
      <el-menu-item @click="menuClick(menuData.id)" v-if="menuData&&menuData.sub==undefined || menuData&&menuData.sub===null || menuData&&menuData.sub.length===0" :key="menuData.path" :index="menuData.path" :route="menuData.path">
        <!--图标-->
        <i :class="[menuData.icon,'myMenuIcon']" v-if="menuData.icon"></i>
        <!--标题-->
        <span slot="title">{{menuData.title}}</span>
      </el-menu-item>

      <!--不分组有多级菜单-->
      <el-submenu v-if="menuData&&menuData.sub&&menuData.sub.length!=0" :key="menuData.path" :index="menuData.path">
        <div slot="title">
          <i :class="menuData.icon"></i>
          <span> {{menuData.title}}</span>
        </div>
        <!--递归组件，把遍历的值传回子组件，完成递归调用-->
        <Menu class="multiple_menu" :menuDatas="menuData.sub"></Menu>
      </el-submenu>
      <!-- /不分组 -->
    </template>
  </div>
</template>

<script>
  export default {
    name: 'Menu', //使用递归组件必须要有
    props: ['menuDatas'], // 传入子组件的数据
    data() {
      return {
        allAction:{
          addAction:{},
          moreAction:[],
        }
      }
    },
    methods: {
      // 获取该菜单列表下的所有操作按钮
      menuClick(id){
        // 清空
        this.allAction = {
          addAction:{},
          moreAction:[],
        };
        this.$api.menuButton({
          menu_id:id
        }).then(data=>{
          if(data.code == 0){
            // console.log(data.data,'mmmm');
            data.data.map(item=>{
              this.menuAuth(item)
            })
            this.$store.commit("SET_ACTION",this.allAction);
            localStorage.setItem("allAction",JSON.stringify(this.allAction));
          }
        })
      },
      // 获取该菜单列表下的操作权限
      menuAuth(action){
        this.$api.menuState({
          menu_id:action.id
        }).then(data=>{
          if(data.code == 0){
            if(data.data){
              var isAdd = action.name.split("/").indexOf("add");
              if(isAdd !=-1){ // 是添加按钮
                this.allAction.addAction = action;
              }else{
                this.allAction.moreAction.push(action);
              }
            }
          }
        })
      },
    },
  }
</script>

<style>

</style>
