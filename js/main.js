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
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    const scrollTop = document.getElementById('scrollTop');
    if (scrollTop) {
      scrollTop.style.opacity = window.scrollY > 300 ? '1' : '0';
    }
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
        const nums = entry.target.querySelectorAll('[data-target]');
        nums.forEach(el => animateCount(el));
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
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString('ko-KR');
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString('ko-KR');
  };
  requestAnimationFrame(update);
}

// ====== LIVE ESTIMATE LIST ======
const liveData = [
  { service: '매트리스청소', region: '서울 강남구', size: '20평', time: '방금 전' },
  { service: '입주청소', region: '경기 성남시', size: '34평', time: '2분 전' },
  { service: '커튼설치', region: '인천 연수구', size: '25평', time: '5분 전' },
  { service: '인테리어', region: '서울 마포구', size: '30평', time: '7분 전' },
  { service: '창문필름', region: '경기 수원시', size: '40평', time: '12분 전' },
  { service: '에어컨청소', region: '부산 해운대구', size: '28평', time: '15분 전' },
  { service: '매트리스청소', region: '서울 송파구', size: '15평', time: '18분 전' },
  { service: '줄눈시공', region: '경기 고양시', size: '32평', time: '22분 전' },
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
    emoji: '🛏', name: '클린매트 전문점', category: '매트리스 업체',
    location: '서울 강남구 · 전국',
    rating: 4.9, reviews: 284, verified: true, badge: '파트너',
    tags: ['살균세척', '스팀클리닝', '진드기제거', '당일가능']
  },
  {
    emoji: '🧹', name: '에이스청소', category: '청소 업체',
    location: '경기 성남시 · 수도권',
    rating: 4.8, reviews: 521, verified: true, badge: 'BEST',
    tags: ['입주청소', '줄눈시공', '에어컨청소', '사무실청소']
  },
  {
    emoji: '🏡', name: '프리미엄인테리어', category: '인테리어 업체',
    location: '서울 전역 · 경기',
    rating: 4.9, reviews: 183, verified: true, badge: null,
    tags: ['도배', '마루시공', '욕실리모델링', '전체리모델링']
  },
  {
    emoji: '🪟', name: '맞춤커튼하우스', category: '커튼 업체',
    location: '서울 · 경기 전역',
    rating: 4.7, reviews: 342, verified: true, badge: null,
    tags: ['맞춤제작', '블라인드', '롤스크린', '방문측정']
  },
  {
    emoji: '🎬', name: '썬텍필름', category: '필름 업체',
    location: '전국 출장 가능',
    rating: 4.8, reviews: 156, verified: true, badge: 'NEW',
    tags: ['단열필름', '방범필름', '자외선차단', '당일시공']
  },
  {
    emoji: '🧴', name: '홈케어서비스', category: '통합 홈케어',
    location: '서울 전역',
    rating: 4.9, reviews: 467, verified: true, badge: '파트너',
    tags: ['가전청소', '에어컨', '세탁기', '냉장고청소']
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

// ====== REVIEWS ======
const reviewsData = [
  {
    name: '김민준', initials: '김', date: '2024.03.20',
    service: '매트리스청소', rating: 5,
    text: '정말 친절하고 꼼꼼하게 청소해주셨어요. 매트리스에서 이상한 냄새가 났었는데 완전히 사라졌습니다. 아이가 있어서 살균이 중요했는데 전문 장비로 완벽하게 해주셔서 너무 만족스러웠어요!'
  },
  {
    name: '이수진', initials: '이', date: '2024.03.18',
    service: '입주청소', rating: 5,
    text: '이사 전날 입주청소를 맡겼는데 정말 완벽했습니다. 새 집처럼 깨끗해졌어요. 화장실부터 주방까지 꼼꼼하게 작업해서 이사 당일 너무 편했어요. 강력 추천합니다!'
  },
  {
    name: '박성호', initials: '박', date: '2024.03.15',
    service: '커튼설치', rating: 5,
    text: '방문 측정부터 설치까지 2일만에 완료했습니다. 원하는 디자인으로 맞춤 제작해주셔서 만족도가 최고예요. 가격도 합리적이고 시공도 깔끔하게 해주셨습니다.'
  },
  {
    name: '최지우', initials: '최', date: '2024.03.12',
    service: '창문필름', rating: 4,
    text: '단열 효과가 정말 대단합니다. 시공 전후로 확실히 냉난방비가 줄었어요. 시공 과정도 꼼꼼하게 설명해주시고 깔끔하게 마무리해 주셨어요. 아주 만족스럽습니다!'
  },
  {
    name: '정다은', initials: '정', date: '2024.03.10',
    service: '인테리어', rating: 5,
    text: '30평 아파트 도배·마루·욕실 리모델링을 한꺼번에 맡겼는데 3주 만에 완성했어요! 매트허브에서 찾은 업체인데 가격 대비 퀄리티가 너무 좋아서 지인들한테 추천 중입니다.'
  },
  {
    name: '강준혁', initials: '강', date: '2024.03.07',
    service: '에어컨청소', rating: 5,
    text: '에어컨에서 곰팡이 냄새가 났었는데 완전히 해결됐어요. 분해 후 세척하고 항균 코팅까지 해주셨습니다. 가격도 저렴하고 직원분이 너무 친절하셨어요. 또 이용할 예정입니다.'
  },
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

  // Close all
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

  const animEls = document.querySelectorAll('.service-card, .company-card, .review-card, .step-item, .faq-item');
  animEls.forEach((el, i) => {
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
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ====== KAKAO CHANNEL ======
document.getElementById('kakaoBtn')?.addEventListener('click', function(e) {
  e.preventDefault();
  alert('카카오 채널: @매트허브\n채널 추가 후 상담받으세요!');
});
