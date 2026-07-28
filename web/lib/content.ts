export type Lang = "zh" | "en";

export const contact = {
  phone: "185 1973 9539",
  phoneHref: "tel:18519739539",
  hours: { zh: "9:00 – 21:00", en: "9:00 – 21:00" },
  cities: { zh: "北京 · 杭州", en: "Beijing · Hangzhou" },
  qr: "https://s2.loli.net/2025/10/17/MT5Pt7jcHoylQWh.jpg",
  founderImage: "https://s2.loli.net/2025/10/17/TyMv2olG9kPanqQ.png",
};

export const nav = {
  intro: { zh: "开场", en: "Intro" },
  method: { zh: "方法", en: "Method" },
  systems: { zh: "系统", en: "Systems" },
  cases: { zh: "案例", en: "Cases" },
  team: { zh: "团队", en: "Team" },
  contact: { zh: "联系", en: "Contact" },
  book: { zh: "预约咨询", en: "Book consult" },
  menu: { zh: "菜单", en: "Menu" },
  close: { zh: "关闭", en: "Close" },
  scroll: { zh: "继续滚动", en: "Scroll to continue" },
} as const;

export const preloader = {
  loading: { zh: "进入引力场…", en: "Entering orbit…" },
  ready: { zh: "就绪", en: "Ready" },
} as const;

export const hero = {
  kicker: { zh: "引力坊教育 · GRAVITY FANG", en: "GRAVITY FANG EDU" },
  titleA: "GRAVITY",
  titleB: "FANG",
  claim: {
    zh: "名校路径，精确规划。",
    en: "Elite paths. Precision planning.",
  },
  body: {
    zh: "顶尖申请咨询，配上我们自研的规划系统。顾问负责判断与陪伴，系统负责结构与执行。",
    en: "Elite admissions counseling, backed by systems we build. Advisors judge and guide; software structures and executes.",
  },
  cta: { zh: "预约咨询", en: "Book a consult" },
  secondary: { zh: "了解系统", en: "See systems" },
  /** translucent card, bottom-left of the intro frame */
  cardTitle: {
    zh: "双城服务：北京与杭州，中英双语交付。",
    en: "DUAL-CITY SERVICE: BEIJING & HANGZHOU, DELIVERED BILINGUALLY.",
  },
  cardNote: {
    zh: "顾问负责判断，系统负责执行。",
    en: "Advisors judge. Systems execute.",
  },
} as const;

export const manifesto = {
  label: { zh: "01 · 重新定义", en: "01 · Reframe" },
  heading: {
    zh: "不只是中介。",
    en: "Not just an agency.",
  },
  body: {
    zh: "我们做传统精英咨询该做的事：定位、文书、面试、路径。同时自研 Terra 与三端小程序，让决策可复盘、执行可追踪。软件仍在迭代；能力已经在场。",
    en: "We do what elite counseling should: positioning, essays, interviews, pathways. We also build Terra and three companion apps so decisions are reviewable and execution is trackable. Software still iterates; the capability is already here.",
  },
} as const;

export const method = {
  label: { zh: "02 · 方法", en: "02 · Method" },
  heading: {
    zh: "一条路径，拆到可执行。",
    en: "One path, broken into executable steps.",
  },
  stages: [
    {
      id: "01",
      title: { zh: "定位", en: "Position" },
      body: {
        zh: "目标校与专业边界先画清楚，再谈材料堆砌。",
        en: "Draw school and major boundaries before stacking materials.",
      },
    },
    {
      id: "02",
      title: { zh: "档案", en: "Profile" },
      body: {
        zh: "竞赛、科研、标化协同，每一项都有叙事理由。",
        en: "Contests, research, tests aligned—each line earns its place.",
      },
    },
    {
      id: "03",
      title: { zh: "文书", en: "Essays" },
      body: {
        zh: "深度打磨声音与结构，拒绝模板腔。",
        en: "Craft voice and structure. No template tone.",
      },
    },
    {
      id: "04",
      title: { zh: "面试", en: "Interview" },
      body: {
        zh: "模拟高压场景，把表达校准到招生官逻辑。",
        en: "Pressure drills calibrated to admissions logic.",
      },
    },
    {
      id: "05",
      title: { zh: "录取", en: "Outcome" },
      body: {
        zh: "结果可核对；路径可复盘。",
        en: "Outcomes verifiable; paths reviewable.",
      },
    },
  ],
} as const;

export const systems = {
  label: { zh: "03 · 系统", en: "03 · Systems" },
  heading: {
    zh: "Terra 总台，三端环绕。",
    en: "Terra at the core. Three satellites.",
  },
  body: {
    zh: "传统咨询是主线。自研软件证明我们如何规模化「精确」。以下为展示级界面，产品持续迭代；需要演示请预约。",
    en: "Counseling is the spine. Software shows how we scale precision. Showcase UI only—products iterate. Book a walkthrough for demos.",
  },
  hub: {
    name: "Terra",
    title: { zh: "申请规划总台", en: "Admissions command deck" },
    body: {
      zh: "进度、任务、材料与节点决策集中在一处，顾问与学生同一真相源。",
      en: "Progress, tasks, materials, and decision points in one place—one source of truth for advisors and students.",
    },
  },
  satellites: [
    {
      id: "life-echo",
      name: { zh: "Life-echo 测评", en: "Life-echo" },
      body: {
        zh: "以结构化测评打开自我叙事，为定位与文书提供证据而非空话。",
        en: "Structured assessment that grounds self-narrative for positioning and essays.",
      },
    },
    {
      id: "school",
      name: { zh: "智能选校", en: "School matching" },
      body: {
        zh: "多维条件收敛选校清单，减少拍脑袋与信息过载。",
        en: "Constrain school lists with multi-factor matching—less guesswork, less noise.",
      },
    },
    {
      id: "mail",
      name: { zh: "申请邮箱", en: "Admissions mail" },
      body: {
        zh: "申请相关通信结构化归档，关键节点不丢、可追踪。",
        en: "Structure admissions correspondence so critical threads stay traceable.",
      },
    },
  ],
  infra: {
    zh: "底层通信与自动化由 mail-agent 等基础设施支撑（持续迭代）。",
    en: "Comms automation rides on infrastructure like mail-agent (actively evolving).",
  },
  cta: { zh: "预约系统演示", en: "Book a systems demo" },
  badge: { zh: "迭代中 · 展示级", en: "In iteration · Showcase" },
} as const;

export const cases = {
  label: { zh: "04 · 案例", en: "04 · Cases" },
  heading: { zh: "结果说话。", en: "Results speak." },
  body: {
    zh: "背景不同，方法一致：定位清楚，执行到位。",
    en: "Different profiles. Same method: clear position, disciplined execution.",
  },
  browse: { zh: "全部案例", en: "All cases" },
  featured: [
    {
      school: "Imperial College",
      major: "Mechanical Engineering",
      level: { zh: "本科", en: "UG" },
      note: { zh: "数学优异 · 面试突出", en: "Strong maths · Standout interview" },
    },
    {
      school: "Oxford",
      major: "MPhil Economics",
      level: { zh: "硕博", en: "Grad" },
      note: { zh: "一等荣誉 · 研究轨迹", en: "First-class · Clear research arc" },
    },
    {
      school: "Stanford",
      major: "Symbolic Systems",
      level: { zh: "本科", en: "UG" },
      note: { zh: "跨学科 AI 项目", en: "Interdisciplinary AI work" },
    },
    {
      school: "Cornell",
      major: "Computer Science",
      level: { zh: "本科", en: "UG" },
      note: { zh: "工程实践与竞赛", en: "Engineering practice & contests" },
    },
  ],
  all: [
    { school: "Imperial College London", major: "Mechanical Engineering", background: "4A*, STEP II" },
    { school: "Oxford University", major: "MPhil Economics", background: "First Class Honours, IELTS 8.0" },
    { school: "Cambridge University", major: "Chemistry", background: "3A*1A, IELTS 7.5" },
    { school: "Stanford University", major: "Symbolic Systems", background: "SAT 1570, Published Research" },
    { school: "ETH Zurich", major: "M.S. Robotics, Systems & Control", background: "B.S. MechE, 3.95 GPA" },
    { school: "NUS", major: "Business Administration", background: "IB 44/45, Leadership ECA" },
    { school: "UCLA", major: "Computer Science", background: "SAT 1550, 4.0 GPA, 10 APs" },
    { school: "Columbia University", major: "M.S. Data Science", background: "GRE 330, 3.9 GPA" },
    { school: "University of Toronto", major: "Rotman Commerce", background: "IB 43/45, Founder of NPO" },
    { school: "NTU", major: "M.Eng Aerospace", background: "B.Eng with High Honours" },
    { school: "HKU", major: "Electronic Engineering", background: "4A*, Factory Volunteering" },
    { school: "Johns Hopkins", major: "M.S. Finance", background: "GMAT 740, 3.8 GPA" },
    { school: "Cornell University", major: "Biological Engineering", background: "TOEFL 111, ACT 35, 9 APs" },
    { school: "LSE", major: "MSc Management", background: "2:1 Degree, Relevant Internships" },
    { school: "INSEAD", major: "MBA", background: "GMAT 730, 5 Years WE at FAANG" },
  ],
} as const;

export const team = {
  label: { zh: "05 · 团队", en: "05 · Team" },
  heading: { zh: "专业，可核对。", en: "Expertise you can verify." },
  members: [
    {
      name: "Mira Shi",
      image: "https://s2.loli.net/2025/10/19/zwLWpRCYuHk15cb.png",
      title: { zh: "创始人 & 首席顾问", en: "Founder & Chief Advisor" },
      body: {
        zh: "莱斯大学电子工程硕士，八年留学咨询经验。",
        en: "M.S. EE (Rice), eight years in counseling.",
      },
      tags: {
        zh: ["G5 申请", "工程专业", "AI 教育"],
        en: ["G5", "Engineering", "AI education"],
      },
    },
    {
      name: "Dr. Wilson",
      image: "https://s2.loli.net/2025/10/19/NpkFByY8g7JqMtZ.png",
      title: { zh: "学术总监", en: "Academic Director" },
      body: {
        zh: "宾大教育学博士，前招生官，十五年经验。",
        en: "PhD Education (UPenn), former admissions officer, 15 years.",
      },
      tags: {
        zh: ["招生政策", "文书指导", "学术规划"],
        en: ["Admissions policy", "Essays", "Academic planning"],
      },
    },
    {
      name: "Sarah Chen",
      image: "https://s2.loli.net/2025/10/19/Oiz3mZTEKS4pPLk.png",
      title: { zh: "资深顾问", en: "Senior Consultant" },
      body: {
        zh: "伯克利 MBA，专注商科与 STEM 路径。",
        en: "Berkeley MBA, focused on business and STEM paths.",
      },
      tags: {
        zh: ["商科申请", "STEM", "MBA 咨询"],
        en: ["Business", "STEM", "MBA"],
      },
    },
  ],
} as const;

/**
 * Act 6 (精密/材质) — decided: not its own chapter in V3-A.
 * A close-up beat that rides inside the manifesto stage.
 * Facts only — no invented admit rates.
 */
export const precision = {
  kicker: { zh: "精密", en: "Precision" },
  heading: {
    zh: "精确，来自可复盘的结构。",
    en: "Precision comes from reviewable structure.",
  },
  body: {
    zh: "每个判断都留下依据，每一步都能回看为什么这样决定。",
    en: "Every judgment leaves its reasoning behind, so any step can be revisited.",
  },
  facts: [
    { k: { zh: "双城", en: "Two cities" }, v: { zh: "北京 · 杭州", en: "Beijing · Hangzhou" } },
    { k: { zh: "双语", en: "Bilingual" }, v: { zh: "中文 · English", en: "中文 · English" } },
    {
      k: { zh: "背景", en: "Background" },
      v: { zh: "工程 · 招生", en: "Engineering · Admissions" },
    },
  ],
} as const;

export const voices = {
  label: { zh: "06 · 学员", en: "06 · Voices" },
  heading: { zh: "他们怎么说。", en: "In their words." },
  items: [
    {
      name: { zh: "李同学", en: "Li" },
      school: "Cornell",
      quote: {
        zh: "每一步都清楚为什么这样做，不是模板推送。",
        en: "Every step had a reason—not a template push.",
      },
    },
    {
      name: { zh: "王同学", en: "Wang" },
      school: "Barnard",
      quote: {
        zh: "拿到 Offer 与半额奖学金，沟通效率很高。",
        en: "Offer plus half scholarship. Efficient communication.",
      },
    },
    {
      name: { zh: "张同学", en: "Zhang" },
      school: "Imperial",
      quote: {
        zh: "工程背景给了我最贴切的建议。",
        en: "Engineering-aware advice that actually fit.",
      },
    },
  ],
} as const;

/**
 * Act 10 — 选配。Tier ids match footer.intents keys so a pill click
 * prefills the contact form intent.
 */
export const services = {
  label: { zh: "07 · 服务", en: "07 · Services" },
  heading: { zh: "选择你的路径。", en: "Choose your path." },
  body: {
    zh: "三种起点，同一套方法。先选一个，剩下的在对话里定。",
    en: "Three starting points, one method. Pick one—we settle the rest in conversation.",
  },
  tiers: [
    {
      id: "ug",
      name: { zh: "本科申请", en: "Undergraduate" },
      tagline: {
        zh: "从高一到录取的完整路径规划。",
        en: "Full pathway planning, from year one to the offer.",
      },
      points: {
        zh: ["选校与专业定位", "竞赛 · 科研 · 标化协同", "文书与面试打磨"],
        en: ["School & major positioning", "Contests, research, testing", "Essays & interview craft"],
      },
    },
    {
      id: "grad",
      name: { zh: "硕博申请", en: "Graduate" },
      tagline: {
        zh: "研究方向、导师匹配与申请材料。",
        en: "Research direction, advisor fit, and application materials.",
      },
      points: {
        zh: ["研究轨迹梳理", "导师与项目匹配", "PS · CV · 推荐信策略"],
        en: ["Research arc", "Advisor & program fit", "PS, CV, recommender strategy"],
      },
    },
    {
      id: "demo",
      name: { zh: "系统演示", en: "Systems demo" },
      tagline: {
        zh: "看 Terra 与三端如何支撑执行。",
        en: "See how Terra and its satellites carry execution.",
      },
      points: {
        zh: ["Terra 总台走查", "Life-echo 测评样例", "选校与邮箱模块"],
        en: ["Terra walkthrough", "Life-echo sample", "Matching & mail modules"],
      },
    },
  ],
  cta: { zh: "以此意向预约", en: "Book with this intent" },
} as const;

export const footer = {
  heading: { zh: "开始对话。", en: "Start a conversation." },
  sub: {
    zh: "双城服务。电话、微信，或留下信息。",
    en: "Dual-city service. Phone, WeChat, or leave a note.",
  },
  phoneLabel: { zh: "电话", en: "Phone" },
  wechatLabel: { zh: "微信", en: "WeChat" },
  scan: { zh: "扫码添加顾问", en: "Scan to add advisor" },
  hoursLabel: { zh: "工作时间", en: "Hours" },
  formTitle: { zh: "轻量预约", en: "Quick request" },
  name: { zh: "姓名", en: "Name" },
  reach: { zh: "电话 / 微信", en: "Phone / WeChat" },
  intent: { zh: "意向", en: "Intent" },
  intents: {
    ug: { zh: "本科申请", en: "Undergraduate" },
    grad: { zh: "硕博申请", en: "Graduate" },
    demo: { zh: "系统演示", en: "Systems demo" },
    other: { zh: "其他", en: "Other" },
  },
  message: { zh: "补充说明（可选）", en: "Notes (optional)" },
  submit: { zh: "提交", en: "Submit" },
  success: {
    zh: "已收到。我们会尽快联系你。（当前为前端占位，接口待接入）",
    en: "Received. We will reach out soon. (Frontend placeholder—API coming next.)",
  },
  copyright: "© GRAVITY FANG",
} as const;

export const navLinks = [
  { id: "intro", href: "#intro", key: "intro" as const },
  { id: "method", href: "#method", key: "method" as const },
  { id: "systems", href: "#systems", key: "systems" as const },
  { id: "cases", href: "#cases", key: "cases" as const },
  { id: "team", href: "#team", key: "team" as const },
  { id: "contact", href: "#contact", key: "contact" as const },
] as const;
