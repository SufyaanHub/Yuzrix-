"use client"

import {
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useVelocity,
  wrap,
} from "motion/react"
import {
  Children,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"

type SpringConfig = {
  damping?: number
  stiffness?: number
  mass?: number
  restDelta?: number
  restSpeed?: number
}

/**
 * Interpolates a CSS variable or property between `from` and `to` as an item
 * travels across the path. `at` is the normalised path position (0–1).
 */
export type CssVariableInterpolation = {
  property: string
  from: number
  to: number
  unit?: string
  at?: [number, number]
}

export type PathMarqueeProps = {
  /** SVG path data used to position each item. */
  path: string
  /** ID assigned to the SVG path. Generated when omitted. */
  pathId?: string
  /** Render the path stroke. */
  showPath?: boolean
  width?: string | number
  height?: string | number
  viewBox?: string
  preserveAspectRatio?: string
  /** Automatic movement speed, in path user units per second. */
  baseVelocity?: number
  direction?: "normal" | "reverse"
  /** Optional easing function for path progress. */
  easing?: (value: number) => number
  /** Slow movement while an item is hovered. */
  slowdownOnHover?: boolean
  /** Speed multiplier while hovering. */
  slowDownFactor?: number
  slowDownSpringConfig?: SpringConfig
  /** Add scroll velocity to the movement speed. */
  useScrollVelocity?: boolean
  /** Change direction from the latest scroll direction. */
  scrollAwareDirection?: boolean
  scrollSpringConfig?: SpringConfig
  /** Number of times to repeat slot content. */
  repeat?: number
  /** Allow pointer dragging along the path. */
  draggable?: boolean
  /** Multiplier applied to pointer drag velocity. */
  dragSensitivity?: number
  /** Decay applied to released drag momentum. */
  dragVelocityDecay?: number
  /** Follow the latest drag direction automatically. */
  dragAwareDirection?: boolean
  /** Use grab and grabbing cursors when draggable. */
  grabCursor?: boolean
  /** Layer items based on their current path position. */
  enableRollingZIndex?: boolean
  zIndexBase?: number
  zIndexRange?: number
  /** Interpolate CSS variables across path progress. */
  cssVariableInterpolation?: CssVariableInterpolation[]
  /** Scale the path coordinate space to fit its container. */
  responsive?: boolean
  /** Classes merged onto the root element. */
  className?: string
  /** Classes merged onto every repeated item wrapper. */
  itemClassName?: string
  children?: ReactNode
}

/** Keep a numeric prop inside sane bounds. */
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function PathMarquee({
  path,
  pathId,
  showPath = false,
  width = "100%",
  height = "100%",
  viewBox = "0 0 100 100",
  preserveAspectRatio = "xMidYMid meet",
  baseVelocity = 5,
  direction = "normal",
  easing,
  slowdownOnHover = false,
  slowDownFactor = 0.3,
  slowDownSpringConfig = { damping: 50, stiffness: 400 },
  useScrollVelocity = false,
  scrollAwareDirection = false,
  scrollSpringConfig = { damping: 50, stiffness: 400 },
  repeat = 3,
  draggable = false,
  dragSensitivity = 0.2,
  dragVelocityDecay = 0.96,
  dragAwareDirection = false,
  grabCursor = false,
  enableRollingZIndex = true,
  zIndexBase = 1,
  zIndexRange = 10,
  cssVariableInterpolation = [],
  responsive = false,
  className,
  itemClassName,
  children,
}: PathMarqueeProps) {
  const generatedId = useId()
  const resolvedPathId = pathId ?? `path-marquee-${generatedId}`

  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  const [totalLength, setTotalLength] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  /** Offset along the path, normalised to [0, 1). */
  const progress = useMotionValue(0)

  /** Hover slowdown, spring-driven so the change feels physical. */
  const hoverTarget = useMotionValue(1)
  const hoverFactor = useSpring(hoverTarget, slowDownSpringConfig)

  /** Momentum carried after a drag is released, in progress units per second. */
  const dragMomentum = useRef(0)
  const isDragging = useRef(false)
  const dragState = useRef<{
    lastX: number
    lastY: number
    lastTime: number
  } | null>(null)

  const { scrollY } = useScroll()
  const scrollVelocityRaw = useVelocity(scrollY)
  const scrollVelocity = useSpring(scrollVelocityRaw, scrollSpringConfig)

  const childArray = Children.toArray(children)
  const childCount = childArray.length
  const repeatCount = Math.max(1, Math.floor(repeat))
  const itemCount = childCount * repeatCount

  // Measure the path once it is in the DOM, and whenever the path data changes.
  useEffect(() => {
    const element = pathRef.current
    if (!element) return
    setTotalLength(element.getTotalLength())
  }, [path])

  // Trim stale refs if the item count shrinks.
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, itemCount)
  }, [itemCount])

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReducedMotion(query.matches)

    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  useAnimationFrame((_, delta) => {
    const pathElement = pathRef.current
    const svgElement = svgRef.current
    const container = containerRef.current

    if (!pathElement || !svgElement || !container || totalLength <= 0) return
    if (itemCount === 0) return

    // Clamp large frame gaps so a backgrounded tab does not jump the marquee.
    const seconds = clamp(delta, 0, 64) / 1000

    let directionSign = direction === "reverse" ? -1 : 1
    const scrollSpeed = useScrollVelocity ? scrollVelocity.get() : 0

    if (useScrollVelocity && scrollAwareDirection && Math.abs(scrollSpeed) > 1) {
      directionSign = scrollSpeed > 0 ? 1 : -1
    }

    if (draggable && dragAwareDirection && Math.abs(dragMomentum.current) > 1e-4) {
      directionSign = dragMomentum.current > 0 ? 1 : -1
    }

    let speed = reducedMotion
      ? 0
      : baseVelocity * directionSign * hoverFactor.get()

    if (useScrollVelocity && !reducedMotion) {
      speed += scrollSpeed * 0.02
    }

    const travel = pathElement.getTotalLength()

    // Released drag momentum decays back to zero.
    if (draggable && !isDragging.current && Math.abs(dragMomentum.current) > 1e-5) {
      progress.set(
        wrap(0, 1, progress.get() + dragMomentum.current * seconds)
      )
      dragMomentum.current *= dragVelocityDecay
    } else if (draggable && !isDragging.current) {
      dragMomentum.current = 0
    }

    if (speed !== 0) {
      progress.set(wrap(0, 1, progress.get() + (speed * seconds) / travel))
    }

    // Read layout metrics once, then write every transform, to avoid
    // interleaving reads and writes inside the loop.
    const matrix = svgElement.getScreenCTM()
    if (!matrix) return

    const bounds = container.getBoundingClientRect()
    const offset = progress.get()

    for (let index = 0; index < itemCount; index += 1) {
      const element = itemRefs.current[index]
      if (!element) continue

      let position = wrap(0, 1, offset + index / itemCount)
      if (easing) position = clamp(easing(position), 0, 1)

      const point = pathElement.getPointAtLength(position * totalLength)
      const screenPoint = new DOMPoint(point.x, point.y).matrixTransform(matrix)
      const x = screenPoint.x - bounds.left
      const y = screenPoint.y - bounds.top

      element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`

      if (enableRollingZIndex) {
        element.style.zIndex = String(
          zIndexBase + Math.round(position * zIndexRange)
        )
      }

      for (const rule of cssVariableInterpolation) {
        const [rangeStart, rangeEnd] = rule.at ?? [0, 1]
        const span = rangeEnd - rangeStart
        const local =
          span === 0 ? (position >= rangeEnd ? 1 : 0) : (position - rangeStart) / span
        const eased = clamp(local, 0, 1)
        const value = rule.from + (rule.to - rule.from) * eased
        element.style.setProperty(rule.property, `${value}${rule.unit ?? ""}`)
      }
    }
  })

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggable || totalLength <= 0) return

    isDragging.current = true
    dragMomentum.current = 0
    dragState.current = {
      lastX: event.clientX,
      lastY: event.clientY,
      lastTime: performance.now(),
    }

    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggable || !isDragging.current || !dragState.current) return

    const pathElement = pathRef.current
    const svgElement = svgRef.current
    const container = containerRef.current
    if (!pathElement || !svgElement || !container || totalLength <= 0) return

    const matrix = svgElement.getScreenCTM()
    if (!matrix) return

    const deltaX = event.clientX - dragState.current.lastX
    const deltaY = event.clientY - dragState.current.lastY

    // Project the pointer movement onto the path tangent so dragging follows
    // the curve rather than the raw axis of movement.
    const epsilon = 0.002
    const current = progress.get()
    const start = pathElement.getPointAtLength(wrap(0, 1, current) * totalLength)
    const ahead = pathElement.getPointAtLength(
      wrap(0, 1, current + epsilon) * totalLength
    )

    const startScreen = new DOMPoint(start.x, start.y).matrixTransform(matrix)
    const aheadScreen = new DOMPoint(ahead.x, ahead.y).matrixTransform(matrix)

    const tangentX = aheadScreen.x - startScreen.x
    const tangentY = aheadScreen.y - startScreen.y
    const tangentLength =
      Math.hypot(tangentX, tangentY) || Number.EPSILON

    const unitX = tangentX / tangentLength
    const unitY = tangentY / tangentLength
    const projected = deltaX * unitX + deltaY * unitY

    // Convert screen pixels into progress units: `epsilon` of progress covers
    // `tangentLength` screen pixels.
    const progressDelta =
      ((projected * epsilon) / tangentLength) * dragSensitivity

    progress.set(wrap(0, 1, current + progressDelta))

    const now = performance.now()
    const elapsed = clamp(now - dragState.current.lastTime, 1, 64)
    dragMomentum.current = (progressDelta / elapsed) * 1000

    dragState.current.lastX = event.clientX
    dragState.current.lastY = event.clientY
    dragState.current.lastTime = now
  }

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggable) return

    isDragging.current = false
    dragState.current = null

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden",
        draggable && "touch-none select-none",
        draggable && grabCursor && "cursor-grab active:cursor-grabbing",
        className
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <svg
        ref={svgRef}
        viewBox={viewBox}
        preserveAspectRatio={responsive ? "none" : preserveAspectRatio}
        width={width}
        height={height}
        aria-hidden="true"
        focusable="false"
        className="block h-full w-full overflow-visible"
      >
        <path
          ref={pathRef}
          id={resolvedPathId}
          d={path}
          fill="none"
          stroke={showPath ? "currentColor" : "none"}
          strokeWidth={showPath ? 1 : 0}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="absolute inset-0">
        {Array.from({ length: itemCount }, (_, index) => (
          <div
            key={index}
            ref={(element) => {
              itemRefs.current[index] = element
            }}
            className={cn(
              "absolute top-0 left-0 will-change-transform",
              itemClassName
            )}
            onPointerEnter={() => {
              if (slowdownOnHover) hoverTarget.set(slowDownFactor)
            }}
            onPointerLeave={() => {
              if (slowdownOnHover) hoverTarget.set(1)
            }}
          >
            {childArray[index % childCount]}
          </div>
        ))}
      </div>
    </div>
  )
}
