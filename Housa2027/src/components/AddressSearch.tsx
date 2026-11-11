'use client';
import { useEffect, useRef, useState } from 'react';
import { Autocomplete, Box, CircularProgress, TextField, Typography } from '@mui/material';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import type { AddressSuggestion } from '@/lib/types';

const providerNote = { google: 'Suggestions by Google', osm: 'Suggestions © OpenStreetMap contributors', housa: 'Sample Housa addresses' };

export function AddressSearch({ onSelect, autoFocus }: { onSelect: (s: AddressSuggestion) => void; autoFocus?: boolean }) {
  const [input, setInput] = useState('');
  const [options, setOptions] = useState<AddressSuggestion[]>([]);
  const [provider, setProvider] = useState<keyof typeof providerNote>('housa');
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    clearTimeout(timer.current);
    if (input.trim().length < 2) { setOptions([]); return; }
    const ctrl = new AbortController();
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/places?q=${encodeURIComponent(input)}`, { signal: ctrl.signal });
        const j = (await res.json()) as { suggestions: AddressSuggestion[]; provider: keyof typeof providerNote };
        setOptions(j.suggestions);
        setProvider(j.provider);
      } catch { /* aborted */ } finally { setLoading(false); }
    }, 250);
    return () => { clearTimeout(timer.current); ctrl.abort(); };
  }, [input]);

  return (
    <Box>
    <Autocomplete<AddressSuggestion, false, false, true>
      freeSolo
      options={options}
      filterOptions={(x) => x}
      getOptionLabel={(o) => (typeof o === 'string' ? o : [o.label, o.secondary].filter(Boolean).join(', '))}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      inputValue={input}
      onInputChange={(_, v) => setInput(v)}
      onChange={(_, v) => {
        if (!v) return;
        if (typeof v === 'string') { if (v.trim().length > 4) onSelect({ id: `typed:${v}`, label: v.trim(), source: 'housa' }); }
        else onSelect(v);
      }}
      loading={loading}
      noOptionsText={input.trim().length < 2 ? 'Start typing your address' : 'No matches yet. Keep typing, or press Enter.'}
      renderInput={(params) => (
        <TextField
          {...params}
          autoFocus={autoFocus}
          label="Your home address"
          placeholder="Start typing, like 309 Post Oak"
          helperText="We never show your address to agents unless you pick one."
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: <PlaceOutlined sx={{ color: 'text.secondary', mr: 1 }} aria-hidden />,
              endAdornment: (<>{loading ? <CircularProgress size={20} aria-label="Loading suggestions" /> : null}{params.InputProps.endAdornment}</>),
            },
          }}
        />
      )}
      renderOption={({ key, ...props }, o) => (
        <Box component="li" key={key} {...props} sx={{ minHeight: 56, display: 'flex', gap: 1.5 }}>
          <PlaceOutlined sx={{ color: 'text.secondary' }} aria-hidden />
          <Box>
            <Typography variant="body1">{o.label}</Typography>
            {o.secondary && <Typography variant="body2" color="text.secondary">{o.secondary}</Typography>}
          </Box>
        </Box>
      )}
      slotProps={{ paper: { sx: { bgcolor: 'm3.surfaceContainer' } } }}
    />
    {options.length > 0 && (
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, ml: 1.75 }}>
        {providerNote[provider]}
      </Typography>
    )}
    </Box>
  );
}
