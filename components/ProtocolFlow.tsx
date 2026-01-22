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
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4 text-gradient">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-dark-muted max-w-2xl mx-auto">
            A simple, secure process powered by reputation
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-6 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Connection Line - Only on desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-14 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-0.5 bg-gradient-to-r from-gold/40 to-transparent z-0" />
              )}

              {/* Mobile Connection Line */}
              {index < steps.length - 1 && index % 2 === 0 && (
                <div className="sm:block lg:hidden absolute top-[calc(50%+3rem)] left-1/2 w-0.5 h-16 bg-gradient-to-b from-gold/40 to-transparent transform -translate-x-1/2" />
              )}

              <div className="card p-6 sm:p-8 text-center relative z-10 hover:scale-105 transition-all duration-300 hover:shadow-xl min-h-[280px] flex flex-col justify-start">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                  <step.icon size={32} className={`${step.iconColor} sm:w-9 sm:h-9`} />
                </div>

                <div className="mb-3 text-xs sm:text-sm font-semibold text-gold uppercase tracking-wider">
                  Step {index + 1}
                </div>

                <h3 className="text-lg sm:text-xl font-display font-bold mb-3 text-dark-text">
                  {step.title}
                </h3>

                <p className="text-sm sm:text-base text-dark-muted leading-relaxed">
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