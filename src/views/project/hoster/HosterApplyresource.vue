<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<h6 class="fs_18 font-weight-normal mb-3">项目申请资源</h6>
			<el-form :model="applyForm" :rules="rules" ref="applyForm" label-width="110px" label-position="top" class="pl-3 pr-3">
				<el-row :gutter="20">
					<el-col :span="24">
						<el-form-item label="项目名称" prop="project_id">
              <el-input v-model="applyForm.p_name" placeholder="请输入项目名称" readonly></el-input>
						</el-form-item>
					</el-col>
          <el-col :span="24">
						<el-form-item label="申请资源备注">
							<el-input type="textarea" v-model="applyForm.apply_remark" placeholder="请输入申请资源备注" :rows="3"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<div class="d-flex justify-content-end">
					<el-button type="primary" @click="submitForm('applyForm')">确 定</el-button>
					<el-button @click="closedEdit">取 消</el-button>
				</div>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import GlobalTips from "@/components/GlobalTips";
	import Breadcrumb from "@/components/Breadcrumb";

	export default {
		props:['editData'],
		name: 'ProjectEdit',
		data () {
			return {
				cateOptions:[],
				applyForm: {
          project_id:"",
          p_name:"",
					apply_remark:"",
        },
        rules: {
					project_id: [
            { required: true, message: '请选择项目类别', trigger: 'change' }
          ],
        }
			}
		},
		components: {
			GlobalTips,
			Breadcrumb,
		},
		mounted(){
			this.openEdit();
		},
		methods:{
			// 获取项目名称
			initPro(){
				this.$api.hosterDetail({
					id:this.$route.query.id
				}).then(data => {
					if(data.code == 0){
						this.applyForm.p_name = data.data.info.p_name;
					}
				})
			},
			// dialog初始化
			openEdit(){
				this.applyForm.project_id = this.$route.query.id;
				this.initPro();
			},
			// 关闭编辑
			closedEdit(){
				this.$router.go(-1);//返回上一层
			},
      // form提交
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
          if (valid) {
						this.$api.hoster_apply_resource({
              project_id:this.applyForm.project_id,
              apply_remark:this.applyForm.apply_remark,
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
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
		}
	}
</script>

<style>

</style>