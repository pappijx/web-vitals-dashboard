/**
 * SummaryStatistics Component
 *
 * Displays aggregate statistics for multiple URLs
 */

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import TimelineIcon from "@mui/icons-material/Timeline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import type {
  SummaryStatistics as SummaryStats,
  MultiUrlStats,
} from "../../types/webVitals";
import {
  getPerformanceCategory,
  getCategoryColor,
  formatMetricValue,
  getMetricFullName,
} from "../../utils/metrics";

interface SummaryStatisticsProps {
  summary: SummaryStats;
  stats: MultiUrlStats;
}

export default function SummaryStatistics({
  summary,
  stats,
}: SummaryStatisticsProps) {
  const renderMetricCard = (
    metricName: keyof SummaryStats,
    value: number | null,
    label: string
  ) => {
    // Convert 'avgLcp' to 'lcp', 'avgFcp' to 'fcp', etc.
    const baseMetricName = metricName.replace("avg", "").toLowerCase() as
      | "lcp"
      | "fcp"
      | "cls"
      | "fid"
      | "inp"
      | "ttfb";

    const category = getPerformanceCategory(baseMetricName, value);
    const color = getCategoryColor(category);

    return (
      <Card
        elevation={0}
        sx={{
          height: "100%",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            borderColor: color,
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            backgroundColor: color,
          },
        }}
      >
        <CardContent sx={{ pt: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography
              variant="overline"
              color="text.secondary"
              fontWeight={600}
              letterSpacing={1}
            >
              {label}
            </Typography>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: color,
                boxShadow: `0 0 8px ${color}`,
              }}
            />
          </Box>
          <Typography
            variant="h4"
            component="div"
            sx={{ mb: 1, fontWeight: 600, color: "text.primary" }}
          >
            {formatMetricValue(baseMetricName, value)}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {getMetricFullName(baseMetricName)}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
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
          <TimelineIcon sx={{ color: "white", fontSize: 20 }} />
        </Box>
        <Typography variant="h6" fontWeight={600}>
          Summary Statistics
        </Typography>
        <Box sx={{ display: "flex", gap: 1, ml: "auto", flexWrap: "wrap" }}>
          <Chip
            icon={<CheckCircleIcon />}
            label={`${stats.successful} Successful`}
            color="success"
            size="small"
            sx={{ fontWeight: 500, borderRadius: 2 }}
          />
          {stats.failed > 0 && (
            <Chip
              icon={<ErrorIcon />}
              label={`${stats.failed} Failed`}
              color="error"
              size="small"
              sx={{ fontWeight: 500, borderRadius: 2 }}
            />
          )}
          <Chip
            label={`${stats.total} Total`}
            variant="outlined"
            size="small"
            sx={{ fontWeight: 500, borderRadius: 2 }}
          />
        </Box>
      </Box>

      <Divider sx={{ mb: 4, opacity: 0.6 }} />

      {stats.successful === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center">
              No successful results to display. All URLs failed to fetch
              metrics.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            {renderMetricCard("avgLcp", summary.avgLcp, "Average LCP")}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            {renderMetricCard("avgFcp", summary.avgFcp, "Average FCP")}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            {renderMetricCard("avgCls", summary.avgCls, "Average CLS")}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            {renderMetricCard("avgFid", summary.avgFid, "Average FID")}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            {renderMetricCard("avgInp", summary.avgInp, "Average INP")}
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            {renderMetricCard("avgTtfb", summary.avgTtfb, "Average TTFB")}
          </Grid>
        </Grid>
      )}

      {stats.successful > 0 && (
        <Box
          sx={{
            mt: 4,
            p: 3,
            bgcolor: "background.default",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <TrendingUpIcon color="primary" fontSize="small" />
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Average metrics calculated from {stats.successful} successful{" "}
              {stats.successful === 1 ? "result" : "results"}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
