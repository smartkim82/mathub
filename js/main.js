// ============================
// 매트허브 - 메인 JavaScript
// ============================

document.addEventListener('DOMContentLoaded', function() {
  initTopBar();
  initHeader();
  initHamburger();
  initStats();
  renderLiveList();
  renderCompanies();
  renderReviews();
  initScrollAnim();
});

// ====== TOP BAR ======
function initTopBar() {
  const closeBtn = document.getElementById('topBarClose');
  const bar = document.getElementById('topBar');
  if (closeBtn && bar) {
    closeBtn.addEventListener('click', () => {
      bar.style.height = bar.offsetHeight + 'px';
      bar.offsetHeight;
      bar.style.transition = 'all 0.4s';
      bar.style.height = '0';
      bar.style.overflow = 'hidden';
      bar.style.padding = '0';
    });
  }
}

// ====== HEADER SCROLL ======
function initHeader() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    const scrollTop = document.getElementById('scrollTop');
    if (scrollTop) scrollTop.style.opacity = window.scrollY > 300 ? '1' : '0';
  });
}

// ====== HAMBURGER MENU ======
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ====== COUNTER ANIMATION ======
function initStats() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-target]').forEach(el => animateCount(el));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) observer.observe(statsSection);
}

function animateCount(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 2000;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(eased * target).toLocaleString('ko-KR');
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString('ko-KR');
  };
  requestAnimationFrame(update);
}

// ====== LIVE ESTIMATE LIST ======
const liveData = [
  { service: '🔇 층간소음매트', region: '서울 강남구', size: '32평', time: '방금 전' },
  { service: '👶 유아매트', region: '경기 수원시', size: '25평', time: '2분 전' },
  { service: '🔇 층간소음매트', region: '인천 송도구', size: '28평', time: '4분 전' },
  { service: '🧹 입주청소', region: '경기 성남시', size: '34평', time: '7분 전' },
  { service: '🧓 노인매트', region: '부산 해운대구', size: '시설전체', time: '11분 전' },
  { service: '🔇 층간소음매트', region: '서울 마포구', size: '30평', time: '14분 전' },
  { service: '🐾 반려동물매트', region: '경기 고양시', size: '22평', time: '18분 전' },
  { service: '🏭 시설매트', region: '서울 강서구', size: '체육관', time: '23분 전' },
];

function renderLiveList() {
  const container = document.getElementById('liveList');
  if (!container) return;
  container.innerHTML = liveData.map(item => `
    <div class="live-item" onclick="window.location.href='estimate.html'">
      <div class="li-service">${item.service}</div>
      <div class="li-title">${item.region} · ${item.size}</div>
      <div class="li-meta">견적 요청 대기 중...</div>
      <div class="li-time">⏰ ${item.time}</div>
    </div>
  `).join('');
}

// ====== COMPANIES ======
const companiesData = [
  {
    emoji: '🔇', name: '하늘매트', category: '층간소음매트 전문',
    location: '서울·경기 전역',
    rating: 4.9, reviews: 412, verified: true, badge: '파트너',
    tags: ['층간소음', 'TPU매트', '유아매트', '현장시공']
  },
  {
    emoji: '🔇', name: '셀인매트', category: '층간소음매트 전문',
    location: '수도권 전역',
    rating: 4.8, reviews: 287, verified: true, badge: 'BEST',
    tags: ['층간소음', '고밀도폼', '맞춤시공', '당일설치']
  },
  {
    emoji: '🔇', name: '예감매트', category: '층간소음·유아매트',
    location: '전국 출장 가능',
    rating: 4.8, reviews: 354, verified: true, badge: null,
    tags: ['층간소음', '친환경소재', '유아안전', '무독성']
  },
  {
    emoji: '🔇', name: '팡팡매트', category: '층간소음·놀이매트',
    location: '서울·인천·경기',
    rating: 4.7, reviews: 198, verified: true, badge: null,
    tags: ['층간소음', '어린이놀이터', '안전인증', '방음']
  },
  {
    emoji: '🏠', name: '매트허브', category: '매트 통합 플랫폼',
    location: '전국',
    rating: 5.0, reviews: 2847, verified: true, badge: '공식',
    tags: ['층간소음', '유아매트', '시설매트', 'AI매칭']
  },
  {
    emoji: '🧹', name: '에이스청소', category: '청소 업체',
    location: '경기 성남시 · 수도권',
    rating: 4.8, reviews: 521, verified: true, badge: null,
    tags: ['입주청소', '줄눈시공', '에어컨청소', '사무실청소']
  },
];

function renderCompanies() {
  const container = document.getElementById('companiesGrid');
  if (!container) return;
  container.innerHTML = companiesData.map(c => `
    <div class="company-card" onclick="window.location.href='companies.html'">
      ${c.badge ? `<div class="cc-badge">${c.badge}</div>` : ''}
      <div class="cc-header">
        <div class="cc-logo" style="background: linear-gradient(135deg, rgba(26,115,232,0.12), rgba(0,198,174,0.12));">${c.emoji}</div>
        <div class="cc-info">
          <div class="cc-name">${c.name}</div>
          <span class="cc-category">${c.category}</span>
        </div>
      </div>
      ${c.verified ? '<div class="cc-verified">✅ 매트허브 인증 업체</div>' : ''}
      <div class="cc-location">📍 ${c.location}</div>
      <div class="cc-rating">
        <span class="cc-stars">${'★'.repeat(Math.floor(c.rating))}${'☆'.repeat(5 - Math.floor(c.rating))}</span>
        <span class="cc-rating-num">${c.rating}</span>
        <span class="cc-reviews">(${c.reviews.toLocaleString()}건)</span>
      </div>
      <div class="cc-tags">
        ${c.tags.map(t => `<span class="cc-tag">${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

// ====== REVIEWS (10개 이상) ======
const reviewsData = [
  {
    name: '김민준', initials: '김', date: '2024.03.20',
    service: '층간소음매트', rating: 5,
    text: '아래층 소음 문제로 고민이 많았는데 하늘매트에서 층간소음매트 시공하고 나서 정말 달라졌어요! 발걸음 소리가 확실히 줄었고 아이가 뛰어다녀도 걱정이 없어요. 매트허브에서 연결해주셔서 너무 감사합니다.'
  },
  {
    name: '이수진', initials: '이', date: '2024.03.18',
    service: '유아매트', rating: 5,
    text: '12개월 아기 때문에 안전한 유아매트를 찾고 있었어요. KC 인증 제품으로 무독성이라 안심하고 쓸 수 있어요. 두께도 충분해서 낙상 걱정이 없고 청소도 쉬워서 정말 만족합니다!'
  },
  {
    name: '박성호', initials: '박', date: '2024.03.15',
    service: '층간소음매트', rating: 5,
    text: '아파트 32평 전체 층간소음매트 시공했습니다. 셀인매트에서 맞춤 시공해주셨는데 이음새 없이 깔끔하게 완성되고 소음 차단 효과가 정말 뛰어납니다. 계약금 입금 후 당일 연결됐어요!'
  },
  {
    name: '최지우', initials: '최', date: '2024.03.12',
    service: '노인매트', rating: 5,
    text: '요양원에서 사용할 낙상방지 매트를 대량 주문했는데 시설 전담 매니저가 배정되어 처음부터 끝까지 도움을 주셨어요. 납품도 빠르고 제품 품질도 의료용 기준에 딱 맞았습니다.'
  },
  {
    name: '정다은', initials: '정', date: '2024.03.10',
    service: '층간소음매트', rating: 5,
    text: '예감매트에서 친환경 소재로 시공했는데 냄새가 전혀 없고 아이들이 좋아해요. 무독성 인증 제품이라 마음이 편하고, 시공 전 현장 측정도 꼼꼼하게 해주셨어요. 강력 추천합니다!'
  },
  {
    name: '강준혁', initials: '강', date: '2024.03.07',
    service: '반려동물매트', rating: 5,
    text: '강아지 관절이 안 좋아서 관절보호 매트를 찾고 있었어요. 매트허브에서 연결해준 업체가 소형견 체형에 맞는 두께로 추천해줬고, 미끄럼방지도 완벽해서 댕댕이가 편하게 생활해요!'
  },
  {
    name: '윤지혜', initials: '윤', date: '2024.03.05',
    service: '층간소음매트', rating: 5,
    text: '팡팡매트에서 어린이 놀이방 전체를 시공했습니다. 안전 인증 확인하고 맡겼는데 작업도 빠르고 정말 꼼꼼하게 해주셨어요. 매트허브 AI 매칭으로 바로 연결돼서 편했어요!'
  },
  {
    name: '임재원', initials: '임', date: '2024.03.03',
    service: '시설매트', rating: 5,
    text: '헬스장 200평 고무 바닥재 작업을 의뢰했습니다. B2B 대량 납품이라 걱정했는데 전담 매니저가 배정되어 계약부터 납품까지 완벽하게 진행해주셨어요. 가격도 합리적이라 추천합니다.'
  },
  {
    name: '한소희', initials: '한', date: '2024.02.28',
    service: '층간소음매트', rating: 4,
    text: '입주 전에 층간소음매트 시공을 맡겼어요. 하늘매트 TPU 소재로 결정했는데 탄성이 너무 좋고 층간소음이 확실히 줄었습니다. 견적 금액에 5% 계약금 먼저 입금했는데 과정이 투명해서 믿음이 갔어요.'
  },
  {
    name: '오민석', initials: '오', date: '2024.02.25',
    service: '유아매트', rating: 5,
    text: '25개월 아이 어린이방 전체를 유아 퍼즐 매트로 깔았어요. 두께가 5cm라 넘어져도 걱정 없고 떼어내서 세탁할 수 있어서 너무 편리해요. 매트허브 통해서 연결된 업체가 설치도 해줬어요!'
  },
  {
    name: '서지은', initials: '서', date: '2024.02.22',
    service: '층간소음매트', rating: 5,
    text: '빌라라 층간소음이 심했는데 고밀도 방음 특수폼 매트 시공 후 완전히 달라졌어요! 아래층 주민분도 소음이 줄었다고 고마워하셨어요. 매트허브 AI 매칭이 우리 동네 업체를 바로 연결해줘서 좋았어요.'
  },
  {
    name: '조현우', initials: '조', date: '2024.02.19',
    service: '반려동물매트', rating: 5,
    text: '고양이 두 마리 때문에 스크래칭 방지·항균 매트를 찾았어요. 연결해주신 업체에서 고양이 전용 제품으로 추천해줬는데 고양이들이 너무 좋아하고 털 청소도 정말 쉽게 됩니다. 재구매 의향 100%!'
  }
];

function renderReviews() {
  const container = document.getElementById('reviewsSlider');
  if (!container) return;
  container.innerHTML = reviewsData.map(r => `
    <div class="review-card">
      <div class="rv-header">
        <div class="rv-user">
          <div class="rv-avatar">${r.initials}</div>
          <div>
            <div class="rv-name">${r.name}</div>
            <div class="rv-date">${r.date}</div>
          </div>
        </div>
        <div class="rv-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
      </div>
      <div class="rv-service">${r.service}</div>
      <p class="rv-text">${r.text}</p>
    </div>
  `).join('');
}

// ====== FAQ TOGGLE ======
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-a');
  const isOpen = btn.classList.contains('active');
  document.querySelectorAll('.faq-q.active').forEach(q => {
    q.classList.remove('active');
    q.closest('.faq-item').querySelector('.faq-a').style.display = 'none';
  });
  if (!isOpen) {
    btn.classList.add('active');
    answer.style.display = 'block';
  }
}

// ====== SCROLL ANIMATION ======
function initScrollAnim() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.service-card, .company-card, .review-card, .step-item, .faq-item').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
    observer.observe(el);
  });
}

// ====== NAVIGATE TO CALCULATOR ======
function goCalculator() {
  const service = document.getElementById('qeService').value;
  const region = document.getElementById('qeRegion').value;
  const size = document.getElementById('qeSize').value;
  let url = 'calculator.html';
  const params = new URLSearchParams();
  if (service) params.set('service', service);
  if (region) params.set('region', region);
  if (size) params.set('size', size);
  if (params.toString()) url += '?' + params.toString();
  window.location.href = url;
}

// ====== SCROLL TO TOP ======
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// ====== KAKAO CHANNEL ======
document.getElementById('kakaoBtn')?.addEventListener('click', function(e) {
  e.preventDefault();
  alert('카카오 채널: @매트허브\n채널 추가 후 상담받으세요!');
});
