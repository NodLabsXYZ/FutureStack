import renderer from 'react-test-renderer';
const { act } = renderer;

jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/',
    query: {},
  })
}))

import FutureStackHeader from '../../components/FutureStackNavigation'

import FutureStackNavigation from '../../components/FutureStackNavigation'
jest.mock('../../components/FutureStackNavigation')

FutureStackNavigation.mockImplementation(() => {
  return <div>FutureStackNavigation</div>
})

import FutureStackLayout from '../../components/FutureStackLayout'

describe("FutureStackLayout", () => {
  
  let component = null;

  describe("with user", () => {
    const user = {}

    beforeEach(async () => {        
      await act(async () => {
        component = renderer.create(
          <FutureStackLayout
            user={user}
          >
            <div id="children">Children</div>
          </FutureStackLayout>
        )
      })
    })

    it("should render", () => {
      expect(component.toJSON()).toMatchSnapshot()
    })

    it("should render the header", () => {
      const header = component.root.findAllByType(FutureStackHeader)
      expect(header).toHaveLength(1)
    })

    it("should render the navigation", () => {
      const navigation = component.root.findAllByType(FutureStackNavigation)
      expect(navigation).toHaveLength(1)
    })

    it("should render the children", () => {
      const children = component.root.findByProps({ id: 'children' })
      expect(children).not.toBeNull()
    })

  })

})