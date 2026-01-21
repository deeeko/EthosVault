'use client';

import { Lock, RefreshCw, Shield, Coins, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: Gamepad2,
    title: 'List NFT',
    description: 'Lender locks NFT in escrow, sets terms',
    color: 'from-gold/20 to-gold/5',
    iconColor: 'text-gold',
  },
  {
    icon: Shield,
    title: 'Score Check',
    description: 'Ethos verifies borrower reputation',
    color: 'from-ethos-reputable/20 to-ethos-reputable/5',
    iconColor: 'text-ethos-reputable',
  },
  {
    icon: Coins,
    title: 'Collateral',
    description: 'Borrower deposits scaled collateral',
    color: 'from-ethos-neutral/20 to-ethos-neutral/5',
    iconColor: 'text-ethos-neutral',
  },
  {
    icon: Lock,
    title: 'Wrapper NFT',
    description: 'Borrower receives rental wrapper',
    color: 'from-ethos-exemplary/20 to-ethos-exemplary/5',
    iconColor: 'text-ethos-exemplary',
  },
  {
    icon: RefreshCw,
    title: 'Return',
    description: 'Collateral refunded, scores updated',
    color: 'from-gold/20 to-gold/5',
    iconColor: 'text-gold',
  },
];

export function ProtocolFlow() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gradient">
            How It Works
          </h2>
          <p className="text-lg text-dark-muted max-w-2xl mx-auto">
            A simple, secure process powered by reputation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r from-gold/30 to-transparent" />
              )}

              <div className="card p-6 text-center relative z-10 hover:scale-105 transition-transform">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                  <step.icon size={28} className={step.iconColor} />
                </div>

                <div className="mb-2 text-xs font-semibold text-gold uppercase tracking-wider">
                  Step {index + 1}
                </div>

                <h3 className="text-lg font-display font-bold mb-2">
                  {step.title}
                </h3>

                <p className="text-sm text-dark-muted">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}