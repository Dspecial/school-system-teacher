<template>
	<div class="user-container">
		<!-- 登录信息 -->
    <global-tips></global-tips>
    <!-- 款项信息列表 -->
    <el-card class="mt-3">
      <data-tables-server :data="tableData" layout="tool, table,pagination" :current-page="currentPage" :page-size="pageSize" :pagination-props="{ background: true, pageSizes: [15,30,45,60], total: total }" @query-change="loadData" :filters="filters" :table-props="tableProps">
        <div class="mb-3" slot="tool">
          <h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">款项信息列表</h4>
          <div class="d-flex align-items-center project_search_div">
          	<div class="d-flex align-items-center">
          		<el-input
    				    placeholder="请输入项目名称/创建人/部门"
    				    prefix-icon="el-icon-search"
    				    v-model="filters[0].value"
                clearable
                class="mr-3">
    				  </el-input>
              <el-select v-model="filters[1].value" placeholder="请选择类型" class="mr-3 w-100" clearable>
                <el-option label="项目" value="1"></el-option>
                <el-option label="维保" value="3"></el-option>
              </el-select>
              <el-date-picker
                placeholder="请选择项目年份"
                v-model="filters[2].value"
                type="year"
                class="mr-3"
                value-format="yyyy"
                clearable>
              </el-date-picker>
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
          </div>
        </div>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="name" label="项目名称"></el-table-column>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            {{scope.row.type == 1?'项目':'维保'}}
          </template>
        </el-table-column>
        <el-table-column prop="money" label="合同金额"></el-table-column>
        <el-table-column prop="year" label="年份"></el-table-column>
        <el-table-column prop="alrady_pay" label="已付金额"></el-table-column>
        <el-table-column prop="no_pay" label="未付金额"></el-table-column>
        <el-table-column prop="uname" label="创建人" width="100"></el-table-column>
        <el-table-column prop="depart_name" label="创建人所在部门" width="200"></el-table-column>
        <el-table-column prop="createtime" label="创建时间" width="150"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="150">
          <template slot-scope="scope">
            <span class="text-primary cursor-pointer mr-2" @click="goDetail(scope.$index,scope.row)">详情</span>
          </template>
        </el-table-column>
      </data-tables-server>
    </el-card>
	</div>
</template>

<script>
	import GlobalTips from "@/components/GlobalTips";
	export default {
		name: 'Payment',
		provide() {
      return {
        loadData: this.loadData
      }
    },
		components: {
			GlobalTips
		},
		data () {
			return {
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
	          prop: 'type'
	        },
          {
	          value: '',
	          prop: 'year'
	        },
          {
	          value: '',
	          prop: 'createtime'
	        }
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
        this.$api.paymentList({
          page:this.currentPage,
          limit:this.pageSize,
          keywords:this.filters[0].value,
          type:this.filters[1].value,
          year:this.filters[2].value,
          createtime:this.filters[3].value?this.filters[3].value.join(" - "):'',
        }).then(data=>{
          if(data.code == 0){
            this.total = data.count;
            this.tableData = data.data;
          }else{
            this.$message.error(data.msg);
          }
        });
      },
      // 操作们
      fun(index,row,sign){
        if(sign == '4'){ // 详情
          this.goDetail(index,row);
        }
      },

      // 详情
      goDetail(index,row){
        if(row.type == 1){
          this.$router.push({
            path:"/project/project/detail",
            query: {
              id: row.detail_id,
            }
          })
        }else if(row.type == 3){
          this.$router.push({
            path:"/project/maintenance/detail",
            query: {
              id: row.detail_id,
            }
          })
        }
      },
		},
	}
</script>

<style>

</style>