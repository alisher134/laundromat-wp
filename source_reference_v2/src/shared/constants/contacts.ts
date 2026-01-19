export const CONTACTS = {
  phone: '8 800 600 14 41',
  phoneFormatted: '+88006001441',
  phoneLink: 'tel:+88006001441',
  email: 'info@Laundromat.gr',
  emailLink: 'mailto:info@Laundromat.gr',
} as const;

export type ContactsType = typeof CONTACTS;
