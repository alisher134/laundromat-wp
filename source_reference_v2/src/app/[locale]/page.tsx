import { MainPage } from '@/pagesLayer/MainPage';
import { LocalBusinessSchema, WebSiteSchema } from '@/shared/components/JsonLdSchema';

export default function Page() {
  return (
    <>
      <LocalBusinessSchema />
      <WebSiteSchema />
      <MainPage />
    </>
  );
}
