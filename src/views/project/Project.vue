<template>
  <div>
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <!-- 列表 -->
    <el-card>
      <data-tables-server :data="tableData" layout="tool, table,pagination" :current-page="currentPage":page-size="pageSize" :pagination-props="{ background: true, pageSizes: [15,30,45,60], total: total }" @query-change="loadData" :filters="filters" :table-props="tableProps">
        <div class="mb-3" slot="tool">
          <h4 class="fs_16 font-weight-semibold m-0 text-000 mb-3">项目列表</h4>
          <div class="d-flex align-items-center project_search_div">
          	<div class="d-flex align-items-center">
          		<el-input
    				    placeholder="请输入项目编号"
    				    prefix-icon="el-icon-search"
    				    v-model="filters[0].value"
                class="mr-3">
    				  </el-input>
              <el-input
    				    placeholder="请输入项目名称/项目简介/公司名称"
    				    prefix-icon="el-icon-search"
    				    v-model="filters[1].value"
                class="mr-3">
    				  </el-input>
              <el-date-picker
                placeholder="请选择项目年份"
                v-model="filters[2].value"
                type="year"
                class="mr-3"
                value-format="yyyy">
              </el-date-picker>
              <el-date-picker
                v-model="filters[3].value"
                type="daterange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                align="right"
                value-format="yyyy-MM-dd">
              </el-date-picker>
          	</div>
            <div class="ml-auto">
              <el-button type="primary" @click="handleAdd()"><i class="el-icon-plus el-icon--left"></i>新增项目</el-button>
            </div>
          </div>
        </div>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="apply_number" label="项目编号"></el-table-column>
        <el-table-column prop="p_name" label="项目名称"></el-table-column>
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
        <el-table-column prop="apply_user_depart" label="所属部门"></el-table-column>
        <el-table-column prop="is_commit" label="是否提交" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.is_commit == 1"><i class="dot bg-warning mr-1"></i>初审待提交</span>
            <span v-else-if="scope.row.is_commit == 2"><i class="dot bg-primary-900 mr-1"></i>初审已提交</span>
            <span v-else-if="scope.row.is_commit == 3"><i class="dot bg-blue mr-1"></i>复审待提交</span>
            <span v-else-if="scope.row.is_commit == 4"><i class="dot bg-primary mr-1"></i>复审已提交</span>
            <span v-else-if="scope.row.is_commit == 5"><i class="dot bg-danger mr-1"></i>实施待提交</span>
            <span v-else-if="scope.row.is_commit == 6"><i class="dot bg-grey-300 mr-1"></i>实施已提交</span>
            <span v-else-if="scope.row.is_commit == 7"><i class="dot bg-cyan mr-1"></i>验收待提交</span>
            <span v-else-if="scope.row.is_commit == 8"><i class="dot bg-success mr-1"></i>验收已提交</span>
          </template>
        </el-table-column>
        <el-table-column prop="createtime" label="创建时间"></el-table-column>
        <el-table-column prop="job_number" label="公司名称"></el-table-column>
        <!-- <el-table-column label="审核状态" align="center" >
          <template slot-scope="scope">
            <span class="text-primary cursor-pointer" @click="approvalDetail(scope.$index,scope.row)">详情</span>
          </template>
        </el-table-column> -->
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <span class="text-primary cursor-pointer" @click="applicationDetail(scope.$index,scope.row)">查看</span>
            <span class="text-primary cursor-pointer ml-3" @click="editProject(scope.$index,scope.row)">编辑</span>
            <span class="text-primary cursor-pointer ml-3" @click="handleDel(scope.$index,scope.row)">删除</span>
          </template>
        </el-table-column>
      </data-tables-server>
      <application-approval :applicationApproval="applicationApproval"></application-approval>
    </el-card>
  </div>
</template>

<script>
  import GlobalTips from "@/components/GlobalTips";
  import ApplicationApproval from "./ApplicationApproval"

	export default {
    name: 'Application',
    components: {
      GlobalTips,
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
        tableData: [],
        filters: [
	        {
	          value: '',
	          prop: 'apply_number'
	        },
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
        this.$api.projectList({
          page:this.currentPage,
          limit:this.pageSize,
          apply_number:this.filters[0].value,
          keywords:this.filters[1].value,
          projecttime:this.filters[2].value,
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

      // 新增项目类别
      handleAdd(){
        this.$router.push({
          path:"/project/project/edit",
        })
      },

      // 编辑项目
      editProject(index,row){
        this.$router.push({
          path:"/project/project/edit",
          query: {
            id: row.id,
          }
        })
      },
      
      // 删除
      handleDel(index,row){
        this.$confirm("此操作将永久删除该项目类别, 是否继续?", "提示", {
          type: 'warning'
        }).then(() => {
          this.$api.projectDel({
            id:row.id
          }).then(data=>{ 
             if(data.code == 0){
                this.$message({
                  message: "删除项目成功!",
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