<template>
  <div class="application_detail">
    <Breadcrumb></Breadcrumb>
    <el-row class="mt-3" :gutter="20" type="flex">
      <el-col :span="24">
        <el-card class="h-100">
          <h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">项目基本信息</h4>
          <div class="d-flex align-items-center flex-wrap">
            <p class="w-100 mb-3">
              <span class="opacity-60 mr-2">项目名称：</span>
              {{ basic.p_name }}
            </p>
            <p class="w-100 mb-3">
              <span class="opacity-60 mr-2">审核状态：</span>
              <span v-if="basic.status == 1">
                <i class="dot bg-primary mr-1"></i>
                待确认
              </span>
              <span v-else-if="basic.status == 2">
                <i class="dot bg-warning mr-1"></i>
                待审核
              </span>
              <span v-else-if="basic.status == 3">
                <i class="dot bg-success mr-1"></i>
                审核成功
              </span>
              <span v-else-if="basic.status == 4">
                <i class="dot bg-danger mr-1"></i>
                审核失败
              </span>
              <span v-else-if="basic.status == 5">
                <i class="dot bg-cyan mr-1"></i>
                已回收
              </span>
            </p>
            <p class="w-100 mb-3">
              <span class="opacity-60 mr-2">申请时间：</span>
              {{ basic.applytime }}
            </p>
            <p class="w-100 mb-3">
              <span class="opacity-60 mr-2">审核时间：</span>
              {{ basic.checktime }}
            </p>
            <p class="w-100 mb-0" v-if="basic.type == 2">
              <span class="opacity-60 mr-2">资源申请备注：</span>
              {{ basic.apply_remark }}
            </p>
            <p class="w-100 mb-0" v-else>
              <span class="opacity-60 mr-2">备注：</span>
              {{ basic.remark }}
            </p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 表单值-初审信息 -->
    <el-card class="mt-3">
      <h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">初审信息</h4>
      <el-form class="form_json" label-position="left">
        <el-row :gutter="20">
          <template v-for="(formItem, j) in dataJson">
            <el-col :span="24" :key="j" v-if="formItem.name_type == 5 || formItem.name_type == 13 || formItem.name_type == 14 || formItem.name_type == 15">
              <el-form-item :label="formItem.title + '：'" class="file-form-item">
                <div class="d-flex align-items-center justify-content-between mb-2" v-for="(file, index) in formItem.file_arr" :key="index">
                  <div class="cursor-pointer view">
                    <i class="el-icon-document mr-2"></i>
                    <span>{{ file.name }}</span>
                  </div>
                  <div class="opacity-80 ml-5 pl-5">
                    <!-- <i class="el-icon-view cursor-pointer view mr-3" @click="preview(file.path)"></i> -->
                    <i class="el-icon-download cursor-pointer view" @click="downloadview(file)"></i>
                  </div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24" :key="j" v-else-if="formItem.name_type == 12">
              <el-form-item :label="formItem.title + '：'" label-width="110px" class="json-form-item">
                <div class="w-100 d-flex align-items-center pb-1 mb-1" v-for="(cell, index) in formItem.value" :key="index">
                  <p class="m-0 w-100 pl-2 pr-2 pt-1 pb-1" v-for="(item, k) in cell" :key="k">{{ item }}</p>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12" :key="j" v-else-if="formItem.name_type == 9 || formItem.name_type == 10">
              <el-form-item :label="formItem.title + '：'">
                {{ formItem.value.join(',') }}
              </el-form-item>
            </el-col>
            <el-col :span="24" :key="j" v-else-if="formItem.name_type == 6 || formItem.name_type == 7">
              <el-form-item :label="formItem.title + '：'">
                <span v-html="formItem.value"></span>
              </el-form-item>
            </el-col>
            <el-col :span="12" :key="j" v-else>
              <el-form-item :label="formItem.title + '：'">
                {{ formItem.value }}
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
    </el-card>

    <!-- 操作记录（审核） -->
    <el-card class="mt-3">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="fs_18 font-weight-semibold m-0 text-000 mb-3">操作记录</h4>
        <div :class="['toggleMenu cursor-pointer text-primary', showMore ? 'menu_arrow' : '']" @click="changeFoldState" v-if="checkListAll.length > 5">
          <span>{{ showMore ? '展开' : '收起' }}</span>
          <i class="el-icon-arrow-up ml-1"></i>
        </div>
      </div>
      <el-table :data="checkList">
        <el-table-column prop="pname" label="节点名称"></el-table-column>
        <el-table-column prop="groupname" label="操作部门"></el-table-column>
        <el-table-column prop="load_check_name" label="待操作人"></el-table-column>
        <el-table-column prop="check_state" label="操作状态">
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
              审核失败
            </span>
            <span v-else-if="scope.row.check_state == 4">
              <i class="dot bg-blue mr-1"></i>
              待提交
            </span>
            <span v-else-if="scope.row.check_state == 5">
              <i class="dot bg-cyan mr-1"></i>
              已提交
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="checkname" label="操作人"></el-table-column>
        <el-table-column prop="remark" label="操作备注"></el-table-column>
        <el-table-column prop="createtime" label="创建时间"></el-table-column>
        <el-table-column prop="checktime" label="操作时间"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb';
import BaseEcharts from '@/components/echarts/BaseEcharts';
export default {
  name: 'ResourceProjectDetail',
  components: {
    Breadcrumb,
    'my-echart': BaseEcharts,
  },
  data() {
    return {
      // 项目基本信息
      basic: {},
      // 厂商详情
      company_info: {},
      // 当前节点付款情况 -图
      option: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'horizontal',
          x: 'center',
          bottom: '0',
          icon: 'circle',
          itemWidth: 10,
          data: ['未付款', '已付款'],
        },
        series: [
          {
            name: '金额',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '48%'],
            label: {
              formatter: `{b|{b}：}{c} 元 {per|{d}%}`,
              fontSize: 16,
              rich: {
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [6, 6],
                  borderRadius: 4,
                },
              },
            },
            data: [
              { value: 7000, name: '未付款' },
              { value: 3000, name: '已付款' },
            ],
            hoverOffset: 5,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      },
      money_data: [],
      // 合同附件
      agreefiles: [],
      // 当前节点电子文档下拉选项
      edValue: '0',
      // 表单值
      dataJson: [],
      //项目状态
      statusActive: 7,
      statusSteps: [],
      // 操作记录（审核）
      checkList: [],
      checkListAll: [],
      showMore: false,
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    // 获取数据
    initData() {
      this.$api
        .project_apply_resourceDetail({
          id: this.$route.query.id,
        })
        .then(data => {
          if (data.code == 0) {
            this.basic = data.data.info;
            // 表单值-详细信息
            this.dataJson = data.data.info.datajson;

            // 操作记录（审核）
            this.checkListAll = data.data.check_list;
            // 默认情况下操作记录（审核）
            if (data.data.check_list.length < 5) {
              this.checkList = this.checkListAll;
            } else {
              this.checkList = this.checkListAll;
            }
          }
        });
    },
    // 审核列表展开收起
    changeFoldState() {
      if (this.showMore) {
        // 展开
        this.checkList = this.checkListAll;
        this.showMore = false;
      } else {
        this.checkList = this.checkListAll.slice(0, 5);
        this.showMore = true;
      }
    },

    // 自增序列
    indexMethod(index) {
      return ++index;
    },
    // 判断表格是否有子项，无子项不显示展开按钮
    getRowClassRecheck(row) {
      if (!row.row.recheck_detail) {
        return 'row-expand-cover';
      }
    },
    // 判断表格是否有子项，无子项不显示展开按钮
    getRowClassProcess(row) {
      if (!row.row.files) {
        return 'row-expand-cover';
      }
    },
    // 判断表格是否有子项，无子项不显示展开按钮
    getRowClass(row) {
      if (row.row.is_pay == 1) {
        return 'row-expand-cover';
      }
    },
    // 加载数据
    loadData(queryInfo) {
      let _this = this;
      if (queryInfo != null) {
        this.currentPage = queryInfo.page;
        this.pageSize = queryInfo.pageSize;
      }
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
  },
};
</script>

<style></style>
