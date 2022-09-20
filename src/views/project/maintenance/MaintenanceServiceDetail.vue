<template>
  <div class="h-100">
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <Breadcrumb></Breadcrumb>
    <div class="mt-3 service-container2">
      <div class="d-flex h-100">
        <div class="left d-flex flex-column mr-3 h-100">
          <el-card class="h-100">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="fs_18 font-weight-normal mb-3">问题汇总</h6>
              <el-button type="primary" @click="handleAdd()" v-if="worksheetInfo.status != 3">
                <i class="el-icon-plus el-icon--left"></i>
                问题
              </el-button>
            </div>
            <data-tables-server :data="service_list" layout="table" :table-props="tableProps">
              <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
              <el-table-column prop="module_name" label="模块名称"></el-table-column>
              <el-table-column label="问题简述" width="200">
                <template slot-scope="scope">
                  <el-popover placement="top-start" title="问题简述" width="200" trigger="hover" :content="scope.row.question_title">
                    <span class="text-truncate" slot="reference">{{ scope.row.question_title }}</span>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="level" label="优先度">
                <template slot-scope="scope">
                  <span v-if="scope.row.level == 1">低</span>
                  <span v-else-if="scope.row.level == 2">中</span>
                  <span v-else-if="scope.row.level == 3">高</span>
                </template>
              </el-table-column>
              <el-table-column prop="discovery_date" label="发现日" width="100"></el-table-column>
              <el-table-column prop="discovery_name" label="发现人"></el-table-column>
              <el-table-column prop="is_resolve" label="是否解决">
                <template slot-scope="scope">
                  <span v-if="scope.row.is_resolve == 1">
                    <i class="dot bg-warning mr-1"></i>
                    否
                  </span>
                  <span v-else-if="scope.row.is_resolve == 2">
                    <i class="dot bg-success mr-1"></i>
                    是
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="resolve_predict_date" label="预计解决日" width="100"></el-table-column>
              <el-table-column prop="resolve_real_date" label="实际解决日" width="100"></el-table-column>
              <el-table-column prop="resolve_name" label="企业解决人" width="100"></el-table-column>
              <el-table-column prop="resolve_remark" label="备注"></el-table-column>
              <el-table-column prop="updatetime" label="更新日期" width="100"></el-table-column>
            </data-tables-server>
          </el-card>
        </div>
        <el-card class="right bg-white h-100">
          <h6 class="fs_18 font-weight-normal mb-3">工单信息</h6>
          <div class="mt-3 worksheetInfo">
            <div class="mb-3 text-truncate">
              <span class="opacity-60 mr-2">工单编号：</span>
              {{ worksheetInfo.question_number }}
            </div>
            <div class="mb-3 text-truncate">
              <span class="opacity-60 mr-2">标题：</span>
              {{ worksheetInfo.title }}
            </div>
            <div class="mb-3 text-truncate">
              <span class="opacity-60 mr-2">问题描述：</span>
              {{ worksheetInfo.question_content }}
            </div>
            <div class="mb-3 text-truncate">
              <span class="opacity-60 mr-2">优先级：</span>
              {{ worksheetInfo.level }}
            </div>
            <div class="mb-3 text-truncate">
              <span class="opacity-60 mr-2">工单状态：</span>
              <span v-if="worksheetInfo.status == 1">
                <i class="dot bg-warning mr-1"></i>
                待受理
              </span>
              <span v-else-if="worksheetInfo.status == 2">
                <i class="dot bg-primary mr-1"></i>
                已受理
              </span>
              <span v-else-if="worksheetInfo.status == 3">
                <i class="dot bg-success mr-1"></i>
                已完成
              </span>
            </div>
            <div class="mb-3 text-truncate">
              <span class="opacity-60 mr-2">提交时间：</span>
              {{ worksheetInfo.createtime }}
            </div>
            <div class="mb-3 text-truncate d-flex">
              <span class="opacity-60 mr-2">工单附件：</span>
              <div class="flex-wrap">
                <template v-for="(file, index) in worksheetInfo.school_files">
                  <div class="d-flex align-items-center justify-content-between mb-2" :key="index">
                    <div class="cursor-pointer view" @click="downloadview(file)">
                      <i class="el-icon-document mr-2"></i>
                      <span>{{ file.name }}</span>
                    </div>
                    <div class="opacity-80 ml-5 pl-5">
                      <!-- <i class="el-icon-view cursor-pointer view mr-3" @click="preview(file.path)"></i> -->
                      <i class="el-icon-download cursor-pointer view" @click="downloadview(file)"></i>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <div class="mb-3 text-truncate">
              <span class="opacity-60 mr-2">校方备注：</span>
              {{ worksheetInfo.school_remark }}
            </div>
            <div class="mb-3 text-truncate">
              <span class="opacity-60 mr-2">企业附件：</span>
              <div class="d-flex align-items-center justify-content-between mb-2" v-for="(file, index) in worksheetInfo.company_files" :key="index">
                <div class="cursor-pointer view" @click="downloadview(file)">
                  <i class="el-icon-document mr-2"></i>
                  <span>{{ file.name }}</span>
                </div>
                <div class="opacity-80 ml-5 pl-5">
                  <!-- <i class="el-icon-view cursor-pointer view mr-3" @click="preview(file.path)"></i> -->
                  <i class="el-icon-download cursor-pointer view" @click="downloadview(file)"></i>
                </div>
              </div>
            </div>
            <div class="mb-3 text-truncate">
              <span class="opacity-60 mr-2">企业备注：</span>
              {{ worksheetInfo.company_remark }}
            </div>
            <div class="text-center mt-5" v-if="worksheetInfo.status != 3">
              <el-button type="warning" size="small" @click="closeService">关闭工单</el-button>
            </div>
          </div>
        </el-card>
      </div>
      <maintenanceServiceDetail-add :serviceData="serviceData"></maintenanceServiceDetail-add>
    </div>
  </div>
</template>

<script>
import GlobalTips from '@/components/GlobalTips';
import Breadcrumb from '@/components/Breadcrumb';
import MaintenanceServiceDetailAdd from './MaintenanceServiceDetailAdd';

export default {
  name: 'ServiceDetail',
  components: {
    GlobalTips,
    Breadcrumb,
    MaintenanceServiceDetailAdd,
  },
  provide() {
    return {
      loadData: this.initDetail,
    };
  },
  data() {
    return {
      // 问题汇总
      service_list: [],
      tableProps: {
        'max-height': 500,
      },
      serviceData: {
        dialog: false,
        title: '',
        worksheetInfo: {},
      },
      // 工单信息
      worksheetInfo: {},
    };
  },
  created() {},
  mounted() {
    this.initDetail();
  },
  computed: {},
  updated() {},
  methods: {
    // 自增序列
    indexMethod(index) {
      return ++index;
    },

    // 获取工单详情信息
    initDetail() {
      this.$api
        .maintenance_serviceDetail({
          id: this.$route.query.id,
          function_type: 1,
        })
        .then(data => {
          if (data.code == 0) {
            this.service_list = data.data.service_list;
            this.worksheetInfo = data.data.info;
          }
        });
    },

    // 添加问题
    handleAdd() {
      this.serviceData.title = '添加问题';
      this.serviceData.dialog = true;
      this.serviceData.worksheetInfo = this.worksheetInfo;
    },

    // 预览文件
    preview(path) {
      this.$api
        .file_preview({
          path: path,
        })
        .then(data => {
          if (data.code == 0) {
            let a = document.createElement('a');
            a.style = 'display: none'; // 创建一个隐藏的a标签
            a.target = '_blank';
            a.href = data.data;
            document.body.appendChild(a);
            a.click();
          } else {
            this.$message.error(data.msg);
          }
        });
    },
    // 下载文件
    downloadview(file) {
      let a = document.createElement('a');
      a.style = 'display: none'; // 创建一个隐藏的a标签
      a.download = file.name;
      a.href = this.$globalUrl.baseURL + file.path;
      document.body.appendChild(a);
      a.click(); // 触发a标签的click事件
      document.body.removeChild(a);
    },

    // 工单关闭
    closeService() {
      this.$confirm('您将关闭此工单，关闭之后无法再提交工单信息, 是否继续?', '提示', {
        type: 'warning',
      })
        .then(() => {
          this.$api
            .maintenance_serviceDetail({
              id: this.$route.query.id,
              function_type: 3,
            })
            .then(data => {
              if (data.code == 0) {
                this.$message({
                  message: data.msg,
                  type: 'success',
                });
                this.initDetail();
              } else {
                this.$message.error(data.msg);
              }
            });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
