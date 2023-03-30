export const BREAKPOINT_SIZES = {
  xs: 320,
  sm: 563, // <-
  md: 768, // <-
  lg: 1024,
  xl: 1440,
};

export const BREAKPOINTS = {
  xs: `(max-width: ${BREAKPOINT_SIZES.xs}px)`,
  sm: `(min-width: ${BREAKPOINT_SIZES.xs}px and max-width: ${BREAKPOINT_SIZES.sm}px)`,
  md: `(min-width: ${BREAKPOINT_SIZES.sm}px) and (max-width: ${BREAKPOINT_SIZES.md}px)`,
  lg: `(min-width: ${BREAKPOINT_SIZES.md}px and max-width: ${BREAKPOINT_SIZES.lg}px)`,
  xl: `(min-width: ${BREAKPOINT_SIZES.lg}px and max-width: ${BREAKPOINT_SIZES.xl}px)`,
  xsAndSmaller: `(max-width: ${BREAKPOINT_SIZES.xs}px)`,
  smAndSmaller: `(max-width: ${BREAKPOINT_SIZES.sm}px)`,
  mdAndSmaller: `(max-width: ${BREAKPOINT_SIZES.md}px)`,
  lgAndSmaller: `(max-width: ${BREAKPOINT_SIZES.lg}px)`,
  xlAndSmaller: `(max-width: ${BREAKPOINT_SIZES.xl}px)`,
  xsAndLarger: `(min-width: ${BREAKPOINT_SIZES.xs + 1}px)`,
  smAndLarger: `(min-width: ${BREAKPOINT_SIZES.sm + 1}px)`,
  mdAndLarger: `(min-width: ${BREAKPOINT_SIZES.md + 1}px)`,
  lgAndLarger: `(min-width: ${BREAKPOINT_SIZES.lg + 1}px)`,
  xlAndLarger: `(min-width: ${BREAKPOINT_SIZES.xl + 1}px)`,
  mobile: `(max-width: ${BREAKPOINT_SIZES.md}px)`,
  desktop: `(min-width: ${BREAKPOINT_SIZES.md + 1}px)`,
};
