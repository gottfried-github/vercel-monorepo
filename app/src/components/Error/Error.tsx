interface Props {
  message: string
}

const Error = ({ message }: Props) => {
  return <div>{message}</div>
}

export default Error
