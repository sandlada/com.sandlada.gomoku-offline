import { computeBreakpointState } from '@sandlada/breakpoint'

/** Reflect @sandlada/breakpoint default width breakpoints on <html> as data attributes. */
export const updateRootBreakpoints = (width: number = window.innerWidth, height: number = window.innerHeight): void => {
    const state = computeBreakpointState(width, height)
    const root = document.documentElement
    if (state.primaryWidthBreakpoint) root.dataset.bpWidth = state.primaryWidthBreakpoint
    else delete root.dataset.bpWidth
    root.dataset.bpActive = state.activeWidthBreakpoints.join(' ')
}

/** Attach root-breakpoint sync; returns a cleanup function. */
export const watchRootBreakpoints = (): (() => void) => {
    updateRootBreakpoints()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
}

const onResize = (): void => updateRootBreakpoints()
