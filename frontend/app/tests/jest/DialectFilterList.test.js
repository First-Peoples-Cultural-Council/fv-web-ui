beforeAll(() => jest.spyOn(React, 'useEffect').mockImplementation(React.useLayoutEffect))
afterAll(() => React.useEffect.mockRestore())

// Mock: react-redux
// --------------------------------------------------
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}))

// Mock: useRoute
// --------------------------------------------------
import * as useNavigationHelpers from 'common/useNavigationHelpers'
const spyUseNavigationHelpers = jest.spyOn(useNavigationHelpers, 'default')
spyUseNavigationHelpers.mockReturnValue({
  getSearchAsObject: () => {
    return { category: '2100b13d-218e-4660-927a-9f80475a8019' }
  },
})

// Let us begin!
// ==================================================
import React from 'react'
import renderer from 'react-test-renderer'
import { queryParam, filterListData } from './DialectFilterList.test.data'
import DialectFilterListData from 'components/DialectFilterList/DialectFilterListData'
import DialectFilterListPresentation from 'components/DialectFilterList/DialectFilterListPresentation'
import { Provider } from 'react-redux'
import store from 'state/store'
// import util from 'util'
describe('DialectFilterList', () => {
  // Updated in Data test > DialectFilterListData.children
  // Reused in Presentation
  let DataOutput = {}
  // Data
  test('Data', () => {
    renderer.create(
      <DialectFilterListData queryParam={queryParam} filterListData={filterListData}>
        {(dataLayerOutput) => {
          DataOutput = dataLayerOutput
          // console.log('util', util.inspect(output, {depth: null}))
          return null
        }}
      </DialectFilterListData>
    )
    expect(DataOutput).toMatchInlineSnapshot(`
      Object {
        "listItemData": Array [
          Object {
            "children": Array [
              Object {
                "hasActiveParent": true,
                "href": "/?category=2e6a992f-2023-4be9-8317-2e7a824a349b",
                "isActive": false,
                "text": "Child Category IIII",
                "uid": "2e6a992f-2023-4be9-8317-2e7a824a349b",
              },
              Object {
                "hasActiveParent": true,
                "href": "/?category=727cbb38-913f-40d9-9bde-ad83bf4129c9",
                "isActive": false,
                "text": "Child Category IIᑕ",
                "uid": "727cbb38-913f-40d9-9bde-ad83bf4129c9",
              },
            ],
            "hasActiveChild": false,
            "href": "/?category=2100b13d-218e-4660-927a-9f80475a8019",
            "isActive": true,
            "text": "Parent Category II",
            "uid": "2100b13d-218e-4660-927a-9f80475a8019",
          },
          Object {
            "children": Array [
              Object {
                "hasActiveParent": false,
                "href": "/?category=2446869b-8109-42ff-89a6-b37b4ddb35c8",
                "isActive": false,
                "text": "Child Category OII",
                "uid": "2446869b-8109-42ff-89a6-b37b4ddb35c8",
              },
              Object {
                "hasActiveParent": false,
                "href": "/?category=15bb8a84-f203-4a64-aa37-b97787d8b1ca",
                "isActive": false,
                "text": "Child Category Oᑕ",
                "uid": "15bb8a84-f203-4a64-aa37-b97787d8b1ca",
              },
            ],
            "hasActiveChild": false,
            "href": "/?category=b64f12e3-3f83-4046-99d5-872ff16e0762",
            "isActive": false,
            "text": "Parent Category O",
            "uid": "b64f12e3-3f83-4046-99d5-872ff16e0762",
          },
          Object {
            "children": Array [
              Object {
                "hasActiveParent": false,
                "href": "/?category=c2d3c4c2-b35c-438e-ae87-872fefe274ab",
                "isActive": false,
                "text": "Child Category ᑕII",
                "uid": "c2d3c4c2-b35c-438e-ae87-872fefe274ab",
              },
              Object {
                "hasActiveParent": false,
                "href": "/?category=9c5c2e23-25df-4faa-bdb6-b297ba105461",
                "isActive": false,
                "text": "Child Category ᑕᑕ",
                "uid": "9c5c2e23-25df-4faa-bdb6-b297ba105461",
              },
            ],
            "hasActiveChild": false,
            "href": "/?category=db456452-da58-4c75-81ba-8c5d13153c4e",
            "isActive": false,
            "text": "Parent Category ᑕ",
            "uid": "db456452-da58-4c75-81ba-8c5d13153c4e",
          },
        ],
      }
    `)
  })
  // Presentation
  test('Presentation', () => {
    const component = renderer.create(
      <Provider store={store}>
        <DialectFilterListPresentation title="Jest Testing" listItemData={DataOutput.listItemData} />
      </Provider>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
