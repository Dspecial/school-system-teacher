<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<!-- 项目信息 -->
			<el-form :model="processInfo" ref="processInfo" label-width="110px" label-position="left" class="pl-3 pr-3">
				<h6 class="fs_20 font-weight-normal mb-3">项目信息</h6>
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="项目名称">
							{{processInfo.project_name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="进度编号">
							{{processInfo.process_number}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="进度标题">
							{{processInfo.title}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="上传企业">
							{{processInfo.name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="审核状态">
							<span class="text-warning" v-if="check_info.check_state == 1">待审核</span>
							<span class="text-success" v-else-if="check_info.check_state == 2">审核成功</span>
							<span class="text-danger" v-else-if="check_info.check_state == 3">审核失败</span>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="项目申请人">
							{{processInfo.apply_name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="申请人部门">
							{{processInfo.apply_depart_name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="创建时间">
							{{processInfo.createtime}}
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="进度内容">
							{{processInfo.content}}
						</el-form-item>
					</el-col>
				</el-row>	
			</el-form>

			<!-- 审核信息 -->
			<el-form class="pl-3 pr-3" label-width="110px" label-position="left" v-if="check_info.check_state != 1">
				<h6 class="fs_20 font-weight-normal mb-3">审核信息</h6>
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="审核人">
							{{check_info.checkname}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="审核时间">
							{{check_info.checktime}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="审核备注">
							{{check_info.remark}}
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import GlobalTips from "@/components/GlobalTips";
	import Breadcrumb from "@/components/Breadcrumb";
	export default {
		name: 'ProcessDetail',
		data () {
			return {
				projectId:'',
				check_info:{},
				processInfo: {},
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
			// dialog初始化
			openEdit(){
				this.projectId = this.$route.query.id;
				this.$api.process_detail({
					id:this.projectId,
				}).then(data =>{
					if(data.code == 0){
						this.check_info = data.data.check_info;
						this.processInfo = data.data.info;
					}else{
						this.$message.error(data.msg);
					}
				});
			},
		}
	}
</script>

<style>

</style>