import { Card, Col, Descriptions, Image, Row, Spin, Table, Typography } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from '@umijs/max';
import { primeApi } from '@/services/api';
import dayjs from 'dayjs';
import type { ProjectInvestmentRecommendVo } from '@/services/apis';
import useStyles from './detail.style';
import { normalizeRecommendImageUrls } from './recommendImageUrls';

const { Paragraph } = Typography;

const sectionTitle = (text: string) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, marginTop: 8 }}>
    <div
      style={{
        marginRight: 10,
        width: 5,
        height: 16,
        background: '#005BF5',
        borderRadius: 2.5,
        flexShrink: 0,
      }}
    />
    <span style={{ fontSize: 16, fontWeight: 'bolder', color: '#333' }}>{text}</span>
  </div>
);

function parseParticipantRows(participants?: string) {
  if (!participants?.trim()) return [];
  return participants.split(';').filter(Boolean).map((item) => {
    const parts = item.split('-');
    if (parts.length >= 2) {
      return { participant: parts[0].trim(), department: parts.slice(1).join('-').trim() };
    }
    return { participant: parts[0]?.trim() || '', department: '' };
  });
}

const ProjectRecommendDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { styles } = useStyles();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProjectInvestmentRecommendVo | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const vo = await primeApi.getProjectInvestmentRecommend({ id });
        if (!cancelled) setData(vo);
      } catch (e) {
        console.error(e);
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const activityTimeStr = data?.activityTime
    ? dayjs(data.activityTime).format('YYYY-MM-DD HH:mm')
    : '暂无';
  const participantRows = parseParticipantRows(data?.participants);
  const imageUrls = normalizeRecommendImageUrls(data?.image as string | string[] | undefined);

  const participantColumns = useMemo(
    () => [
      { title: '参与人员', dataIndex: 'participant', key: 'participant', width: '45%' },
      { title: '参与部门', dataIndex: 'department', key: 'department' },
    ],
    [],
  );

  const breadcrumbList = useMemo(
    () => [
      { path: '/project-recomand/recolist', title: '招商活动列表' },
      { path: id ? `/project-recomand/detail/${id}` : '', title: '活动详细' },
    ],
    [id],
  );

  return (
    <PageContainer
      title={false}
      className={styles.pageHeader}
      style={{
        height: '90vh',
        overflow: 'auto',
        scrollbarWidth: 'none',
        backgroundImage: 'url(/mg/bg.png)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        padding: '0 120px 24px',
      }}
      breadcrumb={{
        routes: breadcrumbList,
        itemRender: (route, _params, routes) => {
          const last = routes.indexOf(route) === routes.length - 1;
          return last ? (
            <span>{route.title}</span>
          ) : (
            <a
              onClick={(e) => {
                e.preventDefault();
                if (route.path) navigate(route.path);
              }}
            >
              {route.title}
            </a>
          );
        },
      }}
    >
      <Spin spinning={loading}>
        {!loading && !data && (
          <Card bordered={false} style={{ textAlign: 'center', padding: 48, color: '#999' }}>
            未找到该活动记录或加载失败
          </Card>
        )}
        {data && (
          <div style={{ backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden' }}>
            <div
              style={{
                width: '100%',
                textAlign: 'center',
                fontSize: 24,
                padding: '30px 24px 12px',
                fontWeight: 'bolder',
                color: '#333',
              }}
            >
              {data.projName || '活动详细'}
            </div>
            <div
              style={{
                width: '100%',
                textAlign: 'center',
                fontSize: 16,
                padding: '0 24px 24px',
                fontWeight: 'bolder',
                color: '#666',
              }}
            >
              活动时间：{activityTimeStr}
              {data.district ? `　｜　区县：${data.district}` : ''}
              {data.park ? `　｜　承载园区：${data.park}` : ''}
            </div>

            <div style={{ padding: '0 32px 40px' }}>
              {sectionTitle('基本信息')}
              <Descriptions
                bordered
                column={{ xs: 1, sm: 1, md: 2, lg: 2 }}
                size="middle"
                labelStyle={{
                  width: 140,
                  background: 'rgba(0, 91, 245, 0.06)',
                  color: '#333',
                  fontWeight: 500,
                }}
                contentStyle={{ background: '#fafafa' }}
              >
                <Descriptions.Item label="项目名称">{data.projName || '—'}</Descriptions.Item>
                <Descriptions.Item label="所属部门">{data.dept || '—'}</Descriptions.Item>
                <Descriptions.Item label="区县">{data.district || '—'}</Descriptions.Item>
                <Descriptions.Item label="承载园区">{data.park || '—'}</Descriptions.Item>
                <Descriptions.Item label="项目信息" span={2}>
                  {data.projInfo || '—'}
                </Descriptions.Item>
                <Descriptions.Item label="项目环节">{data.projStep || '—'}</Descriptions.Item>
                <Descriptions.Item label="拜访对象">{data.target || '—'}</Descriptions.Item>
              </Descriptions>

              {sectionTitle('参与人员')}
              {participantRows.length > 0 ? (
                <Table
                  size="small"
                  bordered
                  pagination={false}
                  columns={participantColumns}
                  dataSource={participantRows.map((r, i) => ({ ...r, key: i }))}
                  style={{ marginBottom: 24 }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0', color: '#999', marginBottom: 24 }}>
                  暂无参与人员
                </div>
              )}

              {sectionTitle('活动内容与成果')}
              <Row gutter={[24, 16]}>
                <Col xs={24} lg={12}>
                  <Card size="small" title="活动内容" bordered={false} style={{ background: '#fafafa', height: '100%' }}>
                    <Paragraph style={{ marginBottom: 0, whiteSpace: 'pre-wrap', color: '#333' }}>
                      {data.content || '—'}
                    </Paragraph>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card size="small" title="取得成果" bordered={false} style={{ background: '#fafafa', height: '100%' }}>
                    <Paragraph style={{ marginBottom: 0, whiteSpace: 'pre-wrap', color: '#333' }}>
                      {data.achievement || '—'}
                    </Paragraph>
                  </Card>
                </Col>
              </Row>

              <div style={{ marginTop: 32 }}>{sectionTitle('图片')}</div>
              {imageUrls.length > 0 ? (
                <Image.PreviewGroup>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                    {imageUrls.map((url, i) => (
                      <Image
                        key={i}
                        src={url}
                        alt={`图片${i + 1}`}
                        width={140}
                        height={140}
                        style={{
                          objectFit: 'cover',
                          borderRadius: 8,
                          border: '1px solid #e8e8e8',
                        }}
                      />
                    ))}
                  </div>
                </Image.PreviewGroup>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>暂无图片</div>
              )}
            </div>
          </div>
        )}
      </Spin>
    </PageContainer>
  );
};

export default ProjectRecommendDetail;
