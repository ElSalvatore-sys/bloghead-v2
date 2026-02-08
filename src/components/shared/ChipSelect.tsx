import { cn } from '@/lib/utils'

interface ChipOption {
  value: string
  label: string
}

interface SingleChipSelectProps {
  options: ChipOption[]
  value: string
  onChange: (value: string) => void
  multiple?: false
  className?: string
}

interface MultiChipSelectProps {
  options: ChipOption[]
  value: string[]
  onChange: (value: string[]) => void
  multiple: true
  className?: string
}

type ChipSelectProps = SingleChipSelectProps | MultiChipSelectProps

export function ChipSelect(props: ChipSelectProps) {
  const { options, value, multiple, className } = props

  const isSelected = (optionValue: string): boolean => {
    if (multiple) {
      return (value as string[]).includes(optionValue)
    }
    return value === optionValue
  }

  const handleClick = (optionValue: string) => {
    if (props.multiple) {
      const current = props.value
      const next = current.includes(optionValue)
        ? current.filter((v) => v !== optionValue)
        : [...current, optionValue]
      props.onChange(next)
    } else {
      props.onChange(optionValue)
    }
  }

  return (
    <div
      data-testid="chip-select"
      role="group"
      className={cn('flex flex-wrap gap-2', className)}
    >
      {options.map((option) => {
        const selected = isSelected(option.value)
        return (
          <button
            key={option.value}
            type="button"
            role={multiple ? 'checkbox' : 'radio'}
            aria-checked={selected}
            onClick={() => handleClick(option.value)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
              selected
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
