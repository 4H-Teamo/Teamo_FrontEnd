"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Login from "@/app/assets/login.svg";
import SpeechBubble from "@/app/components/speechBubble/speechBubble";
import KaKao from "@/app/assets/kakao.svg";

import useBackdrop from "@/app/hooks/useBackdrop";
import useKakaoLogin from "@/app/hooks/useKaKaoLogin";

const LoginPage = () => {
  const { handleBackdropClick } = useBackdrop();
  const { login } = useKakaoLogin();

  return (
    <motion.div
      className="fixed   inset-0 flex items-center justify-center bg-black/50  z-50"
      onClick={handleBackdropClick}
    >
      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-fit">
        <SpeechBubble text={"카카오 로그인으로 간편하게 시작할 수 있어요!"} />
        <Image src={Login} alt="로그인" />
        <button
          onClick={login}
          className="w-full flex justify-center mt-6"
        >
          <Image src={KaKao} alt="카카오 로그인" />
        </button>
      </div>
    </motion.div>
  );
};
export default LoginPage;