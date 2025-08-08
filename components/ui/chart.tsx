"use client"

import * as React from "react"
import * as Recharts from "recharts"
import { cn } from "@/lib/utils"

type PayloadItem = {
  dataKey?: string | number
  name?: string
  value?: number | string
  payload?: Record<string, any>
  color?: string
}

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<"light" | "dark", string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) throw new Error("useChart must be used within a <ChartContainer />")
  return context
}

type Formatter = (
  value: string | number,
  name: string,
  item: PayloadItem,
  index: number,
  payload?: Record<string, any>
) => React.ReactNode

interface ChartTooltipContentProps
  extends Omit<Recharts.TooltipProps<any, any>, "formatter" | "labelFormatter"> {
  hideLabel?: boolean
  hideIndicator?: boolean
  indicator?: "line" | "dot" | "dashed"
  nameKey?: string
  labelKey?: string
  className?: string
  label?: React.ReactNode
  labelFormatter?: (label: React.ReactNode | undefined, payload: ReadonlyArray<PayloadItem>) => React.ReactNode
  labelClassName?: string
  formatter?: Formatter
  color?: string
  payload?: PayloadItem[] // Explicitly added payload with compatible type
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const payloadItems = React.useMemo(() => {
      if (!Array.isArray(payload)) return []
      return payload as PayloadItem[]
    }, [payload])

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || payloadItems.length === 0) return null

      const item = payloadItems[0]
      const key = labelKey || item.dataKey?.toString() || item.name || "value"

      const itemConfig = getPayloadConfigFromPayload(config, item, key)

      let value: React.ReactNode | undefined
      if (!labelKey && typeof label === "string") {
        value = config[label as keyof typeof config]?.label || label
      } else {
        value = itemConfig?.label
      }

      if (labelFormatter) {
        return <div className={cn("font-medium", labelClassName)}>{labelFormatter(value, payloadItems)}</div>
      }
      if (!value) return null
      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [hideLabel, payloadItems, label, labelFormatter, labelClassName, config, labelKey])

    if (!active || payloadItems.length === 0) return null

    const nestLabel = payloadItems.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payloadItems.map((item, index) => {
            const key = nameKey || item.name || item.dataKey?.toString() || "value"
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload?.fill || item.color

            return (
              <div
                key={item.dataKey?.toString() ?? index}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">{itemConfig?.label || item.name}</span>
                      </div>
                      {item.value !== undefined && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  {
    className?: string
    hideIcon?: boolean
    nameKey?: string
    payload?: PayloadItem[]
    verticalAlign?: "top" | "bottom" | "middle"
  }
>(({ className, hideIcon = false, payload = [], verticalAlign = "bottom", nameKey }, ref) => {
  const { config } = useChart()

  if (!payload.length) return null

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload.map((item, index) => {
        const key = nameKey || item.dataKey?.toString() || "value"
        const itemConfig = getPayloadConfigFromPayload(config, item, key)

        return (
          <div
            key={item.value?.toString() ?? index}
            className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item.color }}
              />
            )}
            {itemConfig?.label}
          </div>
        )
      })}
    </div>
  )
})
ChartLegendContent.displayName = "ChartLegendContent"

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: Record<string, any>,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    typeof payload.payload === "object" && payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey = key

  if (
    key in payload &&
    typeof payload[key] === "string"
  ) {
    configLabelKey = payload[key]
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key] === "string"
  ) {
    configLabelKey = payloadPayload[key]
  }

  return config[configLabelKey] ?? config[key]
}

export {
  ChartTooltipContent,
  ChartLegendContent,
  getPayloadConfigFromPayload,
  ChartContext,
  useChart,
}

