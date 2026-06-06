import { PageContainer } from '@ant-design/pro-components';
import { FC, useEffect, useState } from 'react';
import React from 'react';
import useStyles from './style.style';
import "./DescriptionsStyle.css";
import { useNavigate } from '@@/exports';
import { Button, Card, Descriptions, Form, Image, Input, List, message, Modal, Select, Spin } from 'antd';
import { ProjectAppealApprovalDto, ProjectAppealCommentDto, ProjectAppealCommentVo, ProjectAppealVo, ProjectDigitalInvestmentAttractingVo } from "@/services/apis";
import { primeApi } from "@/services/api";
import { useModel, useSearchParams } from "@umijs/max";
import dayjs from "dayjs";

// 扩展评论类型，包含可能的用户名信息
interface ExtendedComment extends ProjectAppealCommentVo {
  userName?: string;
  replyToComment?: ProjectAppealCommentVo;
}

const ApealAdvance: FC = () => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  
  const [appealData, setAppealData] = useState<ProjectAppealVo>();
  const [projectData, setProjectData] = useState<ProjectDigitalInvestmentAttractingVo>();
  const [loading, setLoading] = useState(false);
  const [processModalVisible, setProcessModalVisible] = useState(false);
  const [processForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  
  // 评论相关状态
  const [commentList, setCommentList] = useState<ExtendedComment[]>([]);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [replyForm] = Form.useForm();
  const [replyingToId, setReplyingToId] = useState<string | undefined>(undefined);
  const [replying, setReplying] = useState(false);

  const breadcrumbList = [
    { path: '/project-apeal', breadcrumbName: '项目申诉' },
    { path: '/project-apeal-advance', breadcrumbName: '申诉详情' },
  ];

  // 获取项目申诉详情
  const getProjectAppeal = async () => {
    if (!id) {
      message.error('缺少申诉ID');
      return;
    }
    try {
      setLoading(true);
      const data = await primeApi.getProjectAppeal({ id: id });
      console.log('申诉详情:', data);
      setAppealData(data);
      
      // 如果有 investmentId，获取项目信息
      if (data.investmentId) {
        try {
          const projectInfo = await primeApi.getProjectDigitalInvestmentAttracting({ id: data.investmentId });
          setProjectData(projectInfo);
        } catch (e) {
          console.error('获取项目信息失败:', e);
        }
      }
    } catch (e) {
      console.error('获取申诉详情失败:', e);
      message.error('获取申诉详情失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取评论列表
  const getCommentList = async () => {
    if (!id) return;
    try {
      const data = await primeApi.listProjectAppealComment({
        appealId: id,
        page: 1,
        size: 1000, // 获取所有评论
      });
      console.log('评论列表:', data);
      
      // 构建评论映射，用于查找回复的评论
      const commentMap = new Map<string, ProjectAppealCommentVo>();
      data.forEach(comment => {
        commentMap.set(comment.id, comment);
      });
      
      // 扩展评论数据，添加回复的评论信息
      const extendedComments: ExtendedComment[] = data.map(comment => {
        const extended: ExtendedComment = {
          ...comment,
          userName: (comment as any).userName || (comment as any).name || comment.userid, // 尝试获取用户名
        };
        
        // 如果有回复ID，查找被回复的评论
        if (comment.replyToId) {
          extended.replyToComment = commentMap.get(comment.replyToId);
        }
        
        return extended;
      });
      
      // 按时间倒序排列
      extendedComments.sort((a, b) => {
        return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
      });
      
      setCommentList(extendedComments);
    } catch (e) {
      console.error('获取评论列表失败:', e);
    }
  };

  useEffect(() => {
    if (id) {
      getProjectAppeal();
      getCommentList();
    }
  }, [id]);

  // 打开处理 Modal
  const handleProcess = () => {
    setProcessModalVisible(true);
    processForm.resetFields();
  };

  // 提交处理结果
  const handleProcessSubmit = async () => {
    try {
      const values = await processForm.validateFields();
      if (!id) {
        message.error('缺少申诉ID');
        return;
      }

      setSubmitting(true);
      const approvalDto: ProjectAppealApprovalDto = {
        result: values.result === '通过', // 将字符串转换为 boolean
        content: values.comment || '', // 审核意见，非必填
      };

      await primeApi.handleProjectAppeal({
        id: id,
        projectAppealApprovalDto: approvalDto,
      });

      message.success('处理成功');
      setProcessModalVisible(false);
      processForm.resetFields();
      
      // 刷新数据
      await getProjectAppeal();
      await getCommentList();
    } catch (error: any) {
      if (error?.errorFields) {
        // 表单验证错误
        return;
      }
      console.error('处理申诉失败:', error);
      message.error('处理申诉失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 取消处理
  const handleProcessCancel = () => {
    setProcessModalVisible(false);
    processForm.resetFields();
  };

  // 打开回复 Modal
  const handleReply = (commentId?: string) => {
    setReplyingToId(commentId);
    setReplyModalVisible(true);
    replyForm.resetFields();
  };

  // 提交回复
  const handleReplySubmit = async () => {
    try {
      const values = await replyForm.validateFields();
      if (!id) {
        message.error('缺少申诉ID');
        return;
      }

      setReplying(true);
      const commentDto: ProjectAppealCommentDto = {
        appealId: id,
        replyToId: replyingToId,
        content: values.content,
      };

      await primeApi.createProjectAppealComment({
        projectAppealCommentDto: commentDto,
      });

      message.success('回复成功');
      setReplyModalVisible(false);
      setReplyingToId(undefined);
      replyForm.resetFields();
      
      // 刷新评论列表
      await getCommentList();
    } catch (error: any) {
      if (error?.errorFields) {
        // 表单验证错误
        return;
      }
      console.error('回复失败:', error);
      message.error('回复失败，请重试');
    } finally {
      setReplying(false);
    }
  };

  // 取消回复
  const handleReplyCancel = () => {
    setReplyModalVisible(false);
    setReplyingToId(undefined);
    replyForm.resetFields();
  };

  // 获取评论发送者名称
  const getCommentSenderName = (comment: ExtendedComment) => {
    // 优先使用扩展的用户名
    if (comment.userName && comment.userName !== comment.userid) {
      return comment.userName;
    }
    // 如果 userid 和当前用户相同，显示当前用户名
    if (comment.userid === currentUser?.userid) {
      return (currentUser as any)?.realName || currentUser?.name || comment.userid;
    }
    // 否则显示 userid
    return comment.userid;
  };

  // 跳转到项目详情
  const handleProjectClick = () => {
    if (appealData?.investmentId) {
      navigate(`/xmgl/xmjd?id=${appealData.investmentId}`);
    }
  };

  // 跳转到质态评估
  const handleQualityAssessmentClick = () => {
    if (appealData?.investmentId) {
      navigate(`/xmgl/qa-state?id=${appealData.investmentId}`);
    }
  };

  // 跳转到签约核定
  const handleSigningApprovalClick = () => {
    if (appealData?.investmentId) {
      navigate(`/xmgl4/pro-sign?id=${appealData.investmentId}`);
    }
  };

  // 跳转到开工认定
  const handleStartApprovalClick = () => {
    if (appealData?.investmentId) {
      navigate(`/xmgl4/pro-start?id=${appealData.investmentId}`);
    }
  };

  // 获取项目类型显示文本
  const getProjectTypeText = () => {
    if (!projectData) return '-';
    const types: string[] = [];
    // 使用类型断言访问可能存在的字段
    const bindustry = (projectData as any).bindustry;
    const isKcProj = (projectData as any).isKcProj;
    if (bindustry === 1) types.push('服务业项目');
    if (bindustry === 2) types.push('工业项目');
    if (isKcProj === '1' || isKcProj === '是') types.push('科创项目');
    return types.length > 0 ? types.join('/') : '-';
  };

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
        itemRender: (route, params, routes) => {
          const last = routes.indexOf(route) === routes.length - 1;
          return last ? (
            <span>{route.title}</span>
          ) : (
            <a
              onClick={() => {
                navigate(-1);
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
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
            {appealData?.projectName || '项目申诉详情'}
          </h2>
          <Button type="primary" onClick={handleProcess}>
            处理
          </Button>
        </div>
      </div>

      {/* 项目信息 */}
      <div style={{ backgroundColor: '#fff', padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: 'bold' }}>项目信息</h3>
        <Descriptions
          bordered
          size="middle"
          column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
          className="custom-descriptions"
        >
          <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="招引单位" span={1}>
            {(projectData as any)?.sjjgName || appealData?.sjjgName || '-'}
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="项目名称" span={1}>
            {appealData?.projectName ? (
              <Button type="link" onClick={handleProjectClick} style={{ padding: 0 }}>
                {appealData.projectName}
              </Button>
            ) : '-'}
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="项目代码" span={1}>
            {projectData?.projectCode || '-'}
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="签约日期" span={1}>
            {(projectData as any)?.signedStatDate ? dayjs((projectData as any).signedStatDate).format('YYYY-MM-DD') : '-'}
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="项目类型" span={1}>
            {getProjectTypeText()}
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="质态评估" span={1}>
            <Button type="link" onClick={handleQualityAssessmentClick} style={{ padding: 0 }}>
              点击查看质态评估
            </Button>
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="签约核定" span={1}>
            <Button type="link" onClick={handleSigningApprovalClick} style={{ padding: 0 }}>
              点击查看签约核定
            </Button>
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="开工认定" span={1}>
            {(projectData as any)?.currentProjectProgress?.includes('开工') ? (
              <Button type="link" onClick={handleStartApprovalClick} style={{ padding: 0 }}>
                点击查看开工认定
              </Button>
            ) : '暂无'}
          </Descriptions.Item>
        </Descriptions>
      </div>

      {/* 申诉信息 */}
      <div style={{ backgroundColor: '#fff', padding: '20px' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: 'bold' }}>申诉信息</h3>
        <Descriptions
          bordered
          size="middle"
          column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
          className="custom-descriptions"
        >
          <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="申诉人" span={1}>
            {appealData?.appealer || '-'}
          </Descriptions.Item>
          <Descriptions.Item labelStyle={{ minWidth: '120px', maxWidth: '180px' }} label="申诉时间" span={1}>
            {appealData?.createTime ? dayjs(appealData.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
          </Descriptions.Item>
          <Descriptions.Item 
            labelStyle={{ minWidth: '120px', maxWidth: '180px' }} 
            label="问题描述" 
            span={2}
          >
            <div style={{ 
              whiteSpace: 'pre-wrap', 
              wordBreak: 'break-word',
              minHeight: '60px',
              padding: '8px',
              backgroundColor: '#fafafa',
              borderRadius: '4px'
            }}>
              {appealData?.description || '-'}
            </div>
          </Descriptions.Item>
          <Descriptions.Item 
            labelStyle={{ minWidth: '120px', maxWidth: '180px' }} 
            label="文件" 
            span={2}
          >
            {appealData?.images && appealData.images.length > 0 ? (
              <List
                size="small"
                dataSource={appealData.images}
                renderItem={(file, index) => {
                  const fileName = file.name || file.path.split('/').pop()?.split('?')[0] || `文件${index + 1}`;
                  const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
                  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(fileExtension);
                  
                  return (
                    <List.Item>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                        {isImage ? (
                          <Image
                            width={60}
                            height={60}
                            src={file.path}
                            alt={fileName}
                            style={{ objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                            preview={{
                              src: file.path,
                            }}
                          />
                        ) : null}
                        <a 
                          href={file.path} 
                          target="_blank" 
                          download={fileName}
                          style={{ flex: 1 }}
                        >
                          {fileName}
                        </a>
                      </div>
                    </List.Item>
                  );
                }}
              />
            ) : '-'}
          </Descriptions.Item>
        </Descriptions>
      </div>

      {/* 申诉意见列表 */}
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
                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
                      {dayjs(comment.createTime).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                    {comment.replyToComment && (
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
                    )}
                    <div style={{ fontSize: '14px', color: '#333', lineHeight: '1.6' }}>
                      {comment.content}
                    </div>
                  </div>
                  <Button
                    type="link"
                    onClick={() => handleReply(comment.id)}
                    style={{ padding: 0, fontSize: '14px' }}
                  >
                    回复
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            暂无处理意见
          </div>
        )}
      </div>
      </Spin>

      {/* 申诉处理 Modal */}
      <Modal
        title="申诉处理"
        open={processModalVisible}
        onCancel={handleProcessCancel}
        onOk={handleProcessSubmit}
        okText="确定"
        cancelText="取消"
        confirmLoading={submitting}
        width={500}
      >
        <Form
          form={processForm}
          layout="vertical"
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            label="通过/驳回"
            name="result"
            rules={[{ required: true, message: '请选择通过/驳回' }]}
          >
            <Select placeholder="下拉选择,通过/驳回">
              <Select.Option value="通过">通过</Select.Option>
              <Select.Option value="驳回">驳回</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="审核意见"
            name="comment"
            dependencies={['result']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const result = getFieldValue('result');
                  if (result === '驳回' && (!value || value.trim() === '')) {
                    return Promise.reject(new Error('选择驳回时，审核意见为必填项'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="文本输入,驳回时必填"
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 回复 Modal */}
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
        <Form
          form={replyForm}
          layout="vertical"
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            label="回复内容"
            name="content"
            rules={[{ required: true, message: '请输入回复内容' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="请输入回复内容"
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ApealAdvance;
