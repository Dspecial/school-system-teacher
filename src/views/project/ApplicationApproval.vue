<template>
	<el-dialog
	  :title="applicationApproval.title"
	  :visible.sync="applicationApproval.dialog"
	  width="40%"
	  @open="openEdit"
	  @closed="closedEdit"
	  :before-close="handleClose">
		<el-steps direction="vertical" :space="100" :active="stepActive" finish-status="success" class="steps-approval">
			<template v-for="(step,index) in stepList">
				<el-step>
					<div slot="title" class="">{{step.type == 0?'审批通过':step.type == 1?'待修改':step.type == 2?'待审核':step.type == 3?'待确认':''}}</div>
					<div slot="description" class="d-flex align-items-center fs_14">
						<span class="mr-3" v-if="step.time">{{step.time}}</span>
						<span class="mr-3">{{step.dept}}：{{step.person}}</span>
						<span v-if="step.type == 0 || step.type == 1">问题描述：<span :class="[step.type == 1?'text-danger':'']">{{step.description}}</span></span>
					</div>
				</el-step>
			</template>
	  </el-steps>

	  <span slot="footer" class="dialog-footer">
	    <el-button @click="closedEdit('projectForm')">取 消</el-button>
	    <el-button type="primary" @click="submitForm('projectForm')">确 定</el-button>
	  </span>
	</el-dialog>
</template>

<script>
	export default {
		props:['applicationApproval'],
		inject: ['loadData'],
		name: 'ApplicationApproval',
		data () {
			return {
				stepList:[
					{
						type:"0",// 0:审批通过；1:待修改；2:待审核；3：待确认
						time:"2020-12-28",
						dept:"教务处",
						person:"DK3D 张三",
						description:"无"
					},
					{
						type:"1",// 0:审批通过；1:待修改；2:待审核；3：待确认
						time:"2020-12-28",
						dept:"学工处",
						person:"L6589 李四",
						description:"缺少xxx文件，补充后提交"
					},
					{
						type:"2",// 0:审批通过；1:待修改；2:待审核；3：待确认
						time:"",
						dept:"学院领导",
						person:"DKDFG 王铮",
						description:""
					},
					{
						type:"2",// 0:审批通过；1:待修改；2:待审核；3：待确认
						time:"",
						dept:"校领导",
						person:"BHK11 刘思",
						description:""
					},
					{
						type:"3",// 0:审批通过；1:待修改；2:待审核；3：待确认
						time:"2020-12-28",
						dept:"发起人",
						person:"c58751 王柳",
						description:""
					},
				],
				stepActive:1, // 到了第二步
			}
		},
		components: {},
		methods:{
			// dialog初始化
			openEdit(){
			},
			// dialog关闭
			closedEdit(){
				this.handleClose();
			},
			// 右上角x关闭
			handleClose(){
				this.applicationApproval.dialog = false;
			},
		}
	}
</script>

<style>

</style>