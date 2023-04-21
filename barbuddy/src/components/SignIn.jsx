import React from "react";

import { auth, provider } from "./firebase";

const SignIn = () => {
  const signInWithGoogle = async () => {
    try {
      await auth.signInWithPopup(provider);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
};

export default SignIn;