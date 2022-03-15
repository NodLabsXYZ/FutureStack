import { CopyBlock, dracula } from "react-code-blocks";

export default function ContractTokenUriDisplay(): JSX.Element {
    let display =
        `function tokenURI(uint256 tokenId) public view returns (string memory) {
    return abi.encodePacked(_baseURI() + tokenId + ".json");
}`;
    return (
        <>
            <code>YourContract.sol</code>
            <CopyBlock
                text={display}
                language={'javascript'}
                theme={dracula}
                codeBlock
            />
        </>
    )
}