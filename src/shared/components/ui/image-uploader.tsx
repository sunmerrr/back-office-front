import { useRef, useState } from 'react'
import { Button } from './button'
import { Input } from './input'
import { X, Upload } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface ImageUploaderProps {
  value?: string
  onChange?: (file: File) => void
  onRemove?: () => void
  disabled?: boolean
  className?: string
  maxSizeInMB?: number
}

export const ImageUploader = ({ 
  value, 
  onChange, 
  onRemove, 
  disabled, 
  className,
  maxSizeInMB = 5 
}: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(value || null)

  if (value && value !== preview) {
    setPreview(value)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > maxSizeInMB * 1024 * 1024) {
        alert(`파일 크기는 ${maxSizeInMB}MB를 초과할 수 없습니다.`)
        if (inputRef.current) inputRef.current.value = ''
        return
      }

      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
      onChange?.(file)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    onRemove?.()
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div 
        className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed rounded-lg transition-colors",
          disabled ? "bg-muted border-muted-foreground/20 cursor-not-allowed" : "border-muted-foreground/25 hover:bg-muted/50 cursor-pointer",
          preview ? "border-none" : ""
        )}
        onClick={() => !disabled && !preview && inputRef.current?.click()}
      >
        <Input 
          ref={inputRef}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange}
          disabled={disabled}
        />

        {preview ? (
          <div className="relative w-full h-full min-h-[200px] rounded-lg overflow-hidden group">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-contain bg-black/5" 
            />
            {!disabled && (
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove()
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
            <div className="bg-muted p-4 rounded-full mb-4">
              <Upload className="h-8 w-8" />
            </div>
            <p className="font-medium text-sm">이미지를 업로드하려면 클릭하세요</p>
            <p className="text-xs mt-1">PNG, JPG, GIF (최대 {maxSizeInMB}MB)</p>
          </div>
        )}
      </div>
    </div>
  )
}
