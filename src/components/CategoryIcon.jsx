import {
  Armchair,
  Baby,
  BookOpen,
  BriefcaseBusiness,
  Car,
  Dumbbell,
  HeartPulse,
  House,
  PawPrint,
  Shirt,
  Smartphone,
  Utensils,
} from 'lucide-react'

const CATEGORY_ICONS = {
  'Транспорт': Car,
  'Нерухомість': House,
  'Електроніка': Smartphone,
  'Дім і сад': Armchair,
  'Одяг і взуття': Shirt,
  'Дитячі товари': Baby,
  'Спорт і відпочинок': Dumbbell,
  'Бізнес і послуги': BriefcaseBusiness,
  'Зоотовари': PawPrint,
  'Книги та хобі': BookOpen,
  "Краса та здоров'я": HeartPulse,
  'Їжа та напої': Utensils,
}

export default function CategoryIcon({ category, className, size = 24 }) {
  const Icon = CATEGORY_ICONS[category]

  return Icon ? <Icon aria-hidden="true" className={className} size={size} strokeWidth={1.8} /> : null
}