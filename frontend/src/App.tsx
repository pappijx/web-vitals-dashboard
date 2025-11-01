/**
 * Web Vitals Dashboard - Main App Component
 *
 * Fullstack application for analyzing Chrome UX Report performance metrics
 */

import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Divider,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
} from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";
import SearchIcon from "@mui/icons-material/Search";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ListAltIcon from "@mui/icons-material/ListAlt";
import TableChartIcon from "@mui/icons-material/TableChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import type {
  FormFactor,
  WebVitalsData,
  PerformanceCategory,
} from "./types/webVitals";
import {
  useSingleUrlMetrics,
  useMultipleUrlsWithSummary,
} from "./hooks/useWebVitals";
import { getPerformanceCategory } from "./utils/metrics";
import URLInput from "./components/features/URLInput";
import MultiURLInput from "./components/features/MultiURLInput";
import DataTable from "./components/features/DataTable";
import MetricsChart from "./components/features/MetricsChart";
import SummaryStatistics from "./components/features/SummaryStatistics";
import FilterControls, {
  type FilterCriteria,
} from "./components/features/FilterControls";
import LoadingSpinner from "./components/common/LoadingSpinner";
import ErrorDisplay from "./components/common/ErrorDisplay";

type TabValue = "single" | "multiple";
type ViewType = "table" | "chart";

function App() {
  const [activeTab, setActiveTab] = useState<TabValue>("single");
  const [viewType, setViewType] = useState<ViewType>("table");

  // Single URL state
  const [singleUrl, setSingleUrl] = useState("");
  const [singleFormFactor, setSingleFormFactor] = useState<
    FormFactor | undefined
  >();
  const [singleData, setSingleData] = useState<WebVitalsData[]>([]);

  // Multiple URLs state
  const [multipleUrls, setMultipleUrls] = useState<string[]>([]);
  const [multipleFormFactor, setMultipleFormFactor] = useState<
    FormFactor | undefined
  >();
  const [filters, setFilters] = useState<FilterCriteria>({});

  // Single URL query
  const singleQuery = useSingleUrlMetrics(
    singleUrl,
    singleFormFactor,
    !!singleUrl
  );

  // Multiple URLs query
  const multipleQuery = useMultipleUrlsWithSummary(
    multipleUrls,
    multipleFormFactor,
    multipleUrls.length > 0
  );

  // Handle single URL submission
  const handleSingleUrlSubmit = (url: string, formFactor?: FormFactor) => {
    setSingleUrl(url);
    setSingleFormFactor(formFactor);
  };

  // Handle multiple URLs submission
  const handleMultipleUrlsSubmit = (
    urls: string[],
    formFactor?: FormFactor
  ) => {
    setMultipleUrls(urls);
    setMultipleFormFactor(formFactor);
  };

  // Update single data when query succeeds
  if (singleQuery.isSuccess && singleQuery.data && singleData.length === 0) {
    setSingleData([singleQuery.data.data]);
  }

  // Reset single data when changing URL
  if (
    !singleQuery.isLoading &&
    !singleQuery.isSuccess &&
    singleData.length > 0
  ) {
    setSingleData([]);
  }

  // Handle tab change
  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: TabValue
  ) => {
    setActiveTab(newValue);
  };

  // Filter data based on active filters
  const applyFilters = (data: WebVitalsData[]): WebVitalsData[] => {
    return data.filter((item) => {
      // Category filter
      if (filters.category) {
        const metricToCheck =
          filters.metric && filters.metric !== "all" ? filters.metric : "lcp";
        const category = getPerformanceCategory(
          metricToCheck,
          item.metrics[metricToCheck]
        );
        if (category.toLowerCase() !== filters.category.toLowerCase()) {
          return false;
        }
      }

      // Metric-specific threshold filters
      if (filters.thresholds) {
        for (const [metric, threshold] of Object.entries(filters.thresholds)) {
          const metricKey = metric as keyof typeof item.metrics;
          const value = item.metrics[metricKey];

          if (value === null) continue;

          if (threshold.min !== undefined && value < threshold.min) {
            return false;
          }
          if (threshold.max !== undefined && value > threshold.max) {
            return false;
          }
        }
      }

      return true;
    });
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        py: 4,
        px: { xs: 2, sm: 3, md: 4 },
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: "center", width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 1.5, sm: 2 },
            mb: 2,
            flexWrap: "wrap",
            animation: "fadeInDown 0.6s ease-out",
            "@keyframes fadeInDown": {
              "0%": {
                opacity: 0,
                transform: "translateY(-20px)",
              },
              "100%": {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "50%",
              p: { xs: 1, sm: 1.5 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
            }}
          >
            <SpeedIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: "white" }} />
          </Box>
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px",
              fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Web Vitals Dashboard
          </Typography>
        </Box>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{
            maxWidth: 600,
            mx: "auto",
            lineHeight: 1.6,
            px: { xs: 2, sm: 0 },
            fontSize: { xs: "0.95rem", sm: "1rem" },
            animation: "fadeIn 0.8s ease-out 0.2s both",
            "@keyframes fadeIn": {
              "0%": {
                opacity: 0,
              },
              "100%": {
                opacity: 1,
              },
            },
          }}
        >
          Analyze Chrome UX Report performance metrics for your websites with
          real-time insights
        </Typography>
      </Box>

      {/* Mode Tabs */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          width: "100%",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          },
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 500,
              py: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            },
            "& .Mui-selected": {
              fontWeight: 600,
            },
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px 3px 0 0",
            },
          }}
        >
          <Tab label="Single URL Analysis" value="single" />
          <Tab label="Multiple URLs Comparison" value="multiple" />
        </Tabs>
      </Paper>

      {/* Single URL Tab */}
      {activeTab === "single" && (
        <Box
          sx={{
            width: "100%",
            animation: "fadeInUp 0.5s ease-out",
            "@keyframes fadeInUp": {
              "0%": {
                opacity: 0,
                transform: "translateY(20px)",
              },
              "100%": {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
          role="tabpanel"
          aria-labelledby="single-url-tab"
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              mb: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              },
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
            >
              <Box
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "50%",
                  p: 0.8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SearchIcon sx={{ fontSize: 18, color: "white" }} />
              </Box>
              <Typography variant="h6" fontWeight={600}>
                Analyze Single URL
              </Typography>
            </Box>
            <Divider sx={{ mb: 3, opacity: 0.6 }} />
            <URLInput
              onSubmit={handleSingleUrlSubmit}
              loading={singleQuery.isLoading}
              disabled={singleQuery.isLoading}
            />
          </Paper>

          {/* Single URL Loading */}
          {singleQuery.isLoading && (
            <LoadingSpinner message="Fetching performance metrics..." />
          )}

          {/* Single URL Error */}
          {singleQuery.isError && (
            <ErrorDisplay
              title="Failed to fetch metrics"
              message={
                singleQuery.error?.message ||
                "Unable to fetch performance metrics. Please try again."
              }
              onRetry={() => singleQuery.refetch()}
            />
          )}

          {/* Single URL Success - Show Data Table */}
          {singleQuery.isSuccess && singleData.length > 0 && (
            <Box
              sx={{
                width: "100%",
                animation: "fadeIn 0.6s ease-out",
                "@keyframes fadeIn": {
                  "0%": { opacity: 0 },
                  "100%": { opacity: 1 },
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "50%",
                      p: 0.8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AssessmentIcon sx={{ fontSize: 18, color: "white" }} />
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    Performance Metrics
                  </Typography>
                </Box>
                <ToggleButtonGroup
                  value={viewType}
                  exclusive
                  onChange={(_, newView) => newView && setViewType(newView)}
                  size="small"
                  sx={{
                    "& .MuiToggleButton-root": {
                      textTransform: "none",
                      px: 2,
                    },
                  }}
                >
                  <ToggleButton value="table">
                    <TableChartIcon sx={{ mr: 1, fontSize: 18 }} />
                    Table
                  </ToggleButton>
                  <ToggleButton value="chart">
                    <BarChartIcon sx={{ mr: 1, fontSize: 18 }} />
                    Chart
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
              {viewType === "table" ? (
                <DataTable data={singleData} loading={singleQuery.isLoading} />
              ) : (
                <MetricsChart data={singleData} />
              )}
              <Alert
                severity="info"
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "info.light",
                }}
              >
                Data collected from Chrome User Experience Report over the past
                28 days
              </Alert>
            </Box>
          )}
        </Box>
      )}

      {/* Multiple URLs Tab */}
      {activeTab === "multiple" && (
        <Box
          sx={{
            width: "100%",
            animation: "fadeInUp 0.5s ease-out",
            "@keyframes fadeInUp": {
              "0%": {
                opacity: 0,
                transform: "translateY(20px)",
              },
              "100%": {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
          role="tabpanel"
          aria-labelledby="multiple-urls-tab"
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              mb: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              },
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
            >
              <Box
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "50%",
                  p: 0.8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CompareArrowsIcon sx={{ fontSize: 18, color: "white" }} />
              </Box>
              <Typography variant="h6" fontWeight={600}>
                Compare Multiple URLs
              </Typography>
            </Box>
            <Divider sx={{ mb: 3, opacity: 0.6 }} />
            <MultiURLInput
              onSubmit={handleMultipleUrlsSubmit}
              loading={multipleQuery.isLoading}
              disabled={multipleQuery.isLoading}
            />
          </Paper>

          {/* Multiple URLs Loading */}
          {multipleQuery.isLoading && (
            <LoadingSpinner message="Analyzing multiple URLs..." />
          )}

          {/* Multiple URLs Error */}
          {multipleQuery.isError && (
            <ErrorDisplay
              title="Failed to fetch metrics"
              message={
                multipleQuery.error?.message ||
                "Unable to fetch performance metrics. Please try again."
              }
              onRetry={() => multipleQuery.refetch()}
            />
          )}

          {/* Multiple URLs Success */}
          {multipleQuery.isSuccess && multipleQuery.data && (
            <Box
              sx={{
                width: "100%",
                animation: "fadeIn 0.6s ease-out",
                "@keyframes fadeIn": {
                  "0%": { opacity: 0 },
                  "100%": { opacity: 1 },
                },
              }}
            >
              {/* Summary Statistics */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3, md: 4 },
                  mb: 3,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <SummaryStatistics
                  summary={multipleQuery.data.data.summary}
                  stats={multipleQuery.data.data.stats}
                />
              </Paper>

              {/* Filter Controls */}
              <FilterControls
                onFilterChange={setFilters}
                activeFilters={filters}
              />

              {/* Individual Results Table */}
              {multipleQuery.data.data.stats.successful > 0 &&
                (() => {
                  const successfulData = multipleQuery.data.data.results
                    .filter((r) => r.success && r.data)
                    .map((r) => r.data!);
                  const filteredData = applyFilters(successfulData);

                  return (
                    <Box sx={{ width: "100%", mt: 1 }}>
                      <Divider sx={{ mb: 4, opacity: 0.6 }} />
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 3,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              borderRadius: "50%",
                              p: 0.8,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <ListAltIcon
                              sx={{ fontSize: 18, color: "white" }}
                            />
                          </Box>
                          <Typography variant="h6" fontWeight={600}>
                            Individual Results
                          </Typography>
                          {filteredData.length < successfulData.length && (
                            <Chip
                              label={`${filteredData.length} of ${successfulData.length}`}
                              size="small"
                              color="primary"
                              sx={{ fontWeight: 500, borderRadius: 2 }}
                            />
                          )}
                        </Box>
                        <ToggleButtonGroup
                          value={viewType}
                          exclusive
                          onChange={(_, newView) =>
                            newView && setViewType(newView)
                          }
                          size="small"
                          sx={{
                            "& .MuiToggleButton-root": {
                              textTransform: "none",
                              px: 2,
                            },
                          }}
                        >
                          <ToggleButton value="table">
                            <TableChartIcon sx={{ mr: 1, fontSize: 18 }} />
                            Table
                          </ToggleButton>
                          <ToggleButton value="chart">
                            <BarChartIcon sx={{ mr: 1, fontSize: 18 }} />
                            Chart
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </Box>
                      {filteredData.length > 0 ? (
                        viewType === "table" ? (
                          <DataTable
                            data={filteredData}
                            loading={multipleQuery.isLoading}
                          />
                        ) : (
                          <MetricsChart data={filteredData} />
                        )
                      ) : (
                        <Paper
                          elevation={0}
                          sx={{
                            p: 4,
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "divider",
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="body1" color="text.secondary">
                            No results match the current filters. Try adjusting
                            your filter criteria.
                          </Typography>
                        </Paper>
                      )}
                    </Box>
                  );
                })()}

              {/* Show errors if any */}
              {multipleQuery.data.data.stats.failed > 0 && (
                <Alert
                  severity="warning"
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "warning.light",
                  }}
                >
                  {multipleQuery.data.data.stats.failed} URL(s) failed to fetch
                  metrics. Failed URLs:{" "}
                  {multipleQuery.data.data.results
                    .filter((r) => !r.success)
                    .map((r) => r.url)
                    .join(", ")}
                </Alert>
              )}

              <Alert
                severity="info"
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "info.light",
                }}
              >
                Data collected from Chrome User Experience Report over the past
                28 days
              </Alert>
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
}

export default App;
