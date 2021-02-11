import React from 'react'
import { render, screen } from '@testing-library/react'
import HeroPresentation from 'components/Hero/HeroPresentation'
import HeroBackground from 'images/hero-background.jpg'

import { WIDGET_HERO_LEFT } from 'common/constants'

// Presentation
describe('HeroPresentation', () => {
  test("Doesn't render without any props", () => {
    render(<HeroPresentation />)
    expect(screen.queryByTestId('HeroPresentation')).not.toBeInTheDocument()
  })
  test('Background set & no foreground content', () => {
    render(<HeroPresentation background={HeroBackground} />)
    expect(screen.getByTestId('HeroPresentation')).toMatchSnapshot()
  })
  const str = 'foregroundText'
  const strIcon = 'foregroundIcon'
  test('Has foreground content', () => {
    render(<HeroPresentation foreground={str} />)
    expect(screen.getByText(str)).toBeInTheDocument()
  })
  test('Has foregroundIcon content', () => {
    render(<HeroPresentation foregroundIcon={strIcon} />)
    expect(screen.getByText(strIcon)).toBeInTheDocument()
  })
  test('All content present', () => {
    render(<HeroPresentation background={HeroBackground} foreground={str} foregroundIcon={strIcon} />)
    expect(
      screen.getByText(strIcon, {
        exact: false,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByText(str, {
        exact: false,
      })
    ).toBeInTheDocument()
  })
  test('Renders "left" variant', () => {
    render(
      <HeroPresentation
        background={HeroBackground}
        foreground={str}
        foregroundIcon={strIcon}
        variant={WIDGET_HERO_LEFT}
      />
    )
    expect(screen.getByTestId('HeroPresentation')).toMatchSnapshot()
  })
})
