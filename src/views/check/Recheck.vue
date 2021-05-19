<template>
  <div class="page-container">
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <!-- 复审列表 -->
    <el-card>
      <data-tables-server :data="tableData" layout="tool, table,pagination" :current-page="currentPage" :page-size="pageSize" 
      :pagination-props="{ background: true, pageSizes: [15,30,45,60], total: total }" @query-change="loadData" :filters="filters" :table-props="tableProps">
        <div class="mb-3" slot="tool">
          <h4 class="fs_16 font-weight-semibold m-0 text-000 mb-3">复审列表</h4>
          <div class="d-flex align-items-center project_search_div">
            <div class="d-flex align-items-center">
              <el-input
                placeholder="请输入项目名称/申请编号/项目简介/申请部门名称/申请人"
                prefix-icon="el-icon-search"
                v-model="filters[0].value"
                class="mr-3">
              </el-input>
              <el-date-picker
                v-model="filters[1].value"
                type="daterange"
                range-separator="至"
                start-placeholder="创建时间"
                end-placeholder="创建时间"
                align="right"
                value-format="yyyy-MM-dd"
                class="mr-3">
              </el-date-picker>
            </div>
          </div>
        </div>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="apply_number" label="项目编号" width="230"></el-table-column>
        <el-table-column prop="p_name" label="项目名称" width="150"></el-table-column>
        <el-table-column prop="budget_amount" label="项目金额"></el-table-column>
        <el-table-column label="简介">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title="简介"
              width="200"
              trigger="hover"
              :content="scope.row.p_biref">
              <span class="text-truncate" slot="reference">{{scope.row.p_biref}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="projecttime" label="年份" width="80"></el-table-column>
        <el-table-column prop="agree_number" label="合同编号" width="120"></el-table-column>
        <el-table-column prop="expert_name" label="评审专家"></el-table-column>
        <el-table-column prop="name" label="申请人姓名" width="100"></el-table-column>
        <el-table-column prop="depart_name" label="申请人所在部门" width="160"></el-table-column>
        <el-table-column prop="createtime" label="创建时间" width="150"></el-table-column>
        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.node_check_relation_list.can_check == 1">
              <span v-for="(action,index) in actions1" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-3">{{action.title}}</span>
            </template>
            <template v-else>
              <span v-for="(action,index) in actions2" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-3">{{action.title}}</span>
            </template>
          </template>
        </el-table-column>
      </data-tables-server>
    </el-card>
  </div>
</template>

<script>
  import GlobalTips from "@/components/GlobalTips";

	export default {
    name: 'Recheck',
    components: {
      GlobalTips,
    },
    provide() {
      return {
        loadData: this.loadData
      }
    },
    data() {
      return {
        tableProps: {
          'max-height': 670,
        },
        tableData: [],
        filters: [
	        {
	          value: '',
	          prop: 'keywords'
	        },
          {
	          value: '',
	          prop: 'createtime'
	        },
        ],
        total: 0, //总条数
        currentPage: 1, //当前页
        pageSize: 15, //每页显示条数
        actions1:[],
        actions2:[]
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
        this.$api.recheckList({
          page:this.currentPage,
          limit:this.pageSize,
          keywords:this.filters[0].value,
          createtime:this.filters[1].value?this.filters[1].value.join(" - "):'',
        }).then(data=>{
          if(data.code == 0){
            this.total = data.count;
            this.tableData = data.data;
            var action_1 = new Array;
            var action_2 = new Array;
            this.$store.getters.getmoreAction.map((item,index)=>{
              if(item.sign == 6){ // 审核
                action_1.push(item);
              }else if(item.sign == 4){ // 详情
                action_2.push(item);
              }
              
              this.actions1 = [...action_1,...action_2];
              this.actions2 = [...action_2];
            });
          }else{
            this.$message.error(data.msg);
          }
        });
      },

      // 操作们
      fun(index,row,sign){
        if(sign == 6){ // 审核
          this.recheckCheck(index,row);
        }else if(sign == 4){ // 详情
          this.goDetail(index,row);
        }
      },
      // 复核
      recheckCheck(index,row){
        this.$router.push({
          path:"/check/recheck/check",
          query: {
            project_id:row.project_id,
            id: row.id,
          }
        })
      },
      // 详情
      goDetail(index,row){
        this.$router.push({
          path:"/check/recheck/detail",
          query: {
            id: row.id,
          }
        })
      },
		},
  }
</script>

<style>
  
</style>