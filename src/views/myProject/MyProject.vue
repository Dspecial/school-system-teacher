<template>
  <div>
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <!-- 列表 -->
    <el-card>
      <data-tables-server :data="tableData" layout="tool, table,pagination" :current-page="currentPage" :page-size="pageSize" :pagination-props="{ background: true, pageSizes: [15,30,45,60], total: total }" @query-change="loadData" :filters="filters" :table-props="tableProps">
        <div class="mb-3" slot="tool">
          <h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">我的项目列表</h4>
          <div class="d-flex align-items-center project_search_div">
          	<div class="d-flex align-items-center">
          		<el-input
    				    placeholder="请输入项目编号/项目名称/教师姓名"
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
          </div>
        </div>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="apply_number" label="项目编号" width="250"></el-table-column>
        <el-table-column prop="p_name" label="项目名称" width="220"></el-table-column>
        <el-table-column prop="real_amount" label="项目金额"></el-table-column>
        <el-table-column prop="projecttime" label="年份"></el-table-column>
        <el-table-column prop="job_number" label="教师名称"></el-table-column>
        <el-table-column prop="createtime" label="创建时间" width="150"></el-table-column>
        <el-table-column fixed="right" label="操作" width="300" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.is_commit == 9 || scope.row.is_commit == 13">
              <span v-for="(action,index) in actions1" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-3">{{action.title}}</span>
            </template>
            <template v-else-if="scope.row.is_commit == 14">
              <span v-for="(action,index) in actions2" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-3">{{action.title}}</span>
            </template>
            <template v-else>
              <span v-for="(action,index) in actions3" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-3">{{action.title}}</span>
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
    name: 'Application',
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
          
        },
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
        actions1:[],
        actions2:[],
        actions3:[],
        actions4:[],
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
        this.$api.my_projectList({
          page:this.currentPage,
          limit:this.pageSize,
          keywords:this.filters[0].value,
          projecttime:this.filters[1].value,
          createtime:this.filters[2].value?this.filters[2].value.join(" - "):'',
        }).then(data=>{
          if(data.code == 0){
            this.total = data.data.total;
            this.tableData = data.data.data;
            var actions_1 = new Array,actions_2 = new Array,actions_3 = new Array,actions_4 = new Array;
            this.$store.getters.getmoreAction.map((item,index)=>{
              if(item.sign == 4){ // 详情
                actions_1.push(item);
              }else if (item.sign == 9.1){ // 上传进度
                actions_2.push(item);
              }else if (item.sign == 9.2){ // 进度记录
                actions_3.push(item);
              }else if (item.sign == 9.3){ // 上传验收
                actions_4.push(item);
              }
            });
            // is_commit 为9、13上传进度、进度记录、详情
            // is_commit 为14 上传验收、详情
            this.actions1 = [...actions_2,...actions_3,...actions_1];
            this.actions2 = [...actions_4,...actions_1];
            this.actions3 = [...actions_1];

          }else{
            this.$message.error(data.msg);
          }
        });
      },

      // 操作们
      fun(index,row,sign){
        if(sign == 4){ // 详情
          this.goDetail(index,row);
        }else if(sign == 9.1){ // 上传进度
          this.handleProcess(index,row);
        }else if(sign == 9.2){ // 进度记录
          this.ProcessList(index,row);
        }else if(sign == 9.3){ // 上传验收
          this.handleAccept(index,row);
        }
      },
      // 上传进度
      handleProcess(index,row){
        this.$router.push({
          path:"/company/myProject/process",
          query: {
            id: row.id,
          }
        })
      },
      // 进度记录
      ProcessList(index,row){
        this.$router.push({
          path:"/company/myProject/processList",
          query: {
            id: row.id,
          }
        })
      },
      // 上传验收
      handleAccept(index,row){
        this.$router.push({
          path:"/company/myProject/accept",
          query: {
            id: row.id,
          }
        })
      },
      // 查看详情
      goDetail(index,row){
        this.$router.push({
          path:"/company/myProject/detail",
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