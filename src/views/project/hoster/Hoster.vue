<template>
  <div>
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <!-- 列表 -->
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
          <h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">承办列表</h4>
          <div class="d-flex align-items-center project_search_div">
            <div class="d-flex align-items-center">
              <el-input
                placeholder="请输入承办项目编号/承办项目名称/类别名称"
                prefix-icon="el-icon-search"
                v-model="filters[0].value"
                clearable
                class="mr-3"
              ></el-input>
              <el-date-picker
                placeholder="请选择承办项目年份"
                v-model="filters[1].value"
                type="year"
                class="mr-3"
                value-format="yyyy"
                clearable
              ></el-date-picker>
              <el-date-picker
                v-model="filters[2].value"
                type="daterange"
                range-separator="至"
                start-placeholder="创建时间"
                end-placeholder="创建时间"
                align="right"
                value-format="yyyy-MM-dd"
                clearable
              ></el-date-picker>
            </div>
            <div class="ml-auto">
              <el-button type="primary" @click="handleAdd()" v-if="$store.getters.getaddAction.title">
                <i class="el-icon-plus el-icon--left"></i>
                {{ $store.getters.getaddAction.title }}
              </el-button>
            </div>
          </div>
          <!-- 金额 -->
          <!-- <div class="allMoney mt-3 mb-3 pt-2 pb-2 pl-3 pr-3">
            <div class="d-flex align-items-center">
              <i class="el-icon-coin mr-2 text-success"></i>
              <span class="mr-5">总金额：{{ money_data.all_money}} 元</span>
              <span class="mr-5">已付款金额：{{ money_data.alread_pay }} 元</span>
              <span>未付款金额：{{ money_data.load_pay }} 元</span>
            </div>
          </div> -->
        </div>
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="apply_number" width="220" label="项目编号"></el-table-column>
        <el-table-column prop="p_name" label="项目名称" width="220"></el-table-column>
        <el-table-column prop="cname" label="类别名称" width="200"></el-table-column>
        <el-table-column prop="projecttime" label="年份"></el-table-column>
        <el-table-column prop="name" label="申请人"></el-table-column>
        <el-table-column prop="depart_name" label="申请人部门" width="200">
          <template slot-scope="scope">
            <el-popover placement="top-start" title="申请人部门" width="200" trigger="hover" :content="scope.row.depart_name">
              <span class="text-truncate" slot="reference">{{ scope.row.depart_name }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="check_process.text" label="项目状态" width="220"></el-table-column>
        <el-table-column prop="createtime" label="创建时间" width="150"></el-table-column>
        <el-table-column fixed="right" label="操作" width="420">
          <template slot-scope="scope">
            <template v-if="scope.row.is_commit == 0">
              <span
                v-for="(action, index) in actions1_1"
                :key="index"
                @click="fun(scope.$index, scope.row, action.sign)"
                class="text-primary cursor-pointer mr-2"
              >
                {{ action.title }}
              </span>
            </template>
            <template v-if="scope.row.is_commit == 1">
              <span
                v-for="(action, index) in actions2_1"
                :key="index"
                @click="fun(scope.$index, scope.row, action.sign)"
                class="text-primary cursor-pointer mr-2"
              >
                {{ action.title }}
              </span>
            </template>
            <template v-else-if="scope.row.is_commit == 3 || scope.row.is_commit == 4 || scope.row.is_commit == 6">
              <template v-if="scope.row.check_process.next_node_id == 6">
                <span
                  v-for="(action, index) in actions3_2"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 12">
                <span
                  v-for="(action, index) in actions3_3"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 10">
                <span
                  v-for="(action, index) in actions3_4"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 11">
                <span
                  v-for="(action, index) in actions3_5"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
              <template v-else>
                <span
                  v-for="(action, index) in actions3_1"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
            </template>
            <template v-else-if="scope.row.is_commit == 5">
              <template v-if="scope.row.check_process.next_node_id == 6">
                <span
                  v-for="(action, index) in actions3_7"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 12">
                <span
                  v-for="(action, index) in actions3_8"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 10">
                <span
                  v-for="(action, index) in actions3_9"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 11">
                <span
                  v-for="(action, index) in actions3_10"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
              <template v-else>
                <span
                  v-for="(action, index) in actions3_6"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
            </template>
            <template v-else-if="scope.row.is_commit == 7">
              <template>
                <span
                  v-for="(action, index) in actions4_1"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
            </template>
            <template v-else-if="scope.row.is_commit == 9">
              <template v-if="scope.row.check_process.next_node_id == 12">
                <span
                  v-for="(action, index) in actions5_2"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 10">
                <span
                  v-for="(action, index) in actions5_3"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 11">
                <span
                  v-for="(action, index) in actions5_4"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
              <template v-else>
                <span
                  v-for="(action, index) in actions5_1"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
            </template>
            <template v-else-if="scope.row.is_commit == 10 || scope.row.is_commit == 11 || scope.row.is_commit == 12">
              <template v-if="scope.row.check_process.next_node_id == 10">
                <span
                  v-for="(action, index) in actions6_2"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 11">
                <span
                  v-for="(action, index) in actions6_3"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
              <template v-else>
                <span
                  v-for="(action, index) in actions6_1"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
            </template>
            <template v-else-if="scope.row.is_commit == 13">
              <template v-if="scope.row.check_process.next_node_id == 10">
                <span
                  v-for="(action, index) in actions7_2"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 11">
                <span
                  v-for="(action, index) in actions7_4"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
              <template v-else>
                <span
                  v-for="(action, index) in actions7_1"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
            </template>
            <template v-else-if="scope.row.is_commit == 14">
              <template v-if="scope.row.check_process.next_node_id == 10">
                <span
                  v-for="(action, index) in actions7_3"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
              <template v-else-if="scope.row.check_process.next_node_id == 11">
                <span
                  v-for="(action, index) in actions7_4"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
              <template v-else>
                <span
                  v-for="(action, index) in actions7_1"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
            </template>
            <template v-else-if="scope.row.is_commit == 15">
              <template v-if="scope.row.check_process.next_node_id == 11">
                <span
                  v-for="(action, index) in actions8_1"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
            </template>
            <template v-else-if="scope.row.is_commit == 16 || scope.row.is_commit == 17 || scope.row.is_commit == 18">
              <template>
                <span
                  v-for="(action, index) in actions9_1"
                  :key="index"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
            </template>

            <!-- is_need_service等于1的时候且is_commit = 9,13,14,15,16,17,18,21,0，工单列表 -->
            <template v-if="scope.row.is_need_service == 1">
              <template
                v-if="
                  scope.row.is_commit == 9 ||
                    scope.row.is_commit == 13 ||
                    scope.row.is_commit == 14 ||
                    scope.row.is_commit == 15 ||
                    scope.row.is_commit == 16 ||
                    scope.row.is_commit == 17 ||
                    scope.row.is_commit == 18 ||
                    scope.row.is_commit == 21 ||
                    scope.row.is_commit == 0
                "
              >
                <span
                  v-for="(action, k) in actions12_1"
                  :key="k + 100"
                  @click="fun(scope.$index, scope.row, action.sign)"
                  class="text-primary cursor-pointer mr-2"
                >
                  {{ action.title }}
                </span>
              </template>
            </template>

            <!-- need_to_func_money等于1的时候，付款节点 -->
            <template v-if="scope.row.need_to_func_money == 1">
              <span
                v-for="(action, k) in actions13_1"
                :key="k + 200"
                @click="fun(scope.$index, scope.row, action.sign)"
                class="text-primary cursor-pointer mr-2"
              >
                {{ action.title }}
              </span>
            </template>

            <!-- need_to_resource_apply等于1的时候，申请资源 -->
            <template v-if="scope.row.need_to_resource_apply == 1">
              <span
                v-for="(action, k) in actions14_1"
                :key="k + 300"
                @click="fun(scope.$index, scope.row, action.sign)"
                class="text-primary cursor-pointer mr-2"
              >
                {{ action.title }}
              </span>
            </template>

            <!-- is_commit不等于0的时候，每条数据都需要详情 -->
            <template v-if="scope.row.is_commit != 0">
              <span
                v-for="(action, j) in actions10_1"
                :key="j + 400"
                @click="fun(scope.$index, scope.row, action.sign)"
                class="text-primary cursor-pointer mr-2"
              >
                {{ action.title }}
              </span>
            </template>
          </template>
        </el-table-column>
      </data-tables-server>
    </el-card>
    <!-- 提交评审弹窗 -->

    <el-dialog title="确认提交评审" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div class="d-flex align-items-center">
        <i class="el-icon-info text-warning fs_30"></i>
        <span class="ml-2">是否需要进行评审提交，不需要则跳过此流程。</span>
      </div>
      <span slot="footer" class="text-right">
        <el-button @click="skipRecheck(rowRecheck)">跳 过</el-button>
        <el-button type="primary" @click="confirmRecheck(rowRecheck)">提交评审</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import GlobalTips from '@/components/GlobalTips';
export default {
  name: 'Project',
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
      money_data: {
        all_money: '',
        alread_pay: '',
        load_pay: '',
      },
      tableProps: {},
      tableData: [],
      filters: [
        {
          value: '',
          prop: 'keywords',
        },
        {
          value: '',
          prop: 'projecttime',
        },
        {
          value: '',
          prop: 'createtime',
        },
      ],
      total: 0, //总条数
      currentPage: 1, //当前页
      pageSize: 15, //每页显示条数
      // 审批状态
      applicationApproval: {
        dialog: false,
        title: '',
        id: ',',
      },
      dialogVisible: false,
      rowRecheck: {},
      actions1_1: [],
      actions2_1: [],
      actions3_1: [],
      actions3_2: [],
      actions3_3: [],
      actions3_4: [],
      actions3_5: [],
      actions4_1: [],
      actions5_1: [],
      actions5_2: [],
      actions5_3: [],
      actions5_4: [],
      actions6_1: [],
      actions6_2: [],
      actions6_3: [],
      actions7_1: [],
      actions7_2: [],
      actions7_3: [],
      actions7_4: [],
      actions8_1: [],
      actions9_1: [],
      actions10_1: [],
      actions12_1: [],
      actions13_1: [],
      actions14_1: [],
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
        .hosterList({
          page: this.currentPage,
          limit: this.pageSize,
          keywords: this.filters[0].value,
          projecttime: this.filters[1].value,
          createtime: this.filters[2].value ? this.filters[2].value.join(' - ') : '',
        })
        .then(data => {
          if (data.code == 0) {
            this.total = data.data.total;
            this.tableData = data.data.data;

            var actions_1 = new Array(),
              actions_2 = new Array(),
              actions_3 = new Array(),
              actions_4 = new Array();
            var actions_5 = new Array(),
              actions_6 = new Array(),
              actions_7 = new Array(),
              actions_8 = new Array();
            var actions_9 = new Array(),
              actions_10 = new Array(),
              actions_11 = new Array(),
              actions_12 = new Array();
            var actions_13 = new Array(),
              actions_14 = new Array(),
              actions_15 = new Array();

            this.$store.getters.getmoreAction.map((item, index) => {
              if (item.sign == '2') {
                // 编辑
                actions_1.push(item);
              } else if (item.sign == '3') {
                // 删除
                actions_2.push(item);
              } else if (item.sign == '4') {
                // 详情
                actions_3.push(item);
              } else if (item.sign == '5.1') {
                // 提交审核
                actions_4.push(item);
              } else if (item.sign == '5.2') {
                // 提交评审
                actions_5.push(item);
              } else if (item.sign == '5.3') {
                // 进入进度上传流程
                actions_6.push(item);
              } else if (item.sign == '5.4') {
                // 进入验收流程
                actions_7.push(item);
              } else if (item.sign == '5.5') {
                // 评审记录
                actions_8.push(item);
              } else if (item.sign == '5.6') {
                // 进度记录
                actions_9.push(item);
              } else if (item.sign == '5.7') {
                // 进入实施流程
                actions_10.push(item);
              } else if (item.sign == '5.8') {
                // 项目维保
                actions_11.push(item);
              } else if (item.sign == '5.9') {
                // 资源申请
                actions_12.push(item);
              } else if (item.sign == '5.10') {
                // 付款节点
                actions_13.push(item);
              } else if (item.sign == '5.11') {
                // 工单列表
                actions_14.push(item);
              }
            });

            /* 
              每个都有详情
              01. is_commit为0 表示完成，只有详情

              02. is_commit为1  提交审核、编辑、删除；

              31. is_commit为3、4、6 提交评审、评审记录
              32. is_commit为3、4、6 且 next_node_id为6  进入实施流程；
              33. is_commit为3、4、6 且 next_node_id为12 进入进度上传；
              34. is_commit为3、4、6 且 next_node_id为10 进入验收流程；
              35. is_commit为3、4、6 且 next_node_id为11 项目维保；

              31_1. is_commit为5 评审记录
              32_1. is_commit为5 且 next_node_id为6  进入实施流程；
              33_1. is_commit为5 且 next_node_id为12 进入进度上传；
              34_1. is_commit为5 且 next_node_id为10 进入验收流程；
              35_1. is_commit为5 且 next_node_id为11 项目维保；

              04. is_commit 等于7、8  进入实施流程

              51. is_commit为9 进度记录；
              52. is_commit为9 且 next_node_id为12 +进入进度上传；
              53. is_commit为9 且 next_node_id为10 +进入验收流程；
              54. is_commit为9 且 next_node_id为11 +项目维保；
            
              // 61. is_commit为10、11、12 进度记录
              // 62. is_commit为10、11、12 且 next_node_id为10 +进入验收流程；
              // 63. is_commit为10、11、12 且 next_node_id为11 +项目维保；

              71. is_commit为13、14 进度记录；
              72. is_commit为13 且 next_node_id为10 +进入进度上传 +进入验收流程；
              73. is_commit为14 且 next_node_id为10 +进入验收流程；
              74. is_commit为13、14 且 next_node_id为11 +进入验收流程 +项目维保；

              81. is_commit为15 且 next_node_id为11 项目维保

              91. is_commit为16、17、18 项目维保

              10. 其他情况

              12. is_need_service=1 工单列表

              13. need_to_func_money=1 付款节点

              14. need_to_resource_apply=1 申请资源
            */

            // is_commit为0
            this.actions1_1 = [...actions_3];
            // is_commit为1
            this.actions2_1 = [...actions_1, ...actions_2, ...actions_4];
            // is_commit为3、4、5、6
            this.actions3_1 = [...actions_5, ...actions_8];
            this.actions3_2 = [...this.actions3_1, ...actions_10];
            this.actions3_3 = [...this.actions3_1, ...actions_6];
            this.actions3_4 = [...this.actions3_1, ...actions_7];
            this.actions3_5 = [...this.actions3_1, ...actions_11];

            this.actions3_6 = [...actions_8];
            this.actions3_7 = [...this.actions3_6, ...actions_10];
            this.actions3_8 = [...this.actions3_6, ...actions_6];
            this.actions3_9 = [...this.actions3_6, ...actions_7];
            this.actions3_10 = [...this.actions3_6, ...actions_11];

            // is_commit为7
            this.actions4_1 = [...actions_10];
            // is_commit为9
            this.actions5_1 = [...actions_9];
            this.actions5_2 = [...this.actions5_1, ...actions_6];
            this.actions5_3 = [...this.actions5_1, ...actions_7];
            this.actions5_4 = [...this.actions5_1, ...actions_11];
            // is_commit为10、11、12
            this.actions6_1 = [...actions_9];
            this.actions6_2 = [...this.actions6_1, ...actions_7];
            this.actions6_3 = [...this.actions6_1, ...actions_11];
            // is_commit为13、14
            this.actions7_1 = [...actions_9];
            this.actions7_2 = [...this.actions7_1, ...actions_6, ...actions_7];
            this.actions7_3 = [...this.actions7_1, ...actions_7];
            this.actions7_4 = [...this.actions7_1, ...actions_7, ...actions_11];
            // is_commit为15
            this.actions8_1 = [...actions_11];
            // is_commit为16、17、18
            this.actions9_1 = [...actions_11];

            // 其他情况
            this.actions10_1 = [...actions_3];

            // is_need_service=1 工单列表
            this.actions12_1 = [...actions_14];

            // need_to_func_money=1 付款节点
            this.actions13_1 = [...actions_13];

            // need_to_resource_apply=1 申请资源
            this.actions14_1 = [...actions_12];

            this.money_data = data.money_data;
          } else {
            this.$message.error(data.msg);
          }
        });
    },

    // 新增项目类别
    handleAdd() {
      this.$router.push({
        path: '/project/hoster/edit',
      });
    },

    // 操作们
    fun(index, row, sign) {
      if (sign == '2') {
        // 编辑
        this.editProject(index, row);
      } else if (sign == '3') {
        // 删除
        this.handleDel(index, row);
      } else if (sign == '4') {
        // 详情
        this.goDetail(index, row);
      } else if (sign == '5.1') {
        // 提交审核
        this.handleCommit(index, row);
      } else if (sign == '5.2') {
        // 提交评审
        this.handleRecheck(index, row);
      } else if (sign == '5.3') {
        // 进入进度上传流程
        this.handleProcess(index, row);
      } else if (sign == '5.4') {
        // 进入验收流程
        this.handleAccept(index, row);
      } else if (sign == '5.5') {
        // 评审记录
        this.recheckList(index, row);
      } else if (sign == '5.6') {
        // 进度记录
        this.processList(index, row);
      } else if (sign == '5.7') {
        // 进入实施流程
        this.handleRunning(index, row);
      } else if (sign == '5.8') {
        // 项目维保
        this.handleMaintenance(index, row);
      } else if (sign == '5.9') {
        // 资源申请
        this.handleResourceApply(index, row);
      } else if (sign == '5.10') {
        // 付款节点
        this.paymentNode(index, row);
      } else if (sign == '5.11') {
        // 工单列表
        this.goServiceList(index, row);
      }
    },

    // 编辑项目
    editProject(index, row) {
      this.$router.push({
        path: '/project/hoster/edit',
        query: {
          id: row.id,
        },
      });
    },
    // 删除
    handleDel(index, row) {
      this.$confirm('此操作将永久删除该承办项目, 是否继续?', '提示', {
        type: 'warning',
      })
        .then(() => {
          this.$api
            .hosterDel({
              id: row.id,
            })
            .then(data => {
              if (data.code == 0) {
                this.$message({
                  message: data.msg,
                  type: 'success',
                });
                this.loadData();
              } else {
                this.$message.error(data.msg);
              }
            });
        })
        .catch(() => {});
    },
    // 提交审核
    handleCommit(index, row) {
      this.$confirm('此操作将提交该承办项目, 是否继续?', '提示', {
        type: 'warning',
        confirmButtonText: '提交',
      })
        .then(() => {
          this.$api
            .hosterCommit({
              id: row.id,
            })
            .then(data => {
              if (data.code == 0) {
                this.$message({
                  message: data.msg,
                  type: 'success',
                });
                this.loadData();
              } else {
                this.$message.error(data.msg);
              }
            });
        })
        .catch(() => {});
    },
    // 提交评审
    handleRecheck(index, row) {
      this.dialogVisible = true;
      this.rowRecheck = row;
    },
    // 取消提交审核
    handleClose() {
      this.dialogVisible = false;
    },
    // 跳过提交审核
    skipRecheck(row) {
      this.$api
        .hosterRecheck_skip({
          id: row.id,
        })
        .then(data => {
          if (data.code == 0) {
            this.$message({
              message: data.msg,
              type: 'success',
            });
            this.handleClose();
            this.loadData();
          } else {
            this.$message.error(data.msg);
          }
        });
    },
    // 确认提交审核
    confirmRecheck(row) {
      this.$router.push({
        path: '/project/hoster/recheck',
        query: {
          id: row.id,
        },
      });
    },
    // 进入进度上传流程
    handleProcess(index, row) {
      this.$confirm('状态更改成功后，由企业进行进度上传，提交到相应部门审核！', '提示', {
        type: 'warning',
      })
        .then(() => {
          this.$api
            .hosterProcess({
              id: row.id,
            })
            .then(data => {
              if (data.code == 0) {
                this.$message({
                  message: data.msg,
                  type: 'success',
                });
                this.loadData();
              } else {
                this.$message.error(data.msg);
              }
            });
        })
        .catch(() => {});
    },
    // 评审记录
    recheckList(index, row) {
      this.$router.push({
        path: '/project/hoster/recheckList',
        query: {
          id: row.id,
        },
      });
    },
    // 进度记录
    processList(index, row) {
      this.$router.push({
        path: '/project/hoster/processList',
        query: {
          id: row.id,
        },
      });
    },
    // 进入实施流程
    handleRunning(index, row) {
      this.$router.push({
        path: '/project/hoster/running',
        query: {
          id: row.id,
        },
      });
    },
    // 进入验收流程
    handleAccept(index, row) {
      this.$router.push({
        path: '/project/hoster/accept',
        query: {
          id: row.id,
        },
      });

      // this.$confirm("此操作将进入验收流程, 是否继续?", "提示", {
      //   type: 'warning'
      // }).then(() => {
      //   this.$api.hosterAccept({
      //     id:row.id
      //   }).then(data=>{
      //      if(data.code == 0){
      //         this.$message({
      //           message: data.msg,
      //           type: 'success'
      //         });
      //         this.loadData();
      //      }else{
      //        this.$message.error(data.msg);
      //      }
      //   })
      // }).catch(() => {

      // });
    },

    // 进入承办项目维保
    handleMaintenance(index, row) {
      this.$router.push({
        path: '/project/hoster/maintenance',
        query: {
          id: row.id,
        },
      });
    },

    // 承办项目详情
    goDetail(index, row) {
      this.$router.push({
        path: '/project/hoster/detail',
        query: {
          id: row.id,
        },
      });
    },
    // 付款节点
    paymentNode(index, row) {
      this.$router.push({
        path: '/project/hoster/paymentNode',
        query: {
          id: row.id,
        },
      });
    },
    // 工单列表
    goServiceList(index, row) {
      this.$router.push({
        path: '/project/hoster/serviceList',
        query: {
          id: row.id,
        },
      });
    },

    // 申请资源
    handleResourceApply(index, row) {
      this.$router.push({
        path: '/project/hoster/applyResource',
        query: {
          id: row.id,
        },
      });
    },
  },
};
</script>

<style></style>
