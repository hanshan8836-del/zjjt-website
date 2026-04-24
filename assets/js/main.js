/* =====================================================
   浙江交工集团股份有限公司 · Premium Interactive Scripts
   Designed & Built by Wei Xiaochong · 2026
   Chart.js 4.x · Vanilla JS · Zero framework dependency
   ===================================================== */

(() => {
  'use strict';

  /* ---------- Design Tokens (shared with CSS) ---------- */
  const COLOR = {
    navy: '#0B2447',
    navyDark: '#081938',
    navyLight: '#1F3A6B',
    gold: '#C49A2C',
    goldLight: '#E8B339',
    goldPale: 'rgba(196,154,44,.12)',
    crimson: '#A93226',
    steel: '#5D6D7E',
    green: '#16A085',
    red: '#E74C3C',
    blue: '#3498DB',
    purple: '#7D3C98',
    white: '#FFFFFF',
    bg: '#F7F5F0'
  };

  const FONT = '"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif';

  /* ---------- 1. Scroll progress + Nav state ---------- */
  const progressEl = document.getElementById('scrollProgress');
  const navEl = document.getElementById('nav');
  const backTopEl = document.getElementById('backTop');

  const onScroll = () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    progressEl.style.setProperty('--p', pct + '%');
    navEl.classList.toggle('is-scrolled', h.scrollTop > 50);
    backTopEl.classList.toggle('is-visible', h.scrollTop > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  backTopEl.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- 2. Mobile nav ---------- */
  const toggleBtn = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav__links');
  toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.toggle('is-open');
    navLinks.classList.toggle('is-open');
  });
  document.querySelectorAll('.nav__links a').forEach(a => {
    a.addEventListener('click', () => {
      toggleBtn.classList.remove('is-open');
      navLinks.classList.remove('is-open');
    });
  });

  /* ---------- 3. Hero particles ---------- */
  const particleBox = document.getElementById('particles');
  if (particleBox) {
    for (let i = 0; i < 24; i++) {
      const p = document.createElement('span');
      const dx = (Math.random() - .5) * 200;
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = (Math.random() * 10) + 's';
      p.style.animationDuration = (8 + Math.random() * 6) + 's';
      p.style.setProperty('--dx', dx + 'px');
      particleBox.appendChild(p);
    }
  }

  /* ---------- 4. Reveal on scroll ---------- */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        revealIO.unobserve(e.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => revealIO.observe(el));

  /* ---------- 5. Number counter ---------- */
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const render = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const val = target * ease(p);
      el.textContent = val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
      if (p < 1) requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  };
  const countIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        countIO.unobserve(e.target);
      }
    });
  }, { threshold: .4 });
  document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

  /* ---------- 6. Tower clock ---------- */
  const clockEl = document.getElementById('towerClock');
  const tickClock = () => {
    if (!clockEl) return;
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hh}:${mm}:${ss}`;
  };
  tickClock(); setInterval(tickClock, 1000);

  /* ---------- 7. Chart.js global config ---------- */
  if (window.Chart) {
    Chart.defaults.font.family = FONT;
    Chart.defaults.font.size = 12;
    Chart.defaults.color = COLOR.steel;
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.boxWidth = 10;
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(8,25,56,.96)';
    Chart.defaults.plugins.tooltip.titleColor = COLOR.gold;
    Chart.defaults.plugins.tooltip.bodyColor = '#fff';
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(196,154,44,.2)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.cornerRadius = 4;
  }

  /* ---------- 8. Charts — Render on intersect ---------- */
  const chartQueue = [];
  const makeChart = (id, renderer) => {
    const el = document.getElementById(id);
    if (!el) return;
    chartQueue.push({ el, renderer });
  };
  const chartIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const q = chartQueue.find(x => x.el === e.target);
        if (q && !q.rendered) { q.renderer(q.el); q.rendered = true; }
        chartIO.unobserve(e.target);
      }
    });
  }, { threshold: .2 });

  /* --- 8.1 业务收入饼图 --- */
  makeChart('bizPieChart', (canvas) => {
    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['施工主业', '交通材料', '设计与投资', '海外工程', '其他'],
        datasets: [{
          data: [85.46, 6.2, 3.8, 3.1, 1.44],
          backgroundColor: [
            COLOR.gold, COLOR.goldLight, COLOR.blue, COLOR.green, COLOR.steel
          ],
          borderColor: 'rgba(8,25,56,.9)',
          borderWidth: 2,
          hoverOffset: 12
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#fff', padding: 12, boxWidth: 10 }
          },
          tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%` } }
        },
        cutout: '60%'
      }
    });
  });

  /* --- 8.2 三年财务 --- */
  makeChart('finChart', (canvas) => {
    new Chart(canvas, {
      data: {
        labels: ['2022', '2023', '2024'],
        datasets: [
          {
            type: 'bar',
            label: '营业收入 (亿元)',
            data: [448.62, 460.45, 477.72],
            backgroundColor: 'rgba(11,36,71,.85)',
            borderRadius: 4,
            barThickness: 48,
            yAxisID: 'y'
          },
          {
            type: 'line',
            label: '归母净利润 (亿元)',
            data: [12.02, 13.47, 13.10],
            borderColor: COLOR.gold,
            backgroundColor: COLOR.gold,
            tension: .3,
            borderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: '#fff',
            pointBorderColor: COLOR.gold,
            pointBorderWidth: 2,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top', labels: { padding: 14 } }
        },
        scales: {
          y: {
            position: 'left', beginAtZero: true,
            ticks: { color: COLOR.steel }, grid: { color: 'rgba(0,0,0,.05)' },
            title: { display: true, text: '营收', color: COLOR.steel }
          },
          y1: {
            position: 'right', beginAtZero: true, max: 20,
            ticks: { color: COLOR.gold },
            grid: { display: false },
            title: { display: true, text: '净利', color: COLOR.gold }
          },
          x: { ticks: { color: COLOR.navy, font: { weight: 600, size: 13 } }, grid: { display: false } }
        }
      }
    });
  });

  /* --- 8.3 同业对标 --- */
  makeChart('peerChart', (canvas) => {
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['中国交建', '中国中铁', '中国铁建', '中国电建', '浙江交科', '上海建工'],
        datasets: [{
          label: '2024 营收 (亿元)',
          data: [7980, 11572, 10847, 6335, 477.72, 2942],
          backgroundColor: [
            'rgba(93,109,126,.6)', 'rgba(93,109,126,.6)', 'rgba(93,109,126,.6)',
            'rgba(93,109,126,.6)', COLOR.gold, 'rgba(93,109,126,.6)'
          ],
          borderRadius: 4,
          borderWidth: 2,
          borderColor: (ctx) => ctx.dataIndex === 4 ? COLOR.goldLight : 'transparent'
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.x.toLocaleString()} 亿元` } }
        },
        scales: {
          x: { beginAtZero: true, type: 'logarithmic', grid: { color: 'rgba(0,0,0,.05)' }, ticks: { color: COLOR.steel, callback: (v) => v.toLocaleString() } },
          y: { grid: { display: false }, ticks: { color: COLOR.navy, font: { weight: 600 } } }
        }
      }
    });
  });

  /* --- 8.4 学历结构 --- */
  makeChart('eduChart', (canvas) => {
    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['博士', '硕士', '本科', '专科及以下'],
        datasets: [{
          data: [2.3, 16.3, 58.2, 23.2],
          backgroundColor: [COLOR.crimson, COLOR.gold, COLOR.navy, COLOR.steel],
          borderWidth: 3, borderColor: '#fff',
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 10, padding: 10, font: { size: 11 } } },
          tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%` } }
        },
        cutout: '55%'
      }
    });
  });

  /* --- 8.5 岗位分布 polar --- */
  makeChart('roleChart', (canvas) => {
    new Chart(canvas, {
      type: 'polarArea',
      data: {
        labels: ['工程技术', '项目管理', '施工作业', '经营财务', '人力行政', '党建文化'],
        datasets: [{
          data: [28, 22, 30, 8, 7, 5],
          backgroundColor: [
            'rgba(196,154,44,.7)', 'rgba(11,36,71,.7)', 'rgba(169,50,38,.65)',
            'rgba(31,97,141,.6)', 'rgba(20,143,119,.6)', 'rgba(125,60,152,.6)'
          ],
          borderColor: '#fff', borderWidth: 2
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'right', labels: { boxWidth: 10, padding: 8, font: { size: 11 } } } },
        scales: { r: { grid: { color: 'rgba(0,0,0,.06)' }, ticks: { display: false }, pointLabels: { display: false } } }
      }
    });
  });

  /* --- 8.6 人才雷达 --- */
  makeChart('radarChart', (canvas) => {
    new Chart(canvas, {
      type: 'radar',
      data: {
        labels: ['战略契合', '继任充足', '关键岗密度', '流失风险(反)', '敬业度', '数字能力'],
        datasets: [
          {
            label: '桥隧事业部',
            data: [82, 78, 85, 72, 88, 68],
            borderColor: COLOR.gold,
            backgroundColor: 'rgba(196,154,44,.18)',
            borderWidth: 2,
            pointBackgroundColor: COLOR.gold,
            pointRadius: 3
          },
          {
            label: '市政事业部',
            data: [76, 70, 78, 68, 82, 74],
            borderColor: COLOR.crimson,
            backgroundColor: 'rgba(169,50,38,.15)',
            borderWidth: 2,
            pointBackgroundColor: COLOR.crimson,
            pointRadius: 3
          },
          {
            label: '海外事业部',
            data: [72, 62, 70, 56, 78, 82],
            borderColor: COLOR.blue,
            backgroundColor: 'rgba(52,152,219,.15)',
            borderWidth: 2,
            pointBackgroundColor: COLOR.blue,
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 10, font: { size: 11 } } } },
        scales: {
          r: {
            min: 0, max: 100,
            grid: { color: 'rgba(11,36,71,.1)' },
            angleLines: { color: 'rgba(11,36,71,.1)' },
            pointLabels: { color: COLOR.navy, font: { size: 11, weight: 600 } },
            ticks: { stepSize: 20, color: COLOR.steel, backdropColor: 'transparent' }
          }
        }
      }
    });
  });

  /* --- 8.7 敬业度走势 --- */
  makeChart('engageChart', (canvas) => {
    new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月', '3月', '4月'],
        datasets: [{
          label: '敬业度指数',
          data: [4.12, 4.18, 4.08, 4.02, 4.15, 4.22, 4.25, 4.28, 4.22, 4.31, 4.34, 4.38],
          borderColor: COLOR.gold,
          backgroundColor: (ctx) => {
            const c = ctx.chart.ctx;
            const g = c.createLinearGradient(0, 0, 0, 220);
            g.addColorStop(0, 'rgba(196,154,44,.35)');
            g.addColorStop(1, 'rgba(196,154,44,0)');
            return g;
          },
          fill: true, tension: .35,
          borderWidth: 2.5,
          pointRadius: 4, pointHoverRadius: 6,
          pointBackgroundColor: '#fff', pointBorderColor: COLOR.gold, pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 3.8, max: 4.5, grid: { color: 'rgba(0,0,0,.05)' }, ticks: { color: COLOR.steel } },
          x: { grid: { display: false }, ticks: { color: COLOR.steel, font: { size: 10 } } }
        }
      }
    });
  });

  /* --- 8.8 培训完成率 --- */
  makeChart('trainChart', (canvas) => {
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['高管层', '中层', '技术骨干', '新员工', '一线员工'],
        datasets: [{
          label: '完成率 (%)',
          data: [96, 88, 92, 82, 76],
          backgroundColor: [
            COLOR.gold, 'rgba(196,154,44,.85)', 'rgba(196,154,44,.7)',
            'rgba(196,154,44,.55)', 'rgba(196,154,44,.4)'
          ],
          borderRadius: 4
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: { min: 0, max: 100, grid: { color: 'rgba(0,0,0,.05)' }, ticks: { color: COLOR.steel, callback: (v) => v + '%' } },
          y: { grid: { display: false }, ticks: { color: COLOR.navy, font: { weight: 600 } } }
        }
      }
    });
  });

  /* --- 8.9 休息质量 × 工作态度 散点 + 回归 --- */
  makeChart('restChart', (canvas) => {
    const rng = (seed) => { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; };
    const r = rng(42);
    const points = [];
    for (let i = 0; i < 40; i++) {
      const x = 1 + r() * 4;
      const y = 1.2 + x * 0.68 + (r() - .5) * 1.2;
      points.push({ x, y: Math.max(1, Math.min(5, y)) });
    }
    const lineX = [1, 5];
    const lineY = lineX.map(x => 1.2 + x * 0.68);
    new Chart(canvas, {
      data: {
        datasets: [
          {
            type: 'scatter',
            label: '样本',
            data: points,
            backgroundColor: 'rgba(196,154,44,.55)',
            borderColor: COLOR.gold,
            pointRadius: 3
          },
          {
            type: 'line',
            label: '拟合',
            data: lineX.map((x, i) => ({ x, y: lineY[i] })),
            borderColor: COLOR.crimson,
            borderWidth: 2.5,
            fill: false, tension: 0,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            title: { display: true, text: '休息质量', color: 'rgba(255,255,255,.7)', font: { size: 10 } },
            min: 1, max: 5, grid: { color: 'rgba(196,154,44,.08)' },
            ticks: { color: 'rgba(255,255,255,.5)', font: { size: 9 } }
          },
          y: {
            title: { display: true, text: '敬业度', color: 'rgba(255,255,255,.7)', font: { size: 10 } },
            min: 1, max: 5, grid: { color: 'rgba(196,154,44,.08)' },
            ticks: { color: 'rgba(255,255,255,.5)', font: { size: 9 } }
          }
        }
      }
    });
  });

  /* --- 8.10 加班 × 倦怠 非线性 --- */
  makeChart('burnoutChart', (canvas) => {
    const xs = []; const ys = [];
    for (let x = 20; x <= 90; x += 2) {
      xs.push(x);
      let y;
      if (x < 52) y = 2.0 + (x - 20) * 0.015;
      else y = 2.48 + Math.pow((x - 52) / 12, 1.6) * 0.4;
      y += (Math.sin(x) * 0.05);
      ys.push({ x, y: Math.min(5, y) });
    }
    new Chart(canvas, {
      type: 'line',
      data: {
        datasets: [
          {
            label: '倦怠得分',
            data: ys,
            borderColor: COLOR.gold,
            backgroundColor: (ctx) => {
              const c = ctx.chart.ctx;
              const g = c.createLinearGradient(0, 0, 0, 160);
              g.addColorStop(0, 'rgba(196,154,44,.35)');
              g.addColorStop(1, 'rgba(196,154,44,0)');
              return g;
            },
            fill: true, tension: .25,
            borderWidth: 2.5, pointRadius: 0
          },
          {
            label: '警戒线 (68h)',
            data: [{ x: 68, y: 0 }, { x: 68, y: 5 }],
            borderColor: COLOR.red,
            borderWidth: 1.5, borderDash: [4, 4],
            pointRadius: 0, fill: false
          },
          {
            label: '拐点 (52h)',
            data: [{ x: 52, y: 0 }, { x: 52, y: 5 }],
            borderColor: COLOR.goldLight,
            borderWidth: 1.5, borderDash: [4, 4],
            pointRadius: 0, fill: false
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            type: 'linear', min: 20, max: 90,
            title: { display: true, text: '周均加班 (h)', color: 'rgba(255,255,255,.7)', font: { size: 10 } },
            grid: { color: 'rgba(196,154,44,.08)' },
            ticks: { color: 'rgba(255,255,255,.5)', font: { size: 9 } }
          },
          y: {
            min: 1, max: 5,
            title: { display: true, text: '倦怠得分', color: 'rgba(255,255,255,.7)', font: { size: 10 } },
            grid: { color: 'rgba(196,154,44,.08)' },
            ticks: { color: 'rgba(255,255,255,.5)', font: { size: 9 } }
          }
        }
      }
    });
  });

  /* --- 8.11 数字化成熟度 --- */
  makeChart('maturityChart', (canvas) => {
    new Chart(canvas, {
      type: 'radar',
      data: {
        labels: ['战略对齐', '数据治理', '技术能力', '流程协同', '人才能力', '文化氛围'],
        datasets: [
          {
            label: 'TOP5 项目部',
            data: [88, 82, 90, 85, 80, 78],
            borderColor: COLOR.gold,
            backgroundColor: 'rgba(196,154,44,.2)',
            borderWidth: 2,
            pointBackgroundColor: COLOR.gold,
            pointRadius: 3
          },
          {
            label: '均值',
            data: [62, 58, 66, 60, 55, 52],
            borderColor: 'rgba(255,255,255,.4)',
            backgroundColor: 'rgba(255,255,255,.05)',
            borderWidth: 2, borderDash: [4, 3],
            pointBackgroundColor: 'rgba(255,255,255,.6)',
            pointRadius: 2
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: '#fff', boxWidth: 8, padding: 10, font: { size: 10 } } } },
        scales: {
          r: {
            min: 0, max: 100,
            grid: { color: 'rgba(196,154,44,.14)' },
            angleLines: { color: 'rgba(196,154,44,.14)' },
            pointLabels: { color: 'rgba(255,255,255,.75)', font: { size: 9 } },
            ticks: { stepSize: 25, color: 'rgba(255,255,255,.4)', backdropColor: 'transparent', font: { size: 9 } }
          }
        }
      }
    });
  });

  chartQueue.forEach(q => chartIO.observe(q.el));

  /* ---------- 9. Heatmap 渲染 ---------- */
  const heatmapEl = document.getElementById('heatmap');
  if (heatmapEl) {
    const bizLines = ['公路', '桥梁', '隧道', '市政', '海外', '数字化'];
    const levels = ['C 级 (一线)', 'B 级 (骨干)', 'A 级 (管理)', 'S 级 (高管)'];
    const matrix = [
      [12, 9, 7, 11, 18, 22],
      [8, 6, 5, 8, 14, 17],
      [5, 4, 4, 6, 10, 12],
      [3, 2, 2, 3, 6, 8]
    ];
    const colorFor = (v) => {
      const t = v / 24;
      const r = Math.round(11 + (232 - 11) * t);
      const g = Math.round(36 + (76 - 36) * t);
      const b = Math.round(71 + (60 - 71) * t);
      return `rgb(${r},${g},${b})`;
    };
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createElement('div'));
    bizLines.forEach(b => {
      const el = document.createElement('div');
      el.className = 'hr-heatmap__label';
      el.style.justifyContent = 'center';
      el.textContent = b;
      frag.appendChild(el);
    });
    levels.forEach((lvl, i) => {
      const label = document.createElement('div');
      label.className = 'hr-heatmap__label';
      label.textContent = lvl;
      frag.appendChild(label);
      matrix[i].forEach(v => {
        const cell = document.createElement('div');
        cell.className = 'hr-heatmap__cell';
        cell.style.background = colorFor(v);
        cell.textContent = v + '%';
        cell.title = `预测 12 个月离职概率：${v}%`;
        frag.appendChild(cell);
      });
    });
    heatmapEl.appendChild(frag);
  }

  /* ---------- 10. Active nav highlight ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav__links a');
  const activeIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navAnchors.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === `#${id}`) {
            a.style.color = COLOR.gold;
          }
        });
      }
    });
  }, { threshold: .3 });
  sections.forEach(s => activeIO.observe(s));

  /* ---------- 11. Console Easter egg ---------- */
  console.log('%c 浙江交工集团股份有限公司 ', 'background:#0B2447;color:#C49A2C;font-size:18px;font-weight:700;padding:12px 20px;border-radius:4px;');
  console.log('%c Designed & Built by Wei Xiaochong (魏小冲) ', 'color:#C49A2C;font-weight:600;font-size:13px;padding:6px 0;');
  console.log('%c This site is a portfolio piece — reach me via wen210845@gmail.com', 'color:#5D6D7E;font-size:11px;');
})();
