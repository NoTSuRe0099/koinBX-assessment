'use client';

import { useState, useMemo, useEffect } from 'react';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import { Box, Flex, Text, Title, Input } from 'rizzui'; // Import Input for search
import menuDataJson from './data.json';
import { createColumnHelper } from '@tanstack/react-table';

// Define types
export interface MenuCategory {
  category: string;
  items?: MenuItem[];
  subcategories?: MenuSubcategory[];
}

export interface MenuItem {
  name: string;
  price: number;
  ingredients: string[];
}

export interface MenuSubcategory {
  name: string;
  items: MenuItem[];
}

export interface HierarchicalData {
  name: string;
  subRows?: HierarchicalData[];
  price?: number;
  ingredients?: string[];
}

const transformMenuData = (menu: MenuCategory[]): HierarchicalData[] => {
  return menu.map((category) => ({
    name: category.category,
    subRows: category?.subcategories
      ? category?.subcategories?.map((sub) => ({
          name: sub.name,
          subRows: sub.items.map((item) => ({
            name: item.name,
            price: item.price,
            ingredients: item.ingredients,
          })),
        }))
      : category?.items?.map((item) => ({
          name: item.name,
          price: item.price,
          ingredients: item.ingredients,
        })) || [],
  }));
};

const hierarchicalData = transformMenuData(menuDataJson);

const columnHelper = createColumnHelper<HierarchicalData>();

const EMPTY = '--';

export const columns = [
  columnHelper.accessor('name', {
    size: 220,
    header: 'Name',
    enableSorting: true,
    cell: (info) => {
      const row = info.row;
      return (
        <Flex align="center">
          <Text
            className={`mb-0.5 font-lexend !text-sm ${
              row.depth === 0
                ? 'font-bold text-gray-900'
                : row.depth === 1 && row?.original?.subRows?.length
                  ? 'ml-4 font-semibold text-gray-700'
                  : 'ml-6 font-medium text-gray-500'
            }`}
          >
            {row?.original?.subRows?.length
              ? row.getCanExpand() && (
                  <button
                    {...{
                      onClick: row.getToggleExpandedHandler(),
                      style: { marginRight: '10px' },
                    }}
                  >
                    {row.getIsExpanded() ? '▼' : '▶'}
                  </button>
                )
              : null}
            {info.getValue() || EMPTY}
          </Text>
        </Flex>
      );
    },
  }),
  columnHelper.accessor('price', {
    size: 130,
    header: 'Price',
    enableSorting: true,
    cell: (info) => {
      return [1, 2].includes(info.row.depth) ? (
        <Text className="text-gray-500">{info.getValue() || EMPTY}</Text>
      ) : null;
    },
  }),
  columnHelper.accessor('ingredients', {
    size: 200,
    header: 'Ingredients',
    enableSorting: false,
    cell: (info) => {
      return [1, 2].includes(info.row.depth) ? (
        <Text className="text-gray-500">
          {info?.getValue()?.length ? info?.getValue()?.join(', ') : EMPTY}
        </Text>
      ) : null;
    },
  }),
];

export default function MenuTable({ className }: { className?: string }) {
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    if (!search) return hierarchicalData;

    const searchTerm = search.toLowerCase();

    const filterItems = (data: HierarchicalData[]): HierarchicalData[] => {
      return data
        .map((category) => {
          const filteredSubRows = category.subRows
            ? filterItems(category.subRows)
            : [];

          if (
            category.name.toLowerCase().includes(searchTerm) ||
            filteredSubRows.length > 0
          ) {
            return { ...category, subRows: filteredSubRows };
          }

          return null;
        })
        .filter(Boolean) as HierarchicalData[];
    };

    return filterItems(hierarchicalData);
  }, [search]);

  const { table } = useTanStackTable<HierarchicalData>({
    tableData: filteredData, // Use filtered data
    columnConfig: columns,
    options: {
      getSubRows: (row) => row.subRows || undefined,
      paginateExpandedRows: true,
      initialState: {
        expanded: true,
        pagination: {
          pageIndex: 0,
          pageSize: 30,
        },
      },
      enableColumnResizing: false,
    },
  });

  useEffect(() => {
    table.toggleAllRowsExpanded(true);
  }, [filteredData]);

  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between">
        <Title className="text-lg font-semibold text-gray-900 xl:text-xl">
          Menu
        </Title>
        <Input
          className="w-64"
          placeholder="Search menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Box className="space-y-4">
        <Table key={filteredData.length} table={table} />
        <TablePagination table={table} />
      </Box>
    </div>
  );
}
