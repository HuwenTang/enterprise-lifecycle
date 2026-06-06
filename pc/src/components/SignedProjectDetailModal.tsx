import { ModalForm, ProFormText, ProFormSelect, ProFormDatePicker, ProFormDigit, ProFormTextArea, ProFormRadio, ProFormTreeSelect, ProFormDependency } from '@ant-design/pro-components';
import { Form, Space, Upload, Button } from 'antd';
import type { UploadFile } from 'antd';
import { useEffect, useState, CSSProperties } from 'react';
import dayjs from 'dayjs';
import { FileTextOutlined, UploadOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';
import fileConfig from '../../config/fileConfig';

interface SignedProjectDetailModalProps {
  visible: boolean;
  onClose: () => void;
  record: any;
  projTypeTreeData?: any[];
  industryTreeData?: any[];
  industryFirstOptions?: any[];
  districtOptions?: any[];
  zoneOptions?: any[];
  townOptions?: any[];
}

// 常量定义
const kcProjectTypeOptions = [
  '知识产权类',
  '高层次人才类',
  '科技计划或大赛类',
  '风险投资类',
  '省市产研院类',
  '重大创新平台类',
];

const investorTypeOptions = [
  { label: '央企', value: '10' },
  { label: '民营巨头', value: '20' },
  { label: '世界500强或跨国公司', value: '30' },
  { label: '其它', value: '40' },
];

const defaultFzItems = [
  '本协议与国家法律、法规相悖的，按国家法律、法规执行。',
  '如因履行本协议发生纠纷而引起诉讼的，由甲方所在地人民法院管辖。',
  '本协议书一式四份，甲方执存两份，乙方执存两份，本协议自双方签字盖章之日起生效。',
];

const SignedProjectDetailModal: React.FC<SignedProjectDetailModalProps> = ({
  visible,
  onClose,
  record,
  projTypeTreeData = [],
  industryTreeData = [],
  industryFirstOptions = [],
  districtOptions = [],
  zoneOptions = [],
  townOptions = [],
}) => {
  const [form] = Form.useForm();
  const [reviewUploadFileList, setReviewUploadFileList] = useState<UploadFile[]>([]);
  const [supportUploadFileList, setSupportUploadFileList] = useState<UploadFile[]>([]);
  const [kcUploadFileList, setKcUploadFileList] = useState<UploadFile[]>([]);
  const [fzList, setFzList] = useState<string[]>([...defaultFzItems]);
  
  // 投资方注册地选项（根据项目类别动态获取）
  const [investorPlaceOptions, setInvestorPlaceOptions] = useState<{ label: string; value: string }[]>([]);
  const [foreignInvestorPlaceOptions, setForeignInvestorPlaceOptions] = useState<{ label: string; value: string }[]>([]);

  // 网格表单样式
  const gridStyles: Record<string, CSSProperties> = {
    container: { border: '1px solid #f0f0f0', borderBottom: 'none', marginBottom: 24 },
    row: { borderBottom: '1px solid #f0f0f0', display: 'flex' },
    label: {
      width: '160px',
      backgroundColor: '#fafafa',
      padding: '16px',
      borderRight: '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      textAlign: 'right',
      fontWeight: 500
    },
    content: { flex: 1, padding: '16px', borderRight: '1px solid #f0f0f0', minWidth: 0, wordWrap: 'break-word', whiteSpace: 'normal' },
    contentLast: { flex: 1, padding: '16px', minWidth: 0, wordWrap: 'break-word', whiteSpace: 'normal' }
  };

  const toDayjsValue = (value?: string) => {
    if (!value) return undefined;
    return dayjs.isDayjs(value) ? value : dayjs(value);
  };

  const buildFileDownloadUrl = (rawPath?: string) => {
    const path = String(rawPath || '').trim();
    if (!path) return '';
    // 直接返回路径（已经是完整URL或同域路径）
    return path;
  };

  const getImageCateCode = (item: any) => String(item?.cateCode ?? item?.cate_code ?? '');

  const buildUploadFileList = (images: any[] = []) => {
    return images.map((item, index) => {
      let filePath = item?.filePath || item?.filepath || item?.path || item?.file_path || item?.url || '';

      // 判断创建时间是否在2026年4月13日之前
      const createTime = item?.createTime || item?.create_time || item?.createdAt || item?.created_at;
      if (createTime) {
        const createDate = new Date(createTime);
        const cutoffDate = new Date('2026-04-13');
        if (createDate < cutoffDate) {
          // 2026年4月13日之前的附件使用旧地址
          // 从 uploadDetail 开始截取到 ? 之前的路径
          const match = filePath.match(/uploadDetail\/[^?]+/);
          if (match) {
            filePath = fileConfig.LEGACY_FILE_BASE_URL + match[0];
          }
        }
      }

      const name = item?.name || item?._name || filePath.split('/').pop()?.split('?')[0] || `文件${index + 1}`;
      const cateCode = getImageCateCode(item);
      return {
        uid: `${cateCode}-${item?.id || item?._id || index}`,
        name,
        status: 'done' as const,
        url: filePath,
        response: [{ name, filePath, cateCode, cate_code: cateCode }],
      };
    });
  };

  const renderUploadLinks = (fileList: UploadFile[]) => {
    return fileList.map((file) => {
      const response = Array.isArray(file.response) ? file.response[0] : file.response;
      const rawUrl = response?.filePath || response?.url || response?.path || file.url || '';
      const url = buildFileDownloadUrl(rawUrl);
      return (
        <div key={file.uid} style={{ marginBottom: 8 }}>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <FileTextOutlined /> {file.name}
          </a>
        </div>
      );
    });
  };

  // 获取投资方注册地选项（内资）
  const fetchInvestorPlaceOptions = async () => {
    try {
      const response = await request('/system-api/dict/activityAddress/items', {
        method: 'GET',
        params: { all: true },
      });
      
      if (response && Array.isArray(response)) {
        const options = response.map((item: any) => ({
          label: item.name || item.label,
          value: item.code || item.value,
        }));
        setInvestorPlaceOptions(options);
      }
    } catch (error) {
      console.error('获取内资投资方注册地列表失败:', error);
    }
  };

  // 获取投资方注册地选项（外资）
  const fetchForeignInvestorPlaceOptions = async () => {
    try {
      const response = await request('/system-api/dict/wzAddress/items', {
        method: 'GET',
        params: { all: true },
      });
      
      if (response && Array.isArray(response)) {
        const options = response.map((item: any) => ({
          label: item.name || item.label,
          value: item.code || item.value,
        }));
        setForeignInvestorPlaceOptions(options);
      }
    } catch (error) {
      console.error('获取外资投资方注册地列表失败:', error);
    }
  };

  useEffect(() => {
    if (visible && record) {
      // 根据项目类别加载对应的投资方注册地选项
      const pType = record?.p_type ?? record?.ptype;
      if (pType === '1' || pType === 1) {
        fetchInvestorPlaceOptions();
      } else if (pType === '2' || pType === 2) {
        fetchForeignInvestorPlaceOptions();
      }
    }
  }, [visible, record]);

  useEffect(() => {
    if (visible && record) {
      // 加载文件列表
      const allImages = [
        ...(record?.files || []),
        ...(record?.imgs || []),
        ...(record?.imgsList || []),
        ...(record?.imgArr || []),
      ];
      const reviewFiles = allImages.filter((img: any) => String(img?.cateCode || img?.cate_code) === '99');
      const supportFiles = allImages.filter((img: any) => String(img?.cateCode || img?.cate_code) === '0');
      const kcFiles = allImages.filter((img: any) => String(img?.cateCode || img?.cate_code) === '66');

      setReviewUploadFileList(buildUploadFileList(reviewFiles));
      setSupportUploadFileList(buildUploadFileList(supportFiles));
      setKcUploadFileList(buildUploadFileList(kcFiles));
      
      // 设置表单值，同时支持两种字段名
      form.setFieldsValue({
        ...record,
        // 兼容不同的字段名
        district_code: record?.district_code || record?.district || record?.districtName,
        zone_code: record?.zone_code || record?.zone_name || record?.zoneName,
        town_code: record?.town_code || record?.town_name || record?.townName,
        // 确保 b_resource 是字符串
        b_resource: record?.b_resource ? String(record.b_resource) : record?.b_resource,
        // 日期字段转换
        signed_date: toDayjsValue(record?.signed_date),
        signed_stat_date: toDayjsValue(record?.signed_stat_date),
        reg_date: toDayjsValue(record?.reg_date),
        reg_stat_date: toDayjsValue(record?.reg_stat_date),
        check_stat_date: toDayjsValue(record?.check_stat_date),
        finish_check_date: toDayjsValue(record?.finish_check_date),
        plan_start_date: toDayjsValue(record?.plan_start_date),
        plan_end_date: toDayjsValue(record?.plan_end_date),
      });
    }
  }, [visible, record, form]);

  return (
    <>
      <style>{`
        .signed-project-modal .ant-select,
        .signed-project-modal .ant-picker,
        .signed-project-modal .ant-input-number,
        .signed-project-modal .ant-input,
        .signed-project-modal .ant-input-affix-wrapper,
        .signed-project-modal textarea.ant-input {
          width: 100%;
        }

        .signed-project-modal .ant-input-number {
          min-width: 0;
        }
      `}</style>
      <ModalForm
        title="签约项目详情"
        open={visible}
        onOpenChange={(open) => {
          if (!open) {
            onClose();
            form.resetFields();
            setReviewUploadFileList([]);
            setSupportUploadFileList([]);
            setKcUploadFileList([]);
          }
        }}
        form={form}
        width={1000}
        disabled={true}
        modalProps={{ destroyOnClose: true, maskClosable: false, className: 'signed-project-modal' }}
        submitter={false}
      >
      <div style={{ color: 'red', marginBottom: 16, lineHeight: '1.8' }}>
        <div>1、签约在5亿以上的项目，需走质态评估（市级部门预警）流程；金额在5亿以下的项目，无需走质态评估（市级部门预警）流程。</div>
        <div>2、本次补录重点为亿元以上或涉及今年新签约、新开工、新竣工的项目，补录的项目无需重新生成协议。</div>
        <div>3、项目开工、竣工认定，由项目专班进行审核。</div>
      </div>

      <div style={gridStyles.container}>
        <div style={gridStyles.row}>
          <div style={gridStyles.label}>市区</div>
          <div style={gridStyles.content}>
            <ProFormSelect name="district_code" options={districtOptions} noStyle />
          </div>
          <div style={gridStyles.label}>园区</div>
          <div style={gridStyles.contentLast}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <ProFormSelect name="zone_code" placeholder="园区" options={zoneOptions} noStyle />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <ProFormSelect name="town_code" placeholder="街镇" options={townOptions} noStyle />
              </div>
            </div>
          </div>
        </div>

        <div style={gridStyles.row}>
          <div style={gridStyles.label}>项目名称</div>
          <div style={gridStyles.content}>
            <ProFormText name="_name" noStyle />
          </div>
          <div style={gridStyles.label}>项目类别</div>
          <div style={gridStyles.contentLast}>
            <ProFormRadio.Group
              name="p_type"
              options={[{label: '内资', value: '1'}, {label: '外资', value: '2'}]}
              noStyle
            />
          </div>
        </div>

        <ProFormDependency name={['p_type']}>
          {({ p_type }) => {
            const isForeign = p_type === '2';
            return (
              <div style={gridStyles.row}>
                <div style={gridStyles.label}>项目总投资</div>
                <div style={gridStyles.content}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <ProFormDigit name="invest_money" noStyle />
                    </div>
                    <span style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>{isForeign ? '万美元' : '亿元'}</span>
                  </div>
                </div>
                <div style={gridStyles.label}>协议利用外资</div>
                <div style={gridStyles.contentLast}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <ProFormDigit name="foreign_money" noStyle />
                    </div>
                    <span style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>万美元</span>
                  </div>
                </div>
              </div>
            );
          }}
        </ProFormDependency>

        <div style={gridStyles.row}>
          <div style={gridStyles.label}>项目类型</div>
          <div style={gridStyles.content}>
            <ProFormTreeSelect
              name="proj_type"
              placeholder="请选择项目类型"
              fieldProps={{
                treeData: projTypeTreeData,
                showSearch: true,
                treeNodeFilterProp: 'title',
                treeDefaultExpandAll: true,
                treeLine: true,
              }}
              noStyle
            />
          </div>
          <div style={gridStyles.label}>产业大类名称</div>
          <div style={gridStyles.contentLast}>
            <ProFormSelect
              name="industry_first_code"
              options={industryFirstOptions}
              fieldProps={{ showSearch: true, optionFilterProp: 'label' }}
              noStyle
            />
          </div>
        </div>

        <div style={gridStyles.row}>
          <div style={gridStyles.label}>行业编码</div>
          <div style={gridStyles.content}>
            <ProFormTreeSelect
              name="industry_code"
              placeholder="请选择行业编码"
              fieldProps={{
                treeData: industryTreeData,
                showSearch: true,
                treeNodeFilterProp: 'title',
                treeDefaultExpandAll: true,
                treeLine: true,
              }}
              noStyle
            />
          </div>
          <div style={gridStyles.label}>所属行业</div>
          <div style={gridStyles.contentLast}>
            <ProFormRadio.Group 
              name="b_industry" 
              options={[{label: '服务业', value: '1'}, {label: '工业', value: '2'}]} 
              noStyle 
            />
          </div>
        </div>

        <div style={gridStyles.row}>
          <div style={gridStyles.label}>投资方名称</div>
          <div style={gridStyles.content}>
            <ProFormText name="investor" noStyle />
          </div>
          <div style={gridStyles.label}>投资方性质</div>
          <div style={gridStyles.contentLast}>
            <ProFormSelect
              name="investor_type"
              options={investorTypeOptions}
              noStyle
            />
          </div>
        </div>

        <ProFormDependency name={['p_type']}>
          {({ p_type }) => (
            <div style={gridStyles.row}>
              <div style={gridStyles.label}>投资方注册地</div>
              <div style={gridStyles.content}>
                <ProFormSelect
                  name="investor_place"
                  options={p_type === '2' ? foreignInvestorPlaceOptions : investorPlaceOptions}
                  noStyle
                />
              </div>
              <div style={gridStyles.label}>城市名称</div>
              <div style={gridStyles.contentLast}>
                <ProFormText name="placeInfo" noStyle />
              </div>
            </div>
          )}
        </ProFormDependency>

        <div style={gridStyles.row}>
          <div style={gridStyles.label}>是否属于上市企业</div>
          <div style={gridStyles.content}>
            <ProFormSelect name="is_listed" options={[{label: '是', value: '1'}, {label: '否', value: '2'}]} noStyle />
          </div>
          <div style={gridStyles.label}></div>
          <div style={gridStyles.contentLast}></div>
        </div>

        <div style={gridStyles.row}>
          <div style={gridStyles.label}>是否高新技术企业</div>
          <div style={gridStyles.content}>
            <ProFormSelect name="is_gxjs" options={[{label: '是', value: '是'}, {label: '否', value: '否'}]} noStyle />
          </div>
          <div style={gridStyles.label}>是否有市外资金投入</div>
          <div style={gridStyles.contentLast}>
            <ProFormSelect name="has_municipal_capital" options={[{label: '是', value: '是'}, {label: '否', value: '否'}]} noStyle />
          </div>
        </div>

        <div style={gridStyles.row}>
          <div style={gridStyles.label}>股权比例</div>
          <div style={gridStyles.content}>
            <ProFormText name="equity_ratio" noStyle />
          </div>
          <div style={gridStyles.label}></div>
          <div style={gridStyles.contentLast}></div>
        </div>

        <ProFormDependency name={['is_rzxq']}>
          {({ is_rzxq }) => (
            <div style={gridStyles.row}>
              <div style={gridStyles.label}>是否有融资需求</div>
              <div style={gridStyles.content}>
                <ProFormRadio.Group name="is_rzxq" options={[{label: '是', value: '是'}, {label: '否', value: '否'}]} noStyle />
              </div>
              {is_rzxq === '是' ? (
                <>
                  <div style={gridStyles.label}>融资金额</div>
                  <div style={gridStyles.contentLast}>
                    <ProFormDigit name="rz_money" noStyle />
                  </div>
                </>
              ) : (
                <>
                  <div style={gridStyles.label}></div>
                  <div style={gridStyles.contentLast}></div>
                </>
              )}
            </div>
          )}
        </ProFormDependency>

        <ProFormDependency name={['is_kc_proj']}>
          {({ is_kc_proj }) => (
            <div style={gridStyles.row}>
              <div style={gridStyles.label}>是否科创项目</div>
              <div style={gridStyles.content}>
                <ProFormRadio.Group name="is_kc_proj" options={[{label: '是', value: '是'}, {label: '否', value: '否'}]} noStyle />
              </div>
              {is_kc_proj === '是' ? (
                <>
                  <div style={gridStyles.label}>科创项目类型</div>
                  <div style={gridStyles.contentLast}>
                    <ProFormSelect name="kc_proj_type" options={kcProjectTypeOptions} noStyle />
                  </div>
                </>
              ) : (
                <>
                  <div style={gridStyles.label}></div>
                  <div style={gridStyles.contentLast}></div>
                </>
              )}
            </div>
          )}
        </ProFormDependency>

        <ProFormDependency name={['b_resource']}>
          {({ b_resource }) => (
            <div style={gridStyles.row}>
              <div style={gridStyles.label}>QFLP外资项目</div>
              <div style={gridStyles.content}>
                <ProFormSelect name="is_qflp" options={[{label: '是', value: '是'}, {label: '否', value: '否'}]} noStyle />
              </div>
              <div style={gridStyles.label}>项目信息来源</div>
              <div style={{ ...gridStyles.contentLast, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <ProFormRadio.Group
                  name="b_resource"
                  options={[{label: '自行接洽', value: '1'}, {label: '市级机关推荐', value: '2'}]}
                  noStyle
                />
                {b_resource === '2' && (
                  <ProFormText name="sjjg_name" placeholder="推荐单位" noStyle />
                )}
              </div>
            </div>
          )}
        </ProFormDependency>

        <div style={gridStyles.row}>
          <div style={gridStyles.label}>项目简介</div>
          <div style={{ ...gridStyles.contentLast, display: 'flex', flexDirection: 'column' }}>
            <ProFormTextArea name="_desc" noStyle fieldProps={{ rows: 4 }} />
            <div style={{ color: 'red', fontSize: '12px', marginTop: '8px' }}>
              (填写包括：占地、建筑面积、设备、原料、工艺、产品、产能。参考格式：项目占地**亩，新建建筑面积**平方米（土建必填），计容面积**平方米，包括****，总投资***万，设备投资***万，购置***等设备多少台（套），主要原料有***，主要工艺有***，形成年产****。)
            </div>
          </div>
        </div>

        <div style={gridStyles.row}>
          <div style={gridStyles.label}>项目选址位置</div>
          <div style={gridStyles.content}>
            <ProFormText name="project_address" noStyle />
          </div>
          <div style={gridStyles.label}>预计开工时间</div>
          <div style={gridStyles.contentLast}>
            <ProFormDatePicker name="plan_start_date" noStyle fieldProps={{ style: { width: '100%' } }} />
          </div>
        </div>

        <ProFormDependency name={['p_type']}>
          {({ p_type }) => (
            <div style={gridStyles.row}>
              <div style={gridStyles.label}>预计竣工时间</div>
              <div style={gridStyles.content}>
                <ProFormDatePicker name="plan_end_date" noStyle fieldProps={{ style: { width: '100%' } }} />
              </div>
              <div style={gridStyles.label}>注册资本（{p_type === '2' ? '万美元' : '万元'}）</div>
              <div style={gridStyles.contentLast}>
                <ProFormDigit name="zhuce_money" noStyle />
              </div>
            </div>
          )}
        </ProFormDependency>

        <div style={gridStyles.row}>
          <div style={gridStyles.label}>签约日期</div>
          <div style={gridStyles.content}>
            <ProFormDatePicker name="signed_date" noStyle fieldProps={{ style: { width: '100%' } }} />
          </div>
          <div style={gridStyles.label}>签约信息统计日期</div>
          <div style={gridStyles.contentLast}>
            <ProFormDatePicker name="signed_stat_date" noStyle fieldProps={{ style: { width: '100%' } }} />
          </div>
        </div>

        <div style={gridStyles.row}>
          <div style={gridStyles.label}>成效情况说明</div>
          <div style={{ ...gridStyles.contentLast, display: 'flex', flexDirection: 'column' }}>
            <ProFormTextArea name="cg_remark" noStyle fieldProps={{ rows: 3 }} />
            <div style={{ color: 'red', fontSize: '12px', marginTop: '8px' }}>
              (请对照成效评估办法，补充其他需要说明的情况)
            </div>
          </div>
        </div>

        <div style={gridStyles.row}>
          <div style={gridStyles.label}>产业关联度</div>
          <div style={gridStyles.content}>
            <ProFormSelect name="cy_gl" options={['强相关', '一般', '不相关']} noStyle />
          </div>
          <div style={gridStyles.label}>是否增资扩产项目</div>
          <div style={gridStyles.contentLast}>
            <ProFormSelect name="zjkc" options={['是', '否']} noStyle />
          </div>
        </div>
      </div>

      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>准入条件</div>
      <div style={gridStyles.container}>
        <div style={gridStyles.row}>
          <div style={gridStyles.label}>特殊行业</div>
          <div style={gridStyles.content}>
            <ProFormSelect name="tshy" options={[{label: '是', value: '是'}, {label: '否', value: '否'}]} noStyle />
          </div>
          <div style={gridStyles.label}>准入限制</div>
          <div style={gridStyles.contentLast}>
            <ProFormSelect name="zrxz" options={[{label: '有', value: '有'}, {label: '无', value: '无'}]} noStyle />
          </div>
        </div>
        <div style={gridStyles.row}>
          <div style={gridStyles.label}>两高项目</div>
          <div style={gridStyles.content}>
            <ProFormSelect name="lgxm" options={[{label: '是', value: '是'}, {label: '否', value: '否'}]} noStyle />
          </div>
          <div style={gridStyles.label}>重金属排放</div>
          <div style={gridStyles.contentLast}>
            <ProFormSelect name="zjspf" options={[{label: '有', value: '有'}, {label: '无', value: '无'}]} noStyle />
          </div>
        </div>
        <div style={gridStyles.row}>
          <div style={gridStyles.label}>预计年耗能情况(吨标煤)</div>
          <div style={gridStyles.content}>
            <ProFormText name="total_use" noStyle />
          </div>
          <div style={gridStyles.label}>预计年排污情况（废水、废气等）</div>
          <div style={gridStyles.contentLast}>
            <ProFormText name="is_wuran" noStyle />
          </div>
        </div>
      </div>

      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>投资规模</div>
      <div style={gridStyles.container}>
        <div style={gridStyles.row}>
          <div style={gridStyles.label}>申请用地面积（亩）</div>
          <div style={gridStyles.content}>
            <ProFormDigit name="sq_land_area" noStyle />
          </div>
          <div style={gridStyles.label}>已供面积（亩）</div>
          <div style={gridStyles.contentLast}>
            <ProFormDigit name="ygmj" noStyle />
          </div>
        </div>
        <div style={gridStyles.row}>
          <div style={gridStyles.label}>盘活面积（亩）</div>
          <div style={gridStyles.content}>
            <ProFormDigit name="phmj" noStyle />
          </div>
          <div style={gridStyles.label}>租赁厂房面积（平方米）</div>
          <div style={gridStyles.contentLast}>
            <ProFormDigit name="zl_land_area" noStyle />
          </div>
        </div>
        <ProFormDependency name={['p_type']}>
          {({ p_type }) => (
            <>
              <div style={gridStyles.row}>
                <div style={gridStyles.label}>折算用地（亩）</div>
                <div style={gridStyles.content}>
                  <ProFormDigit name="zs_land_area" noStyle />
                </div>
                <div style={gridStyles.label}>计划总投资（{p_type === '2' ? '万美元' : '万元'}）</div>
                <div style={gridStyles.contentLast}>
                  <ProFormDigit name="plan_total1" noStyle />
                </div>
              </div>
              <div style={gridStyles.row}>
                <div style={gridStyles.label}>计划投资强度（{p_type === '2' ? '万美元' : '万元'}/亩）</div>
                <div style={gridStyles.content}>
                  <ProFormDigit name="plan_invest_strong" noStyle />
                </div>
                <div style={gridStyles.label}>固定资产投资（万元）</div>
                <div style={gridStyles.contentLast}>
                  <ProFormDigit name="fixed_invest" noStyle />
                </div>
              </div>
              <div style={gridStyles.row}>
                <div style={gridStyles.label}>预计签约当年年度投资额（万元）</div>
                <div style={gridStyles.contentLast}>
                  <ProFormDigit name="tzgm" noStyle />
                </div>
              </div>
            </>
          )}
        </ProFormDependency>
      </div>

      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>预期效益</div>
      <div style={gridStyles.container}>
        <div style={gridStyles.row}>
          <div style={gridStyles.label}>预期年均产值（万元）</div>
          <div style={gridStyles.content}>
            <ProFormDigit name="yq_cz1" noStyle />
          </div>
          <div style={gridStyles.label}>预期年均开票销售（万元）</div>
          <div style={gridStyles.contentLast}>
            <ProFormDigit name="yq_kpxs1" noStyle />
          </div>
        </div>
        <div style={gridStyles.row}>
          <div style={gridStyles.label}>预期年均税收（万元）</div>
          <div style={gridStyles.content}>
            <ProFormDigit name="yq_ss1" noStyle />
          </div>
          <div style={gridStyles.label}>预期年均亩均税收（万元）</div>
          <div style={gridStyles.contentLast}>
            <ProFormDigit name="yq_mjtax1" noStyle />
          </div>
        </div>
      </div>

      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>市（区）联合评审结论</div>
      <div style={gridStyles.container}>
        <div style={gridStyles.row}>
          <div style={gridStyles.label}>各市（区）联合评审结论</div>
          <div style={gridStyles.contentLast}>
            <ProFormSelect name="zhpg" options={['优秀', '良好', '一般']} noStyle />
          </div>
        </div>

        <div style={gridStyles.row}>
          <div style={gridStyles.label}>项目情况分析和评审结果</div>
          <div style={gridStyles.contentLast}>
            {renderUploadLinks(reviewUploadFileList)}
            {reviewUploadFileList.length === 0 && <span style={{ color: '#999' }}>暂无文件</span>}
          </div>
        </div>

        <div style={gridStyles.row}>
          <div style={gridStyles.label}>市级部门风险提示</div>
          <div style={gridStyles.contentLast}>
            <ProFormTextArea
              name="tzfFx"
              placeholder="自动同步，无需填写"
              fieldProps={{ rows: 4, disabled: true }}
              noStyle
            />
          </div>
        </div>

        <div style={gridStyles.row}>
          <div style={gridStyles.label}>项目签约协议招商方</div>
          <div style={gridStyles.contentLast}>
            <ProFormText name="zsf" noStyle />
          </div>
        </div>

        <div style={gridStyles.row}>
          <div style={gridStyles.label}>项目签约协议投资方</div>
          <div style={gridStyles.contentLast}>
            <ProFormText name="tzf" noStyle />
          </div>
        </div>

        <div style={gridStyles.row}>
          <div style={gridStyles.label}>项目签约协议投资地址</div>
          <div style={gridStyles.contentLast}>
            <ProFormText name="tzdz" noStyle />
          </div>
        </div>

        <div style={gridStyles.row}>
          <div style={gridStyles.label}>项目签约协议附则</div>
          <div style={gridStyles.contentLast}>
            <div style={{ border: '1px solid #d9d9d9', borderRadius: '2px', padding: '16px' }}>
              {fzList.map((item, index) => (
                <div key={index} style={{ marginBottom: 8 }}>
                  {index + 1}、{item}
                </div>
              ))}
              {record?.fz && (
                <div style={{ marginTop: 8, color: '#666' }}>
                  {record.fz}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={gridStyles.row}>
          <div style={gridStyles.label}>佐证材料</div>
          <div style={gridStyles.contentLast}>
            {renderUploadLinks(supportUploadFileList)}
            {supportUploadFileList.length === 0 && <span style={{ color: '#999' }}>暂无文件</span>}
          </div>
        </div>

        {kcUploadFileList.length > 0 && (
          <div style={gridStyles.row}>
            <div style={gridStyles.label}>科创证明材料</div>
            <div style={gridStyles.contentLast}>
              {renderUploadLinks(kcUploadFileList)}
            </div>
          </div>
        )}
      </div>
    </ModalForm>
    </>
  );
};

export default SignedProjectDetailModal;
