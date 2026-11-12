'use client';
// Housa home page, built from the "Housa - Splashpage" frame in the Figma file ("Housa - Splash Blue").
// It keeps the Figma look (photos, three numbered steps, mini calculator, agent card) and is laid out to flow
// from phone to desktop instead of using fixed positions.
import { useState } from 'react';
import Link from 'next/link';
import { Box, Button, Container, Slider, Stack, Typography, type SxProps, type Theme } from '@mui/material';
import tokens from '@/theme/m3-tokens.json';
import { Logo } from '@/components/Logo';
import { asset } from '@/lib/asset';
import { PLATFORM_FEE, PLATFORM_FEE_NAME } from '@/lib/fees';
import { money } from '@/lib/money';
import { defaultClosingCosts, pctText } from '@/features/calculator/scenarios';

const { blue: BLUE, lime: LIME, navy: NAVY } = tokens.brand;
const DEEP = '#004DAB'; // base blue of the splash page in the Figma file
const GREEN = '#60B800'; // "Create Account" button in the Figma file
const WHITE = '#FFFFFF';
const img = (name: string) => asset(`/brand/splash/${name}`);

// ---------- Sample numbers for the mini calculator ----------
// The same rules as the calculators: the $995 fee and about 1% closing costs are in every net sheet.
// A traditional sale is 6% (3% + 3%). To keep the demo to two sliders, the buyer's agent offer is $0.
const SAMPLE_MORTGAGE = 215_000;
const SAMPLE_ADDRESS = '732 Caspian Way, Grand Prairie, TX 75052';
const DEFAULT_PRICE = 250_000;
const DEFAULT_COMMISSION = 2.25;
function demo(price: number, commissionPct: number) {
  const closing = defaultClosingCosts(price);
  const cash = price - SAMPLE_MORTGAGE - (price * commissionPct) / 100 - PLATFORM_FEE - closing;
  const traditional = price - SAMPLE_MORTGAGE - price * 0.06 - closing;
  return { cash, more: cash - traditional, closing };
}

// ---------- Small pieces ----------
const heavy = { fontWeight: 800 } as const;

function StepBadge({ n, fill = BLUE }: { n: number; fill?: string }) {
  return (
    <Box
      aria-hidden
      sx={{ width: { xs: 56, md: 73 }, height: { xs: 56, md: 73 }, flexShrink: 0, borderRadius: '50%', bgcolor: fill, color: WHITE, display: 'grid', placeItems: 'center', fontSize: { xs: '1.5rem', md: '2rem' }, ...heavy }}
    >
      {n}
    </Box>
  );
}

function PageButtons({ sx }: { sx?: SxProps<Theme> }) {
  return (
    <Stack direction="row" spacing={1.5} sx={sx}>
      <Button component="a" href="#how-it-works" variant="outlined" sx={{ color: WHITE, borderColor: WHITE, borderWidth: 1.5, '&:hover': { borderWidth: 1.5, borderColor: WHITE, bgcolor: 'rgba(255,255,255,0.12)' } }}>
        Learn more
      </Button>
      <Button component={Link} href="/sell" variant="contained" sx={{ bgcolor: GREEN, color: NAVY, '&:hover': { bgcolor: '#76d41c' } }}>
        Create Account
      </Button>
    </Stack>
  );
}

/** Five stars: a dim star underneath, a white star over it for each point of the rating (from the Figma assets). */
function Stars({ rating }: { rating: number }) {
  return (
    <Stack direction="row" spacing="3px" role="img" aria-label={`Rated ${rating} out of 5`} sx={{ mt: 0.5 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Box key={i} aria-hidden sx={{ position: 'relative', width: 15, height: 15 }}>
          <Box component="img" src={img('star.webp')} alt="" width={15} height={15} sx={{ position: 'absolute', inset: 0, opacity: 0.23 }} />
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: i <= rating ? WHITE : 'rgba(255,255,255,0.1)', maskImage: `url(${img('star-mask.webp')})`, WebkitMaskImage: `url(${img('star-mask.webp')})`, maskSize: '100% 100%', WebkitMaskSize: '100% 100%' }} />
        </Box>
      ))}
    </Stack>
  );
}

const sectionPad = { px: { xs: 2.5, md: 6 }, py: { xs: 7, md: 10 } } as const;

export function SplashPage() {
  const [price, setPrice] = useState(DEFAULT_PRICE);
  const [commission, setCommission] = useState(DEFAULT_COMMISSION);
  const { cash, more } = demo(price, commission);
  const agentCash = demo(DEFAULT_PRICE, DEFAULT_COMMISSION).cash;

  return (
    // The splash page always shows the Housa brand look, whatever the theme setting is.
    <Box className="dark" sx={{ bgcolor: DEEP, color: WHITE, overflow: 'hidden', fontSize: '1rem' }}>
      {/* ---------- Hero ---------- */}
      <Box
        component="section"
        aria-labelledby="home-title"
        sx={{
          position: 'relative', minHeight: { xs: 0, md: 742 },
          backgroundImage: `linear-gradient(90deg, rgba(0,45,110,0.6) 0%, rgba(0,45,110,0.25) 55%, rgba(0,45,110,0) 80%), linear-gradient(180deg, rgba(0,45,110,0.55) 0%, rgba(0,45,110,0) 38%), url(${img('hero-house.webp')})`,
          backgroundSize: 'cover', backgroundPosition: { xs: '30% bottom', md: 'center bottom' },
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 1440, pl: { xs: 2.5, md: '85px' }, pr: { xs: 2.5, md: '72px' }, pt: { xs: 3, md: 6 } }}>
          {/* Top bar */}
          <Stack direction="row" alignItems={{ xs: 'center', md: 'flex-start' }} sx={{ columnGap: { xs: 2, md: 0 } }} component="div">
            <Box component={Link} href="/" aria-label="Housa home" sx={{ display: 'block', color: WHITE, flexShrink: 0 }}>
              <Box sx={{ display: { xs: 'none', md: 'block' } }}><Logo height={93} /></Box>
              <Box sx={{ display: { xs: 'block', md: 'none' } }}><Logo height={64} /></Box>
            </Box>
            <Typography sx={{ display: { xs: 'none', md: 'block' }, flex: 1, fontSize: '1.25rem', lineHeight: 1.55, pt: 1.5, ml: '128px' }}>
              Homeowners pay more than $90B in commissions…not for long.
            </Typography>
            <Box sx={{ flex: { xs: 1, md: 'none' } }} />
            <PageButtons sx={{ pt: { md: 2 } }} />
          </Stack>
          <Typography sx={{ display: { xs: 'block', md: 'none' }, mt: 2, fontSize: '1rem', lineHeight: 1.55 }}>
            Homeowners pay more than $90B in commissions…not for long.
          </Typography>

          {/* Headline + phone */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 413px)' }, columnGap: 4, alignItems: 'end', mt: { xs: 5, md: 0 } }}>
            <Typography
              id="home-title" component="h1"
              sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '2.8125rem' }, lineHeight: 1.2, maxWidth: { md: 810 }, pl: { md: '181px' }, alignSelf: { md: 'center' }, pb: { md: 18 }, fontWeight: 400, letterSpacing: '-0.01em' }}
            >
              <Box component="span" sx={heavy}>Housa,</Box> where agents compete to sell your home…<br />
              <Box component="span" sx={heavy}>on your terms.</Box>
            </Typography>
            <Box
              component="img" src={img('phone-hand.webp')} width={756} height={1105}
              alt="A hand holding a phone that lists agents ready to sell 732 Caspian Way, each with their estimated cash at close."
              sx={{ display: 'block', width: { xs: 240, sm: 300, md: 413 }, height: 'auto', justifySelf: { xs: 'center', md: 'end' }, mr: { md: '60px' }, mt: { xs: 4, md: 8 }, mb: { xs: -6, md: -4 } }}
            />
          </Box>
        </Container>
      </Box>

      {/* ---------- Steps 1 and 2, on the sky ---------- */}
      <Box
        id="how-it-works"
        sx={{
          scrollMarginTop: 16,
          backgroundImage: `linear-gradient(180deg, rgba(0,77,171,0.68) 0%, rgba(0,77,171,0.82) 100%), url(${img('sky-texture.webp')})`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
        }}
      >
        {/* Step 1: set price and commission */}
        <Box component="section" aria-labelledby="step-1" sx={{ ...sectionPad, pb: { xs: 4, md: 8 } }}>
          <Container maxWidth={false} sx={{ maxWidth: 1123, px: 0 }}>
            <Box sx={{ bgcolor: NAVY, borderRadius: '5px', p: { xs: 3, md: 6 } }}>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: { xs: 3, md: 5 } }}>
                <StepBadge n={1} />
                <Typography id="step-1" component="h2" sx={{ fontSize: { xs: '1.375rem', md: '1.5rem' }, lineHeight: 1.3, fontWeight: 400 }}>
                  You set price and commission fee
                </Typography>
              </Stack>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, columnGap: 8, rowGap: 5, alignItems: 'center' }}>
                {/* Mini calculator */}
                <Stack spacing={3}>
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', ...heavy, mb: 0.75 }}>Enter your address</Typography>
                    <Box sx={{ bgcolor: tokens.dark.surfaceContainerHighest, borderRadius: '10px', px: 2, py: 1.25, fontSize: '0.875rem' }}>{SAMPLE_ADDRESS}</Box>
                    <Typography sx={{ fontSize: '0.75rem', color: tokens.dark.onSurfaceVariant, mt: 0.75 }}>
                      A sample home. <Link href="/calculator" style={{ color: LIME }}>Try it with yours</Link>
                    </Typography>
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', ...heavy }}>Enter fee details</Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mt: 1 }}>
                      <Typography id="home-price-label" sx={{ fontSize: '0.75rem', color: tokens.dark.onSurfaceVariant }}>Home sale price</Typography>
                      <Typography sx={{ fontSize: '1rem', fontVariantNumeric: 'tabular-nums' }}>{money(price)}</Typography>
                    </Stack>
                    <Slider aria-labelledby="home-price-label" getAriaValueText={money} value={price} min={240_000} max={300_000} step={5_000} onChange={(_, v) => setPrice(v as number)} />
                    <Stack direction="row" justifyContent="space-between" sx={{ fontSize: '0.75rem', color: tokens.dark.onSurfaceVariant, mt: -0.5 }}>
                      <span>{money(240_000)}</span><span>{money(300_000)}</span>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mt: 2 }}>
                      <Typography id="home-commission-label" sx={{ fontSize: '0.75rem', color: tokens.dark.onSurfaceVariant }}>Commission to your agent</Typography>
                      <Typography sx={{ fontSize: '1rem', fontVariantNumeric: 'tabular-nums' }}>{pctText(commission)}</Typography>
                    </Stack>
                    <Slider aria-labelledby="home-commission-label" getAriaValueText={(v) => `${v}%`} value={commission} min={1} max={4} step={0.05} onChange={(_, v) => setCommission(v as number)} />
                    <Stack direction="row" justifyContent="space-between" sx={{ fontSize: '0.75rem', color: tokens.dark.onSurfaceVariant, mt: -0.5 }}>
                      <span>1%</span><span>4%</span>
                    </Stack>
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', ...heavy, mb: 1 }}>Submit it for bids</Typography>
                    <Button component={Link} href="/sell?from=home" variant="outlined" fullWidth sx={{ color: WHITE, borderColor: WHITE, bgcolor: 'rgba(0,0,0,0.09)', '&:hover': { borderColor: WHITE, bgcolor: 'rgba(255,255,255,0.12)' } }}>
                      Create listing
                    </Button>
                  </Box>
                </Stack>

                {/* The answer */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: { xs: '1.0625rem', md: '1.1719rem' }, ...heavy }}>Estimated cash at close</Typography>
                  <Typography component="p" aria-live="polite" sx={{ fontSize: { xs: '3.5rem', sm: '4.75rem', md: '6.328rem' }, lineHeight: 1.05, ...heavy, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', my: 1 }}>
                    {money(cash)}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: '1.0625rem', md: '1.1719rem' }, color: LIME }}>
                    You will earn <Box component="span" sx={heavy}>{money(more)}</Box> more with Housa
                  </Typography>
                </Box>
              </Box>
              <Typography sx={{ mt: 4, fontSize: '0.75rem', lineHeight: 1.6, color: tokens.dark.onSurfaceVariant }}>
                Sample numbers: a {money(SAMPLE_MORTGAGE)} mortgage, about 1% for estimated closing costs, $0 offered to the buyer’s agent. Includes the {money(PLATFORM_FEE)} {PLATFORM_FEE_NAME}. A traditional sale is 6%.
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Step 2: agents compete */}
        <Box component="section" aria-labelledby="step-2" sx={{ pb: { xs: 7, md: 12 }, pt: { xs: 3, md: 4 } }}>
          <Container maxWidth={false} sx={{ maxWidth: 1440, px: { xs: 2.5, md: 0 } }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 801px) minmax(0, 1fr)' }, alignItems: 'center', columnGap: 6, rowGap: 4 }}>
              <Box
                component="img" src={img('tablet-hands.webp')} width={1200} height={759}
                alt="A tablet showing a listing for 732 Caspian Way with an estimated cash at close, held in two hands."
                sx={{ display: 'block', width: '100%', height: 'auto', maxWidth: 801 }}
              />
              <Box sx={{ maxWidth: 459, pr: { md: 4 } }}>
                <Box sx={{ mb: 3 }}><StepBadge n={2} fill={DEEP} /></Box>
                <Typography id="step-2" component="h2" sx={{ fontSize: { xs: '1.375rem', md: '1.5625rem' }, lineHeight: 1.25, fontWeight: 400, letterSpacing: '-0.005em' }}>
                  Our network of agents will review, bid, and compete to sell your home…but <Box component="span" sx={heavy}>you make the final choice.</Box>
                </Typography>
                <Typography sx={{ mt: 3, fontSize: '1.125rem', lineHeight: 1.45 }}>
                  Plus, Housa offers cash-back rewards to our agents who help you get the best deal on your home.
                </Typography>
                <Typography sx={{ mt: 2, fontSize: '1.125rem', ...heavy }}>Win, win!</Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>

      {/* ---------- Step 3: choose and agree ---------- */}
      <Box component="section" aria-labelledby="step-3" sx={{ position: 'relative', ...sectionPad }}>
        <Box aria-hidden sx={{ position: 'absolute', inset: 0, backgroundImage: `url(${img('bedroom.webp')})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.22 }} />
        <Container maxWidth={false} sx={{ position: 'relative', maxWidth: 1100, px: 0 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 588px' }, columnGap: 6, rowGap: 5, alignItems: 'center' }}>
            <Box>
              <Stack direction="row" spacing={2} alignItems="center">
                <StepBadge n={3} />
                <Typography id="step-3" component="h2" sx={{ fontSize: { xs: '1.375rem', md: '1.5625rem' }, lineHeight: 1.3, ...heavy, maxWidth: 266 }}>
                  Select the agent, agree to terms. Done.
                </Typography>
              </Stack>
              <Typography sx={{ mt: 4, fontSize: '1.125rem', lineHeight: 1.45, maxWidth: 396 }}>
                <Box component="span" sx={heavy}>Finally,</Box> a marketplace that allows you to set your terms, agents compete for your home listing, and you maintain control of the entire process.
              </Typography>
              <Typography sx={{ mt: 2.5, fontSize: '1.125rem', ...heavy }}>Sound good? We think so.</Typography>
            </Box>

            {/* Agent card */}
            <Box sx={{ bgcolor: 'rgba(0,0,0,0.7)', borderRadius: '12px', p: { xs: 3, md: 4 } }}>
              <Stack direction="row" spacing={{ xs: 2, md: 3 }} alignItems="flex-start">
                <Box component="img" src={img('agent-avatar.webp')} alt="Valerie Alhmady" width={69} height={72} sx={{ width: 69, height: 72, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography component="p" sx={{ fontSize: { xs: '1.5rem', md: '1.875rem' }, lineHeight: 1.2, color: LIME }}>Valerie Alhmady</Typography>
                  <Typography sx={{ fontSize: '0.9rem', mt: 0.5 }}>Century 21</Typography>
                  <Stars rating={4} />
                </Box>
                <Stack alignItems="flex-end" sx={{ flexShrink: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box component="img" src={img('check-circle.svg')} alt="Selected" width={21} height={21} />
                    <Typography component="p" sx={{ fontSize: { xs: '1.5rem', md: '1.875rem' }, lineHeight: 1.2, ...heavy, fontVariantNumeric: 'tabular-nums' }}>{money(agentCash)}</Typography>
                  </Stack>
                  <Typography sx={{ fontSize: '0.75rem', color: tokens.dark.onSurfaceVariant }}>cash at close</Typography>
                </Stack>
              </Stack>
              <Button component={Link} href="/seller/bids" variant="contained" fullWidth sx={{ mt: 4, mx: 'auto', display: 'flex', maxWidth: 288, bgcolor: BLUE, color: WHITE }}>
                Agree to terms
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ---------- Footer ---------- */}
      <Box
        component="footer"
        sx={{
          ...sectionPad, py: { xs: 6, md: 9 },
          backgroundImage: `linear-gradient(180deg, rgba(0,77,171,0.88) 0%, rgba(0,77,171,0.8) 100%), url(${img('sky-texture.webp')})`,
          backgroundSize: 'cover', backgroundPosition: 'center bottom',
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 960, px: 0 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" spacing={4}>
            <Stack direction="row" spacing={2.5} alignItems="center">
              <Box component="img" src={img('logo-mark-large.svg')} alt="" width={87} height={105} sx={{ width: { xs: 60, md: 87 }, height: 'auto' }} />
              <Box>
                <Typography component="p" sx={{ fontSize: { xs: '2rem', md: '2.2656rem' }, lineHeight: 1, ...heavy, letterSpacing: '-0.05em' }}>housa</Typography>
                <Typography sx={{ fontSize: '0.9375rem', mt: 1 }}>Helping you keep more of what is yours</Typography>
              </Box>
            </Stack>
            <PageButtons />
          </Stack>

          {/* A way around the prototype */}
          <Box component="nav" aria-label="Prototype pages" sx={{ mt: 6, pt: 3, borderTop: '1px solid rgba(255,255,255,0.3)' }}>
            <Typography sx={{ fontSize: '0.8125rem', mb: 1 }}>Prototype pages (dummy data)</Typography>
            <Stack direction="row" useFlexGap flexWrap="wrap" columnGap={3} rowGap={1}>
              {[['/calculator', 'Home value calculator'], ['/v2', 'Home value calculator B'], ['/sell', 'Sell my home'], ['/seller/bids', 'My bids'], ['/agent', 'Agent console'], ['/admin', 'Admin']].map(([href, label]) => (
                <Link key={href} href={href} style={{ color: WHITE, fontSize: '0.875rem', textDecoration: 'underline', textUnderlineOffset: 3 }}>{label}</Link>
              ))}
            </Stack>
            <Typography sx={{ fontSize: '0.75rem', mt: 2.5, lineHeight: 1.6 }}>
              Housa Technologies Inc. is a software platform, not a real estate brokerage. Housa does not set agent fees or act as anyone’s agent. This prototype uses made-up data.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
