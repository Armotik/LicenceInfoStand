// ============================================
// Composants UI réutilisables pour les présentations
// ============================================

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import clsx from 'clsx';

// ============================================
// Animations variants
// ============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fadeInUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const scaleIn: any = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const slideInLeft: any = {
  hidden: { opacity: 0, x: -50 },
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// ============================================
// StatCard - Carte de statistique animée
// ============================================

interface StatCardProps {
  value: string | number;
  label: string;
  icon: string;
  color?: string;
  suffix?: string;
  index?: number;
}

export function StatCard({ value, label, icon, color = '#5DADE2', suffix, index = 0 }: StatCardProps) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      custom={index}
      className="relative overflow-hidden rounded-xl p-5 bg-surface-light border border-primary-light/20"
      whileHover={{ scale: 1.05, borderColor: 'rgba(93, 173, 226, 0.5)' }}
    >
      {/* Glow background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color}, transparent 70%)`,
        }}
      />

      <div className="relative z-10 text-center">
        <motion.div
          className="text-4xl mb-2"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          {icon}
        </motion.div>
        <motion.div
          className="text-3xl font-bold mb-1"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.3 }}
        >
          {value}{suffix}
        </motion.div>
        <div className="text-sm text-text-muted">{label}</div>
      </div>
    </motion.div>
  );
}

// ============================================
// SectionTitle - Titre de section animé
// ============================================

interface SectionTitleProps {
  icon: string;
  title: string;
  subtitle?: string;
  color?: string;
}

export function SectionTitle({ icon, title, subtitle, color = '#5DADE2' }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      <motion.span
        className="text-5xl block mb-3"
        animate={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {icon}
      </motion.span>
      <h2 className="text-4xl font-display font-bold mb-2" style={{ color }}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-text-muted">{subtitle}</p>
      )}
    </motion.div>
  );
}

// ============================================
// InfoCard - Carte d'information générique
// ============================================

interface InfoCardProps {
  title: string;
  description: string;
  icon: string;
  color?: string;
  index?: number;
  children?: ReactNode;
  className?: string;
}

export function InfoCard({ 
  title, 
  description, 
  icon, 
  color = '#5DADE2', 
  index = 0,
  children,
  className 
}: InfoCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      custom={index}
      className={clsx(
        'bg-surface-light rounded-xl p-6 border border-primary-light/20',
        'hover:border-primary-light/40 transition-all duration-300',
        'hover:shadow-lg hover:shadow-primary-light/10',
        className
      )}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-start gap-4">
        <div
          className="text-4xl p-3 rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2" style={{ color }}>
            {title}
          </h3>
          <p className="text-text-muted text-sm leading-relaxed">
            {description}
          </p>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// ProgressBar - Barre de progression animée
// ============================================

interface ProgressBarProps {
  value: number;
  label: string;
  color?: string;
  showPercentage?: boolean;
}

export function ProgressBar({ 
  value, 
  label, 
  color = '#5DADE2',
  showPercentage = true 
}: ProgressBarProps) {
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-text">{label}</span>
        {showPercentage && (
          <span className="text-sm font-medium" style={{ color }}>
            {value}%
          </span>
        )}
      </div>
      <div className="h-2 bg-surface-lighter rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
    </div>
  );
}

// ============================================
// Badge - Petit label coloré
// ============================================

interface BadgeProps {
  text: string;
  color?: string;
  icon?: string;
}

export function Badge({ text, color = '#5DADE2', icon }: BadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
      style={{
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}40`,
      }}
    >
      {icon && <span>{icon}</span>}
      {text}
    </span>
  );
}

// ============================================
// TabButton - Bouton d'onglet pour navigation
// ============================================

interface TabButtonProps {
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
  color?: string;
}

export function TabButton({ label, icon, isActive, onClick, color = '#5DADE2' }: TabButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={clsx(
        'px-4 py-2 rounded-lg font-medium transition-all duration-300',
        'flex items-center gap-2 text-sm',
        isActive
          ? 'text-white shadow-lg'
          : 'bg-surface-light/50 text-text-muted hover:bg-surface-light hover:text-text'
      )}
      style={isActive ? { backgroundColor: color } : {}}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span>{icon}</span>
      <span className="hidden md:inline">{label}</span>
    </motion.button>
  );
}

// ============================================
// Timeline - Frise chronologique
// ============================================

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  color: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {/* Ligne verticale */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary-light/30" />

      <div className="space-y-8">
        {items.map((item, index) => (
          <motion.div
            key={item.year}
            variants={slideInLeft}
            initial="hidden"
            animate="visible"
            custom={index}
            className="relative pl-16"
          >
            {/* Point sur la timeline */}
            <motion.div
              className="absolute left-4 w-5 h-5 rounded-full border-4 border-surface"
              style={{ backgroundColor: item.color }}
              whileHover={{ scale: 1.3 }}
            />

            {/* Contenu */}
            <div className="bg-surface-light rounded-xl p-5 border border-primary-light/20">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="px-3 py-1 rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {item.year}
                </span>
                <h3 className="text-lg font-bold text-text">{item.title}</h3>
              </div>
              <p className="text-text-muted text-sm">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// CompetenceChip - Chip de compétence
// ============================================

interface CompetenceChipProps {
  name: string;
  icon: string;
  description: string;
  index?: number;
}

export function CompetenceChip({ name, icon, description, index = 0 }: CompetenceChipProps) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      custom={index}
      className="group relative"
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-surface-lighter rounded-full border border-primary-light/20 cursor-pointer hover:border-primary-light/50 transition-all">
        <span className="text-xl">{icon}</span>
        <span className="text-sm font-medium text-text">{name}</span>
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-surface border border-primary-light/30 rounded-lg text-xs text-text-muted opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        {description}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-surface" />
      </div>
    </motion.div>
  );
}

// ============================================
// ModuleCard - Carte de module/UE
// ============================================

interface ModuleCardProps {
  code: string;
  name: string;
  ects: number;
  type: 'obligatoire' | 'optionnel';
  description?: string;
  index?: number;
}

export function ModuleCard({ code, name, ects, type, description, index = 0 }: ModuleCardProps) {
  const isRequired = type === 'obligatoire';

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      custom={index}
      className={clsx(
        'p-4 rounded-lg border transition-all duration-300',
        isRequired
          ? 'bg-surface-light border-primary-light/30 hover:border-primary-light/60'
          : 'bg-surface border-text-muted/20 hover:border-text-muted/40'
      )}
      whileHover={{ x: 5 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-primary-light bg-primary-light/10 px-2 py-0.5 rounded">
              {code}
            </span>
            {!isRequired && (
              <span className="text-xs text-text-muted italic">(optionnel)</span>
            )}
          </div>
          <h4 className="font-medium text-text text-sm">{name}</h4>
          {description && (
            <p className="text-xs text-text-muted mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-1 text-primary-light">
          <span className="text-lg font-bold">{ects}</span>
          <span className="text-xs">ECTS</span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// MetierCard - Carte métier avec salaire
// ============================================

interface MetierCardProps {
  title: string;
  salaire: string;
  icon: string;
  description: string;
  index?: number;
}

export function MetierCard({ title, salaire, icon, description, index = 0 }: MetierCardProps) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      custom={index}
      className="bg-surface-light rounded-xl p-5 border border-primary-light/20 hover:border-primary-light/40 transition-all group"
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="text-center">
        <motion.div
          className="text-5xl mb-3"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          {icon}
        </motion.div>
        <h3 className="text-lg font-bold text-text mb-1">{title}</h3>
        <p className="text-sm text-text-muted mb-3">{description}</p>
        <div className="inline-block px-4 py-2 bg-green-500/20 rounded-full">
          <span className="text-green-400 font-bold">{salaire}</span>
          <span className="text-green-400/70 text-sm"> /an</span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// PoursuiteCard - Carte poursuite d'études
// ============================================

interface PoursuiteCardProps {
  type: string;
  title: string;
  description: string;
  icon: string;
  percentage?: number;
  index?: number;
}

export function PoursuiteCard({ title, description, icon, percentage, index = 0 }: PoursuiteCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      custom={index}
      className="bg-surface-light rounded-xl p-6 border border-primary-light/20 hover:border-primary-light/40 transition-all"
      whileHover={{ scale: 1.03 }}
    >
      <div className="flex items-center gap-4">
        <div className="text-5xl">{icon}</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-primary-light mb-1">{title}</h3>
          <p className="text-sm text-text-muted">{description}</p>
        </div>
        {percentage && (
          <div className="text-center">
            <motion.div
              className="text-3xl font-bold text-secondary-light"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.5, type: 'spring' }}
            >
              {percentage}%
            </motion.div>
            <div className="text-xs text-text-muted">des diplômés</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
