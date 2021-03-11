import '@testing-library/jest-dom'
import { useState as useStateMock } from 'react'

jest.mock('common/useGetSections')
jest.mock('services/api')
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}))

const setState = jest.fn()
beforeEach(() => {
  useStateMock.mockImplementation((init) => [init, setState])
})
