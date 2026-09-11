import { useLocation, useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../data/listings'
import { useAddListing } from '../hooks/useAddListing'
import OptimizedImage from '../components/OptimizedImage'

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
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={s.header}>
        <button style={s.closeBtn} onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <span style={s.headerTitle}>{editId ? 'Редагувати оголошення' : 'Додати оголошення'}</span>
        <button style={s.draftBtn} onClick={saveDraft}>Зберегти чернетку</button>
      </div>

      {/* Stepper */}
      <div style={s.stepper}>
        {[1, 2, 3, 4].map(n => (
          <button key={n} style={{ ...s.stepDot, background: n === step ? 'var(--accent)' : n < step ? 'var(--accent)' : 'var(--border)', color: n <= step ? 'var(--bg)' : 'var(--text-secondary)' }} onClick={() => goToStep(n)} aria-label={`Крок ${n}: ${STEP_LABELS[n - 1]}`} aria-current={n === step ? 'step' : undefined}>
            {n < step ? '✓' : n}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 16px 100px' }}>
        {step === 1 && <Step1 form={form} set={setField} />}
        {step === 2 && <Step2 form={form} set={setField} handlePhotoAdd={addPhoto} removePhoto={removePhoto} />}
        {step === 3 && <Step3 form={form} set={setField} />}
        {step === 4 && <Step4 form={form} />}
      </div>

      {/* Bottom action */}
      <div style={s.bottomAction}>
        {step < 4 ? (
          <button className="btn-primary" onClick={nextStep} style={{ opacity: canProceed ? 1 : 0.5 }}>
            Далі
          </button>
        ) : (
          <button className="btn-primary" onClick={handlePublish}>
            {editId ? 'Зберегти зміни' : 'Опублікувати оголошення'}
          </button>
        )}
        {step > 1 && (
          <button className="btn-outline" style={{ marginTop: 10 }} onClick={prevStep}>
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
        <input style={s.input} placeholder="Наприклад: iPhone 13 128GB" value={form.title} onChange={e => set('title', e.target.value)} />
      </Field>
      <Field label="Категорія *">
        <select style={s.input} value={form.category} onChange={e => { set('category', e.target.value); set('subcategory', '') }}>
          <option value="">Оберіть категорію</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
        </select>
      </Field>
      <Field label="Підкатегорія">
        <select style={s.input} value={form.subcategory} onChange={e => set('subcategory', e.target.value)} disabled={!form.category}>
          <option value="">Оберіть підкатегорію</option>
          {subs.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>
      <Field label="Стан товару *">
        <div style={{ display: 'flex', gap: 10 }}>
          {['Новий', 'Вживаний', 'Після ремонту'].map(c => (
            <button key={c} style={{ flex: 1, padding: '10px 4px', borderRadius: 10, border: `1.5px solid ${form.condition === c ? 'var(--accent)' : 'var(--border)'}`, background: form.condition === c ? 'rgba(255,183,3,0.15)' : 'var(--bg-input)', color: form.condition === c ? 'var(--accent)' : 'var(--text-secondary)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }} onClick={() => set('condition', c)}>
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
          style={{ ...s.input, width: '100%', padding: 12, resize: 'none', lineHeight: 1.6 }}
          rows={6}
          placeholder="Опишіть товар, його особливості, переваги, комплектацію, причину продажу тощо..."
          value={form.description}
          onChange={e => set('description', e.target.value)}
          maxLength={4000}
        />
        <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{form.description.length}/4000</div>
      </Field>
      <SectionTitle style={{ marginTop: 20 }}>3. Фото товару</SectionTitle>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>Додайте фото *</div>
      <div style={s.photoGrid}>
        <label style={s.photoAdd}>
          <div style={{ fontSize: 28, color: 'var(--text-secondary)' }}>📷</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>Натисніть, щоб завантажити фото</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>JPG, PNG до 2 МБ. Мінімум 1 фото, максимум 10</div>
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple={false} onChange={e => handlePhotoAdd(e.target.files?.[0])} style={{ display: 'none' }} />
        </label>
        {form.photos.map((ph, i) => (
          <div key={i} style={{ ...s.photoThumb, position: 'relative' }}>
            <OptimizedImage src={ph} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button style={s.photoRemove} onClick={() => removePhoto(i)}>×</button>
            {i === 0 && <div style={s.mainBadge}>Головне</div>}
          </div>
        ))}
      </div>
    </>
  )
}

function Step3({ form, set }) {
  return (
    <>
      <SectionTitle>4. Ціна</SectionTitle>
      <Field label="Ціна *">
        <div style={{ position: 'relative' }}>
          <input style={{ ...s.input, paddingRight: 40, width: '100%' }} placeholder="Введіть ціну" type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} />
          <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: 14 }}>грн</span>
        </div>
      </Field>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', borderRadius: 10, padding: '14px', marginBottom: 20, border: '1px solid var(--border)' }}>
        <span style={{ fontSize: 14 }}>Торг можливий</span>
        <button style={{ width: 48, height: 26, borderRadius: 13, background: form.negotiable ? 'var(--accent)' : 'var(--border)', position: 'relative', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }} onClick={() => set('negotiable', !form.negotiable)}>
          <span style={{ position: 'absolute', top: 3, left: form.negotiable ? 24 : 3, width: 20, height: 20, background: '#fff', borderRadius: '50%', transition: 'left 0.2s', display: 'block' }} />
        </button>
      </div>
      <SectionTitle>Додаткова інформація</SectionTitle>
      <Field label="Місцезнаходження *">
        <div style={{ position: 'relative' }}>
          <input style={{ ...s.input, width: '100%', paddingRight: 36 }} value={form.location} onChange={e => set('location', e.target.value)} />
          <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>📍</span>
        </div>
      </Field>
      <Field label="Спосіб доставки">
        <select style={s.input} value={form.delivery} onChange={e => set('delivery', e.target.value)}>
          <option value="">Оберіть спосіб доставки</option>
          {DELIVERY_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </Field>
      <Field label="Оплата">
        <select style={s.input} value={form.payment} onChange={e => set('payment', e.target.value)}>
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
      <SectionTitle>Перевірте оголошення</SectionTitle>
      <div style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 16, border: '1px solid var(--border)', marginBottom: 20 }}>
        {form.photos[0] && <OptimizedImage src={form.photos[0]} alt="" style={{ width: '100%', borderRadius: 10, marginBottom: 12, maxHeight: 200, objectFit: 'cover' }} />}
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{form.title || '(без назви)'}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)', marginBottom: 4 }}>{form.price ? `${Number(form.price).toLocaleString('uk-UA')} грн` : '—'}</div>
        {form.negotiable && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Договірна</div>}
        <div style={s.specRow}><span style={s.specLabel}>Категорія</span><span style={s.specVal}>{form.category || '—'}</span></div>
        <div style={s.specRow}><span style={s.specLabel}>Стан</span><span style={s.specVal}>{form.condition}</span></div>
        <div style={s.specRow}><span style={s.specLabel}>Локація</span><span style={s.specVal}>{form.location}</span></div>
        {form.delivery && <div style={s.specRow}><span style={s.specLabel}>Доставка</span><span style={s.specVal}>{form.delivery}</span></div>}
        {form.description && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 12, lineHeight: 1.6 }}>{form.description}</p>}
      </div>
    </>
  )
}

function SectionTitle({ children, style }) {
  return <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, marginTop: 8, ...style }}>{children}</div>
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border)' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32 },
  headerTitle: { fontSize: 16, fontWeight: 600 },
  draftBtn: { background: 'none', border: 'none', color: 'var(--accent)', fontSize: 13, cursor: 'pointer' },
  stepper: { display: 'flex', justifyContent: 'center', gap: 20, padding: '20px 0', alignItems: 'center' },
  stepDot: { width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  input: { width: '100%', padding: '12px 14px', borderRadius: 10, fontSize: 14, display: 'block' },
  bottomAction: { position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: '16px', zIndex: 50 },
  photoGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 },
  photoAdd: { gridColumn: '1 / -1', border: '2px dashed var(--border)', borderRadius: 12, padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bg-input)', cursor: 'pointer' },
  photoThumb: { aspectRatio: '1', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' },
  photoRemove: { position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 },
  mainBadge: { position: 'absolute', bottom: 4, left: 4, background: 'var(--accent)', color: 'var(--bg)', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4 },
  specRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' },
  specLabel: { fontSize: 13, color: 'var(--text-secondary)' },
  specVal: { fontSize: 13, fontWeight: 500 },
}
