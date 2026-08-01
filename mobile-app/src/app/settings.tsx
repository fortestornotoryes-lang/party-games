import { useRouter } from 'expo-router';

import { Settings } from '@/widgets/settings/components/Settings';

export default function SettingsRoute() {
  const router = useRouter();
  return (
    <Settings
      onBack={() => {
        router.back();
      }}
    />
  );
}
