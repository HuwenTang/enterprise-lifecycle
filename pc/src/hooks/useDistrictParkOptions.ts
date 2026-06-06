import { systemApi } from '@/services/api';
import { message } from 'antd';
import { useState } from 'react';

export type DistrictOption = { value: string; label: string };
export type DistrictWithParks = DistrictOption & { children: DistrictOption[] };

export function useDistrictParkOptions() {
  const [fullDistrictOpts, setFullDistrictOpts] = useState<DistrictWithParks[]>([]);
  const [districtOptions, setDistrictOptions] = useState<DistrictOption[]>([]);
  const [parkOptions, setParkOptions] = useState<DistrictOption[]>([]);

  const updateParkByDistrict = (districtValue: string | undefined) => {
    if (!districtValue) {
      setParkOptions([]);
      return;
    }
    const selected = fullDistrictOpts.find((d) => d.value === districtValue);
    setParkOptions(
      selected?.children
        ?.map((p) => ({ value: String(p.value ?? ''), label: String(p.label ?? '') }))
        .filter((p) => p.value) ?? [],
    );
  };

  const load = async () => {
    try {
      const [tree, grants] = await Promise.all([
        systemApi.getAdministrativeDivisionTree(),
        systemApi.getActiveAreaGrants({}),
      ]);

      const districts = (tree as any)?.[0]?.children ?? [];
      const cascaderPaths: string[][] = (grants as any)?.data4cascader ?? [];

      const allowedPark = new Set<string>();
      const allowedDistrict = new Set<string>();
      for (const p of cascaderPaths) {
        if (!Array.isArray(p) || p.length === 0) continue;
        const park = String(p[p.length - 1] ?? '').trim();
        const district = p.length >= 2 ? String(p[p.length - 2] ?? '').trim() : '';
        if (park) allowedPark.add(park);
        if (district) allowedDistrict.add(district);
      }

      const opts: DistrictWithParks[] = (districts as any[])
        .map((d) => {
          const dv = String(d?.value ?? '').trim();
          const dl = String(d?.label ?? '').trim();
          if (!dv || !dl) return null;
          if (allowedDistrict.size > 0 && !allowedDistrict.has(dv)) return null;
          const children = (d?.children ?? [])
            .map((p: any) => {
              const pv = String(p?.value ?? '').trim();
              const pl = String(p?.label ?? '').trim();
              if (!pv || !pl) return null;
              if (allowedPark.size > 0 && !allowedPark.has(pv)) return null;
              return { value: pv, label: pl };
            })
            .filter(Boolean) as DistrictOption[];
          if (!children.length) return null;
          return { value: dv, label: dl, children };
        })
        .filter(Boolean) as DistrictWithParks[];

      setFullDistrictOpts(opts);
      setDistrictOptions(opts.map(({ value, label }) => ({ value, label })));
    } catch {
      message.error('获取行政区划失败');
      setFullDistrictOpts([]);
      setDistrictOptions([]);
      setParkOptions([]);
    }
  };

  /** 仅有 park 无 district 时，从全量数据反推所属区县 */
  const inferDistrictByPark = (parkValue: string): string | undefined => {
    for (const dist of fullDistrictOpts) {
      if (dist.children?.some((p) => String(p.value) === String(parkValue))) {
        return dist.value;
      }
    }
    return undefined;
  };

  return { districtOptions, parkOptions, fullDistrictOpts, load, updateParkByDistrict, inferDistrictByPark };
}
