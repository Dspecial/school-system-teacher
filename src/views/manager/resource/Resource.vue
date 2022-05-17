<template>
  <div>
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <!-- 资源列表 -->
    <el-card>
      <data-tables-server :data="tableData" layout="tool, table,pagination" :current-page="currentPage" :page-size="pageSize" :pagination-props="{ background: true, pageSizes: [15,30,45,60], total: total }" 
      @query-change="loadData" :filters="filters" :table-props="tableProps" @expand-change="toggleRowExpansion">
        <div class="mb-3" slot="tool">
          <h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">资源列表</h4>
          <div class="d-flex align-items-center project_search_div">
          	<div class="d-flex align-items-center">
              <el-input
    				    placeholder="请输入项目名称/备注"
    				    prefix-icon="el-icon-search"
    				    v-model="filters[0].value"
                clearable
                class="mr-3">
    				  </el-input>
              <el-select v-model="filters[1].value" placeholder="请选择审核状态" class="mr-3 w-100" clearable>
                <el-option label="待确认" value="1"></el-option>
                <el-option label="待审核" value="2"></el-option>
                <el-option label="审核成功" value="3"></el-option>
                <el-option label="审核失败" value="4"></el-option>
                <el-option label="已回收" value="5"></el-option>
              </el-select>
              <el-date-picker
                v-model="filters[2].value"
                type="daterange"
                range-separator="至"
                start-placeholder="申请时间"
                end-placeholder="申请时间"
                align="right"
                value-format="yyyy-MM-dd"
                clearable
                class="mr-3">
              </el-date-picker>
              <el-date-picker
                v-model="filters[3].value"
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
              <el-button type="primary" @click="handleAdd()" v-if="$store.getters.getaddAction.title"><i class="el-icon-plus el-icon--left"></i>{{$store.getters.getaddAction.title}}</el-button>
            </div>
          </div>
        </div>
        <el-table-column prop="resource_list" label="" type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.resource_list" align="center">
              <el-table-column prop="name" label="资源名称"></el-table-column>
              <el-table-column prop="re_remark" label="资源备注"></el-table-column>
              <el-table-column prop="job_number" label="供应商"></el-table-column>
              <el-table-column fixed="right" label="操作" width="150" align="center">
                <template slot-scope="scope">
                  <span v-for="(action,index) in actions2" :key="index" @click="fun(scope.$index,scope.row,props.row,action.sign)" class="text-primary cursor-pointer mr-3">{{action.title}}</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
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
        <el-table-column prop="remark" label="备注">
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
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <span v-for="(action,index) in actions1" :key="index" @click="fun(scope.$index,scope.row,scope.row,action.sign)" class="text-primary cursor-pointer mr-3">{{action.title}}</span>
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
          'default-expand-all':false,
          'row-key':function(row){
            if(row.id){
              return row.id;
            }
          },
          'expand-row-keys':[],
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
        // 审批状态
        applicationApproval: {
          dialog:false,
          title:"",
          id:","
        },
        actions1:[],
        actions2:[],
      }
    },
    computed: {
    },
    watch:{

    },
    mounted(){
    },
    methods:{
      toggleRowExpansion(row,expandedRows){
        if(expandedRows.length == 0){ // 收起来
          this.tableProps['expand-row-keys'] = [];
        }else{ // 展开
          this.tableProps['expand-row-keys'] = [];
          this.tableProps['expand-row-keys'].push(row.id);
        }
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
        this.$api.resourceList({
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
            if(data.data.data.length > 0){
              this.tableProps['expand-row-keys'].push(data.data.data[0].id);
            }
            var actions_1 = new Array,actions_2 = new Array,actions_3 = new Array;
            this.$store.getters.getmoreAction.map((item,index)=>{
              if(item.sign == '4'){ // 详情
                actions_1.push(item);
              }if(item.sign == '4.1'){ // 详情
                actions_2.push(item);
              }else if (item.sign == '5.11'){ // 工单列表
                actions_3.push(item);
              }
            })
            // 父列表有 详情
            this.actions1 = [...actions_1];
            // 子列表有 详情 和 工单列表
            this.actions2 = [...actions_2,...actions_3];
          }else{
            this.$message.error(data.msg);
          }
        });
      },

      // 申请资源
      handleAdd(){
        this.$router.push({
          path:"/project/resource/edit",
        })
      },

       // 操作们
      fun(index,row,prow,sign){
        if(sign == '4'){ // 父列表详情
          this.detailResourceProject(index,row);
        }else if(sign == '4.1'){ // 子列表详情
          this.detailResource(index,row);
        }else if(sign == '5.11'){ // 工单列表
          this.goServiceList(index,row,prow);
        }
      },
      // 父列表资源详情
      detailResourceProject(index,row){
        this.$router.push({
          path:"/project/resource/p_detail",
          query: {
            id: row.id,
          }
        })
      },

      // 子列表资源详情
      detailResource(index,row){
        this.$router.push({
          path:"/project/resource/detail",
          query: {
            id: row.id,
          }
        })
      },

      // 子列表工单列表
      goServiceList(index,row,prow){
        this.$router.push({
          path:"/project/resource/serviceList",
          query: {
            id: row.id,
            project_id:prow.project_id,
          }
        })
      },
		},
  }
</script>

<style>

</style>