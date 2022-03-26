import renderer from 'react-test-renderer';
const { act } = renderer;

import FutureStackLayout from '../../components/FutureStackLayout'

describe("FutureStackLayout", () => {
  let component = null;

  describe("with user", () => {

    beforeEach(async () => {        
      await act(async () => {
        component = renderer.create(
          <FutureStackLayout
            provider={provider}
            contract={contract}
            onMint={onMint}
          />
        )
      })
    })
  
    it("should render the minting button", () => {
      const buttons = component.root.findAllByType(MintPriceAndButton)
      expect(buttons).toHaveLength(1)
    })

  })

})