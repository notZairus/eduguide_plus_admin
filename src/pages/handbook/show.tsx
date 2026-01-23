import { useParams } from "react-router";

const Show = () => {
  const { id } = useParams();

  console.log(id);

  return <div>{id && id}</div>;
};

export default Show;
