'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  X, CheckCircle2, Send, Phone, AlertCircle, User, PhoneCall, ChevronDown, FileUp,
} from 'lucide-react'
import type { Product, ProductSize } from '@/types'
import { useLang } from '@/contexts/lang-context'
import { contacts } from '@/lib/contacts'
import {
  ACCEPTED_FILE_EXTENSIONS,
  buildOrderSchema,
  isFileAllowed,
  type OrderErrorCode,
  type OrderFormData,
  type OrderResponse,
} from '@/lib/order'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import { Segmented } from '@/components/ui/segmented'
import { cn, formatPrice } from '@/lib/utils'

interface OrderSheetProps {
  open: boolean
  onClose: () => void
  product?: Product
  initialSizeIndex?: number
}

type SizeType = 'standard' | 'custom'
type Status = 'idle' | 'sending' | 'success' | 'error'

function newRequestId(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`
  }
}

export function OrderSheet({ open, onClose, product, initialSizeIndex }: OrderSheetProps) {
  const { tr, lang } = useLang()
  const [status, setStatus] = useState<Status>('idle')
  const [errorCode, setErrorCode] = useState<OrderErrorCode>()
  const [file, setFile] = useState<File>()
  const [fileError, setFileError] = useState<string>()
  const fileRef = useRef<HTMLInputElement>(null)
  const requestIdRef = useRef(newRequestId())

  const schema = buildOrderSchema(tr.order.validation, { sizeCount: product?.sizes.length ?? 0 })

  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<OrderFormData>({
    resolver: zodResolver(schema),
    defaultValues: { sizeType: 'standard' },
  })

  const sizeType = watch('sizeType') as SizeType

  useEffect(() => {
    if (!open) {
      reset()
      setStatus('idle')
      setErrorCode(undefined)
      setFile(undefined)
      setFileError(undefined)
      if (fileRef.current) fileRef.current.value = ''
      requestIdRef.current = newRequestId()
      return
    }
    if (initialSizeIndex !== undefined) {
      setValue('selectedSizeIndex', String(initialSizeIndex))
    }
  }, [open, reset, setValue, initialSizeIndex])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose()
  }

  function resolveSelectedSize(data: OrderFormData): ProductSize | undefined {
    if (data.sizeType !== 'standard' || !product) return undefined
    const index = Number(data.selectedSizeIndex)
    return Number.isInteger(index) ? product.sizes[index] : undefined
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0]
    setFileError(undefined)

    if (!picked) {
      setFile(undefined)
      return
    }

    const verdict = isFileAllowed(picked)
    if (verdict !== 'ok') {
      setFile(undefined)
      e.target.value = ''
      setFileError(verdict === 'too-large' ? tr.order.fileErrors.tooLarge : tr.order.fileErrors.wrongType)
      return
    }

    setFile(picked)
  }

  async function onSubmit(data: OrderFormData) {
    if (status === 'sending') return

    setStatus('sending')
    setErrorCode(undefined)

    const body = new FormData()
    body.append('requestId', requestIdRef.current)
    body.append('customerName', data.customerName)
    body.append('phone', data.phone)
    body.append('sizeType', data.sizeType)
    if (product) body.append('productId', product.id)
    if (data.selectedSizeIndex) body.append('selectedSizeIndex', data.selectedSizeIndex)
    if (data.customWidth) body.append('customWidth', data.customWidth)
    if (data.customHeight) body.append('customHeight', data.customHeight)
    if (data.comment) body.append('comment', data.comment)
    if (file) body.append('file', file)

    try {
      const res = await fetch('/api/order', { method: 'POST', body })
      const payload = (await res.json().catch(() => null)) as OrderResponse | null

      if (res.ok && payload?.ok) {
        setStatus('success')
        return
      }

      setErrorCode(payload && !payload.ok ? payload.code : 'telegram')
      setStatus('error')
    } catch {
      setErrorCode('network')
      setStatus('error')
    }
  }

  function handleWhatsApp(data: OrderFormData) {
    const link = buildWhatsAppLink(
      {
        customerName: data.customerName,
        sizeType: data.sizeType,
        selectedSize: resolveSelectedSize(data),
        customWidth: data.customWidth ? Number(data.customWidth) : undefined,
        customHeight: data.customHeight ? Number(data.customHeight) : undefined,
        comment: data.comment,
      },
      product,
    )

    if (link) window.open(link, '_blank')
  }

  if (!open) return null

  const sending = status === 'sending'
  const errorMessage = errorCode ? errorMessageFor(tr.order.errors, errorCode) : undefined

  return (
    <div
      className="fixed inset-0 z-[150] flex items-end justify-center backdrop"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={handleBackdrop}
    >
      <div
        className="w-full sheet-enter"
        style={{
          maxWidth: 'var(--shell-max)',
          background: 'var(--surface)',
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
          border: '1px solid var(--border)',
          borderBottom: 'none',
          maxHeight: '94dvh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div style={{ width: 38, height: 4, borderRadius: 999, background: 'var(--surface-3)' }} />
        </div>

        <div className="px-5 pb-6" style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}>
          <div className="flex items-center justify-between mb-4 pt-1">
            <h2 className="text-[17px] font-bold" style={{ color: 'var(--text)' }}>
              {tr.order.title}
            </h2>
            <button
              onClick={onClose}
              aria-label={tr.common.close}
              className="press flex items-center justify-center"
              style={{ width: 30, height: 30, borderRadius: 'var(--r-full)', background: 'var(--surface-2)' }}
            >
              <X size={15} color="var(--text-2)" />
            </button>
          </div>

          {status === 'success' ? (
            <div className="flex flex-col items-center py-10 gap-3">
              <CheckCircle2 size={50} style={{ color: 'var(--success)' }} />
              <p className="text-[18px] font-bold text-center" style={{ color: 'var(--text)' }}>
                {tr.order.success}
              </p>
              <p className="text-[13.5px] text-center" style={{ color: 'var(--text-2)' }}>
                {tr.order.successDesc}
              </p>
              {contacts.phone && (
                <a
                  href={contacts.phone.href}
                  className="press mt-4 flex items-center gap-2 px-5 text-[14px] font-semibold"
                  style={{
                    height: 46,
                    borderRadius: 'var(--r-full)',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border-strong)',
                    color: 'var(--text)',
                  }}
                >
                  <Phone size={15} />
                  {tr.product.callButton}
                </a>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Segmented
                options={[
                  { id: 'standard', label: tr.order.standard },
                  { id: 'custom', label: tr.order.custom },
                ]}
                value={sizeType}
                onChange={(v) => setValue('sizeType', v as SizeType, { shouldValidate: false })}
              />

              <div>
                <SectionLabel>{tr.order.yourData}</SectionLabel>
                <div className="flex flex-col gap-2.5">
                  <IconField icon={<User size={15} color="var(--text-3)" />} error={errors.customerName?.message}>
                    <input
                      {...register('customerName')}
                      placeholder={tr.order.namePlaceholder}
                      autoComplete="name"
                      className="field field-with-icon"
                    />
                  </IconField>
                  <IconField icon={<PhoneCall size={15} color="var(--text-3)" />} error={errors.phone?.message}>
                    <input
                      {...register('phone')}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder={tr.order.phonePlaceholder}
                      className="field field-with-icon"
                    />
                  </IconField>
                </div>
              </div>

              {product && (
                <div>
                  <SectionLabel>{tr.order.interest}</SectionLabel>
                  <div
                    className="flex items-center justify-between px-3.5 text-[13.5px]"
                    style={{
                      height: 48,
                      borderRadius: 'var(--r-sm)',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                    }}
                  >
                    <span className="truncate">{product.name[lang]}</span>
                    <ChevronDown size={15} color="var(--text-3)" className="flex-shrink-0" />
                  </div>
                </div>
              )}

              {sizeType === 'standard' && product && product.sizes.length > 0 && (
                <div>
                  <SectionLabel>{tr.order.size}</SectionLabel>
                  <div className="relative">
                    <select {...register('selectedSizeIndex')} className="field" style={{ height: 48, paddingBlock: 0 }}>
                      <option value="">— {tr.order.selectSize} —</option>
                      {product.sizes.map((s, i) => (
                        <option key={i} value={i}>
                          {s.label[lang]} — {formatPrice(s.priceFrom)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      color="var(--text-3)"
                      className="absolute pointer-events-none"
                      style={{ right: 14, top: '50%', transform: 'translateY(-50%)' }}
                    />
                  </div>
                  <FieldError message={errors.selectedSizeIndex?.message} />
                </div>
              )}

              {sizeType === 'custom' && (
                <div>
                  <SectionLabel>{tr.order.size}</SectionLabel>
                  <div className="flex gap-2.5">
                    <div className="flex-1">
                      <input
                        {...register('customWidth')}
                        type="number"
                        min={10}
                        max={3000}
                        step={1}
                        placeholder={tr.order.widthCm}
                        className="field"
                      />
                      <FieldError message={errors.customWidth?.message} />
                    </div>
                    <div className="flex-1">
                      <input
                        {...register('customHeight')}
                        type="number"
                        min={10}
                        max={3000}
                        step={1}
                        placeholder={tr.order.heightCm}
                        className="field"
                      />
                      <FieldError message={errors.customHeight?.message} />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <SectionLabel>{tr.order.comment}</SectionLabel>
                <textarea
                  {...register('comment')}
                  placeholder={tr.order.commentPlaceholder}
                  rows={3}
                  className="field resize-none"
                />
                <FieldError message={errors.comment?.message} />
              </div>

              <div>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="press w-full flex items-center gap-3 px-3.5 text-left"
                    style={{
                      height: 60,
                      borderRadius: 'var(--r-sm)',
                      background: 'var(--surface-2)',
                      border: '1px dashed var(--border-strong)',
                    }}
                  >
                    <span
                      className="flex items-center justify-center flex-shrink-0"
                      style={{ width: 32, height: 32, borderRadius: 'var(--r-xs)', background: 'var(--surface-3)' }}
                    >
                      <FileUp size={15} color="var(--text-2)" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-medium truncate" style={{ color: 'var(--text)' }}>
                        {file?.name ?? tr.order.uploadFile}
                      </span>
                      <span className="block text-[11px]" style={{ color: 'var(--text-3)' }}>
                        {tr.order.uploadHint}
                      </span>
                    </span>
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept={ACCEPTED_FILE_EXTENSIONS}
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                  {file && (
                    <button
                      type="button"
                      onClick={() => {
                        setFile(undefined)
                        setFileError(undefined)
                        if (fileRef.current) fileRef.current.value = ''
                      }}
                      className="mt-1.5 text-[11px] font-medium"
                      style={{ color: 'var(--text-3)' }}
                    >
                      {tr.order.uploadRemove}
                    </button>
                  )}
                  <FieldError message={fileError} />
              </div>

              {errorMessage && (
                <div
                  className="flex items-start gap-2 px-3 py-2.5 text-[12px] leading-snug"
                  style={{ background: 'rgba(229,72,77,0.1)', borderRadius: 'var(--r-xs)', color: '#ff8b8e' }}
                  role="alert"
                >
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex flex-col gap-2.5 pt-0.5">
                <button
                  type="submit"
                  disabled={sending}
                  className="press flex items-center justify-center gap-2 w-full text-[14.5px] font-semibold disabled:opacity-50"
                  style={{
                    height: 52,
                    borderRadius: 'var(--r-full)',
                    background: 'var(--telegram)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    color: '#fff',
                  }}
                >
                  <Send size={16} />
                  {sending ? tr.order.sending : status === 'error' ? tr.order.retry : tr.order.sendTelegram}
                </button>

                {contacts.whatsapp && (
                  <>
                    <button
                      type="button"
                      disabled={sending}
                      onClick={handleSubmit(handleWhatsApp)}
                      className="press flex items-center justify-center gap-2 w-full text-[14.5px] font-semibold disabled:opacity-50"
                      style={{
                        height: 52,
                        borderRadius: 'var(--r-full)',
                        background: 'var(--whatsapp)',
                        color: '#06301a',
                      }}
                    >
                      <WhatsAppGlyph />
                      {tr.order.sendWhatsApp}
                    </button>
                    {file && (
                      <p className="text-[11px] leading-snug" style={{ color: 'var(--text-3)' }}>
                        {tr.order.whatsappFileNote}
                      </p>
                    )}
                  </>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12.5px] font-medium mb-2" style={{ color: 'var(--text-2)' }}>
      {children}
    </p>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="text-[11.5px] mt-1.5" style={{ color: '#ff8b8e' }}>
      {message}
    </p>
  )
}

function IconField({
  icon,
  error,
  children,
  className,
}: {
  icon: React.ReactNode
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('w-full', className)}>
      <div className="relative">
        <span className="absolute pointer-events-none" style={{ left: 15, top: '50%', transform: 'translateY(-50%)' }}>
          {icon}
        </span>
        {children}
      </div>
      <FieldError message={error} />
    </div>
  )
}

function WhatsAppGlyph() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.19 8.19 0 0 1 8.24 8.24c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  )
}

function errorMessageFor(messages: ReturnType<typeof useLang>['tr']['order']['errors'], code: OrderErrorCode): string {
  switch (code) {
    case 'validation':
      return messages.validation
    case 'file':
      return messages.file
    case 'rate-limited':
      return messages.rateLimited
    case 'not-configured':
      return messages.notConfigured
    case 'network':
      return messages.network
    default:
      return messages.telegram
  }
}
