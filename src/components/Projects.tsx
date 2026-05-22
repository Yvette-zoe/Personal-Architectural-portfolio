import { motion } from 'framer-motion';

interface Project {
  id: number;
  title: string;
  subtitle: string;
  type: string;
  time: string;
  description: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: '江月依旧 铁骨新生',
    subtitle: 'Remains and reconstitution',
    type: '遗产保护',
    time: '2021.11 - 2019.1',
    description: '白沙沱长江大桥遗址公园·博物馆概念设计。利用拆除的文物构件再造桥梁遗址博物馆，让老去的白沙沱长江铁路大桥再次焕发活力，迎来涅槃重生。'
  },
  {
    id: 2,
    title: '行道 望水 陶烟轻',
    subtitle: 'Rural memories',
    type: '乡村振兴',
    time: '2020.01 - 2020.5',
    description: '鄂西南土家族聚落保护与更新规划设计。依托古盐道、纳水溪、水碓制陶的特色资源，恢复村民精神文化中心，激活传统村落。'
  },
  {
    id: 3,
    title: '星河欲转江帆舞',
    subtitle: 'Junks dance on high',
    type: '数字复原与建构',
    time: '2018.11 - 2019.1',
    description: '帆船复原与博物馆设计。结合数字技术复原旧时帆船的壮观景象，在汉阳龟山北侧打造沉浸式博物馆体验。'
  },
  {
    id: 4,
    title: '青山白浪 万重千叠',
    subtitle: 'Hills and waves',
    type: '高层建筑',
    time: '2019.09 - 2020.01',
    description: '武昌古城区高层建筑设计。在古城环境中探索现代高层建筑与传统风貌的和谐共生，创造独特的城市天际线。'
  },
  {
    id: 5,
    title: '古往今来 拾忆共生',
    subtitle: 'Recall and intergrowth',
    type: '城市更新',
    time: '2020.03 - 2020.07',
    description: '青龙巷片区更新改造设计。通过微更新策略激活老旧社区，保留历史记忆的同时注入新的功能与活力。'
  }
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 md:px-12 lg:px-24 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">项目作品</h2>
          <p className="text-gray-500 text-sm tracking-widest uppercase">Selected Works</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden bg-gray-100 aspect-[4/3] mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
                <motion.div
                  className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/10 transition-colors duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="text-xs text-gray-500 tracking-wider uppercase bg-white/80 px-2 py-1">
                    {project.type}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-xs text-gray-400">{project.time}</span>
                </div>
                <p className="text-xs text-gray-400 tracking-wider">{project.subtitle}</p>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {project.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
