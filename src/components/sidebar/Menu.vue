<template>
  <div class="nav_menu">
    <template v-for="(menuData,index) in menuDatas">
      <!-- 不分组 -->
      <!-- 不分组只有一级菜单 -->
      <el-menu-item v-if="menuData&&menuData.childs===null" :key="menuData.route" :index="menuData.route" :route="menuData.route">
        <!--图标-->
        <i :class="[menuData.icon,'myMenuIcon']" v-if="menuData.icon"></i>
        <!--标题-->
        <span slot="title">{{menuData.name}}</span>
      </el-menu-item>

      <!--不分组有多级菜单-->
      <el-submenu v-if="menuData&&menuData.childs" :key="menuData.route" :index="menuData.route">
        <template slot="title">
          <i :class="menuData.icon"></i>
          <span> {{menuData.name}}</span>
        </template>
        <!--递归组件，把遍历的值传回子组件，完成递归调用-->
        <Menu class="multiple_menu" :menuDatas="menuData.childs"></Menu>
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
      }
    },
    methods: {},
  }
</script>

<style>

</style>
