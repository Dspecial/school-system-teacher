<template>
	<div class="index-container">
		<!-- 资源概况 -->
		<div class="w-100">
			<h4 class="fs_16 font-weight-semibold m-0 mb-3 text-000">资源概况</h4>
			<el-row :gutter="20">
				<template v-for="(item,index) in resources">
					<el-col :span="6" :key="index">
						<el-card>
							<div class="d-flex align-items-center justify-content-center p-2">
								<img :src="item.src" alt="" width="80" height="80">
								<div class="ml-3 text-center">
									<span class="mb-2 d-inline-block">{{item.title}}</span>
									<p class="m-0 fs_20">{{item.num}}/{{item.total}}</p>
								</div>
							</div>
						</el-card>
					</el-col>
				</template>
			</el-row>	
		</div>

		<!-- 我的项目--状态统计 -->
		<el-card class="mt-3">
			<h4 class="fs_16 font-weight-semibold m-0 mb-3 text-000">我的项目</h4>
			<el-row :gutter="20" type="flex">
				<template v-for="(status,index) in statusList">
					<el-col class="text-center status-item" :key="index">
						<span class="mb-2 d-inline-block opacity-60">{{status.title}}</span>
						<p class="m-0 fs_24">{{status.num}}/{{statusTotal}}</p>
					</el-col>
				</template>
			</el-row>
		</el-card>

		<el-row :gutter="20" class="mt-3">
			<!-- 信息处理 -->
			<el-col :span="12">
				<el-card :body-style="{ padding: '0px' }">
					<div class="d-flex justify-content-between align-items-center isCell">
						<h4 class="fs_16 font-weight-semibold m-0 text-000">信息处理</h4>
						<div class="tab_nav">
							<template v-for="(nav,index) in handleNav">
								<span :key="index" :class="['cursor-pointer ml-3',handleNavIndex == nav.id?'active':'']" @click="handleTab(nav.id)">{{nav.title}}</span>
							</template> 
						</div>
					</div>
					<div class="tab_content">
						<el-row class="isCell handleType">
							<template v-for="(type,index) in handleType">
								<el-col :span="8" class="text-center" :key="index">
									<p class="m-0 fs_30 mb-3">{{type.num}}/{{type.total}}</p>
									<span>{{type.typeName}}</span>
								</el-col>
							</template>
						</el-row>
						<el-table :data="handleData" class="mt-3">
				      <el-table-column type="index" :index="indexMethod" label="编号"></el-table-column>
				      <el-table-column prop="date" label="日期" width="90"></el-table-column>
				      <el-table-column prop="type" label="类别"></el-table-column>
				      <el-table-column prop="title" label="标题" width="140"></el-table-column>
				      <el-table-column prop="dept" label="发出部门"></el-table-column>
				      <el-table-column prop="sender" label="发出人"></el-table-column>
				      <el-table-column prop="status" label="状态"></el-table-column>
				      <el-table-column fixed="right" label="操作" width="100">
					      <template slot-scope="scope">
					      	<div class="text-success cursor-pointer">
						        <i class="el-icon-view"></i>
						        <i class="el-icon-circle-check ml-2"></i>
						        <i class="el-icon-notebook-2 ml-2"></i>
					        </div>
					      </template>
					    </el-table-column>
				    </el-table>
					</div>
				</el-card>
			</el-col>
			<!-- 付款信息 -->
			<el-col :span="12">
				<el-card :body-style="{ padding: '0px' }">
					<div class="d-flex justify-content-between align-items-center isCell">
						<h4 class="fs_16 font-weight-semibold m-0 text-000">付款信息</h4>
						<div class="tab_nav">
							<template v-for="(year,index) in handleYear">
								<span :key="index" :class="['cursor-pointer ml-3',handleYearIndex == year.id?'active':'']" @click="handleYearTab(year.id)">{{year.title}}</span>
							</template> 
						</div>
					</div>
					<div class="tab_content" style="padding: 20px">
						<my-echart :id="'echarts'" :data="option" height="335px"></my-echart>
					</div>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import BaseEcharts from "@/components/echarts/BaseEcharts"
	export default {
		name: 'Index.vue',
		components: {
			"my-echart":BaseEcharts
		},
		data () {
			return {
				// 资源概况
				resources:[
					{
						src:require("@/assets/images/index-resource1.png"),
						title:"完成项目",
						num:"3",
						total:"5"
					},
					{
						src:require("@/assets/images/index-resource2.png"),
						title:"IP分配(个)",
						num:"5",
						total:"20"
					},
					{
						src:require("@/assets/images/index-resource3.png"),
						title:"场地(m²)",
						num:"100",
						total:"1000"
					},
					{
						src:require("@/assets/images/index-resource4.png"),
						title:"服务器(台)",
						num:"8",
						total:"100"
					},
				],
				statusTotal:"16",
				// 状态统计
				statusList:[
					{
						title:"所有项目",
						num:"8",
					},
					{
						title:"项目初审",
						num:"8",
					},
					{
						title:"项目复审",
						num:"8",
					},
					{
						title:"项目实施",
						num:"8",
					},
					{
						title:"项目验收",
						num:"8",
					},
					{
						title:"项目维保",
						num:"8",
					},
				],
				// 信息处理Tab
				handleNav:[
					{
						id:0,
						title:"全部",
					},
					{
						id:1,
						title:"警报",
					},
					{
						id:2,
						title:"审批",
					},{
						id:3,
						title:"信息",
					},
				],
				// 默认选中的tab
				handleNavIndex:"1",
				handleType:[
					{
						typeName:"待处理",
						num:"8",
						total:"100",
					},
					{
						typeName:"处理中",
						num:"10",
						total:"22",
					},
					{
						typeName:"已完结",
						num:"20",
						total:"20",
					},
				],
				handleData: [
					{
	          date: "2020.12.20",
	          type: "审批",
	          title: "xx项目申请服务器",
	          dept:"学工处",
	          sender: '王小虎',
	          status: "未处理",
	        }, 
	        {
	          date: "2020.12.20",
	          type: "审批",
	          title: "xx项目申请服务器",
	          dept:"学工处",
	          sender: '王小虎',
	          status: "未处理",
	        },
	        {
	          date: "2020.12.20",
	          type: "审批",
	          title: "xx项目申请服务器",
	          dept:"学工处",
	          sender: '王小虎',
	          status: "未处理",
	        },
	        {
	          date: "2020.12.20",
	          type: "审批",
	          title: "xx项目申请服务器",
	          dept:"学工处",
	          sender: '王小虎',
	          status: "未处理",
	        },
	        {
	          date: "2020.12.20",
	          type: "审批",
	          title: "xx项目申请服务器",
	          dept:"学工处",
	          sender: '王小虎',
	          status: "未处理",
	        }
	      ],

	      // 信息处理Tab
				handleYear:[
					{
						id:"",
						title:"总计",
					},
					{
						id:new Date().getFullYear(),
						title:new Date().getFullYear() + '年',
					},
					{
						id:new Date().getFullYear()-1,
						title:new Date().getFullYear()-1 + '年',
					},
					{
						id:new Date().getFullYear()-2,
						title:new Date().getFullYear()-2 + '年',
					},
				],
				// 默认选中的年份tab
				handleYearIndex:"2021",
				// 图
				option:{
					title: {
            text: '项目合同总金额',
            subtext:"\n100000 元",
            x: 'center',
            y: '125',
            textStyle: {
              fontStyle: 'normal', //字体风格,'normal','italic','oblique'
              fontWeight: '500', //字体粗细
              fontSize: 14,
            },
            subtextStyle:{
            	color: '#005DDA',
              fontWeight: '500', //字体粗细
              fontSize: 20,
            },
          },
			    tooltip: {
		        trigger: 'item',
		        formatter: '{a} <br/>{b} : {c} ({d}%)'
			    },
			    legend: {
		        orient: 'horizontal',
		        x: 'center',
		        bottom: '0',
		        icon: 'circle',
		        itemWidth: 10,
		        data: ['未付款', '已付款']
			    },
			    series: [
		        {
	            name: '资金',
	            type: 'pie',
	            radius: ['50%', '70%'],
	            center: ['50%', '48%'],
	            label: {
                formatter: `{b|{b}：}{c} 元 {per|{d}%}`,
                fontSize: 16,
                rich: {
                  per: {
                    color: '#eee',
                    backgroundColor: '#334455',
                    padding: [6, 6],
                    borderRadius: 4,
                  }
                }
            	},
	            data: [
                {value: 7000, name: '未付款'},
                {value: 3000, name: '已付款'},
	            ],
	            hoverOffset:5,
	            emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
	            }
		        }
			    ]
				},
			}
		},
		mounted(){
			this.initState();
			this.initPay();
		},
		methods:{
			handleTab(id){
				this.handleNavIndex = id; 
			},
			handleYearTab(year){
				this.handleYearIndex = year; 
				this.initPay(year);
			},
			indexMethod(index) { //自增序列
        return ++index;
      },
			// 获取状态统计
			initState(){
				this.$api.dashboard_state({
				}).then(data=>{
					if(data.code == 0){
						this.statusTotal = data.data.all_count;
						this.statusList[0].num = data.data.all_count; // 所有
						this.statusList[1].num = data.data.first_count; // 初审
						this.statusList[2].num = data.data.recheck_count; // 复审
						this.statusList[3].num = data.data.process_count; // 实施
						this.statusList[4].num = data.data.accept_count; // 验收
						this.statusList[5].num = data.data.extend_count; // 维保
					}
				})
			},
			// 获取首页获取付款信息
			initPay(year){
				this.$api.dashboard_pay({
					year:year
				}).then(data=>{
					if(data.code == 0){
						this.option = {
							title:{
								subtext:'\n' + data.data.all_money + '元'
							},
							series:[{
								data:data.data.name_value
							}],
						};
					}
				})
			},
		},
	}
</script>

<style>

</style>