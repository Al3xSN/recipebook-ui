import { Metadata } from 'next';
import { LoginForm } from './_components/LoginForm';
import { SocialsLogin } from './_components/SocialsLogin';

export const metadata: Metadata = { title: 'Sign In' };

const LoginPage = () => (
  <>
    <h1 className="mb-1 text-3xl leading-tight font-bold text-(--text)">Welcome back</h1>
    <p className="mb-7 text-sm text-(--text2)">Sign in to your RecipeBook account.</p>

    <SocialsLogin />

    <LoginForm />
  </>
);

export default LoginPage;
