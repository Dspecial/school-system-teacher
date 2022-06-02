<template>
  <div>
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <!-- 列表 -->
    <el-card>
      <data-tables-server :data="tableData" layout="tool, table,pagination" :current-page="currentPage" :page-size="pageSize" :pagination-props="{ background: true, pageSizes: [15,30,45,60], total: total }" @query-change="loadData" :filters="filters" :table-props="tableProps">
        <div class="mb-3" slot="tool">
          <h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">项目列表</h4>
          <div class="d-flex align-items-center project_search_div">
          	<div class="d-flex align-items-center">
          		<el-input
    				    placeholder="请输入项目编号/项目名称/类别名称"
    				    prefix-icon="el-icon-search"
    				    v-model="filters[0].value"
                clearable
                class="mr-3">
    				  </el-input>
              <el-date-picker
                placeholder="请选择项目年份"
                v-model="filters[1].value"
                type="year"
                class="mr-3"
                value-format="yyyy"
                clearable>
              </el-date-picker>
              <el-date-picker
                v-model="filters[2].value"
                type="daterange"
                range-separator="至"
                start-placeholder="创建时间"
                end-placeholder="创建时间"
                align="right"
                value-format="yyyy-MM-dd"
                clearable>
              </el-date-picker>
          	</div>
            <div class="ml-auto">
              <el-button type="primary" @click="handleAdd()" v-if="$store.getters.getaddAction.title"><i class="el-icon-plus el-icon--left"></i>{{$store.getters.getaddAction.title}}</el-button>
            </div>
          </div>
          <!-- 金额 -->
          <div class="allMoney mt-3 mb-3 pt-2 pb-2 pl-3 pr-3">
            <div class="d-flex align-items-center">
              <i class="el-icon-coin mr-2 text-success"></i>
              <span class="mr-5">总金额：{{ money_data.all_money}} 元</span>
              <span class="mr-5">已付款金额：{{ money_data.alread_pay }} 元</span>
              <span>未付款金额：{{ money_data.load_pay }} 元</span>
            </div>
          </div>
        </div>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="apply_number" width="220" label="项目编号"></el-table-column>
        <el-table-column prop="p_name" label="项目名称" width="220"></el-table-column>
        <el-table-column prop="cname" label="类别名称" width="200"></el-table-column>
        <el-table-column prop="projecttime" label="年份" width="80"></el-table-column>
        <el-table-column prop="apply_user_depart" label="所属部门"></el-table-column>
        <el-table-column prop="check_process.text" label="项目状态" width="220"></el-table-column>
        <el-table-column prop="createtime" label="创建时间" width="150"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150" >
          <template slot-scope="scope">
            <template v-if="scope.row.is_leader == 1">
              <span v-for="(action,k) in actions1" :key="k" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
            </template>
            <template v-else>
              <span v-for="(action,k) in actions2" :key="k" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
            </template>
          </template>
        </el-table-column>
      </data-tables-server>
    </el-card>
    <project-auth :authData="authData"></project-auth>
  </div>
</template>

<script>
  import GlobalTips from "@/components/GlobalTips";
  import ProjectAuth from "./ProjectAuth";
	export default {
    name: 'Project',
    components: {
      GlobalTips,
      ProjectAuth
    },
    provide() {
      return {
        loadData: this.loadData
      }
    },
    data() {
      return {
        money_data:{
          all_money:"",
          alread_pay:"",
          load_pay:"",
        },
        tableProps: {},
        tableData: [],
        filters: [
          {
	          value: '',
	          prop: 'keywords'
	        },
          {
	          value: '',
	          prop: 'projecttime'
	        },
          {
	          value: '',
	          prop: 'createtime'
	        }
        ],
        total: 0, //总条数
        currentPage: 1, //当前页
        pageSize: 15, //每页显示条数
        authData:{
          id:"",
          title:"",
          dialog:false,
        },
        actions1:[],
        actions2:[],
      }
    },
    computed: {
    },
    mounted(){
      
    },
    methods:{
			// 自增序列
      indexMethod(index) { 
        return ++index;
      },
      // 加载数据
      loadData(queryInfo) { 
        let _this = this;
        if (queryInfo != null) {
          this.currentPage = queryInfo.page;
          this.pageSize = queryInfo.pageSize;
        }
        this.$api.manager_projectList({
          page:this.currentPage,
          limit:this.pageSize,
          keywords:this.filters[0].value,
          projecttime:this.filters[1].value,
          createtime:this.filters[2].value?this.filters[2].value.join(" - "):'',
        }).then(data=>{
          if(data.code == 0){
            this.total = data.data.total;
            this.tableData = data.data.data;

            var actions_1 = new Array,actions_2 = new Array;
            this.$store.getters.getmoreAction.map((item,index)=>{
              if(item.sign == '4'){ // 详情
                actions_1.push(item);
              }else if (item.sign == '12'){ // 授权
                actions_2.push(item);
              }
            });
            // is_leader  如果是1的话就显示授权按钮 
            this.actions1 = [...actions_1,...actions_2];
            this.actions2 = [...actions_1];
            
            this.money_data = data.money_data;
          }else{
            this.$message.error(data.msg);
          }
        });
      },

      // 新增项目类别
      handleAdd(){
        this.$router.push({
          path:"/manager/project/edit",
        })
      },

      // 操作们
      fun(index,row,sign){
        if(sign == '2'){ // 编辑
          this.editProject(index,row);
        }else if(sign == '3'){ // 删除
          this.handleDel(index,row);
        }else if(sign == '4'){ // 详情
          this.goDetail(index,row);
        }else if(sign == '12'){ // 授权
          this.goAuth(index,row);
        }
      },

      // 编辑项目
      editProject(index,row){
        this.$router.push({
          path:"/manager/project/edit",
          query: {
            id: row.id,
          }
        })
      },
      // 删除
      handleDel(index,row){
        this.$confirm("此操作将永久删除该项目, 是否继续?", "提示", {
          type: 'warning'
        }).then(() => {
          this.$api.projectDel({
            id:row.id
          }).then(data=>{ 
             if(data.code == 0){
                this.$message({
                  message: data.msg,
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
      // 项目详情
      goDetail(index,row){
        this.$router.push({
          path:"/manager/project/detail",
          query: {
            id: row.id,
          }
        })
      },
      // 授权
      goAuth(index,row){
        this.authData.id = row.id;
        this.authData.title = "人员授权";
        this.authData.dialog = true;
      },
		},
  }
</script>

<style>

</style>