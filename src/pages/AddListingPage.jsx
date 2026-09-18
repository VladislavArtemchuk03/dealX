import { useLocation, useNavigate } from 'react-router-dom'
import { Camera, Check, MapPin, X } from 'lucide-react'
import { CATEGORIES } from '../data/listings'
import { useAddListing } from '../hooks/useAddListing'
import OptimizedImage from '../components/OptimizedImage'
import styles from './AddListingPage.module.css'

const SUBCATEGORIES = {
  'Транспорт': ['Легкові авто', 'Мотоцикли', 'Вантажні авто', 'Спецтехніка', 'Велосипеди', 'Запчастини'],
  'Нерухомість': ['Квартири', 'Будинки', 'Кімнати', 'Земля', 'Комерційна нерухомість'],
  'Електроніка': ['Телефони', 'Ноутбуки', 'Планшети', 'ТВ', 'Аудіо', 'Ігрові консолі', 'Аксесуари'],
  'Дім і сад': ['Меблі', 'Побутова техніка', 'Сантехніка', 'Інструменти', 'Декор'],
  "Одяг і взуття": ['Жіночий одяг', 'Чоловічий одяг', 'Дитячий одяг', 'Взуття', 'Аксесуари'],
}

const DELIVERY_OPTIONS = ['Нова пошта', 'Укрпошта', 'Meest Express', 'Justin', 'Самовивіз']
const PAYMENT_OPTIONS = ['Готівка', 'Онлайн-оплата', 'Банківська картка', 'Безпечна угода']
const STEP_LABELS = ['Основна інформація', 'Опис і фото', 'Ціна та доставка', 'Перевірка оголошення']

export default function AddListingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const editId = location.state?.editId ?? null
  const {
    step, nextStep, prevStep, goToStep,
    form, setField,
    canProceed,
    saveDraft, publish,
    addPhoto, removePhoto,
  } = useAddListing(editId)

  const handlePublish = () => {
    const listing = publish()
    if (!listing) return
    navigate('/home', { state: { newListingId: listing.id } })
  }

  return (
    <div className={styles.dealxAddListingMain}>
      {/* Заголовок */}
      <div className={styles.header}>
        <button className={styles.closeBtn} onClick={() => navigate(-1)}>
          <X aria-hidden="true" size={20} strokeWidth={1.8} />
        </button>
        <span className={styles.headerTitle}>{editId ? 'Редагувати оголошення' : 'Додати оголошення'}</span>
        <button className={styles.draftBtn} onClick={saveDraft}>Зберегти чернетку</button>
      </div>

      {/* Індикатор кроків */}
      <div className={styles.stepper}>
        {[1, 2, 3, 4].map(n => (
          <button key={n} className={styles.stepDot} data-current={n === step || undefined} data-complete={n < step || undefined} onClick={() => goToStep(n)} aria-label={`Крок ${n}: ${STEP_LABELS[n - 1]}`} aria-current={n === step ? 'step' : undefined}>
            {n < step ? <Check aria-hidden="true" size={16} strokeWidth={2.5} /> : n}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {step === 1 && <Step1 form={form} set={setField} />}
        {step === 2 && <Step2 form={form} set={setField} handlePhotoAdd={addPhoto} removePhoto={removePhoto} />}
        {step === 3 && <Step3 form={form} set={setField} />}
        {step === 4 && <Step4 form={form} />}
      </div>

      {/* Нижня панель дій */}
      <div className={styles.bottomAction}>
        {step < 4 ? (
          <button className={`btn-primary ${styles.nextButton}`} data-can-proceed={canProceed} onClick={nextStep}>
            Далі
          </button>
        ) : (
          <button className="btn-primary" onClick={handlePublish}>
            {editId ? 'Зберегти зміни' : 'Опублікувати оголошення'}
          </button>
        )}
        {step > 1 && (
          <button className={`btn-outline ${styles.previousButton}`} onClick={prevStep}>
            Назад
          </button>
        )}
      </div>
    </div>
  )
}

function Step1({ form, set }) {
  const subs = SUBCATEGORIES[form.category] || []
  return (
    <>
      <SectionTitle>1. Основна інформація</SectionTitle>
      <Field label="Назва товару *">
        <input className={styles.input} placeholder="Наприклад: iPhone 13 128GB" value={form.title} onChange={e => set('title', e.target.value)} />
      </Field>
      <Field label="Категорія *">
        <select className={styles.input} value={form.category} onChange={e => { set('category', e.target.value); set('subcategory', '') }}>
          <option value="">Оберіть категорію</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </Field>
      <Field label="Підкатегорія">
        <select className={styles.input} value={form.subcategory} onChange={e => set('subcategory', e.target.value)} disabled={!form.category}>
          <option value="">Оберіть підкатегорію</option>
          {subs.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>
      <Field label="Стан товару *">
        <div className={styles.conditionOptions}>
          {['Новий', 'Вживаний', 'Після ремонту'].map(c => (
            <button key={c} className={styles.conditionButton} data-selected={form.condition === c || undefined} onClick={() => set('condition', c)}>
              {c}
            </button>
          ))}
        </div>
      </Field>
    </>
  )
}

function Step2({ form, set, handlePhotoAdd, removePhoto }) {
  return (
    <>
      <SectionTitle>2. Опис товару</SectionTitle>
      <Field label="Детальний опис *">
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          rows={6}
          placeholder="Опишіть товар, його особливості, переваги, комплектацію, причину продажу тощо..."
          value={form.description}
          onChange={e => set('description', e.target.value)}
          maxLength={4000}
        />
        <div className={styles.characterCount}>{form.description.length}/4000</div>
      </Field>
      <SectionTitle className={styles.photoTitle}>Фото товару</SectionTitle>
      <div className={styles.photoDescription}>Додайте фото *</div>
      <div className={styles.photoGrid}>
        <label className={styles.photoAdd}>
          <Camera className={styles.photoIcon} aria-hidden="true" size={28} />
          <div className={styles.photoAddLabel}>Натисніть, щоб завантажити фото</div>
          <div className={styles.photoHelp}>JPG, PNG до 2 МБ. Мінімум 1 фото, максимум 10</div>
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple={false} onChange={e => handlePhotoAdd(e.target.files?.[0])} className={styles.fileInput} />
        </label>
        {form.photos.map((ph, i) => (
          <div key={i} className={styles.photoThumb}>
            <OptimizedImage src={ph} alt="" className={styles.photoImage} />
            <button className={styles.photoRemove} onClick={() => removePhoto(i)}>×</button>
            {i === 0 && <div className={styles.mainBadge}>Головне</div>}
          </div>
        ))}
      </div>
    </>
  )
}

function Step3({ form, set }) {
  return (
    <>
      <SectionTitle>3. Ціна та доставка</SectionTitle>
      <Field label="Ціна *">
        <div className={styles.inputWithSuffix}>
          <input className={`${styles.input} ${styles.priceInput}`} placeholder="Введіть ціну" type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} />
          <span className={styles.inputSuffix}>грн</span>
        </div>
      </Field>
      <div className={styles.negotiableRow}>
        <span className={styles.negotiableLabel}>Торг можливий</span>
        <button className={styles.toggle} data-active={form.negotiable} onClick={() => set('negotiable', !form.negotiable)}>
          <span className={styles.toggleKnob} />
        </button>
      </div>
      <SectionTitle>Додаткова інформація</SectionTitle>
      <Field label="Місцезнаходження *">
        <div className={styles.inputWithSuffix}>
          <input className={`${styles.input} ${styles.locationInput}`} value={form.location} onChange={e => set('location', e.target.value)} />
          <MapPin className={styles.locationIcon} aria-hidden="true" size={16} />
        </div>
      </Field>
      <Field label="Спосіб доставки">
        <select className={styles.input} value={form.delivery} onChange={e => set('delivery', e.target.value)}>
          <option value="">Оберіть спосіб доставки</option>
          {DELIVERY_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </Field>
      <Field label="Оплата">
        <select className={styles.input} value={form.payment} onChange={e => set('payment', e.target.value)}>
          <option value="">Оберіть спосіб оплати</option>
          {PAYMENT_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </Field>
    </>
  )
}

function Step4({ form }) {
  return (
    <>
      <SectionTitle>4. Перевірте оголошення</SectionTitle>
      <div className={styles.reviewCard}>
        {form.photos[0] && <OptimizedImage src={form.photos[0]} alt="" className={styles.reviewImage} />}
        <div className={styles.reviewTitle}>{form.title || '(без назви)'}</div>
        <div className={styles.reviewPrice}>{form.price ? `${Number(form.price).toLocaleString('uk-UA')} грн` : '—'}</div>
        {form.negotiable && <div className={styles.reviewNegotiable}>Договірна</div>}
        <div className={styles.specRow}><span className={styles.specLabel}>Категорія</span><span className={styles.specVal}>{form.category || '—'}</span></div>
        <div className={styles.specRow}><span className={styles.specLabel}>Стан</span><span className={styles.specVal}>{form.condition}</span></div>
        <div className={styles.specRow}><span className={styles.specLabel}>Локація</span><span className={styles.specVal}>{form.location}</span></div>
        {form.delivery && <div className={styles.specRow}><span className={styles.specLabel}>Доставка</span><span className={styles.specVal}>{form.delivery}</span></div>}
        {form.description && <p className={styles.reviewDescription}>{form.description}</p>}
      </div>
    </>
  )
}

function SectionTitle({ children, className = '' }) {
  return <div className={`${styles.sectionTitle} ${className}`}>{children}</div>
}

function Field({ label, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      {children}
    </div>
  )
}
