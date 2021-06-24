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
    				    placeholder="请输入项目编号/项目名称/类别名称"
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
              <el-date-picker
                v-model="filters[2].value"
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
        <el-table-column prop="apply_number" width="220" label="项目编号"></el-table-column>
        <el-table-column prop="p_name" label="项目名称" width="220"></el-table-column>
        <el-table-column prop="cname" label="类别名称" width="200"></el-table-column>
        <el-table-column prop="projecttime" label="年份"></el-table-column>
        <el-table-column prop="apply_user_depart" label="所属部门" width="160"></el-table-column>
        <el-table-column prop="check_process.text" label="项目状态" width="220"></el-table-column>
        <el-table-column prop="createtime" label="创建时间" width="150"></el-table-column>
        <el-table-column fixed="right" label="操作" width="290" align="center">
          <template slot-scope="scope">
            <!-- need_to_func_money等于1的时候，付款节点 -->
            <template v-if="scope.row.need_to_func_money == 1">
              <span v-for="(action,k) in actions0" :key="k+100" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
            </template>

            <template v-if="scope.row.is_commit == 0">
              <span v-for="(action,index) in actions1" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
            </template>
            <template v-if="scope.row.is_commit == 1">
              <span v-for="(action,index) in actions2" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
            </template>
            <template v-else-if="scope.row.is_commit == 3 || scope.row.is_commit == 4 || scope.row.is_commit == 5 || scope.row.is_commit == 6">
              <template v-if="scope.row.check_process.next_node_id == 6">
                <span v-for="(action,index) in actions4" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 12">
                <span v-for="(action,index) in actions5" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 10">
                <span v-for="(action,index) in actions6" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 11">
                <span v-for="(action,index) in actions7" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 13">
                <span v-for="(action,index) in actions8" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
              </template>
              <template v-else>
                <span v-for="(action,index) in actions3" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
              </template>
            </template>
            <template v-else-if="scope.row.is_commit == 7">
              <template v-if="scope.row.check_process.next_node_id == 6">
                <span v-for="(action,index) in actions23" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 12">
                <span v-for="(action,index) in actions9" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 10">
                <span v-for="(action,index) in actions10" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 11">
                <span v-for="(action,index) in actions11" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 13">
                <span v-for="(action,index) in actions12" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
              </template>
            </template>
            <template v-else-if="scope.row.is_commit == 8 || scope.row.is_commit == 9">
              <template v-if="scope.row.check_process.next_node_id == 12">
                <span v-for="(action,index) in actions9" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 10">
                <span v-for="(action,index) in actions10" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 11">
                <span v-for="(action,index) in actions11" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 13">
                <span v-for="(action,index) in actions12" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
              </template>
            </template>
            <template v-else-if="scope.row.is_commit == 10 || scope.row.is_commit == 11 || scope.row.is_commit == 12">
              <template v-if="scope.row.check_process.next_node_id == 10">
                <span v-for="(action,index) in actions14" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 11">
                <span v-for="(action,index) in actions15" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 13">
                <span v-for="(action,index) in actions16" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
              </template>
              <template v-else>
                <span v-for="(action,index) in actions13" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
              </template>
            </template>
            <template v-else-if="scope.row.is_commit == 13 || scope.row.is_commit == 14 || scope.row.is_commit == 15">
              <template v-if="scope.row.check_process.next_node_id == 11">
                <span v-for="(action,index) in actions17" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 13">
                <span v-for="(action,index) in actions18" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
              </template>
            </template>
            <template v-else-if="scope.row.is_commit == 16 || scope.row.is_commit == 17 || scope.row.is_commit == 18">
              <template v-if="scope.row.check_process.next_node_id == 13">
                <span v-for="(action,index) in actions20" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
              </template>
              <template v-else>
                <span v-for="(action,index) in actions19" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
              </template>
            </template>
            <template v-else-if="scope.row.is_commit == 19 || scope.row.is_commit == 20 || scope.row.is_commit == 21">
              <span v-for="(action,index) in actions21" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
            </template>

            <!-- is_need_service等于1的时候，工单列表 -->
            <template v-if="scope.row.is_need_service == 1">
              <span v-for="(action,k) in actions24" :key="k+300" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
            </template>
            
            <!-- is_commit不等于0的时候，每条数据都需要详情 -->
            <template v-if="scope.row.is_commit != 0">
              <span v-for="(action,j) in actions22" :key="j+200" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
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
        actions0:[],
        actions1:[],
        actions2:[],
        actions3:[],
        actions4:[],
        actions5:[],
        actions6:[],
        actions7:[],
        actions8:[],
        actions9:[],
        actions10:[],
        actions11:[],
        actions12:[],
        actions13:[],
        actions14:[],
        actions15:[],
        actions16:[],
        actions17:[],
        actions18:[],
        actions19:[],
        actions20:[],
        actions21:[],
        actions22:[],
        actions23:[],
        actions24:[],
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
          keywords:this.filters[0].value,
          projecttime:this.filters[1].value,
          createtime:this.filters[2].value?this.filters[2].value.join(" - "):'',
        }).then(data=>{
          if(data.code == 0){
            this.total = data.data.total;
            this.tableData = data.data.data;

            var actions_1 = new Array,actions_2 = new Array,actions_3 = new Array,actions_4 = new Array;
            var actions_5 = new Array,actions_6 = new Array,actions_7 = new Array,actions_8 = new Array;
            var actions_9 = new Array,actions_10 = new Array,actions_11 = new Array,actions_12 = new Array;
            var actions_13 = new Array,actions_14 = new Array;

            this.$store.getters.getmoreAction.map((item,index)=>{
              if(item.sign == '2'){ // 编辑
                actions_1.push(item);
              }else if (item.sign == '3'){ // 删除
                actions_2.push(item);
              }else if (item.sign == '4'){ // 详情
                actions_3.push(item);
              }else if (item.sign == '5.1'){ // 提交审核
                actions_4.push(item);
              }else if (item.sign == '5.2'){ // 提交复审
                actions_5.push(item);
              }else if (item.sign == '5.3'){ // 进入进度上传流程
                actions_6.push(item);
              }else if (item.sign == '5.4'){ // 进入验收流程
                actions_7.push(item);
              }else if (item.sign == '5.5'){ // 复审记录
                actions_8.push(item);
              }else if (item.sign == '5.6'){ // 进度记录
                actions_9.push(item);
              }else if (item.sign == '5.7'){ // 进入实施流程
                actions_10.push(item);
              }else if (item.sign == '5.8'){ // 项目维保
                actions_11.push(item);
              }else if (item.sign == '5.9'){ // 资源申请
                actions_12.push(item);
              }else if (item.sign == '5.10'){ // 付款节点
                actions_13.push(item);
              }else if (item.sign == '5.11'){ // 工单列表
                actions_14.push(item);
              }
            })

            /* 
              is_need_service=1
            */
            this.actions24 = [...actions_14];

            /* 
              need_to_func_money=1
            */
            this.actions0 = [...actions_13];
            
            /* 
              每个都有详情
              is_commit为0 表示完成，只有详情

              is_commit为1  提交审核、编辑、删除；

              is_commit为3、4、5、6 提交复审、复审记录
              is_commit为3、4、5、6 且 next_node_id为6  进入实施流程；
              is_commit为3、4、5、6 且 next_node_id为12 进入进度上传；
              is_commit为3、4、5、6 且 next_node_id为10 进入验收流程；
              is_commit为3、4、5、6 且 next_node_id为11 项目维保；
              is_commit为3、4、5、6 且 next_node_id为13  资源申请(这个暂时先不动);

              is_commit 等于7  next_node_Id为6的话  你加个进入实施呢
              
              is_commit为7、8、9 且 next_node_id为12  进入进度上传；
              is_commit为7、8、9 且 next_node_id为10 进入验收流程；
              is_commit为7、8、9 且 next_node_id为11 项目维保；
              is_commit为7、8、9 且 next_node_id为13 资源申请(这个暂时先不动);
            
              is_commit为10、11、12 进度记录
              is_commit为10、11、12 且 next_node_id为10 +进入验收流程；
              is_commit为10、11、12 且 next_node_id为11 +项目维保；
              is_commit为10、11、12 且 next_node_id为13 +资源申请(这个暂时先不动);

              is_commit为13、14、15 且 next_node_id为11 项目维保；
              is_commit为13、14、15 且 next_node_id为13 资源申请(这个暂时先不动);

              is_commit为16、17、18 项目维保
              is_commit为16、17、18 且 next_node_id为13 +资源申请(这个暂时先不动);

              is_commit为19、20、21 资源申请
            */
            // is_commit为0
            this.actions1 = [...actions_3];
            // is_commit为1
            this.actions2 = [...actions_1,...actions_2,...actions_4];
            // is_commit为3、4、5、6
            this.actions3 = [...actions_5,...actions_8];
            this.actions4 = [...this.actions3,...actions_10];
            this.actions5 = [...this.actions3,...actions_6];
            this.actions6 = [...this.actions3,...actions_7];
            this.actions7 = [...this.actions3,...actions_11];
            this.actions8 = [...this.actions3,...actions_12];
            // is_commit为7
            this.actions23 = [...actions_10];
            // is_commit为7、8、9
            this.actions9 = [...actions_6];
            this.actions10 = [...actions_7];
            this.actions11 = [...actions_11];
            this.actions12 = [...actions_12];
            // is_commit为10、11、12
            this.actions13 = [...actions_9];
            this.actions14 = [...this.actions13,...actions_7];
            this.actions15 = [...this.actions13,...actions_11];
            this.actions16 = [...this.actions13,...actions_12];
            // is_commit为13、14、15
            this.actions17 = [...actions_11];
            this.actions18 = [...actions_12];
            // is_commit为16、17、18
            this.actions19 = [...actions_11];  
            this.actions20 = [...this.actions19,...actions_12];
            // is_commit为19、20、21
            this.actions21 = [...actions_12];
            // 其他情况
            this.actions22 = [...actions_3];
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
        if(sign == '2'){ // 编辑
          this.editProject(index,row);
        }else if(sign == '3'){ // 删除
          this.handleDel(index,row);
        }else if(sign == '4'){ // 详情
          this.goDetail(index,row);
        }else if(sign == '5.1'){ // 提交审核
          this.handleCommit(index,row);
        }else if(sign == '5.2'){ // 提交复审
          this.handleRecheck(index,row);
        }else if(sign == '5.3'){ // 进入进度上传流程
          this.handleProcess(index,row)
        }else if(sign == '5.4'){ // 进入验收流程
          this.handleAccept(index,row);
        }else if(sign == '5.5'){ // 复审记录
          this.recheckList(index,row);
        }else if(sign == '5.6'){ // 进度记录
          this.processList(index,row);
        }else if(sign == '5.7'){ // 进入实施流程
          this.handleRunning(index,row);
        }else if(sign == '5.8'){ // 项目维保
          

        }else if(sign == '5.9'){ // 资源申请 
          
        }else if(sign == '5.10'){ // 付款节点 
          this.paymentNode(index,row);
        }else if(sign == '5.11'){ // 工单列表 
          this.goServiceList(index,row);
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
      // 提交审核
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
      // 进入进度上传流程
      handleProcess(index,row){
       this.$confirm("状态更改成功后，由企业进行进度上传，提交到相应部门审核！", "提示", {
          type: 'warning'
        }).then(() => {
          this.$api.projectProcess({
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
        this.$router.push({
          path:"/project/project/running",
          query: {
            id: row.id,
          }
        })
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
      // 付款节点
      paymentNode(index,row){
        this.$router.push({
          path:"/project/project/paymentNode",
          query: {
            id: row.id,
          }
        })
      },
      // 工单列表
      goServiceList(index,row){
        this.$router.push({
          path:"/project/project/serviceList",
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