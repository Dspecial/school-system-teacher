<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<!-- 资源详情 -->
			<el-form :model="resourceDetail" ref="resourceDetail" label-width="110px" label-position="left" class="pl-3 pr-3">
				<h6 class="fs_20 font-weight-normal mb-3">资源详情</h6>
				<el-row :gutter="20">
          <el-col :span="8">
						<el-form-item label="项目名称">
							{{resourceDetail.p_name}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="资源名称">
							{{resourceDetail.name}}
						</el-form-item>
					</el-col>
          <el-col :span="8">
						<el-form-item label="审核状态">
              <span class="text-primary" v-if="resourceDetail.status == 1">待确认</span>
              <span class="text-warning" v-else-if="resourceDetail.status == 2">待审核</span>
              <span class="text-success" v-else-if="resourceDetail.status == 3">审核成功</span>
							<span class="text-danger" v-else-if="resourceDetail.status == 4">审核失败</span>
							<span class="text-cyan" v-else-if="resourceDetail.status == 5">已回收</span>
						</el-form-item>
					</el-col>
          <el-col :span="8">
						<el-form-item label="申请时间">
							{{resourceDetail.applytime}}
						</el-form-item>
					</el-col>
          <el-col :span="8">
						<el-form-item label="审核时间">
							{{resourceDetail.checktime}}
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="资源备注">
							{{resourceDetail.re_remark}}
						</el-form-item>
					</el-col>
          <el-col :span="24">
						<el-form-item label="审核备注">
							{{resourceDetail.remark}}
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="资源详细参数">
              <el-row :gutter="20" class="re_detail_json" v-if="details.length > 0">
								<el-col :span="6" v-for="(item,index) in details" :key="index" class="pl-3 pr-3 pt-2 pb-2">
									<p class="mb-2 text-primary">{{item.title}}</p>
									<p class="m-0">{{item.val}}</p>
								</el-col>
							</el-row>
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
		name: 'ResourceDetail',
		data () {
			return {
				id:'', // 复核id
				projectId:'',
				check_info:"",
				resourceDetail: {},
				details:[],
				checkform:{
					check_state:"",
					remark:"",
				},
				rules:{
					check_state:[
						{ required: true, message: '请选择审核状态', trigger: 'change' }
					],
				},
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
				this.id = this.$route.query.id;
				this.$api.resourceDetail({
					id:this.id,
				}).then(data =>{
					if(data.code == 0){
						this.resourceDetail = data.data;
						this.details = data.data.resource_info.detailjson;
					}else{
						this.$message.error(data.msg);
					}
				});
			},
			// 关闭编辑
			closedEdit(){
				this.$router.go(-1);//返回上一层
			},
		}
	}
</script>

<style>

</style>