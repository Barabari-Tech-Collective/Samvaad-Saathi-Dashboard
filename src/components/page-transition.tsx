"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { usePathname } from "next/navigation"

const STAGGER_DELAY = 0.08
const CARD_DURATION = 0.26

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER_DELAY,
      delayChildren: 0.02,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: CARD_DURATION, ease: "easeOut" },
  },
}

function withStaggeredChildren(children: React.ReactNode) {
  if (!React.isValidElement<{ children?: React.ReactNode }>(children)) {
    return <motion.div variants={itemVariants}>{children}</motion.div>
  }

  const rootChildren = children.props.children
  const items = React.Children.toArray(rootChildren)

  if (items.length === 0) {
    return children
  }

  const staggeredChildren = items.map((item, index) => (
    <motion.div
      key={`stagger-item-${index}`}
      variants={itemVariants}
      className="will-change-transform"
    >
      {item}
    </motion.div>
  ))

  return React.cloneElement(children, undefined, staggeredChildren)
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hasMountedRef = React.useRef(false)

  React.useEffect(() => {
    hasMountedRef.current = true
  }, [])

  const shouldAnimate = hasMountedRef.current

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className="h-full"
        variants={containerVariants}
        initial={shouldAnimate ? "hidden" : false}
        animate="visible"
      >
        {withStaggeredChildren(children)}
      </motion.div>
    </AnimatePresence>
  )
}
