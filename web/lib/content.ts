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
  about: { zh: "关于", en: "About" },
  services: { zh: "服务", en: "Services" },
  cases: { zh: "案例", en: "Cases" },
  team: { zh: "团队", en: "Team" },
  contact: { zh: "联系我们", en: "Contact" },
  start: { zh: "立即规划", en: "Start planning" },
  menu: { zh: "菜单", en: "Menu" },
  close: { zh: "关闭", en: "Close" },
} as const;

export const hero = {
  kicker: { zh: "引力坊教育 · GRAVITY FANG", en: "GRAVITY FANG EDU" },
  titleLine1: "GRAVITY",
  titleLine2: "FANG",
  claim: {
    zh: "名校路径，精确规划。",
    en: "Elite admissions, planned with precision.",
  },
  body: {
    zh: "面向 G5、常春藤与全球顶尖硕博申请。以工程与 AI 背景做决策，用可验证结果建立信任。",
    en: "For G5, Ivy League, and top global graduate pathways. Engineering and AI literacy guide decisions; verifiable outcomes build trust.",
  },
  cta: { zh: "预约咨询", en: "Book a consult" },
  secondary: { zh: "浏览案例", en: "View cases" },
} as const;

export const about = {
  label: { zh: "01 · 创始人", en: "01 · Founder" },
  name: "Mira Shi",
  role: { zh: "创始人 & 首席顾问", en: "Founder & Chief Advisor" },
  body: {
    zh: "莱斯大学电子工程硕士，八年留学咨询经验。把系统工程的拆解方式带入申请：目标清晰、路径可执行、每一步可复盘。",
    en: "M.S. in Electrical Engineering (Rice). Eight years in admissions counseling. She brings systems thinking into applications: clear targets, executable paths, and reviewable steps.",
  },
  tags: {
    zh: ["G5 申请", "工程与 STEM", "AI 教育"],
    en: ["G5 applications", "Engineering & STEM", "AI in education"],
  },
} as const;

export const services = {
  label: { zh: "02 · 服务", en: "02 · Services" },
  heading: {
    zh: "三件事，做到位。",
    en: "Three things, done precisely.",
  },
  items: [
    {
      id: "01",
      title: { zh: "海外升学咨询", en: "Admissions consulting" },
      body: {
        zh: "从定位、选校到文书与面试，全流程精确制导，减少无效试错。",
        en: "From positioning and school lists to essays and interviews: full-cycle guidance with less wasted motion.",
      },
      points: {
        zh: ["精准选校定位", "文书深度打磨", "面试模拟辅导"],
        en: ["School list strategy", "Essay craft", "Interview coaching"],
      },
    },
    {
      id: "02",
      title: { zh: "精英教育培训", en: "Profile & academics" },
      body: {
        zh: "标准化考试、竞赛与科研实习路径协同，简历每一项都有理由。",
        en: "Tests, competitions, and research paths aligned so every line on the resume has a reason.",
      },
      points: {
        zh: ["标准化考试", "高含金量竞赛", "科研实习内推"],
        en: ["Standardized tests", "High-signal competitions", "Research referrals"],
      },
    },
    {
      id: "03",
      title: { zh: "AI 决策工具", en: "AI decision tools" },
      body: {
        zh: "用数据辅助选校与职业映射，让判断更冷静，而不是更热闹。",
        en: "Data-assisted school and career mapping: calmer decisions, not louder dashboards.",
      },
      points: {
        zh: ["智能选校", "职业路径映射", "录取概率参考"],
        en: ["School matching", "Career path maps", "Admission probability cues"],
      },
    },
  ],
} as const;

export const cases = {
  label: { zh: "03 · 案例", en: "03 · Cases" },
  heading: { zh: "结果说话。", en: "Results speak." },
  body: {
    zh: "精选录取结果。背景不同，方法一致：定位清楚，执行到位。",
    en: "Selected outcomes. Different profiles, same method: clear positioning, disciplined execution.",
  },
  browse: { zh: "查看全部案例", en: "Browse all cases" },
  archive: { zh: "案例归档", en: "Case archive" },
  featured: [
    {
      school: "Imperial College",
      major: "Mechanical Engineering",
      level: { zh: "本科", en: "Undergraduate" },
      note: { zh: "数学优异 · 面试表现突出", en: "Strong maths · Standout interview" },
    },
    {
      school: "Oxford",
      major: "MPhil Economics",
      level: { zh: "硕博", en: "Graduate" },
      note: { zh: "一等荣誉 · 研究轨迹清晰", en: "First-class honours · Clear research arc" },
    },
    {
      school: "Stanford",
      major: "Symbolic Systems",
      level: { zh: "本科", en: "Undergraduate" },
      note: { zh: "跨学科 AI 项目", en: "Interdisciplinary AI work" },
    },
    {
      school: "Cornell",
      major: "Computer Science",
      level: { zh: "本科", en: "Undergraduate" },
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
    { school: "McGill University", major: "Political Science", background: "Model UN President, IELTS 8.5" },
    { school: "LSE", major: "MSc Management", background: "2:1 Degree, Relevant Internships" },
    { school: "CUHK", major: "M.S. FinTech", background: "GRE 328, Big Four Internship" },
    { school: "HKUST", major: "MSc Financial Technology", background: "GRE 325, 3.7 GPA" },
    { school: "Pomona College", major: "Sociology", background: "TOEFL 108, SAT 1500, 6 APs" },
    { school: "INSEAD", major: "MBA", background: "GMAT 730, 5 Years WE at FAANG" },
    { school: "UBC", major: "M.A.Sc. Civil Engineering", background: "3.8 GPA, Co-op Experience" },
  ],
} as const;

export const team = {
  label: { zh: "04 · 团队", en: "04 · Team" },
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

export const voices = {
  label: { zh: "05 · 学员", en: "05 · Voices" },
  heading: { zh: "他们怎么说。", en: "In their words." },
  items: [
    {
      name: { zh: "李同学", en: "Li" },
      school: "Cornell",
      quote: {
        zh: "专业指导让我成功进入梦校，每一步都清楚为什么这样做。",
        en: "Clear guidance got me into my dream school. Every step had a reason.",
      },
    },
    {
      name: { zh: "王同学", en: "Wang" },
      school: "Barnard",
      quote: {
        zh: "拿到了 Offer，还有半额奖学金。沟通效率很高。",
        en: "Offer plus half scholarship. Communication was efficient.",
      },
    },
    {
      name: { zh: "张同学", en: "Zhang" },
      school: "Imperial",
      quote: {
        zh: "工程背景给了我最贴切的建议，不是模板话术。",
        en: "Engineering-aware advice, not template talk.",
      },
    },
  ],
} as const;

export const footer = {
  heading: { zh: "开始对话。", en: "Start a conversation." },
  sub: {
    zh: "双城服务，就近咨询。电话或微信均可。",
    en: "Dual-city service. Phone or WeChat.",
  },
  phoneLabel: { zh: "电话", en: "Phone" },
  wechatLabel: { zh: "微信", en: "WeChat" },
  scan: { zh: "扫码添加顾问", en: "Scan to add advisor" },
  hoursLabel: { zh: "工作时间", en: "Hours" },
  note: {
    zh: "工作日与周末均可预约。我们会尽快回复。",
    en: "Weekdays and weekends. We respond promptly.",
  },
  copyright: "© GRAVITY FANG",
} as const;
