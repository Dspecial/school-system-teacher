<template>
	<div class="page_detail">
		<!-- 登录信息 -->
    <global-tips></global-tips>
		<Breadcrumb></Breadcrumb>
		<el-card class="mt-3 bg-white">
			<h6 class="fs_18 font-weight-normal mb-3">{{title}}</h6>
			<el-form :model="projectForm" :rules="rules" ref="projectForm" label-width="110px" label-position="top" class="pl-3 pr-3">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="项目名称">
							<el-input v-model="projectForm.p_name" placeholder="请输入项目名称" readonly></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="申请年份">
							<el-input v-model="projectForm.projecttime" placeholder="请输入申请年份" readonly></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="预算金额">
							<el-input v-model="projectForm.budget_amount" placeholder="请输入预算金额" readonly>
								<span slot="suffix" class="el-input__icon mr-2">元</span>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="is_need_company == 2">
						<el-form-item label="所属企业">
							<el-select v-model="projectForm.company_id" clearable filterable placeholder="请选择所属企业" class="w-100">
								<el-option
									v-for="item in companyOptions"
									:key="item.id"
									:label="item.job_number"
									:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item prop="money">
							<template slot="label">
								<span v-if="can_used_funds == 0">
									项目合同金额 
									<!-- <span class="text-danger">(本年度可用预算金额不足，请联系管理员)</span> -->
								</span>
								<span v-else>
									项目合同金额 
									<!-- <span class="text-danger">(年度可用预算 {{can_used_funds}} 元)</span> -->
								</span>
							</template>
							<el-input v-model="projectForm.real_amount" placeholder="请输入项目合同金额">
								<span slot="suffix" class="el-input__icon mr-2">元</span>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<div v-for="(formItem,j) in projectForm.secondFrom" :key="j">
						<!-- 字段类型:1=文本框,2=数字框,3=下拉单选,4=日期选择,5=文件上传(单选),6=文本域,7=富文本,
						8=时间选择,9=下拉多选,10=复选,11=单选,12=数组,13=图片上传(单选),14=图片上传(多选),15=文件上传(多选) -->
						<!-- 1=文本框 -->
						<el-col :span="12" v-if="formItem.name_type == 1">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-input v-model="formItem.value" :placeholder="formItem.placeholder"></el-input>
							</el-form-item>
						</el-col>
						<!-- 2=数字框 -->
						<el-col :span="12" v-else-if="formItem.name_type == 2">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false" 
							:rules="[{ type: 'number', message: formItem.title +'必须为数字值'}]">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-input v-model="formItem.value" :placeholder="formItem.placeholder">
									<span slot="suffix" class="el-input__icon mr-2">元</span>
								</el-input>
							</el-form-item>
						</el-col>
						<!-- 3=下拉单选 -->
						<el-col :span="12" v-else-if="formItem.name_type == 3">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-select v-model="formItem.value" clearable :placeholder="formItem.placeholder" class="w-100">
									<el-option
										v-for="item in formItem.extra_val"
										:key="item"
										:label="item"
										:value="item">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<!-- 4=日期选择 -->
						<el-col :span="12" v-else-if="formItem.name_type == 4">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-date-picker 
								type="date" 
								:placeholder="formItem.placeholder"
								v-model="formItem.value" 
								value-format="yyyy-MM-dd"
								clearable
								style="width: 100%;"></el-date-picker>
							</el-form-item>
						</el-col>
						<!-- 5=文件上传(单选) -->
						<el-col :span="24" v-else-if="formItem.name_type == 5">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<div class="d-inline-flex align-items-center justify-content-between" v-if="formItem.example">
										<span>{{ formItem.title }}</span>
										<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
										<div class="d-flex align-items-center justify-content-between ml-5 text-primary">
											<div class="cursor-pointer view" @click="preview(formItem.example)" title="在线预览">
												<i class="el-icon-document mr-2"></i><span>查看示例</span>
											</div>
											<div class="opacity-80 ml-3">
												<i class="el-icon-view cursor-pointer view mr-3" @click="preview(formItem.example)"></i>
												<i class="el-icon-download cursor-pointer view" @click="downloadview(formItem.example)"></i>
											</div>
										</div>
									</div>
								</template>
								<div class="d-flex align-items-start justify-content-between">
									<el-upload
										class="my_upload"
										drag
										:limit="1"
										action="void"
										:accept="accept_file"
										:auto-upload="true"
										:http-request="myUpload"
										:file-list="formItem.value"
										:on-success="(res, file, fileList)=>handleSuccess(res, file, fileList,formItem)"
										:on-remove="(file, fileList)=>handleRemove(file, fileList,formItem)"
										:before-upload="(file)=>beforeUpload(file,formItem)"
										:on-exceed="onExceed">
										<div class="el-upload__text"><i class="el-icon-upload"></i>将文档拖到此处，或<em>点击选择文档</em></div>
									</el-upload>
								</div>
							</el-form-item>
						</el-col>
						<!-- 6=文本域 -->
						<el-col :span="24" v-else-if="formItem.name_type == 6">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-input type="textarea" v-model="formItem.value" :placeholder="formItem.placeholder"  :rows="3"></el-input>
							</el-form-item>
						</el-col>
						<!-- 7=富文本 -->
						<el-col :span="24" v-else-if="formItem.name_type == 7">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<vEditor v-model="formItem.value" class="pro_vEditor"></vEditor>
							</el-form-item>
						</el-col>
						<!-- 8=时间选择 -->
						<el-col :span="12" v-else-if="formItem.name_type == 8">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-date-picker 
								type="datetime" 
								:placeholder="formItem.placeholder"
								v-model="formItem.value" 
								value-format="yyyy-MM-dd HH:mm:ss"
								clearable
								style="width: 100%;"></el-date-picker>
							</el-form-item>
						</el-col>
						<!-- 9=下拉多选 -->
						<el-col :span="12" v-else-if="formItem.name_type == 9">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-select v-model="formItem.value" clearable multiple :placeholder="formItem.placeholder" class="w-100">
									<el-option
										v-for="item in formItem.extra_val"
										:key="item"
										:label="item"
										:value="item">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<!-- 10=复选 -->
						<el-col :span="12" v-else-if="formItem.name_type == 10">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-checkbox-group v-model="formItem.value">
									<template v-for="(checkbox,z) in formItem.extra_val">
										<el-checkbox :label="checkbox" :name="formItem.name" :key="z"></el-checkbox>
									</template>
								</el-checkbox-group>
							</el-form-item>
						</el-col>
						<!-- 11=单选 -->
						<el-col :span="12" v-else-if="formItem.name_type == 11">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-radio-group v-model="formItem.value">
									<template v-for="(radio,z) in formItem.extra_val">
										<el-radio :label="radio" :key="z"></el-radio>
									</template>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<!-- 12=数组 -->
						<el-col :span="24" v-else-if="formItem.name_type == 12">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false" class="payment_item">
								<div slot="label" class="d-flex justify-content-between">
									<div>
										<span>{{formItem.title}}</span>
										<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
									</div>
									<span class="text-primary cursor-pointer" @click="addPro(formItem.value,formItem.extra_val)"><i class="el-icon-plus mr-1"></i>添加</span>
								</div>
								<template v-for="(cell,INDEX) in formItem.value">
									<el-row type="flex" align="middle" :gutter="20" class="cell_row mb-3" :key="INDEX">
										<el-col :span="23" class="d-flex align-items-center">
											<el-input :key="x" v-for="(formCol,x) in formItem.extra_val" class="mr-3" v-model="cell[x]" :placeholder="'请输入'+ formCol.title"></el-input>
										</el-col>
										<el-col :span="1" class="text-right">
											<span class="text-danger cursor-pointer" @click="delField(formItem.value,INDEX)">删除</span>
										</el-col>
									</el-row>
								</template>
							</el-form-item>
						</el-col>
						<!-- 13=图片上传(单选) -->
						<el-col :span="24" v-else-if="formItem.name_type == 13">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<div class="d-inline-flex align-items-center justify-content-between" v-if="formItem.example">
										<span>{{ formItem.title }}</span>
										<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
										<div class="d-flex align-items-center justify-content-between ml-5 text-primary">
											<div class="cursor-pointer view" @click="preview(formItem.example)" title="在线预览">
												<i class="el-icon-document mr-2"></i><span>查看示例</span>
											</div>
											<div class="opacity-80 ml-3">
												<i class="el-icon-view cursor-pointer view mr-3" @click="preview(formItem.example)"></i>
												<i class="el-icon-download cursor-pointer view" @click="downloadview(formItem.example)"></i>
											</div>
										</div>
									</div>
								</template>
								<el-upload
									action="void"
									:accept="accept_img"
									:limit="1"
									list-type="picture-card"
									:auto-upload="true"
									:http-request="myUpload"
									:file-list="formItem.value"
									:on-success="(res, file, fileList)=>handleSuccess(res, file, fileList,formItem)"
									:on-remove="(file, fileList)=>handleRemove(file, fileList,formItem)"
									:before-upload="(file)=>beforeUpload(file,formItem)"
									:on-exceed="onExceed"
									:class="formItem.value.length>0?'limit_upload':''">
									<i class="el-icon-plus"></i>
								</el-upload>
							</el-form-item>
						</el-col>
						<!-- 14=图片上传(多选) -->
						<el-col :span="24" v-else-if="formItem.name_type == 14">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<div class="d-inline-flex align-items-center justify-content-between" v-if="formItem.example">
										<span>{{ formItem.title }}</span>
										<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
										<div class="d-flex align-items-center justify-content-between ml-5 text-primary">
											<div class="cursor-pointer view" @click="preview(formItem.example)" title="在线预览">
												<i class="el-icon-document mr-2"></i><span>查看示例</span>
											</div>
											<div class="opacity-80 ml-3">
												<i class="el-icon-view cursor-pointer view mr-3" @click="preview(formItem.example)"></i>
												<i class="el-icon-download cursor-pointer view" @click="downloadview(formItem.example)"></i>
											</div>
										</div>
									</div>
								</template>
								<el-upload
									action="void"
									:accept="accept_img"
									list-type="picture-card"
									:auto-upload="true"
									:http-request="myUpload"
									:file-list="formItem.value"
									:on-success="(res, file, fileList)=>handleSuccess(res, file, fileList,formItem)"
									:on-remove="(file, fileList)=>handleRemove(file, fileList,formItem)"
									:before-upload="(file)=>beforeUpload(file,formItem)">
									<i class="el-icon-plus"></i>
								</el-upload>
							</el-form-item>
						</el-col>
						<!-- 15=文件上传(多选) -->
						<el-col :span="24" v-else-if="formItem.name_type == 15">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<div class="d-inline-flex align-items-center justify-content-between" v-if="formItem.example">
										<span>{{ formItem.title }}</span>
										<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
										<div class="d-flex align-items-center justify-content-between ml-5 text-primary">
											<div class="cursor-pointer view" @click="preview(formItem.example)" title="在线预览">
												<i class="el-icon-document mr-2"></i><span>查看示例</span>
											</div>
											<div class="opacity-80 ml-3">
												<i class="el-icon-view cursor-pointer view mr-3" @click="preview(formItem.example)"></i>
												<i class="el-icon-download cursor-pointer view" @click="downloadview(formItem.example)"></i>
											</div>
										</div>
									</div>
								</template>
								<div class="d-flex align-items-start justify-content-between">
									<el-upload
										class="my_upload"
										drag
										action="void"
										:accept="accept_file"
										:auto-upload="true"
										:http-request="myUpload"
										:file-list="formItem.value"
										:on-success="(res, file, fileList)=>handleSuccess(res, file, fileList,formItem)"
										:on-remove="(file, fileList)=>handleRemove(file, fileList,formItem)"
										:before-upload="(file)=>beforeUpload(file,formItem)">
										<div class="el-upload__text"><i class="el-icon-upload"></i>将文档拖到此处，或<em>点击选择文档</em></div>
									</el-upload>
								</div>
							</el-form-item>
						</el-col>
					</div>
				</el-row>

				<!-- 实施流程的额外参数 -->
				<el-row :gutter="20">
					<div v-for="(formItem,j) in projectForm.runningextra" :key="j">
						<!-- 字段类型:1=文本框,2=数字框,3=下拉单选,4=日期选择,5=文件上传(单选),6=文本域,7=富文本,
						8=时间选择,9=下拉多选,10=复选,11=单选,12=数组,13=图片上传(单选),14=图片上传(多选),15=文件上传(多选) -->
						<!-- 1=文本框 -->
						<el-col :span="12" v-if="formItem.name_type == 1">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-input v-model="formItem.value" :placeholder="formItem.placeholder"></el-input>
							</el-form-item>
						</el-col>
						<!-- 2=数字框 -->
						<el-col :span="12" v-else-if="formItem.name_type == 2">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false" 
							:rules="[{ type: 'number', message: formItem.title +'必须为数字值'}]">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-input v-model="formItem.value" :placeholder="formItem.placeholder">
									<span slot="suffix" class="el-input__icon mr-2">元</span>
								</el-input>
							</el-form-item>
						</el-col>
						<!-- 3=下拉单选 -->
						<el-col :span="12" v-else-if="formItem.name_type == 3">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-select v-model="formItem.value" clearable :placeholder="formItem.placeholder" class="w-100">
									<el-option
										v-for="item in formItem.extra_val"
										:key="item"
										:label="item"
										:value="item">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<!-- 4=日期选择 -->
						<el-col :span="12" v-else-if="formItem.name_type == 4">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-date-picker 
								type="date" 
								:placeholder="formItem.placeholder"
								v-model="formItem.value" 
								value-format="yyyy-MM-dd"
								clearable 
								style="width: 100%;"></el-date-picker>
							</el-form-item>
						</el-col>
						<!-- 5=文件上传(单选) -->
						<el-col :span="24" v-else-if="formItem.name_type == 5">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<div class="d-inline-flex align-items-center justify-content-between" v-if="formItem.example">
										<span>{{ formItem.title }}</span>
										<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
										<div class="d-flex align-items-center justify-content-between ml-5 text-primary">
											<div class="cursor-pointer view" @click="preview(formItem.example)" title="在线预览">
												<i class="el-icon-document mr-2"></i><span>查看示例</span>
											</div>
											<div class="opacity-80 ml-3">
												<i class="el-icon-view cursor-pointer view mr-3" @click="preview(formItem.example)"></i>
												<i class="el-icon-download cursor-pointer view" @click="downloadview(formItem.example)"></i>
											</div>
										</div>
									</div>
								</template>
								<div class="d-flex align-items-start justify-content-between">
									<el-upload
										class="my_upload"
										drag
										:limit="1"
										action="void"
										:accept="accept_file"
										:auto-upload="true"
										:http-request="myUpload"
										:file-list="formItem.value"
										:on-success="(res, file, fileList)=>handleSuccess(res, file, fileList,formItem)"
										:on-remove="(file, fileList)=>handleRemove(file, fileList,formItem)"
										:before-upload="(file)=>beforeUpload(file,formItem)"
										:on-exceed="onExceed">
										<div class="el-upload__text"><i class="el-icon-upload"></i>将文档拖到此处，或<em>点击选择文档</em></div>
									</el-upload>
								</div>
							</el-form-item>
						</el-col>
						<!-- 6=文本域 -->
						<el-col :span="24" v-else-if="formItem.name_type == 6">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-input type="textarea" v-model="formItem.value" :placeholder="formItem.placeholder"  :rows="3"></el-input>
							</el-form-item>
						</el-col>
						<!-- 7=富文本 -->
						<el-col :span="24" v-else-if="formItem.name_type == 7">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<vEditor v-model="formItem.value" class="pro_vEditor"></vEditor>
							</el-form-item>
						</el-col>
						<!-- 8=时间选择 -->
						<el-col :span="12" v-else-if="formItem.name_type == 8">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-date-picker 
								type="datetime" 
								:placeholder="formItem.placeholder"
								v-model="formItem.value" 
								value-format="yyyy-MM-dd HH:mm:ss"
								clearable 
								style="width: 100%;"></el-date-picker>
							</el-form-item>
						</el-col>
						<!-- 9=下拉多选 -->
						<el-col :span="12" v-else-if="formItem.name_type == 9">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-select v-model="formItem.value" clearable multiple :placeholder="formItem.placeholder" class="w-100">
									<el-option
										v-for="item in formItem.extra_val"
										:key="item"
										:label="item"
										:value="item">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<!-- 10=复选 -->
						<el-col :span="12" v-else-if="formItem.name_type == 10">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-checkbox-group v-model="formItem.value">
									<template v-for="(checkbox,z) in formItem.extra_val">
										<el-checkbox :label="checkbox" :name="formItem.name" :key="z"></el-checkbox>
									</template>
								</el-checkbox-group>
							</el-form-item>
						</el-col>
						<!-- 11=单选 -->
						<el-col :span="12" v-else-if="formItem.name_type == 11">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<span>{{ formItem.title }}</span>
									<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
								</template>
								<el-radio-group v-model="formItem.value">
									<template v-for="(radio,z) in formItem.extra_val">
										<el-radio :label="radio" :key="z"></el-radio>
									</template>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<!-- 12=数组 -->
						<el-col :span="24" v-else-if="formItem.name_type == 12">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false" class="payment_item">
								<div slot="label" class="d-flex justify-content-between">
									<div>
										<span>{{formItem.title}}</span>
										<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
									</div>
									<span class="text-primary cursor-pointer" @click="addPro(formItem.value,formItem.extra_val)"><i class="el-icon-plus mr-1"></i>添加</span>
								</div>
								<template v-for="(cell,INDEX) in formItem.value">
									<el-row type="flex" align="middle" :gutter="20" class="cell_row mb-3" :key="INDEX">
										<el-col :span="23" class="d-flex align-items-center">
											<el-input :key="x" v-for="(formCol,x) in formItem.extra_val" class="mr-3" v-model="cell[x]" :placeholder="'请输入'+ formCol.title"></el-input>
										</el-col>
										<el-col :span="1" class="text-right">
											<span class="text-danger cursor-pointer" @click="delField(formItem.value,INDEX)">删除</span>
										</el-col>
									</el-row>
								</template>
							</el-form-item>
						</el-col>
						<!-- 13=图片上传(单选) -->
						<el-col :span="24" v-else-if="formItem.name_type == 13">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<div class="d-inline-flex align-items-center justify-content-between" v-if="formItem.example">
										<span>{{ formItem.title }}</span>
										<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
										<div class="d-flex align-items-center justify-content-between ml-5 text-primary">
											<div class="cursor-pointer view" @click="preview(formItem.example)" title="在线预览">
												<i class="el-icon-document mr-2"></i><span>查看示例</span>
											</div>
											<div class="opacity-80 ml-3">
												<i class="el-icon-view cursor-pointer view mr-3" @click="preview(formItem.example)"></i>
												<i class="el-icon-download cursor-pointer view" @click="downloadview(formItem.example)"></i>
											</div>
										</div>
									</div>
								</template>
								<el-upload
									action="void"
									:accept="accept_img"
									:limit="1"
									list-type="picture-card"
									:auto-upload="true"
									:http-request="myUpload"
									:file-list="formItem.value"
									:on-success="(res, file, fileList)=>handleSuccess(res, file, fileList,formItem)"
									:on-remove="(file, fileList)=>handleRemove(file, fileList,formItem)"
									:before-upload="(file)=>beforeUpload(file,formItem)"
									:on-exceed="onExceed"
									:class="formItem.value.length>0?'limit_upload':''">
									<i class="el-icon-plus"></i>
								</el-upload>
							</el-form-item>
						</el-col>
						<!-- 14=图片上传(多选) -->
						<el-col :span="24" v-else-if="formItem.name_type == 14">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<div class="d-inline-flex align-items-center justify-content-between" v-if="formItem.example">
										<span>{{ formItem.title }}</span>
										<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
										<div class="d-flex align-items-center justify-content-between ml-5 text-primary">
											<div class="cursor-pointer view" @click="preview(formItem.example)" title="在线预览">
												<i class="el-icon-document mr-2"></i><span>查看示例</span>
											</div>
											<div class="opacity-80 ml-3">
												<i class="el-icon-view cursor-pointer view mr-3" @click="preview(formItem.example)"></i>
												<i class="el-icon-download cursor-pointer view" @click="downloadview(formItem.example)"></i>
											</div>
										</div>
									</div>
								</template>
								<el-upload
									action="void"
									:accept="accept_img"
									list-type="picture-card"
									:auto-upload="true"
									:http-request="myUpload"
									:file-list="formItem.value"
									:on-success="(res, file, fileList)=>handleSuccess(res, file, fileList,formItem)"
									:on-remove="(file, fileList)=>handleRemove(file, fileList,formItem)"
									:before-upload="(file)=>beforeUpload(file,formItem)">
									<i class="el-icon-plus"></i>
								</el-upload>
							</el-form-item>
						</el-col>
						<!-- 15=文件上传(多选) -->
						<el-col :span="24" v-else-if="formItem.name_type == 15">
							<el-form-item :label="formItem.title" :required="formItem.is_required == 2?true:false">
								<template slot="label">
									<div class="d-inline-flex align-items-center justify-content-between" v-if="formItem.example">
										<span>{{ formItem.title }}</span>
										<span class="ml-1 text-danger" v-if="formItem.remark">({{ formItem.remark }})</span>
										<div class="d-flex align-items-center justify-content-between ml-5 text-primary">
											<div class="cursor-pointer view" @click="preview(formItem.example)" title="在线预览">
												<i class="el-icon-document mr-2"></i><span>查看示例</span>
											</div>
											<div class="opacity-80 ml-3">
												<i class="el-icon-view cursor-pointer view mr-3" @click="preview(formItem.example)"></i>
												<i class="el-icon-download cursor-pointer view" @click="downloadview(formItem.example)"></i>
											</div>
										</div>
									</div>
								</template>
								<div class="d-flex align-items-start justify-content-between">
									<el-upload
										class="my_upload"
										drag
										action="void"
										:accept="accept_file"
										:auto-upload="true"
										:http-request="myUpload"
										:file-list="formItem.value"
										:on-success="(res, file, fileList)=>handleSuccess(res, file, fileList,formItem)"
										:on-remove="(file, fileList)=>handleRemove(file, fileList,formItem)"
										:before-upload="(file)=>beforeUpload(file,formItem)">
										<div class="el-upload__text"><i class="el-icon-upload"></i>将文档拖到此处，或<em>点击选择文档</em></div>
									</el-upload>
								</div>
							</el-form-item>
						</el-col>
					</div>
				</el-row>
				
				<!-- 合同规定付款计划 -->
				<el-row :gutter="20">
					<el-col :span="24">
						<el-form-item label="合同规定付款计划" class="payment_item" required>
							<div slot="label" class="d-flex justify-content-between">
								<span>合同规定付款计划</span>
								<span class="text-primary cursor-pointer" @click="addPayinfo(projectForm.agree_payinfo)"><i class="el-icon-plus mr-1"></i>付款信息</span>
							</div>
							<template v-for="(cell,INDEX) in projectForm.agree_payinfo">
								<el-row type="flex" align="middle" :gutter="20" class="_row mb-3" :key="INDEX">
									<el-col :span="24">
										<el-input v-model="cell.title" placeholder="请输入标题"></el-input>
									</el-col>
									<el-col :span="24">
										<el-input v-model="cell.money" placeholder="请输入项目合同金额，必须为数值，单位元">
											<span slot="suffix" class="el-input__icon mr-2">元</span>
										</el-input>
									</el-col>
									<el-col :span="24">
										<el-date-picker type="date" clearable placeholder="选择付款节点" v-model="cell.paytime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
									</el-col>
									<el-col :span="2" class="text-right">
										<span class="text-danger cursor-pointer" @click="delPayinfo(projectForm.agree_payinfo,INDEX)">删除</span>
									</el-col>
								</el-row>
							</template>
						</el-form-item>
					</el-col>
				</el-row>
				<div class="d-flex justify-content-end">
					<el-button type="primary" @click="submitForm('projectForm')" v-if="is_commit != 8">确 定</el-button>
					<el-button @click="closedEdit">取 消</el-button>
				</div>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import GlobalTips from "@/components/GlobalTips";
	import Breadcrumb from "@/components/Breadcrumb";
	import vEditor from "@/components/quill-editor/ue";
	export default {
		props:['editData'],
		name: 'ForceEdit',
		data () {
			return {
				ID:'',
				project_id:"",
				is_commit:"",// 判断有没有确定按钮，当is_commit为8的时候   没有确定按钮
				title:"项目实施编辑",
				accept_file: ".pdf,.doc,.docx,.xls,.xlsx,.zip",
				accept_img:".jpg,.png,.JPEG",
				companyOptions:[],
				projectForm: {
					apply_number:"",
          p_name: "",
					projecttime:"",
					company_id:"",
					budget_amount:"",
					real_amount:"",
					agree_payinfo:[{}],
					secondFrom:{},
					runningextra:[],
        },
				is_need_company:"1", // 是否开启企业选择
				is_open_money:"1", // 是否开启金额申请
				can_used_funds:'',
				removeFilesArr:[],
        rules: {
					real_amount: [
          	{ required: true, message: '请输入项目金额', trigger: 'blur' },
          	{ validator:this.commonJs.checkNumber,trigger: 'blur'},
          ],
        },
				startOption:{
					disabledDate: time =>{
						return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
					}
				},
			}
		},
		components: {
			GlobalTips,
			Breadcrumb,
			vEditor
		},
		mounted(){
			this.openEdit();
		},
		methods:{
			// 获取企业列表
			initCompany(){
				this.$api.getCompany({
				}).then(data =>{
					if(data.code == 0){
						// 回调成功的方法
						this.companyOptions = data.data;
					}else{
						this.$message.error(data.msg);
					}
				});
			},
			// 添加审核流程
			addPro(item,length){
				var array = new Array();
				for(var i=0;i<length.length;i++){
					array.push('')
				};
				item.push(array);
			},
			// 删除字段
			delField(item,index){
				item.splice(index, 1);
			},

			// 添加付款节点
			addPayinfo(item){
				item.push({});
			},
			// 删除付款节点
			delPayinfo(item,index){
				item.splice(index, 1);
			},

			// 根据项目获取信息
			initFunds(years){
				this.$api.project_funds({
					id:this.project_id,
					years:years,
					type:1,
				}).then(data=>{
					if(data.code == 0){
						// 可用预算金额
						this.can_used_funds = data.data.can_used_funds;
						this.is_need_company = data.data.is_need_company;
						this.is_open_money = data.data.is_open_money;
					}
				})
			},

			// dialog初始化
			openEdit(){
				this.initCompany();
				this.ID = this.$route.query.id;
				this.$api.forceList_edit({
					id:this.ID,
					function_type:1,
				}).then(data =>{
					if(data.code == 0){
						// this.is_commit = data.data.is_commit; 
						this.projectForm.apply_number = data.data.info.apply_number;
						this.projectForm.p_name = data.data.info.p_name;
						this.projectForm.projecttime = data.data.info.projecttime.toString();
						this.projectForm.company_id = data.data.info.company_id;
						this.projectForm.budget_amount = data.data.info.budget_amount;
						this.projectForm.real_amount = data.data.info.real_amount;


						// 项目id
						this.project_id = data.data.info.id;
						this.initFunds(this.projectForm.projecttime);

						if(data.data.pay_info.length == 0){
							this.projectForm.agree_payinfo = [{}]
						}else{
							this.projectForm.agree_payinfo = data.data.pay_info.map((item)=>{
								return {
									title:item.title,
									money:item.money,
									paytime:item.paytime,
								}
							});
						}

						var datajson = data.data.info.datajson;
						datajson.map((item)=>{
							if(item.name_type == 5 || item.name_type == 13 || item.name_type == 14 || item.name_type == 15){
								item.value = [];
								if(!this.commonJs.isEmpty(item.file_arr)){
									item.value = item.file_arr
								}
							}
						});
						this.projectForm.secondFrom = datajson;


						var runningjson = data.data.info.runningextra;
						runningjson.map((item)=>{
							if(item.name_type == 5 || item.name_type == 13 || item.name_type == 14 || item.name_type == 15){
								item.value = [];
								if(!this.commonJs.isEmpty(item.file_arr)){
									item.value = item.file_arr
								}
							}
						});
						this.projectForm.runningextra = runningjson;
					}else{
						this.$message.error(data.msg);
					}
				});
			},
			// 关闭编辑
			closedEdit(){
				this.$router.go(-1);//返回上一层
				this.fileList = [];
				this.removeFilesArr = [];
			},
      // form提交
			submitForm(formName) {
				var _this = this;
				var senddata = new Array;
				var isArr = this.commonJs.isEmpty(this.projectForm.secondFrom);
				if(!isArr){
					senddata = this.projectForm.secondFrom.map((item)=>{
						if(item.name_type == 5 || item.name_type == 13 || item.name_type == 14 || item.name_type == 15){
							var nameArray = item.value.map((file)=>{
								if(this.commonJs.isEmpty(file.response)){
									return file.path;
								}else{
									return file.response.data.path;
								}
							});
							return {
								"name":item.name,
								"value":nameArray.join(","),
							}
						}else{
							return {
								"name":item.name,
								"value":item.value,
							}
						}
					});
				};

				var sendExtra = new Array;
				var isExtraArr = this.commonJs.isEmpty(this.projectForm.runningextra);
				if(!isExtraArr){
					sendExtra = this.projectForm.runningextra.map((item)=>{
						if(item.name_type == 5 || item.name_type == 13 || item.name_type == 14 || item.name_type == 15){
							var nameArray = item.value.map((file)=>{
								if(this.commonJs.isEmpty(file.response)){
									return file.path;
								}else{
									return file.response.data.path;
								}
							});
							return {
								"name":item.name,
								"value":nameArray.join(","),
							}
						}else{
							return {
								"name":item.name,
								"value":item.value,
							}
						}
					});
				};

				var payArr = new Array;
				var isArr2 = this.commonJs.isEmpty(this.projectForm.agree_payinfo[0]);
				if(!isArr2){
					payArr = this.projectForm.agree_payinfo
				}

				this.$refs[formName].validate((valid) => {
          if (valid) {
						this.$api.forceList_edit({
							id:this.ID,
							function_type:2,
							real_amount:this.projectForm.real_amount,
							company_id:this.projectForm.company_id,
							senddata:JSON.stringify(senddata),
							runningextra:JSON.stringify(sendExtra),
							agree_payinfo:JSON.stringify( payArr ),
						}).then(data =>{
							if(data.code == 0){
								// this.removeFilesArr.map((path)=>{
								// 	_this.removeFile(path);
								// })
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

			/****  上传  ****/
			myUpload(params,formItem){
	      // 通过 FormData 对象上传文件
	      const formData = new FormData();
	      formData.append("apply_number", this.projectForm.apply_number);
	      formData.append("type", 'shishi');
	      formData.append("file", params.file);
	      formData.append("user_token", this.VueCookies.get("application_token"));

				this.$api.uploadFile(formData).then(data =>{
					if(data.code == 0){
						// 回调成功的方法
						params.onSuccess(data);
						this.$message.success(data.msg);
					}else{
						this.$message.error(data.msg);
					}
				});
			},
			
      // 上传成功
			handleSuccess(res, file, fileList, formItem) {
				formItem.value = fileList;
      },
      // 移除上传文件
      handleRemove(file,fileList,formItem) {
      	var path;
      	if(file.isExist){ // 原先上传已存在的
      		path = file.path;
      	}else{ // 刚刚上传的
					if(file.status == 'success'){
						path = file.response.data.path;
					}else{
						return false
					}
      	}
				formItem.value = fileList;
				this.$message({message: '成功移除' + file.name, type: 'success'});

				if(this.removeFilesArr.indexOf(path) == -1){
					this.removeFilesArr.push(path);
				}
      },

			// 删除调接口
			removeFile(path){
				this.$api.uploadDel({
      		path:path,
      	}).then(data =>{
					if(data.code == 0){
						// this.$message.success("文件更新成功");
					}else{
						this.$message.error(data.msg);
					}
				});
			},

      // 上传前验证
      beforeUpload(file,formItem) {
				var isUpload = true;
      	// 验证大小等
				formItem.value.map((fff)=>{
					if(fff.name == file.name){
						this.$message.warning("请不要重复上传相同文件！");
						isUpload = false;
						return;
					}
				})
				return isUpload;
      },
			// 文件超出限制
			onExceed(file,fileList){
				this.$message.error("只能上传一个文件哦，可以先删除再重新上传！");
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
			downloadview(path){
				let a = document.createElement('a'); 
				a.style = 'display: none'; // 创建一个隐藏的a标签
				a.download = '查看示例';
				a.href = this.$globalUrl.baseURL + path;
				document.body.appendChild(a);
				a.click(); // 触发a标签的click事件
				document.body.removeChild(a);
			},
		}
	}
</script>

<style>

</style>