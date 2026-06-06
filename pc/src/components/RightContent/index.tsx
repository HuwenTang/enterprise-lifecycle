import '@umijs/max';
import React, { useCallback, useMemo, useState } from 'react';
import { FormOutlined, BookOutlined, PlayCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import HeaderDropdown from '../HeaderDropdown';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { Form, Input, message, Modal, Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { primeApi, systemApi } from '@/services/api';

/** 根据文件头魔数识别真实图片类型（防止仅改扩展名/MIME） */
async function sniffImageKindFromContent(file: File): Promise<'jpeg' | 'png' | 'webp' | 'svg' | null> {
  const peek = Math.max(16, 2048);
  const buf = new Uint8Array(await file.slice(0, peek).arrayBuffer());
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xd8) return 'jpeg';
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'png';
  if (
    buf.length >= 12 &&
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  ) {
    return 'webp';
  }
  const head = new TextDecoder('utf-8', { fatal: false })
    .decode(buf)
    .replace(/^\uFEFF/, '')
    .trimStart();
  const lower = head.slice(0, 800).toLowerCase();
  if (lower.startsWith('<svg') || (lower.startsWith('<?xml') && /<\s*svg[\s>/]/i.test(head.slice(0, 2000)))) {
    return 'svg';
  }
  return null;
}

function kindFromMime(type: string): 'jpeg' | 'png' | 'webp' | 'svg' | null {
  const t = String(type || '').toLowerCase();
  if (t === 'image/jpeg') return 'jpeg';
  if (t === 'image/png') return 'png';
  if (t === 'image/webp') return 'webp';
  if (t === 'image/svg+xml') return 'svg';
  return null;
}

function kindFromFileName(name: string): 'jpeg' | 'png' | 'webp' | 'svg' | null {
  const n = String(name || '').toLowerCase();
  if (n.endsWith('.jpg') || n.endsWith('.jpeg')) return 'jpeg';
  if (n.endsWith('.png')) return 'png';
  if (n.endsWith('.webp')) return 'webp';
  if (n.endsWith('.svg')) return 'svg';
  return null;
}

export type SiderTheme = 'light' | 'dark';

export const SelectLang = () => {
  return (
  <div>

  </div>
  );
};

export const Question = () => {
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportForm] = Form.useForm();
  const [reportFileList, setReportFileList] = useState<UploadFile[]>([]);

  // 菜单项数据
  const menuItems = [
    {
      key: 'Question',
      icon: <QuestionCircleOutlined />,
      label: '平台使用教程',
    },
    {
      key: 'reviewVideo',
      icon: <PlayCircleOutlined />,
      label: '审核部门操作视频',
    },
    {
      key: 'cityVideo',
      icon: <PlayCircleOutlined />,
      label: '市级部门操作视频',
    },
    {
      key: 'countyVideo',
      icon: <PlayCircleOutlined />,
      label: '区县发改委操作视频',
    },
  ];

  // 处理菜单点击事件
  const onMenuClick = useCallback((event: MenuInfo) => {
    const { key } = event;
    if (key === 'Question') {
      window.open('http://172.22.71.96/resources/9fe0dc47cf0e8f58ad23408e0475afb0_raw.mp4');
      return;
    }
    if (key === 'reviewVideo') {
      window.open('http://172.22.71.96/resources/审核部门操作视频.mp4');
      return;
    }
    if (key === 'cityVideo') {
      window.open('http://172.22.71.96/resources/市级部门操作视频.mp4');
      return;
    }
    if (key === 'countyVideo') {
      window.open('http://172.22.71.96/resources/区县发改委操作视频.mp4');
      return;
    }
  }, []);

  const reportUploadProps: UploadProps = useMemo(
    () => ({
      action: '/system-api/file',
      name: 'file',
      multiple: true,
      maxCount: 9,
      listType: 'picture-card',
      accept: 'image/webp,image/jpeg,image/png,image/svg+xml',
      beforeUpload: async (file) => {
        const name = String((file as any)?.name ?? '').toLowerCase();
        const type = String((file as any)?.type ?? '').toLowerCase();
        const okByType =
          type === 'image/webp' ||
          type === 'image/jpeg' ||
          type === 'image/png' ||
          type === 'image/svg+xml';
        const okByExt =
          name.endsWith('.webp') ||
          name.endsWith('.jpg') ||
          name.endsWith('.jpeg') ||
          name.endsWith('.png') ||
          name.endsWith('.svg');
        if (!okByType && !okByExt) {
          message.error('仅支持上传 webp / jpeg / png / svg 格式图片');
          return Upload.LIST_IGNORE;
        }
        const mimeKind = kindFromMime(type);
        const nameKind = kindFromFileName(name);
        if (mimeKind && nameKind && mimeKind !== nameKind) {
          message.error('扩展名与浏览器识别的文件类型不一致，请检查是否修改过文件后缀');
          return Upload.LIST_IGNORE;
        }
        const claimed = mimeKind ?? nameKind;
        if (!claimed) {
          message.error('无法判断文件类型，请使用标准图片格式上传');
          return Upload.LIST_IGNORE;
        }
        try {
          const actual = await sniffImageKindFromContent(file as File);
          if (!actual) {
            message.error('文件内容与图片格式不符，可能被修改过类型或文件已损坏');
            return Upload.LIST_IGNORE;
          }
          if (actual !== claimed) {
            message.error('文件实际类型与扩展名/声明类型不一致，请勿修改文件后缀');
            return Upload.LIST_IGNORE;
          }
        } catch {
          message.error('读取文件失败，请重试');
          return Upload.LIST_IGNORE;
        }
        return true;
      },
      fileList: reportFileList,
      onChange: ({ fileList }) => setReportFileList(fileList),
    }),
    [reportFileList],
  );

  const openReportModal = () => {
    setReportOpen(true);
    reportForm.setFieldsValue({
      content: '',
    });
    setReportFileList([]);
  };

  const closeReportModal = () => {
    setReportOpen(false);
    setReportSubmitting(false);
    reportForm.resetFields();
    setReportFileList([]);
  };

  const handleSubmitReport = async () => {
    try {
      const values = await reportForm.validateFields();
      setReportSubmitting(true);

      const images = (reportFileList || [])
        .filter((f) => f.status === 'done')
        .map((f) => {
          const resp: any = (f as any).response;
          const r0 = Array.isArray(resp) ? resp[0] : resp;
          // 问题反馈新增：images 需要使用 url（可直接预览），非 url 时再回退到 path
          return r0?.url || r0?.path || f.url || '';
        })
        .filter(Boolean);

      // 后端要求：orgId 传 OrganizationVo 的 cobId（委办局ID），并非组织ID
      let cobId: string | undefined;
      try {
        const session = await systemApi.getSession();
        const cobIds = (session?.organizations || [])
          .map((org: any) => org?.cobId)
          .filter((id: any): id is string => typeof id === 'string' && !!id.trim());
        cobId = Array.from(new Set(cobIds)).join(',') || undefined;
      } catch {
        // ignore
      }
      if (!cobId) {
        message.error('未获取到所属委办局ID（cobId），请重新登录后重试');
        setReportSubmitting(false);
        return;
      }

      await primeApi.createUserFeedback({
        userFeedbackDto: {
          orgId: cobId,
          content: values.content,
          images,
          images2: [],
          status: null,
          operator: '平台运营组',
        } as any,
      });
      message.success('问题已上报');
      closeReportModal();
    } catch (e: any) {
      if (e?.errorFields) return; // 表单校验错误
      message.error(e?.message || '上报失败，请稍后重试');
      setReportSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {/*<div style={{marginRight: '250px',color:'#fff',display:'flex',alignItems:'center'}}>*/}
      {/*  <img src="/laba.png" style={{width:'20px',height:'20px',marginRight:'10px'}} alt=""/>*/}
      {/*  <div>*/}
      {/*    本次补录重点为亿元以上或涉及今年新签约、新开工、新竣工的项目。*/}
      {/*  </div>*/}
      {/*</div>*/}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* 新增的按钮 */}
        <div
          style={{
            marginRight: '20px',
            display: 'flex',
            alignItems: 'center',
            color:'#fff',
            cursor: 'pointer'
          }}
          onClick={() => {
            window.open(history.createHref({ pathname: '/tutorial' }), '_blank');
          }}
        >
          <BookOutlined />
          <span style={{ marginLeft: 8 }}>项目全生命周期</span>
        </div>

        <div
          style={{
            marginRight: '20px',
            display: 'flex',
            alignItems: 'center',
            color: '#fff',
            cursor: 'pointer',
          }}
          onClick={openReportModal}
        >
          <FormOutlined />
          <span style={{ marginLeft: 8 }}>平台问题反馈</span>
        </div>

        {/* 平台使用教程下拉菜单 */}
        <HeaderDropdown
          menu={{
            selectedKeys: [],
            onClick: onMenuClick,
            items: menuItems,
          }}
        >
          <div
            style={{
              marginRight: '20px',
              display: 'flex',
              alignItems: 'center',
              color:'#fff',
              cursor: 'pointer'
            }}
          >
            <QuestionCircleOutlined />
            <span style={{ marginLeft: 8 }}>平台使用教程</span>
          </div>
        </HeaderDropdown>
      </div>

      <Modal
        title="问题上报"
        open={reportOpen}
        onCancel={closeReportModal}
        onOk={handleSubmitReport}
        confirmLoading={reportSubmitting}
        okText="提交"
        cancelText="取消"
        destroyOnClose
      >
        <Form
          form={reportForm}
          layout="vertical"
          preserve={false}
        >
          <Form.Item
            label="问题描述"
            name="content"
            rules={[{ required: true, message: '请输入问题描述' }]}
          >
            <Input.TextArea rows={5} maxLength={500} showCount placeholder="请描述问题现象、复现步骤等" />
          </Form.Item>

          <Form.Item label="问题截图（可选）">
            <Upload {...reportUploadProps}>
              {reportFileList.length >= 9 ? null : '上传'}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
