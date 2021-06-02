<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<!-- 项目信息 -->
			<el-form :model="recheckInfo" ref="recheckInfo" label-width="110px" label-position="left" class="pl-3 pr-3">
				<h6 class="fs_20 font-weight-normal mb-3">项目复审信息</h6>
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="项目名称">
							{{recheckInfo.p_name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="评审编号">
							{{recheckInfo.recheck_number}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="创建人">
							{{recheckInfo.name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="创建时间">
							{{recheckInfo.createtime}}
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="评审概要">
							{{recheckInfo.content}}
						</el-form-item>
					</el-col>

					<el-col :span="24">
						<el-form-item label="评审信息">
							<template>
								<el-table
									:data="detailInfo"
									style="width: 100%">
									<el-table-column
										prop="e_name"
										label="评审人">
									</el-table-column>
									<el-table-column
										prop="content"
										label="评审内容">
									</el-table-column>
									<el-table-column
										prop="is_pass"
										label="是否通过">
										<template slot-scope="scope">
											<span v-if="scope.row.is_pass == 1"><i class="dot bg-success mr-1"></i>通过</span>
											<span v-else><i class="dot bg-danger mr-1"></i>不通过</span>
										</template>
									</el-table-column>
								</el-table>
							</template>
						</el-form-item>
					</el-col>
				</el-row>

				<!-- 已审核信息 -->
				<el-row :gutter="20" v-if="check_info.check_state != 1">
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
						<el-form-item label="审核部门">
							{{check_info.checkgroup}}
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
		props:['editData'],
		name: 'RecheckCheck',
		data () {
			return {
				id:'', // 评审id
				projectId:'',
				check_info:{},
				projectInfo: {},
				recheckInfo:{},
				detailInfo:[],
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
				this.projectId = this.$route.query.project_id;
				this.id = this.$route.query.id;
				this.$api.recheck_detail({
					id:this.id,
					project_id:this.projectId,
					function_type:1,
				}).then(data =>{
					if(data.code == 0){
						this.check_info = data.data.check_info;
						this.projectInfo = data.data.project_info;
						this.recheckInfo = data.data.project_recheck_info;
						this.detailInfo = data.data.project_recheck_detail_info;
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