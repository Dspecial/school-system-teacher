<template>
  <div class="page-container">
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <!-- 审核列表 -->
    <el-card>
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
          <h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">审核列表</h4>
          <div class="d-flex align-items-center project_search_div">
            <div class="d-flex align-items-center">
              <el-input
                placeholder="请输入项目编号/项目名称/项目类别/申请人/申请所在部门"
                prefix-icon="el-icon-search"
                v-model="filters[0].value"
                clearable
                class="mr-3"
              ></el-input>
              <el-date-picker
                v-model="filters[1].value"
                type="daterange"
                range-separator="至"
                start-placeholder="提交时间"
                end-placeholder="提交时间"
                align="right"
                value-format="yyyy-MM-dd"
                clearable
                class="mr-3"
              ></el-date-picker>
              <el-date-picker
                v-model="filters[2].value"
                type="daterange"
                range-separator="至"
                start-placeholder="审核时间"
                end-placeholder="审核时间"
                align="right"
                value-format="yyyy-MM-dd"
                clearable
              ></el-date-picker>
            </div>
          </div>
        </div>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="apply_number" width="200" label="项目编号"></el-table-column>
        <el-table-column prop="p_name" label="项目名称" width="210"></el-table-column>
        <el-table-column prop="cname" label="项目类别" width="180"></el-table-column>
        <el-table-column prop="projecttime" label="年份"></el-table-column>
        <el-table-column prop="check_state" label="审核状态" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.check_state == 1">
              <i class="dot bg-primary mr-1"></i>
              待审核
            </span>
            <span v-else-if="scope.row.check_state == 2">
              <i class="dot bg-success mr-1"></i>
              审核成功
            </span>
            <span v-else-if="scope.row.check_state == 3">
              <i class="dot bg-danger mr-1"></i>
              审核不通过
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="审核备注" width="150"></el-table-column>
        <el-table-column prop="pnname" label="流程名称" width="100"></el-table-column>
        <el-table-column prop="name" label="申请人姓名" width="100"></el-table-column>
        <el-table-column prop="depart_name" label="申请人所在部门" width="200"></el-table-column>
        <el-table-column prop="createtime" label="提交时间" width="150"></el-table-column>
        <el-table-column prop="checktime" label="审核时间" width="150"></el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <span
              v-for="(action, index) in $store.getters.getmoreAction"
              :key="index"
              @click="fun(scope.$index, scope.row, action.sign)"
              class="text-primary cursor-pointer mr-3"
            >
              {{ action.title }}
            </span>
          </template>
        </el-table-column>
      </data-tables-server>
    </el-card>
  </div>
</template>

<script>
import GlobalTips from '@/components/GlobalTips';

export default {
  name: 'CheckAlreadyList',
  components: {
    GlobalTips,
  },
  provide() {
    return {
      loadData: this.loadData,
    };
  },
  data() {
    return {
      tableProps: {},
      tableData: [],
      filters: [
        {
          value: '',
          prop: 'keywords',
        },
        {
          value: '',
          prop: 'createtime',
        },
        {
          value: '',
          prop: 'checktime',
        },
      ],
      total: 0, //总条数
      currentPage: 1, //当前页
      pageSize: 15, //每页显示条数
      actions1: [],
      actions2: [],
      actions3: [],
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
      let _this = this;
      if (queryInfo != null) {
        this.currentPage = queryInfo.page;
        this.pageSize = queryInfo.pageSize;
      }
      this.$api
        .checkAlreadyList({
          page: this.currentPage,
          limit: this.pageSize,
          keywords: this.filters[0].value,
          createtime: this.filters[1].value ? this.filters[1].value.join(' - ') : '',
          checktime: this.filters[2].value ? this.filters[2].value.join(' - ') : '',
        })
        .then(data => {
          if (data.code == 0) {
            this.total = data.count;
            this.tableData = data.data;
            var action_1 = new Array();
            var action_2 = new Array();
            var action_3 = new Array();
            this.$store.getters.getmoreAction.map((item, index) => {
              if (item.sign == 2) {
                // 编辑
                action_1.push(item);
              } else if (item.sign == 6) {
                // 审核
                action_2.push(item);
              } else if (item.sign == 4) {
                // 详情
                action_3.push(item);
              }
            });

            // 审核、编辑  只要不是check_state为2 3  都需要保留
            // 初审node_id=1、评审node_id=2、实施node_id=6、维保node_id=11应该都要编辑 即node_id = 12、10、13、14 没有编辑
            this.actions1 = [...action_3];
            this.actions2 = [...action_2, ...action_3];
            this.actions3 = [...action_1, ...action_2, ...action_3];
          } else {
            this.$message.error(data.msg);
          }
        });
    },

    // 操作们
    fun(index, row, sign) {
      if (sign == 2) {
        // 编辑
        this.checkEdit(index, row);
      } else if (sign == 6) {
        // 审核
        this.checkCheck(index, row);
      } else if (sign == 4) {
        // 详情
        this.goDetail(index, row);
      }
    },
    // 详情
    goDetail(index, row) {
      this.$router.push({
        path: '/check/checkAlreadyList/detail',
        query: {
          id: row.project_id,
        },
      });
    },
  },
};
</script>

<style></style>
