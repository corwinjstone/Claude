'use client';
import { useId, useState } from 'react';
import { IconButton, Popover, Typography, Box } from '@mui/material';
import HelpOutline from '@mui/icons-material/HelpOutline';
import { glossary, type GlossaryKey } from '@/lib/glossary';

/** "What does this mean?" tip. Click or tap to open, so it works on phones and with a keyboard. */
export function HelpTip({ k, size = 'small' }: { k: GlossaryKey; size?: 'small' | 'medium' }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const id = useId();
  const g = glossary[k];
  return (
    <>
      <IconButton
        size={size}
        aria-label={`What does “${g.term}” mean?`}
        aria-describedby={anchor ? id : undefined}
        aria-expanded={Boolean(anchor)}
        onClick={(e) => setAnchor(anchor ? null : e.currentTarget)}
        sx={{ color: 'text.secondary', verticalAlign: 'middle', m: -1 }}
      >
        <HelpOutline fontSize="small" />
      </IconButton>
      <Popover
        id={id}
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{ paper: { sx: { maxWidth: 340, p: 2, bgcolor: 'm3.inverseSurface', color: 'm3.inverseOnSurface' } } }}
      >
        <Box role="note">
          <Typography variant="subtitle2" component="p" gutterBottom>{g.term}</Typography>
          <Typography variant="body2">{g.text}</Typography>
        </Box>
      </Popover>
    </>
  );
}
