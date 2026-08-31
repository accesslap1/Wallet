/** Wallet Design System v1.0 - source of truth from the approved PDF. */
export const colors = {
  canvas: '#08111F',
  background: '#1F2630',
  field: '#1F2630',
  fieldRaised: '#27303D',
  black: '#000000',
  grey: '#A5A6A8',
  white: '#FFFFFF',
  blue: '#008CCA',
  blueBright: '#00B9D1',
  blueSoft: 'rgba(0, 140, 202, 0.14)',
  red: '#FF2116',
  redSoft: 'rgba(255, 33, 22, 0.14)',
  border: 'rgba(0, 140, 202, 0.62)',
  divider: 'rgba(165, 166, 168, 0.20)',
  scrim: 'rgba(0, 0, 0, 0.70)',
  disabled: '#55585D',
  warning: '#F4B740',
} as const;
export const spacing = { xs: 6, sm: 10, md: 16, lg: 22, xl: 30 } as const;
export const radius = { small: 6, medium: 10, large: 18, round: 999 } as const;
export const typography = {
  title: { fontFamily: 'Inter_700Bold', fontSize: 20, lineHeight: 26 },
  text: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 21 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 12, lineHeight: 16 },
  address: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18 },
} as const;
