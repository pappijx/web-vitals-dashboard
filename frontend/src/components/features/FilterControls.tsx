/**
 * FilterControls Component
 *
 * Provides filtering options for Web Vitals data by performance category and metric thresholds
 */

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Collapse,
  IconButton,
  Slider,
  Tabs,
  Tab,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import TuneIcon from "@mui/icons-material/Tune";
import CategoryIcon from "@mui/icons-material/Category";
import type { PerformanceCategory } from "../../types/webVitals";

export interface MetricThresholds {
  lcp?: { min?: number; max?: number };
  fcp?: { min?: number; max?: number };
  cls?: { min?: number; max?: number };
  fid?: { min?: number; max?: number };
  inp?: { min?: number; max?: number };
  ttfb?: { min?: number; max?: number };
}

export interface FilterCriteria {
  category?: PerformanceCategory;
  metric?: "lcp" | "fcp" | "cls" | "fid" | "inp" | "ttfb" | "all";
  thresholds?: MetricThresholds;
}

interface FilterControlsProps {
  onFilterChange: (filters: FilterCriteria) => void;
  activeFilters: FilterCriteria;
}

// Metric configuration with reasonable ranges
const metricConfigs = {
  lcp: { min: 0, max: 10000, step: 100, unit: "ms", label: "LCP" },
  fcp: { min: 0, max: 5000, step: 100, unit: "ms", label: "FCP" },
  cls: { min: 0, max: 1, step: 0.01, unit: "", label: "CLS" },
  fid: { min: 0, max: 1000, step: 10, unit: "ms", label: "FID" },
  inp: { min: 0, max: 1000, step: 10, unit: "ms", label: "INP" },
  ttfb: { min: 0, max: 3000, step: 50, unit: "ms", label: "TTFB" },
};

type MetricKey = keyof typeof metricConfigs;

export default function FilterControls({
  onFilterChange,
  activeFilters,
}: FilterControlsProps) {
  const [expanded, setExpanded] = useState(false);
  const [filterTab, setFilterTab] = useState<"basic" | "threshold">("basic");

  const handleCategoryChange = (category: PerformanceCategory | "all") => {
    onFilterChange({
      ...activeFilters,
      category: category === "all" ? undefined : category,
    });
  };

  const handleMetricChange = (metric: string) => {
    onFilterChange({
      ...activeFilters,
      metric: metric === "all" ? undefined : (metric as FilterCriteria["metric"]),
    });
  };

  const handleThresholdChange = (
    metric: MetricKey,
    type: "min" | "max",
    value: number
  ) => {
    const currentThresholds = activeFilters.thresholds || {};
    const currentMetricThreshold = currentThresholds[metric] || {};

    onFilterChange({
      ...activeFilters,
      thresholds: {
        ...currentThresholds,
        [metric]: {
          ...currentMetricThreshold,
          [type]: value,
        },
      },
    });
  };

  const handleClearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters =
    activeFilters.category ||
    activeFilters.metric ||
    (activeFilters.thresholds && Object.keys(activeFilters.thresholds).length > 0);

  const getFilterChipLabel = () => {
    const filters = [];
    if (activeFilters.category) {
      filters.push(activeFilters.category);
    }
    if (activeFilters.metric) {
      filters.push(activeFilters.metric.toUpperCase());
    }
    if (activeFilters.thresholds) {
      const thresholdCount = Object.keys(activeFilters.thresholds).length;
      if (thresholdCount > 0) {
        filters.push(`${thresholdCount} threshold${thresholdCount > 1 ? "s" : ""}`);
      }
    }
    return filters.join(", ");
  };

  const renderThresholdSliders = () => {
    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
          Set Metric Thresholds
        </Typography>
        <Box sx={{ display: "grid", gap: 3 }}>
          {Object.entries(metricConfigs).map(([key, config]) => {
            const metricKey = key as MetricKey;
            const threshold = activeFilters.thresholds?.[metricKey];
            const minValue = threshold?.min ?? config.min;
            const maxValue = threshold?.max ?? config.max;

            return (
              <Box key={key}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" fontWeight={500}>
                    {config.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {minValue}
                    {config.unit} - {maxValue}
                    {config.unit}
                  </Typography>
                </Box>
                <Slider
                  value={[minValue, maxValue]}
                  onChange={(_, newValue) => {
                    const [min, max] = newValue as number[];
                    handleThresholdChange(metricKey, "min", min);
                    handleThresholdChange(metricKey, "max", max);
                  }}
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}${config.unit}`}
                  sx={{
                    "& .MuiSlider-thumb": {
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 0 0 8px rgba(102, 126, 234, 0.16)",
                      },
                    },
                    "& .MuiSlider-track": {
                      background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
          URLs with metric values outside these ranges will be filtered out
        </Typography>
      </Box>
    );
  };

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        mb: 3,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "50%",
                p: 0.8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FilterListIcon sx={{ fontSize: 18, color: "white" }} />
            </Box>
            <Typography variant="h6" fontWeight={600}>
              Filters
            </Typography>
            {hasActiveFilters && (
              <Chip
                label={getFilterChipLabel()}
                size="small"
                color="primary"
                sx={{ fontWeight: 500, borderRadius: 2 }}
              />
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            {hasActiveFilters && (
              <Button
                size="small"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                sx={{ textTransform: "none" }}
              >
                Clear
              </Button>
            )}
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{
                transition: "transform 0.3s ease",
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={expanded}>
          <Box sx={{ mt: 3 }}>
            <Tabs
              value={filterTab}
              onChange={(_, newValue) => setFilterTab(newValue)}
              sx={{
                minHeight: 40,
                mb: 3,
                "& .MuiTab-root": {
                  minHeight: 40,
                  textTransform: "none",
                  fontWeight: 500,
                },
              }}
            >
              <Tab
                icon={<CategoryIcon sx={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Basic Filters"
                value="basic"
              />
              <Tab
                icon={<TuneIcon sx={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Thresholds"
                value="threshold"
              />
            </Tabs>

            {filterTab === "basic" ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                }}
              >
                {/* Performance Category Filter */}
                <FormControl
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      transition: "all 0.3s ease",
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.main",
                        },
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                      },
                    },
                  }}
                >
                  <InputLabel size="small">Performance Category</InputLabel>
                  <Select
                    size="small"
                    value={activeFilters.category || "all"}
                    label="Performance Category"
                    onChange={(e) =>
                      handleCategoryChange(e.target.value as PerformanceCategory | "all")
                    }
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    <MenuItem value="GOOD">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: "#0cce6b",
                          }}
                        />
                        Good
                      </Box>
                    </MenuItem>
                    <MenuItem value="NEEDS_IMPROVEMENT">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: "#ffa400",
                          }}
                        />
                        Needs Improvement
                      </Box>
                    </MenuItem>
                    <MenuItem value="POOR">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: "#ff4e42",
                          }}
                        />
                        Poor
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>

                {/* Metric Filter */}
                <FormControl
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      transition: "all 0.3s ease",
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.main",
                        },
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                      },
                    },
                  }}
                >
                  <InputLabel size="small">Metric</InputLabel>
                  <Select
                    size="small"
                    value={activeFilters.metric || "all"}
                    label="Metric"
                    onChange={(e) => handleMetricChange(e.target.value)}
                  >
                    <MenuItem value="all">All Metrics</MenuItem>
                    <MenuItem value="lcp">LCP - Largest Contentful Paint</MenuItem>
                    <MenuItem value="fcp">FCP - First Contentful Paint</MenuItem>
                    <MenuItem value="cls">CLS - Cumulative Layout Shift</MenuItem>
                    <MenuItem value="fid">FID - First Input Delay</MenuItem>
                    <MenuItem value="inp">INP - Interaction to Next Paint</MenuItem>
                    <MenuItem value="ttfb">TTFB - Time to First Byte</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            ) : (
              renderThresholdSliders()
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                {filterTab === "basic"
                  ? "Filter URLs based on their performance category or focus on specific metrics"
                  : "Set custom threshold ranges to filter URLs by metric values"}
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
