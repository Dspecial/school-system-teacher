<template>
	<div class="index-container">
		<!-- 资源概况 -->
		<div class="w-100">
			<h4 class="fs_16 font-weight-semibold m-0 mb-3 text-000">资源概况</h4>
			<el-row :gutter="20">
				<template v-for="item in resources">
					<el-col :span="6">
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

		<!-- 状态统计 -->
		<el-card class="mt-3">
			<h4 class="fs_16 font-weight-semibold m-0 mb-3 text-000">状态统计</h4>
			<el-row :gutter="20" type="flex">
				<template v-for="status in statusList">
					<el-col class="text-center status-item">
						<span class="mb-2 d-inline-block opacity-60">{{status.title}}</span>
						<p class="m-0 fs_24">{{status.num}}/{{status.total}}</p>
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
								<span :class="['cursor-pointer ml-3',handleNavIndex == nav.id?'active':'']" @click="handleTab(nav.id)">{{nav.title}}</span>
							</template> 
						</div>
					</div>
					<div class="tab_content">
						<el-row class="isCell handleType">
							<template v-for="(type,index) in handleType">
								<el-col :span="8" class="text-center">
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
			<!-- 信息处理 -->
			<el-col :span="12">
				<el-card :body-style="{ padding: '0px' }">
					<div class="d-flex justify-content-between align-items-center isCell">
						<h4 class="fs_16 font-weight-semibold m-0 text-000">信息处理</h4>
						<div class="tab_nav">
							<template v-for="(year,index) in handleYear">
								<span :class="['cursor-pointer ml-3',handleYearIndex == year.id?'active':'']" @click="handleTab(year.id)">{{year.title}}</span>
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
				// 状态统计
				statusList:[
					{
						title:"项目申请",
						num:"8",
						total:"16"
					},
					{
						title:"项目审核",
						num:"8",
						total:"16"
					},
					{
						title:"项目实施",
						num:"8",
						total:"16"
					},
					{
						title:"试运行状态",
						num:"8",
						total:"16"
					},
					{
						title:"项目验收状态",
						num:"8",
						total:"16"
					},
					{
						title:"归档",
						num:"8",
						total:"16"
					},
					{
						title:"维保执行中",
						num:"8",
						total:"16"
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
						id:0,
						title:"总计",
					},
					{
						id:1,
						title:"2020年",
					},
					{
						id:2,
						title:"2019年",
					},{
						id:3,
						title:"2018年",
					},
				],
				// 默认选中的tab
				handleYearIndex:"0",
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
		methods:{
			handleTab(id){
				this.handleNavIndex = id; 
			},
			indexMethod(index) { //自增序列
        return ++index;
      },
		},
	}
</script>

<style>

</style>