// Mock: react-redux
// --------------------------------------------------
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}))

// Let us begin!
// ==================================================
import React from 'react'
import renderer from 'react-test-renderer'
import AuthenticationFilterData from 'components/AuthenticationFilter/AuthenticationFilterData'
import AuthenticationFilterPresentation from 'components/AuthenticationFilter/AuthenticationFilterPresentation'
import { SECTIONS } from 'common/Constants'

describe('AuthenticationFilter', () => {
  // Data
  test('Data', () => {
    // Updated in AuthenticationFilterData.children
    let output = {}

    renderer.create(
      <AuthenticationFilterData>
        {(dataLayerOutput) => {
          output = dataLayerOutput
          return null
        }}
      </AuthenticationFilterData>
    )
    expect(output).toMatchInlineSnapshot(`
      Object {
        "computeLogin": undefined,
        "routeParams": undefined,
      }
    `)
  })

  // Presentation
  test('Presentation: render Error403', () => {
    const testProps = {
      is403: true,
      hideFromSections: false,
    }

    const component = renderer.create(<AuthenticationFilterPresentation {...testProps} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
  test('Presentation: render CircularProgress', () => {
    const testProps = {
      computeLogin: {
        isFetching: true,
      },
    }
    const component = renderer.create(<AuthenticationFilterPresentation {...testProps} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
  test('Presentation: render null', () => {
    const testProps = {
      computeLogin: {
        success: true,
        isConnected: true,
      },
      routeParams: {
        area: SECTIONS,
      },
      hideFromSections: true,
    }
    const component = renderer.create(<AuthenticationFilterPresentation {...testProps} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
  test('Presentation: render children', () => {
    const testProps = {
      computeLogin: {
        success: true,
        isConnected: true,
      },
      routeParams: {
        area: SECTIONS,
      },
      hideFromSections: false,
      children: 'renderedChildren',
    }
    const component = renderer.create(<AuthenticationFilterPresentation {...testProps} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
  test('Presentation: render notAuthenticatedComponent v1', () => {
    const testProps = {
      computeLogin: {
        success: true,
        isConnected: false,
      },
      notAuthenticatedComponent: <div>renderedNotAuthenticatedComponent</div>,
    }
    const component = renderer.create(<AuthenticationFilterPresentation {...testProps} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
  test('Presentation: render notAuthenticatedComponent v2', () => {
    const testProps = {
      computeLogin: {
        success: false,
      },
      notAuthenticatedComponent: <div>renderedNotAuthenticatedComponent</div>,
    }
    const component = renderer.create(<AuthenticationFilterPresentation {...testProps} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
