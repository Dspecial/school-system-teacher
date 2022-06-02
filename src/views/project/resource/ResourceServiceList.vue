<template>
  <div>
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <Breadcrumb></Breadcrumb>
    <!-- 资源工单列表 -->
    <el-card class="mt-3">
      <data-tables-server :data="tableData" layout="tool, table,pagination" :current-page="currentPage" :page-size="pageSize" :pagination-props="{ background: true, pageSizes: [15,30,45,60], total: total }" @query-change="loadData" :filters="filters" :table-props="tableProps">
        <div class="mb-3" slot="tool">
          <h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">资源工单列表</h4>
          <div class="d-flex align-items-center project_search_div">
          	<div class="d-flex align-items-center">
              <el-input
    				    placeholder="请输入工单编号/标题/备注/问题描述"
    				    prefix-icon="el-icon-search"
    				    v-model="filters[0].value"
                clearable
                class="mr-3">
    				  </el-input>
              <el-select v-model="filters[1].value" placeholder="请选择工单状态" class="mr-3 w-100" clearable>
                <el-option label="待受理" value="1"></el-option>
                <el-option label="已受理" value="2"></el-option>
                <el-option label="已完成" value="3"></el-option>
              </el-select>
              <el-select v-model="filters[2].value" placeholder="请选择工单级别" class="mr-3 w-100" clearable>
                <el-option
                  v-for="item in levelOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-date-picker
                v-model="filters[3].value"
                type="daterange"
                range-separator="至"
                start-placeholder="创建时间"
                end-placeholder="创建时间"
                align="right"
                value-format="yyyy-MM-dd"
                clearable
                class="mr-3">
              </el-date-picker>
              <el-date-picker
                v-model="filters[4].value"
                type="daterange"
                range-separator="至"
                start-placeholder="完成时间"
                end-placeholder="完成时间"
                align="right"
                value-format="yyyy-MM-dd"
                clearable>
              </el-date-picker>
          	</div>
            <div class="ml-auto">
              <el-button type="primary" @click="handleAdd()"><i class="el-icon-plus el-icon--left"></i>发起工单</el-button>
            </div>
          </div>
        </div>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="question_number" label="工单编号"></el-table-column>
        <el-table-column prop="title" label="标题" width="220"></el-table-column>
        <el-table-column label="问题描述" width="200">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title="问题描述"
              width="200"
              trigger="hover"
              :content="scope.row.question_content">
              <span class="text-truncate" slot="reference">{{scope.row.question_content}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="工单状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1"><i class="dot bg-warning mr-1"></i>待受理</span>
            <span v-else-if="scope.row.status == 2"><i class="dot bg-primary mr-1"></i>已受理</span>
            <span v-else-if="scope.row.status == 3"><i class="dot bg-success mr-1"></i>已完成</span>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="工单级别"></el-table-column>
        <el-table-column label="备注" width="200">
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
        <el-table-column prop="createtime" label="创建时间"></el-table-column>
        <el-table-column prop="successtime" label="完成时间"></el-table-column>
        <el-table-column fixed="right" label="操作" width="120" >
          <template slot-scope="scope">
            <span @click="detailService(scope.$index,scope.row)" class="text-primary cursor-pointer">详情</span>
          </template>
        </el-table-column>
      </data-tables-server>
    </el-card>
  </div>
</template>

<script>
  import GlobalTips from "@/components/GlobalTips";
	import Breadcrumb from "@/components/Breadcrumb";

	export default {
    name: 'ResourceServiceList',
    components: {
      GlobalTips,
      Breadcrumb
    },
    provide() {
      return {
        loadData: this.loadData
      }
    },
    data() {
      return {
        levelOptions:[],
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
	          prop: 'status'
	        },
          {
	          value: '',
	          prop: 'level'
	        },
          {
	          value: '',
	          prop: 'createtime'
	        },
          {
	          value: '',
	          prop: 'successtime'
	        },
        ],
        total: 0, //总条数
        currentPage: 1, //当前页
        pageSize: 15, //每页显示条数
        // 审批状态
        applicationApproval: {
          dialog:false,
          title:"",
          id:","
        },
        actions:[

        ],
      }
    },
    computed: {
    },
    mounted(){
      this.initlevelOptions();
    },
    methods:{
      // 获取级别
      initlevelOptions(){
        this.$api.project_service_level({
        }).then(data=>{
          this.levelOptions = data;
        })
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
        this.$api.resource_serviceList({
          id:this.$route.query.id,
          page:this.currentPage,
          limit:this.pageSize,
          keywords:this.filters[0].value,
          status:this.filters[1].value,
          level:this.filters[2].value,
          createtime:this.filters[3].value?this.filters[3].value.join(" - "):'',
          successtime:this.filters[4].value?this.filters[4].value.join(" - "):'',
        }).then(data=>{
          if(data.code == 0){
            this.total = data.data.total;
            this.tableData = data.data.data;
          }else{
            this.$message.error(data.msg);
          }
        });
      },
      // 发起工单
      handleAdd(){
        this.$router.push({
          path:"/project/resource/service/edit",
          query:{
            id:this.$route.query.id,
            project_id:this.$route.query.project_id,
          }
        })
      },
      // 工单详情
      detailService(index,row){
        this.$router.push({
          path:"/project/resource/service/detail",
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