'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
  contactSessionIdAtomFamily,
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  screenAtom,
} from '@/modules/widget/atoms/widget-atoms'
import { WidgetHeader } from '@/modules/widget/ui/components/widget-header'
import { LoaderIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAction, useMutation } from 'convex/react'
import { api } from '@workspace/backend/_generated/api'
import { Id } from '@workspace/backend/_generated/dataModel'

type InitStep = 'org' | 'session' | 'settings' | 'vapi' | 'done'

export const WidgetLoadingScreen = ({
  organizationId,
}: {
  organizationId: string | null
}) => {
  const [step, setStep] = useState<InitStep>('org')
  const [sessionValid, setSessionValid] = useState(false)

  const [loadingMessage, setLoadingMessage] = useAtom(loadingMessageAtom)
  const setOrganizationId = useSetAtom(organizationIdAtom)
  const setErrorMessage = useSetAtom(errorMessageAtom)
  const setScreen = useSetAtom(screenAtom)

  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || '')
  )

  const validateOrganization = useAction(api.public.organizations.validate)
  const validateContactSession = useMutation(
    api.public.contactSessions.validate
  )

  // Step 1: Validate Organization
  useEffect(() => {
    if (step !== 'org') return

    setLoadingMessage('Finding organization ID...')
    if (!organizationId) {
      setErrorMessage('Organization ID is missing.')
      setScreen('error')
    }

    setLoadingMessage('Verifying organization...')

    validateOrganization({ organizationId: organizationId! })
      .then((result) => {
        if (result.valid) {
          setOrganizationId(organizationId)
          setStep('session')
        } else {
          setErrorMessage(result.reason || 'Invalid configuration')
          setScreen('error')
        }
      })
      .catch((err) => {
        console.error(err)
        setErrorMessage('An error occurred while validating organization.')
        setScreen('error')
      })
  }, [
    step,
    organizationId,
    setErrorMessage,
    setScreen,
    setOrganizationId,
    setStep,
  ])

  // Step 2: Validate session (if exists)
  useEffect(() => {
    if (step !== 'session') return

    setLoadingMessage('Finding contact session ID...')

    if (!contactSessionId) {
      setSessionValid(false)
      setStep('done')
      return
    }

    setLoadingMessage('Validating session...')

    validateContactSession({ contactSessionId })
      .then((result) => {
        setSessionValid(result.valid)
        setStep('done')
      })
      .catch((error) => {
        console.error(error)
        setSessionValid(false)
        setStep('done')
      })
  }, [step, contactSessionId, validateContactSession, setLoadingMessage])

  useEffect(() => {
    if (step !== 'done') return

    const hasValidSession = contactSessionId && sessionValid
    setScreen(hasValidSession ? 'selection' : 'auth')
  }, [step, contactSessionId, sessionValid, setScreen])

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
          <p className="text-3xl">Hi there! 👏</p>
          <p className="text-lg">Let&apos;s get you started</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
        <LoaderIcon className="animate-spin" />
        <p className="text-sm">{loadingMessage || 'Loading...'}</p>
      </div>
    </>
  )
}
