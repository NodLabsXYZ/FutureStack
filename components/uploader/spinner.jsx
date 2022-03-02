import ClipLoader from "react-spinners/ClipLoader";

const override = `
  display: block;
  margin: 0 auto;
  border-color: #4F5AE5;
`;

const color = '#4F5AE5';

export default function Spinner() {
    return (
        <ClipLoader color={color} loading={true} css={override} size={150} />
        // <span>Loading...</span>
    );
}
