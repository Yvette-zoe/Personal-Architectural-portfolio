import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight text-neutral-900 mb-8">
          邹晔
        </h1>
        <p className="text-xl md:text-2xl text-neutral-500 font-light max-w-2xl mb-12">
          建筑历史与理论 / 建筑学
        </p>
        <div className="flex flex-col md:flex-row gap-6 text-sm text-neutral-400">
          <span>E-mail: 569617786@qq.com</span>
        </div>
      </motion.div>
    </section>
  );
}
