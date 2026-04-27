import { Metadata } from 'next';
import { RegisterForm } from './_components/RegisterForm';

export const metadata: Metadata = { title: 'Create Account' };

const RegisterPage = () => (
  <>
    <h1 className="mb-1 text-3xl leading-tight font-bold text-(--text)">Create account</h1>
    <p className="mb-7 text-sm text-(--text2)">Join thousands of home cooks.</p>

    <RegisterForm />
  </>
);

export default RegisterPage;
