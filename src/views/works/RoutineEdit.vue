<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<h6 class="fs_20 font-weight-normal mb-3">{{title}}</h6>
			<el-form :model="routineForm" :rules="rules" ref="routineForm" label-width="110px" label-position="top" class="pl-3 pr-3">
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="事务编号" prop="work_num">
							<el-input v-model="routineForm.work_num" placeholder="请输入事务编号"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="事务标题" prop="title">
							<el-input v-model="routineForm.title" placeholder="请输入事务标题"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="优先级" prop="level">
							<el-select v-model="routineForm.level" placeholder="请选择优先级" class="w-100">
								<el-option
									v-for="item in levelOptions"
									:key="item.id"
									:label="item.name"
									:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="内容" prop="desc">
							<el-input type="textarea" v-model="routineForm.desc" placeholder="请输入内容" :rows="3"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="事务类型" prop="type">
							<el-select v-model="routineForm.type" placeholder="请选择事务类型" class="w-100">
								<el-option label="自办" value="1"></el-option>
								<el-option label="他办" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="所属类型" prop="work_type">
							<el-select v-model="routineForm.work_type" placeholder="请选择所属类型" class="w-100">
								<el-option label="所属项目" value="1"></el-option>
								<el-option label="所属资源" value="2"></el-option>
								<el-option label="一般事务" value="3"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if="routineForm.work_type == 1 || routineForm.work_type == 2">
						<el-form-item label="详情id">
							<el-input type="textarea" v-model="routineForm.details_id" placeholder="请输入详情id" :rows="3"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if="routineForm.work_type == 2">
						<el-form-item label="流程参数" prop="send_json" >
							<el-input type="textarea" v-model="routineForm.send_json" placeholder="请输入流程参数" :rows="3"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="预计完成时间">
							<el-date-picker type="datetime" placeholder="选择日期" v-model="routineForm.endtime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" style="width: 100%;"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="提醒时间">
							<el-date-picker type="datetime" placeholder="选择日期" v-model="routineForm.remain_time" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" style="width: 100%;"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="是否重复提醒" prop="is_repeat">
							<el-select v-model="routineForm.is_repeat" placeholder="请选择是否重复提醒" class="w-100">
								<el-option label="否" value="1"></el-option>
								<el-option label="是" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8" v-if="routineForm.is_repeat == 2">
						<el-form-item label="重复类型" prop="repeat_type">
							<el-select v-model="routineForm.repeat_type" placeholder="请选择重复类型" class="w-100">
								<el-option label="每天" value="1"></el-option>
								<el-option label="每周" value="2"></el-option>
								<el-option label="每月" value="3"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="备注">
							<el-input type="textarea" v-model="routineForm.remark" placeholder="请输入备注" :rows="3"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="附件">
							<div class="d-flex align-items-start justify-content-between">
								<el-upload
									class="my_upload"
									drag
									action="void"
									:accept="accept"
									:auto-upload="true"
									:http-request="myUpload"
									:file-list="routineForm.attach"
									:on-success="handleSuccess"
									:on-remove="handleRemove"
									:before-upload="beforeUpload">
									<div class="el-upload__text"><i class="el-icon-upload"></i>将文档拖到此处，或<em>点击选择文档</em></div>
								</el-upload>
							</div>
						</el-form-item>
					</el-col>
				</el-row>
				<div class="d-flex justify-content-end">
					<el-button type="primary" @click="submitForm('routineForm')">确 定</el-button>
					<el-button @click="closedEdit('routineForm')">取 消</el-button>
				</div>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import GlobalTips from "@/components/GlobalTips";
	import Breadcrumb from "@/components/Breadcrumb";
	import vEditor from "@/components/quill-editor/ue";
	export default {
		props:['editData'],
		name: 'RoutineEdit',
		data () {
			return {
				projectId:'',
				title:"新增项目",
				accept: ".pdf,.doc,.docx,.xls,.xlsx,.zip",
				levelOptions:[],
				userOptions:[],
				routineForm: {
					work_num:"",
          title: "",
					desc: "",
          level:"",
					type: "",
          work_type:"",
          details_id:"",
          send_json:"",
          endtime:"",
					remain_time: "",
          is_repeat:"",
          repeat_type:"",
					attach:[],
					remark:"",
        },
        rules: {
					work_num: [
            { required: true, message: '请输入事务编号', trigger: 'blur' }
          ],
					title: [
            { required: true, message: '请输入标题', trigger: 'blur' }
          ],
					desc: [
            { required: true, message: '请输入内容', trigger: 'blur' }
          ],
					level: [
            { required: true, message: '请选择优先级', trigger: 'change' }
          ],
					type: [
            { required: true, message: '请选择事务类型', trigger: 'change' }
          ],
					work_type: [
            { required: true, message: '请选择所属类型', trigger: 'change' }
          ],
					send_json: [
            { required: true, message: '请输入流程参数', trigger: 'blur' }
          ],
					is_repeat: [
            { required: true, message: '请选择是否重复提醒', trigger: 'change' }
          ],
					repeat_type: [
            { required: true, message: '请选择重复类型', trigger: 'change' }
          ],
        }
			}
		},
		components: {
			GlobalTips,
			Breadcrumb,
			vEditor
		},
		mounted(){
			this.openEdit();
		},
		methods:{
			// 获取优先级
			initLevel(){
				this.$api.routineLevel({
				}).then(data =>{
					if(data.code == 0){
						// 回调成功的方法
						this.levelOptions = data.data;
					}else{
						this.$message.error(data.msg);
					}
				});
			},
			// dialog初始化
			openEdit(){
				this.projectId = this.$route.query.id;
				if(this.projectId){
					this.title = "编辑事务"
				}else{
					this.title = "发起事务"
				}
				this.initLevel();
			},
			// 关闭编辑
			closedEdit(formName){
				this.resetForm(formName);
				this.$router.go(-1);//返回上一层
			},

      // form提交
			submitForm(formName) {
				var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
						if(this.projectId){ // 编辑

						}else{ // 新增
							this.$api.routineAdd({
								work_num:this.routineForm.work_num,
								title:this.routineForm.title,
								desc:this.routineForm.desc,
								level:this.routineForm.level,
								type:this.routineForm.type,
								work_type:this.routineForm.work_type,
								details_id:this.routineForm.details_id,
								send_json:this.routineForm.send_json,
								endtime	:this.routineForm.endtime,
								remain_time:this.routineForm.remain_time,
								is_repeat:this.routineForm.is_repeat,
								repeat_type:this.routineForm.repeat_type,
								attach:this.routineForm.attach,
								remark:this.routineForm.remark,
							}).then(data =>{
								if(data.code == 0){
									console.log(data,'5555');
									// 回调成功的方法
									_this.handleClose();
									_this.resetForm(formName);
									
								}else{
									this.$message.error(data.msg);
								}
							});
						}
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 表单重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

			/****  上传  ****/
			// type=2 文档上传
			myUpload(params){
	      // 通过 FormData 对象上传文件
	      const formData = new FormData();
	      formData.append("work_num", this.routineForm.work_num);
	      formData.append("file", params.file);
	      formData.append("user_token", this.VueCookies.get("token"));

				this.$api.routineUpload(formData).then(data =>{
					if(data.code == 0){

						console.log(data.data,'dddd');
						// 回调成功的方法
						params.onSuccess(data);
						this.$message.success(data.msg);
						this.routineForm.agreefile.push(data.data.path);
					}else{
						this.$message.error(data.msg);
					}
				});
			},
      // 上传成功
			handleSuccess(res, file, fileList) {
				this.routineForm.agreefile = fileList;
      },
      // 移除上传文件
      handleRemove(file,fileList) {
      	var path;
      	if(file.isExist){ // 原先上传已存在的
      		path = file.path;
      	}else{ // 刚刚上传的
      		path = file.response.data.path;
      	}
      	this.$api.kl_contentUploadDel({
      		path:path,
      	}).then(data =>{
					if(data.code == 0){
						// this.$refs.upload.abort(); //取消上传
						this.fileList = fileList;
						this.contentForm.fileContent.some((item, i)=>{
							if(item = path){
								this.contentForm.fileContent.splice(i, 1);
								//在数组的some方法中，如果return true，就会立即终止这个数组的后续循环
								return true
							}
						});

						this.$message({message: '成功移除' + file.name, type: 'success'});
					}else{
						this.$message.error(data.msg);
					}
				});
      },

      // 上传前验证
      beforeUpload(file) {
      	// 验证大小等
      	
      },
		}
	}
</script>

<style>

</style>