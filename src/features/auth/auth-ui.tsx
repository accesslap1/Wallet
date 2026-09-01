import { colors, radius, spacing, typography } from '@/src/design/tokens';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PropsWithChildren, ReactNode, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function AuthScreen({ children }: PropsWithChildren) {
  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.screen}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function AuthBrand({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[s.brand, compact && s.brandCompact]}>
      <View style={s.brandMark}>
        <MaterialCommunityIcons
          name="shield-lock-outline"
          size={compact ? 22 : 32}
          color={colors.blueBright}
        />
      </View>
      <View>
        <Text style={s.brandOverline}>EGETY</Text>
        <Text style={[s.brandName, compact && s.brandNameCompact]}>Wallet Trust</Text>
      </View>
    </View>
  );
}

export function AuthTabs({
  active,
  onSignIn,
  onSignUp,
}: {
  active: 'signin' | 'signup';
  onSignIn(): void;
  onSignUp(): void;
}) {
  return (
    <View style={s.tabs}>
      <Pressable onPress={onSignIn} style={[s.tab, active === 'signin' && s.tabActive]}>
        <Text style={[s.tabText, active === 'signin' && s.tabTextActive]}>Sign in</Text>
      </Pressable>
      <Pressable onPress={onSignUp} style={[s.tab, active === 'signup' && s.tabActive]}>
        <Text style={[s.tabText, active === 'signup' && s.tabTextActive]}>Sign up</Text>
      </Pressable>
    </View>
  );
}

export function AuthTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={s.titleBlock}>
      <Text style={s.title}>{title}</Text>
      {!!subtitle && <Text style={s.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const signupSteps = ['Profile', 'Contact', 'Security', 'PIN', 'Pattern'];
export function SignupProgress({ step }: { step: number }) {
  return (
    <View accessibilityLabel={`Signup step ${step + 1} of ${signupSteps.length}`} style={s.progress}>
      {signupSteps.map((label, index) => (
        <View key={label} style={s.progressItem}>
          <View style={[s.progressDot, index <= step && s.progressDotActive]}>
            {index < step ? (
              <MaterialCommunityIcons name="check" size={13} color={colors.black} />
            ) : (
              <Text style={[s.progressNumber, index <= step && s.progressNumberActive]}>{index + 1}</Text>
            )}
          </View>
          <Text numberOfLines={1} style={[s.progressLabel, index <= step && s.progressLabelActive]}>
            {label}
          </Text>
          {index < signupSteps.length - 1 && (
            <View style={[s.progressLine, index < step && s.progressLineActive]} />
          )}
        </View>
      ))}
    </View>
  );
}

export function Field({
  label,
  error,
  trailing,
  ...props
}: TextInputProps & { label: string; error?: string; trailing?: ReactNode }) {
  return (
    <View style={s.fieldBlock}>
      <Text style={s.fieldLabel}>{label}</Text>
      <View style={[s.field, !!error && s.fieldError]}>
        <TextInput
          placeholderTextColor={colors.grey}
          selectionColor={colors.blueBright}
          autoCapitalize="none"
          style={s.input}
          {...props}
        />
        {trailing}
      </View>
      {!!error && <Text style={s.error}>{error}</Text>}
    </View>
  );
}

export function Choice({
  selected,
  label,
  icon,
  onPress,
}: {
  selected: boolean;
  label: string;
  icon?: string;
  onPress(): void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.choice, selected && s.choiceSelected, pressed && s.pressed]}
    >
      {!!icon && (
        <MaterialCommunityIcons
          name={icon as never}
          size={18}
          color={selected ? colors.black : colors.white}
        />
      )}
      <Text style={[s.choiceText, selected && s.choiceTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress(): void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [s.primary, disabled && s.disabled, pressed && !disabled && s.primaryPressed]}
    >
      <Text style={s.primaryText}>{label}</Text>
      <MaterialCommunityIcons name="arrow-right" size={18} color={colors.black} />
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
  danger = false,
}: {
  label: string;
  onPress(): void;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.secondary, danger && s.danger, pressed && s.pressed]}
    >
      <Text style={[s.secondaryText, danger && s.dangerText]}>{label}</Text>
    </Pressable>
  );
}

export function ButtonRow({ children }: PropsWithChildren) {
  return <View style={s.buttonRow}>{children}</View>;
}

export function DevelopmentCode({ label, code }: { label: string; code: string }) {
  return (
    <View style={s.devCode}>
      <MaterialCommunityIcons name="flask-outline" size={18} color={colors.warning} />
      <View style={s.devCopy}>
        <Text style={s.devLabel}>{label} development code</Text>
        <Text selectable style={s.devValue}>
          {code}
        </Text>
      </View>
    </View>
  );
}

export function CodeField({
  label,
  code,
  onChangeText,
  verified,
  onSend,
}: {
  label: string;
  code: string;
  onChangeText(value: string): void;
  verified: boolean;
  onSend(): void;
}) {
  const [sent, setSent] = useState(false);
  return (
    <View style={s.codeSection}>
      <View style={s.codeTop}>
        <Text style={s.fieldLabel}>{label}</Text>
        <Pressable
          onPress={() => {
            setSent(true);
            onSend();
          }}
          style={s.codeButton}
        >
          <Text style={s.codeButtonText}>{sent ? 'Resend code' : 'Get code'}</Text>
        </Pressable>
      </View>
      <View style={[s.field, verified && s.fieldVerified]}>
        <TextInput
          accessibilityLabel={`${label} code`}
          value={code}
          onChangeText={(value) => onChangeText(value.replace(/\D/g, '').slice(0, 6))}
          keyboardType="number-pad"
          placeholder="—  —  —  —  —  —"
          placeholderTextColor={colors.grey}
          style={[s.input, s.codeInput]}
        />
        {verified && <MaterialCommunityIcons name="check-circle" size={20} color={colors.blueBright} />}
      </View>
      {sent && <Text style={s.timer}>Code sent · expires in 02:00</Text>}
    </View>
  );
}

const keypad = ['0', '9', '1', '2', '8', '3', '5', '7', '6', 'back', '4', 'clear'];
export function PinPad({
  value,
  onChange,
  title = 'Enter PIN',
}: {
  value: string;
  onChange(value: string): void;
  title?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={s.pinWrap}>
      <View style={s.pinTitleRow}>
        <Text style={s.pinTitle}>{title}</Text>
        <Pressable onPress={() => setVisible((current) => !current)}>
          <MaterialCommunityIcons
            name={visible ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={colors.grey}
          />
        </Pressable>
      </View>
      <View style={s.pinBoxes}>
        {[0, 1, 2, 3].map((index) => (
          <View key={index} style={[s.pinBox, value.length > index && s.pinBoxFilled]}>
            <Text style={s.pinValue}>{value[index] ? (visible ? value[index] : '•') : ''}</Text>
          </View>
        ))}
      </View>
      <View style={s.keypad}>
        {keypad.map((key) => (
          <Pressable
            key={key}
            onPress={() => {
              if (key === 'back') onChange(value.slice(0, -1));
              else if (key === 'clear') onChange('');
              else if (value.length < 4) onChange(`${value}${key}`);
            }}
            style={({ pressed }) => [
              s.key,
              (key === 'back' || key === 'clear') && s.keyUtility,
              pressed && s.pressed,
            ]}
          >
            {key === 'back' ? (
              <MaterialCommunityIcons name="backspace-outline" size={22} color={colors.white} />
            ) : (
              <Text style={s.keyText}>{key === 'clear' ? 'Clear' : key}</Text>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function PatternPad({
  value,
  onChange,
  title = 'Enter pattern',
}: {
  value: number[];
  onChange(value: number[]): void;
  title?: string;
}) {
  const selected = useMemo(() => new Set(value), [value]);
  return (
    <View style={s.patternWrap}>
      <Text style={s.pinTitle}>{title}</Text>
      <Text style={s.patternHint}>
        Select at least 4 dots in sequence. Tap a selected dot again to reset.
      </Text>
      <View accessibilityLabel="Pattern grid" style={s.patternGrid}>
        {Array.from({ length: 9 }, (_, index) => (
          <Pressable
            key={index}
            accessibilityLabel={`Pattern dot ${index + 1}`}
            onPress={() => {
              if (selected.has(index)) onChange([]);
              else onChange([...value, index]);
            }}
            style={[s.patternCell, selected.has(index) && s.patternCellSelected]}
          >
            <View style={[s.patternDot, selected.has(index) && s.patternDotSelected]} />
            {selected.has(index) && <Text style={s.patternOrder}>{value.indexOf(index) + 1}</Text>}
          </Pressable>
        ))}
      </View>
      <Pressable onPress={() => onChange([])} style={s.clearPattern}>
        <Text style={s.codeButtonText}>Clear pattern</Text>
      </Pressable>
    </View>
  );
}

export function AuthFooter() {
  return <Text style={s.footer}>Protected by Egety Wallet Trust · Development environment</Text>;
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: colors.canvas },
  screen: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    padding: spacing.lg,
    paddingBottom: 44,
    gap: 18,
  },
  brand: { alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 24 },
  brandCompact: { flexDirection: 'row', justifyContent: 'flex-start', paddingVertical: 4 },
  brandMark: {
    width: 58,
    height: 58,
    borderWidth: 1,
    borderColor: colors.border,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandOverline: { ...typography.label, color: colors.blueBright, letterSpacing: 2 },
  brandName: { fontFamily: 'Inter_700Bold', fontSize: 25, color: colors.white },
  brandNameCompact: { fontSize: 18 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderColor: colors.divider },
  tab: {
    flex: 1,
    paddingVertical: 13,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: colors.blueBright },
  tabText: { ...typography.text, color: colors.grey },
  tabTextActive: { fontFamily: 'Inter_700Bold', color: colors.white },
  titleBlock: { gap: 5 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 26, lineHeight: 32, color: colors.white },
  subtitle: { ...typography.text, color: colors.grey },
  progress: { flexDirection: 'row', paddingVertical: 6 },
  progressItem: { flex: 1, alignItems: 'center', gap: 5, position: 'relative' },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grey,
    backgroundColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  progressDotActive: { borderColor: colors.blueBright, backgroundColor: colors.blueBright },
  progressNumber: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: colors.grey },
  progressNumberActive: { color: colors.black },
  progressLabel: { fontFamily: 'Inter_500Medium', fontSize: 9, color: colors.grey },
  progressLabelActive: { color: colors.white },
  progressLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: colors.divider,
    left: '60%',
    right: '-40%',
    top: 12,
  },
  progressLineActive: { backgroundColor: colors.blueBright },
  fieldBlock: { gap: 6 },
  fieldLabel: { ...typography.label, color: colors.white },
  field: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.small,
    backgroundColor: colors.field,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  fieldError: { borderColor: colors.red },
  fieldVerified: { borderColor: colors.blueBright },
  input: { flex: 1, ...typography.text, color: colors.white, paddingVertical: 11 },
  error: { ...typography.label, color: colors.red },
  choice: {
    minHeight: 46,
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.small,
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceSelected: { backgroundColor: colors.blueBright, borderColor: colors.blueBright },
  choiceText: { ...typography.text, color: colors.white },
  choiceTextSelected: { fontFamily: 'Inter_600SemiBold', color: colors.black },
  primary: {
    minHeight: 50,
    flex: 1,
    backgroundColor: colors.blueBright,
    borderRadius: radius.small,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 18,
  },
  primaryPressed: { backgroundColor: colors.blue },
  primaryText: { fontFamily: 'Inter_700Bold', fontSize: 15, color: colors.black },
  secondary: {
    minHeight: 50,
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.small,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  secondaryText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.white },
  danger: { borderColor: colors.red },
  dangerText: { color: colors.red },
  disabled: { opacity: 0.35 },
  pressed: { opacity: 0.6 },
  buttonRow: { flexDirection: 'row', gap: 10 },
  devCode: {
    borderWidth: 1,
    borderColor: colors.warning,
    backgroundColor: 'rgba(244,183,64,0.08)',
    padding: 12,
    borderRadius: radius.small,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  devCopy: { flex: 1, gap: 2 },
  devLabel: { ...typography.label, color: colors.warning },
  devValue: { fontFamily: 'Inter_700Bold', fontSize: 17, letterSpacing: 3, color: colors.white },
  codeSection: { gap: 7 },
  codeTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  codeButton: { paddingVertical: 5, paddingHorizontal: 8 },
  codeButtonText: { ...typography.label, color: colors.blueBright },
  codeInput: { letterSpacing: 6 },
  timer: { ...typography.label, color: colors.grey, textAlign: 'right' },
  pinWrap: { gap: 16 },
  pinTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pinTitle: { fontFamily: 'Inter_700Bold', fontSize: 20, color: colors.white },
  pinBoxes: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  pinBox: {
    width: 52,
    height: 60,
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: radius.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinBoxFilled: { borderColor: colors.blueBright, backgroundColor: colors.blueSoft },
  pinValue: { fontFamily: 'Inter_700Bold', fontSize: 24, color: colors.white },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  key: {
    width: '31%',
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyUtility: { borderColor: colors.grey },
  keyText: { fontFamily: 'Inter_700Bold', fontSize: 20, color: colors.white },
  patternWrap: { alignItems: 'stretch', gap: 12 },
  patternHint: { ...typography.text, color: colors.grey },
  patternGrid: {
    width: 294,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    paddingVertical: 12,
  },
  patternCell: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  patternCellSelected: { borderColor: colors.blueBright, backgroundColor: colors.blueSoft },
  patternDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.white },
  patternDotSelected: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.blueBright },
  patternOrder: { position: 'absolute', fontFamily: 'Inter_700Bold', fontSize: 10, color: colors.black },
  clearPattern: { alignSelf: 'center', padding: 8 },
  footer: { ...typography.label, color: colors.grey, textAlign: 'center', marginTop: 8 },
});
