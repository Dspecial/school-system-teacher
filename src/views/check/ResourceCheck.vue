<template>
  <div class="page-container">
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <!-- 资源审核列表 -->
    <el-card>
      <data-tables-server :data="tableData" layout="tool, table,pagination" :current-page="currentPage" :page-size="pageSize" 
      :pagination-props="{ background: true, pageSizes: [15,30,45,60], total: total }" @query-change="loadData" :filters="filters" :table-props="tableProps">
        <div class="mb-3" slot="tool">
          <h4 class="fs_16 font-weight-semibold m-0 text-000 mb-3">资源审核列表</h4>
          <div class="d-flex align-items-center project_search_div">
            <div class="d-flex align-items-center">
              <el-input
                placeholder="请输入项目名称/资源名称/备注"
                prefix-icon="el-icon-search"
                v-model="filters[0].value"
                class="mr-3">
              </el-input>
              <el-select v-model="filters[1].value" placeholder="请选择审核状态" class="mr-3 w-100" clearable>
                <el-option label="待审核" value="1"></el-option>
                <el-option label="审核成功" value="2"></el-option>
                <el-option label="审核失败" value="3"></el-option>
              </el-select>
              <el-date-picker
                v-model="filters[2].value"
                type="daterange"
                range-separator="至"
                start-placeholder="申请时间"
                end-placeholder="申请时间"
                align="right"
                value-format="yyyy-MM-dd"
                class="mr-3">
              </el-date-picker>
              <el-date-picker
                v-model="filters[3].value"
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
        <el-table-column prop="p_name" label="项目名称"></el-table-column>
        <el-table-column prop="name" label="资源名称"></el-table-column>
        <el-table-column label="申请备注">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title="申请备注"
              width="200"
              trigger="hover"
              :content="scope.row.remark">
              <span class="text-truncate" slot="reference">{{scope.row.remark}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="审核状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1"><i class="dot bg-primary mr-1"></i>待审核</span>
            <span v-else-if="scope.row.status == 2"><i class="dot bg-success mr-1"></i>审核成功</span>
            <span v-else-if="scope.row.status == 3"><i class="dot bg-danger mr-1"></i>审核失败</span>
          </template>
        </el-table-column>
        <el-table-column label="资源备注">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title="资源备注"
              width="200"
              trigger="hover"
              :content="scope.row.re_remark">
              <span class="text-truncate" slot="reference">{{scope.row.re_remark}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="申请备注">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title="申请备注"
              width="200"
              trigger="hover"
              :content="scope.row.apply_remark">
              <span class="text-truncate" slot="reference">{{scope.row.apply_remark}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="审核备注">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              title="审核备注"
              width="200"
              trigger="hover"
              :content="scope.row.remark">
              <span class="text-truncate" slot="reference">{{scope.row.remark}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="applytime" label="申请时间"></el-table-column>
        <el-table-column prop="checktime" label="审核时间"></el-table-column>
        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.status == 1">
              <span v-for="(action,index) in actions1" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-3">{{action.title}}</span>
            </template>
            <template v-else>
              <span v-for="(action,index) in actions2" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-3">{{action.title}}</span>
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
    name: 'ResourceCheck',
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
	          prop: 'status'
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
        actions1:[],
        actions2:[],
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
        this.$api.resourceListCheck({
          page:this.currentPage,
          limit:this.pageSize,
          keywords:this.filters[0].value,
          status:this.filters[1].value,
          applytime:this.filters[2].value?this.filters[2].value.join(" - "):'',
          checktime:this.filters[3].value?this.filters[3].value.join(" - "):'',
        }).then(data=>{
          if(data.code == 0){
            this.total = data.data.total;
            this.tableData = data.data.data;

            var action_1 = new Array;
            var action_2 = new Array;
            this.$store.getters.getmoreAction.map((item,index)=>{
              if(item.sign == 6){ // 审核
                action_1.push(item);
              }else if(item.sign == 4){ // 详情
                action_2.push(item);
              }
              
              this.actions1 = [...action_1,...action_2];
              this.actions2 = [...action_2];
            });
          }else{
            this.$message.error(data.msg);
          }
        });
      },

      // 操作们
      fun(index,row,sign){
        if(sign == 6){ // 审核
          this.acceptCheck(index,row);
        }else if(sign == 4){ // 详情
          this.goDetail(index,row);
        }
      },

      // 审核
      resourceCheck(index,row){
        this.$router.push({
          path:"/check/resource/check",
          query: {
            id: row.id,
          }
        })
      },
      // 详情
      goDetail(index,row){
        this.$router.push({
          path:"/check/resource/detail",
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