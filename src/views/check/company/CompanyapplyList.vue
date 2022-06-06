<template>
	<div class="user-container">
		<!-- 登录信息 -->
    <global-tips></global-tips>
    <!-- 厂商密码申请修改 -->
    <el-card class="mt-3">
      <data-tables-server :data="tableData" layout="tool, table,pagination" :current-page="currentPage":page-size="pageSize" :pagination-props="{ background: true, pageSizes: [15,30,45,60], total: total }" @query-change="loadData" :filters="filters" :table-props="tableProps">
        <div class="mb-3" slot="tool">
          <h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">厂商密码申请修改</h4>
          <div class="d-flex align-items-center">
          	<div class="mr-auto d-flex align-items-center w-80">
              <el-input
                class="mr-3"
                placeholder="厂商名称/负责人姓名"
                prefix-icon="el-icon-search"
                v-model="filters[0].value"
                clearable>
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
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
				<el-table-column prop="job_number" label="厂商名称" width="200"></el-table-column>
				<el-table-column prop="name" label="申请人" width="100"></el-table-column>
				<el-table-column prop="apply_info" label="申请人信息"></el-table-column>
        <el-table-column prop="set_pwd" label="新密码"></el-table-column>
				<el-table-column prop="checkname" label="审核人姓名" width="100"></el-table-column>
        <el-table-column prop="status" label="审核状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1"><i class="dot bg-warning mr-1"></i>待审核</span>
            <span v-if="scope.row.status == 2"><i class="dot bg-success mr-1"></i>审核成功</span>
						<span v-if="scope.row.status == 3"><i class="dot bg-danger mr-1"></i>审核失败</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="申请备注" width="150">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.remark" placement="top" popper-class="my-tooltip">
              <span class="text-truncate d-block">{{scope.row.remark}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="check_remark" label="审核备注" width="150">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.check_remark" placement="top" popper-class="my-tooltip">
              <span class="text-truncate d-block">{{scope.row.check_remark}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="createtime" label="申请时间" width="150"></el-table-column>
        <el-table-column prop="checktime" label="审核时间" width="150"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150" >
          <template slot-scope="scope">
            <template v-if="scope.row.status != 2 && scope.row.status != 3">
              <span v-for="(action,index) in $store.getters.getmoreAction" :key="index" @click="fun(scope.$index,scope.row,action.sign)" class="text-primary cursor-pointer mr-2">{{action.title}}</span>
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
		name: 'ManufacturerUser',
		provide() {
      return {
        loadData: this.loadData
      }
    },
		components: {
			GlobalTips,
		},
		data () {
			return {
				tableProps: {},
        tableData: [],
        filters: [
	        {
	          value: '',
	          prop: 'name'
	        },
          {
            value: '',
            prop: 'status'
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
        this.$api.companyapplyList({
          page:this.currentPage,
          limit:this.pageSize,
          keywords:this.filters[0].value,
          status:this.filters[1].value,
          checktime:this.filters[2].value?this.filters[2].value.join(" - "):'',
        }).then(data =>{
          if(data.code == 0){
            this.total = data.data.count;
            this.tableData = data.data.data;
          }else{
            this.$message.error(data.msg);
          }
        });
      },

      // 操作们
      fun(index,row,sign){
        if(sign == 6){ // 审核
          this.acceptCheck(index,row);
        }
      },

      // 验证审核
      acceptCheck(index,row){
        this.$router.push({
          path:"/check/companyapplyList/check",
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