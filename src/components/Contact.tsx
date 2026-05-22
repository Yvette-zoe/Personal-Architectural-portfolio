import { motion } from 'framer-motion';
import { Mail, MessageCircle } from 'lucide-react';

const contactInfo = [
  { icon: Mail, label: '邮箱', value: '569617786@qq.com' },
  { icon: MessageCircle, label: 'QQ', value: '569617786' },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 md:px-12 lg:px-24 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-light text-gray-900 mb-16 text-center tracking-wide"
        >
          联系方式
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {contactInfo.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-6 border border-gray-100 hover:border-gray-300 transition-colors duration-300"
            >
              <item.icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-gray-800 font-light">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
