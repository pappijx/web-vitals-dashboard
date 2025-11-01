/**
 * DataTable Component
 *
 * Displays Web Vitals metrics in a sortable table format
 */

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Chip,
  Tooltip,
  Box,
  Typography,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { WebVitalsData, SortOrder, SortableField } from '../../types/webVitals';
import {
  getPerformanceCategory,
  getCategoryColor,
  formatMetricValue,
  getMetricFullName,
  getMetricDescription,
} from '../../utils/metrics';

interface DataTableProps {
  data: WebVitalsData[];
  loading?: boolean;
}

export default function DataTable({ data, loading = false }: DataTableProps) {
  const [orderBy, setOrderBy] = useState<SortableField>('url');
  const [order, setOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortableField) => {
    const isAsc = orderBy === field && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(field);
  };

  const sortedData = [...data].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    if (orderBy === 'url') {
      aValue = a.url;
      bValue = b.url;
    } else {
      aValue = a.metrics[orderBy] ?? -1;
      bValue = b.metrics[orderBy] ?? -1;
    }

    if (aValue === bValue) return 0;
    if (aValue === null || aValue === -1) return 1;
    if (bValue === null || bValue === -1) return -1;

    const comparison = aValue < bValue ? -1 : 1;
    return order === 'asc' ? comparison : -comparison;
  });

  const renderMetricCell = (
    metricName: keyof WebVitalsData['metrics'],
    value: number | null
  ) => {
    const category = getPerformanceCategory(metricName, value);
    const color = getCategoryColor(category);

    return (
      <TableCell align="right">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
          <Typography variant="body2">{formatMetricValue(metricName, value)}</Typography>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: color,
            }}
          />
        </Box>
      </TableCell>
    );
  };

  const renderHeaderCell = (field: SortableField, label: string, tooltip?: string) => {
    const isRightAligned = field !== 'url';
    return (
      <TableCell align={isRightAligned ? 'right' : 'left'}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            justifyContent: isRightAligned ? 'flex-end' : 'flex-start',
            flexDirection: isRightAligned ? 'row-reverse' : 'row',
          }}
        >
          {tooltip && (
            <Tooltip title={tooltip} arrow>
              <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary', cursor: 'help' }} />
            </Tooltip>
          )}
          <TableSortLabel
            active={orderBy === field}
            direction={orderBy === field ? order : 'asc'}
            onClick={() => handleSort(field)}
            sx={{
              flexDirection: isRightAligned ? 'row-reverse' : 'row',
              '& .MuiTableSortLabel-icon': {
                marginLeft: isRightAligned ? 0 : undefined,
                marginRight: isRightAligned ? '4px' : undefined,
              }
            }}
          >
            {label}
          </TableSortLabel>
        </Box>
      </TableCell>
    );
  };

  if (data.length === 0 && !loading) {
    return (
      <Paper sx={{ padding: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No data to display. Enter a URL above to get started.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead sx={{ backgroundColor: "action.hover" }}>
          <TableRow>
            {renderHeaderCell('url', 'URL')}
            {renderHeaderCell('lcp', 'LCP', getMetricDescription('lcp'))}
            {renderHeaderCell('fcp', 'FCP', getMetricDescription('fcp'))}
            {renderHeaderCell('cls', 'CLS', getMetricDescription('cls'))}
            {renderHeaderCell('fid', 'FID', getMetricDescription('fid'))}
            {renderHeaderCell('inp', 'INP', getMetricDescription('inp'))}
            {renderHeaderCell('ttfb', 'TTFB', getMetricDescription('ttfb'))}
            <TableCell align="center">Device</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row, index) => (
            <TableRow
              key={`${row.url}-${index}`}
              sx={{
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "action.hover",
                  transform: "scale(1.001)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                },
                "&:last-child td": {
                  borderBottom: 0,
                },
              }}
            >
              <TableCell component="th" scope="row">
                <Tooltip title={row.url} arrow>
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 300,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row.url}
                  </Typography>
                </Tooltip>
              </TableCell>
              {renderMetricCell('lcp', row.metrics.lcp)}
              {renderMetricCell('fcp', row.metrics.fcp)}
              {renderMetricCell('cls', row.metrics.cls)}
              {renderMetricCell('fid', row.metrics.fid)}
              {renderMetricCell('inp', row.metrics.inp)}
              {renderMetricCell('ttfb', row.metrics.ttfb)}
              <TableCell align="center">
                <Chip
                  label={row.formFactor}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{
                    fontWeight: 500,
                    borderRadius: 2,
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
