import { UsuarioProvider } from '../context/usuario-context';
import './../assets/css/argon-dashboard.css';
import './../assets/css/nucleo-icons.css';
import './../assets/css/nucleo-svg.css';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <UsuarioProvider>
        <body>{children}</body>
      </UsuarioProvider>
    </html>
  );
}
