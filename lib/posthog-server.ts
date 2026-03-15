import { PostHog } from 'posthog-node'

type CaptureServerEventParams = {
  distinctId: string
  event: string
  properties?: Record<string, string | number | boolean | null>
}

export async function captureServerEvent({
  distinctId,
  event,
  properties = {},
}: CaptureServerEventParams) {
  if (!process.env.POSTHOG_KEY || !process.env.POSTHOG_HOST) {
    return
  }

  const posthog = new PostHog(process.env.POSTHOG_KEY, {
    host: process.env.POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  })

  posthog.capture({
    distinctId,
    event,
    properties,
  })

  await posthog.shutdown()
}