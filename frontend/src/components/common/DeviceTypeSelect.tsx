/**
 * DeviceTypeSelect Component
 *
 * Reusable device type (form factor) selector for filtering Web Vitals data
 */

import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import ComputerIcon from "@mui/icons-material/Computer";
import TabletIcon from "@mui/icons-material/Tablet";
import type { FormFactor } from "../../types/webVitals";

interface DeviceTypeSelectProps {
  value: FormFactor | "";
  onChange: (value: FormFactor | "") => void;
  disabled?: boolean;
  labelId?: string;
}

export default function DeviceTypeSelect({
  value,
  onChange,
  disabled = false,
  labelId = "device-type-label",
}: DeviceTypeSelectProps) {
  return (
    <FormControl
      fullWidth
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
      <InputLabel size="small" id={labelId}>
        Device Type
      </InputLabel>
      <Select
        size="small"
        labelId={labelId}
        value={value}
        label="Device Type"
        onChange={(e) => onChange(e.target.value as FormFactor | "")}
        disabled={disabled}
      >
        <MenuItem value="">
          <em>All Devices</em>
        </MenuItem>
        <MenuItem value="PHONE">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PhoneAndroidIcon fontSize="small" />
            Mobile
          </Box>
        </MenuItem>
        <MenuItem value="DESKTOP">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ComputerIcon fontSize="small" />
            Desktop
          </Box>
        </MenuItem>
        <MenuItem value="TABLET">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TabletIcon fontSize="small" />
            Tablet
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );
}
