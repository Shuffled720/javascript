import { useEffect, useLayoutEffect, useState } from 'react'
import { keyframes } from '@emotion/react'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaOptionsType } from 'embla-carousel'

import { Box } from '@/components/Box'
import { Button } from '@/components/Button'
import { Flex } from '@/components/Flex'
import type { FlowChildrenProps } from '@/components/Flow'
import * as Progress from '@/components/Progress'
import { Text } from '@/components/Text'

import type { StepHandlerProps } from '@/hooks/useStepHandlers'

import { CarouselStep } from '@/components/Checklist/CarouselStep'

import { theme } from '@/shared/theme'

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

export function CarouselEmblaWrapper({
  flow,
  parentProps: { containerProps },
  step,
}: FlowChildrenProps) {
  const currentStepIndex = flow.getCurrentStepIndex()

  const [emblaOptions] = useState<Partial<EmblaOptionsType>>({
    align: 'start',
    container: '.fr-carousel-content',
    skipSnaps: true,
    slides: '.fr-carousel-step',
    startIndex: currentStepIndex,
  })

  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions)

  const [hasNext, setHasNext] = useState<boolean>()
  const [hasPrev, setHasPrev] = useState<boolean>()

  useLayoutEffect(() => {
    if (!emblaApi) {
      return
    }

    if (hasNext == null) {
      setHasNext(emblaApi.canScrollNext())
    }

    if (hasPrev == null) {
      setHasPrev(emblaApi.canScrollPrev())
    }

    emblaApi.on('select', () => {
      setHasNext(emblaApi.canScrollNext())
      setHasPrev(emblaApi.canScrollPrev())
    })
  }, [emblaApi])

  useEffect(() => {
    function handleChange() {
      const currentStepIndex = flow.getCurrentStepIndex()
      const selectedScrollSnap = emblaApi.selectedScrollSnap()

      if (currentStepIndex !== selectedScrollSnap) {
        emblaApi.scrollTo(currentStepIndex)
      }
    }

    step.onStateChange(handleChange)

    return () => {
      step.removeStateChangeHandler(handleChange)
    }
  }, [emblaApi, flow, step])

  const completedSteps = flow.getNumberOfCompletedSteps()
  const availableSteps = flow.getNumberOfAvailableSteps()

  const { onPrimary, onSecondary }: StepHandlerProps = containerProps

  return (
    <>
      <Flex.Row
        css={{
          '@container (max-width: 750px)': {
            flexDirection: 'column',
            gap: theme.space[5],
          },
        }}
        justifyContent="space-between"
        part="carousel-header"
      >
        <Flex.Column part="carousel-header-content">
          <Text.H3>{flow.title}</Text.H3>
          <Text.Body2 color="neutral.400">{flow.subtitle}</Text.Body2>
        </Flex.Column>
        <Flex.Row alignItems="center" gap={2} part="progress">
          <Text.Body2 fontWeight="demibold" part="progress-text">
            {completedSteps}/{availableSteps}
          </Text.Body2>
          <Progress.Bar current={completedSteps} total={availableSteps} minWidth="200px" />
        </Flex.Row>
      </Flex.Row>

      <Box
        margin={`0 ${theme.space[-4]}`}
        overflow="hidden"
        part="carousel-wrapper"
        px="4"
        position="relative"
        ref={emblaRef}
      >
        <Flex.Row gap={4} part="carousel-content">
          {Array.from(flow.steps.values()).map((step) => (
            <CarouselStep
              key={step.id}
              onPrimary={onPrimary}
              onSecondary={onSecondary}
              step={step}
            />
          ))}
        </Flex.Row>

        {hasPrev && (
          <Flex.Column
            animation={`${fadeIn} 300ms ease-out`}
            background="linear-gradient(to right, rgba(255, 255, 255, 0.5), transparent 50%)"
            bottom="0"
            left="0"
            justifyContent="center"
            paddingLeft="3"
            part="carousel-prev-wrapper"
            position="absolute"
            top="0"
          >
            <Button.Plain
              border="1px solid neutral.border"
              borderRadius="100%"
              boxShadow="md"
              backgroundColor="neutral.background"
              color="primary.surface"
              onClick={() => emblaApi.scrollPrev()}
              padding="2"
            >
              <ArrowLeftIcon height="24px" width="24px" />
            </Button.Plain>
          </Flex.Column>
        )}

        {hasNext && (
          <Flex.Column
            animation={`${fadeIn} 300ms ease-out`}
            background="linear-gradient(to left, rgba(255, 255, 255, 0.5), transparent 50%)"
            bottom="0"
            justifyContent="center"
            paddingRight="3"
            part="carousel-next-wrapper"
            position="absolute"
            right="0"
            top="0"
          >
            <Button.Plain
              border="1px solid neutral.border"
              borderRadius="100%"
              boxShadow="md"
              backgroundColor="neutral.background"
              color="primary.surface"
              onClick={() => emblaApi.scrollNext()}
              padding="2"
            >
              <ArrowRightIcon height="24px" width="24px" />
            </Button.Plain>
          </Flex.Column>
        )}
      </Box>
    </>
  )
}
