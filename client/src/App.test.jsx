import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App, { AppRoot } from './App'

function ThrowingHeader() {
  throw new Error('header crash')
}

function ThrowingMintPanel() {
  throw new Error('mint crash')
}

function StableAssetsPanel() {
  return <div>Assets still online</div>
}

describe('App error boundaries', () => {
  let consoleErrorSpy

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
    delete globalThis.Sentry
    vi.restoreAllMocks()
  })

  it('renders the dashboard by default', () => {
    render(<App />)

    expect(screen.getByText(/mint new token/i)).toBeInTheDocument()
    expect(screen.getByText(/my assets/i)).toBeInTheDocument()
  })

  it('shows a section fallback and keeps healthy panels visible when a risky component crashes', () => {
    render(
      <App
        components={{
          MintPanel: ThrowingMintPanel,
          AssetsPanel: StableAssetsPanel,
        }}
      />,
    )

    expect(screen.getByText(/mint form temporarily unavailable/i)).toBeInTheDocument()
    expect(screen.getByText(/assets still online/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('shows the full oops page and refresh button for app-level crashes', () => {
    render(
      <AppRoot
        components={{
          Header: ThrowingHeader,
        }}
      />,
    )

    expect(screen.getByText(/oops/i)).toBeInTheDocument()
    expect(screen.getByText(/the app hit an unexpected problem/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /refresh page/i })).toBeInTheDocument()
  })

  it('logs captured crashes to Sentry when available', () => {
    const captureException = vi.fn()
    globalThis.Sentry = { captureException }

    render(
      <AppRoot
        components={{
          Header: ThrowingHeader,
        }}
      />,
    )

    expect(captureException).toHaveBeenCalledTimes(1)
    expect(captureException.mock.calls[0][0]).toBeInstanceOf(Error)
    expect(captureException.mock.calls[0][1]).toMatchObject({
      extra: {
        area: 'main-app',
      },
    })
  })
})
