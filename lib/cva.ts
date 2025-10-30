type ClassValue = string | number | boolean | undefined | null
type ClassArray = ClassValue[]
type ClassDictionary = Record<string, any>
type ClassProp = ClassValue | ClassArray | ClassDictionary

export function cva<T extends Record<string, Record<string, string>>>(
  base: string,
  config?: {
    variants?: T
    defaultVariants?: Partial<{ [K in keyof T]: keyof T[K] }>
  },
) {
  return (props?: Partial<{ [K in keyof T]: keyof T[K] }> & { className?: string }) => {
    let classes = base

    if (config?.variants && props) {
      for (const key in config.variants) {
        const variantKey = props[key as keyof typeof props] || config.defaultVariants?.[key]
        if (variantKey && config.variants[key][variantKey as string]) {
          classes += " " + config.variants[key][variantKey as string]
        }
      }
    }

    if (props?.className) {
      classes += " " + props.className
    }

    return classes
  }
}

export type VariantProps<T extends (...args: any) => any> = Partial<Parameters<T>[0]>
