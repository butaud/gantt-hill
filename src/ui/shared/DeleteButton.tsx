import { FC } from "react";

import "./DeleteButton.css";

export const DeleteButton: FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <a className="delete" onClick={onClick} title="Delete">
      X
    </a>
  );
};
