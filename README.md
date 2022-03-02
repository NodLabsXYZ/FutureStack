The ConnectWallet React component wraps the [web3modal](https://github.com/Web3Modal/web3modal) library with a basic configuration and a convenient button to connect your wallet.

It can be customized to provide more wallet options.

Once a wallet is connected any future component can be rendered. By default this component leverages a [CheckNetwork](http://localhost:3000/component/CheckNetwork) subcomponent that will verify that the wallet is on the correct network before proceeding.