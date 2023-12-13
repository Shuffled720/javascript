import { MouseEvent, useCallback, useContext } from 'react'

import type { FlowStep } from '@frigade/js'

import { FrigadeContext } from '../components/Provider'

export type StepHandler = (
  step: FlowStep,
  event?: MouseEvent<unknown>
) => Promise<boolean | void> | (boolean | void)

export interface StepHandlers {
  onPrimary?: StepHandler
  onSecondary?: StepHandler
}

export function useStepHandlers(step: FlowStep, { onPrimary, onSecondary }: StepHandlers = {}) {
  const { navigate } = useContext(FrigadeContext)

  return {
    handlePrimary: useCallback(
      async (e: MouseEvent<unknown>) => {
        const continueDefault = await onPrimary?.(step, e)

        if (continueDefault === false) {
          e.preventDefault()
          return false
        }

        await step.complete()

        if (step.primaryButtonUri != null) {
          navigate(step.primaryButtonUri, step.primaryButtonUriTarget)
        }
      },
      [step]
    ),

    handleSecondary: useCallback(
      async (e: MouseEvent<unknown>) => {
        const continueDefault = await onSecondary?.(step, e)

        if (continueDefault === false) {
          e.preventDefault()
          return false
        }

        // Should there be a step.skip method?
        await step.complete()

        if (step.secondaryButtonUri != null) {
          navigate(step.secondaryButtonUri, step.secondaryButtonUriTarget)
        }
      },
      [step]
    ),
  }
}
