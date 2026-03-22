import { useState } from 'react'
import './App.css'

// Figma asset URLs (valid for 7 days)
const ASSETS = {
  housaLogo: "https://www.figma.com/api/mcp/asset/1f3b1e21-34a1-4d1b-991f-04d8864a48c9",
  starFull: "https://www.figma.com/api/mcp/asset/7bf8339a-269d-44bf-8532-9642d83c33d2",
  starEmpty: "https://www.figma.com/api/mcp/asset/66f92d7b-7e66-4ad5-a99b-71606d383abb",
  checkmark: "https://www.figma.com/api/mcp/asset/b0236e57-959d-4daa-9a52-ef2497dedf85",
  checkPath: "https://www.figma.com/api/mcp/asset/4dc29f4c-0c35-4fa6-8116-6b02d12601e8",
  arrowDown: "https://www.figma.com/api/mcp/asset/47abf427-71ad-4b0e-8fd7-7778e900eb59",
  arrowUp: "https://www.figma.com/api/mcp/asset/94e0b539-4fd8-41f4-b2c3-ff9293aa37be",
  dealMatchIcon: "https://www.figma.com/api/mcp/asset/a23f0258-4be0-4b33-9a0b-d67f7bd6a0a3",
  valerie: "https://www.figma.com/api/mcp/asset/3f90e332-e70f-474c-99ad-a892955edad8",
  marcus: "https://www.figma.com/api/mcp/asset/27cd801f-8dd9-4d08-88ca-a5531d2750c7",
  cheryl: "https://www.figma.com/api/mcp/asset/c720bd48-9c3a-4c8e-89b0-72776f891bac",
  tom: "https://www.figma.com/api/mcp/asset/7d978ed2-18bb-4c62-9055-40d5516ce437",
  marleen: "https://www.figma.com/api/mcp/asset/709880f9-cfda-481a-b2ac-586d31a7fe33",
  sara: "https://www.figma.com/api/mcp/asset/7be2249a-db03-4fb1-b63c-9e5504fb67e9",
  alli: "https://www.figma.com/api/mcp/asset/59a81dad-9455-4fac-8608-79011be45160",
}

const agents = [
  {
    id: 1,
    name: 'Valerie Alhmady',
    company: 'Century 21',
    photo: ASSETS.valerie,
    rating: 4,
    homePrice: '$250,000',
    fee: '2.25% fee',
    commission: '$5,625',
    cashAtClose: '$29,735',
    trend: 'up',
    hasDealMatch: false,
    isGoalMatch: true,
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
    cashAtClose: '$20,089',
    trend: 'down',
    hasDealMatch: true,
    isGoalMatch: false,
    featured: false,
  },
  {
    id: 3,
    name: 'Cheryl Brown',
    company: 'Remax',
    photo: ASSETS.cheryl,
    rating: 3,
    homePrice: '$250,000',
    fee: '2.25% fee',
    commission: '$5,625',
    cashAtClose: '$29,375',
    trend: 'up',
    hasDealMatch: false,
    isGoalMatch: true,
    isDealMatch: true,
    featured: true,
  },
  {
    id: 4,
    name: 'Tom Fredericks',
    company: 'New Home Realtors',
    photo: ASSETS.tom,
    rating: 3,
    homePrice: '$260,750',
    fee: '2% fee',
    commission: '$5,215',
    cashAtClose: '$40,535',
    trend: 'up',
    hasDealMatch: true,
    isGoalMatch: false,
    featured: false,
  },
  {
    id: 5,
    name: 'Marleen Beckett',
    company: 'First Touch',
    photo: ASSETS.marleen,
    rating: 3,
    homePrice: '$240,500',
    fee: '2.25% fee',
    commission: '$5,411',
    cashAtClose: '$20,089',
    trend: 'down',
    hasDealMatch: false,
    isGoalMatch: false,
    featured: false,
  },
  {
    id: 6,
    name: 'Sara Washington',
    company: 'Century 21 Prime',
    photo: ASSETS.sara,
    rating: 2,
    homePrice: '$250,000',
    fee: '3% fee',
    commission: '$7,500',
    cashAtClose: '$27,500',
    trend: 'down',
    hasDealMatch: true,
    isGoalMatch: false,
    featured: false,
  },
  {
    id: 7,
    name: 'Alli Tang',
    company: 'Sothby Dallas',
    photo: ASSETS.alli,
    rating: 2,
    homePrice: '$260,000',
    fee: '3% fee',
    commission: '$7,800',
    cashAtClose: '$37,200',
    trend: 'up',
    hasDealMatch: false,
    isGoalMatch: false,
    featured: false,
  },
]

const sortOptions = ['Agent', 'Ratings', 'Cash at close', 'Commission', 'Home price']

function StarRating({ rating, max = 5 }) {
  return (
    <div className="flex gap-[3px] items-center">
      {Array.from({ length: max }, (_, i) => (
        <img
          key={i}
          src={i < rating ? ASSETS.starFull : ASSETS.starEmpty}
          alt=""
          className="w-[13px] h-[13px] object-contain"
          style={{ opacity: i < rating ? 1 : 0.25 }}
        />
      ))}
    </div>
  )
}

function CheckBadge({ size = 24 }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <img src={ASSETS.checkmark} alt="verified" className="w-full h-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <img src={ASSETS.checkPath} alt="" style={{ width: size * 0.375, height: size * 0.25 }} />
      </div>
    </div>
  )
}

function AgentCard({ agent }) {
  const opacity = agent.featured ? '' : 'opacity-60'
  return (
    <div
      className={`flex items-center rounded-lg px-6 mb-2 ${opacity}`}
      style={{ backgroundColor: '#000', minHeight: '101px' }}
    >
      {/* Agent photo with optional deal match badge */}
      <div className="relative flex-shrink-0 mr-4">
        {agent.isDealMatch && (
          <div className="absolute -left-3 top-0 z-10 flex flex-col items-center">
            <CheckBadge size={20} />
            <p className="text-[#478fff] text-[8px] font-bold text-center leading-tight mt-0.5 whitespace-nowrap">
              Deal match
            </p>
          </div>
        )}
        <div className="w-[58px] h-[60px] rounded-full overflow-hidden">
          <img
            src={agent.photo}
            alt={agent.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Agent name & company + rating */}
      <div className="flex-shrink-0 w-[240px]">
        <p style={{ color: '#85ff00', fontSize: '22px', fontWeight: 800, lineHeight: '1.1' }}>
          {agent.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-white text-[12px]">{agent.company}</p>
          <StarRating rating={agent.rating} />
        </div>
      </div>

      {/* Paperclip/deal icon */}
      {agent.hasDealMatch && (
        <div className="flex-shrink-0 ml-3">
          <img
            src={ASSETS.dealMatchIcon}
            alt="deal"
            className="w-5 h-5"
            style={{ filter: 'brightness(0.5) saturate(0)' }}
          />
        </div>
      )}

      {/* Flexible spacer */}
      <div className="flex-1" />

      {/* Home price & fee columns */}
      <div className="flex-shrink-0 text-right mr-6">
        <p className="text-white/50 text-[11px] leading-tight">Home price</p>
        <p className="text-white text-[16px] leading-snug">{agent.homePrice}</p>
        <p className="text-white/50 text-[11px] leading-tight">{agent.fee}</p>
        <p className="text-white text-[16px] leading-snug">{agent.commission}</p>
      </div>

      {/* Trend arrow */}
      <div className="flex-shrink-0 mr-3">
        <img
          src={agent.trend === 'up' ? ASSETS.arrowUp : ASSETS.arrowDown}
          alt={agent.trend}
          className="w-[10px] h-[10px]"
        />
      </div>

      {/* Cash at close + check badge */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {agent.isGoalMatch && <CheckBadge size={24} />}
        <p style={{ color: '#fff', fontSize: '36px', fontWeight: 800, lineHeight: '1' }}>
          {agent.cashAtClose}
        </p>
      </div>
    </div>
  )
}

export default function App() {
  const [sortBy, setSortBy] = useState('Ratings')
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#004dab' }}>
      {/* Navigation */}
      <nav className="flex items-start justify-between px-[85px] pt-[49px] pb-4">
        {/* Logo */}
        <div className="flex flex-col items-center flex-shrink-0">
          <img src={ASSETS.housaLogo} alt="Housa logo" className="w-12 h-12 object-contain" />
          <p style={{ color: '#fff', fontSize: '20px', fontWeight: 800, letterSpacing: '-1px', marginTop: '4px' }}>
            housa
          </p>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-8 mt-5">
          {['Buy a home', 'Sell my home', 'Browse home listings', 'How this works', 'Resources'].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                color: '#fff',
                fontSize: '14px',
                textDecoration: 'none',
                fontWeight: link === 'Sell my home' ? 800 : 400,
                opacity: link === 'Sell my home' ? 1 : 0.85,
              }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* User greeting */}
        <div className="mt-5 flex-shrink-0">
          <p style={{ color: '#fff', fontSize: '14px', fontWeight: 800 }}>Hello there Corwin</p>
        </div>
      </nav>

      {/* Hero section */}
      <div className="flex justify-between items-start px-[85px] mt-8 mb-6">
        <div>
          <h1 style={{ color: '#fff', fontSize: '30px', fontWeight: 400, lineHeight: '1.2', margin: 0 }}>
            Corwin, you have agents ready to sell{' '}
            <strong>732 Caspian Way</strong>
          </h1>
          <a href="#" style={{ color: '#85ff00', fontSize: '12px', textDecoration: 'none' }}>
            View/edit listing
          </a>
        </div>
        <div className="text-right">
          <p style={{ color: '#fff', fontSize: '30px', fontWeight: 400, lineHeight: '1.2' }}>
            You goal is <strong>$29,375</strong>
          </p>
          <p style={{ color: '#85ff00', fontSize: '12px' }}>Your estimated cash at close</p>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex px-[85px] gap-6">
        {/* Left sidebar */}
        <div className="flex-shrink-0 w-[260px] pt-8">
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 800, marginBottom: '16px' }}>
            Sort by
          </p>
          <div className="flex flex-col gap-[12px]">
            {sortOptions.map((option) => {
              const selected = sortBy === option
              return (
                <label
                  key={option}
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setSortBy(option)}
                >
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-full"
                    style={{
                      width: 21,
                      height: 21,
                      border: selected ? '2px solid #fff' : '2px solid rgba(255,255,255,0.4)',
                      background: selected ? '#fff' : 'transparent',
                    }}
                  >
                    {selected && (
                      <div
                        className="rounded-full"
                        style={{ width: 9, height: 9, background: '#004dab' }}
                      />
                    )}
                  </div>
                  <span style={{ color: '#fff', fontSize: '12px', fontWeight: 800 }}>{option}</span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Agents list */}
        <div className="flex-1">
          {/* Column headers */}
          <div className="flex justify-between px-6 mb-3">
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 800 }}>Agent</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 800 }}>Cash at close</p>
          </div>

          {/* Cards */}
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}

          {/* Pagination */}
          <div className="flex justify-center items-center gap-6 mt-8 pb-12">
            {[1, 2].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  color: '#fff',
                  fontSize: '18px',
                  fontWeight: currentPage === page ? 800 : 400,
                  opacity: currentPage === page ? 1 : 0.5,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
