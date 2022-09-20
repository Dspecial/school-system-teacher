<template>
  <div class="page_detail">
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <Breadcrumb></Breadcrumb>
    <el-card class="mt-3 bg-white">
      <!-- 进度记录详情 -->
      <el-form :model="processInfo" ref="processInfo" label-width="110px" label-position="left" class="pl-3 pr-3">
        <h6 class="fs_18 font-weight-normal mb-3">进度记录详情</h6>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="上传编号">
              {{ processInfo.process_number }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="标题">
              {{ processInfo.title }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建人">
              {{ processInfo.job_number }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间">
              {{ processInfo.createtime }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核时间">
              {{ processInfo.checktime }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容">
              {{ processInfo.content }}
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="文件">
              <div class="d-flex align-items-center justify-content-between" v-for="(file, index) in files" :key="index">
                <div class="cursor-pointer view" @click="downloadview(file)">
                  <i class="el-icon-document mr-2"></i>
                  <span>{{ file.name }}</span>
                </div>
                <div class="opacity-80">
                  <!-- <i class="el-icon-view cursor-pointer view mr-3" @click="preview(file.path)"></i> -->
                  <i class="el-icon-download cursor-pointer view" @click="downloadview(file)"></i>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import GlobalTips from '@/components/GlobalTips';
import Breadcrumb from '@/components/Breadcrumb';
export default {
  name: 'ProjectProcessDetail',
  data() {
    return {
      id: '', // 记录id
      processInfo: {},
      files: [],
    };
  },
  components: {
    GlobalTips,
    Breadcrumb,
  },
  mounted() {
    this.openEdit();
  },
  methods: {
    // dialog初始化
    openEdit() {
      this.id = this.$route.query.id;
      this.$api
        .hosterProcess_detail({
          id: this.id,
        })
        .then(data => {
          if (data.code == 0) {
            this.processInfo = data.data;
            this.files = data.data.files;
          } else {
            this.$message.error(data.msg);
          }
        });
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
