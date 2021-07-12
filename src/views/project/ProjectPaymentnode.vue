<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<!-- 项目信息 -->
			<h6 class="fs_18 font-weight-normal mb-3">项目信息</h6>
			<el-form :model="projectInfo" ref="accept_info" label-width="110px" label-position="left" class="pl-3 pr-3">
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="项目编号">
							{{projectInfo.apply_number}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="项目名称">
							{{projectInfo.title}}
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="项目金额">
							{{projectInfo.money}}
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>

		<!-- 付款节点 -->
		<el-card class="mt-3 bg-white">
			<h6 class="fs_18 font-weight-normal mb-3">付款节点</h6>
			<el-form label-width="110px" label-position="left" class="pl-3 pr-3">
				<el-table :data="pay_list" :default-expand-all="true" :row-class-name="getRowClass">
					<el-table-column type="expand" label="" width="50">
						<template slot-scope="scope">
							<div class="d-flex align-items-center justify-content-between files_list" v-for="(file,index) in scope.row.files" :key="index">
								<div class="cursor-pointer view" @click="preview(file.path)" title="在线预览">
									<i class="el-icon-document mr-2"></i><span>{{file.name}}</span>
								</div>
								<div class="opacity-80">
									<i class="el-icon-view cursor-pointer view mr-3" @click="preview(file.path)"></i>
									<i class="el-icon-download cursor-pointer view" @click="downloadview(file)"></i>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="title" label="标题"></el-table-column>
					<el-table-column prop="money" label="金额"></el-table-column>
					<el-table-column prop="paytime" label="付款节点"></el-table-column>
					<el-table-column prop="is_pay" label="是否支付">
						<template slot-scope="scope">
							<span v-if="scope.row.is_pay == 1"><i class="dot bg-warning mr-1"></i>待支付</span>
							<span v-else-if="scope.row.is_pay == 2"><i class="dot bg-success mr-1"></i>已支付</span>
						</template>
					</el-table-column>
					<el-table-column prop="haspaytime" label="付款时间"></el-table-column>
					<el-table-column prop="remark" label="备注"></el-table-column>
					<el-table-column fixed="right" label="操作" width="150" align="center">
						<template slot-scope="scope">
							<template v-if="scope.row.is_pay == 1">
								<span @click="updatePay(scope.$index,scope.row)" class="text-primary cursor-pointer mr-3">更新付款信息</span>
							</template>
						</template>
					</el-table-column>
				</el-table>
			</el-form>
		</el-card>
		<set-paynode :payData="payData"></set-paynode>
	</div>
</template>

<script>
	import GlobalTips from "@/components/GlobalTips";
	import Breadcrumb from "@/components/Breadcrumb";
	import SetPaynode from "./SetPaynode";

	export default {
		name: 'ProjectPaymentnode',
		data () {
			return {
				projectId:'',
				projectInfo: {},
				pay_list:[],
				payData:{
          dialog:false,
          title:"",
          id:"",
					apply_number:"",
        },
			}
		},
		components: {
			GlobalTips,
			Breadcrumb,
			SetPaynode,
		},
		mounted(){
			this.openEdit();
		},
		provide() {
      return {
        loadData: this.openEdit
      }
    },
		methods:{
			// dialog初始化
			openEdit(){
				this.projectId = this.$route.query.id;
				this.$api.projectPayNode({
					id:this.projectId,
				}).then(data =>{
					if(data.code == 0){
						this.projectInfo = data.data;
						this.pay_list = data.data.pay_list;
					}else{
						this.$message.error(data.msg);
					}
				});
			},
			// 关闭编辑
			closedEdit(){
				this.$router.go(-1);//返回上一层
			},
			// 判断表格是否有子项，无子项不显示展开按钮
			getRowClass (row) {
				if (row.row.is_pay == 1) {
					return 'row-expand-cover'
				}
			},
			// 更新付款信息
			updatePay(index,row){
				this.payData.dialog = true;
        this.payData.title = '更新付款信息';
        this.payData.id = row.id;
				this.payData.apply_number = this.projectInfo.apply_number;
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