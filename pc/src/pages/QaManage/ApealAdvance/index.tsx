import { PageContainer } from '@ant-design/pro-components';
import { FC, useEffect, useState } from 'react';
import React from 'react';
import useStyles from './style.style';
import './DescriptionsStyle.css';
import { useNavigate } from '@@/exports';
import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Image,
  Input,
  List,
  message,
  Modal,
  Row,
  Select,
  Spin,
  Upload,
} from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { UserFeedbackCommentVo, UserFeedbackVo } from '@/services/apis';
import { primeApi, systemApi } from '@/services/api';
import { useModel, useSearchParams } from '@umijs/max';
import dayjs from 'dayjs';
import { fetchUserFeedbackPendingCount } from '@/utils/refreshUserFeedbackBadge';

interface ExtendedComment extends UserFeedbackCommentVo {
  userName?: string;
  createTime?: string | Date;
  replyToComment?: UserFeedbackCommentVo;
}

const parseImagesField = (raw: unknown): string[] => {
  const stripHash = (s: string) => {
    const idx = s.indexOf('#');
    return idx >= 0 ? s.slice(0, idx) : s;
  };
  const normalize = (v: unknown): string => {
    if (v === null || v === undefined) return '';
    if (typeof v === 'string') return v;
    if (typeof v === 'object') {
      const u = (v as { url?: string; path?: string; href?: string })?.url
        ?? (v as { path?: string })?.path
        ?? (v as { href?: string })?.href;
      if (typeof u === 'string') return u;
    }
    return String(v);
  };
  if (Array.isArray(raw)) {
    return raw
      .map(normalize)
      .map((s) => stripHash(s.trim()))
      .filter(Boolean);
  }
  if (raw === null || raw === undefined) return [];
  const s = String(raw).trim();
  if (!s) return [];
  if (s.startsWith('[')) {
    try {
      const arr = JSON.parse(s) as unknown;
      if (Array.isArray(arr))
        return arr
          .map(normalize)
          .map((x) => stripHash(String(x).trim()))
          .filter(Boolean);
    } catch {
      // ignore
    }
  }
  if (s.includes(',')) return s.split(',').map((x) => stripHash(x.trim())).filter(Boolean);
  return [stripHash(s)];
};

/** 详情预览 / 上传校验：仅允许常见图片后缀 */
const IMAGE_EXT = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']);
const MAX_DETAIL_PREVIEW_IMAGES = 20;
const MAX_PROCESS_UPLOAD_COUNT = 9;
const MAX_IMAGE_SIZE_MB = 5;

function getUrlExtension(url: string): string {
  const path = url.split('?')[0].split('#')[0];
  const seg = path.split('/').pop() ?? '';
  return seg.includes('.') ? (seg.split('.').pop()?.toLowerCase() ?? '') : '';
}

/** 无后缀 URL 仍尝试按图片预览（接口常返回无扩展名地址） */
function isPreviewableImageUrl(url: string): boolean {
  const ext = getUrlExtension(url);
  if (!ext) return true;
  return IMAGE_EXT.has(ext);
}

/** 申诉处理 — 派送部门固定选项（与产品示意图一致） */
const DISPATCH_DEPT_OPTIONS: Array<{ value: string; label: string }> = [
  { value: '平台运营组', label: '平台运营组' },
  { value: '攻坚办', label: '攻坚办' },
  { value: '工信局', label: '工信局' },
  { value: '发改委', label: '发改委' },
  { value: '科技局', label: '科技局' },
  { value: '商务局', label: '商务局' },
  { value: '税务局', label: '税务局' },
  { value: '数据局', label: '数据局' },
  { value: '生态环境局', label: '生态环境局' },
  { value: '应急局', label: '应急局' },
];

/** 问题类型：字典未返回或与编码不一致时的中文兜底（与处理弹窗一致） */
const DEFAULT_PROBLEM_TYPE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: '1', label: '项目问题' },
  { value: '2', label: '权限开通' },
  { value: '3', label: '优化建议' },
  { value: '4', label: '其他' },
];

const ApealAdvance: FC = () => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const { setInitialState } = useModel('@@initialState');
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  /** 从列表点「详情」进入时带 hideProcess=1，不展示「处理」按钮；另需接口 beOperator 且未已处理 */
  const hideProcessFromList = searchParams.get('hideProcess') === '1';

  const [feedbackData, setFeedbackData] = useState<UserFeedbackVo | null>(null);
  const [problemTypeOptions, setProblemTypeOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [processModalVisible, setProcessModalVisible] = useState(false);
  const [processForm] = Form.useForm();
  const reassignWatch = Form.useWatch('reassign', processForm);
  const processStatusWatch = Form.useWatch('status', processForm);
  const [submitting, setSubmitting] = useState(false);
  const [processFileList, setProcessFileList] = useState<UploadFile[]>([]);
  const [processUploading, setProcessUploading] = useState(false);

  const [commentList, setCommentList] = useState<ExtendedComment[]>([]);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [replyForm] = Form.useForm();
  const [replyingToId, setReplyingToId] = useState<string | undefined>(undefined);
  const [replying, setReplying] = useState(false);

  const breadcrumbList = [
    { path: '/qa-manage', title: '问题反馈' },
    { path: '/qa-manage/detail', title: '反馈详情' },
  ];

  const fetchDict = async () => {
    try {
      const res = await systemApi.getDictItems({ catalog: 'problem_type' });
      const opts =
        (Array.isArray(res) ? res : [])
          .filter((x: { enabled?: boolean }) => x?.enabled !== false)
          .map((x: { value?: unknown; code?: unknown; label?: unknown }) => ({
            value: String(x.value ?? x.code),
            label: String(x.label ?? x.value ?? x.code ?? '').trim(),
          }))
          .filter((x: { value?: string; label?: string }) => x.value && x.label) ?? [];
      setProblemTypeOptions(opts);
    } catch {
      setProblemTypeOptions([]);
    }
  };

  /** 处理弹窗内问题类型：字典优先，无则与示意图一致的兜底 */
  const processModalProblemOptions =
    problemTypeOptions.length > 0
      ? problemTypeOptions.map((o) => ({ value: o.value, label: o.label }))
      : DEFAULT_PROBLEM_TYPE_OPTIONS;

  const getProblemTypeLabel = (data: UserFeedbackVo | null) => {
    if (!data) return '-';
    const rawCat = data.problemCategory;
    const catKey = rawCat === undefined || rawCat === null ? '' : String(rawCat);
    const apiLabel = data.problemCategoryLabel?.trim();

    if (!catKey) {
      return apiLabel || '-';
    }

    const dictHit = problemTypeOptions.find((o) => String(o.value) === catKey);
    if (dictHit?.label) return dictHit.label;

    const defaultHit = DEFAULT_PROBLEM_TYPE_OPTIONS.find((o) => o.value === catKey);
    if (defaultHit?.label) return defaultHit.label;

    /** 接口返回的中文说明（排除与编码相同的纯数字串，避免详情只显示 1、2） */
    if (apiLabel && apiLabel !== catKey && !/^\d+$/.test(apiLabel)) {
      return apiLabel;
    }

    return '-';
  };

  const loadFeedback = async () => {
    if (!id) {
      message.error('缺少反馈ID');
      return;
    }
    try {
      setLoading(true);
      const data = await primeApi.getUserFeedback({ id });
      setFeedbackData(data);
    } catch (e) {
      console.error(e);
      message.error('获取问题反馈详情失败');
      setFeedbackData(null);
    } finally {
      setLoading(false);
    }
  };

  const getCommentList = async () => {
    if (!id) return;
    try {
      const page = await primeApi.listUserFeedbackComment({
        feedbackId: id,
        page: 1,
        size: 1000,
      });
      const records = page.records ?? [];

      const commentMap = new Map<string, UserFeedbackCommentVo>();
      records.forEach((comment) => {
        if (comment.id) commentMap.set(comment.id, comment);
      });

      const extendedComments: ExtendedComment[] = records.map((comment) => {
        const raw = comment as ExtendedComment;
        const extended: ExtendedComment = {
          ...comment,
          images: comment.images ?? [],
          userName: raw.userName ?? (comment as { name?: string }).name ?? comment.userid,
          createTime: raw.createTime ?? (comment as { createTime?: string }).createTime,
        };
        if (comment.replyToId) {
          extended.replyToComment = commentMap.get(comment.replyToId);
        }
        return extended;
      });

      extendedComments.sort((a, b) => {
        const ta = a.createTime ? new Date(a.createTime).getTime() : 0;
        const tb = b.createTime ? new Date(b.createTime).getTime() : 0;
        return tb - ta;
      });

      setCommentList(extendedComments);
    } catch (e) {
      console.error('获取回复列表失败:', e);
      message.error('获取回复列表失败');
    }
  };

  useEffect(() => {
    fetchDict();
  }, []);

  useEffect(() => {
    if (id) {
      loadFeedback();
      getCommentList();
    }
  }, [id]);

  const processUploadProps: UploadProps = {
    action: '/system-api/file',
    name: 'files',
    listType: 'picture-card',
    accept: '.jpg,.jpeg,.png,.gif,.webp,.bmp,image/*',
    maxCount: MAX_PROCESS_UPLOAD_COUNT,
    fileList: processFileList,
    multiple: true,
    beforeUpload(file) {
      const ext = file.name?.split('.').pop()?.toLowerCase() ?? '';
      const extOk = IMAGE_EXT.has(ext);
      const mimeOk = file.type?.startsWith('image/');
      if (!mimeOk && !extOk) {
        message.error('仅支持 jpg、jpeg、png、gif、webp、bmp 图片');
        return Upload.LIST_IGNORE;
      }
      const maxBytes = MAX_IMAGE_SIZE_MB * 1024 * 1024;
      if (file.size > maxBytes) {
        message.error(`单张图片不超过 ${MAX_IMAGE_SIZE_MB}MB`);
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onChange({ file, fileList: fl }) {
      setProcessFileList(fl);
      if (file.status === 'uploading') setProcessUploading(true);
      if (file.status === 'done' || file.status === 'error' || file.status === 'removed') {
        setProcessUploading(false);
      }
    },
  };

  const handleProcess = () => {
    setProcessFileList([]);
    processForm.resetFields();
    if (feedbackData) {
      processForm.setFieldsValue({
        status: feedbackData.status === true ? 'done' : 'processing',
        problemCategory:
          feedbackData.problemCategory !== undefined && feedbackData.problemCategory !== null
            ? String(feedbackData.problemCategory)
            : undefined,
        reassign: '否',
        result: (feedbackData.result ?? '').trim(),
      });
    } else {
      processForm.setFieldsValue({ reassign: '否' });
    }
    setProcessModalVisible(true);
  };

  const handleProcessSubmit = async () => {
    try {
      const values = await processForm.validateFields();
      if (!id || !feedbackData) {
        message.error('缺少反馈数据');
        return;
      }

      setSubmitting(true);
      const baseImages = parseImagesField(feedbackData.images as unknown);

      const commentImages = processFileList
        .filter((f) => f.status === 'done' && f.response)
        .map((f) => {
          const res = f.response as { path?: string; name?: string }[] | undefined;
          const path = Array.isArray(res) && res[0]?.path ? String(res[0].path) : '';
          const name =
            (typeof f.name === 'string' && f.name) ||
            (Array.isArray(res) && res[0]?.name ? String(res[0].name) : '') ||
            path.split('/').pop()?.split('?')[0] ||
            '附件';
          return { name, path };
        })
        .filter((x) => x.path);

      const statusResolved = values.status === 'done';
      const problemCategoryNum =
        values.problemCategory !== undefined && values.problemCategory !== null && values.problemCategory !== ''
          ? Number(values.problemCategory)
          : undefined;

      const dispatchDeptIdStr =
        !statusResolved &&
        values.reassign === '是' &&
        String(values.dispatchDeptId ?? '').trim() !== ''
          ? String(values.dispatchDeptId).trim()
          : '';

      await primeApi.updateUserFeedback({
        id: String(id),
        userFeedbackDto: {
          images: baseImages,
          images2: commentImages,
          problemCategory: problemCategoryNum,
          status: statusResolved,
          result: (values.result ?? '').trim(),
          ...(dispatchDeptIdStr
            ? {
                operatorCode: dispatchDeptIdStr,
                operator:
                  DISPATCH_DEPT_OPTIONS.find((d) => d.value === dispatchDeptIdStr)?.label ??
                  dispatchDeptIdStr,
              }
            : {}),
        } as any,
      });

      message.success('处理成功');
      setProcessModalVisible(false);
      processForm.resetFields();
      setProcessFileList([]);
      const badgeCount4 = await fetchUserFeedbackPendingCount();
      setInitialState((s) => ({ ...s, badgeCount4 }));
      await loadFeedback();
      await getCommentList();
    } catch (error: unknown) {
      if ((error as { errorFields?: unknown })?.errorFields) return;
      console.error('处理失败:', error);
      message.error('处理失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProcessCancel = () => {
    setProcessModalVisible(false);
    processForm.resetFields();
    setProcessFileList([]);
  };

  const handleReply = (commentId?: string) => {
    setReplyingToId(commentId);
    setReplyModalVisible(true);
    replyForm.resetFields();
  };

  const handleReplySubmit = async () => {
    try {
      const values = await replyForm.validateFields();
      if (!id) {
        message.error('缺少反馈ID');
        return;
      }

      setReplying(true);
      await primeApi.createUserFeedbackComment({
        userFeedbackCommentDto: {
          feedbackId: id,
          replyToId: replyingToId,
          content: values.content,
          images: [],
        } as any,
      });

      message.success('回复成功');
      setReplyModalVisible(false);
      setReplyingToId(undefined);
      replyForm.resetFields();
      await getCommentList();
    } catch (error: unknown) {
      if ((error as { errorFields?: unknown })?.errorFields) return;
      console.error('回复失败:', error);
      message.error('回复失败，请重试');
    } finally {
      setReplying(false);
    }
  };

  const handleReplyCancel = () => {
    setReplyModalVisible(false);
    setReplyingToId(undefined);
    replyForm.resetFields();
  };

  const getCommentSenderName = (comment: ExtendedComment) => {
    const name =
      comment.userName === undefined || comment.userName === null ? '' : String(comment.userName).trim();
    const id =
      comment.userid === undefined || comment.userid === null ? '' : String(comment.userid).trim();
    return name || id || '-';
  };

  const formatCommentTime = (comment: ExtendedComment) => {
    if (!comment.createTime) return '-';
    const d = dayjs(comment.createTime);
    return d.isValid() ? d.format('YYYY-MM-DD HH:mm:ss') : '-';
  };

  const imageUrls = parseImagesField(feedbackData?.images as unknown);
  const previewImageUrls = imageUrls.filter(isPreviewableImageUrl).slice(0, MAX_DETAIL_PREVIEW_IMAGES);
  const nonImageAttachmentUrls = imageUrls.filter((u) => !isPreviewableImageUrl(u));
  const detailPreviewOverflow = imageUrls.filter(isPreviewableImageUrl).length > MAX_DETAIL_PREVIEW_IMAGES;

  return (
    <PageContainer
      style={{
        minWidth: '1200px',
        height: '90vh',
        overflow: 'scroll',
        scrollbarWidth: 'none',
        backgroundImage: 'url(/mg/bg.png)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        padding: '0 120px 0',
      }}
      breadcrumb={{
        routes: breadcrumbList,
        itemRender: (route, _params, routes) => {
          const last = routes.indexOf(route) === routes.length - 1;
          return last ? (
            <span>{route.title}</span>
          ) : (
            <a
              onClick={() => {
                navigate('/qa-manage');
              }}
            >
              {route.title}
            </a>
          );
        },
      }}
      title={false}
      className={styles.pageHeader}
    >
      <Spin spinning={loading}>
        <div style={{ backgroundColor: '#fff', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>问题反馈详情</h2>
            {!hideProcessFromList &&
            !!feedbackData &&
            feedbackData.status !== true &&
            feedbackData.beOperator === true ? (
              <Button type="primary" onClick={handleProcess}>
                处理
              </Button>
            ) : null}
          </div>
          <Descriptions
            bordered
            size="middle"
            column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
            className="custom-descriptions"
          >
            <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="所属单位" span={1}>
              {feedbackData?.orgName ?? '-'}
            </Descriptions.Item>
            <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="反馈人" span={1}>
              {feedbackData?.userName ?? '-'}
            </Descriptions.Item>
            <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="联系方式" span={1}>
              {feedbackData?.userMobile?.trim() ? feedbackData.userMobile : '-'}
            </Descriptions.Item>
            <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="问题类型" span={1}>
              {getProblemTypeLabel(feedbackData)}
            </Descriptions.Item>
            <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="问题描述" span={2}>
              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  minHeight: '60px',
                  padding: '8px',
                  backgroundColor: '#fafafa',
                  borderRadius: '4px',
                }}
              >
                {feedbackData?.content ?? '-'}
              </div>
            </Descriptions.Item>
            <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="图片" span={2}>
              {imageUrls.length > 0 ? (
                <div>
                  {previewImageUrls.length > 0 ? (
                    <Image.PreviewGroup>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {previewImageUrls.map((u, idx) => (
                          <Image
                            key={`${u}-${idx}`}
                            src={u}
                            width={96}
                            height={96}
                            style={{ objectFit: 'cover', borderRadius: 4 }}
                            preview={{ src: u }}
                          />
                        ))}
                      </div>
                    </Image.PreviewGroup>
                  ) : null}
                  {detailPreviewOverflow ? (
                    <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                      仅展示前 {MAX_DETAIL_PREVIEW_IMAGES} 张图片，其余请从列表数据查看
                    </div>
                  ) : null}
                  {nonImageAttachmentUrls.length > 0 ? (
                    <div style={{ marginTop: previewImageUrls.length > 0 ? 12 : 0 }}>
                      <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>非图片附件</div>
                      {nonImageAttachmentUrls.map((u, idx) => (
                        <div key={`${u}-${idx}`}>
                          <a href={u} target="_blank" rel="noreferrer">
                            {u.split('/').pop()?.split('?')[0] || u}
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                '-'
              )}
            </Descriptions.Item>
          </Descriptions>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '20px', marginTop: '20px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: 'bold' }}>处理意见</h3>
          {commentList.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {commentList.map((comment) => (
                <Card
                  key={comment.id}
                  style={{
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                  bodyStyle={{ padding: '16px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
                        {getCommentSenderName(comment)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>{formatCommentTime(comment)}</div>
                      {comment.replyToComment ? (
                        <div
                          style={{
                            backgroundColor: '#f5f5f5',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            marginBottom: '8px',
                            fontSize: '13px',
                            color: '#666',
                            borderLeft: '3px solid #1890ff',
                          }}
                        >
                          {getCommentSenderName(comment.replyToComment as ExtendedComment)}: {comment.replyToComment.content}
                        </div>
                      ) : null}
                      <div style={{ fontSize: '14px', color: '#333', lineHeight: '1.6' }}>{comment.content}</div>
                      {(comment.images?.length ?? 0) > 0 ? (
                        <div style={{ marginTop: 12 }}>
                          {(() => {
                            const files = comment.images ?? [];
                            /** 优先按 path 后缀识别（name 常为空或与真实 URL 不一致） */
                            const isCommentImageFile = (f: (typeof files)[number]) => {
                              const path = f.path ?? '';
                              const pathExt = getUrlExtension(path);
                              if (pathExt && IMAGE_EXT.has(pathExt)) return true;
                              const fileName = f.name || path.split('/').pop()?.split('?')[0] || '';
                              const nameExt = fileName.includes('.') ? (fileName.split('.').pop()?.toLowerCase() ?? '') : '';
                              if (nameExt && IMAGE_EXT.has(nameExt)) return true;
                              return isPreviewableImageUrl(path);
                            };
                            const imgFiles = files.filter(isCommentImageFile);
                            const otherFiles = files.filter((f) => !isCommentImageFile(f));
                            return (
                              <>
                                {imgFiles.length > 0 ? (
                                  <Image.PreviewGroup>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                      {imgFiles.map((file, index) => {
                                        const fileName =
                                          file.name || file.path.split('/').pop()?.split('?')[0] || `图片${index + 1}`;
                                        return (
                                          <Image
                                            key={`${file.path}-${index}`}
                                            width={72}
                                            height={72}
                                            src={file.path}
                                            alt={fileName}
                                            style={{ objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }}
                                            preview={{
                                              src: file.path,
                                            }}
                                          />
                                        );
                                      })}
                                    </div>
                                  </Image.PreviewGroup>
                                ) : null}
                                {otherFiles.length > 0 ? (
                                  <List
                                    style={{ marginTop: imgFiles.length > 0 ? 12 : 0 }}
                                    size="small"
                                    dataSource={otherFiles}
                                    renderItem={(file, index) => {
                                      const fileName =
                                        file.name || file.path.split('/').pop()?.split('?')[0] || `附件${index + 1}`;
                                      return (
                                        <List.Item>
                                          <a href={file.path} target="_blank" rel="noreferrer">
                                            {fileName}
                                          </a>
                                        </List.Item>
                                      );
                                    }}
                                  />
                                ) : null}
                              </>
                            );
                          })()}
                        </div>
                      ) : null}
                    </div>
                    <Button type="link" onClick={() => handleReply(comment.id)} style={{ padding: 0, fontSize: '14px' }}>
                      回复
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>暂无处理意见</div>
          )}
        </div>
      </Spin>

      <Modal
        title="申诉处理"
        open={processModalVisible}
        onCancel={handleProcessCancel}
        onOk={handleProcessSubmit}
        okText="确定"
        cancelText="取消"
        confirmLoading={submitting || processUploading}
        width={720}
        destroyOnClose
      >
        <Form form={processForm} layout="vertical" style={{ marginTop: '20px' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="处理状态" name="status" rules={[{ required: true, message: '请选择处理状态' }]}>
                <Select
                  placeholder="下拉选择，处理中/已处理"
                  allowClear={false}
                  onChange={(v) => {
                    if (v === 'done') {
                      processForm.setFieldsValue({ reassign: '否', dispatchDeptId: undefined });
                    }
                  }}
                >
                  <Select.Option value="processing">处理中</Select.Option>
                  <Select.Option value="done">已处理</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="问题类型" name="problemCategory" rules={[{ required: true, message: '请选择问题类型' }]}>
                <Select
                  placeholder="下拉选择，项目问题/权限开通/优化建议"
                  options={processModalProblemOptions}
                  showSearch
                  optionFilterProp="label"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="是否转派" name="reassign" rules={[{ required: true, message: '请选择是否转派' }]}>
                <Select
                  placeholder="请选择"
                  disabled={processStatusWatch === 'done'}
                  onChange={(v) => {
                    if (v === '否') {
                      processForm.setFieldsValue({ dispatchDeptId: undefined });
                    }
                  }}
                >
                  <Select.Option value="是">是</Select.Option>
                  <Select.Option value="否">否</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            {reassignWatch === '是' ? (
              <Col span={12}>
                <Form.Item
                  label="派送部门"
                  name="dispatchDeptId"
                  rules={[{ required: true, message: '请选择派送部门' }]}
                >
                  <Select
                    placeholder="选择部门 (项目问题，权限问题默认关联"
                    options={DISPATCH_DEPT_OPTIONS}
                    showSearch
                    optionFilterProp="label"
                    allowClear
                  />
                </Form.Item>
              </Col>
            ) : null}
          </Row>
          <Form.Item
            label="处理意见"
            name="result"
            rules={[{ required: true, whitespace: true, message: '请输入处理意见' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入处理意见" maxLength={500} showCount />
          </Form.Item>
          <Form.Item
            label="图片"
            extra={`最多 ${MAX_PROCESS_UPLOAD_COUNT} 张，单张 ≤ ${MAX_IMAGE_SIZE_MB}MB，支持 jpg / png / gif / webp / bmp`}
          >
            <Upload {...processUploadProps}>
              <div style={{ color: 'rgba(0,0,0,0.45)' }}>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="回复"
        open={replyModalVisible}
        onCancel={handleReplyCancel}
        onOk={handleReplySubmit}
        okText="确定"
        cancelText="取消"
        confirmLoading={replying}
        width={500}
      >
        <Form form={replyForm} layout="vertical" style={{ marginTop: '20px' }}>
          <Form.Item label="回复内容" name="content" rules={[{ required: true, message: '请输入回复内容' }]}>
            <Input.TextArea rows={4} placeholder="请输入回复内容" maxLength={500} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ApealAdvance;
