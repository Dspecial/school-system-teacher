<template>
  <div>
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <!-- 列表 -->
    <el-card>
      <data-tables-server :data="tableData" layout="tool, table,pagination" :current-page="currentPage":page-size="pageSize" :pagination-props="{ background: true, pageSizes: [15,30,45,60], total: total }" @query-change="loadData" :filters="filters" :table-props="tableProps">
        <div class="mb-3" slot="tool">
          <h4 class="fs_16 font-weight-semibold m-0 text-000 mb-3">项目列表</h4>
          <div class="d-flex align-items-center">
          	<div class="mr-auto d-flex align-items-center">
          		<el-input
    				    placeholder="请输入类型、项目名称、预算"
    				    prefix-icon="el-icon-search"
    				    v-model="filters[0].value">
    				  </el-input>
              <el-button type="primary" class="ml-3">查询</el-button>
          	</div>
            <div class="ml-auto">
              <el-button type="primary" @click="handleApply()"><i class="el-icon-plus el-icon--left"></i>项目申请</el-button>
            </div>
          </div>
        </div>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="time" label="时间"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="name" label="项目名称"></el-table-column>
        <el-table-column prop="dept" label="申请部门"></el-table-column>
        <el-table-column prop="applicant" label="申请人"></el-table-column>
        <el-table-column prop="funds" label="经费来源"></el-table-column>
        <el-table-column prop="budget" label="预算"></el-table-column>
        <el-table-column prop="mode" label="建设方式"></el-table-column>
        <el-table-column prop="apply" label="申请资源"></el-table-column>
        <el-table-column prop="remark" label="项目描述"></el-table-column>
        <el-table-column prop="append" label="附件"></el-table-column>
        <el-table-column label="审核状态" align="center" >
          <template slot-scope="scope">
            <span class="text-primary cursor-pointer" @click="approvalDetail(scope.$index,scope.row)">详情</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <span class="text-primary cursor-pointer" @click="applicationDetail(scope.$index,scope.row)">查看</span>
            <span class="text-primary cursor-pointer ml-3">修改</span>
          </template>
        </el-table-column>
      </data-tables-server>
      <application-edit :applicationData="applicationData"></application-edit>
      <application-approval :applicationApproval="applicationApproval"></application-approval>
    </el-card>
  </div>
</template>

<script>
  import GlobalTips from "@/components/GlobalTips";
  import ApplicationEdit from "./ApplicationEdit";
  import ApplicationApproval from "./ApplicationApproval"

	export default {
    name: 'Application',
    components: {
      GlobalTips,
      ApplicationEdit,
      ApplicationApproval
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
        tableData: [
        	{
            id:"001",
        		time:"2020.12.24",
        		type:"建设类",
        		name:"学生管理项目",
            dept:"学工处",
            applicant:"DXD12张三",
            funds:"教务部",
            budget:"300,000",
            mode:"中标",
            apply:"详细",
            remark:"详细",
            append:"详细",
        	},
          {
            id:"002",
            time:"2020.12.24",
            type:"建设类",
            name:"学生管理项目",
            dept:"学工处",
            applicant:"DXD12张三",
            funds:"教务部",
            budget:"300,000",
            mode:"中标",
            apply:"详细",
            remark:"详细",
            append:"详细",
          },
          {
            id:"003",
            time:"2020.12.24",
            type:"建设类",
            name:"学生管理项目",
            dept:"学工处",
            applicant:"DXD12张三",
            funds:"教务部",
            budget:"300,000",
            mode:"中标",
            apply:"详细",
            remark:"详细",
            append:"详细",
          },
          {
            id:"004",
            time:"2020.12.24",
            type:"建设类",
            name:"学生管理项目",
            dept:"学工处",
            applicant:"DXD12张三",
            funds:"教务部",
            budget:"300,000",
            mode:"中标",
            apply:"详细",
            remark:"详细",
            append:"详细",
          },
          {
            id:"005",
            time:"2020.12.24",
            type:"建设类",
            name:"学生管理项目",
            dept:"学工处",
            applicant:"DXD12张三",
            funds:"教务部",
            budget:"300,000",
            mode:"中标",
            apply:"详细",
            remark:"详细",
            append:"详细",
          },
          {
            id:"006",
            time:"2020.12.24",
            type:"建设类",
            name:"学生管理项目",
            dept:"学工处",
            applicant:"DXD12张三",
            funds:"教务部",
            budget:"300,000",
            mode:"中标",
            apply:"详细",
            remark:"详细",
            append:"详细",
          },
        ],
        filters: [
	        {
	          value: '',
	          prop: 'name'
	        }
        ],
        total: 0, //总条数
        currentPage: 1, //当前页
        pageSize: 15, //每页显示条数
        // 新增申请
        applicationData:{
          dialog:false,
          title:"",
          id:","
        },
        // 审批状态
        applicationApproval: {
          dialog:false,
          title:"",
          id:","
        },
      }
    },
    computed: {
    },
    mounted(){
      
    },
    methods: {
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
        this.total = this.tableData.length;
        // this.MyAxios.post(this.globalUrl.baseURL + "/forklift/achievements/achievements_list", {
        //   page: this.currentPage,
        //   limit: this.pageSize,
        //   name: this.filters[0].value
        // }).then(data => {
        //   if (data) {
        //     if (data.code == 0) {
        //       _this.total = data.count;
        //       _this.tableData = data.data;
        //     } else {
        //       _this.$message.error("接口失败");
        //     }
        //   }
        // })
      },
      // 申请项目
      handleApply(){
        this.applicationData.dialog = true;
        this.applicationData.title = "项目申请";
        this.applicationData.id = "";
      },
      // 审批详情
      approvalDetail(index,row){
        this.applicationApproval.dialog = true;
        this.applicationApproval.title = "审批状态";
        this.applicationApproval.id = "";
      },
      // 项目详情
      applicationDetail(index,row){
        this.$router.push({
          path:"/project/application/detail",
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