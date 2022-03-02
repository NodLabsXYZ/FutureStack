import Link from 'next/link'

const NextLink = (props) => {
  return (
    <Link {...props}>
      {props.children}
    </Link>
  );
}

NextLink.defaultProps = {
  
  href: "https://www.example.com",
  children: "Example Link"
}

export default NextLink;