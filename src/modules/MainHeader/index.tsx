import { Button } from "@mui/base";
import { PageNames } from "globalTypes/routing";
import React from "react";
import { Link } from "react-router-dom";

interface Props {}

export const MainHeader = ({}: Props) => {
  return (
    <div className=" pt-3  pb-3">
      <Link className=" p-3" to={PageNames.corrector}>
        Corrector
      </Link>
      <Link className=" p-3" to={PageNames.interlocutor}>
        Interlocutor
      </Link>
    </div>
  );
};
