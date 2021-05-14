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
							<el-input v-model="routineForm.work_num" placeholder="请输入事务编号" readonly></el-input>
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
				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="所属类型" prop="work_type">
							<el-select v-model="routineForm.work_type" placeholder="请选择所属类型" class="w-100" @change="workTypeChange">
								<el-option label="所属项目" value="1"></el-option>
								<el-option label="所属资源" value="2"></el-option>
								<el-option label="一般事务" value="3"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="routineForm.work_type == 1 || routineForm.work_type == 2">
						<el-form-item :label="routineForm.work_type == 1?'选择项目':'选择人员'">
							<el-select v-model="routineForm.details_id" placeholder="请选择详情" class="w-100">
								<el-option
									v-for="item in detailsOptions"
									:key="item.id"
									:label="item.name"
									:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="事务类型" prop="type">
							<el-select v-model="routineForm.type" placeholder="请选择事务类型" class="w-100" @change="typeChange">
								<el-option label="自办" value="1"></el-option>
								<el-option label="他办" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="routineForm.type == 2">
						<el-form-item label="" prop="send_json" class="payment_item">
							<div slot="label" class="d-flex justify-content-between">
								<span>流程参数</span>
								<span class="text-primary cursor-pointer" @click="addPro(progressArray)"><i class="el-icon-plus mr-1"></i>审核流程</span>
							</div>
							<template v-for="(cell,INDEX) in progressArray">
								<el-row type="flex" align="middle" :gutter="20" class="cell_row mb-3" :key="INDEX">
									<el-col :span="24">
										<el-select v-model="cell.check_ids" multiple placeholder="请选择人员" class="w-100" @change="changeCheck" @remove-tag="removeCheck">
											<el-option
												v-for="user in userOptions"
												:key="user.id"
												:label="user.name"
												:value="user.id"
												:disabled="user.isSelect">
											</el-option>
										</el-select>
									</el-col>
									<el-col :span="2" class="text-right">
										<span class="text-danger cursor-pointer" @click="delField(progressArray,INDEX)">删除</span>
									</el-col>
								</el-row>
							</template>
						</el-form-item>
					</el-col>

				</el-row>

				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="预计完成时间">
							<el-date-picker type="datetime" placeholder="选择完成时间，必须大于当前时间" :picker-options="expireTimeOption" v-model="routineForm.endtime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="提醒时间">
							<el-date-picker type="datetime" placeholder="选择提醒时间，必须大于当前时间" :picker-options="expireTimeOption" v-model="routineForm.remain_time" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="是否重复提醒" prop="is_repeat">
							<el-select v-model="routineForm.is_repeat" placeholder="请选择是否重复提醒" class="w-100">
								<el-option label="否" value="1"></el-option>
								<el-option label="是" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="routineForm.is_repeat == 2">
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
									:file-list="fileList"
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
					<el-button @click="closedEdit">取 消</el-button>
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
				routineId:'',
				title:"",
				accept: ".pdf,.doc,.docx,.xls,.xlsx,.zip",
				levelOptions:[],
				detailsOptions:[],
				userOptions:[],
				progressArray:[{}],
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
				fileList:[],
				expireTimeOption: {
					disabledDate(date) {
						//disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
						return date.getTime() < Date.now() - 24 * 60 * 60 * 1000;
					}
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
		watch:{
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
			// 所属类型change
			workTypeChange(val){
				if(val == 1){
					this.$api.routineProject({
						user_type:this.$cookies.get('application_type'),
						work_type:val,
					}).then(data=>{
						if(data.code == 0){
							this.detailsOptions = data.data;
						}
					})
				}else if(val == 2){
					this.$api.routineUser({
						type:this.$cookies.get('application_type'),
					}).then(data=>{
						if(data.code == 0){
							this.detailsOptions = data.data;
						}
					})
				}
			},
			// 事务类型change
			typeChange(){
				this.$api.routineUser({
					type:this.$cookies.get('application_type'),
				}).then(data=>{
					if(data.code == 0){
						this.userOptions = data.data;
						this.userOptions.map((item)=>{
							item.isSelect = false;
						})
					}
				})
			},
			// 流程人员选择
			changeCheck(val){
				this.userOptions.map((arr)=>{
					val.map((checkId)=>{
						if(checkId == arr.id){
							arr.isSelect = true;
						}
					})
				})
			},
			// 流程人员移除选择
			removeCheck(val){
				this.userOptions.map((arr)=>{
					if(val == arr.id){
						arr.isSelect = false;
					}
				})
			},
			// 添加审核流程
			addPro(item){
				item.push({});
			},
			// 删除字段
			delField(item,index){
				item.splice(index, 1);
			},
			
			// dialog初始化
			openEdit(){
				this.routineId = this.$route.query.id;
				if(this.routineId){
					this.title = "编辑事务";
					this.$api.routineEdit({
						function_type:1,
						id:this.routineId,
					}).then(data=>{
						this.workTypeChange(data.data.work_type);
						this.typeChange(data.data.type);

						this.routineForm = data.data;

						let arrList = [];
						for (let i in data.data.attach) {
							var obj = {};
							var a = data.data.attach[i].split("/");
							var b = a[a.length -1];
							obj.name = b;
							obj.url = this.$globalUrl.baseURL + data.data.attach[i];
							obj.path = data.data.attach[i];
							obj.isExist = true;
							arrList.push(obj);
						}
						this.fileList = arrList;

						var newProgress = new Array;
						data.data.send_json.map((item,index)=>{
							newProgress.push({check_ids:item.split(",").map(Number)});
						});
						this.progressArray = newProgress;
					})
				}else{
					this.title = "发起事务";
					var nowTime = this.$moment(new Date()).format('YYYYMMDDHHmm');
					this.routineForm.work_num = "W"+ nowTime; // 事务编号
				}
				this.initLevel();
			},
			// 关闭编辑
			closedEdit(){
				this.$router.go(-1);//返回上一层
			},

      // form提交
			submitForm(formName) {
				var jsonID = new Array;
				this.progressArray.map((item)=>{
					if(item.check_ids&&item.check_ids.length>0){
						jsonID.push(item.check_ids.join(","));
					}
				})
				this.routineForm.send_json = JSON.stringify( jsonID );
        this.$refs[formName].validate((valid) => {
          if (valid) {
						if(this.routineId){ // 编辑
							this.$api.routineEdit({
								function_type:2,
								id:this.routineId,
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
								attach:this.routineForm.attach.length>0?this.routineForm.attach.join(","):'',
								remark:this.routineForm.remark,
							}).then(data =>{
								if(data.code == 0){
									this.$message({
										message: "修改事务成功",
										type: 'success'
									});
									this.closedEdit();
								}else{
									this.$message.error(data.msg);
								}
							});
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
								attach:this.routineForm.attach.join(","),
								remark:this.routineForm.remark,
							}).then(data =>{
								if(data.code == 0){
									this.$message({
										message: data.msg,
										type: 'success'
									});
									this.closedEdit();
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

			/****  上传  ****/
			myUpload(params){
	      // 通过 FormData 对象上传文件
	      const formData = new FormData();
	      formData.append("work_num", this.routineForm.work_num);
	      formData.append("file", params.file);
	      formData.append("user_token", this.$cookies.get("application_token"));
				this.$api.routineUpload(formData).then(data =>{
					if(data.code == 0){
						// 回调成功的方法
						params.onSuccess(data);
						this.$message({
							message: data.msg,
							type: 'success'
						});
						this.routineForm.attach.push(data.data.path);
					}else{
						this.$message.error(data.msg);
					}
				}).catch(err => {
					params.onError(err)
				});
			},
      // 上传成功
			handleSuccess(res, file, fileList) {
				this.fileList = fileList;
      },
      // 移除上传文件
      handleRemove(file,fileList) {
      	var path;
      	if(file.isExist){ // 原先上传已存在的
      		path = file.path;
      	}else{ // 刚刚上传的
      		path = file.response.data.path;
      	}
      	this.$api.routineUploadDel({
      		path:path,
      	}).then(data =>{
					if(data.code == 0){
						// this.$refs.upload.abort(); //取消上传
						this.fileList = fileList;
						this.routineForm.attach.some((item, i)=>{
							if(item = path){
								this.routineForm.attach.splice(i, 1);
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
      	return true;
      },
		}
	}
</script>

<style>

</style>