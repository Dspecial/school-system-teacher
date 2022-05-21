<template>
	<el-dialog
	  :title="resourceData.title"
	  :visible.sync="resourceData.dialog"
	  width="50%" top="10vh"
	  @open="openEdit"
	  @closed="closedEdit('resourceForm')"
	  :before-close="handleClose">
	  <el-form :model="resourceForm" :rules="rules" ref="resourceForm" label-width="110px" label-position="left">
	  	<div class="resourceAdd_form mb-3 pl-3 pr-3 pt-3">
	  		<h4 class="fs_18 font-weight-semibold m-0 mb-3 text-primary">基础信息</h4>
			  <el-row :gutter="20">
				  <el-col :span="24">
				  	<el-form-item label="资源名称" prop="name">
					  	<el-input v-model="resourceForm.name" placeholder="请输入资源名称"></el-input>
					  </el-form-item>
					</el-col>
					<el-col :span="12">
					  <el-form-item label="数量" prop="number">
					  	<el-input v-model.number="resourceForm.number" placeholder="请输入数量"></el-input>
					  </el-form-item>
					</el-col>
					<el-col :span="12">
				  	<el-form-item label="供应商">
					    <el-select v-model="resourceForm.supplier_id" clearable filterable placeholder="请选择供应商" class="w-100">
					    	<template v-for="(item,index) in supplierOptions">
					    		<el-option :label="item.name" :value="item.id"></el-option>
					    	</template>
					    </el-select>
					  </el-form-item>
					</el-col>
					<el-col :span="12">  
					  <el-form-item label="所属分类" prop="cate_id">
					    <el-cascader class="w-100" v-model="resourceForm.cate_id" placeholder="请选择所属分类" :show-all-levels="false" clearable :options="cateOptions" :props="{value:'id',label:'cate_name',children:'children',checkStrictly: true}" @change="handleChange">
					    </el-cascader>
					  </el-form-item>
					</el-col>
					<el-col :span="12">
					  <el-form-item label="是否使用" prop="is_use">
					  	<el-radio-group v-model="resourceForm.is_use">
						    <el-radio :label="'1'">使用中</el-radio>
						    <el-radio :label="'2'">已禁用</el-radio>
						  </el-radio-group>
					  </el-form-item>
					</el-col>
					<el-col :span="12">
					  <el-form-item label="使用类型" prop="type">
					  	<el-radio-group v-model="resourceForm.type">
						    <el-radio :label="'1'">永久</el-radio>
						    <el-radio :label="'2'">临时</el-radio>
						  </el-radio-group>
					  </el-form-item>
					</el-col>
					<el-col :span="12" v-if="resourceForm.type == '2'">
					  <el-form-item label="使用结束时间" prop="usetime">
					    <el-date-picker v-model="resourceForm.usetime" type="date" clearable placeholder="选择使用结束时间" value-format="yyyy-MM-dd" class="w-100"></el-date-picker>
					  </el-form-item>
					</el-col>
					<el-col :span="24">
					  <el-form-item label="备注" prop="remark">
					  	<el-input type="textarea" v-model="resourceForm.remark" placeholder="请输入备注" :autosize="{ minRows: 3, maxRows: 8 }"></el-input>
					  </el-form-item>
					</el-col>
				</el-row>
		  </div>

		  <div class="resourceAdd_form mb-3 pl-3 pr-3 pt-3" v-if="isExpand">
		  	<h4 class="fs_18 font-weight-semibold m-0 mb-3 text-primary">拓展参数</h4>
		  	<el-row :gutter="20">
				  <div v-for="(field, index) in resourceForm.fieldArray" :key="index">
				  	<!-- 字段类型:1=文本框,2=数字框,3=下拉单选,4=日期选择,5=文件上传,6=文本域 -->
						<el-col :span="8" v-if="field.name_type == 1">
				  		<el-form-item :label="field.title" :required="field.is_required == 2">
						  	<el-input v-model="field.val" :placeholder="field.placeholder == ''?'请输入'+field.title:field.placeholder"></el-input>
						  </el-form-item>
						</el-col>

				  	<el-col :span="8" v-if="field.name_type == 2">
				  		<el-form-item :label="field.title" :required="field.is_required == 2">
						  	<el-input v-model.number="field.val" :placeholder="field.placeholder == ''?'请输入'+field.title:field.placeholder"></el-input>
						  </el-form-item>
				  	</el-col>

				  	<el-col :span="8" v-if="field.name_type == 3">
				  		<el-form-item :label="field.title" :required="field.is_required == 2">
						  	<el-select v-model="field.val" :placeholder="field.placeholder == ''?'请选择'+field.title:field.placeholder" class="w-100" clearable>
						      <el-option v-for="(option,j) in field.extra_val" :label="option" :value="option" :key="j"></el-option>
						    </el-select>
						  </el-form-item>
				  	</el-col>
				  	<el-col :span="8" v-if="field.name_type == 4">
				  		<el-form-item :label="field.title" :required="field.is_required == 2">
						  	<el-date-picker v-model="field.val" type="date" :placeholder="field.placeholder == ''?'请选择'+field.title:field.placeholder" clearable class="w-100"></el-date-picker>
						  </el-form-item>
				  	</el-col>

				  	<el-col :span="24" v-if="field.name_type == 5">
				  		<el-form-item :label="field.title" :required="field.is_required == 2">
						    <el-upload
								  action="#"
								  drag
								  :auto-upload="false"
								  :on-success="handleAvatarSuccess"
								  :before-upload="beforeAvatarUpload">
								  <i class="el-icon-upload"></i>
								  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
								  <!-- <div class="el-upload__tip opacity-60" slot="tip">注：</div> -->
								</el-upload>
						  </el-form-item>
				  	</el-col>

				  	<el-col :span="24" v-if="field.name_type == 6">
				  		<el-form-item :label="field.title" :required="field.is_required == 2">
						  	<el-input type="textarea" v-model="field.val" :placeholder="field.placeholder == ''?'请输入'+field.title:field.placeholder" :autosize="{ minRows: 3, maxRows: 8 }"></el-input>
						  </el-form-item>
				  	</el-col>
				  </div>
				</el-row>
			</div>

		  <div class="text-center">
		  	<el-button @click="closedEdit('resourceForm')">取 消</el-button>
	    	<el-button type="primary" @click="submitForm('resourceForm')">确 定</el-button>
		  </div>
	  </el-form>
	</el-dialog>
</template>

<script>
	const isNum = (rule, value, callback) => {
		if (!value) {
      return callback(new Error('数量不能为空'));
    } else {
      const reg = /^[0-9]*$/
      if (reg.test(value)) {
        callback();
      } else {
        return callback(new Error('数量只能为数字'));
      }
    }
  }

	export default {
		name: 'HosterResourceEdit',
		props: ['resourceData'],
		inject: ['loadData'],
		data () {
			return {
				// 新增
				resourceForm:{
					id:"",
					name:"",
					number:"",
					supplier_id:"",
					cate_id:"",
					is_use:"2", // 默认2禁用
					remark:"",
					type:"2",
					usetime:"",
					fieldArray:[],
				},
				supplierOptions:[],
				cateOptions:[],
				rules: {
          name: [
            { required: true, message: '请输入资源名称', trigger: 'blur' }
          ],
          number: [
            { required: true, validator: isNum, trigger: 'blur' },
          ],
          supplier_id: [
            { required: true, message: '请选择供应商', trigger: 'change' }
          ],
          cate_id: [
            { required: true, message: '请选择所属分类', trigger: 'change' }
          ],
					type: [
            { required: true, message: '请选择使用类型', trigger: 'change' }
          ],
					usetime: [
            { required: true, message: '请选择使用结束时间', trigger: 'change' }
          ],
        },
        isExpand:false,// 是否显示拓展参数
			}
		},
		components: {},
		mounted(){
			this.initSupplierOptions();
			this.initCateOptions();

		},
		methods:{
			handleChange(value){
				if(value.length > 2){
					this.isExpand = true;
					var cate_id = value[value.length-1]
					this.initParams(cate_id);
				}else{
					this.isExpand = false;
				}
			},
			// 获取供应商
			initSupplierOptions(){
				this.$api.getResource_supplier({
        }).then(data=>{
          if(data.code == 0){
            this.supplierOptions = data.data;
          }else{
            this.$message.error(data.msg);
          }
        });
			},

			// 获取分类
			initCateOptions(){
				this.$api.getResource_cate({
        }).then(data=>{
          if(data.code == 0){
            this.cateOptions = data.data;
          }else{
            this.$message.error(data.msg);
          }
        });
			},

			// 获取自定义参数
			initParams(cate_id){
				this.$api.getResource_cateParamsOption({
					cate_id:cate_id,
					function_type:1,
        }).then(data=>{
          if(data.code == 0){
            this.resourceForm.fieldArray = data.data;
          }else{
            this.$message.error(data.msg);
          }
        });
			},

			// 上传成功
			handleAvatarSuccess(res, file) {
        // this.imageUrl = URL.createObjectURL(file.raw);
      },
      // 上传前验证
      beforeAvatarUpload(file) {
        const isPic = file.type === 'image/gif' || file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
        const isLt = file.size / 1024  < 100;
        if (!isPic) {
          this.$message.error('上传头像图片只能是 GIF、JPG、JPEG、PNG 格式!');
          return isPic
        }
        if (!isLt) {
          this.$message.error('上传Logo图片大小不能超过 100kb!');
          return isLt
        }
        return isPic && isLt;
      },

			// dialog初始化
			openEdit(){
				if(this.resourceData.isEdit){ // 编辑
					this.$api.hosterResourceEdit({
						id:this.resourceData.id,
						function_type:2,
					}).then(data => {
						if(data.code == 0){
							this.resourceForm.id = data.data.id;
							this.resourceForm.name = data.data.name;
							this.resourceForm.number = data.data.number;
							this.resourceForm.supplier_id = data.data.supplier_id;
							this.resourceForm.type = data.data.type;
							this.resourceForm.usetime = data.data.usetime != 0?data.data.usetime:"";
							this.resourceForm.remark = data.data.remark;

							if(data.data.is_use == 1){
								this.resourceForm.is_use = '1'; // 使用中
							}else{
								this.resourceForm.is_use = '2'; // 禁用
							}

							var all_parent = data.data.all_parent;
							var new_arr = all_parent.map(obj => {
	          		return obj.id
	          	});
	          	var cataId = new_arr.reverse();
							this.resourceForm.cate_id = cataId;

							if(all_parent.length > 2){
								this.isExpand = true;
								this.resourceForm.fieldArray = data.data.detailjson
							}
						}else{
							this.$message.error(data.msg);
						}
					})
				}else{ // 新增
					
				}
			},
			// dialog关闭
			closedEdit(formName){
				this.handleClose();
				this.resetForm(formName);
			},
			// 右上角x关闭
			handleClose(){
				this.resourceData.dialog = false;
				this.isExpand = false;
			},

			// form提交
			submitForm(formName) {
				var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
          	var cate_id = this.resourceForm.cate_id[this.resourceForm.cate_id.length - 1];
          	var fieldArray = this.resourceForm.fieldArray;
          	var new_arr = fieldArray.map(obj => {
          		return {
          			"name":obj.name,
          			"val":obj.val
          		}
          	});
          	
          	if(this.resourceData.isEdit){ // 编辑后提交
          		this.$api.hosterResourceEdit({
          			id:this.resourceForm.id,
								name:this.resourceForm.name,
								number:this.resourceForm.number,
								supplier_id:this.resourceForm.supplier_id,
								cate_id:cate_id,
								is_use:this.resourceForm.is_use,
								type:this.resourceForm.type,
								usetime:this.resourceForm.usetime,
								remark:this.resourceForm.remark,
								detailjson:JSON.stringify(new_arr),
								function_type:1,
							}).then(data => {
								if(data.code == 0){
									_this.handleClose();
									_this.resetForm(formName);
									_this.loadData();
								}else{
									this.$message.error(data.msg);
								}
							});

          	}else{ // 新增后提交
          		this.$api.hosterResourceAdd({
								name:this.resourceForm.name,
								number:this.resourceForm.number,
								supplier_id:this.resourceForm.supplier_id,
								cate_id:cate_id,
								is_use:this.resourceForm.is_use,
								type:this.resourceForm.type,
								usetime:this.resourceForm.usetime,
								remark:this.resourceForm.remark,
								detailjson:JSON.stringify(new_arr),
							}).then(data => {
								if(data.code == 0){
									_this.handleClose();
									_this.resetForm(formName);
									_this.loadData();
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
      }
		},
	}
</script>

<style>

</style>