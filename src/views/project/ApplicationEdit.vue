<template>
	<el-dialog
	  :title="applicationData.title"
	  :visible.sync="applicationData.dialog"
	  width="40%" top="6vh"
	  @open="openEdit"
	  @closed="closedEdit('projectForm')"
	  :before-close="handleClose">
		<el-form :model="projectForm" :rules="rules" ref="projectForm" label-width="100px" class="pl-3 pr-3">
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="项目年份" prop="year">
				    <el-date-picker type="date" placeholder="选择日期" v-model="projectForm.year" style="width: 100%;"></el-date-picker>
				  </el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="项目名称" prop="name">
				    <el-input v-model="projectForm.name" placeholder="请输入项目名称"></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="录入时间" prop="date">
				    <el-date-picker type="date" placeholder="选择日期" v-model="projectForm.date" style="width: 100%;"></el-date-picker>
				  </el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="项目类型" prop="type">
						<el-select v-model="projectForm.type" placeholder="请选择项目类型" style="width: 100%;">
				      <el-option label="建设类" value="1"></el-option>
				      <el-option label="工程类" value="2"></el-option>
				    </el-select>
				  </el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="录入科室" prop="dept">
				    <el-select v-model="projectForm.dept" placeholder="请选择录入科室" style="width: 100%;">
				      <el-option label="教务处" value="1"></el-option>
				      <el-option label="学工办" value="2"></el-option>
				    </el-select>
				  </el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="经费来源" prop="fundSource">
				    <el-select v-model="projectForm.fundSource" placeholder="请选择经费来源" style="width: 100%;">
				      <el-option label="教务处" value="1"></el-option>
				      <el-option label="学工办" value="2"></el-option>
				    </el-select>
				  </el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="预算" prop="budget">
				    <el-input v-model.number="projectForm.budget" placeholder="请输入预算"></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="建设方式" prop="constructionMode">
				    <el-select v-model="projectForm.constructionMode" placeholder="请选择建设方式" style="width: 100%;">
				      <el-option label="中标公司" value="1"></el-option>
				      <el-option label="自建" value="2"></el-option>
				    </el-select>
				  </el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="可用经费" prop="funds">
				    <el-input v-model.number="projectForm.funds" placeholder="请输入可用经费"></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="核定金额" prop="approvedAmount">
				    <el-input v-model.number="projectForm.approvedAmount" placeholder="请输入核定金额"></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="合同金额" prop="contractAmount">
				    <el-input v-model.number="projectForm.contractAmount" placeholder="请输入合同金额"></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="项目介绍">
				    <el-input type="textarea" v-model="projectForm.desc" placeholder="请输入项目介绍" :autosize="{ minRows: 5, maxRows: 10}"></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="附件上传">
				    <el-upload
						  class="upload-demo"
						  action="#"
						  :auto-upload="false"
						  :on-remove="appendixRemove"
						  :file-list="projectForm.fileList"
						  list-type="picture-card">
						  <i slot="default" class="el-icon-plus"></i>
						</el-upload>
				  </el-form-item>
				</el-col>
			</el-row>
		</el-form>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="closedEdit('projectForm')">取 消</el-button>
	    <el-button type="primary" @click="submitForm('projectForm')">确 定</el-button>
	  </span>
	</el-dialog>
</template>

<script>
	export default {
		props:['applicationData'],
		inject: ['loadData'],
		name: 'ApplicationEdit',
		data () {
			return {
				projectForm: {
					year:"",
          name: "",
          date:"",
          type:"",
          dept:"",
          fundSource:"",
          budget:"",
          constructionMode:"",
          funds:"",
          approvedAmount:"",
          contractAmount:"",
          desc:"",
          fileList: [
          	{
          		name: 'food.jpeg', 
          		url: require("@/assets/images/avatar.jpg"),
          	}
          ]
        },
        rules: {
          year: [
            { type: 'date', required: true, message: '请选择年份', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
          ],
          date: [
            { type: 'date', required: true, message: '请选择录入时间', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择项目类型', trigger: 'change' }
          ],
          dept: [
            { required: true, message: '请选择科室', trigger: 'change' }
          ],
          fundSource: [
            { required: true, message: '请选择经费来源', trigger: 'change' }
          ],
          budget: [
          	{ required: true, message: '请输入预算', trigger: 'blur' },
          	{ type: 'number', message: '预算必须为数字值'}
          ],
          constructionMode: [
            { required: true, message: '请选择建设方式', trigger: 'change' }
          ],

          funds: [
          	{ required: true, message: '请输入可用经费', trigger: 'blur' },
          	{ type: 'number', message: '可用经费必须为数字值'}
          ],
          approvedAmount: [
          	{ type: 'number', message: '核定金额必须为数字值'}
          ],
          contractAmount: [
          	{ type: 'number', message: '合同金额必须为数字值'}
          ],
        }
			}
		},
		components: {},
		methods:{
			// dialog初始化
			openEdit(){
			},
			// dialog关闭
			closedEdit(formName){
				this.handleClose();
				this.resetForm(formName);
			},
			// 右上角x关闭
			handleClose(){
				this.applicationData.dialog = false;
			},
			// 删除附件
			appendixRemove(file, fileList) {
        console.log(file, fileList);
      },
      // 放大附件图片查看
      appendixPreview(file) {
        console.log(file);
      },
      // form提交
			submitForm(formName) {
				var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
          	_this.handleClose();
						_this.resetForm(formName);
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 表单重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
		}
	}
</script>

<style>

</style>