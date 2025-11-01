/**
 * ErrorDisplay Component
 *
 * Reusable error message component using Material-UI Alert
 */

import { Alert, AlertTitle, Box, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  severity?: 'error' | 'warning' | 'info';
}

export default function ErrorDisplay({
  title = 'Error',
  message,
  onRetry,
  severity = 'error',
}: ErrorDisplayProps) {
  return (
    <Box sx={{ padding: 2 }}>
      <Alert
        severity={severity}
        action={
          onRetry && (
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
            >
              Retry
            </Button>
          )
        }
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
}
