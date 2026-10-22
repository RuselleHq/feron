'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Upload, CheckCircle2, Send, MessageCircle, Phone } from 'lucide-react'
import type { Product, ProductSize } from '@/types'
import { useLang } from '@/contexts/lang-context'
import { sendOrderToTelegram } from '@/lib/telegram'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import { cn, formatPrice } from '@/lib/utils'

interface OrderSheetProps {
  open: boolean
  onClose: () => void
  product?: Product
}

type SizeType = 'standard' | 'custom'

function buildSchema(tr: ReturnType<typeof useLang>['tr']) {
  return z.object({
    customerName: z.string().min(1, tr.order.validation.nameRequired),
    phone: z.string().min(10, tr.order.validation.phoneRequired),
    sizeType: z.enum(['standard', 'custom']),
    selectedSizeIndex: z.string().optional(),
    customWidth: z.string().optional(),
    customHeight: z.string().optional(),
    comment: z.string().optional(),
  })
}

type FormData = z.infer<ReturnType<typeof buildSchema>>

export function OrderSheet({ open, onClose, product }: OrderSheetProps) {
  const { tr } = useLang()
  const [success, setSuccess] = useState(false)
  const [fileName, setFileName] = useState<string>()
  const fileRef = useRef<HTMLInputElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)

  const schema = buildSchema(tr)

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { sizeType: 'standard' },
  })

  const sizeType = watch('sizeType') as SizeType
  const selectedSizeIndex = watch('selectedSizeIndex')

  useEffect(() => {
    if (!open) { reset(); setSuccess(false); setFileName(undefined) }
  }, [open, reset])

  // Close on backdrop click
  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose()
  }

  async function onSubmit(data: FormData) {
    const selectedSize: ProductSize | undefined =
      sizeType === 'standard' && data.selectedSizeIndex !== undefined && product
        ? product.sizes[Number(data.selectedSizeIndex)]
        : undefined

    const order = {
      id: Date.now().toString(),
      productId: product?.id,
      productName: product?.name.ru,
      customerName: data.customerName,
      phone: data.phone,
      sizeType,
      selectedSize,
      customWidth: data.customWidth ? Number(data.customWidth) : undefined,
      customHeight: data.customHeight ? Number(data.customHeight) : undefined,
      comment: data.comment,
      fileName,
      createdAt: new Date().toISOString(),
    }

    await sendOrderToTelegram(order, product)
    setSuccess(true)
  }

  function handleWhatsApp(data: FormData) {
    const selectedSize: ProductSize | undefined =
      sizeType === 'standard' && data.selectedSizeIndex !== undefined && product
        ? product.sizes[Number(data.selectedSizeIndex)]
        : undefined

    const order = {
      id: Date.now().toString(),
      productId: product?.id,
      productName: product?.name.ru,
      customerName: data.customerName,
      phone: data.phone,
      sizeType,
      selectedSize,
      customWidth: data.customWidth ? Number(data.customWidth) : undefined,
      customHeight: data.customHeight ? Number(data.customHeight) : undefined,
      comment: data.comment,
      fileName,
      createdAt: new Date().toISOString(),
    }

    const link = buildWhatsAppLink(order, product)
    window.open(link, '_blank')
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end backdrop"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={handleBackdrop}
    >
      <div
        ref={sheetRef}
        className="w-full rounded-t-3xl overflow-hidden"
        style={{ background: 'var(--color-surface)', maxHeight: '92dvh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'var(--color-border)' }} />
        </div>

        <div className="px-5 pb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[18px] font-bold" style={{ color: 'var(--color-text)' }}>
                {tr.order.title}
              </h2>
              <p className="text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>
                {tr.order.subtitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors active:opacity-60"
              style={{ background: 'var(--color-bg-muted)' }}
            >
              <X size={16} style={{ color: 'var(--color-text-secondary)' }} />
            </button>
          </div>

          {success ? (
            <div className="flex flex-col items-center py-10 gap-3">
              <CheckCircle2 size={52} style={{ color: 'var(--color-success)' }} />
              <p className="text-[18px] font-bold text-center" style={{ color: 'var(--color-text)' }}>
                {tr.order.success}
              </p>
              <p className="text-[14px] text-center" style={{ color: 'var(--color-text-secondary)' }}>
                {tr.order.successDesc}
              </p>
              <a
                href={`tel:${process.env.NEXT_PUBLIC_PHONE ?? '+77771234567'}`}
                className="mt-4 flex items-center gap-2 px-5 py-3 rounded-xl text-[14px] font-semibold"
                style={{ background: 'var(--color-bg-muted)', color: 'var(--color-text)' }}
              >
                <Phone size={16} />
                {tr.product.callButton}
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {product && (
                <div
                  className="px-3 py-2 rounded-xl text-[13px] font-medium"
                  style={{ background: 'var(--color-bg-subtle)', color: 'var(--color-text-secondary)' }}
                >
                  {product.name.ru}
                </div>
              )}

              {/* Name */}
              <Field label={tr.order.name} error={errors.customerName?.message}>
                <input
                  {...register('customerName')}
                  placeholder={tr.order.namePlaceholder}
                  className="input-base"
                />
              </Field>

              {/* Phone */}
              <Field label={tr.order.phone} error={errors.phone?.message}>
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder={tr.order.phonePlaceholder}
                  className="input-base"
                />
              </Field>

              {/* Size type */}
              <div>
                <p className="text-[13px] font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  {tr.order.sizeType}
                </p>
                <div className="flex gap-2">
                  {(['standard', 'custom'] as const).map((type) => (
                    <label
                      key={type}
                      className={cn(
                        'flex-1 flex items-center justify-center py-2.5 rounded-xl border text-[13px] font-medium cursor-pointer transition-all',
                        sizeType === type ? 'border-[--color-steel] bg-[--color-steel] text-white' : ''
                      )}
                      style={
                        sizeType !== type
                          ? { borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }
                          : {}
                      }
                    >
                      <input {...register('sizeType')} type="radio" value={type} className="sr-only" />
                      {type === 'standard' ? tr.order.standard : tr.order.custom}
                    </label>
                  ))}
                </div>
              </div>

              {/* Standard size selector */}
              {sizeType === 'standard' && product && product.sizes.length > 0 && (
                <Field label={tr.order.selectSize}>
                  <select {...register('selectedSizeIndex')} className="input-base">
                    <option value="">— {tr.order.selectSize} —</option>
                    {product.sizes.map((s, i) => (
                      <option key={i} value={i}>
                        {s.label.ru} — {formatPrice(s.priceFrom)}
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              {/* Custom size */}
              {sizeType === 'custom' && (
                <div className="flex gap-3">
                  <Field label={tr.order.widthCm} className="flex-1">
                    <input {...register('customWidth')} type="number" min={1} className="input-base" />
                  </Field>
                  <Field label={tr.order.heightCm} className="flex-1">
                    <input {...register('customHeight')} type="number" min={1} className="input-base" />
                  </Field>
                </div>
              )}

              {/* File upload */}
              {sizeType === 'custom' && (
                <div>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed text-[13px] transition-colors active:opacity-70"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                  >
                    <Upload size={16} />
                    {fileName ?? tr.order.uploadFile}
                    <span className="ml-auto text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                      {tr.order.uploadHint}
                    </span>
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="sr-only"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name)}
                  />
                </div>
              )}

              {/* Comment */}
              <Field label={tr.order.comment}>
                <textarea
                  {...register('comment')}
                  placeholder={tr.order.commentPlaceholder}
                  rows={3}
                  className="input-base resize-none"
                />
              </Field>

              {/* Submit buttons */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-[15px] font-semibold text-white transition-opacity active:opacity-80 disabled:opacity-50"
                  style={{ background: 'var(--color-steel)' }}
                >
                  <Send size={16} />
                  {tr.order.sendTelegram}
                </button>

                <button
                  type="button"
                  onClick={handleSubmit(handleWhatsApp)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-[15px] font-semibold transition-opacity active:opacity-80"
                  style={{ background: '#25D366', color: 'white' }}
                >
                  <MessageCircle size={16} />
                  {tr.order.sendWhatsApp}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .input-base {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid var(--color-border);
          background: var(--color-bg-subtle);
          color: var(--color-text);
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s;
          font-family: inherit;
        }
        .input-base:focus {
          border-color: var(--color-steel);
        }
        .input-base::placeholder {
          color: var(--color-text-muted);
        }
        select.input-base {
          appearance: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-[13px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[12px]" style={{ color: 'var(--color-error)' }}>
          {error}
        </p>
      )}
    </div>
  )
}
