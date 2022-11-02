import AccountBalanceWallet from '../../../public/account_balance_wallet_FILL1_wght400_GRAD0_opsz48.svg';

export const AccountBalanceWalletIcon = ({ size, fill='currentColor' }) => (
    <div style={{ width: size, height: size, display: 'flex' }}>
        <AccountBalanceWallet
            width={'100%'}
            height={'100%'}
            fill={fill}
            viewBox={'0 0 48 48'}
        />
    </div>
)
