<template>
  <div>
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <!-- 列表 -->
    <el-card>
      <data-tables-server :data="tableData" layout="tool, table,pagination" :current-page="currentPage" :page-size="pageSize" :pagination-props="{ background: true, pageSizes: [15,30,45,60], total: total }" @query-change="loadData" :filters="filters" :table-props="tableProps">
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
                start-placeholder="创建时间"
                end-placeholder="创建时间"
                align="right"
                value-format="yyyy-MM-dd">
              </el-date-picker>
          	</div>
            <div class="ml-auto">
              <el-button type="primary" @click="handleAdd()" v-if="$store.getters.getaddAction.title"><i class="el-icon-plus el-icon--left"></i>{{$store.getters.getaddAction.title}}</el-button>
            </div>
          </div>
        </div>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="apply_number" width="250" label="项目编号"></el-table-column>
        <el-table-column prop="p_name" label="项目名称"></el-table-column>
        <el-table-column prop="projecttime" label="年份" width="80"></el-table-column>
        <el-table-column prop="apply_user_depart" label="所属部门" width="180"></el-table-column>
        <el-table-column prop="check_process.text" label="项目状态" width="220"></el-table-column>
        <el-table-column prop="createtime" label="创建时间" width="150"></el-table-column>
        <el-table-column prop="job_number" label="公司名称" width="200"></el-table-column>
        <el-table-column fixed="right" label="操作" width="250" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.is_commit == 1">
              <span v-for="(action,index) in actions1" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-3">{{action.title}}</span>
            </template>
            <template v-if="scope.row.is_commit == 2 || scope.row.is_commit == 3">
              <span v-for="(action,index) in actions2" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-3">{{action.title}}</span>
            </template>
            <template v-if="scope.row.is_commit == 4">
              <span v-for="(action,index) in actions3" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-3">{{action.title}}</span>
            </template>
            <template v-if="scope.row.is_commit == 5">
              <span v-for="(action,index) in actions4" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-3">{{action.title}}</span>
            </template>
            <template v-if="scope.row.is_commit == 6">
              <span v-for="(action,index) in actions5" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-3">{{action.title}}</span>
            </template>
            <template v-if="scope.row.is_commit == 7 || scope.row.is_commit == 8 || scope.row.is_commit == 9">
              <span v-for="(action,index) in actions6" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-3">{{action.title}}</span>
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
    name: 'Project',
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
        actions1:[],
        actions2:[],
        actions3:[],
        actions4:[],
        actions5:[],
        actions6:[],
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
            var actions_1 = new Array,actions_2 = new Array,actions_3 = new Array,actions_4 = new Array;
            var actions_5 = new Array,actions_6 = new Array,actions_7 = new Array,actions_8 = new Array;
            var actions_9 = new Array

            this.$store.getters.getmoreAction.map((item,index)=>{
              if(item.sign == 2){ // 编辑
                actions_1.push(item);
              }else if (item.sign == 3){ // 删除
                actions_2.push(item);
              }else if (item.sign == 4){ // 详情
                actions_3.push(item);
              }else if (item.sign == 5.1){ // 提交审核
                actions_4.push(item);
              }else if (item.sign == 5.2){ // 提交复审
                actions_5.push(item);
              }else if (item.sign == 5.3){ // 进入实施流程
                actions_6.push(item);
              }else if (item.sign == 5.4){ // 进入验收流程
                actions_7.push(item);
              }else if (item.sign == 5.5){ // 复审记录
                actions_8.push(item);
              }else if (item.sign == 9.2){ // 进度记录
                actions_9.push(item);
              }
            })
            // is_commit
            // 为1 就是 提交审核、编辑、删除、详情
            // 为2、3 提交复审、复审记录、详情
            // 为4 提交复审、复审记录、进入实施、详情  
            // 为5 进度记录、详情  
            // 为6 进度记录、进入验收、详情  
            // 为7、8、9就进入维保、详情
            this.actions1 = [...actions_1,...actions_2,...actions_4,...actions_3];
            this.actions2 = [...actions_5,...actions_8,...actions_3];
            this.actions3 = [...actions_5,...actions_8,...actions_6,...actions_3];
            this.actions4 = [...actions_9,...actions_3];
            this.actions5 = [...actions_9,...actions_7,...actions_3];
            this.actions6 = [...actions_3];

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

      // 操作们
      fun(index,row,sign){
        if(sign == 2){ // 编辑
          this.editProject(index,row);
        }else if(sign == 3){ // 删除
          this.handleDel(index,row);
        }else if(sign == 4){ // 详情
          this.goDetail(index,row);
        }else if(sign == 5.1){ // 提交审核
          this.handleCommit(index,row);
        }else if(sign == 5.2){ // 提交复审
          this.handleRecheck(index,row);
        }else if(sign == 5.3){ // 进入实施流程
          this.handleRunning(index,row);
        }else if(sign == 5.4){ // 进入验收流程
          this.handleAccept(index,row);
        }else if(sign == 5.5){ // 复审记录
          this.recheckList(index,row);
        }else if(sign == 9.2){ // 进度记录
          this.processList(index,row);
        }
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
      // 提交项目
      handleCommit(index,row){
        this.$confirm("此操作将提交该项目, 是否继续?", "提示", {
          type: 'warning'
        }).then(() => {
          this.$api.projectCommit({
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
      // 提交复审
      handleRecheck(index,row){
        this.$router.push({
          path:"/project/project/recheck",
          query: {
            id: row.id,
          }
        })
      },
      // 复审记录
      recheckList(index,row){
        this.$router.push({
          path:"/project/project/recheckList",
          query: {
            id: row.id,
          }
        })
      },
      // 进度记录
      processList(index,row){
        this.$router.push({
          path:"/project/project/processList",
          query: {
            id: row.id,
          }
        })
      },
      // 进入实施流程
      handleRunning(index,row){
        this.$confirm("此操作将进入实施流程, 是否继续?", "提示", {
          type: 'warning'
        }).then(() => {
          this.$api.projectRunning({
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

      // 进入验收流程
      handleAccept(index,row){
        this.$confirm("此操作将进入验收流程, 是否继续?", "提示", {
          type: 'warning'
        }).then(() => {
          this.$api.projectAccept({
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
          path:"/project/project/detail",
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