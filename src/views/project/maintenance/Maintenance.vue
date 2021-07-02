<template>
  <div>
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <!-- 维保列表 -->
    <el-card>
      <data-tables-server :data="tableData" layout="tool, table,pagination" :current-page="currentPage" :page-size="pageSize" :pagination-props="{ background: true, pageSizes: [15,30,45,60], total: total }" @query-change="loadData" :filters="filters" :table-props="tableProps">
        <div class="mb-3" slot="tool">
          <h4 class="fs_16 font-weight-semibold m-0 text-000 mb-3">维保列表</h4>
          <div class="d-flex align-items-center project_search_div">
          	<div class="d-flex align-items-center">
              <el-input
    				    placeholder="请输入项目名称/维保编号/标题/内容"
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
                value-format="yyyy">
              </el-date-picker>
              <el-select v-model="filters[2].value" placeholder="请选择审核状态" class="mr-3 w-100" clearable>
                <el-option label="审核中" value="1"></el-option>
                <el-option label="审核成功" value="2"></el-option>
                <el-option label="审核失败" value="3"></el-option>
              </el-select>
              <el-date-picker
                v-model="filters[3].value"
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
        </div>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="p_name" label="项目名称" width="200"></el-table-column>
        <el-table-column prop="projecttime" label="项目年份" width="100"></el-table-column>
        <el-table-column prop="status" label="审核状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1"><i class="dot bg-primary mr-1"></i>审核中</span>
            <span v-else-if="scope.row.status == 2"><i class="dot bg-success mr-1"></i>审核成功</span>
            <span v-else-if="scope.row.status == 3"><i class="dot bg-danger mr-1"></i>审核失败</span>
          </template>
        </el-table-column>
        <el-table-column prop="extend_number" label="维保编号" width="220"></el-table-column>
        <el-table-column prop="title" label="维保标题" width="200"></el-table-column>
        <el-table-column prop="content" label="内容" width="150">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title="内容"
              width="200"
              trigger="hover"
              :content="scope.row.content">
              <span class="text-truncate" slot="reference">{{scope.row.content}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="money" label="金额" width="100"></el-table-column>
        <el-table-column prop="contact_name" label="联系人" width="80"></el-table-column>
        <el-table-column prop="contact_phone" label="联系方式" width="120"></el-table-column>
        <el-table-column prop="job_number" label="维保企业" width="220"></el-table-column>
        <el-table-column prop="createtime" label="创建时间" width="150"></el-table-column>
        <el-table-column prop="endtime" label="维保时间" width="150"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <span v-for="(action,index) in $store.getters.getmoreAction" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-3">{{action.title}}</span>
          </template>
        </el-table-column>
      </data-tables-server>
    </el-card>
  </div>
</template>

<script>
  import GlobalTips from "@/components/GlobalTips";

	export default {
    name: 'Resource',
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
	          prop: 'projecttime'
	        },
          {
	          value: '',
	          prop: 'status'
	        },
          {
	          value: '',
	          prop: 'createtime'
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
        this.$api.maintenanceList({
          page:this.currentPage,
          limit:this.pageSize,
          keywords:this.filters[0].value,
          projecttime:this.filters[1].value,
          status:this.filters[2].value,
          createtime:this.filters[3].value?this.filters[3].value.join(" - "):'',
        }).then(data=>{
          if(data.code == 0){
            this.total = data.data.total;
            this.tableData = data.data.data;
          }else{
            this.$message.error(data.msg);
          }
        });
      },

       // 操作们
      fun(index,row,sign){
        if(sign == '4'){ // 详情
          this.detailMaintenance(index,row);
        }else if(sign == '5.11'){ // 工单列表
          this.goServiceList(index,row);
        }
      },

      // 维保详情
      detailMaintenance(index,row){
        this.$router.push({
          path:"/project/maintenance/detail",
          query: {
            id: row.id,
          }
        })
      },

      // 工单列表
      goServiceList(index,row){
        this.$router.push({
          path:"/project/maintenance/serviceList",
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