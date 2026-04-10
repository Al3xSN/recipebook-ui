import type { Metadata } from 'next';
import { RegisterForm } from './_components/RegisterForm';

export const metadata: Metadata = { title: 'Create Account' };

export default function RegisterPage() {
  return <RegisterForm />;
}
