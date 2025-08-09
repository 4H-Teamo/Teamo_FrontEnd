import { signIn } from 'next-auth/react';

export const handleSocialSignIn = async () => {
	await signIn('kakao');
};