# Foundation and Core Browsing Module

## Scope

This module presents the Wallet hierarchy and recorded Transactions without executing financial movements. It includes Home, Accounts, Account Details, Subaccount Details, Wallet Details, Asset Details, Transaction History, and Transaction Details.

## Financial model

Balances exist only at Asset level. Available and locked amounts use integer minor units with Asset-specific decimal precision. Estimated USD values are integer cents. Wallet, Subaccount, Account, and User totals are derived at read time from their underlying Assets; they are never editable stored balances.

## Data boundary

Screens consume `WalletDataService.getSnapshot()`. `MockWalletDataService` is a development-only implementation. A future API service must return the same typed snapshot or the interface can be extended with entity-specific requests without changing route responsibilities.

## Navigation

Home links to Accounts and Transaction History. Entity routes use stable IDs and resolve the selected entity plus its parents. Invalid IDs show a safe unavailable state. Native Stack navigation provides back behavior; primary areas use bottom tabs.

## States

The shared provider exposes asynchronous loading, recoverable error, and reload behavior. List screens define empty states. Pressed, selected, disabled-by-scope, and status states are visually explicit. Balance privacy is shared across all screens during the session.

## Transaction behavior

All Transaction records are read-only mock records. Statuses are Completed, Pending, Failed, and Cancelled. Failed and Cancelled records may expose a reason. No balance is mutated by this module.

## Open decisions

- Backend request/response contracts and authentication.
- Live rate source, refresh interval, and stale-rate behavior.
- Base currency and localization rules.
- Production typography and final brand assets.
- Account and Wallet creation rules.
- Security requirements for revealing balances and addresses.
