<template>
  <div class="page_detail">
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <Breadcrumb></Breadcrumb>
    <!-- 项目验收 -->
    <el-card class="mt-3 bg-white">
      <h6 class="fs_18 font-weight-normal mb-3">{{ title }}</h6>
      <!-- 审核内容的表格 -->
      <div class="accept_info">
        <div class="accept_info_header fs_16 text-center font-weight-black">
          <el-row type="flex" align="middle">
            <el-col :span="18">
              <div class="p-2">审核内容</div>
            </el-col>
            <el-col :span="3">
              <div class="p-2">执行情况</div>
            </el-col>
            <el-col :span="3">
              <div class="p-2">审核人</div>
            </el-col>
          </el-row>
        </div>
        <div class="accept_info_content">
          <template v-for="(item, index) in acceptInfo">
            <el-row :key="index" type="flex" align="middle">
              <el-col :span="6">
                <div class="p-2 text-center">{{ item.group_name }}</div>
              </el-col>
              <el-col :span="18">
                <template v-for="(cell, j) in item.group_list">
                  <el-row type="flex" :key="j">
                    <el-col :span="16">
                      <div class="p-2">{{ j + 1 }}、 {{ cell.title }}</div>
                    </el-col>
                    <el-col :span="4">
                      <div class="p-2">
                        <el-input v-model="cell.desc" placeholder="请输入执行情况"></el-input>
                      </div>
                    </el-col>
                    <el-col :span="4">
                      <div class="p-2">
                        <el-input v-model="cell.checkname" placeholder="请输入审核人"></el-input>
                      </div>
                    </el-col>
                  </el-row>
                </template>
              </el-col>
            </el-row>
          </template>
        </div>
      </div>

      <el-form :model="projectForm" ref="projectForm" label-width="110px" label-position="top" class="pl-3 pr-3">
        <!-- 验收流程的额外参数 -->
        <el-row :gutter="20">
          <div v-for="(formItem, j) in projectForm.acceptExtraForms" :key="j">
            <!-- 字段类型:1=文本框,2=数字框,3=下拉单选,4=日期选择,5=文件上传(单选),6=文本域,7=富文本,
						8=时间选择,9=下拉多选,10=复选,11=单选,12=数组,13=图片上传(单选),14=图片上传(多选),15=文件上传(多选) -->
            <!-- 1=文本框 -->
            <el-col :span="12" v-if="formItem.name_type == 1">
              <el-form-item :label="formItem.title" :required="formItem.is_required == 2 ? true : false">
                <template slot="label">
                  <span>{{ formItem.title }}</span>
                  <span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
                </template>
                <el-input v-model="formItem.value" :placeholder="formItem.placeholder"></el-input>
              </el-form-item>
            </el-col>
            <!-- 2=数字框 -->
            <el-col :span="12" v-else-if="formItem.name_type == 2">
              <el-form-item
                :label="formItem.title"
                :required="formItem.is_required == 2 ? true : false"
                :rules="[{ type: 'number', message: formItem.title + '必须为数字值' }]"
              >
                <template slot="label">
                  <span>{{ formItem.title }}</span>
                  <span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
                </template>
                <el-input v-model="formItem.value" :placeholder="formItem.placeholder">
                  <span slot="suffix" class="el-input__icon mr-2">元</span>
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 3=下拉单选 -->
            <el-col :span="12" v-else-if="formItem.name_type == 3">
              <el-form-item :label="formItem.title" :required="formItem.is_required == 2 ? true : false">
                <template slot="label">
                  <span>{{ formItem.title }}</span>
                  <span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
                </template>
                <el-select v-model="formItem.value" clearable :placeholder="formItem.placeholder" class="w-100">
                  <el-option v-for="item in formItem.extra_val" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 4=日期选择 -->
            <el-col :span="12" v-else-if="formItem.name_type == 4">
              <el-form-item :label="formItem.title" :required="formItem.is_required == 2 ? true : false">
                <template slot="label">
                  <span>{{ formItem.title }}</span>
                  <span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
                </template>
                <el-date-picker
                  type="date"
                  :placeholder="formItem.placeholder"
                  v-model="formItem.value"
                  value-format="yyyy-MM-dd"
                  clearable
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <!-- 5=文件上传(单选) -->
            <el-col :span="24" v-else-if="formItem.name_type == 5">
              <el-form-item :label="formItem.title" :required="formItem.is_required == 2 ? true : false">
                <template slot="label">
                  <div class="d-inline-flex align-items-center justify-content-between" v-if="formItem.example">
                    <span>{{ formItem.title }}</span>
                    <span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
                    <div class="d-flex align-items-center justify-content-between ml-5 text-primary">
                      <div class="cursor-pointer view" @click="downloadview(formItem.example)">
                        <i class="el-icon-document mr-2"></i>
                        <span>示例下载</span>
                      </div>
                      <div class="opacity-80 ml-3">
                        <!-- <i class="el-icon-view cursor-pointer view mr-3" @click="preview(formItem.example)"></i> -->
                        <i class="el-icon-download cursor-pointer view" @click="downloadview(formItem.example)"></i>
                      </div>
                    </div>
                  </div>
                </template>
                <div class="d-flex align-items-start justify-content-between">
                  <el-upload
                    class="my_upload"
                    drag
                    :limit="1"
                    action="void"
                    :accept="accept_file"
                    :auto-upload="true"
                    :http-request="myUpload"
                    :file-list="formItem.value"
                    :on-success="(res, file, fileList) => handleSuccess(res, file, fileList, formItem)"
                    :on-remove="(file, fileList) => handleRemove(file, fileList, formItem)"
                    :before-upload="file => beforeUpload(file, formItem)"
                    :on-exceed="onExceed"
                  >
                    <div class="el-upload__text">
                      <i class="el-icon-upload"></i>
                      将文档拖到此处，或
                      <em>点击选择文档</em>
                    </div>
                  </el-upload>
                </div>
              </el-form-item>
            </el-col>
            <!-- 6=文本域 -->
            <el-col :span="24" v-else-if="formItem.name_type == 6">
              <el-form-item :label="formItem.title" :required="formItem.is_required == 2 ? true : false">
                <template slot="label">
                  <span>{{ formItem.title }}</span>
                  <span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
                </template>
                <el-input type="textarea" v-model="formItem.value" :placeholder="formItem.placeholder" :rows="3"></el-input>
              </el-form-item>
            </el-col>
            <!-- 7=富文本 -->
            <el-col :span="24" v-else-if="formItem.name_type == 7">
              <el-form-item :label="formItem.title" :required="formItem.is_required == 2 ? true : false">
                <template slot="label">
                  <span>{{ formItem.title }}</span>
                  <span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
                </template>
                <vEditor v-model="formItem.value" class="pro_vEditor"></vEditor>
              </el-form-item>
            </el-col>
            <!-- 8=时间选择 -->
            <el-col :span="12" v-else-if="formItem.name_type == 8">
              <el-form-item :label="formItem.title" :required="formItem.is_required == 2 ? true : false">
                <template slot="label">
                  <span>{{ formItem.title }}</span>
                  <span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
                </template>
                <el-date-picker
                  type="datetime"
                  :placeholder="formItem.placeholder"
                  v-model="formItem.value"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  clearable
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <!-- 9=下拉多选 -->
            <el-col :span="12" v-else-if="formItem.name_type == 9">
              <el-form-item :label="formItem.title" :required="formItem.is_required == 2 ? true : false">
                <template slot="label">
                  <span>{{ formItem.title }}</span>
                  <span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
                </template>
                <el-select v-model="formItem.value" clearable multiple :placeholder="formItem.placeholder" class="w-100">
                  <el-option v-for="item in formItem.extra_val" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 10=复选 -->
            <el-col :span="12" v-else-if="formItem.name_type == 10">
              <el-form-item :label="formItem.title" :required="formItem.is_required == 2 ? true : false">
                <template slot="label">
                  <span>{{ formItem.title }}</span>
                  <span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
                </template>
                <el-checkbox-group v-model="formItem.value">
                  <template v-for="(checkbox, z) in formItem.extra_val">
                    <el-checkbox :label="checkbox" :name="formItem.name" :key="z"></el-checkbox>
                  </template>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <!-- 11=单选 -->
            <el-col :span="12" v-else-if="formItem.name_type == 11">
              <el-form-item :label="formItem.title" :required="formItem.is_required == 2 ? true : false">
                <template slot="label">
                  <span>{{ formItem.title }}</span>
                  <span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
                </template>
                <el-radio-group v-model="formItem.value">
                  <template v-for="(radio, z) in formItem.extra_val">
                    <el-radio :label="radio" :key="z"></el-radio>
                  </template>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <!-- 12=数组 -->
            <el-col :span="24" v-else-if="formItem.name_type == 12">
              <el-form-item :label="formItem.title" :required="formItem.is_required == 2 ? true : false" class="payment_item">
                <div slot="label" class="d-flex justify-content-between">
                  <div>
                    <span>{{ formItem.title }}</span>
                    <span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
                  </div>
                  <span class="text-primary cursor-pointer" @click="addPro(formItem.value, formItem.extra_val)">
                    <i class="el-icon-plus mr-1"></i>
                    添加
                  </span>
                </div>
                <template v-for="(cell, INDEX) in formItem.value">
                  <el-row type="flex" align="middle" :gutter="20" class="cell_row mb-3" :key="INDEX">
                    <el-col :span="23" class="d-flex align-items-center">
                      <el-input
                        :key="x"
                        v-for="(formCol, x) in formItem.extra_val"
                        class="mr-3"
                        v-model="cell[x]"
                        :placeholder="'请输入' + formCol.title"
                      ></el-input>
                    </el-col>
                    <el-col :span="1" class="text-right">
                      <span class="text-danger cursor-pointer" @click="delField(formItem.value, INDEX)">删除</span>
                    </el-col>
                  </el-row>
                </template>
              </el-form-item>
            </el-col>
            <!-- 13=图片上传(单选) -->
            <el-col :span="24" v-else-if="formItem.name_type == 13">
              <el-form-item :label="formItem.title" :required="formItem.is_required == 2 ? true : false">
                <template slot="label">
                  <div class="d-inline-flex align-items-center justify-content-between" v-if="formItem.example">
                    <span>{{ formItem.title }}</span>
                    <span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
                    <div class="d-flex align-items-center justify-content-between ml-5 text-primary">
                      <div class="cursor-pointer view" @click="downloadview(formItem.example)">
                        <i class="el-icon-document mr-2"></i>
                        <span>示例下载</span>
                      </div>
                      <div class="opacity-80 ml-3">
                        <!-- <i class="el-icon-view cursor-pointer view mr-3" @click="preview(formItem.example)"></i> -->
                        <i class="el-icon-download cursor-pointer view" @click="downloadview(formItem.example)"></i>
                      </div>
                    </div>
                  </div>
                </template>
                <el-upload
                  action="void"
                  :accept="accept_img"
                  :limit="1"
                  list-type="picture-card"
                  :auto-upload="true"
                  :http-request="myUpload"
                  :file-list="formItem.value"
                  :on-success="(res, file, fileList) => handleSuccess(res, file, fileList, formItem)"
                  :on-remove="(file, fileList) => handleRemove(file, fileList, formItem)"
                  :before-upload="file => beforeUpload(file, formItem)"
                  :on-exceed="onExceed"
                  :class="formItem.value.length > 0 ? 'limit_upload' : ''"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
            </el-col>
            <!-- 14=图片上传(多选) -->
            <el-col :span="24" v-else-if="formItem.name_type == 14">
              <el-form-item :label="formItem.title" :required="formItem.is_required == 2 ? true : false">
                <template slot="label">
                  <div class="d-inline-flex align-items-center justify-content-between" v-if="formItem.example">
                    <span>{{ formItem.title }}</span>
                    <span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
                    <div class="d-flex align-items-center justify-content-between ml-5 text-primary">
                      <div class="cursor-pointer view" @click="downloadview(formItem.example)">
                        <i class="el-icon-document mr-2"></i>
                        <span>示例下载</span>
                      </div>
                      <div class="opacity-80 ml-3">
                        <!-- <i class="el-icon-view cursor-pointer view mr-3" @click="preview(formItem.example)"></i> -->
                        <i class="el-icon-download cursor-pointer view" @click="downloadview(formItem.example)"></i>
                      </div>
                    </div>
                  </div>
                </template>
                <el-upload
                  action="void"
                  :accept="accept_img"
                  list-type="picture-card"
                  :auto-upload="true"
                  :http-request="myUpload"
                  :file-list="formItem.value"
                  :on-success="(res, file, fileList) => handleSuccess(res, file, fileList, formItem)"
                  :on-remove="(file, fileList) => handleRemove(file, fileList, formItem)"
                  :before-upload="file => beforeUpload(file, formItem)"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
            </el-col>
            <!-- 15=文件上传(多选) -->
            <el-col :span="24" v-else-if="formItem.name_type == 15">
              <el-form-item :label="formItem.title" :required="formItem.is_required == 2 ? true : false">
                <template slot="label">
                  <div class="d-inline-flex align-items-center justify-content-between" v-if="formItem.example">
                    <span>{{ formItem.title }}</span>
                    <span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
                    <div class="d-flex align-items-center justify-content-between ml-5 text-primary">
                      <div class="cursor-pointer view" @click="downloadview(formItem.example)">
                        <i class="el-icon-document mr-2"></i>
                        <span>示例下载</span>
                      </div>
                      <div class="opacity-80 ml-3">
                        <!-- <i class="el-icon-view cursor-pointer view mr-3" @click="preview(formItem.example)"></i> -->
                        <i class="el-icon-download cursor-pointer view" @click="downloadview(formItem.example)"></i>
                      </div>
                    </div>
                  </div>
                </template>
                <div class="d-flex align-items-start justify-content-between">
                  <el-upload
                    class="my_upload"
                    drag
                    action="void"
                    :accept="accept_file"
                    :auto-upload="true"
                    :http-request="myUpload"
                    :file-list="formItem.value"
                    :on-success="(res, file, fileList) => handleSuccess(res, file, fileList, formItem)"
                    :on-remove="(file, fileList) => handleRemove(file, fileList, formItem)"
                    :before-upload="file => beforeUpload(file, formItem)"
                  >
                    <div class="el-upload__text">
                      <i class="el-icon-upload"></i>
                      将文档拖到此处，或
                      <em>点击选择文档</em>
                    </div>
                  </el-upload>
                </div>
              </el-form-item>
            </el-col>
          </div>
        </el-row>

        <div class="d-flex justify-content-end">
          <el-button type="primary" @click="submitForm('projectForm')" v-if="isShow">提 交</el-button>
          <el-button @click="closedEdit">取 消</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import GlobalTips from '@/components/GlobalTips';
import Breadcrumb from '@/components/Breadcrumb';
export default {
  name: 'ProjectAccept',
  data() {
    return {
      projectId: '',
      is_commit: '', // 判断有没有确定按钮，当is_commit为8的时候   没有确定按钮
      title: '项目验收',
      accept_file: '.pdf,.doc,.docx,.xls,.xlsx,.zip',
      accept_img: '.jpg,.png,.JPEG',
      projectForm: {
        accept_number: '',
        acceptExtraForms: [],
      },
      acceptInfo: [],
      removeFilesArr: [],
      isShow: true,
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
      this.projectId = this.$route.query.id;
      var randnum = Math.floor(Math.random() * (9999 - 1000)) + 1000; // 四位随机数
      var number = this.$moment(new Date()).format('YYYYMMDDHHss');
      this.$api
        .hosterAccept_send({
          project_id: this.projectId,
          function_type: 1,
        })
        .then(data => {
          if (data.code == 0) {
            this.projectForm.accept_number = number + randnum;
            // 验收表格
            this.acceptInfo = data.data.accept_info;
            // 验收额外参数
            if (!data.data.project_info.acceptextra) {
              this.getNodeExtra();
            } else {
              var acceptExtraForms = data.data.project_info.acceptextra;
              acceptExtraForms.map(item => {
                if (item.name_type == 5 || item.name_type == 13 || item.name_type == 14 || item.name_type == 15) {
                  item.value = [];
                  if (!this.commonJs.isEmpty(item.file_arr)) {
                    item.value = item.file_arr;
                  }
                }
              });
              this.projectForm.acceptExtraForms = acceptExtraForms;

              if (data.data.project_accept_info.status == '1' || data.data.project_accept_info.status == '2') {
                this.isShow = false;
              } else {
                this.isShow = true;
              }
            }
          } else {
            this.$message.error(data.msg);
          }
        });
    },

    // 根据流程节点获取额外参数
    getNodeExtra() {
      this.$api
        .project_getExtraNodeForms({
          id: 10,
        })
        .then(data => {
          if (data.code == 0) {
            var acceptExtraForms = data.data;
            acceptExtraForms.map(item => {
              if (item.name_type == 5 || item.name_type == 13 || item.name_type == 14 || item.name_type == 15) {
                item.value = [];
                if (!this.commonJs.isEmpty(item.file_arr)) {
                  item.value = item.file_arr;
                }
              }
            });
            this.projectForm.acceptExtraForms = acceptExtraForms;
          } else {
            this.$message.error(data.msg);
          }
        });
    },

    // 关闭编辑
    closedEdit() {
      this.$router.go(-1); //返回上一层
      this.removeFilesArr = [];
    },
    // form提交
    submitForm(formName) {
      var _this = this;
      var sendJson = new Array();
      this.acceptInfo.forEach((item, index) => {
        item.group_list.map((list, j) => {
          var obj = {
            id: list.id,
            desc: list.desc,
            checkname: list.checkname,
          };
          sendJson.push(obj);
        });
      });
      var sendExtra = new Array();
      var isExtraArr = this.commonJs.isEmpty(this.projectForm.acceptExtraForms);
      if (!isExtraArr) {
        sendExtra = this.projectForm.acceptExtraForms.map(item => {
          if (item.name_type == 5 || item.name_type == 13 || item.name_type == 14 || item.name_type == 15) {
            var nameArray = item.value.map(file => {
              if (this.commonJs.isEmpty(file.response)) {
                return file.path;
              } else {
                return file.response.data.path;
              }
            });
            return {
              name: item.name,
              value: nameArray.join(','),
            };
          } else {
            return {
              name: item.name,
              value: item.value,
            };
          }
        });
      }

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$api
            .hosterAccept_send({
              project_id: this.projectId,
              accept_number: this.projectForm.accept_number,
              acceptextra: JSON.stringify(sendExtra),
              sendjson: JSON.stringify(sendJson),
              function_type: 2,
            })
            .then(data => {
              if (data.code == 0) {
                // this.removeFilesArr.map((path)=>{
                // 	_this.removeFile(path);
                // })
                this.$message({
                  message: data.msg,
                  type: 'success',
                });
                this.closedEdit();
              } else {
                this.$message.error(data.msg);
              }
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    /****  上传  ****/
    myUpload(params, formItem) {
      // 通过 FormData 对象上传文件
      const formData = new FormData();
      formData.append('apply_number', this.projectForm.apply_number);
      formData.append('type', 'yanshou/' + this.projectForm.accept_number);
      formData.append('file', params.file);
      formData.append('user_token', this.VueCookies.get('application_token'));

      this.$api.uploadFile(formData).then(data => {
        if (data.code == 0) {
          // 回调成功的方法
          params.onSuccess(data);
          this.$message.success(data.msg);
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    // 上传成功
    handleSuccess(res, file, fileList, formItem) {
      formItem.value = fileList;
    },
    // 移除上传文件
    handleRemove(file, fileList, formItem) {
      var path;
      if (file.isExist) {
        // 原先上传已存在的
        path = file.path;
      } else {
        // 刚刚上传的
        if (file.status == 'success') {
          path = file.response.data.path;
        } else {
          return false;
        }
      }
      formItem.value = fileList;
      this.$message({ message: '成功移除' + file.name, type: 'success' });

      if (this.removeFilesArr.indexOf(path) == -1) {
        this.removeFilesArr.push(path);
      }
    },

    // 删除调接口
    removeFile(path) {
      this.$api
        .uploadDel({
          path: path,
        })
        .then(data => {
          if (data.code == 0) {
            // this.$message.success("文件更新成功");
          } else {
            this.$message.error(data.msg);
          }
        });
    },

    // 上传前验证
    beforeUpload(file, formItem) {
      var isUpload = true;
      // 验证大小等
      formItem.value.map(fff => {
        if (fff.name == file.name) {
          this.$message.warning('请不要重复上传相同文件！');
          isUpload = false;
          return;
        }
      });
      return isUpload;
    },
    // 文件超出限制
    onExceed(file, fileList) {
      this.$message.error('只能上传一个文件哦，可以先删除再重新上传！');
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
    downloadview(path) {
      let a = document.createElement('a');
      a.style = 'display: none'; // 创建一个隐藏的a标签
      a.download = '示例下载';
      a.href = this.$globalUrl.baseURL + path;
      document.body.appendChild(a);
      a.click(); // 触发a标签的click事件
      document.body.removeChild(a);
    },
  },
};
</script>

<style></style>
