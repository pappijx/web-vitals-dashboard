/**
 * URLInput Component
 *
 * Input field for entering a single URL with form factor selection
 */

import { useState } from "react";
import { Box, TextField, Button, Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import type { FormFactor } from "../../types/webVitals";
import DeviceTypeSelect from "../common/DeviceTypeSelect";

interface URLInputProps {
  onSubmit: (url: string, formFactor?: FormFactor) => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function URLInput({
  onSubmit,
  loading = false,
  disabled = false,
}: URLInputProps) {
  const [url, setUrl] = useState("");
  const [formFactor, setFormFactor] = useState<FormFactor | "">("");
  const [error, setError] = useState("");

  const validateUrl = (value: string): boolean => {
    if (!value.trim()) {
      setError("URL is required");
      return false;
    }

    try {
      const urlObj = new URL(value);
      if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
        setError("URL must start with http:// or https://");
        return false;
      }
      setError("");
      return true;
    } catch {
      setError("Please enter a valid URL");
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUrl(url)) {
      onSubmit(url, formFactor || undefined);
    }
  };

  const handleClear = () => {
    setUrl("");
    setFormFactor("");
    setError("");
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) {
      setError("");
    }
  };

  return (
    <Box width="100%" component="form" onSubmit={handleSubmit} noValidate>
      <Grid container justifyContent="space-between" alignItems="flex-start">
        <Grid item xs={12} md={6} sx={{ width: "50%" }}>
          <TextField
            size="small"
            fullWidth
            label="Enter URL"
            placeholder="https://example.com"
            value={url}
            onChange={handleUrlChange}
            error={!!error}
            helperText={
              error || "Enter a website URL to analyze performance metrics"
            }
            disabled={disabled || loading}
            required
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
        </Grid>

        <Grid item xs={12} md={6} sx={{ width: "40%" }}>
          <Box sx={{ display: "flex", gap: 2, height: "100%" }}>
            <DeviceTypeSelect
              value={formFactor}
              onChange={setFormFactor}
              disabled={disabled || loading}
              labelId="form-factor-label"
            />

            <Button
              type="submit"
              variant="contained"
              startIcon={<SearchIcon />}
              disabled={disabled || loading || !url}
              sx={{
                minWidth: "140px",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
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
              {loading ? "Searching..." : "Search"}
            </Button>
            <Button
              variant="outlined"
              onClick={handleClear}
              disabled={disabled || loading || (!url && !formFactor)}
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
        </Grid>
      </Grid>
    </Box>
  );
}
