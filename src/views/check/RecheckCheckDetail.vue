<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
				<!-- 项目基本信息 -->
		<el-card class="mt-3 bg-white" :body-style="{'padding-bottom':'0px'}">
			<h6 class="fs_18 font-weight-normal mb-3">项目基本信息</h6>
			<el-form label-width="140px" label-position="left" class="pl-3 pr-3">
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="项目编号">
							{{projectInfo.apply_number}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="项目名称">
							{{projectInfo.p_name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="申请类别">
							{{projectInfo.pname}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="申请人">
							{{projectInfo.name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="申请人所在部门">
							{{projectInfo.depart_name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="项目年份">
							{{projectInfo.projecttime}} 年
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="预算金额" v-if="projectInfo.budget_amount != 0">
							{{projectInfo.budget_amount}} 元
						</el-form-item>
					</el-col>
					<template v-for="(formItem,j) in projectInfo.dataJson">
						<el-col :span="24" :key="j" v-if="formItem.name_type == 5 || formItem.name_type == 13 || formItem.name_type == 14 || formItem.name_type == 15">
							<el-form-item :label="formItem.title">
								<div class="d-flex align-items-center justify-content-between mb-2" v-for="(file,index) in formItem.file_arr" :key="index">
									<div class="cursor-pointer view" @click="preview(file.path)" title="在线预览">
										<i class="el-icon-document mr-2"></i><span>{{file.name}}</span>
									</div>
									<div class="opacity-80 ml-5 pl-5">
										<i class="el-icon-view cursor-pointer view mr-3" @click="preview(file.path)"></i>
										<i class="el-icon-download cursor-pointer view" @click="downloadview(file)"></i>
									</div>
								</div>
							</el-form-item>
						</el-col>
						<el-col :span="24" :key="j" v-else-if="formItem.name_type == 12" >
							<el-form-item :label="formItem.title" class="json-form-item">
								<div class="w-100 d-flex align-items-center pb-1 mb-1" v-for="(cell,index) in formItem.value" :key="index">
									<p class="m-0 w-100 pl-2 pr-2" v-for="(item,k) in cell" :key="k">{{item}}</p>
								</div>
							</el-form-item>
						</el-col>
						<el-col :span="8" :key="j" v-else-if="formItem.name_type == 9 || formItem.name_type == 10">
							<el-form-item :label="formItem.title">
								{{formItem.value.join(",")}}
							</el-form-item>
						</el-col>
						<el-col :span="8" :key="j" v-else-if="formItem.name_type == 7">
							<el-form-item :label="formItem.title">
								<span v-html="formItem.value"></span>
							</el-form-item>
						</el-col>
						<el-col :span="8" :key="j" v-else>
							<el-form-item :label="formItem.title">
								{{formItem.value}}
							</el-form-item>
						</el-col>
					</template>
				</el-row>
			</el-form>
		</el-card>

		<!-- 项目评审信息 -->
		<el-card class="mt-3 bg-white">
			<h6 class="fs_18 font-weight-normal mb-3">项目评审信息</h6>
			<el-form :model="projectInfo" ref="projectInfo" label-width="110px" label-position="left" class="pl-3 pr-3">
				<el-row :gutter="20">
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
					<el-col :span="8">
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
			</el-form>
		</el-card>

		<!-- 审核信息 -->
		<el-card class="mt-3 bg-white" v-if="check_info.check_state != 1">
			<h6 class="fs_18 font-weight-normal mb-3">审核信息</h6>
			<el-form label-width="110px" label-position="left" class="pl-3 pr-3">
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
						<el-form-item label="审核部门">
							{{check_info.checkgroup}}
						</el-form-item>
					</el-col>
					<el-col :span="24">
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
		name: 'RecheckCheckDeatil',
		data () {
			return {
				ID:"",
				projectInfo: {},
				recheckInfo:{},
				check_info:{},
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
				this.ID = this.$route.query.id;
				this.$api.recheck_detail({
					id:this.ID,
					function_type:1,
				}).then(data =>{
					if(data.code == 0){
						// 项目基本信息
						this.projectInfo = data.data.info;
						this.projectInfo.dataJson = data.data.info.datajson;
						// 项目评审信息
						this.recheckInfo = data.data.project_recheck_info;
						this.detailInfo = data.data.project_recheck_detail_info;
						// 审核信息
						this.check_info = data.data.check_info;
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