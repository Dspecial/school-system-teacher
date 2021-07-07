<template>
  <div>
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <!-- 列表 -->
    <el-card>
      <data-tables-server :data="tableData" layout="tool, table,pagination" :current-page="currentPage" :page-size="pageSize" 
			:pagination-props="{ background: true, pageSizes: [15,30,45,60], total: total }" @query-change="loadData" :filters="filters" :table-props="tableProps" ref="multipleTable" @selection-change="handleSelectionChange">
        <div class="mb-3" slot="tool">
          <h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">消息列表</h4>
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="未读" name="1"></el-tab-pane>
            <el-tab-pane label="已读" name="2"></el-tab-pane>
          </el-tabs>
          <div class="d-flex align-items-center project_search_div">
          	<div class="d-flex align-items-center">
          		<el-input
    				    placeholder="请输入标题、内容"
    				    prefix-icon="el-icon-search"
    				    v-model="filters[0].value"
                clearable
                class="mr-3">
    				  </el-input>
              <el-date-picker
                v-model="filters[1].value"
                type="daterange"
                range-separator="至"
                start-placeholder="发送时间"
                end-placeholder="发送时间"
                align="right"
                value-format="yyyy-MM-dd"
                clearable>
              </el-date-picker>
          	</div>
          </div>
        </div>
				<el-table-column type="selection" width="55" v-if="activeName == 1"></el-table-column>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="title" label="消息标题" width="200"></el-table-column>
        <el-table-column label="内容">
          <template slot-scope="scope" width="300">
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
        <el-table-column prop="is_read" label="是否已读" width="150">
					<template slot-scope="scope">
						<span v-if="scope.row.is_read == 1"><i class="dot bg-danger mr-1"></i>未读</span>
            <span v-else-if="scope.row.is_read == 2"><i class="dot bg-success mr-1"></i>已读</span>
          </template>
				</el-table-column>
				<el-table-column prop="createtime" label="发送时间" width="150"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <span class="text-primary cursor-pointer" @click="goAction(scope.$index,scope.row)">跳转</span>
          </template>
        </el-table-column>
      </data-tables-server>
			<el-button v-if="activeName == 1" type="primary" @click="batchRead()" plain class="mt-3"><i class="el-icon-reading el-icon--left"></i>标记为已读</el-button>
    </el-card>
  </div>
</template>

<script>
  import GlobalTips from "@/components/GlobalTips";

	export default {
    name: 'Notices',
    components: {
      GlobalTips,
    },
    data() {
      return {
        activeName:'1', // 默认未读
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
	          prop: 'createtime'
	        },
        ],
        total: 0, //总条数
        currentPage: 1, //当前页
        pageSize: 15, //每页显示条数
				multipleSelection:[],
      }
    },
    computed: {
    },
    mounted(){
      
    },
    methods:{
      handleClick(tab, event) {
        this.loadData();
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
        this.$api.noticeList({
          page:this.currentPage,
          limit:this.pageSize,
          is_read:this.activeName,
          keywords:this.filters[0].value,
          createtime:this.filters[1].value?this.filters[1].value.join(" - "):'',
        }).then(data=>{
          if(data.code == 0){
            this.total = data.data.total;
            this.tableData = data.data.data;
          }else{
            this.$message.error(data.msg);
          }
        });
      },
			// 多选
			handleSelectionChange(val){
				this.multipleSelection = val;
			},
			// 清空
			clearSelection() {
        this.$refs.multipleTable.$refs.elTable.clearSelection();
      },
			// 批量已读
			batchRead(){
				var _this = this;
        var arr = new Array;
        if (this.multipleSelection.length == 0) {
          this.$message.info('请至少选中一项!');
          return;
        } else {
          this.multipleSelection.forEach(item => arr.push(item.id))
        }
        this.$confirm('此操作将选中消息标记为已读, 是否继续?',"提示", {
          type: 'warning'
        }).then(() => {
          this.$api.noticeIsread({
            id: arr.join(","),
          }).then(data => {
            if (data.code === '0') {
              this.$message({
                message: '消息标记为已读!',
                type: 'success'
              });
              this.loadData();
            } else {
              this.$message.error(data.msg);
            }
          })
        }).catch(() => {
        });
			},
      // 跳转到详细的操作页面
      goAction(index,row){
        this.$router.push({
          path:row.to_url
        })
      }
		},
  }
</script>

<style>

</style>