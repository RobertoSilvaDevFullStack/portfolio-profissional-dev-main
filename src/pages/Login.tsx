import { supabase } from '@/integrations/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const Login = () => {
  const { session } = useAuth();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/';

  if (session) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="min-h-screen bg-dark-navy flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800/30 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white">
            Acessar Painel ou Comentar
          </h2>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google']}
          theme="dark"
          localization={{
            variables: {
              sign_in: {
                email_label: 'Seu endereço de e-mail',
                password_label: 'Sua senha',
                button_label: 'Entrar',
                social_provider_text: 'Entrar com {{provider}}',
                link_text: 'Já tem uma conta? Entre',
              },
              sign_up: {
                email_label: 'Seu endereço de e-mail',
                password_label: 'Sua senha',
                button_label: 'Registrar',
                social_provider_text: 'Registrar com {{provider}}',
                link_text: 'Não tem uma conta? Registre-se',
              },
              forgotten_password: {
                email_label: 'Seu endereço de e-mail',
                button_label: 'Enviar instruções de recuperação',
                link_text: 'Esqueceu sua senha?',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Login;