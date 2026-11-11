'use client';
import { useState } from 'react';
import { Alert, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Snackbar, TextField, Typography } from '@mui/material';
import type { HomeEstimate } from '@/lib/types';
import { about } from '@/lib/money';

export function SaveHomeDialog({ open, onClose, estimate, youKeep, onStartRequest }: {
  open: boolean; onClose: () => void; estimate: HomeEstimate; youKeep: number; onStartRequest: () => void;
}) {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [monthly, setMonthly] = useState(true);
  const [saved, setSaved] = useState(false);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  function save() {
    setTouched(true);
    if (!valid) return;
    try {
      const list = JSON.parse(localStorage.getItem('housa.savedHomes') ?? '[]');
      list.push({ email, monthly, label: estimate.label, mid: estimate.mid, savedAt: new Date().toISOString() });
      localStorage.setItem('housa.savedHomes', JSON.stringify(list));
    } catch { /* storage blocked; prototype only */ }
    setSaved(true);
    onClose();
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} aria-labelledby="save-title" fullWidth maxWidth="xs">
        <DialogTitle id="save-title">Save your home</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Today you could keep about {about(youKeep)}. We’ll email you when that number changes.
          </Typography>
          <TextField
            autoFocus
            type="email"
            label="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            error={touched && !valid}
            helperText={touched && !valid ? 'Enter an email like name@example.com.' : ' '}
            onKeyDown={(e) => e.key === 'Enter' && save()}
          />
          <FormControlLabel control={<Checkbox checked={monthly} onChange={(e) => setMonthly(e.target.checked)} />} label="Send me a monthly equity update" />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save home</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={saved} autoHideDuration={8000} onClose={() => setSaved(false)}>
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSaved(false)}
          action={<Button color="inherit" size="small" onClick={() => { setSaved(false); onStartRequest(); }}>Get offers</Button>}
        >
          Saved. We’ll email {email} {monthly ? 'once a month' : 'about big changes'}. (Prototype: no email is sent.)
        </Alert>
      </Snackbar>
    </>
  );
}
