# Wallet

Wallet is an Android-first, iOS-ready financial browsing application built around the hierarchy:

`User → Account → Subaccount → Wallet → Asset / Wallet Address → Balance`

The current delivery implements the application foundation, Wallet Home, the complete management hierarchy, Transaction History, and Transaction Details. Send, Receive, Transfer, Withdraw, Swap, and E-Pay are visible but intentionally show an informational sheet until their execution modules are implemented.

## Technology stack

- Expo SDK 57 and React Native 0.86
- React 19 and TypeScript 6 in strict mode
- Expo Router file-based navigation
- Integer minor-unit and `bigint` financial calculations
- Jest/ts-jest unit tests
- ESLint and Prettier
- Android package: `com.accesslb.wallet`

## Design system

The application follows Wallet Design System v1.0. Inter is the product font, with a compact 20px title, 15px body, and 12px technical/address scale. The interface uses a dark financial canvas, `#1F2630` fields and panels, `#008CCA` primary controls, `#FF2116` errors, `#A5A6A8` supporting text, and white financial values. Shared tokens and components in `src/design` and `src/components` must be reused for all future modules.

## Project structure

- `app/`: Expo Router routes and screens.
- `src/domain/`: typed Wallet entities and monetary aggregation logic.
- `src/data/`: replaceable service interface and isolated fictional mock implementation.
- `src/state/`: asynchronous Wallet provider, loading/error states, and balance privacy state.
- `src/components/`: reusable hierarchy rows, transaction presentation, action grid, and bottom sheet.
- `src/design/`: shared color and spacing tokens.
- `.github/workflows/android-apk.yml`: verified debug APK build workflow.

## Install and run

Requires Node.js 22 or later.

```bash
npm ci
npm start
npm run android
```

## Quality checks

```bash
npm run format
npm run lint
npm run typecheck
npm test
npx expo-doctor
```

## Android APK

For a local debug APK, install Android SDK tools and Java 17, then run:

```bash
npx expo prebuild --platform android --clean --no-install
cd android
./gradlew assembleDebug
```

The output is `android/app/build/outputs/apk/debug/app-debug.apk`. This is a development-signed APK, not a production-signed release.

The `Android APK` GitHub Actions workflow runs the same checks, builds the debug APK, and uploads it as the `wallet-debug-apk` artifact.

## Mock data

`src/data/mock-wallet-service.ts` contains clearly fictional development data. Screens depend on `WalletDataService`, so a backend implementation can replace the mock without rewriting presentation components. The current service is read-only and never represents mock actions as executed financial transactions.

## Current limitations

- No authentication, backend API, persistence, compliance, or transaction execution is connected.
- Conversion values are fixed fictional development values rather than live rates.
- Financial action modules and production signing credentials remain outside this delivery.
- Account/Wallet creation and management are not included yet.
