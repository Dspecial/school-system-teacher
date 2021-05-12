<template>
  <div>
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <!-- 列表 -->
    <el-card>
      <data-tables-server :data="tableData" layout="tool, table,pagination" :current-page="currentPage" :page-size="pageSize" 
			:pagination-props="{ background: true, pageSizes: [15,30,45,60], total: total }" @query-change="loadData" :filters="filters" :table-props="tableProps">
        <div class="mb-3" slot="tool">
          <h4 class="fs_16 font-weight-semibold m-0 text-000 mb-3">事务列表</h4>
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="待提交" name="1"></el-tab-pane>
            <el-tab-pane label="待办" name="2"></el-tab-pane>
            <el-tab-pane label="在办" name="3"></el-tab-pane>
            <el-tab-pane label="办结" name="4"></el-tab-pane>
          </el-tabs>
          <div class="d-flex align-items-center project_search_div">
          	<div class="d-flex align-items-center">
          		<el-input
    				    placeholder="请输入事务标题、内容、备注"
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
                value-format="yyyy-MM-dd">
              </el-date-picker>
          	</div>
            <div class="ml-auto">
              <el-button type="primary" @click="handleAdd()"><i class="el-icon-plus el-icon--left"></i>发起事务</el-button>
            </div>
          </div>
        </div>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="work_num" label="编号"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column label="内容">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title="内容"
              width="200"
              trigger="hover"
              :content="scope.row.desc">
              <span class="text-truncate" slot="reference">{{scope.row.desc}}</span>
            </el-popover>
          </template>
        </el-table-column>
				<el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1"><i class="dot bg-danger mr-1"></i>待提交</span>
            <span v-else-if="scope.row.status == 2"><i class="dot bg-warning mr-1"></i>待办</span>
            <span v-else-if="scope.row.status == 3"><i class="dot bg-primary mr-1"></i>在办</span>
            <span v-else><i class="dot bg-success mr-1"></i>办结</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="事务类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 1"><i class="dot bg-primary mr-1"></i>自办</span>
            <span v-else><i class="dot bg-success mr-1"></i>他办</span>
          </template>
        </el-table-column>
        <el-table-column prop="get_work_level" label="级别"></el-table-column>
				<el-table-column prop="createtime" label="创建时间"></el-table-column>
        <el-table-column prop="endtime" label="预计完成时间"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200" align="left">
          <template slot-scope="scope">
            <span class="text-primary cursor-pointer mr-3" @click="routineSubmit(scope.$index,scope.row)" v-if="scope.row.status == 1">提交</span>
            <span class="text-primary cursor-pointer mr-3" @click="editRoutine(scope.$index,scope.row)" v-if="scope.row.status == 1">编辑</span>
            <span class="text-primary cursor-pointer" @click="handleDel(scope.$index,scope.row)" v-if="scope.row.status == 1">删除</span>
          </template>
        </el-table-column>
      </data-tables-server>
    </el-card>
  </div>
</template>

<script>
  import GlobalTips from "@/components/GlobalTips";

	export default {
    name: 'Routine',
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
        activeName:'1',
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
      }
    },
    computed: {
    },
    mounted(){
      
    },
    methods:{
      handleClick(tab, event) {
        console.log(this.activeName);
        this.loadData();
      },
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
        this.$api.routineList({
          page:this.currentPage,
          limit:this.pageSize,
          keywords:this.filters[0].value,
					status:this.activeName,
          createtime:this.filters[1].value?this.filters[1].value.join(" - "):'',
        }).then(data=>{
          if(data.code == 0){
            this.total = data.data.total;
            this.tableData = data.data;
          }else{
            this.$message.error(data.msg);
          }
        });
      },
      // 提交事务
      routineSubmit(index,row){
        this.$confirm("此操作将提交该事务, 是否继续?", "提示", {
          type: 'warning'
        }).then(() => {
          this.$api.routineSubmit({
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
      // 发起事务
      handleAdd(){
        this.$router.push({
          path:"/works/routine/edit",
        })
      },
      // 编辑
      editRoutine(index,row){
        this.$router.push({
          path:"/works/routine/edit",
          query: {
            id: row.id,
          }
        })
      },
      // 删除
      handleDel(index,row){
        this.$confirm("此操作将永久删除该事务, 是否继续?", "提示", {
          type: 'warning'
        }).then(() => {
          this.$api.routineDel({
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
		},
  }
</script>

<style>
  .project_search_div .el-date-editor.el-input{
    width:100%!important;
  }
</style>