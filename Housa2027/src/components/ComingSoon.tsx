import Link from 'next/link';
import { Button, Card, CardContent, Container, Typography } from '@mui/material';

export function ComingSoon({ screen, title, children }: { screen: number; title: string; children: React.ReactNode }) {
  return (
    <Container maxWidth="sm" sx={{ pt: 6 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="overline" color="success.main" component="p">Screen {screen} · coming next</Typography>
          <Typography variant="h3" component="h1" sx={{ mt: 1 }}>{title}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>{children}</Typography>
          <Button component={Link} href="/" variant="contained" sx={{ mt: 3 }}>Back to the calculator</Button>
        </CardContent>
      </Card>
    </Container>
  );
}
