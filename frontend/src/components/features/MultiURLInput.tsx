/**
 * MultiURLInput Component
 *
 * Textarea input for entering multiple URLs (comma-separated)
 */

import { useState } from "react";
import { Box, TextField, Button, Grid, Typography, Chip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import type { FormFactor } from "../../types/webVitals";
import DeviceTypeSelect from "../common/DeviceTypeSelect";

interface MultiURLInputProps {
  onSubmit: (urls: string[], formFactor?: FormFactor) => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function MultiURLInput({
  onSubmit,
  loading = false,
  disabled = false,
}: MultiURLInputProps) {
  const [urlsText, setUrlsText] = useState("");
  const [formFactor, setFormFactor] = useState<FormFactor | "">("");
  const [error, setError] = useState("");

  const parseUrls = (text: string): string[] => {
    return text
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);
  };

  const validateUrls = (urls: string[]): boolean => {
    if (urls.length === 0) {
      setError("Please enter at least one URL");
      return false;
    }

    if (urls.length > 10) {
      setError("Maximum 10 URLs allowed");
      return false;
    }

    for (const url of urls) {
      try {
        const urlObj = new URL(url);
        if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
          setError(`Invalid URL: ${url} (must start with http:// or https://)`);
          return false;
        }
      } catch {
        setError(`Invalid URL format: ${url}`);
        return false;
      }
    }

    setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const urls = parseUrls(urlsText);
    if (validateUrls(urls)) {
      onSubmit(urls, formFactor || undefined);
    }
  };

  const handleClear = () => {
    setUrlsText("");
    setFormFactor("");
    setError("");
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUrlsText(e.target.value);
    if (error) {
      setError("");
    }
  };

  const urlCount = parseUrls(urlsText).length;

  return (
    <Box width="100%" component="form" onSubmit={handleSubmit} noValidate>
      <Grid container justifyContent="space-between" alignItems="flex-start">
        <Grid item xs={12} md={6} sx={{ width: "50%" }}>
          <TextField
            size="small"
            fullWidth
            multiline
            rows={5}
            label="Enter URLs (comma-separated)"
            placeholder="https://example.com, https://another-site.com, https://third-site.com"
            value={urlsText}
            onChange={handleTextChange}
            error={!!error}
            helperText={error || "Enter up to 10 URLs separated by commas"}
            disabled={disabled || loading}
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
          />
          <Box sx={{ mt: 1.5, display: "flex", gap: 1, alignItems: "center" }}>
            <Chip
              label={`${urlCount} ${urlCount === 1 ? "URL" : "URLs"}`}
              size="small"
              color={urlCount > 0 ? "primary" : "default"}
              sx={{
                fontWeight: 500,
                borderRadius: 2,
                transition: "all 0.3s ease",
                ...(urlCount > 0 && {
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.8 },
                  },
                }),
              }}
            />
            {urlCount > 10 && (
              <Typography variant="caption" color="error" fontWeight={500}>
                Too many URLs (max 10)
              </Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={6} sx={{ width: "40%" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <DeviceTypeSelect
              value={formFactor}
              onChange={setFormFactor}
              disabled={disabled || loading}
              labelId="multi-form-factor-label"
            />

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SearchIcon />}
                disabled={
                  disabled || loading || urlCount === 0 || urlCount > 10
                }
                fullWidth
                sx={{
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  minWidth: "fit-content",
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                    transform: "translateY(-2px)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                }}
              >
                {loading ? "Analyzing..." : "Analyze All"}
              </Button>
              <Button
                variant="outlined"
                onClick={handleClear}
                disabled={disabled || loading || !urlsText}
                sx={{
                  minWidth: "56px",
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "rotate(90deg)",
                    borderColor: "error.main",
                    color: "error.main",
                  },
                }}
              >
                <ClearIcon />
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
