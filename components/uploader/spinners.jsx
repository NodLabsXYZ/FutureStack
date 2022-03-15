import ClipLoader from "react-spinners/ClipLoader";

const override = `
  display: block;
  margin: 0 auto;
  border-color: #4F5AE5;
`;

const color = '#4F5AE5';

export function LargeSpinner() {
    return (
        <ClipLoader color={color} loading={true} css={override} size={150} />
    );
}

export function SmallSpinner() {
    return (
        <ClipLoader color={color} loading={true} css={override} size={50} />
    );
}
