import datetime
import numpy
import pandas

import db


def get_data_list(data_frame: pandas.DataFrame):
    data_list = []
    for _, row in data_frame.iterrows():
        data_item = dict(
            approval_type=row["项目审批类型"],
            filing_catalog=row["备案目录"],
            filing_catalog_category=row["备案目录分类"],
            project_code=row["项目代码"],
            project_name=row["项目名称"],
            is_supplementary_project=row["是否补办项目"],
            application_time=row["申报时间"],
            review_filing_type=row["审核备类型"],
            project_type=row["项目类型"],
            construction_nature=row["建设性质"],
            project_attributes=row["项目属性"],
            planned_start_year=row["拟开工时间（年）"],
            planned_end_year=row["拟建成时间（年）"],
            construction_location=row["建设地点"],
            national_industry_standard=row["国标行业"],
            national_industry_code=row["国标行业代码"],
            management_industry=row["管理行业"],
            construction_scale_and_content=row["建设规模及内容"],
            total_investment=row["总投资（万元）"],
            land_area=row["用地面积（公顷）"],
            new_land_area=row["新增用地面积（公顷）"],
            agricultural_land_area=row["农用地面积（公顷）"],
            project_capital=row["项目资本金（万元）"],
            funding_source=row["资金来源"],
            is_technical_reform_project=row["是否技改项目"],
            industrial_policy_type=row["产业政策类型"],
            industry_adjustment_guidance_catalog=row["产业结构调整指导目录"],
            is_infrastructure_engineering=row["是否属于房屋市政工程"],
            agree_to_provide_financing_services=row[
                "是否同意投资平台为项目单位提供融资对接服务"
            ],
            legal_company=row["项目（法人）单位"],
            legal_company_registration_type=row["项目单位登记注册类型"],
            legal_company_document_type=row["项目法人证照类型"],
            legal_company_document_number=row["项目法人证照号码"],
            legal_company_holding_situation=row["项目单位控股情况"],
            legal_company_contact_name=row["法人单位联系人"],
            legal_company_contact_phone=row["手机号码"],
            legal_company_contact_email=row["电子邮箱"],
            legal_company_legal_representative=row["法人代表姓名"],
            is_legal_company_controlling_for_project=row["是否为该项目的控股单位"],
            application_company=row["项目（申报）单位"],
        )
        for k, v in data_item.items():
            if type(v) == float and numpy.isnan(v):
                data_item[k] = None
        data_list.append(data_item)
    return data_list


def main(filename: str):
    dt = datetime.datetime.now().strftime("%Y-%m-%dT00:00:00")
    data_frame = pandas.read_excel(filename)
    data_list = get_data_list(data_frame)
    conn = db.connect()
    try:
        with conn.cursor() as cursor:
            sql = """
                  insert into project_online_approval
                  values (%(project_code)s, false, %(dt)s, %(dt)s,
                          %(approval_type)s, %(filing_catalog)s, %(filing_catalog_category)s, %(project_code)s,
                          %(project_name)s, %(is_supplementary_project)s, %(application_time)s, %(review_filing_type)s,
                          %(project_type)s, %(construction_nature)s, %(project_attributes)s, %(planned_start_year)s,
                          %(planned_end_year)s, %(construction_location)s, %(national_industry_standard)s,
                          %(national_industry_code)s, %(management_industry)s, %(construction_scale_and_content)s,
                          %(total_investment)s, %(land_area)s, %(new_land_area)s, %(agricultural_land_area)s,
                          %(project_capital)s, %(funding_source)s, %(is_technical_reform_project)s,
                          %(industrial_policy_type)s, %(industry_adjustment_guidance_catalog)s,
                          %(is_infrastructure_engineering)s, %(agree_to_provide_financing_services)s, %(legal_company)s,
                          %(legal_company_registration_type)s, %(legal_company_document_type)s,
                          %(legal_company_document_number)s, %(legal_company_holding_situation)s,
                          %(legal_company_contact_name)s, %(legal_company_contact_phone)s,
                          %(legal_company_contact_email)s, %(legal_company_legal_representative)s,
                          %(is_legal_company_controlling_for_project)s, %(application_company)s,
                          null, null, null, null, null, null);
                  """
            result = 0
            for d in data_list:
                d.update(dt=dt)
                cursor.execute(
                    "delete from project_online_approval where id = %(project_code)s;",
                    d,
                )
                result += cursor.execute(sql, d)
                print("Result:", result, "/", len(data_list))
        conn.commit()
        return dict(total=len(data_list), success=result)
    except Exception as e:
        print("Error:", e)
        conn.rollback()
        raise e
    finally:
        conn.close()


if __name__ == "__main__":
    main(filename="/Users/ZhouTianxing/Desktop/项目信息.xlsx")
