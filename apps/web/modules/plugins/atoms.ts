import { atomWithStorage } from 'jotai/utils'
import { Doc } from '@workspace/backend/_generated/dataModel'

export const createSecretDataAtom = (
  organizationId: string,
  service: Doc<'plugins'>['service']
) => {
  return atomWithStorage<{
    publicApiKey: string
    privateApiKey: string
  } | null>(`tenant/${organizationId}/${service}`, null)
}
