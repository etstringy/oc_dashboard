import Header from "@oc/components/Dashboard/Header";
import HeaderContainer from "@oc/components/Dashboard/HeaderContainer";
import Subtitle from "@oc/components/Dashboard/Subtitle";
import AuthContext from "@oc/context/AuthContext";
import React, { Fragment, useContext } from "react";
import Image from 'next/image';

export default function me() {
  const auth = useContext(AuthContext);
  return (
    <Fragment>
      <HeaderContainer>
        <Header>👋 hey {auth.user.username}</Header>
        <Subtitle>what's up and shit</Subtitle>
      </HeaderContainer>

      <Image src="/ducc.gif" width={500} height={500} alt="duck"></Image>
    </Fragment>
  );
}
