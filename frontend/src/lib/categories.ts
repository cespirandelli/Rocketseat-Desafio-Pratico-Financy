import {
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Dumbbell,
  Gift,
  HeartPulse,
  House,
  Mailbox,
  PawPrint,
  PiggyBank,
  ReceiptText,
  ShoppingCart,
  Tag,
  Ticket,
  ToolCase,
  Utensils,
  type LucideIcon,
} from 'lucide-react'

export const categoryIcons: Record<string, LucideIcon> = {
  'briefcase-business': BriefcaseBusiness,
  'car-front': CarFront,
  'heart-pulse': HeartPulse,
  'piggy-bank': PiggyBank,
  'shopping-cart': ShoppingCart,
  ticket: Ticket,
  'tool-case': ToolCase,
  utensils: Utensils,
  'paw-print': PawPrint,
  house: House,
  gift: Gift,
  dumbbell: Dumbbell,
  'book-open': BookOpen,
  'baggage-claim': BaggageClaim,
  mailbox: Mailbox,
  'receipt-text': ReceiptText,
}

export const categoryColors = {
  green: {
    swatch: 'bg-green-base',
    icon: 'bg-green-light text-green-base',
    tag: 'bg-green-light text-green-dark',
    text: 'text-green-base',
  },
  blue: {
    swatch: 'bg-blue-base',
    icon: 'bg-blue-light text-blue-base',
    tag: 'bg-blue-light text-blue-dark',
    text: 'text-blue-base',
  },
  purple: {
    swatch: 'bg-purple-base',
    icon: 'bg-purple-light text-purple-base',
    tag: 'bg-purple-light text-purple-dark',
    text: 'text-purple-base',
  },
  pink: {
    swatch: 'bg-pink-base',
    icon: 'bg-pink-light text-pink-base',
    tag: 'bg-pink-light text-pink-dark',
    text: 'text-pink-base',
  },
  red: {
    swatch: 'bg-red-base',
    icon: 'bg-red-light text-red-base',
    tag: 'bg-red-light text-red-dark',
    text: 'text-red-base',
  },
  orange: {
    swatch: 'bg-orange-base',
    icon: 'bg-orange-light text-orange-base',
    tag: 'bg-orange-light text-orange-dark',
    text: 'text-orange-base',
  },
  yellow: {
    swatch: 'bg-yellow-base',
    icon: 'bg-yellow-light text-yellow-base',
    tag: 'bg-yellow-light text-yellow-dark',
    text: 'text-yellow-base',
  },
}

export type CategoryColor = keyof typeof categoryColors

export function getCategoryColor(color?: string) {
  return categoryColors[(color as CategoryColor) ?? 'green'] ?? {
    swatch: 'bg-gray-500',
    icon: 'bg-gray-200 text-gray-500',
    tag: 'bg-gray-200 text-gray-700',
    text: 'text-gray-500',
  }
}

export function getCategoryIcon(icon?: string) {
  return (icon && categoryIcons[icon]) || Tag
}
