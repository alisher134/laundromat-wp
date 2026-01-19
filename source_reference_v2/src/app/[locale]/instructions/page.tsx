import { InstructionsPage } from '@/pagesLayer/InstructionsPage';
import { BreadcrumbSchema, ItemListSchema } from '@/shared/components/JsonLdSchema';
import { INSTRUCTIONS_DATA } from '@/shared/data';
import { SITE_CONFIG } from '@/shared/config/seo.config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Instructions',
  description: 'Step-by-step instructions for using our laundromat facilities',
  openGraph: {
    title: `Instructions | ${SITE_CONFIG.name}`,
    description: 'Step-by-step instructions for using our laundromat facilities',
  },
};

export default function Page() {
  const instructionItems = INSTRUCTIONS_DATA.map((instruction, index) => ({
    name: `Instruction ${index + 1}`,
    url: `${SITE_CONFIG.url}/instructions/${instruction.key}`,
  }));

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_CONFIG.url },
          { name: 'Instructions', url: `${SITE_CONFIG.url}/instructions` },
        ]}
      />
      <ItemListSchema items={instructionItems} />
      <InstructionsPage />
    </>
  );
}
