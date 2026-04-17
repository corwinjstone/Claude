import { useMemo, useState } from 'react'
import './App.css'

// Figma asset URLs (valid ~7 days from fetch time)
const ASSETS = {
  housaLogo: 'https://www.figma.com/api/mcp/asset/ed3a9cc7-3c00-47c8-bf88-d4ae69eb3b48',
  valerie: 'https://www.figma.com/api/mcp/asset/c79fac32-66eb-45db-8c01-1cd7bc38a78f',
  marcus: 'https://www.figma.com/api/mcp/asset/f151154a-ca10-49a3-abde-9579cccc0389',
  cheryl: 'https://www.figma.com/api/mcp/asset/c870a7c0-07b9-482a-a54e-44b7111bc08a',
  tom: 'https://www.figma.com/api/mcp/asset/8cab1df2-1c65-42e7-8dd2-6300747a6b66',
  marleen: 'https://www.figma.com/api/mcp/asset/8922acbd-af5e-4a7f-94a1-7cdc24ba13fe',
  sara: 'https://www.figma.com/api/mcp/asset/e42e90fc-80a4-4cec-b8b2-b8d3b676f1bf',
  alli: 'https://www.figma.com/api/mcp/asset/d468905d-de85-45f1-95fb-403d3c45f6ad',
}

const GOAL = 29375

const agents = [
  {
    id: 1,
    name: 'Valerie Alhmady',
    company: 'Century 21',
    photo: ASSETS.valerie,
    rating: 5,
    homePrice: '$250,000',
    fee: '2.25% fee',
    commission: '$5,625',
    cashAtClose: 29735,
    cashAtCloseLabel: '$29,735',
    hasDealIcon: false,
    dealMatch: false,
    featured: true,
  },
  {
    id: 2,
    name: 'Marcus Thompson',
    company: 'Colliers International',
    photo: ASSETS.marcus,
    rating: 4,
    homePrice: '$240,500',
    fee: '2.25% fee',
    commission: '$5,411',
    cashAtClose: 20089,
    cashAtCloseLabel: '$20,089',
    hasDealIcon: true,
    dealMatch: false,
    featured: false,
  },
  {
    id: 3,
    name: 'Cheryl Brown',
    company: 'Remax',
    photo: ASSETS.cheryl,
    rating: 5,
    homePrice: '$250,000',
    fee: '2.25% fee',
    commission: '$5,625',
    cashAtClose: 29375,
    cashAtCloseLabel: '$29,375',
    hasDealIcon: false,
    dealMatch: true,
    featured: true,
  },
  {
    id: 4,
    name: 'Tom Fredericks',
    company: 'New Home Realtors',
    photo: ASSETS.tom,
    rating: 4,
    homePrice: '$260,750',
    fee: '2% fee',
    commission: '$5,215',
    cashAtClose: 40535,
    cashAtCloseLabel: '$40,535',
    hasDealIcon: true,
    dealMatch: false,
    featured: false,
  },
  {
    id: 5,
    name: 'Marleen Beckett',
    company: 'First Touch',
    photo: ASSETS.marleen,
    rating: 4,
    homePrice: '$240,500',
    fee: '2.25% fee',
    commission: '$5,411',
    cashAtClose: 20089,
    cashAtCloseLabel: '$20,089',
    hasDealIcon: false,
    dealMatch: false,
    featured: false,
  },
  {
    id: 6,
    name: 'Sara Washington',
    company: 'Century 21 Prime',
    photo: ASSETS.sara,
    rating: 3,
    homePrice: '$250,000',
    fee: '3% fee',
    commission: '$7,500',
    cashAtClose: 27500,
    cashAtCloseLabel: '$27,500',
    hasDealIcon: true,
    dealMatch: false,
    featured: false,
  },
  {
    id: 7,
    name: 'Alli Tang',
    company: 'Sothby Dallas',
    photo: ASSETS.alli,
    rating: 3,
    homePrice: '$260,000',
    fee: '3% fee',
    commission: '$7,800',
    cashAtClose: 37200,
    cashAtCloseLabel: '$37,200',
    hasDealIcon: false,
    dealMatch: false,
    featured: false,
  },
]

const sortOptions = ['Agent', 'Ratings', 'Cash at close', 'Commission', 'Home price']

const NAV_LINKS = ['Buy a home', 'Sell my home', 'Browse home listings', 'How this works', 'Resources']

function StarRating({ rating, max = 5 }) {
  return (
    <div className="flex gap-[3px] items-center">
      {Array.from({ length: max }, (_, i) => {
        const filled = i < rating
        return (
          <svg
            key={i}
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill={filled ? '#ffffff' : 'rgba(255,255,255,0.15)'}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M6.5 0.5l1.85 3.75 4.15.6-3 2.92.7 4.13-3.7-1.95-3.7 1.95.7-4.13-3-2.92 4.15-.6z" />
          </svg>
        )
      })}
    </div>
  )
}

function CheckBadge({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <circle cx="12" cy="12" r="12" fill="#478fff" />
      <path
        d="M6.5 12.2l3.6 3.6L17.8 8.1"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

function DealIcon() {
  // Small green "deal" chain/tag icon that sits next to agent name
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <path
        d="M8.5 11.5l-2 2a2.5 2.5 0 11-3.5-3.5l2.5-2.5a2.5 2.5 0 013.5 0M11.5 8.5l2-2a2.5 2.5 0 113.5 3.5l-2.5 2.5a2.5 2.5 0 01-3.5 0M7.8 12.2l4.4-4.4"
        stroke="#85ff00"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

function TrendArrow({ direction }) {
  // Green up triangle, muted yellow down triangle
  const color = direction === 'up' ? '#85ff00' : '#f5c24a'
  const rotate = direction === 'up' ? 0 : 180
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotate}deg)`, display: 'block' }}
      aria-hidden="true"
    >
      <path d="M6 1l5 9H1z" fill={color} />
    </svg>
  )
}

function HousaLogo() {
  return (
    <div className="flex flex-col items-center flex-shrink-0" style={{ width: 53 }}>
      <svg
        width="46"
        height="56"
        viewBox="0 0 46 56"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Stylized house "H" mark — approximates the housa logo glyph */}
        <path
          d="M23 2L3 14v36h14V34h12v16h14V14L23 2z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M17 22h12v4H17z" fill="#ffffff" />
      </svg>
      <p
        style={{
          color: '#fff',
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: '-1px',
          marginTop: 6,
          lineHeight: 1,
        }}
      >
        housa
      </p>
    </div>
  )
}

function AgentRow({ agent }) {
  const meetsGoal = agent.cashAtClose >= GOAL
  const direction = agent.cashAtClose >= GOAL ? 'up' : 'down'
  const rowOpacity = agent.featured ? 1 : 0.55

  return (
    <div
      className="relative flex items-center rounded-[8px] mb-[10px]"
      style={{
        backgroundColor: '#000',
        minHeight: 101,
        paddingLeft: 94,
        paddingRight: 28,
        opacity: rowOpacity,
      }}
    >
      {/* Agent photo — overlaps the rounded black bar on the left */}
      <div
        className="absolute"
        style={{
          left: 24,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 60,
          height: 60,
        }}
      >
        <img
          src={agent.photo}
          alt={agent.name}
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        {agent.dealMatch && (
          <div
            className="absolute"
            style={{
              top: -6,
              left: -8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 2,
            }}
          >
            <CheckBadge size={22} />
            <span
              style={{
                color: '#478fff',
                fontSize: 9,
                fontWeight: 800,
                marginTop: 2,
                whiteSpace: 'nowrap',
                textShadow: '0 0 2px #000',
              }}
            >
              Deal match
            </span>
          </div>
        )}
      </div>

      {/* Name + company + stars */}
      <div style={{ minWidth: 260, flexShrink: 0 }}>
        <div className="flex items-center gap-2">
          <p
            style={{
              color: '#85ff00',
              fontSize: 24,
              fontWeight: 800,
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {agent.name}
          </p>
          {agent.hasDealIcon && <DealIcon />}
        </div>
        <div className="flex items-center gap-2 mt-[4px]">
          <p style={{ color: '#fff', fontSize: 12, margin: 0 }}>{agent.company}</p>
          <StarRating rating={agent.rating} />
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Home price + commission block */}
      <div style={{ textAlign: 'right', marginRight: 24, minWidth: 110 }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0, lineHeight: 1.4 }}>
          Home price
        </p>
        <p style={{ color: '#fff', fontSize: 16, margin: 0, lineHeight: 1.4 }}>{agent.homePrice}</p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0, lineHeight: 1.4 }}>
          {agent.fee}
        </p>
        <p style={{ color: '#fff', fontSize: 16, margin: 0, lineHeight: 1.4 }}>{agent.commission}</p>
      </div>

      {/* Trend arrow OR goal-meet check */}
      <div
        style={{
          width: 28,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        }}
      >
        {meetsGoal ? <CheckBadge size={24} /> : <TrendArrow direction={direction} />}
      </div>

      {/* Cash at close */}
      <div style={{ minWidth: 180, textAlign: 'right' }}>
        <p
          style={{
            color: '#fff',
            fontSize: 40,
            fontWeight: 800,
            lineHeight: 1,
            margin: 0,
            letterSpacing: '-0.5px',
          }}
        >
          {agent.cashAtCloseLabel}
        </p>
      </div>
    </div>
  )
}

function RadioOption({ label, checked, onClick }) {
  return (
    <label
      onClick={onClick}
      className="flex items-center gap-3 cursor-pointer select-none"
      style={{ padding: '6px 0' }}
    >
      <span
        style={{
          display: 'inline-flex',
          width: 21,
          height: 21,
          borderRadius: '50%',
          border: checked ? '2px solid #ffffff' : '2px solid rgba(255,255,255,0.55)',
          background: checked ? '#ffffff' : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {checked && (
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: '#004dab',
            }}
          />
        )}
      </span>
      <span style={{ color: '#fff', fontSize: 12, fontWeight: 800 }}>{label}</span>
    </label>
  )
}

export default function App() {
  const [sortBy, setSortBy] = useState('Ratings')
  const [activeLink, setActiveLink] = useState('Sell my home')

  const sortedAgents = useMemo(() => {
    const copy = [...agents]
    switch (sortBy) {
      case 'Agent':
        copy.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'Ratings':
        copy.sort((a, b) => b.rating - a.rating)
        break
      case 'Cash at close':
        copy.sort((a, b) => b.cashAtClose - a.cashAtClose)
        break
      case 'Commission':
        copy.sort(
          (a, b) =>
            Number(b.commission.replace(/[^0-9]/g, '')) -
            Number(a.commission.replace(/[^0-9]/g, '')),
        )
        break
      case 'Home price':
        copy.sort(
          (a, b) =>
            Number(b.homePrice.replace(/[^0-9]/g, '')) -
            Number(a.homePrice.replace(/[^0-9]/g, '')),
        )
        break
      default:
        break
    }
    return copy
  }, [sortBy])

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#004dab',
        paddingBottom: 80,
      }}
    >
      {/* Top nav */}
      <nav
        className="flex items-start justify-between"
        style={{ padding: '40px 85px 0 85px' }}
      >
        <HousaLogo />

        <div className="flex items-center" style={{ gap: 32, marginTop: 20 }}>
          {NAV_LINKS.map((link) => {
            const active = link === activeLink
            return (
              <a
                key={link}
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setActiveLink(link)
                }}
                style={{
                  color: '#fff',
                  fontSize: 14,
                  textDecoration: 'none',
                  fontWeight: active ? 800 : 400,
                  opacity: active ? 1 : 0.9,
                }}
              >
                {link}
              </a>
            )
          })}
        </div>

        <p style={{ color: '#fff', fontSize: 14, fontWeight: 800, marginTop: 20 }}>
          Hello there Corwin
        </p>
      </nav>

      {/* Hero */}
      <div
        className="flex items-start justify-between"
        style={{ padding: '0 85px', marginTop: 60 }}
      >
        <div>
          <h1
            style={{
              color: '#fff',
              fontSize: 30,
              fontWeight: 400,
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Corwin, you have agents ready to sell <strong style={{ fontWeight: 800 }}>732 Caspian Way</strong>
          </h1>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{
              color: '#85ff00',
              fontSize: 12,
              textDecoration: 'none',
              display: 'inline-block',
              marginTop: 6,
            }}
          >
            View/edit listing
          </a>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: '#fff', fontSize: 30, fontWeight: 400, lineHeight: 1.2, margin: 0 }}>
            You goal is <strong style={{ fontWeight: 800 }}>$29,375</strong>
          </p>
          <p style={{ color: '#85ff00', fontSize: 12, margin: 0, marginTop: 6 }}>
            Your estimated cash at close
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex" style={{ padding: '0 85px', marginTop: 40, gap: 24 }}>
        {/* Sort sidebar */}
        <aside style={{ flexShrink: 0, width: 220, paddingTop: 32 }}>
          <p
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: 12,
              fontWeight: 800,
              marginBottom: 18,
              marginTop: 0,
            }}
          >
            Sort by
          </p>
          <div className="flex flex-col">
            {sortOptions.map((option) => (
              <RadioOption
                key={option}
                label={option}
                checked={sortBy === option}
                onClick={() => setSortBy(option)}
              />
            ))}
          </div>
        </aside>

        {/* Agents list */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <div className="flex justify-between" style={{ padding: '0 28px', marginBottom: 14 }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 800, margin: 0 }}>
              Agent
            </p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 800, margin: 0 }}>
              Cash at close
            </p>
          </div>

          {sortedAgents.map((agent) => (
            <AgentRow key={agent.id} agent={agent} />
          ))}
        </main>
      </div>
    </div>
  )
}
