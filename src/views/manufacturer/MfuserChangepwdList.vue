<template>
  <el-dialog
    :title="pwdListData.title"
    :visible.sync="pwdListData.dialog"
    width="60%"
    @open="openEdit"
    @closed="closedEdit('pwdForm')"
    :before-close="handleClose"
  >
    <data-tables-server
      :data="tableData"
      layout="table,pagination"
      :current-page="currentPage"
      :page-size="pageSize"
      :pagination-props="{ background: true, pageSizes: [15, 30, 45, 60], total: total }"
      :table-props="tableProps"
    >
      <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
      <el-table-column prop="job_number" label="厂商名称" max-width="200"></el-table-column>
      <el-table-column prop="name" label="申请人"></el-table-column>
      <el-table-column prop="depart_name" label="申请人所在部门"></el-table-column>
      <el-table-column prop="set_pwd" label="设置的密码值"></el-table-column>
      <el-table-column prop="checkname" label="审核人姓名"></el-table-column>
      <el-table-column prop="status" label="审核状态" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">
            <i class="dot bg-warning mr-1"></i>
            待审核
          </span>
          <span v-if="scope.row.status == 2">
            <i class="dot bg-success mr-1"></i>
            审核成功
          </span>
          <span v-if="scope.row.status == 3">
            <i class="dot bg-danger mr-1"></i>
            审核不通过
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="createtime" label="申请时间" width="150"></el-table-column>
      <el-table-column prop="checktime" label="审核时间" width="150"></el-table-column>
    </data-tables-server>
  </el-dialog>
</template>

<script>
export default {
  props: ['pwdListData'],
  inject: ['loadData'],
  name: 'MfuserChangepwdList',
  data() {
    return {
      tableProps: {},
      total: 0, //总条数
      currentPage: 1, //当前页
      pageSize: 15, //每页显示条数
      tableData: [],
    };
  },
  components: {},
  mounted() {},
  methods: {
    // 自增序列
    indexMethod(index) {
      return ++index;
    },
    // dialog初始化
    openEdit() {
      var _this = this;
      this.$api
        .companyChangpwdList({
          id: this.pwdListData.id,
          page: this.currentPage,
          limit: this.pageSize,
        })
        .then(data => {
          if (data.code == 0) {
            this.total = data.count;
            this.tableData = data.data;
          } else {
            this.$message.error(data.msg);
          }
        });
    },
    // dialog关闭
    closedEdit(formName) {
      this.handleClose();
    },
    // 右上角x关闭
    handleClose() {
      this.pwdListData.dialog = false;
    },
  },
};
</script>

<style></style>
