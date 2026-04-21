import { useApp } from '../context/AppContext';

export function useTranslation() {
  const { t, language, setLanguage, dir } = useApp();
  return { t, language, setLanguage, dir };
}
