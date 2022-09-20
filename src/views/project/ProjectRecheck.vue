<template>
  <div class="page_detail">
    <!-- 登录信息 -->
    <global-tips></global-tips>
    <Breadcrumb></Breadcrumb>
    <el-card class="mt-3 bg-white">
      <h6 class="fs_18 font-weight-normal mb-3">
        {{ titile }}
        <span class="ml-2 text-warning opacity-80 fs_14">Tips: 一经提交无法修改删除</span>
      </h6>
      <el-form :model="recheckForm" :rules="rules" ref="recheckForm" label-width="110px" label-position="top" class="pl-3 pr-3">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="评审状态" class="payment_item" required prop="sendjson">
              <div slot="label" class="d-flex justify-content-between">
                <span>评审状态</span>
                <span class="text-primary cursor-pointer" @click="addPro(recheckForm.sendjson)">
                  <i class="el-icon-plus mr-1"></i>
                  评审状态
                </span>
              </div>
              <template v-for="(cell, INDEX) in recheckForm.sendjson">
                <el-row type="flex" align="middle" :gutter="20" class="cell_row mb-3" :key="INDEX">
                  <el-col :span="24">
                    <el-select v-model="cell.expert_id" placeholder="请选择专家" class="w-100" clearable @change="changeCheck">
                      <el-option v-for="item in expertOptions" :key="item.id" :label="item.e_name" :value="item.id" :disabled="item.isSelect"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="24">
                    <el-select v-model="cell.is_pass" clearable placeholder="请选择是否通过" class="w-100">
                      <el-option label="通过" value="1"></el-option>
                      <el-option label="不通过" value="2"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="24">
                    <el-input type="textarea" v-model="cell.content" placeholder="请输入评审意见" :rows="1"></el-input>
                  </el-col>
                  <el-col :span="2" class="text-right">
                    <span class="text-danger cursor-pointer" @click="delField(recheckForm.sendjson, INDEX)">删除</span>
                  </el-col>
                </el-row>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="评审日期" prop="recheck_date">
              <el-date-picker
                type="date"
                placeholder="请选择评审日期"
                v-model="recheckForm.recheck_date"
                value-format="yyyy-MM-dd"
                clearable
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="评审内容" prop="content">
              <el-input type="textarea" v-model="recheckForm.content" placeholder="请输入评审内容" :rows="3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 评审流程的额外参数 -->
        <el-row :gutter="20">
          <div v-for="(formItem, j) in recheckForm.recheckExtraForms" :key="j">
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
          <el-button type="primary" @click="submitForm('recheckForm')">提 交</el-button>
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
  name: 'ProjectRecheck',
  data() {
    return {
      projectId: '',
      projectInfo: {},
      titile: '提交评审',
      expertOptions: [],
      isSelectArr: [],
      accept_file: '.pdf,.doc,.docx,.xls,.xlsx,.zip',
      accept_img: '.jpg,.png,.JPEG',
      recheckForm: {
        sendjson: [{}],
        recheck_date: '',
        content: '',
        recheckExtraForms: [],
      },
      removeFilesArr: [],
      startOption: {
        disabledDate: time => {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        },
      },
      rules: {
        sendjson: [{ required: true, message: '请选择评审状态', trigger: 'change' }],
        recheck_date: [{ required: true, message: '请选择评审日期', trigger: 'change' }],
        content: [{ required: true, message: '请输入评审内容', trigger: 'blur' }],
      },
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
    // 获取专家列表
    initExpert() {
      this.$api.projectExpert({}).then(data => {
        if (data.code == 0) {
          // 回调成功的方法
          this.expertOptions = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 专家选择
    changeCheck(val) {},
    // 添加审核流程
    addPro(item) {
      item.push({});
    },
    // 删除字段
    delField(item, index) {
      item.splice(index, 1);
    },
    // dialog初始化
    openEdit() {
      this.projectId = this.$route.query.id;
      this.initExpert();
      this.$api
        .projectDetail({
          id: this.$route.query.id,
        })
        .then(data => {
          if (data.code == 0) {
            this.projectInfo = data.data.info;
            this.getNodeExtra();
            // if(!data.data.extrajson){
            // 	this.getNodeExtra();
            // }else{
            // 	var recheckExtraForms = data.data.extrajson;
            // 	recheckExtraForms.map((item)=>{
            // 		if(item.name_type == 5 || item.name_type == 13 || item.name_type == 14 || item.name_type == 15){
            // 			item.value = [];
            // 			if(!this.commonJs.isEmpty(item.file_arr)){
            // 				item.value = item.file_arr
            // 			}
            // 		}
            // 	});
            // 	this.recheckForm.recheckExtraForms = recheckExtraForms;
            // }
          }
        });
    },
    // 关闭编辑
    closedEdit() {
      this.$router.go(-1); //返回上一层
      this.filesListPlan = [];
      this.removeFilesPlanArr = [];
      this.filesListExpert = [];
      this.removeFilesExpertArr = [];
    },
    // 根据流程节点获取额外参数
    getNodeExtra() {
      this.$api
        .project_getExtraNodeForms({
          id: 2,
        })
        .then(data => {
          if (data.code == 0) {
            var recheckExtraForms = data.data;
            recheckExtraForms.map(item => {
              if (item.name_type == 5 || item.name_type == 13 || item.name_type == 14 || item.name_type == 15) {
                item.value = [];
                if (!this.commonJs.isEmpty(item.file_arr)) {
                  item.value = item.file_arr;
                }
              }
            });
            this.recheckForm.recheckExtraForms = recheckExtraForms;
          } else {
            this.$message.error(data.msg);
          }
        });
    },
    // form提交
    submitForm(formName) {
      var _this = this;
      var newArr = new Array();
      var isArr = this.commonJs.isEmpty(this.recheckForm.sendjson[0]);
      if (!isArr) {
        newArr = this.recheckForm.sendjson;
      }

      var sendExtra = new Array();
      var isExtraArr = this.commonJs.isEmpty(this.recheckForm.recheckExtraForms);
      if (!isExtraArr) {
        sendExtra = this.recheckForm.recheckExtraForms.map(item => {
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
          this.$confirm('一经提交无法修改删除, 是否继续?', '提示', {
            type: 'warning',
          })
            .then(() => {
              this.$api
                .projectRecheck({
                  project_id: this.projectId,
                  sendjson: JSON.stringify(newArr),
                  recheck_date: this.recheckForm.recheck_date,
                  content: this.recheckForm.content,
                  extrajson: JSON.stringify(sendExtra),
                })
                .then(data => {
                  if (data.code == 0) {
                    // this.removeFilesPlanArr.map((path)=>{
                    // 	_this.removeFile(path);
                    // })
                    // this.removeFilesExpertArr.map((path)=>{
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
            })
            .catch(() => {});
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
      formData.append('apply_number', this.projectInfo.apply_number);
      formData.append('type', 'pingshen');
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
  },
};
</script>

<style></style>
