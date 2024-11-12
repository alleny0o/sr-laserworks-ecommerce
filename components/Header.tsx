"use client";

import { useUser } from "@clerk/nextjs";

const Header = () => {
  const { user } = useUser();

  console.log(user);

  return <div>Header</div>;
};

export default Header;
