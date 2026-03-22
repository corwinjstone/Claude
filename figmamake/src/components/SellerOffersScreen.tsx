import { useState } from 'react';

// Asset URLs from Figma (valid for 7 days)
const logoIcon = 'https://www.figma.com/api/mcp/asset/ba56d5c3-c549-4e48-9ce8-92e037a8cc63';
const checkIcon = 'https://www.figma.com/api/mcp/asset/29877102-8a10-4fa8-a83e-96f76bd03180';
const checkPath = 'https://www.figma.com/api/mcp/asset/d7440abf-b2f3-4a6d-aed6-7095a803b97e';
const paperclipIcon = 'https://www.figma.com/api/mcp/asset/a513cc1c-bbd1-41ae-8dc4-6e1359f66655';

const agents = [
  {
    id: 1,
    name: 'Valerie Alhmady',
    brokerage: 'Century 21',
    stars: 4,
    photo: 'https://www.figma.com/api/mcp/asset/750d790f-c9a8-41b2-9dfd-0f7d8f2a6bb0',
    homePrice: '$250,000',
    fee: '$5,625',
    feeRate: '2.25% fee',
    cashAtClose: '$29,735',
    indicator: 'check',
    paperclip: false,
    dealMatch: false,
    dim: false,
  },
  {
    id: 2,
    name: 'Marcus Thompson',
    brokerage: 'Colliers International',
    stars: 4,
    photo: 'https://www.figma.com/api/mcp/asset/b60aef7f-a4a8-47f2-ae98-79e6fadd22ca',
    homePrice: '$240,500',
    fee: '$5,411',
    feeRate: '2.25% fee',
    cashAtClose: '$20,089',
    indicator: 'down',
    paperclip: true,
    dealMatch: false,
    dim: true,
  },
  {
    id: 3,
    name: 'Cheryl Brown',
    brokerage: 'Remax',
    stars: 3,
    photo: 'https://www.figma.com/api/mcp/asset/6c1f3d7b-c0cf-4804-b42b-cb103cf9e8da',
    homePrice: '$250,000',
    fee: '$5,625',
    feeRate: '2.25% fee',
    cashAtClose: '$29,375',
    indicator: 'check',
    paperclip: true,
    dealMatch: true,
    dim: false,
  },
  {
    id: 4,
    name: 'Tom Fredericks',
    brokerage: 'New Home Realtors',
    stars: 3,
    photo: 'https://www.figma.com/api/mcp/asset/50ef0992-3c97-4a8f-a9ba-ab4470fe5b6b',
    homePrice: '$260,750',
    fee: '$5,215',
    feeRate: '2% fee',
    cashAtClose: '$40,535',
    indicator: 'up',
    paperclip: true,
    dealMatch: false,
    dim: true,
  },
  {
    id: 5,
    name: 'Marleen Beckett',
    brokerage: 'First Touch',
    stars: 3.5,
    photo: 'https://www.figma.com/api/mcp/asset/63bc127b-e362-48d1-9ee8-ec9bd7d4f39c',
    homePrice: '$240,500',
    fee: '$5,411',
    feeRate: '2.25% fee',
    cashAtClose: '$20,089',
    indicator: 'down',
    paperclip: false,
    dealMatch: false,
    dim: true,
  },
  {
    id: 6,
    name: 'Sara Washington',
    brokerage: 'Century 21 Prime',
    stars: 2.5,
    photo: 'https://www.figma.com/api/mcp/asset/a464bd70-89ca-4200-8e99-9ba792c6df93',
    homePrice: '$250,000',
    fee: '$7,500',
    feeRate: '3% fee',
    cashAtClose: '$27,500',
    indicator: 'down',
    paperclip: true,
    dealMatch: false,
    dim: true,
  },
  {
    id: 7,
    name: 'Alli Tang',
    brokerage: 'Sothby Dallas',
    stars: 4,
    photo: 'https://www.figma.com/api/mcp/asset/ca34293a-c110-46f3-9318-1c37435d8102',
    homePrice: '$260,000',
    fee: '$7,800',
    feeRate: '3% fee',
    cashAtClose: '$37,200',
    indicator: 'up',
    paperclip: false,
    dealMatch: false,
    dim: true,
  },
];

function StarRating({ stars }: { stars: number }) {
  return (
    <span className="text-xs">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= stars ? '#ffffff' : 'rgba(255,255,255,0.25)' }}>
          ★
        </span>
      ))}
    </span>
  );
}

function IndicatorArrow({ direction }: { direction: 'up' | 'down' }) {
  if (direction === 'up') {
    return (
      <svg width="10" height="10" viewBox="0 0 10 10" className="flex-shrink-0">
        <polygon points="5,0 10,10 0,10" fill="#85ff00" />
      </svg>
    );
  }
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" className="flex-shrink-0">
      <polygon points="0,0 10,0 5,10" fill="#f5a623" />
    </svg>
  );
}

function CheckBadge() {
  return (
    <div className="relative flex-shrink-0 w-6 h-6">
      <img src={checkIcon} alt="" className="absolute inset-0 w-full h-full" />
      <img src={checkPath} alt="" className="absolute inset-0 w-full h-full" />
    </div>
  );
}

const sortOptions = ['Agent', 'Ratings', 'Cash at close', 'Commission', 'Home price'];

export function SellerOffersScreen() {
  const [sortBy, setSortBy] = useState('Ratings');

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#004dab', fontFamily: 'Avenir, sans-serif' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-[85px] pt-[49px] pb-4">
        <div className="flex flex-col items-center gap-1">
          <img src={logoIcon} alt="housa logo" className="w-[48px] h-[58px] object-contain" />
          <span className="text-white text-[20px] font-bold tracking-[-1px]">housa</span>
        </div>
        <div className="flex items-center gap-8 text-white text-[14px]">
          <span className="opacity-70 cursor-pointer hover:opacity-100">Buy a home</span>
          <span className="font-bold cursor-pointer">Sell my home</span>
          <span className="opacity-70 cursor-pointer hover:opacity-100">Browse home listings</span>
          <span className="opacity-70 cursor-pointer hover:opacity-100">How this works</span>
          <span className="opacity-70 cursor-pointer hover:opacity-100">Resources</span>
        </div>
        <span className="text-white text-[14px] font-bold">Hello there Corwin</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between px-[85px] mt-6 mb-8">
        <div>
          <p className="text-white text-[30px] leading-tight mb-1">
            Corwin, you have agents ready to sell{' '}
            <strong>732 Caspian Way</strong>
          </p>
          <span className="text-[#85ff00] text-[12px] cursor-pointer hover:underline">View/edit listing</span>
        </div>
        <div className="text-right">
          <p className="text-white text-[30px] leading-tight mb-1">
            You goal is{' '}
            <strong>$29,375</strong>
          </p>
          <span className="text-[#85ff00] text-[12px]">Your estimated cash at close</span>
        </div>
      </div>

      {/* Column headers */}
      <div className="flex items-center px-[85px] mb-2">
        <div className="w-[280px]" />
        <span className="text-white text-[12px] font-bold opacity-50 flex-1">Agent</span>
        <span className="text-white text-[12px] font-bold opacity-50 mr-6">Cash at close</span>
      </div>

      {/* Main layout */}
      <div className="flex px-[85px] gap-8">
        {/* Sidebar */}
        <aside className="w-[230px] flex-shrink-0 pt-4">
          <p className="text-white text-[12px] font-bold opacity-50 mb-4">Sort by</p>
          <div className="flex flex-col gap-3">
            {sortOptions.map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer group">
                <div
                  className="relative w-[21px] h-[21px] rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: 'rgba(255,255,255,0.6)' }}
                  onClick={() => setSortBy(option)}
                >
                  {sortBy === option && (
                    <div className="w-[9px] h-[9px] rounded-full bg-white" />
                  )}
                </div>
                <span
                  className="text-white text-[12px] font-bold"
                  onClick={() => setSortBy(option)}
                >
                  {option}
                </span>
              </label>
            ))}
          </div>
        </aside>

        {/* Agent list */}
        <div className="flex-1 flex flex-col gap-2">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center rounded-[8px] px-5 py-4 gap-4 cursor-pointer transition-opacity"
              style={{
                backgroundColor: '#000000',
                opacity: agent.dim ? 0.5 : 1,
              }}
            >
              {/* Deal match badge (overlaid on photo area) */}
              <div className="relative flex-shrink-0 w-[58px]">
                <img
                  src={agent.photo}
                  alt={agent.name}
                  className="w-[58px] h-[58px] rounded-full object-cover"
                />
                {agent.dealMatch && (
                  <div className="absolute -bottom-5 left-0 flex flex-col items-center w-full">
                    <div
                      className="w-[24px] h-[24px] rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#478fff' }}
                    >
                      <img src={checkPath} alt="" className="w-[9px] h-[6px]" />
                    </div>
                    <span className="text-[#478fff] text-[8px] font-bold mt-0.5 whitespace-nowrap">Deal match</span>
                  </div>
                )}
              </div>

              {/* Name + brokerage + stars */}
              <div className="flex flex-col min-w-[200px] w-[220px]" style={{ marginTop: agent.dealMatch ? '20px' : '0' }}>
                <div className="flex items-center gap-2">
                  <span className="text-[#85ff00] text-[22px] font-normal leading-tight">{agent.name}</span>
                  {agent.paperclip && (
                    <img
                      src={paperclipIcon}
                      alt=""
                      className="w-[20px] h-[20px] object-contain"
                      style={{ filter: 'brightness(0) saturate(100%) invert(89%) sepia(55%) saturate(700%) hue-rotate(40deg) brightness(110%)' }}
                    />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-[12px] opacity-80">{agent.brokerage}</span>
                  <StarRating stars={agent.stars} />
                </div>
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Home price + fee */}
              <div className="text-right mr-4 flex-shrink-0">
                <p className="text-white text-[12px] opacity-50 leading-tight">Home price</p>
                <p className="text-white text-[16px] leading-tight">{agent.homePrice}</p>
                <p className="text-white text-[12px] opacity-50 leading-tight">{agent.feeRate}</p>
                <p className="text-white text-[16px] leading-tight">{agent.fee}</p>
              </div>

              {/* Indicator + cash at close */}
              <div className="flex items-center gap-2 flex-shrink-0 w-[140px] justify-end">
                {agent.indicator === 'check' ? (
                  <CheckBadge />
                ) : (
                  <IndicatorArrow direction={agent.indicator as 'up' | 'down'} />
                )}
                <span className="text-white text-[36px] font-bold leading-none">{agent.cashAtClose}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8 pb-10">
        <span className="text-white text-[18px] font-bold cursor-pointer">1</span>
        <span className="text-white text-[18px] opacity-50 cursor-pointer hover:opacity-100">2</span>
      </div>
    </div>
  );
}
