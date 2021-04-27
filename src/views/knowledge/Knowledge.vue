<template>
  <div>
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <!-- 列表 -->
    <el-card>
      <data-tables-server :data="tableData" layout="tool, table,pagination" :current-page="currentPage" :page-size="pageSize" 
			:pagination-props="{ background: true, pageSizes: [15,30,45,60], total: total }" @query-change="loadData" :filters="filters" :table-props="tableProps">
        <div class="mb-3" slot="tool">
          <h4 class="fs_16 font-weight-semibold m-0 text-000 mb-3">知识库列表</h4>
          <div class="d-flex align-items-center project_search_div">
          	<div class="d-flex align-items-center">
          		<el-input
    				    placeholder="请输入标题、内容"
    				    prefix-icon="el-icon-search"
    				    v-model="filters[0].value"
                class="mr-3">
    				  </el-input>
              <el-cascader
                v-model="filters[1].value"
                placeholder="请选择分类"
                :options="cateOptions"
                :props="cateProps"
                class="mr-3">
              </el-cascader>
              <el-date-picker
                v-model="filters[2].value"
                type="daterange"
                range-separator="至"
                start-placeholder="发送时间"
                end-placeholder="发送时间"
                align="right"
                value-format="yyyy-MM-dd">
              </el-date-picker>
          	</div>
          </div>
        </div>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="title" label="消息标题" width="300"></el-table-column>
        <el-table-column prop="desc" label="简介"></el-table-column>
        <el-table-column prop="parent_str" label="所属分类"></el-table-column>
				<el-table-column prop="createtime" label="发送时间"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <span class="text-primary cursor-pointer" @click="knowledgeDetail(scope.$index,scope.row)">查看详情</span>
          </template>
        </el-table-column>
      </data-tables-server>
    </el-card>
  </div>
</template>

<script>
  import GlobalTips from "@/components/GlobalTips";

	export default {
    name: 'Knowledge',
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
	          prop: 'createtime'
	        },
        ],
        total: 0, //总条数
        currentPage: 1, //当前页
        pageSize: 15, //每页显示条数
				cateOptions:[],
        cateProps:{
          value:"id",
          label:"cate_name",
          children:"children"
        },
      }
    },
    computed: {
    },
    mounted(){
      this.initCate();
    },
    methods:{
			// 自增序列
      indexMethod(index) { 
        return ++index;
      },
      // 获取分类列表
      initCate(){
        this.$api.knowledgeCate({}).then(data => {
          if(data.code == 0){
            this.cateOptions = data.data;
          }
        });
      },
      // 加载数据
      loadData(queryInfo) { 
        let _this = this;
        if (queryInfo != null) {
          this.currentPage = queryInfo.page;
          this.pageSize = queryInfo.pageSize;
        }
        this.$api.knowledgeList({
          page:this.currentPage,
          limit:this.pageSize,
          keywords:this.filters[0].value,
					cate_id:this.filters[1].value[this.filters[1].value.length - 1],
          createtime:this.filters[2].value?this.filters[2].value.join(" - "):'',
        }).then(data=>{
          if(data.code == 0){
            this.total = data.data.total;
            this.tableData = data.data.data;
          }else{
            this.$message.error(data.msg);
          }
        });
      },
      // 查看详情
      knowledgeDetail(index,row){
        this.$router.push({
          path:"/knowledge/knowledge/detail",
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