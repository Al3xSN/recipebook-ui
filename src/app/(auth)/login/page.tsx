import type { Metadata } from 'next';
import { LoginForm } from './_components/LoginForm';

export const metadata: Metadata = { title: 'Sign In' };

const LoginPage = () => <LoginForm />;

export default LoginPage;
