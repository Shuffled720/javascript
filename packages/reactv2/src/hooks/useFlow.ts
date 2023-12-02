import { Flow, Frigade } from '@frigade/js'
import { useContext, useEffect, useRef, useState } from 'react'

import { FrigadeContext } from '../components/Provider'

export function useFlow(flowId: string) {
  const [flow, setFlow] = useState<Flow>()
  const { apiKey, apiUrl, userId } = useContext(FrigadeContext)

  const frigadeRef = useRef(new Frigade(apiKey, { apiUrl, userId }))
  const frigade = frigadeRef.current

  const handler = (updatedFlow: Flow) => {
    if (updatedFlow.id !== flowId) {
      return
    }

    const clonedFlow = Object.assign(Object.create(Object.getPrototypeOf(updatedFlow)), updatedFlow)

    setFlow(clonedFlow)
  }

  useEffect(() => {
    ;(async () => {
      const flowResponse: Flow = await frigade.getFlow(flowId)

      setFlow(flowResponse)
    })()

    frigade.onStateChange(handler)

    return () => {
      frigade.removeStateChangeHandler(handler)
    }
  }, [])

  return { flow }
}
