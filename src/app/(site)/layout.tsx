import { ChatProvider } from '@/contexts/ChatContext';
import ChatWidget from '@/components/shared/ChatWidget';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatProvider>
      {children}
      <ChatWidget />
    </ChatProvider>
  );
}
