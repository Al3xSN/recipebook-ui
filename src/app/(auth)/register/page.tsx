import type { Metadata } from 'next';
import { RegisterForm } from './_components/RegisterForm';

export const metadata: Metadata = { title: 'Create Account' };

const RegisterPage = () => <RegisterForm />;

export default RegisterPage;
