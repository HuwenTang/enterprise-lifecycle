<template>
	<view class="page-container">
		<y-tabs sticky color="#007aff" class="ytab" @click="tabchange">
			<y-tab v-for="item in tabsList" :key="item.value" :title="item.title"></y-tab>
		</y-tabs>

		<!-- 添加搜索框，只在全部tab时显示 -->
		<view class="search-box" v-if="currentTab === 0">
			<view class="search-container">
				<uni-easyinput v-model="queryForm.title" placeholder="请输入文件名称" :clearable="true" @confirm="handleSearch"
					@clear="handleClear">
					<template #prefixIcon>
						<uni-icons type="search" size="16"></uni-icons>
					</template>
				</uni-easyinput>
				<button class="search-btn" @click="handleSearch">查询</button>
			</view>
		</view>

		<scroll-view scroll-y class="list-container" @scrolltolower="loadMore">
			<view class="item" v-for="(item, index) in list" :key="index">
				<view class="header" @click="toview(item)">
					<text class="attach-label">附件</text>
					<view class="dot" v-if="item.sfyd === '0'"></view>
					<!-- 小红点 -->
					<text class="file-name">{{ item.attachment[0].fileName }}</text>
				</view>
				<view class="footer">
					<view class="footer-left">
						<view class="footer-item">{{ item.attachment[0].creatorName }}</view>
						<view class="footer-item">{{ item.createTime }}</view>
					</view>
					<view class="footer-state" style="display: flex; align-items: center">
						<!-- 使用 flex 布局 -->
						<view style="display: flex; align-items: center">
							<!-- 确保图标在同一行 -->
							<!-- <uni-icons v-if="item.sfsc === '0'" type="star" size="20" @click="scClick(item, index,'1')" ></uni-icons>
              <uni-icons v-else-if="item.sfsc === '1'" type="star-filled" size="20" color="#f8a30f" @click="scClick(item, index,'0')"></uni-icons>
              <uni-icons v-if="item.sfpz === '0'" type="chatbubble" size="20"></uni-icons>
              <uni-icons v-else-if="item.sfpz === '1'" type="chatbubble" size="20" color="#007aff"></uni-icons> -->
							<uni-icons v-if="item.sfsc === '0'" type="star" size="16"></uni-icons>
							<uni-icons v-else-if="item.sfsc === '1'" type="star-filled" size="16"
								color="#f8a30f"></uni-icons>
							<uni-icons v-if="item.sfpz === '0'" type="chatbubble" size="16"></uni-icons>
							<uni-icons v-else-if="item.sfpz === '1'" type="chatbubble" size="16"
								color="#007aff"></uni-icons>
						</view>
						<view class="footer-item" @click='getpzList(item)'>{{ item.sfpz }}</view>
					</view>
				</view>
			</view>
			<!-- 批注列表-->
			<uni-popup ref="pzPopup" type="center">
				<view class="staff-popup2">
					<view class="popup-title">市长批注</view>
					<view class="pzitem">
						<text class="pzitemTitle">{{pznr}}</text>
					</view>
				</view>
			</uni-popup>
			<view class="load-more-container">
				<view v-if="loading" class="loading">
					<uni-icons type="spinner-cycle" size="20" animation="spin"></uni-icons>
					<text>加载中...</text>
				</view>
				<view v-else-if="finished" class="no-more">
					<text>没有更多数据了</text>
				</view>
				<view v-else class="load-more-btn" @click="loadMore">
					<text>加载更多</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script setup>
	import {
		abzkApi
	} from '@/api/business/oa/abzk';
	import {
		onMounted,
		reactive,
		ref,
		onUnmounted
	} from 'vue';

	// 添加当前选中的tab
	const currentTab = ref(0);

	// 收藏
	async function scClick(data, index, type) {
		let params = {
			abzkId: data.abzkId,
			sfsc: type,
		};
		try {
			let res = await abzkApi.update(params);
			if (res.code == 0) {
				uni.showToast({
					title: type == '1' ? '收藏成功' : '取消成功',
					icon: 'none',
				});
				list[index].sfsc = type;
			} else {
				uni.showToast({
					title: '操作失败',
					icon: 'none',
				});
			}
		} catch (e) {
			console.log(e);
		}
	}

	// 分页相关数据
	const queryFormState = {
		title: undefined,
		pageNum: 1,
		pageSize: 20,
		sfpz: null,
		sfsc: null,
	};

	const queryForm = reactive({
		...queryFormState,
	});

	const list = ref([]);
	const loading = ref(false); // 加载状态
	const finished = ref(false); // 是否已加载完所有数据
	const total = ref(0); // 总数据量

	// 查询数据
	async function queryData(isLoadMore = false) {
		if (loading.value || finished.value) return;

		try {
			loading.value = true;
			let queryResult = await abzkApi.queryPage(queryForm);

			if (isLoadMore) {
				list.value = [...list.value, ...queryResult.data.list];
			} else {
				list.value = queryResult.data.list;
			}

			total.value = queryResult.data.total;
			// 判断是否已加载完所有数据
			if (list.value.length >= total.value) {
				finished.value = true;
			}
		} catch (e) {
			console.error('加载数据失败:', e);
			uni.showToast({
				title: '加载失败',
				icon: 'none'
			});
		} finally {
			loading.value = false;
		}
	}

	// 获取批注
	const pznr = ref('');
	const pzPopup = ref(null);
	async function getpzList(item) {
		if (item.sfpz == '1') {
			try {
				pznr.value = item.pznr
				pzPopup.value.open();
			} catch (e) {
				console.log(e);
			}
		}
	}

	const tabsList = [{
			title: '全部',
			value: 0,
		},
		{
			title: '已批注',
			value: 1,
		},
		{
			title: '未批注',
			value: 2,
		},
		{
			title: '收藏',
			value: 3,
		},
	];

	// 切换tab
	async function tabchange(e) {
		// 关闭弹窗
		pzPopup.value.close();
		pznr.value = ''
		// 更新当前选中的tab
		currentTab.value = e;
		// 重置分页数据
		queryForm.pageNum = 1;
		finished.value = false;

		Object.assign(queryForm, queryFormState);
		if (e === 1) {
			queryForm.sfpz = '1';
		} else if (e === 2) {
			queryForm.sfpz = '0';
		} else if (e === 3) {
			queryForm.sfsc = '1';
		}
		await queryData();
	}


	// 加载更多数据
	const loadMore = () => {
		if (!loading.value && !finished.value) {
			queryForm.pageNum++;
			queryData(true);
		}
	};

	// 页面触底事件
	const onReachBottom = () => {
		loadMore();
	};


	async function getlxinit() {
		try {
			if(!navigator.userAgent.includes('Harmony')){
				return;
			}
			let href = window.location.href.split('#')[0]
			let res = await abzkApi.lx(href);
			lx.config({
				appId: '1572864-15679488', // 必填，应用的唯一标识
				timestamp: res.data.timestamp, // 必填，生成签名的10位时间戳，int型，单位：秒
				nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
				signature: res.data.signature, // 必填，签名
			});
		} catch (e) {
			console.error('加载数据失败:', e);
		}
	}
	
	async function getlx(url) {
		try {
			lx.ready(function() {
				// 调用jsapi
				lx.ui.openView({
					mode: "webview",
					navigationBarBackgroundColor: "#4E74BB",
					navigationBarFrontStyle: "white",
					url: url,
					useSplitScreen: false,
				});
			});
	
		} catch (e) {
			console.error('加载数据失败:', e);
		}
	}


	onMounted(() => {
		getlxinit();
		setTimeout(() => {
			queryData();
		}, 500)
		
	});

	const toview = (item) => {
		let url = window.location.href.split('#')[0]+'#/pages/list2/wjview?WJId=' + item.abzkId
		if(navigator.userAgent.includes('Harmony')){
			getlx(url)
		}else{
			uni.navigateTo({
				url: '/pages/list2/wjview?WJId=' + item.abzkId,
			});
		}
	};

	// 添加搜索处理函数
	const handleSearch = () => {
		queryForm.pageNum = 1;
		finished.value = false;
		queryData();
	};

	// 添加清除搜索处理函数
	const handleClear = () => {
		queryForm.title = undefined;
		queryForm.pageNum = 1;
		finished.value = false;
		queryData();
	};
</script>

<style lang="scss" scoped>
	page {
		background-color: #f5f5f5;
	}

	.search-container {
		display: flex;
		align-items: center;
		margin: 5px;
	}

	.search-input {
		flex: 1;
		padding: 5px;
		border: 1px solid #ccc;
		border-radius: 2px;
		font-size: 14px;
		margin-right: 5px;
		height: 30px;
		line-height: 30px;
		box-sizing: border-box;
	}

	.search-button {
		padding: 0 10px;
		background-color: #007aff;
		color: white;
		border: none;
		border-radius: 2px;
		font-size: 14px;
		cursor: pointer;
		transition: background-color 0.3s;
		height: 30px;
		line-height: 30px;
		box-sizing: border-box;
	}

	.search-button:hover {
		background-color: #0056b3;
	}

	.item {
		width: 100%;
		margin: 5px auto 0;
		background: #ffffff;
		border-radius: 6px;
		box-shadow: 0px 3px 4px 0px rgba(24, 144, 255, 0.06);
		padding: 5px 13px;
		box-sizing: border-box;
		transition: box-shadow 0.3s;

		&:hover {
			box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
		}

		.header {
			display: flex;
			align-items: center;
			font-size: 14px;
			color: #444;
			cursor: pointer;

			.attach-label {
				background-color: white;
				border: 1px solid #007ff2;
				color: #007aff;
				font-size: 12px;
				padding: 1px 7px;
				border-radius: 2px;
				margin-right: 5px;
			}

			.dot {
				width: 7px;
				height: 7px;
				background-color: red;
				border-radius: 50%;
				margin-right: 5px;
			}

			.file-name {
				color: #333;
				font-weight: bold;
			}
		}

		.footer {
			display: flex;
			justify-content: space-between;
			font-size: 12px;

			.footer-left {
				display: flex;
				align-items: center;
				color: #777777;

				.footer-item {
					margin-right: 5px;
				}
			}

			.footer-state {
				&.primary {
					color: #007ff2;
				}

				&.warning {
					color: #ff6c00;
				}

				&.info {
					color: #cccccc;
				}

				color: #4f4d4d;
			}
		}
	}

	.ytab {
		:deep .y-tabs__bar.is-line {
			display: none;
		}
	}

	.list-container {
		min-height: 100vh;
		padding-bottom: 10px;
	}

	.loading-status {
		text-align: center;
		padding: 10px 0;
		color: #999;
		font-size: 12px;

		.loading {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 5px;
		}
	}

	.page-container {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.ytab {
		flex-shrink: 0;
	}

	.load-more-container {
		text-align: center;
		padding: 10px 0;
		color: #999;
		font-size: 12px;

		.loading {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 5px;
		}

		.no-more {
			padding: 10px 0;
		}

		.load-more-btn {
			padding: 10px 0;
			background-color: #007aff;
			color: #fff;
			border-radius: 5px;
			cursor: pointer;
		}
	}

	// 添加搜索框样式
	.search-box {
		padding: 3px;
		background-color: #fff;
		border-bottom: 1px solid #eee;

		.search-container {
			display: flex;
			align-items: center;
			gap: 10px;

			:deep(.uni-easyinput) {
				flex: 1;
				background-color: #f5f5f5;
				border-radius: 4px;
				padding: 0 10px;

				.uni-easyinput__content {
					height: 32px;
				}

				.uni-easyinput__placeholder-class {
					color: #999;
					font-size: 14px;
				}
			}
		}

		.search-btn {
			width: 50px;
			height: 30px;
			line-height: 30px;
			background-color: #007aff;
			color: #fff;
			font-size: 13px;
			border-radius: 4px;
			padding: 0;
			margin: 0;

			&:active {
				opacity: 0.8;
			}
		}
	}

	// 调整列表容器样式
	.list-container {
		flex: 1;
		height: 0;
		padding-bottom: 10px;
	}



	.search-box {
		padding: 10px;
		background-color: #fff;
		border-bottom: 1px solid #eee;

		.search-container {
			display: flex;
			align-items: center;
			gap: 10px;

			:deep(.uni-easyinput) {
				flex: 1;
				background-color: #f5f5f5;
				border-radius: 4px;
				padding: 0 10px;

				.uni-easyinput__content {
					height: 36px;
				}

				.uni-easyinput__placeholder-class {
					color: #999;
					font-size: 14px;
				}
			}
		}

		.search-btn {
			width: 50px;
			height: 34px;
			line-height: 34px;
			background-color: #007aff;
			color: #fff;
			font-size: 14px;
			border-radius: 4px;
			padding: 0;
			margin: 0;

			&:active {
				opacity: 0.8;
			}
		}
	}

	// 调整列表容器样式
	.list-container {
		flex: 1;
		height: 0;
		padding-bottom: 10px;
	}

	// 确保页面容器样式正确
	.page-container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #f5f5f5;
	}

	// 批注
	.staff-popup2 {
		background-color: #fff;
		border-radius: 1px 1px 0 0;
		padding-bottom: 3px;
		border-radius: 6px;
		padding-bottom: 12px;
		overflow: hidden;
		margin: 0 20px;
	}

	.popup-title {
		font-size: 16px;
		text-align: center;
		padding: 10px 0;
		width: 100%;
		background: #e9e9e9;
	}

	.pzitem {
		padding: 12px;
		border-top: 1px solid #f0f0f0;
	}

	.pzitemTitle {
		word-wrap: break-word;
		padding: 4px 0;
		color: #666;
	}
</style>