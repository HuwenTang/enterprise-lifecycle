    import {
    Carousel,
    DatePicker,
    Form,
    Image,
    Modal,
    Pagination,
    Popconfirm,
    Select,
    Table,
    Input,
    Radio,
    Button,
    message,
    Row,
    Col,
    Space,
  } from 'antd';
  import { PageContainer } from '@ant-design/pro-components';
  import React, { useEffect, useMemo, useState } from 'react';
  import { useModel, useNavigate, useAccess } from '@umijs/max';
  import {primeApi, systemApi} from '@/services/api';
  import { ListUserFeedbackRequest} from "@/services/apis";
  import type { Dayjs } from 'dayjs';
  import dayjs from 'dayjs';
  import { fetchUserFeedbackPendingCount } from '@/utils/refreshUserFeedbackBadge';

  const { RangePicker } = DatePicker;

  /** 生成仅含年月日的查询参数：OpenAPI 客户端对 Date 调用 toISOString()，此处固定为 YYYY-MM-DD */
  const asApiDateOnlyParam = (d: Dayjs): Date =>
    ({ toISOString: () => d.startOf('day').format('YYYY-MM-DD') } as unknown as Date);

  const formatTableDateTime = (v: unknown) => {
    if (v === undefined || v === null) return '-';
    const d = dayjs(v as string | Date);
    return d.isValid() ? d.format('YYYY-MM-DD HH:mm') : '-';
  };

  /** 字典未返回时与列表列展示逻辑一致的兜底选项（与原页面一致） */
  const FALLBACK_PROBLEM_TYPE_OPTIONS: Array<{ value: number; label: string }> = [
    { value: 1, label: '功能问题' },
    { value: 2, label: '数据问题' },
    { value: 3, label: '体验建议' },
    { value: 4, label: '其他' },
  ];

  type UserFeedbackListFilter = Partial<
    Pick<
      ListUserFeedbackRequest,
      | 'userMobile'
      | 'name'
      | 'department'
      | 'problemCategory'
      | 'status'
      | 'createTime1'
      | 'createTime2'
      | 'updateTime1'
      | 'updateTime2'
    >
  >;

  /** 反馈时间：与处理时间一致，按本地日历 YYYY-MM-DD 传参 */
  const rangeToApiBounds = (range: [Dayjs, Dayjs] | null | undefined) => {
    if (!range || !range[0] || !range[1])
      return { start: undefined as Date | undefined, end: undefined as Date | undefined };
    return {
      start: asApiDateOnlyParam(range[0]),
      end: asApiDateOnlyParam(range[1]),
    };
  };

  const rangeToUpdateTimeDateOnlyParams = (range: [Dayjs, Dayjs] | null | undefined) => {
    if (!range || !range[0] || !range[1])
      return { start: undefined as Date | undefined, end: undefined as Date | undefined };
    return {
      start: asApiDateOnlyParam(range[0]),
      end: asApiDateOnlyParam(range[1]),
    };
  };

  const buildUserFeedbackListFilter = (values: any): UserFeedbackListFilter => {
    const feedbackBounds = rangeToApiBounds(values?.feedbackTimeRange);
    const processBounds = rangeToUpdateTimeDateOnlyParams(values?.processTimeRange);
    return {
      userMobile: values?.userMobile ? String(values.userMobile).trim() : undefined,
      name: values?.name ? String(values.name).trim() : undefined,
      department: values?.department ? String(values.department).trim() : undefined,
      problemCategory:
        values?.problemCategory === undefined || values?.problemCategory === null || values?.problemCategory === ''
          ? undefined
          : Number(values.problemCategory),
      status: values?.status,
      createTime1: feedbackBounds.start,
      createTime2: feedbackBounds.end,
      updateTime1: processBounds.start,
      updateTime2: processBounds.end,
    };
  };

  const QA_MANAGE_LIST_SESSION_KEY = 'qa-manage:list-session:v1';

  type QaManageListSessionPayload = {
    current: number;
    pageSize: number;
    formValues: Record<string, any>;
  };

  const serializeSearchFormForSession = (values: Record<string, any>) => {
    const v = { ...values };
    const packRange = (key: string) => {
      const r = v[key];
      if (!Array.isArray(r) || r.length !== 2 || !r[0] || !r[1]) {
        delete v[key];
        return;
      }
      const fmt = (x: any) =>
        dayjs.isDayjs(x) ? x.format('YYYY-MM-DD') : typeof x === 'string' ? x : dayjs(x).format('YYYY-MM-DD');
      v[key] = [fmt(r[0]), fmt(r[1])];
    };
    packRange('feedbackTimeRange');
    packRange('processTimeRange');
    return v;
  };

  const deserializeSearchFormFromSession = (raw: Record<string, any>) => {
    if (!raw || typeof raw !== 'object') return {};
    const v = { ...raw };
    const unpackRange = (key: string) => {
      const r = v[key];
      if (Array.isArray(r) && r.length === 2 && typeof r[0] === 'string' && typeof r[1] === 'string') {
        const d0 = dayjs(r[0]);
        const d1 = dayjs(r[1]);
        if (d0.isValid() && d1.isValid()) v[key] = [d0, d1];
      }
    };
    unpackRange('feedbackTimeRange');
    unpackRange('processTimeRange');
    return v;
  };

  const persistQaManageListSession = (payload: QaManageListSessionPayload) => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(QA_MANAGE_LIST_SESSION_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
  };

  const readInitialListRestore = (): (QaManageListSessionPayload & { query: UserFeedbackListFilter }) | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = sessionStorage.getItem(QA_MANAGE_LIST_SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<QaManageListSessionPayload>;
      const formValues = deserializeSearchFormFromSession(parsed.formValues ?? {});
      const query = buildUserFeedbackListFilter(formValues);
      const current = typeof parsed.current === 'number' && parsed.current >= 1 ? Math.floor(parsed.current) : 1;
      const pageSize =
        typeof parsed.pageSize === 'number' && parsed.pageSize >= 1 ? Math.floor(parsed.pageSize) : 10;
      return { current, pageSize, formValues, query };
    } catch {
      return null;
    }
  };

  const clearQaManageListSession = () => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(QA_MANAGE_LIST_SESSION_KEY);
    } catch {
      // ignore
    }
  };

  const QaManage = () => {
    const navigate = useNavigate();
    const access = useAccess();
    const { setInitialState } = useModel('@@initialState');
    const syncPendingBadge = async () => {
      const badgeCount4 = await fetchUserFeedbackPendingCount();
      setInitialState((s) => ({ ...s, badgeCount4 }));
    };
    const [searchForm] = Form.useForm();
    const [editForm] = Form.useForm();
    const [initialRestore] = useState(() => readInitialListRestore());
    const [queryParams, setQueryParams] = useState<UserFeedbackListFilter>(() => initialRestore?.query ?? {});
    const [pagination, setPagination] = useState(() => ({
      current: initialRestore?.current ?? 1,
      pageSize: initialRestore?.pageSize ?? 10,
      total: 0,
    }));
    const [problemTypeOptions, setProblemTypeOptions] = useState<
      Array<{ value: number | string; label: string; code?: string }>
    >([]);
    const problemCategoryQueryOptions = useMemo(() => {
      if (problemTypeOptions.length > 0) {
        return problemTypeOptions.map((o) => ({ value: o.value, label: o.label }));
      }
      return FALLBACK_PROBLEM_TYPE_OPTIONS;
    }, [problemTypeOptions]);

    const parseImagesField = (raw: any): string[] => {
      // images 兼容：string[] | Array<{url|path}> | string(JSON数组) | string(逗号分隔) | 单个 url
      const stripHash = (s: string) => {
        const idx = s.indexOf('#');
        return idx >= 0 ? s.slice(0, idx) : s;
      };
      const normalize = (v: any): string => {
        if (v === null || v === undefined) return '';
        if (typeof v === 'string') return v;
        if (typeof v === 'object') {
          const u = (v as any)?.url ?? (v as any)?.path ?? (v as any)?.href;
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
          const arr = JSON.parse(s);
          if (Array.isArray(arr))
            return arr
              .map(normalize)
              .map((x) => stripHash(x.trim()))
              .filter(Boolean);
        } catch {
          // fallthrough
        }
      }
      if (s.includes(','))
        return s
          .split(',')
          .map((x) => stripHash(x.trim()))
          .filter(Boolean);
      return [stripHash(s)];
    };

    // 本页使用独立 Pagination 组件分页，Table pagination 关闭；避免 Table.onChange 传入的 pagination 对象导致状态错乱
    const handlePageChange = (page: number, pageSize: number) => {
      setPagination((prev) => ({ ...prev, current: page, pageSize }));
      persistQaManageListSession({
        current: page,
        pageSize,
        formValues: serializeSearchFormForSession(searchForm.getFieldsValue()),
      });
    };

    const persistCurrentListSession = () => {
      persistQaManageListSession({
        current: pagination.current,
        pageSize: pagination.pageSize,
        formValues: serializeSearchFormForSession(searchForm.getFieldsValue()),
      });
    };


    const [dataSource, setDataSource] = useState<any[]>([]);

    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [imgList, setImgList] = useState<string[]>([])
    const handleCancel1 = () => {
      setIsModalOpen1(false);
    };

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editSubmitting, setEditSubmitting] = useState(false);
    const [editingRow, setEditingRow] = useState<any | null>(null);
  const [editMode, setEditMode] = useState<'edit' | 'detail'>('edit');

    const closeEdit = () => {
      setIsEditOpen(false);
      setEditSubmitting(false);
      setEditingRow(null);
    setEditMode('edit');
      editForm.resetFields();
    };

    const fetchDict = async () => {
      try {
        const res = await systemApi.getDictItems({ catalog: 'problem_type' });
        const opts =
          (Array.isArray(res) ? res : [])
            .filter((x: any) => x?.enabled !== false)
            .map((x: any) => ({
              value: String(x.value ?? x.code),
              label: String(x.label ?? x.value ?? x.code ?? '').trim(),
            }))
            .filter((x: any) => x.value !== undefined && x.value !== null && x.label) ?? [];
        setProblemTypeOptions(opts);
      } catch (e) {
        setProblemTypeOptions([]);
      }
    };

  async function fetchData(params: Partial<ListUserFeedbackRequest>) {
    console.log(params);
    // 生成客户端将 userMobile、name 标为必填；后端通常用空串表示“不限”，避免未填查询条件时报 RequiredError
    const data = await primeApi.listUserFeedback({
      userMobile: params.userMobile ?? '',
      name: params.name ?? '',
      department: params.department ?? '',
      problemCategory: params.problemCategory,
      status: params.status,
      createTime1: params.createTime1,
      createTime2: params.createTime2,
      updateTime1: params.updateTime1,
      updateTime2: params.updateTime2,
      page: params.page,
      size: params.size,
    });
    console.log(data);
    setPagination((prev) => ({
      ...prev,
      total: data.total,
      current: data.page,
      pageSize: data.size,
    }));
    console.log('data', data.records);
    setDataSource(data.records);
  }

    const getUserFeedback = async (id:string) => {
      const res = await primeApi.getUserFeedback({id:id});
      setImgList(parseImagesField((res as any)?.images));

      console.log('res',res)
    };

    const handleDelete = async (record: any) => {
      if (!record?.id) {
        message.error('缺少反馈ID');
        return;
      }
      try {
        await primeApi.deleteUserFeedback({ id: String(record.id) });
        message.success('删除成功');
        await syncPendingBadge();
        fetchData({ ...queryParams, page: pagination.current, size: pagination.pageSize });
      } catch (e: any) {
        message.error(e?.message || '删除失败');
      }
    };
    const onChange = (currentSlide: number) => {
      console.log(currentSlide);
    };

    const TitleCom = ({ text, icon }: { text: string; icon: string }) => {
      return (
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img style={{ width: '10px' ,marginRight: '5px'}} src={icon} alt="" />
          <div>{text}</div>
        </div>
      );
    };
    const renderProblemType = (_: any, record: any) => {
      const dictHit = problemTypeOptions.find((o) => String(o.value) === String(record?.problemCategory));
      if (dictHit?.label) return dictHit.label;
      const labelRaw = record?.problemCategoryLabel;
      const label = labelRaw === undefined || labelRaw === null ? '' : String(labelRaw).trim();
      if (label) return label;
      const v = record?.problemCategory;
      if (v === 1) return '功能问题';
      if (v === 2) return '数据问题';
      if (v === 3) return '体验建议';
      if (v === 4) return '其他';
      return '-';
    };

    const columns: any[] = [
      {
        title: <TitleCom text={'反馈人'} icon={'/mg/icon3.png'} />,
        dataIndex: 'userName',
        width: 120,
        align: 'center',
        ellipsis: true,
        key: 'userName',
        render: (v: any) => {
          const s = v === undefined || v === null ? '' : String(v).trim();
          return s ? s : '-';
        },
      },
      {
        title: <TitleCom text={'联系方式'} icon={'/mg/icon3.png'} />,
        dataIndex: 'userMobile',
        width: 140,
        align: 'center',
        ellipsis: true,
        key: 'userMobile',
        render: (v: any) => {
          const s = v === undefined || v === null ? '' : String(v).trim();
          return s ? s : '-';
        },
      },
      {
        title: <TitleCom text={'所属单位'} icon={'/mg/icon2.png'} />,
        key: 'orgName',
        dataIndex: 'orgName',
        align: 'center',
        ellipsis: true,
        width: 150,
        render: (v: any) => {
          const s = v === undefined || v === null ? '' : String(v).trim();
          return s ? s : '-';
        },
      },
      {
        title: <TitleCom text={'反馈时间'} icon={'/mg/icon2.png'} />,
        dataIndex: 'createTime',
        key: 'createTime',
        width: 160,
        align: 'center',
        render: (v: any) => formatTableDateTime(v),
      },
      {
        title: <TitleCom text={'问题描述'} icon={'/mg/icon3.png'} />,
        dataIndex: 'content',
        width: 280,
        ellipsis: { showTitle: false },
        align: 'center',
        key: 'content',
        render: (v: any) => {
          const s = v === undefined || v === null ? '' : String(v).trim();
          const text = s ? s : '-';
          return (
            <span
              title={text !== '-' ? text : undefined}
              style={{
                display: 'block',
                maxWidth: 280,
                margin: '0 auto',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textAlign: 'center',
              }}
            >
              {text}
            </span>
          );
        },
      },
      {
        title: <TitleCom text={'问题图片'} icon={'/mg/icon4.png'} />,
        dataIndex: 'images',
        align: 'center' as const,
        key: 'images',
        width: 120,
        render: (_: any, record: any) => {
          const images = parseImagesField(record?.images);
          if (!images.length) return '-';
          return (
            <a
              onClick={() => {
                setIsModalOpen1(true);
                setImgList([]);
                if (record?.id) getUserFeedback(record.id);
              }}
            >
              图片预览
            </a>
          );
        },
      },
      {
        title: <TitleCom text={'问题类型'} icon={'/mg/icon2.png'} />,
        dataIndex: 'problemCategoryLabel',
        align: 'center' as const,
        key: 'problemType',
        width: 120,
        render: renderProblemType,
      },
      {
        title: <TitleCom text={'责任部门'} icon={'/mg/icon2.png'} />,
        dataIndex: 'operator',
        key: 'operator',
        width: 140,
        align: 'center',
        ellipsis: true,

      },

      {
        title: <TitleCom text={'处理时间'} icon={'/mg/icon2.png'} />,
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: 160,
        align: 'center',
        render: (v: any) => formatTableDateTime(v),
      },
      {
        title: <TitleCom text={'处理结果'} icon={'/mg/icon3.png'} />,
        dataIndex: 'result',
        key: 'result',
        width: 280,
        ellipsis: { showTitle: false },
        align: 'center',
        render: (v: any) => {
          const s = v === undefined || v === null ? '' : String(v).trim();
          const text = s ? s : '-';
          return (
            <span
              title={text !== '-' ? text : undefined}
              style={{
                display: 'block',
                maxWidth: 280,
                margin: '0 auto',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textAlign: 'center',
              }}
            >
              {text}
            </span>
          );
        },
      },
      {
        title: <TitleCom text={'处理状态'} icon={'/mg/icon2.png'} />,
        dataIndex: 'status',
        align: 'center' as const,
        key: 'status',
        width: 120,
        fixed: 'right' as const,
        render: (v: any) => {
          if (v === true) return '已处理';
          if (v === false) return '处理中';
          if (v === null || v === undefined) return '未处理';
          return '-';
        },
      },
      {
        title: <TitleCom text={'操作'} icon={'/mg/icon2.png'} />,
        key: 'action',
        align: 'center' as const,
        width: 320,
        fixed: 'right' as const,
        render: (_: any, record: any) => (
          <>
            <Button
              type="link"
              onClick={() => {
                persistCurrentListSession();
                navigate(
                  `/qa-manage/detail?id=${encodeURIComponent(String(record.id))}&hideProcess=1`,
                );
              }}
            >
              详情
            </Button>
            {record?.beOperator === true && record?.status !== true ? (
              <Button
                type="link"
                onClick={() => {
                  persistCurrentListSession();
                  navigate(`/qa-manage/detail?id=${encodeURIComponent(String(record.id))}`);
                }}
              >
                处理
              </Button>
            ) : null}
            {access.canSuperAdmin ? (
              <Popconfirm
                title="确认删除该条问题反馈？"
                okText="删除"
                cancelText="取消"
                onConfirm={() => handleDelete(record)}
              >
                <Button type="link" danger>
                  删除
                </Button>
              </Popconfirm>
            ) : null}
          </>
        ),
      },

      // {
      //   title: <TitleCom text={'操作'} icon={'/mg/icon2.png'} />,
      //   valueType: 'option',
      //   align: 'center',
      //   width: 150,
      //   fixed: 'right',
      //   render: (text: any, record: any) => {
      //     return (
      //       <div style={{ display: 'flex', justifyContent: 'center' }}>
      //         <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      //           <div
      //             style={{
      //               cursor: 'pointer',
      //               display: 'flex',
      //               justifyContent: 'center',
      //               alignItems: 'center',
      //               width: '70px',
      //               height: '28px',
      //               background: ' #1890FF',
      //               borderRadius: '14px',
      //               fontSize: '14px',
      //               color: '#fff',
      //             }}
      //             key="down"
      //             onClick={() => {
      //               if (record.currentProjectProgress) {
      //                 navigate(`/xmgl/xmjd?id=${record.id}`);
      //               } else {
      //                 message.info('当前项目暂无进度');
      //               }
      //             }}
      //           >
      //             <div>详情</div>
      //             <img style={{ width: '15px', marginLeft: '3px' }} src="/mg/more.png" alt="" />
      //           </div>
      //         </div>
      //
      //       </div>
      //     );
      //   },
      // },
    ];

    const submitEdit = async () => {
      if (!editingRow?.id) {
        message.error('缺少反馈ID');
        return;
      }
      try {
        const values = await editForm.validateFields();
        setEditSubmitting(true);

        // images 为必填字段：从列表行/详情回退取值，保证 update 接口不报错
        const images = parseImagesField(editingRow?.images);

        await primeApi.updateUserFeedback({
          id: String(editingRow.id),
          userFeedbackDto: {
            images,
            // 仅允许修改以下三个字段
            problemCategory:
              values.problemCategory === undefined || values.problemCategory === null || values.problemCategory === ''
                ? undefined
                : Number(values.problemCategory),
            status: values.status,
            result: values.result,
          } as any,
        });

        message.success('修改成功');
        closeEdit();
        await syncPendingBadge();
        fetchData({ ...queryParams, page: pagination.current, size: pagination.pageSize });
      } catch (e: any) {
        if (e?.errorFields) return;
        message.error(e?.message || '修改失败');
        setEditSubmitting(false);
      }
    };

    const onSearch = async (values: any) => {
      const nextQuery = buildUserFeedbackListFilter(values);
      setQueryParams(nextQuery);
      setPagination((prev) => ({ ...prev, current: 1 }));
      await fetchData({ ...nextQuery, page: 1, size: pagination.pageSize });
      persistQaManageListSession({
        current: 1,
        pageSize: pagination.pageSize,
        formValues: serializeSearchFormForSession(values),
      });
    };

    const onReset = async () => {
      searchForm.resetFields();
      const nextQuery: UserFeedbackListFilter = {};
      setQueryParams(nextQuery);
      setPagination((prev) => ({ ...prev, current: 1 }));
      clearQaManageListSession();
      await fetchData({ page: 1, size: pagination.pageSize });
    };

    useEffect(() => {
      fetchDict();
      syncPendingBadge();
    }, []);

    useEffect(() => {
      if (initialRestore) {
        searchForm.setFieldsValue(initialRestore.formValues);
      }
    }, [searchForm, initialRestore]);

    useEffect(() => {
      fetchData({
        ...queryParams,
        page: pagination.current,
        size: pagination.pageSize,
      });
    }, [pagination.current, pagination.pageSize]);

    return (
      <div style={{display: 'flex',}}>
        <PageContainer
          style={{
            width: '100%',
            height: '90vh',
            overflow: 'auto',
            scrollbarWidth: 'none',
          }}
          content="欢迎使用问题反馈模块"
        >
          <div style={{padding: '20px', backgroundColor: 'white',}}>
            <div style={{ padding: '20px', backgroundImage: 'url(/pm-bg1.png)', backgroundSize: '100% 100%' }}>
              <div style={{ display: 'flex', marginBottom: '20px' }}>
                <div
                  style={{
                    marginRight: '10px',
                    width: '5px',
                    height: '16px',
                    background: '#005BF5',
                    borderRadius: '2.5px',
                  }}
                ></div>
                <div style={{ fontSize: '16px', fontWeight: 'bolder' }}>查询</div>
              </div>
              <Form form={searchForm} layout="horizontal" onFinish={onSearch} autoComplete="off">
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item label="反馈人" name="name">
                      <Input placeholder="请输入反馈人" allowClear />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="联系方式" name="userMobile">
                      <Input placeholder="请输入联系方式" allowClear />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="反馈时间" name="feedbackTimeRange">
                      <RangePicker
                        style={{ width: '100%' }}
                        placeholder={['选择年月日区间', '选择年月日区间']}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="处理状态" name="status">
                      <Select
                        allowClear
                        placeholder="请选择处理状态"
                        options={[
                          { value: false, label: '处理中' },
                          { value: true, label: '已处理' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item label="问题分类" name="problemCategory">
                      <Select allowClear placeholder="全部" options={problemCategoryQueryOptions} />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="责任部门" name="department">
                      <Input placeholder="请输入责任部门" allowClear />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="处理时间" name="processTimeRange">
                      <RangePicker
                        style={{ width: '100%' }}
                        placeholder={['请选择时间区间', '请选择时间区间']}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24} style={{ textAlign: 'center' }}>
                    <Form.Item style={{ marginBottom: 0 }}>
                      <Space>
                        <Button type="primary" htmlType="submit">
                          查询
                        </Button>
                        <Button htmlType="button" onClick={onReset}>
                          重置
                        </Button>
                      </Space>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <Table
                    style={{ marginTop: 20 }}
                    tableLayout="fixed"
                    rowClassName={(record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
                    columns={columns}
                    scroll={{ x: 2110 }}
                    bordered={true}
                    dataSource={dataSource}
                    pagination={false}
              />
            </div>
            <Modal width={800} height={500} title="图片预览" open={isModalOpen1} footer={false} onCancel={handleCancel1}>
              <Carousel arrows autoplay={{ dotDuration: true }} afterChange={onChange}>
                {
                  imgList!.map((item, index) => (
                    <div key={index}>
                      <Image  src={item}/>
                    </div>
                  ))
                }
              </Carousel>
            </Modal>

            <Modal
              title={editMode === 'detail' ? '问题反馈详情' : '修改问题反馈'}
              open={isEditOpen}
              onCancel={closeEdit}
              onOk={editMode === 'edit' ? submitEdit : undefined}
              confirmLoading={editMode === 'edit' ? editSubmitting : undefined}
              okText={editMode === 'edit' ? '保存' : undefined}
              cancelText={editMode === 'edit' ? '取消' : undefined}
              footer={
                editMode === 'detail'
                  ? [
                      <Button key="close" onClick={closeEdit}>
                        关闭
                      </Button>,
                    ]
                  : undefined
              }
              destroyOnClose
            >
              <Form form={editForm} layout="vertical" preserve={false}>
                <Form.Item label="所属单位">
                  <Input value={editingRow?.orgName ?? '-'} disabled />
                </Form.Item>
                <Form.Item label="反馈人">
                  <Input value={editingRow?.userName ?? '-'} disabled />
                </Form.Item>
                <Form.Item label="联系方式">
                  <Input value={editingRow?.userMobile ?? '-'} disabled />
                </Form.Item>
                <Form.Item label="问题描述">
                  <Input.TextArea value={editingRow?.content ?? '-'} rows={3} disabled />
                </Form.Item>
                <Form.Item label="反馈图片">
                  {parseImagesField(editingRow?.images).length ? (
                    <Image.PreviewGroup>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {parseImagesField(editingRow?.images).map((u, idx) => (
                          <Image
                            key={`${u}-${idx}`}
                            src={u}
                            width={72}
                            height={72}
                            style={{ objectFit: 'cover', borderRadius: 4 }}
                          />
                        ))}
                      </div>
                    </Image.PreviewGroup>
                  ) : (
                    <span>-</span>
                  )}
                </Form.Item>

                <Form.Item
                  label="问题分类"
                  name="problemCategory"
                  rules={editMode === 'edit' ? [{ required: true, message: '请选择问题分类' }] : []}
                >
                  <Select
                    options={problemTypeOptions}
                    placeholder="请选择问题分类"
                    disabled={editMode === 'detail'}
                  />
                </Form.Item>

                <Form.Item
                  label="处理状态"
                  name="status"
                  rules={editMode === 'edit' ? [{ required: true, message: '请选择处理状态' }] : []}
                >
                  <Radio.Group disabled={editMode === 'detail'}>
                    <Radio value={false}>处理中</Radio>
                    <Radio value={true}>已处理</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item label="处理结果" name="result">
                  <Input.TextArea
                    rows={3}
                    maxLength={500}
                    showCount
                    placeholder={editMode === 'detail' ? '' : '请输入处理结果'}
                    disabled={editMode === 'detail'}
                  />
                </Form.Item>
              </Form>
            </Modal>
            <Pagination
              showSizeChanger={false}
              current={pagination.current}
              // pageSize={pagination.pageSize}
              showTotal={(total) => `共 ${total} 条`}
              total={pagination.total}
              onChange={handlePageChange}
              style={{marginTop: '16px'}} // 可选：添加一些样式间距以改善布局
            />
          </div>
        </PageContainer>
      </div>
    );
  };

  export default QaManage;
