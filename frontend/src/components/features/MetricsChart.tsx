/**
 * MetricsChart Component
 *
 * Visual chart representation of Web Vitals metrics across multiple URLs
 */

import {
  Box,
  Card,
  CardContent,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { WebVitalsData } from "../../types/webVitals";
import { getPerformanceCategory, getCategoryColor } from "../../utils/metrics";

interface MetricsChartProps {
  data: WebVitalsData[];
}

type ChartType = "grouped" | "individual";

export default function MetricsChart({ data }: MetricsChartProps) {
  const [chartType, setChartType] = useState<ChartType>("grouped");

  // Transform data for grouped bar chart
  const groupedChartData = data.map((item) => ({
    name: new URL(item.url).hostname,
    fullUrl: item.url,
    LCP: item.metrics.lcp,
    FCP: item.metrics.fcp,
    CLS: item.metrics.cls ? item.metrics.cls * 1000 : null, // Scale CLS for visibility
    FID: item.metrics.fid,
    INP: item.metrics.inp,
    TTFB: item.metrics.ttfb,
  }));

  // Transform data for individual metric charts
  const getIndividualMetricData = (metricName: string) => {
    return data.map((item) => {
      const metricKey = metricName.toLowerCase() as keyof typeof item.metrics;
      let value = item.metrics[metricKey];

      // Scale CLS for visibility
      if (metricName === "CLS" && value !== null) {
        value = value * 1000;
      }

      return {
        name: new URL(item.url).hostname,
        fullUrl: item.url,
        value,
        metricName,
      };
    });
  };

  const metrics = ["LCP", "FCP", "CLS", "FID", "INP", "TTFB"];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card sx={{ p: 1.5, maxWidth: 300 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            {payload[0].payload.fullUrl}
          </Typography>
          {payload.map((entry: any, index: number) => {
            let displayValue = entry.value;
            let unit = "ms";

            if (entry.name === "CLS") {
              displayValue = (entry.value / 1000).toFixed(3);
              unit = "";
            }

            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: entry.color,
                  }}
                />
                <Typography variant="caption">
                  <strong>{entry.name}:</strong> {displayValue !== null ? `${displayValue}${unit}` : "N/A"}
                </Typography>
              </Box>
            );
          })}
        </Card>
      );
    }
    return null;
  };

  // Get color based on performance category
  const getBarColor = (metricName: string, value: number | null) => {
    if (value === null) return "#9e9e9e";

    let actualValue = value;
    const metricKey = metricName.toLowerCase() as "lcp" | "fcp" | "cls" | "fid" | "inp" | "ttfb";

    // Unscale CLS for category check
    if (metricName === "CLS") {
      actualValue = value / 1000;
    }

    const category = getPerformanceCategory(metricKey, actualValue);
    return getCategoryColor(category);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "50%",
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BarChartIcon sx={{ color: "white", fontSize: 20 }} />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            Performance Metrics Visualization
          </Typography>
        </Box>

        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={(_, newType) => newType && setChartType(newType)}
          size="small"
          sx={{
            "& .MuiToggleButton-root": {
              textTransform: "none",
              px: 2,
            },
          }}
        >
          <ToggleButton value="grouped">
            <BarChartIcon sx={{ mr: 1, fontSize: 18 }} />
            Grouped
          </ToggleButton>
          <ToggleButton value="individual">
            <ShowChartIcon sx={{ mr: 1, fontSize: 18 }} />
            Individual
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {chartType === "grouped" ? (
        <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={groupedChartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  style={{ fontSize: "12px" }}
                />
                <YAxis style={{ fontSize: "12px" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="LCP" fill="#3f51b5" name="LCP (ms)" />
                <Bar dataKey="FCP" fill="#2196f3" name="FCP (ms)" />
                <Bar dataKey="CLS" fill="#00bcd4" name="CLS (×1000)" />
                <Bar dataKey="FID" fill="#4caf50" name="FID (ms)" />
                <Bar dataKey="INP" fill="#8bc34a" name="INP (ms)" />
                <Bar dataKey="TTFB" fill="#ff9800" name="TTFB (ms)" />
              </BarChart>
            </ResponsiveContainer>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 2, textAlign: "center" }}
            >
              Note: CLS values are scaled by 1000 for better visibility on the chart
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 2 }}>
          {metrics.map((metric) => {
            const metricData = getIndividualMetricData(metric);
            const hasData = metricData.some((d) => d.value !== null);

            if (!hasData) return null;

            return (
              <Card
                key={metric}
                elevation={0}
                sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}
              >
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                    {metric} {metric === "CLS" ? "(×1000)" : "(ms)"}
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={metricData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        style={{ fontSize: "11px" }}
                      />
                      <YAxis style={{ fontSize: "11px" }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" name={metric}>
                        {metricData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={getBarColor(metric, entry.value)}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      {data.length === 0 && (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center">
              No data available for visualization. Please analyze some URLs first.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
