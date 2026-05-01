"""Generate SVG mock images for the Porsche Run 5K app.

Produces:
- 9 vehicle SVGs (3 cars x 3 views)  → porsche_run/static/vehicles/
- 1 hero SVG (Santa Barbara coast at sunset, runners + parked Porsches)
- 6 gallery SVGs (event moments)

All output uses the RunClub design system palette (volt, ink, chalk, ember).
"""

from pathlib import Path

# ── Design tokens ──────────────────────────────────────────────
INK    = "#0A0A0A"
CHALK  = "#FFFFFF"
VOLT   = "#D7FF1E"
EMBER  = "#FF3B1F"
SANDY  = "#E8C68A"
SUNSET_TOP    = "#1B1340"
SUNSET_MID    = "#7A2E5A"
SUNSET_BOTTOM = "#FF8C42"
GOLDEN_TOP    = "#3A2D1F"
GOLDEN_BOTTOM = "#F5C74A"
MORNING_TOP   = "#5C8AC4"
MORNING_BOTTOM= "#F5E6D3"
NIGHT_TOP     = "#0A1230"
NIGHT_MID     = "#2A1F4D"
DUSK_TOP      = "#241B40"
DUSK_BOTTOM   = "#D8765F"

ROOT = Path(__file__).resolve().parent.parent / "porsche_run" / "static"


# ── Common SVG helpers ─────────────────────────────────────────

def svg_open(w, h):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
            f'width="{w}" height="{h}" preserveAspectRatio="xMidYMid slice">')


def linear_gradient(gid, stops, x1=0, y1=0, x2=0, y2=1):
    s = f'<linearGradient id="{gid}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}">'
    for off, color in stops:
        s += f'<stop offset="{off}%" stop-color="{color}"/>'
    s += '</linearGradient>'
    return s


def radial_gradient(gid, stops, cx="50%", cy="50%", r="60%"):
    s = f'<radialGradient id="{gid}" cx="{cx}" cy="{cy}" r="{r}">'
    for off, color in stops:
        s += f'<stop offset="{off}%" stop-color="{color}"/>'
    s += '</radialGradient>'
    return s


def hill(y_top, color, w, h, ctrl_y_offset=80):
    return (f'<path d="M0,{h} L0,{y_top + 60} '
            f'Q{w*0.25},{y_top - ctrl_y_offset} {w*0.5},{y_top + 30} '
            f'T{w},{y_top + 80} L{w},{h} Z" fill="{color}"/>')


def sun(cx, cy, r, color):
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}" opacity="0.85"/>'


def label(x, y, txt, size=42, color=CHALK, weight="800", italic=True, anchor="start"):
    style = (
        f'font-family:"Barlow Condensed","Helvetica Neue Condensed",Impact,sans-serif;'
        f'font-weight:{weight};font-style:{"italic" if italic else "normal"};'
        f'font-size:{size}px;letter-spacing:0.01em;text-transform:uppercase'
    )
    return f'<text x="{x}" y="{y}" fill="{color}" text-anchor="{anchor}" style="{style}">{txt}</text>'


def meta_label(x, y, txt, color=CHALK, size=14, anchor="start", opacity=0.8):
    style = (
        f'font-family:"Inter","Helvetica Neue",sans-serif;'
        f'font-weight:500;font-size:{size}px;letter-spacing:0.12em;'
        f'text-transform:uppercase'
    )
    return f'<text x="{x}" y="{y}" fill="{color}" opacity="{opacity}" text-anchor="{anchor}" style="{style}">{txt}</text>'


def grain(w, h, opacity=0.05):
    """Light film-grain noise via repeated tiny circles."""
    import random
    random.seed(42)
    out = '<g opacity="{}">'.format(opacity)
    for _ in range(120):
        x = random.randint(0, w); y = random.randint(0, h)
        r = random.choice([0.6, 0.8, 1.0])
        out += f'<circle cx="{x}" cy="{y}" r="{r}" fill="white"/>'
    out += '</g>'
    return out


# ── Car silhouettes ────────────────────────────────────────────

def car_911_side(cx, cy, scale=1.0, color=INK, accent=VOLT):
    """Classic 911 RS profile — distinctive sloped rear, ducktail spoiler."""
    s = scale
    # body
    body = (
        f'M{cx - 220*s},{cy + 30*s} '
        f'L{cx - 200*s},{cy - 5*s} '
        f'Q{cx - 170*s},{cy - 35*s} {cx - 100*s},{cy - 45*s} '
        f'L{cx - 30*s},{cy - 60*s} '
        f'Q{cx + 40*s},{cy - 70*s} {cx + 110*s},{cy - 55*s} '
        f'L{cx + 175*s},{cy - 35*s} '
        f'Q{cx + 215*s},{cy - 20*s} {cx + 220*s},{cy + 5*s} '
        f'L{cx + 225*s},{cy + 30*s} Z'
    )
    # ducktail spoiler
    spoiler = (
        f'M{cx + 175*s},{cy - 35*s} '
        f'L{cx + 230*s},{cy - 45*s} '
        f'L{cx + 235*s},{cy - 30*s} '
        f'L{cx + 215*s},{cy - 20*s} Z'
    )
    return (
        f'<path d="{body}" fill="{color}" stroke="{accent}" stroke-width="1.5"/>'
        f'<path d="{spoiler}" fill="{color}" stroke="{accent}" stroke-width="1.5"/>'
        # windows
        f'<path d="M{cx - 130*s},{cy - 42*s} Q{cx - 90*s},{cy - 60*s} {cx - 30*s},{cy - 58*s} L{cx + 50*s},{cy - 60*s} Q{cx + 90*s},{cy - 58*s} {cx + 130*s},{cy - 42*s} L{cx + 130*s},{cy - 38*s} L{cx - 130*s},{cy - 38*s} Z" fill="{accent}" opacity="0.25"/>'
        # wheels
        f'<circle cx="{cx - 130*s}" cy="{cy + 35*s}" r="{38*s}" fill="{INK}" stroke="{accent}" stroke-width="2"/>'
        f'<circle cx="{cx - 130*s}" cy="{cy + 35*s}" r="{18*s}" fill="{accent}" opacity="0.4"/>'
        f'<circle cx="{cx + 145*s}" cy="{cy + 35*s}" r="{38*s}" fill="{INK}" stroke="{accent}" stroke-width="2"/>'
        f'<circle cx="{cx + 145*s}" cy="{cy + 35*s}" r="{18*s}" fill="{accent}" opacity="0.4"/>'
        # door line
        f'<line x1="{cx + 5*s}" y1="{cy - 55*s}" x2="{cx + 10*s}" y2="{cy + 5*s}" stroke="{accent}" stroke-width="1.5" opacity="0.6"/>'
    )


def car_356_speedster_side(cx, cy, scale=1.0, color=INK, accent=VOLT):
    """356 Speedster — rounded, low-slung, no roof, cut-down windscreen."""
    s = scale
    body = (
        f'M{cx - 200*s},{cy + 20*s} '
        f'L{cx - 180*s},{cy - 10*s} '
        f'Q{cx - 150*s},{cy - 35*s} {cx - 80*s},{cy - 45*s} '
        f'L{cx + 80*s},{cy - 45*s} '
        f'Q{cx + 150*s},{cy - 35*s} {cx + 195*s},{cy - 5*s} '
        f'L{cx + 205*s},{cy + 20*s} Z'
    )
    # cut-down windscreen
    windscreen = f'M{cx - 50*s},{cy - 45*s} L{cx - 30*s},{cy - 65*s} L{cx + 30*s},{cy - 65*s} L{cx + 50*s},{cy - 45*s} Z'
    return (
        f'<path d="{body}" fill="{color}" stroke="{accent}" stroke-width="1.5"/>'
        f'<path d="{windscreen}" fill="{accent}" opacity="0.25" stroke="{accent}" stroke-width="1"/>'
        # interior hint (visible because no roof)
        f'<rect x="{cx - 60*s}" y="{cy - 45*s}" width="{120*s}" height="{15*s}" fill="{INK}" opacity="0.7"/>'
        # wheels
        f'<circle cx="{cx - 115*s}" cy="{cy + 25*s}" r="{34*s}" fill="{INK}" stroke="{accent}" stroke-width="2"/>'
        f'<circle cx="{cx - 115*s}" cy="{cy + 25*s}" r="{16*s}" fill="{accent}" opacity="0.4"/>'
        f'<circle cx="{cx + 125*s}" cy="{cy + 25*s}" r="{34*s}" fill="{INK}" stroke="{accent}" stroke-width="2"/>'
        f'<circle cx="{cx + 125*s}" cy="{cy + 25*s}" r="{16*s}" fill="{accent}" opacity="0.4"/>'
        # chrome trim accent
        f'<line x1="{cx - 180*s}" y1="{cy - 5*s}" x2="{cx + 195*s}" y2="{cy - 5*s}" stroke="{accent}" stroke-width="1" opacity="0.5"/>'
    )


def car_944_turbo_side(cx, cy, scale=1.0, color=INK, accent=VOLT):
    """944 Turbo — front-engined wedge, pop-up headlights, fastback."""
    s = scale
    body = (
        f'M{cx - 230*s},{cy + 25*s} '
        f'L{cx - 220*s},{cy + 5*s} '
        f'L{cx - 180*s},{cy - 15*s} '
        f'L{cx - 100*s},{cy - 25*s} '
        f'Q{cx - 50*s},{cy - 60*s} {cx + 40*s},{cy - 60*s} '
        f'L{cx + 130*s},{cy - 35*s} '
        f'L{cx + 220*s},{cy - 5*s} '
        f'L{cx + 230*s},{cy + 25*s} Z'
    )
    return (
        f'<path d="{body}" fill="{color}" stroke="{accent}" stroke-width="1.5"/>'
        # rear hatch glass
        f'<path d="M{cx - 50*s},{cy - 55*s} L{cx + 35*s},{cy - 55*s} Q{cx + 100*s},{cy - 55*s} {cx + 125*s},{cy - 35*s} L{cx + 125*s},{cy - 28*s} L{cx - 50*s},{cy - 25*s} Z" fill="{accent}" opacity="0.25"/>'
        # side window
        f'<path d="M{cx - 95*s},{cy - 25*s} L{cx - 55*s},{cy - 50*s} L{cx - 50*s},{cy - 28*s} Z" fill="{accent}" opacity="0.25"/>'
        # wheels
        f'<circle cx="{cx - 140*s}" cy="{cy + 30*s}" r="{36*s}" fill="{INK}" stroke="{accent}" stroke-width="2"/>'
        f'<circle cx="{cx - 140*s}" cy="{cy + 30*s}" r="{17*s}" fill="{accent}" opacity="0.4"/>'
        f'<circle cx="{cx + 155*s}" cy="{cy + 30*s}" r="{36*s}" fill="{INK}" stroke="{accent}" stroke-width="2"/>'
        f'<circle cx="{cx + 155*s}" cy="{cy + 30*s}" r="{17*s}" fill="{accent}" opacity="0.4"/>'
        # turbo badge dot
        f'<circle cx="{cx + 100*s}" cy="{cy + 5*s}" r="{4*s}" fill="{EMBER}"/>'
    )


# ── Front 3/4 view (simpler abstraction) ───────────────────────

def car_front_three_quarter(cx, cy, scale=1.0, color=INK, accent=VOLT, has_spoiler=False):
    s = scale
    # body trapezoid
    body = (
        f'M{cx - 180*s},{cy + 40*s} '
        f'L{cx - 150*s},{cy - 30*s} '
        f'Q{cx - 100*s},{cy - 60*s} {cx + 20*s},{cy - 70*s} '
        f'L{cx + 130*s},{cy - 50*s} '
        f'L{cx + 180*s},{cy - 10*s} '
        f'L{cx + 200*s},{cy + 40*s} Z'
    )
    # windshield
    windshield = f'M{cx - 130*s},{cy - 35*s} Q{cx - 80*s},{cy - 60*s} {cx + 10*s},{cy - 65*s} L{cx + 80*s},{cy - 50*s} L{cx + 60*s},{cy - 25*s} L{cx - 110*s},{cy - 15*s} Z'
    out = f'<path d="{body}" fill="{color}" stroke="{accent}" stroke-width="1.5"/>'
    out += f'<path d="{windshield}" fill="{accent}" opacity="0.25"/>'
    # headlights
    out += f'<circle cx="{cx - 120*s}" cy="{cy + 5*s}" r="{14*s}" fill="{VOLT}" opacity="0.9"/>'
    out += f'<circle cx="{cx - 80*s}" cy="{cy + 0*s}" r="{12*s}" fill="{VOLT}" opacity="0.9"/>'
    # grille
    out += f'<rect x="{cx - 105*s}" y="{cy + 20*s}" width="{60*s}" height="{12*s}" fill="{INK}" stroke="{accent}" stroke-width="1"/>'
    # wheels
    out += f'<ellipse cx="{cx - 110*s}" cy="{cy + 50*s}" rx="{28*s}" ry="{14*s}" fill="{INK}" stroke="{accent}" stroke-width="2"/>'
    out += f'<ellipse cx="{cx + 130*s}" cy="{cy + 50*s}" rx="{28*s}" ry="{14*s}" fill="{INK}" stroke="{accent}" stroke-width="2"/>'
    # ducktail spoiler if 911
    if has_spoiler:
        out += f'<path d="M{cx + 130*s},{cy - 50*s} L{cx + 195*s},{cy - 60*s} L{cx + 200*s},{cy - 40*s} Z" fill="{color}" stroke="{accent}" stroke-width="1.5"/>'
    return out


# ── Interior cockpit view ──────────────────────────────────────

def cockpit_view(w, h, accent=VOLT, era="60s"):
    """Stylized interior dashboard."""
    out = ''
    # dashboard horizon
    out += f'<rect x="0" y="0" width="{w}" height="{h*0.5}" fill="url(#sky)"/>'
    out += f'<rect x="0" y="{h*0.5}" width="{w}" height="{h*0.5}" fill="{INK}"/>'
    # steering wheel (large circle, lower-center)
    out += f'<circle cx="{w*0.5}" cy="{h*0.85}" r="{h*0.28}" fill="none" stroke="{CHALK}" stroke-width="6"/>'
    out += f'<circle cx="{w*0.5}" cy="{h*0.85}" r="{h*0.06}" fill="{accent}"/>'
    # spokes
    out += f'<line x1="{w*0.5}" y1="{h*0.85 - h*0.22}" x2="{w*0.5}" y2="{h*0.85 + h*0.22}" stroke="{CHALK}" stroke-width="5"/>'
    out += f'<line x1="{w*0.5 - h*0.22}" y1="{h*0.85}" x2="{w*0.5 + h*0.22}" y2="{h*0.85}" stroke="{CHALK}" stroke-width="5"/>'
    # gauges (left + right of steering)
    for cx in [w*0.22, w*0.78]:
        out += f'<circle cx="{cx}" cy="{h*0.7}" r="{h*0.12}" fill="{INK}" stroke="{accent}" stroke-width="3"/>'
        out += f'<circle cx="{cx}" cy="{h*0.7}" r="{h*0.02}" fill="{CHALK}"/>'
        # needle
        out += f'<line x1="{cx}" y1="{h*0.7}" x2="{cx + h*0.08}" y2="{h*0.65}" stroke="{accent}" stroke-width="2.5" stroke-linecap="round"/>'
    # windshield top arc
    out += f'<path d="M0,0 Q{w*0.5},{h*0.15} {w},0 L{w},{h*0.45} Q{w*0.5},{h*0.4} 0,{h*0.45} Z" fill="{accent}" opacity="0.15"/>'
    return out


# ── Runner silhouettes (for hero/gallery) ──────────────────────

def runner(cx, cy, h, color, stride_phase=0):
    """Stylized runner figure. h is total height in px."""
    # head
    out = f'<circle cx="{cx}" cy="{cy - h*0.85}" r="{h*0.08}" fill="{color}"/>'
    # body
    out += f'<rect x="{cx - h*0.05}" y="{cy - h*0.78}" width="{h*0.1}" height="{h*0.4}" fill="{color}" rx="{h*0.04}"/>'
    # arms (varied with stride_phase)
    arm_back = stride_phase * 25
    arm_fwd = -stride_phase * 25
    out += f'<line x1="{cx}" y1="{cy - h*0.65}" x2="{cx + h*0.18 + arm_fwd}" y2="{cy - h*0.45 + abs(arm_fwd)*0.5}" stroke="{color}" stroke-width="{h*0.06}" stroke-linecap="round"/>'
    out += f'<line x1="{cx}" y1="{cy - h*0.65}" x2="{cx - h*0.18 + arm_back}" y2="{cy - h*0.45 + abs(arm_back)*0.5}" stroke="{color}" stroke-width="{h*0.06}" stroke-linecap="round"/>'
    # legs (mid-stride)
    leg_fwd = stride_phase * 30
    leg_back = -stride_phase * 30
    out += f'<line x1="{cx}" y1="{cy - h*0.4}" x2="{cx + h*0.15 + leg_fwd*0.5}" y2="{cy - h*0.05}" stroke="{color}" stroke-width="{h*0.07}" stroke-linecap="round"/>'
    out += f'<line x1="{cx}" y1="{cy - h*0.4}" x2="{cx - h*0.15 + leg_back*0.5}" y2="{cy - h*0.05}" stroke="{color}" stroke-width="{h*0.07}" stroke-linecap="round"/>'
    return out


# ── Vehicle SVG generator ──────────────────────────────────────

VEHICLES = [
    ("v1_911_carrera_rs_1973", "1973", "911 RS 2.7",   car_911_side,            True,  SUNSET_TOP, SUNSET_MID, SUNSET_BOTTOM),
    ("v2_356_speedster_1958",  "1958", "356 SPEEDSTER", car_356_speedster_side,  False, MORNING_TOP, MORNING_TOP, MORNING_BOTTOM),
    ("v3_944_turbo_1986",      "1986", "944 TURBO",     car_944_turbo_side,      False, NIGHT_TOP, NIGHT_MID, EMBER),
]

def make_vehicle_svgs():
    W, H = 800, 533
    for vid, year, model, side_fn, has_spoiler, c1, c2, c3 in VEHICLES:
        # ── exterior_side ──
        s = svg_open(W, H)
        s += '<defs>'
        s += linear_gradient("sky", [(0, c1), (60, c2), (100, c3)])
        s += linear_gradient("road", [(0, "#2A2620"), (100, INK)])
        s += '</defs>'
        s += f'<rect width="{W}" height="{H}" fill="url(#sky)"/>'
        # mountains
        s += f'<polygon points="0,{H*0.65} 200,{H*0.45} 380,{H*0.55} 600,{H*0.4} 800,{H*0.55} 800,{H*0.7} 0,{H*0.7}" fill="{INK}" opacity="0.55"/>'
        s += f'<polygon points="0,{H*0.7} 250,{H*0.55} 500,{H*0.65} 800,{H*0.55} 800,{H*0.78} 0,{H*0.78}" fill="{INK}" opacity="0.75"/>'
        # road
        s += f'<rect x="0" y="{H*0.78}" width="{W}" height="{H*0.22}" fill="url(#road)"/>'
        # road dashes
        for x in range(40, W, 100):
            s += f'<rect x="{x}" y="{H*0.88}" width="50" height="3" fill="{VOLT}" opacity="0.7"/>'
        # car
        s += side_fn(W*0.5, H*0.72, scale=1.0)
        # text overlays
        s += f'<rect x="0" y="0" width="{W}" height="80" fill="{INK}" opacity="0.4"/>'
        s += label(40, 50, year, size=42, color=VOLT)
        s += label(120, 50, model, size=42, color=CHALK)
        s += meta_label(40, 75, "exterior · side", color=CHALK, opacity=0.6)
        s += grain(W, H)
        s += '</svg>'
        (ROOT / "vehicles" / vid / "exterior_side.svg").write_text(s)

        # ── exterior_front ──
        s = svg_open(W, H)
        s += '<defs>'
        s += linear_gradient("sky2", [(0, c1), (50, c2), (100, c3)])
        s += radial_gradient("glow", [(0, VOLT), (40, "#00000000")], cx="50%", cy="100%", r="70%")
        s += '</defs>'
        s += f'<rect width="{W}" height="{H}" fill="url(#sky2)"/>'
        s += f'<rect width="{W}" height="{H}" fill="url(#glow)" opacity="0.3"/>'
        # ground
        s += f'<rect x="0" y="{H*0.78}" width="{W}" height="{H*0.22}" fill="{INK}"/>'
        # car (front 3/4)
        s += car_front_three_quarter(W*0.5, H*0.6, scale=1.0, has_spoiler=has_spoiler)
        # text
        s += f'<rect x="0" y="0" width="{W}" height="80" fill="{INK}" opacity="0.4"/>'
        s += label(40, 50, year, size=42, color=VOLT)
        s += label(120, 50, model, size=42, color=CHALK)
        s += meta_label(40, 75, "exterior · front 3/4", color=CHALK, opacity=0.6)
        s += grain(W, H)
        s += '</svg>'
        (ROOT / "vehicles" / vid / "exterior_front.svg").write_text(s)

        # ── interior ──
        s = svg_open(W, H)
        s += '<defs>'
        s += linear_gradient("sky", [(0, c1), (100, c3)])
        s += '</defs>'
        s += cockpit_view(W, H)
        s += f'<rect x="0" y="0" width="{W}" height="80" fill="{INK}" opacity="0.4"/>'
        s += label(40, 50, year, size=42, color=VOLT)
        s += label(120, 50, model, size=42, color=CHALK)
        s += meta_label(40, 75, "interior · cockpit", color=CHALK, opacity=0.6)
        s += grain(W, H)
        s += '</svg>'
        (ROOT / "vehicles" / vid / "interior.svg").write_text(s)


# ── Hero image generator ───────────────────────────────────────

def make_hero():
    W, H = 1600, 900
    s = svg_open(W, H)
    s += '<defs>'
    s += linear_gradient("herosky", [(0, SUNSET_TOP), (40, SUNSET_MID), (100, SUNSET_BOTTOM)])
    s += linear_gradient("herohills_far", [(0, "#3A1F4A"), (100, "#1A0F2A")])
    s += linear_gradient("herohills_mid", [(0, "#1F1530"), (100, INK)])
    s += linear_gradient("heroroad", [(0, "#2A2620"), (100, INK)])
    s += radial_gradient("herosun", [(0, "#FFD96B"), (40, "#FF8C42"), (100, "#7A2E5A00")], cx="78%", cy="42%", r="20%")
    s += '</defs>'

    # sky
    s += f'<rect width="{W}" height="{H}" fill="url(#herosky)"/>'
    # sun glow
    s += f'<rect width="{W}" height="{H}" fill="url(#herosun)"/>'
    s += f'<circle cx="{W*0.78}" cy="{H*0.42}" r="50" fill="#FFE69C" opacity="0.95"/>'

    # far hills
    s += f'<polygon points="0,{H*0.55} 200,{H*0.45} 450,{H*0.52} 700,{H*0.4} 1000,{H*0.5} 1300,{H*0.4} 1600,{H*0.5} 1600,{H*0.6} 0,{H*0.6}" fill="url(#herohills_far)"/>'
    # mid hills
    s += f'<polygon points="0,{H*0.65} 250,{H*0.55} 500,{H*0.62} 800,{H*0.5} 1100,{H*0.6} 1400,{H*0.55} 1600,{H*0.62} 1600,{H*0.72} 0,{H*0.72}" fill="url(#herohills_mid)"/>'

    # ocean strip (hint of Pacific in distance)
    s += f'<rect x="0" y="{H*0.55}" width="{W}" height="6" fill="#FFB773" opacity="0.4"/>'

    # vineyard rows on hill (golden hour)
    for i in range(8):
        y = H*0.72 + i*4
        s += f'<line x1="0" y1="{y}" x2="{W}" y2="{y - 8}" stroke="{GOLDEN_BOTTOM}" stroke-width="1" opacity="{0.15 + i*0.02}"/>'

    # road foreground (curving toward viewer)
    s += f'<polygon points="0,{H} 600,{H*0.78} 1000,{H*0.78} 1600,{H} " fill="url(#heroroad)"/>'
    # center line
    for i in range(0, 8):
        y = H*0.82 + i*15
        x_off = i*20
        w = 60 + i*15
        s += f'<rect x="{W*0.5 - w/2 - x_off*0.3}" y="{y}" width="{w}" height="{2 + i*0.4}" fill="{VOLT}" opacity="{0.5 + i*0.05}"/>'

    # parked vintage cars on roadside (3 cars at midground, getting smaller into distance)
    s += car_911_side(W*0.18, H*0.78, scale=0.55, color=INK, accent=VOLT)
    s += car_356_speedster_side(W*0.83, H*0.78, scale=0.5, color=INK, accent=VOLT)
    s += car_944_turbo_side(W*0.07, H*0.7, scale=0.32, color=INK, accent=VOLT)

    # runners on road (varied skin tones for diversity, varied stride phases)
    runners_data = [
        (W*0.32, H*0.92, 130, "#5C3A1E", 1.0),    # foreground runner
        (W*0.42, H*0.93, 125, "#A87045", -1.0),
        (W*0.52, H*0.91, 135, "#3A2818", 0.8),
        (W*0.61, H*0.92, 128, "#D9A57E", -0.7),
        (W*0.70, H*0.90, 120, "#7A4F32", 0.9),
        # midground (smaller)
        (W*0.4, H*0.82, 70, "#8B5A3C", 0.6),
        (W*0.5, H*0.82, 72, "#C8956A", -0.6),
        (W*0.58, H*0.81, 70, "#5A3820", 0.7),
        # distance
        (W*0.45, H*0.76, 35, "#9C6E47", 0.4),
        (W*0.52, H*0.755, 33, "#6B4628", -0.4),
    ]
    for cx, cy, hh, color, sp in runners_data:
        s += runner(cx, cy, hh, color, stride_phase=sp)

    # bottom dark gradient for legibility
    s += f'<rect x="0" y="{H*0.62}" width="{W}" height="{H*0.38}" fill="black" opacity="0.15"/>'

    # text overlay
    s += meta_label(60, 80, "Recap · Inaugural Year · 2025", color=VOLT, size=18)
    style_mega = (
        'font-family:"Barlow Condensed","Helvetica Neue Condensed",Impact,sans-serif;'
        'font-weight:800;font-style:italic;font-size:140px;line-height:0.9;'
        'letter-spacing:-0.01em;text-transform:uppercase'
    )
    s += f'<text x="60" y="240" fill="{CHALK}" style="{style_mega}">PORSCHE</text>'
    s += f'<text x="60" y="370" fill="{CHALK}" style="{style_mega}">RUN <tspan fill="{VOLT}">2025</tspan></text>'
    s += meta_label(60, 420, "Santa Barbara · Highway 154 · Sunset finish", color=CHALK, size=18)

    # bottom strip
    s += f'<rect x="0" y="{H - 40}" width="{W}" height="6" fill="{VOLT}"/>'
    s += meta_label(60, H - 14, "5K · Vintage Porsche Drive · Vineyard Tasting", color=CHALK, size=14, opacity=0.7)
    s += meta_label(W - 60, H - 14, "Photos · Class of 2025", color=CHALK, size=14, opacity=0.7, anchor="end")

    s += grain(W, H)
    s += '</svg>'
    (ROOT / "event" / "hero_2025.svg").write_text(s)


# ── Gallery thumbnails ─────────────────────────────────────────

GALLERY_SCENES = [
    {
        "id": "01_start_line",
        "label": "START LINE",
        "sublabel": "7:00 AM · Highway 154",
        "scene": "start_line",
    },
    {
        "id": "02_coastal_climb",
        "label": "MILE 2",
        "sublabel": "Coastal climb",
        "scene": "coastal_run",
    },
    {
        "id": "03_porsches_parked",
        "label": "ROADSIDE",
        "sublabel": "Porsches at El Capitan",
        "scene": "cars_parked",
    },
    {
        "id": "04_finish_line",
        "label": "FINISH",
        "sublabel": "Crossing the line",
        "scene": "finish",
    },
    {
        "id": "05_vineyard_tasting",
        "label": "VINEYARD",
        "sublabel": "Sunset tasting · Ridgeline",
        "scene": "vineyard",
    },
    {
        "id": "06_class_of_2025",
        "label": "CLASS OF 2025",
        "sublabel": "Group photo · Highway 154",
        "scene": "group_photo",
    },
]


def gallery_scene_svg(scene, w, h):
    """Return the inner SVG content (no outer <svg>) for a gallery scene."""
    out = '<defs>'

    if scene == "start_line":
        out += linear_gradient("bg", [(0, "#1a2a44"), (60, "#3d5582"), (100, "#f5b87a")])
        out += '</defs>'
        out += f'<rect width="{w}" height="{h}" fill="url(#bg)"/>'
        # sun rising behind hills
        out += f'<circle cx="{w*0.7}" cy="{h*0.45}" r="40" fill="#FFE69C"/>'
        out += f'<polygon points="0,{h*0.55} 200,{h*0.45} 400,{h*0.5} 600,{h*0.42} {w},{h*0.5} {w},{h*0.65} 0,{h*0.65}" fill="{INK}" opacity="0.6"/>'
        # crowd of runners (many tiny figures)
        crowd_colors = ["#5C3A1E", "#A87045", "#3A2818", "#D9A57E", "#7A4F32", "#8B5A3C", "#C8956A", "#5A3820"]
        import random
        random.seed(1)
        for i in range(28):
            x = random.randint(20, w - 20)
            y = h*0.78 + random.randint(-8, 12)
            hh = random.randint(40, 70)
            color = random.choice(crowd_colors)
            sp = random.choice([-1, -0.5, 0.5, 1])
            out += runner(x, y, hh, color, stride_phase=sp)
        # start banner
        out += f'<rect x="{w*0.1}" y="{h*0.58}" width="{w*0.8}" height="6" fill="{VOLT}"/>'
        out += f'<text x="{w*0.5}" y="{h*0.56}" fill="{VOLT}" text-anchor="middle" style="font-family:Barlow Condensed,Impact,sans-serif;font-weight:800;font-style:italic;font-size:18px;letter-spacing:0.1em">START</text>'

    elif scene == "coastal_run":
        out += linear_gradient("bg", [(0, "#5C8AC4"), (50, "#8FC2E8"), (100, "#3D6BA0")])
        out += '</defs>'
        out += f'<rect width="{w}" height="{h}" fill="url(#bg)"/>'
        # ocean
        out += f'<rect x="0" y="{h*0.55}" width="{w}" height="{h*0.25}" fill="#2A5A8A"/>'
        # ocean texture
        for i in range(8):
            y = h*0.58 + i*8
            out += f'<line x1="0" y1="{y}" x2="{w}" y2="{y + 2}" stroke="#FFFFFF" stroke-width="1" opacity="0.2"/>'
        # cliff edge
        out += f'<polygon points="0,{h*0.55} 0,{h} {w*0.6},{h} {w*0.7},{h*0.6} {w},{h*0.55} {w},{h} 0,{h}" fill="#7A5A3C" opacity="0.85"/>'
        # road
        out += f'<polygon points="0,{h*0.85} {w},{h*0.78} {w},{h*0.82} 0,{h*0.9}" fill="{INK}"/>'
        # runners on cliff road
        runners_data = [
            (w*0.2, h*0.86, 65, "#5C3A1E", 1),
            (w*0.4, h*0.84, 60, "#C8956A", -1),
            (w*0.6, h*0.82, 55, "#3A2818", 0.8),
            (w*0.8, h*0.8, 50, "#A87045", -0.6),
        ]
        for cx, cy, hh, color, sp in runners_data:
            out += runner(cx, cy, hh, color, stride_phase=sp)

    elif scene == "cars_parked":
        out += linear_gradient("bg", [(0, "#3A2D1F"), (70, "#A87045"), (100, "#F5C74A")])
        out += '</defs>'
        out += f'<rect width="{w}" height="{h}" fill="url(#bg)"/>'
        # sun low
        out += f'<circle cx="{w*0.85}" cy="{h*0.55}" r="35" fill="#FFE69C" opacity="0.9"/>'
        # hills
        out += f'<polygon points="0,{h*0.65} 250,{h*0.5} 500,{h*0.6} {w},{h*0.55} {w},{h*0.75} 0,{h*0.75}" fill="{INK}" opacity="0.6"/>'
        # roadside grass strip
        out += f'<rect x="0" y="{h*0.75}" width="{w}" height="{h*0.1}" fill="#5C4A2E"/>'
        # road
        out += f'<rect x="0" y="{h*0.85}" width="{w}" height="{h*0.15}" fill="{INK}"/>'
        # 3 cars in a row
        out += car_911_side(w*0.22, h*0.8, scale=0.32)
        out += car_356_speedster_side(w*0.55, h*0.8, scale=0.3)
        out += car_944_turbo_side(w*0.85, h*0.79, scale=0.28)

    elif scene == "finish":
        out += linear_gradient("bg", [(0, "#241B40"), (50, "#7A2E5A"), (100, "#FF8C42")])
        out += '</defs>'
        out += f'<rect width="{w}" height="{h}" fill="url(#bg)"/>'
        # finish arch
        out += f'<rect x="{w*0.15}" y="{h*0.35}" width="6" height="{h*0.4}" fill="{VOLT}"/>'
        out += f'<rect x="{w*0.85 - 6}" y="{h*0.35}" width="6" height="{h*0.4}" fill="{VOLT}"/>'
        out += f'<rect x="{w*0.15}" y="{h*0.35}" width="{w*0.7}" height="6" fill="{VOLT}"/>'
        out += f'<text x="{w*0.5}" y="{h*0.46}" fill="{INK}" text-anchor="middle" style="font-family:Barlow Condensed,Impact,sans-serif;font-weight:800;font-style:italic;font-size:32px;letter-spacing:0.05em">FINISH</text>'
        # banner
        out += f'<rect x="{w*0.15}" y="{h*0.42}" width="{w*0.7}" height="22" fill="{VOLT}" opacity="0.2"/>'
        # ground
        out += f'<rect x="0" y="{h*0.75}" width="{w}" height="{h*0.25}" fill="{INK}"/>'
        # crossing runner (large, arms up)
        cx, cy = w*0.5, h*0.92
        hh = 130
        out += f'<circle cx="{cx}" cy="{cy - hh*0.85}" r="{hh*0.08}" fill="#A87045"/>'
        out += f'<rect x="{cx - hh*0.06}" y="{cy - hh*0.78}" width="{hh*0.12}" height="{hh*0.4}" fill="#A87045" rx="{hh*0.04}"/>'
        # arms raised in victory
        out += f'<line x1="{cx}" y1="{cy - hh*0.7}" x2="{cx + hh*0.25}" y2="{cy - hh*1.0}" stroke="#A87045" stroke-width="{hh*0.07}" stroke-linecap="round"/>'
        out += f'<line x1="{cx}" y1="{cy - hh*0.7}" x2="{cx - hh*0.25}" y2="{cy - hh*1.0}" stroke="#A87045" stroke-width="{hh*0.07}" stroke-linecap="round"/>'
        # legs
        out += f'<line x1="{cx}" y1="{cy - hh*0.4}" x2="{cx + hh*0.18}" y2="{cy - hh*0.05}" stroke="#A87045" stroke-width="{hh*0.07}" stroke-linecap="round"/>'
        out += f'<line x1="{cx}" y1="{cy - hh*0.4}" x2="{cx - hh*0.18}" y2="{cy - hh*0.05}" stroke="#A87045" stroke-width="{hh*0.07}" stroke-linecap="round"/>'
        # cheering crowd silhouettes
        for i, x in enumerate([w*0.1, w*0.18, w*0.25, w*0.75, w*0.82, w*0.9]):
            colors = ["#5C3A1E", "#3A2818", "#7A4F32", "#D9A57E", "#5A3820", "#C8956A"]
            out += runner(x, h*0.93, 45, colors[i % len(colors)], stride_phase=0.2)

    elif scene == "vineyard":
        out += linear_gradient("bg", [(0, "#2A1F4D"), (60, "#7A2E5A"), (100, "#F5C74A")])
        out += '</defs>'
        out += f'<rect width="{w}" height="{h}" fill="url(#bg)"/>'
        # sun
        out += f'<circle cx="{w*0.5}" cy="{h*0.5}" r="50" fill="#FFE69C" opacity="0.85"/>'
        # vineyard rows
        out += f'<polygon points="0,{h*0.6} {w},{h*0.55} {w},{h} 0,{h}" fill="#3A2818"/>'
        for i in range(12):
            y = h*0.6 + i*8
            out += f'<line x1="0" y1="{y}" x2="{w}" y2="{y - 4}" stroke="#7A5A3C" stroke-width="1.5" opacity="{0.4 + i*0.04}"/>'
        # wine glass silhouettes (people raising glasses)
        glass_data = [
            (w*0.2, h*0.78, "#A87045"),
            (w*0.4, h*0.78, "#5C3A1E"),
            (w*0.6, h*0.78, "#D9A57E"),
            (w*0.8, h*0.78, "#7A4F32"),
        ]
        for gx, gy, color in glass_data:
            # body
            out += f'<rect x="{gx - 12}" y="{gy}" width="24" height="40" fill="{color}" rx="4"/>'
            # head
            out += f'<circle cx="{gx}" cy="{gy - 8}" r="8" fill="{color}"/>'
            # arm holding glass up
            out += f'<line x1="{gx}" y1="{gy + 5}" x2="{gx + 18}" y2="{gy - 25}" stroke="{color}" stroke-width="5" stroke-linecap="round"/>'
            # wine glass
            out += f'<polygon points="{gx + 13},{gy - 30} {gx + 23},{gy - 30} {gx + 21},{gy - 22} {gx + 15},{gy - 22}" fill="{EMBER}" opacity="0.85"/>'
            out += f'<line x1="{gx + 18}" y1="{gy - 22}" x2="{gx + 18}" y2="{gy - 12}" stroke="{color}" stroke-width="1.5"/>'

    elif scene == "group_photo":
        out += linear_gradient("bg", [(0, "#1B1340"), (50, "#7A2E5A"), (100, "#FF8C42")])
        out += '</defs>'
        out += f'<rect width="{w}" height="{h}" fill="url(#bg)"/>'
        # sun
        out += f'<circle cx="{w*0.85}" cy="{h*0.4}" r="35" fill="#FFE69C" opacity="0.9"/>'
        # hills
        out += f'<polygon points="0,{h*0.55} 300,{h*0.45} {w},{h*0.5} {w},{h*0.7} 0,{h*0.7}" fill="{INK}" opacity="0.6"/>'
        # ground
        out += f'<rect x="0" y="{h*0.7}" width="{w}" height="{h*0.3}" fill="{INK}"/>'
        # one car behind group
        out += car_911_side(w*0.5, h*0.75, scale=0.35)
        # row of people standing (group photo)
        person_colors = ["#5C3A1E", "#A87045", "#3A2818", "#D9A57E", "#7A4F32", "#8B5A3C", "#C8956A", "#5A3820", "#9C6E47"]
        positions = [w*0.1, w*0.2, w*0.3, w*0.4, w*0.5, w*0.6, w*0.7, w*0.8, w*0.9]
        import random
        random.seed(2)
        for i, x in enumerate(positions):
            color = person_colors[i % len(person_colors)]
            y_off = random.randint(-8, 4)
            # body
            out += f'<rect x="{x - 10}" y="{h*0.85 + y_off}" width="20" height="42" fill="{color}" rx="3"/>'
            # head
            out += f'<circle cx="{x}" cy="{h*0.83 + y_off}" r="9" fill="{color}"/>'
            # arms (some over shoulders)
            if i > 0 and random.random() < 0.5:
                out += f'<line x1="{x - 10}" y1="{h*0.87 + y_off}" x2="{positions[i-1] + 10}" y2="{h*0.83 + y_off - 5}" stroke="{color}" stroke-width="3"/>'
        out += f'<text x="{w*0.5}" y="{h*0.42}" fill="{VOLT}" text-anchor="middle" style="font-family:Barlow Condensed,Impact,sans-serif;font-weight:800;font-style:italic;font-size:36px;letter-spacing:0.05em">CLASS OF 2025</text>'

    return out


def make_gallery():
    W, H = 600, 400
    for scene in GALLERY_SCENES:
        s = svg_open(W, H)
        s += gallery_scene_svg(scene["scene"], W, H)
        # bottom label bar
        s += f'<rect x="0" y="{H - 60}" width="{W}" height="60" fill="{INK}" opacity="0.55"/>'
        s += f'<rect x="0" y="{H - 60}" width="6" height="60" fill="{VOLT}"/>'
        s += label(20, H - 28, scene["label"], size=22, color=CHALK)
        s += meta_label(20, H - 12, scene["sublabel"], color=CHALK, opacity=0.7, size=11)
        s += grain(W, H)
        s += '</svg>'
        (ROOT / "gallery" / f"{scene['id']}.svg").write_text(s)


# ── Main ───────────────────────────────────────────────────────

if __name__ == "__main__":
    print("Generating vehicle SVGs…")
    make_vehicle_svgs()
    print("Generating hero SVG…")
    make_hero()
    print("Generating gallery SVGs…")
    make_gallery()
    print("Done.")
