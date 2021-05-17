<template>
  <div class="page-container">
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <!-- 进度列表 -->
    <el-card>
      <data-tables-server :data="tableData" layout="tool, table,pagination" :current-page="currentPage" :page-size="pageSize" 
      :pagination-props="{ background: true, pageSizes: [15,30,45,60], total: total }" @query-change="loadData" :filters="filters" :table-props="tableProps">
        <div class="mb-3" slot="tool">
          <h4 class="fs_16 font-weight-semibold m-0 text-000 mb-3">进度列表</h4>
          <div class="d-flex align-items-center project_search_div">
            <div class="d-flex align-items-center">
              <el-input
                placeholder="请输入项目名称/企业名称/标题/内容"
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
              <el-date-picker
                v-model="filters[2].value"
                type="daterange"
                range-separator="至"
                start-placeholder="审核时间"
                end-placeholder="审核时间"
                align="right"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
          </div>
        </div>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="p_name" label="项目名称" width="200"></el-table-column>
        <el-table-column prop="process_number" label="进度编号" width="230"></el-table-column>
        <el-table-column prop="title" label="进度标题" width="150"></el-table-column>
        <el-table-column label="进度内容" width="150">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title="进度内容"
              width="200"
              trigger="hover"
              :content="scope.row.content">
              <span class="text-truncate" slot="reference">{{scope.row.content}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="审核备注" width="120"></el-table-column>
        <el-table-column prop="name" label="企业名称" width="200"></el-table-column>
        <el-table-column prop="createtime" label="创建时间" width="150"></el-table-column>
        <el-table-column prop="checktime" label="审核时间"  width="150"></el-table-column>
        <el-table-column fixed="right" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <span class="text-primary cursor-pointer mr-3" v-if="scope.row.node_check_relation_list.can_check == 1" @click="progressCheck(scope.$index,scope.row)">审核</span>
            <span class="text-primary cursor-pointer">详情</span>
          </template>
        </el-table-column>
      </data-tables-server>
    </el-card>
  </div>
</template>

<script>
  import GlobalTips from "@/components/GlobalTips";

	export default {
    name: 'Process',
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
          {
	          value: '',
	          prop: 'checktime'
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
        this.$api.processList({
          page:this.currentPage,
          limit:this.pageSize,
          keywords:this.filters[0].value,
          createtime:this.filters[1].value?this.filters[1].value.join(" - "):'',
          checktime:this.filters[2].value?this.filters[2].value.join(" - "):'',
        }).then(data=>{
          if(data.code == 0){
            this.total = data.count;
            this.tableData = data.data;
          }else{
            this.$message.error(data.msg);
          }
        });
      },

      // 编辑
      checkEdit(index,row){
        this.$router.push({
          path:"/check/first/edit",
          query: {
            id: row.id,
          }
        })
      },

      // 进度审核
      progressCheck(index,row){
        this.$router.push({
          path:"/check/process/check",
          query: {
            project_id:row.project_id,
            id: row.id,
          }
        })
      },
		},
  }
</script>

<style>
  
</style>