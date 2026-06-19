import { useNavigate } from 'react-router';

import { Settings } from '@/widget/settings/components/Settings';

export function SettingsRoute() {
  const navigate = useNavigate();
  return <Settings onBack={() => void navigate('/')} />;
}
