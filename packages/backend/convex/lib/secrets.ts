import {
  CreateSecretCommand,
  GetSecretValueCommand,
  type GetSecretValueCommandOutput,
  PutSecretValueCommand,
  ResourceExistsException,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager'

export function createSecretsManagerClient(): SecretsManagerClient {
  return new SecretsManagerClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  })
}

export function getSecretValue(
  secretName: string
): Promise<GetSecretValueCommandOutput> {
  const client = createSecretsManagerClient()
  const command = new GetSecretValueCommand({ SecretId: secretName })
  return client.send(command)
}

export async function upsertSecret(
  secretName: string,
  secretValue: Record<string, unknown>
): Promise<void> {
  const client = createSecretsManagerClient()
  try {
    await client.send(
      new CreateSecretCommand({
        Name: secretName,
        SecretString: JSON.stringify(secretValue),
      })
    )
  } catch (error) {
    if (error instanceof ResourceExistsException) {
      await client.send(
        new PutSecretValueCommand({
          SecretId: secretName,
          SecretString: JSON.stringify(secretValue),
        })
      )
    } else {
      throw error
    }
  }
}

export function parseSecretString<T = Record<string, unknown>>(
  secret: GetSecretValueCommandOutput
): T | null {
  if (!secret.SecretString) return null

  try {
    return JSON.parse(secret.SecretString) as T
  } catch {
    return null
  }
}
