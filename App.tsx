import { HashRouter, Routes, Route, Link, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

// 移动端图片放大查看组件
function MobileImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onPrev,
  onNext
}: {
  images: { src: string | null; label: string }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const diffY = touchStartY.current - touchEndY;
    const diffX = touchStartX.current - touchEndX;

    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
      if (diffY > 0) onNext();
      else onPrev();
    }
  };

  if (!isOpen) return null;

  const image = images[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="absolute top-4 left-4 text-white/80 text-sm font-sans">
        {currentIndex + 1} / {images.length}
      </div>

      <div
        className="flex-1 flex items-center justify-center p-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={image.src || ''}
            alt={image.label}
            className="max-w-full max-h-full object-contain"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          />
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 left-0 right-0 text-center text-white/60 text-xs font-sans">
        上下滑动切换图片 · 点击空白处关闭
      </div>
    </motion.div>
  );
}

// 项目图片轮播组件
function ProjectImageGallery({ project }: { project: typeof projects[0] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const images = project.images.map((src, i) => ({ src, label: `图片 ${i + 1}` }));

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (e.type === 'touchstart') {
      touchStartY.current = (e as React.TouchEvent).touches[0].clientY;
      touchStartX.current = (e as React.TouchEvent).touches[0].clientX;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (e.type === 'touchend') {
      const touchEndY = (e as React.TouchEvent).changedTouches[0].clientY;
      const touchEndX = (e as React.TouchEvent).changedTouches[0].clientX;
      const diffX = touchStartX.current - touchEndX;

      if (Math.abs(diffX) > 50) {
        if (diffX > 0) goToNext();
        else goToPrev();
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const diffX = touchStartX.current - e.clientX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) goToNext();
      else goToPrev();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.deltaY > 0 || e.deltaX > 0) {
      goToNext();
    } else if (e.deltaY < 0 || e.deltaX < 0) {
      goToPrev();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToPrev();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35 }}
      className="mb-16"
    >
      <div className="flex flex-col items-stretch">
        <div
          ref={containerRef}
          className="relative overflow-hidden bg-neutral-100 cursor-grab active:cursor-grabbing w-full"
          style={{ height: isMobile ? '25vh' : '70vh' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
        >
          <div
            className="flex transition-transform duration-500 ease-out h-full"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              flexDirection: 'row'
            }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="w-full h-full flex-shrink-0 flex items-center justify-center bg-neutral-100"
              >
                <img
                  src={image.src}
                  alt={`${project.title} - ${image.label}`}
                  className="w-full h-full object-contain cursor-pointer"
                  draggable={false}
                  onClick={() => isMobile && setIsLightboxOpen(true)}
                />
              </div>
            ))}
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/90 hover:bg-white text-neutral-600 hover:text-neutral-900 transition-all duration-300 opacity-0 hover:opacity-100"
                style={{ opacity: 0.8 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/90 hover:bg-white text-neutral-600 hover:text-neutral-900 transition-all duration-300 opacity-0 hover:opacity-100"
                style={{ opacity: 0.8 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-white/90 text-xs text-neutral-600 font-sans tracking-chinese">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 w-8 h-1 rounded-full ${
                index === currentIndex ? 'bg-neutral-800' : 'bg-neutral-300'
              }`}
            />
          ))}
        </div>
      )}

      <p className="text-xs text-neutral-400 mt-4 text-center font-sans tracking-chinese">
        左右滑动、拖拽或使用键盘方向键切换图片
      </p>

      {isMobile && (
        <MobileImageLightbox
          images={images}
          currentIndex={currentIndex}
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      )}
    </motion.div>
  );
}

const projects = [
  {
    id: '01',
    title: '浮岚银盏 悬隆八境',
    subtitle: '清远市银盏片区文旅资源开发利用方案',
    category: '文旅策划',
    year: '2023',
    description: '位于广清一体化核心区域，以"延长链、强引擎、补缺位、育新核、明导向、固本底"的发展思路，构建银盏"悬隆八境"文旅新故事。',
    infoCards: [
      { label: '地点', text: '广东清远' },
      { label: '类型', text: '文旅策划' },
      { label: '设计团队', text: '粤规科技集团 规划四所' }
    ],
    tags: ['文旅融合', '温泉度假', '乡村振兴'],
    thumbnail: '/images/projects/thumb_01.png',
    images: [
      '/images/projects/project_01_01.png',
      '/images/projects/project_01_02.png',
      '/images/projects/project_01_03.png',
      '/images/projects/project_01_04.png'
    ],
    content: {
      background: '银盏片区位于广清一体化核心区域，拥有"自然、城市、乡村、产业"复合型环境。片区生态优势明显，但面临可建设土地紧缺与资源粗放利用并存、长隆IP虽已入驻但不足以整合三镇资源、城市配套空间小而散且品质不高等问题。规划旨在通过重整资源，构建全新的城市秩序和格局。',
      concept: '以"<strong>浮岚银盏，悬隆八境</strong>"为愿景，提出"固本底、延长链、强引擎、补缺位、育新核、明导向"的策略。规划构建了"1+1+4"的产品体系，旨在打造"奇、幻、泉、艺、趣、野、农旅、研学"八种情境，利用"磁悬浮+旅游专线"作为链接区域的超级符号，重塑银盏活力心脏。',
      highlights: [
        '磁悬浮赋能：依托磁悬浮特色交通，打造"磁悬浮+旅游专线"品牌，形成强有力的品牌记忆点。',
        '空间重组：识别场地特征，以水网绿底为基础，构建功能与空间相异的五大旅游板块（功能聚落），通过交通联盟实现引流、导流与分流。',
        '土地盘活：充分发挥团队优势，提出全域土地综合整治和EOD开发模式的土地盘活路径，来应对产品开发过程中的面临的土地和资金问题，以推动产品落地实施。'
      ]
    }
  },
  {
    id: '02',
    title: '书沁红石 艺动塘尾',
    subtitle: '塘尾村"百千万工程"典型村建设提升规划',
    category: '古村更新',
    year: '2024',
    description: '依托国家级文物保护单位塘尾古村，提出"以文彰旅、以文促产、以文兴生"的发展策略，打造塘尾旅游品牌，升级文化体验形式与业态布局，提升用户粘性。',
    infoCards: [
      { label: '地点', text: '广东东莞' },
      { label: '类型', text: '古村更新' },
      { label: '设计团队', text: '粤规科技集团 规划四所' }
    ],
    tags: ['古村活化', '文化保护', '社区营造'],
    thumbnail: '/images/projects/thumb_02.png',
    images: [
      '/images/projects/project_02_01.png',
      '/images/projects/project_02_02.png',
      '/images/projects/project_02_03.png'
    ],
    content: {
      background: '塘尾村是国家级文物保护单位，拥有丰富的艺术底蕴与保存完好的明清古建筑群，为了系统推进塘尾村的乡村振兴，在"百千万工程"背景下，规划通过新文艺带动消费产业升级，探索传统村落的现代活化路径。',
      concept: '以"<strong>书沁红石，艺动塘尾</strong>"为主题，提出"古韵·艺趣"的乡村空间营造理念。通过历史文化、艺术创意、生态自然与产业功能的流动联结，实施"以文彰旅、以文促产、以文兴生"发展策略，聚焦用户体验、业态转化及场景升级，将文艺符号转译为旅游体验与消费场景。',
      highlights: [
        '时光隧道创意体验：科技赋能，打造"农耕文明-世界工厂-艺术联盟"三阶段的人物场景叙事，结合互动展示增强体验感。',
        '新消费场景构建：改造旧市场为"莲溪"梦工场沉浸式商业综合体，打造"蓬溪"活力后街与青年创意集市，构建"两轴一环三区"的规划结构。'
      ]
    }
  },
  {
    id: '03',
    title: '江月依旧 铁骨新生',
    subtitle: '白沙沱长江大桥遗址公园·博物馆概念设计',
    category: '遗产保护',
    year: '2021',
    description: '白沙沱长江大桥因安全隐患启动局部保护性拆除，项目以"延续历史、重构再生"为理念，将拆除构件用于建设遗址公园与博物馆，实现文物活化与时空叙事。',
    infoCards: [
      { label: '地点', text: '重庆大渡口' },
      { label: '类型', text: '遗产保护' },
      { label: '设计团队', text: '胡斌工作室' },
      { label: '指导老师', text: '胡斌' }
    ],
    tags: ['工业遗产', '桥梁博物馆', '遗址公园'],
    thumbnail: '/images/projects/thumb_03.png',
    images: [
      '/images/projects/project_03_01.png',
      '/images/projects/project_03_02.png',
      '/images/projects/project_03_03.png'
    ],
    content: {
      background: '白沙沱长江大桥见证了中国铁路建设史，为市级文物保护单位。随着新桥建成，老桥河道安全事故频发，需进行通航安全整改，对老桥进行保护性拆除。为充分发挥文物价值，设计核心旨在争取最大化保护文物本体、最大程度利用拆除文物构件，以延续历史、再现文物活力。',
      concept: '以"<strong>江月依旧，铁骨新生</strong>"为核心，提出"延续历史、重构再生、时空交叠"的思路。采用"局部保护、部分拆除利用"的原则，利用拆除的文物构件再造遗址公园景观与博物馆，实现工业遗产的涅槃重生。',
      highlights: [
        '原址保护：北岸保留0#~2#桥墩原址保护，南岸保留12#~16#桥墩，拆除部分主桥体以释放560m通航水域（满足规范350m要求），设计全息投影再现文物原初景观。',
        '构件再生：将拆除的主桥2跨钢桁架（160m）拆分为四段，重构为1600m²的桥梁遗址博物馆；利用引桥钢板梁打造景观桥与屋面。'
      ]
    }
  },
  {
    id: '04',
    title: '行道 望水 陶烟轻',
    subtitle: '鄂西南土家族聚落保护与更新规划设计',
    category: '乡村振兴',
    year: '2020',
    description: '纳水溪村作为传统土家族村落，依托"古盐道、纳水溪、水碓制陶"特色资源，激活古盐道集市文化及历史建筑价值、活化纳水溪、打造沿溪空间，重塑村民精神文化中心。',
    infoCards: [
      { label: '地点', text: '湖北恩施' },
      { label: '类型', text: '乡村振兴' },
      { label: '合作成员', text: '温馨' },
      { label: '指导老师', text: '李晓峰' }
    ],
    tags: ['传统村落', '民族聚落', '村民中心'],
    thumbnail: '/images/projects/thumb_04.png',
    images: [
      '/images/projects/project_04_01.png',
      '/images/projects/project_04_02.png',
      '/images/projects/project_04_03.png',
      '/images/projects/project_04_04.png'
    ],
    content: {
      background: '纳水溪村是入选第五批中国传统村落的土家族民族村，背山面水，拥有古盐道、纳水溪、水碓制陶等特色资源。但村落面临衰败、经济水平低、空心化严重等问题。规划旨在通过保护更新恢复村民精神文化中心。',
      concept: '提出"<strong>行道·望水·陶烟轻</strong>"的概念，基于不同的组团模式采取差异化策略，旨在激活古盐道集市文化、活化纳水溪沿溪空间、发展水碓制瓷文创体验，保护土家族传统建筑风貌，设计重点结合闲置关帝庙打造乡村文化活动中心，复兴村落集体记忆与文化认同。',
      highlights: [
        '闲置建筑活化：激活村中闲置关帝庙和周边建筑，重置建筑功能，引入"屋中屋"等手法，最大化发挥历史建筑价值、展示传统村落建筑魅力，重筑村民情感归属与精神家园。',
        '文旅业态焕新：梳理古盐道历史脉络，营造纳水溪多元亲水体验，恢复水碓制陶传统，培育乡村文创产业，解决村落业态单一问题，实现文化传承与经济发展的平衡，唤醒村落文化活力。'
      ]
    }
  },
  {
    id: '05',
    title: '星河欲转江帆舞',
    subtitle: '帆船复原与博物馆设计',
    category: '数字复原与建构',
    year: '2018',
    description: '帆船博物馆以"星河欲转千帆舞"为意象，运用数字化技术与空间叙事手法，重现旧时汉阳船文化盛况，让游客在历史与现代交融中沉浸式感受千帆竞发的壮阔与魅力。',
    infoCards: [
      { label: '地点', text: '湖北武汉' },
      { label: '类型', text: '数字复原与建构' },
      { label: '合作成员', text: '殷双 韩奇' },
      { label: '指导老师', text: '黄涛 刘小虎' }
    ],
    tags: ['数字复原', '沉浸式体验', '参数化设计'],
    thumbnail: '/images/projects/thumb_05.png',
    images: [
      '/images/projects/project_05_01.png',
      '/images/projects/project_05_02.png',
      '/images/projects/project_05_03.png'
    ],
    content: {
      background: '武汉曾是长江航运枢纽，旧时"千帆竞发"的盛景如今难觅。设计旨在利用现代数字化工具还原汉阳、汉江的船文化，保存和重现这段壮阔的历史故事，让逐渐消失的航运记忆重焕生机。',
      concept: '取意李清照词句"星河欲转千帆舞"，以"<strong>星河欲转江帆舞</strong>"为意境，博物馆设计通过数字算法生成具有"帆船"意向的建筑形体，结合数字技术复原帆船形态，实现历史记忆复原与现代建筑美学的结合。',
      highlights: [
        '数字化形体生成：利用Grasshopper算法，以点和曲线为要素，通过参数控制生成具有帆船意向且空间满足螺旋上升的建筑外壳。',
        '深度再现历史要素：深入研究历史文本，精确复原历史帆船形态，在景观设计中加入铁轨元素与根据历史地图重构的湖泊。',
        '多层次沉浸式展陈：游客可乘坐游船进入博物馆，360°观览复原的汉江帆船实体模型，利用数字技术打造全感官沉浸式场景，让游客穿越时空感受江上帆影的壮美。'
      ]
    }
  }
];

function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-sm' : 'bg-transparent'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/images/projects/home_main_bg.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/70" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-8 py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 text-xl font-light tracking-chinese-wide text-neutral-900 font-sans">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-300">
            <img
              src="/images/projects/avatar.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          ZOU YE
        </Link>
        <div className="flex gap-12 text-sm tracking-chinese font-sans font-medium">
          <Link to="/" className="text-neutral-600 hover:text-neutral-900 transition-colors">首页</Link>
          <Link to="/projects" className="text-neutral-600 hover:text-neutral-900 transition-colors">作品</Link>
          <Link to="/contact" className="text-neutral-600 hover:text-neutral-900 transition-colors">联系</Link>
        </div>
      </div>
    </motion.nav>
  );
}

function Home() {
  const [currentBg, setCurrentBg] = useState(0);
  const backgrounds = [
    '/images/projects/home_bg_01.png',
    '/images/projects/home_bg_02.png',
    '/images/projects/home_bg_03.png',
    '/images/projects/home_bg_04.png',
    '/images/projects/home_bg_05.png',
    '/images/projects/home_bg_06.png',
    '/images/projects/home_bg_07.png'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        {backgrounds.map((bg, index) => (
          <motion.div
            key={bg}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentBg ? 1 : 0 }}
            transition={{ duration: 1.5 }}
          >
            <img
              src={bg}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-white/60" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute left-4 md:left-8 top-0 bottom-0 z-10 flex items-center"
      >
        <div className="writing-vertical text-6xl md:text-8xl font-bold tracking-wider text-[#8B4A4A]/30 select-none"
             style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
          Portfolio
        </div>
      </motion.div>

      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs tracking-widest text-neutral-500 mb-4 font-sans"
          >
            [NARRATOR]
          </motion.p>
          <h1 className="text-5xl md:text-7xl font-light tracking-chinese-wide text-neutral-900 mb-4">
            邹晔
          </h1>
          <p className="text-base tracking-chinese text-neutral-500 mb-2 font-sans">
            Zou Ye | 2015-2025
          </p>
          <div className="mt-6 space-y-1 text-sm text-neutral-600 font-sans">
            <p>重庆大学硕士</p>
            <p>华中科技大学学士</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="absolute bottom-12"
        >
          <Link to="/projects" className="text-xs tracking-chinese text-neutral-700 hover:text-neutral-900 transition-colors border-b border-neutral-600 pb-1 font-sans">
            查看作品
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-8 right-8 z-10 flex gap-2">
        {backgrounds.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBg(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentBg ? 'bg-neutral-800 w-6' : 'bg-neutral-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Projects() {
  return (
    <div className="min-h-screen pt-32 px-8 max-w-6xl mx-auto">
      <div className="space-y-16">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <Link to={`/project/${project.id}`} className="group cursor-pointer block">
              <div className="flex items-start gap-6">
                <span className="text-xs text-neutral-400 tracking-chinese mt-2 font-sans w-6">{project.id}</span>
                <div className="flex-1">
                  <div className="flex items-baseline gap-4 mb-2">
                    <h3 className="text-xl font-bold text-neutral-900 group-hover:text-neutral-600 transition-colors tracking-chinese" style={{ fontFamily: 'Microsoft YaHei UI, sans-serif' }}>
                      {project.title}
                    </h3>
                    <span className="text-xs text-neutral-400 font-sans">{project.year}</span>
                  </div>
                  <p className="text-sm text-neutral-500 mb-2 font-sans tracking-chinese">{project.subtitle}</p>
                  <p className="text-sm text-neutral-400 leading-chinese max-w-xl">{project.description}</p>
                  <div className="mt-3">
                    <span className="text-xs text-neutral-300 tracking-chinese font-sans">{project.category}</span>
                  </div>
                </div>
                <div className="w-32 h-32 flex-shrink-0 overflow-hidden bg-neutral-100">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen pt-32 px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-2xl text-neutral-400 mb-4">项目未找到</h2>
          <Link to="/projects" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
            返回作品列表
          </Link>
        </motion.div>
      </div>
    );
  }

  const currentIndex = projects.findIndex(p => p.id === id);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;
  const isLastProject = currentIndex === projects.length - 1;

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-5xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-900 transition-colors tracking-chinese font-sans group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            返回作品
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-xs text-neutral-400 tracking-chinese font-sans">{project.id}</span>
            <span className="text-xs text-neutral-400 font-sans">{project.year}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-chinese mb-4" style={{ fontFamily: 'Microsoft YaHei UI, sans-serif' }}>
            {project.title}
          </h1>
          <p className="text-lg text-neutral-500 font-sans tracking-chinese">
            {project.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 py-8 border-t border-b border-neutral-200"
        >
          {project.infoCards.map((card, index) => (
            <div key={index}>
              <p className="text-xs text-neutral-400 mb-2 tracking-chinese font-sans">{card.label}</p>
              <p className="text-sm text-neutral-700 font-sans">{card.text}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-3 mb-16"
        >
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className="px-4 py-2 text-xs text-neutral-600 bg-neutral-100 tracking-chinese font-sans"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        <ProjectImageGallery project={project} />

        <div className="space-y-16">
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-neutral-900 tracking-chinese mb-6" style={{ fontFamily: 'Microsoft YaHei UI, sans-serif' }}>项目背景</h2>
            <p className="text-neutral-600 leading-chinese text-justify">
              {project.content.background}
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-neutral-900 tracking-chinese mb-6" style={{ fontFamily: 'Microsoft YaHei UI, sans-serif' }}>设计理念</h2>
            <p className="text-neutral-600 leading-chinese text-justify" dangerouslySetInnerHTML={{ __html: project.content.concept }} />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-xl font-bold text-neutral-900 tracking-chinese mb-6" style={{ fontFamily: 'Microsoft YaHei UI, sans-serif' }}>设计亮点</h2>
            <ul className="space-y-4">
              {project.content.highlights.map((highlight, index) => {
                const colonIndex = highlight.indexOf('：');
                const title = colonIndex > 0 ? highlight.slice(0, colonIndex + 1) : '';
                const content = colonIndex > 0 ? highlight.slice(colonIndex + 1) : highlight;
                return (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    className="flex items-start gap-4 text-neutral-600 leading-chinese"
                  >
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full mt-2.5 flex-shrink-0"></span>
                    <span>
                      {title && <strong className="text-neutral-800">{title}</strong>}
                      {content}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </motion.section>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-24 pt-12 border-t border-neutral-200"
        >
          <div className="flex justify-between items-center">
            <div>
              {prevProject && (
                <Link
                  to={`/project/${prevProject.id}`}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="group flex flex-col items-start"
                >
                  <span className="text-xs text-neutral-400 mb-2 tracking-chinese font-sans">上一个项目</span>
                  <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors tracking-chinese">
                    ← {prevProject.title}
                  </span>
                </Link>
              )}
            </div>
            <div>
              {nextProject && (
                <Link
                  to={`/project/${nextProject.id}`}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="group flex flex-col items-end"
                >
                  <span className="text-xs text-neutral-400 mb-2 tracking-chinese font-sans">下一个项目</span>
                  <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors tracking-chinese">
                    {nextProject.title} →
                  </span>
                </Link>
              )}
              {isLastProject && (
                <Link
                  to="/projects"
                  className="group flex flex-col items-end"
                >
                  <span className="text-xs text-neutral-400 mb-2 tracking-chinese font-sans">返回作品目录</span>
                  <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors tracking-chinese">
                    作品列表 →
                  </span>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Contact() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-lg"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10"
        >
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-neutral-200">
            <img
              src="/images/projects/avatar.png"
              alt="邹晔"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-light tracking-chinese-wide text-neutral-900 mb-2">
            邹 晔｜Zou Ye
          </h2>
          <p className="text-sm text-neutral-500 font-sans">1996/08/04</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6 text-sm"
        >
          <div>
            <p className="text-neutral-700 font-sans tracking-chinese leading-relaxed">
              广东省城乡规划设计研究院科技集团股份有限公司 规划四所
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-neutral-600 font-sans tracking-chinese">重庆大学 建筑城规学院</p>
            <p className="text-neutral-600 font-sans tracking-chinese">华中科技大学 建筑与城市规划学院</p>
          </div>
          <div className="pt-4 space-y-3">
            <p className="text-neutral-700 font-sans">
              <span className="text-neutral-400 mr-2">Tel</span>
              15207148707
            </p>
            <p className="text-neutral-700 font-sans">
              <span className="text-neutral-400 mr-2">E-mail</span>
              569617786@qq.com
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-6 text-left"
          >
            <p className="text-xs text-neutral-400 mb-3 tracking-chinese font-sans">微信</p>
            <div className="w-32 h-32 rounded-lg overflow-hidden border border-neutral-200">
              <img
                src="/images/projects/wechat_qr.jpg"
                alt="微信二维码"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-8 text-center">
      <p className="text-xs text-neutral-300 tracking-chinese font-sans">ZOU YE PORTFOLIO</p>
    </footer>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
