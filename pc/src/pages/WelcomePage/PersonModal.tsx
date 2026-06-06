import fourWarZoneApi from '@/services/fourWarZone/fourWarZone';
import { type PersonItem } from '@/services/fourWarZone/fourWarZoneMockData';
import { CloseOutlined, UserOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';
import { Button, Input, Modal, Select, Spin, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import styles from './PersonModal.module.css';

interface PersonModalProps {
  visible: boolean;
  onClose: () => void;
}

const PERSON_TABLE_PAGE_SIZE = 10;

const PERSON_DATA_COLUMNS: ColumnsType<PersonItem> = [
  { title: '姓名', dataIndex: 'name', key: 'name', width: 80, ellipsis: true },
  {
    title: '专攻方向',
    dataIndex: 'specialization',
    key: 'specialization',
    width: 100,
    ellipsis: true,
  },
  { title: '职务', dataIndex: 'position', key: 'position', width: 80, ellipsis: true },
  { title: '招商区域', dataIndex: 'investPlace', key: 'investPlace', width: 100, ellipsis: true },
  { title: '市区', dataIndex: 'district', key: 'district', width: 100, ellipsis: true },
  { title: '园区', dataIndex: 'zone', key: 'zone', width: 100, ellipsis: true },
  { title: '街镇', dataIndex: 'town', key: 'town', width: 80, ellipsis: true },
  { title: '学历', dataIndex: 'xl', key: 'xl', width: 70, align: 'center', ellipsis: true },
  { title: '联系方式', dataIndex: 'phone', key: 'phone', width: 120, ellipsis: true },
];

const personEducationOptions = [
  { label: '小学', value: '01' },
  { label: '初中', value: '02' },
  { label: '高中', value: '03' },
  { label: '大专', value: '04' },
  { label: '本科', value: '05' },
  { label: '硕士研究生', value: '06' },
  { label: '博士研究生', value: '07' },
];

const PersonModal: React.FC<PersonModalProps> = ({ visible, onClose }) => {
  const [personList, setPersonList] = useState<PersonItem[]>([]);
  const [personListTotal, setPersonListTotal] = useState(0);
  const [personCurrentPage, setPersonCurrentPage] = useState(1);
  const [personSearchKeyword, setPersonSearchKeyword] = useState('');

  const [filterPersonDistrictCode, setFilterPersonDistrictCode] = useState<string>('');
  const [filterPersonZoneCode, setFilterPersonZoneCode] = useState<string>('');
  const [filterPersonTownCode, setFilterPersonTownCode] = useState<string>('');
  const [filterPersonName, setFilterPersonName] = useState<string>('');
  const [filterPersonInvestPlace, setFilterPersonInvestPlace] = useState<string>('');
  const [filterPersonEducation, setFilterPersonEducation] = useState<string>('');
  const [personDistrictOptions, setPersonDistrictOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [personZoneOptions, setPersonZoneOptions] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [personTownOptions, setPersonTownOptions] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [modalLoading, setModalLoading] = useState(false);

  const [selectLabel, setSelectLabel] = useState<string>('全部');
  const [allPersonCount, setAllPersonCount] = useState([
    { label: '全部', value: 0 },
    { label: '北京(京津冀)', value: 0 },
    { label: '上海(长三角)', value: 0 },
    { label: '深圳(珠三角)', value: 0 },
    { label: '南京(南京、合肥)', value: 0 },
    { label: '境外', value: 0 },
  ]);

  const loadAllPersonCount = async () => {
    const allRes = await fourWarZoneApi.getPersonList({
      page: 1,
      size: 10,
    });
    const bjRes = await fourWarZoneApi.getPersonList({
      countryRegionStandard: '北京(京津冀)',
      page: 1,
      size: 10,
    });
    const shRes = await fourWarZoneApi.getPersonList({
      countryRegionStandard: '上海(长三角)',
      page: 1,
      size: 10,
    });
    const szRes = await fourWarZoneApi.getPersonList({
      countryRegionStandard: '深圳(珠三角)',
      page: 1,
      size: 10,
    });
    const njRes = await fourWarZoneApi.getPersonList({
      countryRegionStandard: '南京(南京、合肥)',
      page: 1,
      size: 10,
    });
    const jwRes = await fourWarZoneApi.getPersonList({
      countryRegionStandard: '境外',
      page: 1,
      size: 10,
    });

    setAllPersonCount([
      { label: '全部', value: allRes.data.total },
      { label: '北京(京津冀)', value: bjRes.data.total },
      { label: '上海(长三角)', value: shRes.data.total },
      { label: '深圳(华南区)', value: szRes.data.total },
      { label: '南京(南京、合肥)', value: njRes.data.total },
      { label: '境外', value: jwRes.data.total },
    ]);
  };

  const loadPersonList = async () => {
    try {
      setModalLoading(true);
      const res = await fourWarZoneApi.getPersonList({
        countryRegionStandard: selectLabel === '全部' ? undefined : selectLabel,
        page: personCurrentPage,
        size: 10,
        name: filterPersonName || undefined,
        districtCode: filterPersonDistrictCode || undefined,
        zoneCode: filterPersonZoneCode || undefined,
        townCode: filterPersonTownCode || undefined,
        investPlace: filterPersonInvestPlace || undefined,
        xl: filterPersonEducation || undefined,
      });
      setPersonList(
        res.data.records.map((item: any) => ({
          ...item,
          xl: personEducationOptions.find((opt) => opt.value === item.xl)?.label || '',
        })),
      );
      setPersonListTotal(res.data.total);
    } catch (error) {
      console.error('Failed to load person list:', error);
    } finally {
      setModalLoading(false);
    }
  };

  const fetchDistrictList = async () => {
    try {
      const response = await request('/zsxt-api/tCommonDept/getDeptListByPid', {
        method: 'POST',
        data: { pid: '001' },
      });
      if (response && Array.isArray(response)) {
        const options = response.map((item: any) => ({
          label: item.text,
          value: item.id,
        }));
        setPersonDistrictOptions(options);
      }
    } catch (error) {
      console.error('获取市（区）列表失败:', error);
    }
  };

  const fetchPersonZoneList = async (pid: string) => {
    try {
      const response = await request('/zsxt-api/tCommonDept/getDeptByPidForTreeSelect', {
        method: 'POST',
        data: { pid },
      });
      if (response && Array.isArray(response)) {
        const options = response.map((item: any) => ({
          label: item.deptName,
          value: item.deptCode,
        }));
        setPersonZoneOptions(options);
      }
    } catch (error) {
      console.error('获取招商人员园区列表失败:', error);
    }
  };

  const fetchPersonTownList = async (pid: string) => {
    try {
      const response = await request('/zsxt-api/tCommonDept/getDeptByPidForTreeSelect', {
        method: 'POST',
        data: { pid },
      });
      if (response && Array.isArray(response)) {
        const options = response.map((item: any) => ({
          label: item.deptName,
          value: item.deptCode,
        }));
        setPersonTownOptions(options);
      }
    } catch (error) {
      console.error('获取招商人员镇街列表失败:', error);
    }
  };

  const handlePersonDistrictChange = (value: string) => {
    setFilterPersonDistrictCode(value);
    setFilterPersonZoneCode('');
    setFilterPersonTownCode('');
    if (!value) {
      setPersonZoneOptions([]);
      setPersonTownOptions([]);
    } else {
      fetchPersonZoneList(value);
    }
    setPersonCurrentPage(1);
  };

  const handlePersonZoneChange = (value: string) => {
    setFilterPersonZoneCode(value);
    setFilterPersonTownCode('');
    if (!value) {
      setPersonTownOptions([]);
    } else {
      fetchPersonTownList(value);
    }
    setPersonCurrentPage(1);
  };

  const handlePersonTownChange = (value: string) => {
    setFilterPersonTownCode(value);
    setPersonCurrentPage(1);
  };

  useEffect(() => {
    loadAllPersonCount();
    loadPersonList();
    fetchDistrictList();
  }, []);

  useEffect(() => {
    if (visible) {
      setPersonSearchKeyword('');
      setFilterPersonDistrictCode('');
      setFilterPersonZoneCode('');
      setFilterPersonTownCode('');
      setFilterPersonName('');
      setFilterPersonInvestPlace('');
      setFilterPersonEducation('');
      setPersonZoneOptions([]);
      setPersonTownOptions([]);
      setPersonCurrentPage(1);
      loadPersonList();
      fetchDistrictList();
    }
  }, [visible]);

  useEffect(() => {
    setFilterPersonZoneCode('');
    setFilterPersonTownCode('');
    setPersonZoneOptions([]);
    setPersonTownOptions([]);
    if (filterPersonDistrictCode) {
      fetchPersonZoneList(filterPersonDistrictCode);
    }
  }, [filterPersonDistrictCode]);

  useEffect(() => {
    setFilterPersonTownCode('');
    if (filterPersonZoneCode) {
      fetchPersonTownList(filterPersonZoneCode);
    } else {
      setPersonTownOptions([]);
    }
  }, [filterPersonZoneCode]);

  useEffect(() => {
    loadPersonList();
  }, [
    selectLabel,
    personCurrentPage,
    filterPersonName,
    filterPersonDistrictCode,
    filterPersonZoneCode,
    filterPersonTownCode,
    filterPersonEducation,
  ]);

  const handlePersonSearch = () => {
    setPersonCurrentPage(1);
    loadPersonList();
  };

  const handlePersonPageChange = (page: number) => {
    setPersonCurrentPage(page);
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      closable={false}
      footer={null}
      width={1600}
      className={styles.personModal}
    >
      <Spin spinning={modalLoading}>
        <div className={styles.modalHeaderTop}>
          <div className={styles.modalTitle}>
            <span className={styles.modalTitleIcon}><UserOutlined /></span>
            <span className={styles.modalTitleText}>招商人员名单</span>
          </div>
          <button type="button" aria-label="关闭" className={styles.modalClose} onClick={onClose}>
            <CloseOutlined />
          </button>
        </div>
        <div className={styles.modalContent}>
          <div className={styles.allPersonCount}>
            {allPersonCount.map((item) => (
              <div key={item.label} className={`${styles.allPersonCountItem} ${selectLabel === item.label ? styles.active : ''}`} onClick={() => setSelectLabel(item.label)}>
                <div className={styles.allPersonCountDot}></div>
                <div className={styles.allPersonCountLabel}>{item.label}</div>
                <div className={styles.allPersonCountValue}>{item.value}</div>
              </div>
            ))}
          </div>

          <div className={styles.modalSearch}>
            <Input
              placeholder="搜索姓名..."
              value={personSearchKeyword}
              onChange={(e) => {
                setPersonSearchKeyword(e.target.value);
                setFilterPersonName(e.target.value);
                setPersonCurrentPage(1);
              }}
              className={styles.modalSearchInput}
              allowClear
            />

            <Button type="primary" onClick={handlePersonSearch}>
              确认
            </Button>

            <Select
              placeholder="市区"
              allowClear
              options={personDistrictOptions}
              value={filterPersonDistrictCode || undefined}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              onChange={handlePersonDistrictChange}
            />
            <Select
              disabled={!filterPersonDistrictCode}
              placeholder="园区"
              allowClear
              options={personZoneOptions}
              value={filterPersonZoneCode || undefined}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              onChange={handlePersonZoneChange}
            />
            <Select
              disabled={!filterPersonZoneCode || personTownOptions.length === 0}
              placeholder="镇街"
              allowClear
              options={personTownOptions}
              value={filterPersonTownCode || undefined}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              onChange={handlePersonTownChange}
            />
          </div>

          <Table<PersonItem>
            columns={PERSON_DATA_COLUMNS}
            dataSource={personList}
            rowKey="id"
            pagination={{
              pageSize: PERSON_TABLE_PAGE_SIZE,
              total: personListTotal,
              current: personCurrentPage,
              showTotal: (total) => `共 ${total} 条记录`,
              onChange: handlePersonPageChange,
              showSizeChanger: false,
            }}
            bordered
            className={styles.modalTable}
          />
        </div>
      </Spin>
    </Modal>
  );
};

export default PersonModal;
