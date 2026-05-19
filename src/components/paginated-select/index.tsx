import React, { useEffect, useMemo, useState } from "react";
import { Select } from "antd";
import { DefaultOptionType } from "antd/lib/select";
import uniqBy from "lodash/uniqBy";

const DEFAULT_PAGE_SIZE = 25;

interface IPaginatedSelectProps<T> {
  items: T[];
  mapOption: (item: T) => DefaultOptionType;
  value: string | undefined;
  onChange: (
    value: string,
    option: DefaultOptionType | DefaultOptionType[]
  ) => void;
  placeholder?: string;
  pageSize?: number;
}

export const PaginatedSelect = <T,>({
  items,
  mapOption,
  value,
  onChange,
  placeholder,
  pageSize = DEFAULT_PAGE_SIZE
}: IPaginatedSelectProps<T>) => {
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setPage(1);
  }, [items]);

  const displayedOptions = useMemo(() => {
    if (searchValue) {
      return uniqBy(
        items
          .map(mapOption)
          .filter(opt =>
            (opt.label as string)
              ?.toLowerCase()
              .includes(searchValue.toLowerCase())
          ),
        "value"
      );
    }
    return uniqBy(items.slice(0, page * pageSize).map(mapOption), "value");
  }, [items, mapOption, searchValue, page, pageSize]);

  const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (
      scrollTop + clientHeight >= scrollHeight - 20 &&
      page * pageSize < items.length
    ) {
      setPage(p => p + 1);
    }
  };

  const handleChange = (
    val: string,
    option: DefaultOptionType | DefaultOptionType[]
  ) => {
    setSearchValue("");
    onChange(val, option);
  };

  return (
    <Select
      value={value}
      options={displayedOptions}
      onChange={handleChange}
      onPopupScroll={handlePopupScroll}
      onSearch={setSearchValue}
      placeholder={placeholder}
      showSearch
      filterOption={false}
    />
  );
};
