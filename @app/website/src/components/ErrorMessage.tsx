import { Error } from "../types/Error";

type Props = {
  error: Error;
  onClose: () => void;
}

export const ErrorMessage = ({ error, onClose }: Props) => {
  return (
    <div className="notification is-danger fixed right-5 bottom-5">
      <button onClick={onClose} className="delete"/>
      {error}
    </div>
  );
};
