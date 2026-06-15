import React from 'react';
import { useI18nContext } from '@/contexts/i18nContext';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import CostCalculator from '@/components/CostCalculator';

const plans = [
  {
    name: '入门版',
    desc: '适合小型团队和个人使用',
    price: '¥999',
    cta: '选择套餐',
    featured: false,
    features: ['每月解析500封邮件', '基础解析功能', '最多5个用户', '邮件支持']
  },
  {
    name: '专业版',
    desc: '适合中型企业使用',
    price: '¥2999',
    cta: '选择套餐',
    featured: true,
    features: ['每月解析2000封邮件', '所有高级解析功能', '最多20个用户', '优先邮件和电话支持', '数据导出功能']
  },
  {
    name: '企业版',
    desc: '适合大型企业和团队使用',
    price: '¥9999',
    cta: '联系销售',
    featured: false,
    features: ['每月解析10000封邮件', '所有高级功能+定制开发', '无限用户', '24/7专属技术支持', 'API集成', '专属客户经理']
  }
];

export default function Price() {
  const { language, t } = useI18nContext();

  return (
    <div className="px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="app-card px-7 py-10 sm:px-10 sm:py-12">
          <div className="text-center">
            <div className="app-accent-chip mb-5">Pricing</div>
            <h1 className="text-4xl font-semibold tracking-tight text-app md:text-5xl">{t('选择适合您的方案')}</h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-app-soft">
              {t('灵活的定价方案，满足不同规模企业的需求')}
            </p>
          </div>
        </section>

        <section id="pricing" className="mt-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className={`app-card relative p-8 ${plan.featured ? 'border-[color:var(--accent-border)] bg-[color:var(--bg-panel)]' : ''}`}
              >
                {plan.featured && (
                  <div className="absolute right-5 top-5 rounded-full bg-app-accent px-3 py-1 text-xs font-semibold text-white">
                    {t('最受欢迎')}
                  </div>
                )}
                <div className="mb-6">
                  <div className="app-accent-chip mb-4">{t(plan.name)}</div>
                  <h3 className="text-2xl font-semibold text-app">{t(plan.name)}</h3>
                  <p className="mt-2 text-sm text-app-soft">{t(plan.desc)}</p>
                </div>

                <div className="mb-8">
                  <span className="text-4xl font-semibold text-app">{plan.price}</span>
                  <span className="ml-2 text-app-faint">/月</span>
                </div>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-app-accent" />
                      <span className="text-sm leading-7 text-app-soft">{t(feature)}</span>
                    </li>
                  ))}
                </ul>

                <button className={plan.featured ? 'app-button-primary w-full justify-center rounded-2xl py-3' : 'app-button-ghost w-full justify-center rounded-2xl py-3'}>
                  {t(plan.cta)}
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <CostCalculator language={language} />
        </section>
      </div>
    </div>
  );
}
