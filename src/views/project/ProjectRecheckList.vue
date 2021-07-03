<template>
  <div>
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <Breadcrumb></Breadcrumb>
    <!-- 复审记录列表 -->
    <el-card class="mt-3 bg-white">
      <data-tables-server :data="tableData" layout="tool, table,pagination" :current-page="currentPage" :page-size="pageSize" :pagination-props="{ background: true, pageSizes: [15,30,45,60], total: total }" @query-change="loadData" :filters="filters" :table-props="tableProps">
        <div class="mb-3" slot="tool">
          <h4 class="fs_16 font-weight-semibold m-0 text-000 mb-3">复审列表</h4>
        </div>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="p_name" label="项目名称"></el-table-column>
        <el-table-column prop="expert_name" label="评审专家"></el-table-column>
        <el-table-column prop="status" label="审核状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1"><i class="dot bg-warning mr-1"></i>待审核</span>
            <span v-else-if="scope.row.status == 2"><i class="dot bg-primary-900 mr-1"></i>审核成功</span>
            <span v-else-if="scope.row.status == 3"><i class="dot bg-success mr-1"></i>审核失败</span>
          </template>
        </el-table-column>
        <el-table-column label="审核内容">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title="审核内容"
              width="200"
              trigger="hover"
              :content="scope.row.content">
              <span class="text-truncate" slot="reference">{{scope.row.content}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="审核备注"></el-table-column>
        <el-table-column prop="createtime" label="创建时间"></el-table-column>
        <el-table-column prop="recheck_date" label="评审日期" width="150"></el-table-column>
        <el-table-column prop="checktime" label="审核时间" width="150"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <span class="text-primary cursor-pointer" @click="listDetail(scope.$index,scope.row)">查看详情</span>
          </template>
        </el-table-column>
      </data-tables-server>
    </el-card>

    <!-- 复审详情 -->
    <el-dialog title="复审详情" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column property="e_name" label="专家姓名"></el-table-column>
        <el-table-column label="评审内容">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title="审核内容"
              width="200"
              trigger="hover"
              :content="scope.row.content">
              <span class="text-truncate" slot="reference">{{scope.row.content}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="is_pass" label="是否通过">
          <template slot-scope="scope">
            <span v-if="scope.row.is_pass == 1"><i class="dot bg-success mr-1"></i>通过</span>
            <span v-else-if="scope.row.is_pass == 2"><i class="dot bg-danger mr-1"></i>不通过</span>
          </template>
        </el-table-column>
        <el-table-column property="createtime" label="创建时间"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import GlobalTips from "@/components/GlobalTips";
  import Breadcrumb from "@/components/Breadcrumb";

	export default {
    name: 'projectRecheckList',
    components: {
      GlobalTips,
      Breadcrumb
    },
    data() {
      return {
        projectId:'',
        tableProps: {
          'max-height': 670,
        },
        tableData: [],
        filters: [
	        {
	          value: '',
	          prop: 'keywords'
	        },
        ],
        total: 0, //总条数
        currentPage: 1, //当前页
        pageSize: 15, //每页显示条数
        dialogTableVisible:false,
        gridData:[],
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
        this.projectId = this.$route.query.id;
        if (queryInfo != null) {
          this.currentPage = queryInfo.page;
          this.pageSize = queryInfo.pageSize;
        }
        this.$api.projectRecheck_list({
          page:this.currentPage,
          limit:this.pageSize,
          id:this.projectId,
        }).then(data=>{
          if(data.code == 0){
            this.total = data.data.total;
            this.tableData = data.data.data;
          }else{
            this.$message.error(data.msg);
          }
        });
      },
      // 查看复审详情
      listDetail(index,row){
        this.dialogTableVisible = true;
        this.$api.projectRecheck_detail({
          id:row.id
        }).then(data=>{
          if(data.code == 0){
            this.gridData = data.data;
          }
        })
      },

		},
  }
</script>

<style>

</style>