<template>
  <div class="user-container">
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <Breadcrumb></Breadcrumb>
    <!-- 资源使用列表 -->
    <el-card class="mt-3">
      <data-tables-server :data="tableData" layout="tool, table,pagination" :current-page="currentPage" :page-size="pageSize" :pagination-props="{ background: true, pageSizes: [15,30,45,60], total: total }" @query-change="loadData" :filters="filters" :table-props="tableProps">
        <div class="mb-3" slot="tool">
          <h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">资源使用列表</h4>
          <div class="d-flex align-items-center">
            <div class="mr-auto d-flex align-items-center">
              <el-input
                placeholder="请输入项目名称/申请人姓名/申请人部门/资源备注/备注"
                prefix-icon="el-icon-search"
                v-model="filters[0].value"
                clearable
                class="mr-3">
              </el-input>
              <el-date-picker
                v-model="filters[1].value"
                type="daterange"
                range-separator="至"
                start-placeholder="申请时间"
                end-placeholder="申请时间"
                align="right"
                value-format="yyyy-MM-dd"
                class="mr-3"
                clearable>
              </el-date-picker>
              <el-date-picker
                v-model="filters[2].value"
                type="daterange"
                range-separator="至"
                start-placeholder="审核时间"
                end-placeholder="审核时间"
                align="right"
                value-format="yyyy-MM-dd"
                clearable>
              </el-date-picker>
            </div>
            <div class="ml-auto">
              <el-button type="primary" @click="handleAdd()" v-if="$store.getters.getaddAction.title" ><i class="el-icon-plus el-icon--left"></i>{{$store.getters.getaddAction.title}}</el-button>
            </div>
          </div>
        </div>
        <el-table-column type="index" :index="indexMethod" label="序号" width="55"></el-table-column>
        <el-table-column prop="p_name" label="项目名称"></el-table-column>
        <el-table-column prop="status" label="审核状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1"><i class="dot bg-primary mr-1"></i>待确认</span>
            <span v-else-if="scope.row.status == 2"><i class="dot bg-warning mr-1"></i>待审核</span>
            <span v-else-if="scope.row.status == 3"><i class="dot bg-success mr-1"></i>审核成功</span>
            <span v-else-if="scope.row.status == 4"><i class="dot bg-danger mr-1"></i>审核失败</span>
            <span v-else-if="scope.row.status == 5"><i class="dot bg-cyan mr-1"></i>已回收</span>
          </template>
        </el-table-column>
        <el-table-column prop="usname" label="审核人"></el-table-column>
        <el-table-column prop="name" label="申请人姓名"></el-table-column>
        <el-table-column prop="depart_name" label="申请人部门"></el-table-column>
        <el-table-column label="资源备注" width="200">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title="备注"
              width="200"
              trigger="hover"
              :content="scope.row.re_remark">
              <span class="text-truncate" slot="reference">{{scope.row.re_remark}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="150">
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
        <el-table-column prop="applytime" label="申请时间"></el-table-column>
        <el-table-column prop="checktime" label="审核时间"></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <template v-if="scope.row.status == 3">
              <span v-for="(action,index) in $store.getters.getmoreAction" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-3">{{action.title}}</span>
            </template>
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
    name: 'HosterResourceUselist',
    provide() {
      return {
        loadData: this.loadData
      }
    },
    components: {
      GlobalTips,
      Breadcrumb,
    },
    data () {
      return {
        isShow:false,
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
	          prop: 'applytime'
	        },
          {
	          value: '',
	          prop: 'checktime'
	        },
        ],
        total: 0, //总条数
        currentPage: 1, //当前页
        pageSize: 15, //每页显示条数
        useData:{
          dialog:false,
          title:"",
          id:"",
        },
      }
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
        this.$api.resource_useList({
          resource_id:this.$route.query.id,
          page:this.currentPage,
          limit:this.pageSize,
          keywords:this.filters[0].value,
          applytime:this.filters[1].value?this.filters[1].value.join(" - "):'',
          checktime:this.filters[2].value?this.filters[2].value.join(" - "):'',
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
        if(sign == '12'){ // 回收资源
          this.recoveryResource(index,row);
        }
      },

      // 回收资源
      recoveryResource(index,row){
        this.$confirm("确认之后账号私密信息将被清空, 是否继续?", "提示", {
          type: 'warning'
        }).then(() => {
          this.$api.resource_reover({
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

</style>