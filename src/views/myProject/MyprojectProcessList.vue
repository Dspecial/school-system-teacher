<template>
  <div>
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <Breadcrumb></Breadcrumb>
    <!-- 进度记录 -->
    <el-card class="mt-3 bg-white">
      <data-tables-server
        :data="tableData"
        layout="tool, table,pagination"
        :current-page="currentPage"
        :page-size="pageSize"
        :pagination-props="{ background: true, pageSizes: [15, 30, 45, 60], total: total }"
        @query-change="loadData"
        :filters="filters"
        :table-props="tableProps"
      >
        <div class="mb-3" slot="tool">
          <h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">进度记录</h4>
        </div>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="title" label="进度标题"></el-table-column>
        <el-table-column prop="process_number" label="上传编号"></el-table-column>
        <el-table-column prop="status" label="审核状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">
              <i class="dot bg-warning mr-1"></i>
              待审核
            </span>
            <span v-else-if="scope.row.status == 2">
              <i class="dot bg-primary-900 mr-1"></i>
              审核成功
            </span>
            <span v-else-if="scope.row.status == 3">
              <i class="dot bg-success mr-1"></i>
              审核不通过
            </span>
          </template>
        </el-table-column>
        <el-table-column label="进度内容">
          <template slot-scope="scope">
            <el-popover placement="top-start" title="进度内容" width="200" trigger="hover" :content="scope.row.content">
              <span class="text-truncate" slot="reference">{{ scope.row.content }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="createtime" label="创建时间"></el-table-column>
        <el-table-column prop="checktime" label="审核时间"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <span class="text-primary cursor-pointer" @click="listDetail(scope.$index, scope.row)">详情</span>
          </template>
        </el-table-column>
      </data-tables-server>
    </el-card>
  </div>
</template>

<script>
import GlobalTips from '@/components/GlobalTips';
import Breadcrumb from '@/components/Breadcrumb';

export default {
  name: 'MyprojectProcessList',
  components: {
    GlobalTips,
    Breadcrumb,
  },
  data() {
    return {
      projectId: '',
      tableProps: {},
      tableData: [],
      filters: [
        {
          value: '',
          prop: 'keywords',
        },
      ],
      total: 0, //总条数
      currentPage: 1, //当前页
      pageSize: 15, //每页显示条数
      dialogTableVisible: false,
    };
  },
  computed: {},
  mounted() {},
  methods: {
    // 自增序列
    indexMethod(index) {
      return ++index;
    },
    // 加载数据
    loadData(queryInfo) {
      this.projectId = this.$route.query.id;
      if (queryInfo != null) {
        this.currentPage = queryInfo.page;
        this.pageSize = queryInfo.pageSize;
      }
      this.$api
        .my_project_process_list({
          page: this.currentPage,
          limit: this.pageSize,
          project_id: this.projectId,
        })
        .then(data => {
          if (data.code == 0) {
            this.total = data.data.total;
            this.tableData = data.data.data;
          } else {
            this.$message.error(data.msg);
          }
        });
    },
    // 查看进度详情
    listDetail(index, row) {
      this.$router.push({
        path: '/company/myProject/processDetail',
        query: {
          id: row.id,
        },
      });
    },
  },
};
</script>

<style></style>
