<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<!-- 项目信息 -->
			<h6 class="fs_18 font-weight-normal mb-3">项目信息</h6>
			<el-form :model="processInfo" ref="accept_info" label-width="110px" label-position="left" class="pl-3 pr-3">
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="验收编号">
							{{processInfo.accept_number}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="创建时间">
							{{processInfo.createtime}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="创建人">
							{{processInfo.job_number}}
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="验收列表">
							<div class="accept_info_detial mb-2" v-for="(info,i) in accept_info_detail" :key="i">
								<p>{{info.title}}</p>
								<div class="d-flex align-items-center justify-content-between" v-for="(file,index) in info.files" :key="index">
									<div class="cursor-pointer view" @click="preview(file.path)" title="在线预览">
										<i class="el-icon-document mr-2"></i><span>{{file.name}}</span>
									</div>
									<div class="opacity-80">
										<i class="el-icon-view cursor-pointer view mr-3" @click="preview(file.path)"></i>
										<i class="el-icon-download cursor-pointer view" @click="downloadview(file)"></i>
									</div>
								</div>
							</div>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			
			<!-- 审核信息 -->
			<div v-if="check_info.check_state != 1">
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
						<el-col :span="24">
							<el-form-item label="审核备注">
								{{check_info.remark}}
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
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
				ID:'',
				check_info:{},
				processInfo: {},
				accept_info_detail:[],
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
				this.$api.accept_detail({
					id:this.ID,
				}).then(data =>{
					if(data.code == 0){
						this.check_info = data.data.check_info;
						this.processInfo = data.data.accept_info;
						this.accept_info_detail = data.data.accept_info_detial;
					}else{
						this.$message.error(data.msg);
					}
				});
			},
			// 预览文件
			preview(path){
				this.$api.file_preview({
					path:path,
				}).then(data=>{
					if(data.code == 0){
						let a = document.createElement('a');
						a.style = 'display: none'; // 创建一个隐藏的a标签
						a.target = "_blank";
						a.href = data.data;
						document.body.appendChild(a);
						a.click();
					}else{
						this.$message.error(data.msg)
					}
				})
			},
			// 下载文件
			downloadview(file){
				let a = document.createElement('a'); 
				a.style = 'display: none'; // 创建一个隐藏的a标签
				a.download = file.name;
				a.href = this.$globalUrl.baseURL + file.path;
				document.body.appendChild(a);
				a.click(); // 触发a标签的click事件
				document.body.removeChild(a);
			},
		}
	}
</script>

<style>

</style>