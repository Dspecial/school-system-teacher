<template>
  <div class="resources-container">
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <!-- 资源列表 -->
    <el-card class="mt-3">
      <data-tables-server :data="tableData" layout="tool, table,pagination" :current-page="currentPage" :page-size="pageSize" :pagination-props="{ background: true, pageSizes: [15,30,45,60], total: total }" @query-change="loadData" :filters="filters" :table-props="tableProps">
        <div class="mb-3" slot="tool">
          <h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">资源列表</h4>
          <div class="d-flex align-items-center">
          	<div class="mr-auto d-flex align-items-center">
						  <el-input
                placeholder="请输入资源名称查询"
                prefix-icon="el-icon-search"
                v-model="filters[0].value"
                clearable>
              </el-input>
						  <el-select v-model="filters[1].value" placeholder="请选择是否使用" class="ml-3" clearable>
						    <el-option label="使用中" :value="1"></el-option>
                <el-option label="已禁用" :value="2"></el-option>
						  </el-select>
              <el-select v-model="filters[2].value" placeholder="请选择使用类型" class="ml-3" clearable>
						    <el-option label="永久" :value="'1'"></el-option>
                <el-option label="临时" :value="'2'"></el-option>
						  </el-select>
              <el-cascader v-model="filters[3].value" placeholder="请选择资源分类" class="ml-3" :show-all-levels="false" clearable :options="cateOptions" :props="{value:'id',label:'cate_name',children:'children',checkStrictly: true}">
					    </el-cascader>
          	</div>
            <div class="ml-auto">
              <el-button type="primary" @click="handleAdd()" v-if="$store.getters.getaddAction.title" ><i class="el-icon-plus el-icon--left"></i>{{$store.getters.getaddAction.title}}</el-button>
            </div>
          </div>
        </div>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50" v-if="isShow"></el-table-column>
        <el-table-column prop="id" label="ID" width="60"></el-table-column>
        <el-table-column prop="name" label="资源名称" width="150"></el-table-column>
        <el-table-column prop="p_name" label="所属项目" width="180"></el-table-column>
        <el-table-column prop="sup_name" label="所属供应商" width="180"></el-table-column>
        <el-table-column prop="number" label="数量"></el-table-column>
        <el-table-column label="详细参数" width="200">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title="详细参数"
              width="200"
              trigger="hover"
              :content="scope.row.detailjson">
              <span class="text-truncate" slot="reference">{{scope.row.detailjson}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="cate_name" label="所属分类" width="150"></el-table-column>
        <el-table-column prop="is_use" label="是否使用">
          <template slot-scope="scope">
            <span v-if="scope.row.is_use == 1"><i class="dot bg-success mr-1"></i>使用中</span>
            <span v-else><i class="dot bg-danger mr-1"></i>已禁用</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="使用类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type == '1'">永久</span>
            <span v-else>临时</span>
          </template>
        </el-table-column>
        <el-table-column prop="usetime" label="使用结束时间" width="120"></el-table-column>
        <el-table-column label="备注" width="150">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title="备注"
              width="200"
              trigger="hover"
              :content="scope.row.remark">
              <span class="text-truncate" slot="reference">{{scope.row.remark}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="cname" label="创建人" width="100"></el-table-column>
        <el-table-column prop="createtime" label="创建时间" width="150"></el-table-column>
        <el-table-column prop="ename" label="最新编辑人" width="100"></el-table-column>
        <el-table-column prop="updatetime" label="更新时间" width="150"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <span v-for="(action,index) in $store.getters.getmoreAction" :key="index" @click="fun(scope.$index,scope.row,action.sign,action.id)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
          </template>
        </el-table-column>
      </data-tables-server>
      <hoster-resource-edit :resourceData="resourceData"></hoster-resource-edit>
    </el-card>
  </div>
</template>

<script>
  import GlobalTips from "@/components/GlobalTips";
  import HosterResourceEdit from "./HosterResourceEdit";

	export default {
    name: 'HosterResource',
    components: {
      GlobalTips,
      HosterResourceEdit,
    },
    data() {
      return {
        cateOptions:[],
        tableProps: {
          
        },
        isShow:false,
        tableData: [],
        filters: [
	        {
	          value: '',
	          prop: 'name'
	        },
          {
            value: '',
            prop: 'is_use'
          },
          {
            value: '',
            prop: 'type'
          },
          {
            value: '',
            prop: 'cate_id'
          }
        ],
        total: 0, //总条数
        currentPage: 1, //当前页
        pageSize: 15, //每页显示条数
        // 新增资源
        resourceData:{
          dialog:false,
          title:"",
          id:"",
          isEdit:false,
        },
      }
    },
    provide() {
      return {
        loadData: this.loadData
      }
    },
    computed: {
    },
    mounted(){
      this.initCateOptions();
    },
    methods: {
      // 获取分类
			initCateOptions(){
				this.$api.getResource_cate({
        }).then(data=>{
          if(data.code == 0){
            this.cateOptions = data.data;
          }else{
            this.$message.error(data.msg);
          }
        });
			},

      // 自增序列
      indexMethod(index) { 
        return ++index;
      },
      // 加载数据
      loadData(queryInfo) { 
        let _this = this;
        var cate_id = "";
        if(this.filters[3].value.length > 0){
          cate_id = this.filters[3].value[this.filters[3].value.length - 1];
        }
        if (queryInfo != null) {
          this.currentPage = queryInfo.page;
          this.pageSize = queryInfo.pageSize;
        }
        this.$api.hosterResourceList({
          page:this.currentPage,
          limit:this.pageSize,
          keywords:this.filters[0].value,
          is_use:this.filters[1].value,
          type:this.filters[2].value,
          cate_id:cate_id,
        }).then(data=>{
          if(data.code == 0){
            this.total = data.data.total;
            this.tableData = data.data.data;
          }else{
            this.$message.error(data.msg);
          }
        });
      },
      // 新增资源
      handleAdd(){
        this.resourceData.dialog = true;
        this.resourceData.title = "新增资源";
        this.resourceData.id = "";
        this.resourceData.isEdit = false;
      },

      // 操作们
      fun(index,row,sign,actionId){
        if(sign == 2){ // 编辑
          this.editResource(index,row);
        }else if(sign == 3){ // 删除
          this.handleDel(index,row);
        }else if(sign == 4){ // 详情
          this.goDetail(index,row);
        }else if(sign == 11.1){ // 资源使用列表
          this.goUseList(index,row);
          this.menuClick(actionId);
        }else if(sign == 11.2){ // 资源维护记录列表
          this.goRecordList(index,row);
          this.menuClick(actionId);
        }
      },

      // 编辑资源
      editResource(index,row){
        this.resourceData.dialog = true;
        this.resourceData.title = "编辑资源";
        this.resourceData.id = row.id;
        this.resourceData.isEdit = true;
      },

      // 删除
      handleDel(index,row){
        this.$confirm("此操作将永久删除该资源, 是否继续?", "提示", {
          type: 'warning'
        }).then(() => {
          this.$api.hosterResourceDel({
            id:row.id
          }).then(data=>{ 
             if(data.code == 0){
                this.$message({
                  message: "删除资源成功!",
                  type: 'success'
                });
                this.loadData();
             }else{
               this.$message.error(data.msg);
             }
          })
        }).catch(() => {

        });
      },

      // 详情
      goDetail(index,row){
        this.$router.push({
          path:"/project/hosterResource/detail",
          query: {
            id: row.id,
          }
        })
      },

      // 资源使用列表
      goUseList(index,row){
        this.$router.push({
          path:"/project/hosterResource/useList",
          query: {
            id: row.id,
          }
        });
      },

      // 资源维护记录列表
      goRecordList(index,row){
        this.$router.push({
          path:"/project/hosterResource/recordList",
          query: {
            id: row.id,
          }
        });
      },

      // 获取该菜单列表下的所有操作按钮
      menuClick(id){
        this.VueCookies.set('back_menu_id', id);
        // 清空
        this.allAction = {
          addAction:{},
          moreAction:[],
        };
        this.$api.menuButton({
          menu_id:id
        }).then(data=>{
          if(data.code == 0){
            if(this.commonJs.isEmpty(data.data.current_menu[0])){
              this.$store.commit("SET_ACTION",this.allAction);
            }else{
              data.data.current_menu.map(item=>{
                if(item.sign == 1){ // 是添加按钮
                  this.allAction.addAction = item;
                }else{
                  this.allAction.moreAction.push(item);
                }
              })
              this.$store.commit("SET_ACTION",this.allAction);
            }
            // console.log(this.allAction,'this.allAction');
          }
        })
      },
    },
  }
</script>

<style>

</style>