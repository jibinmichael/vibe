import type { Transition } from "motion/react"

export const springEnter: Transition = {
  type: "spring",
  stiffness: 280,
  damping: 30,
  mass: 1,
}

export const easeExit: Transition = {
  type: "tween",
  duration: 0.2,
  ease: [0.4, 0, 0.2, 1],
}

export const subtleFade: Transition = {
  type: "tween",
  duration: 0.15,
  ease: "linear",
}
