import productionBetaConfig from './production_beta.config';
import productionConfig from './production.config';
import stagingConfig from './staging.config';
import testingConfig from './testing.config';

let config;
switch (window.location.host) {
    case 'wallet.threefold.me':
        config = productionConfig;
        break;
    case 'wallet-beta.jimber.org':
        config = productionBetaConfig;
        break;
    case 'wallet.staging.jimber.org':
        config = stagingConfig;
        break;
    case 'wallet.testing.jimber.org':
        config = testingConfig;
        break;
    default:
        config = {
            pkidUrl: 'https://pkid.staging.jimber.org',
            stellarServerUrl: 'https://horizon-testnet.stellar.org',
            stellarNetwork: 'Test SDF Network ; September 2015',
            serviceUrl: 'https://testnet.threefold.io/threefoldfoundation',
            // devWallet: 'SsoeDx7TRjjc71PXmr413rCVtNAkDsJ7KCvZjglXcbc=',
            tftFundAccount:
                'GAKONCKYJ7PRRKBZSWVPG3MURUNX4H44AB3CU2YGVKF2FD7KXJBB3XID',
            feeDestination:
                'GAKONCKYJ7PRRKBZSWVPG3MURUNX4H44AB3CU2YGVKF2FD7KXJBB3XID',
            feeAmount: '0.1000000',
            env: 'dev',
            currencies: {
                TFT: {
                    asset_code: 'TFT',
                    issuer:
                        'GA47YZA3PKFUZMPLQ3B5F2E3CJIB57TGGU7SPCQT2WAEYKN766PWIMB3',
                },
                TFTA: {
                    asset_code: 'TFTA',
                    issuer:
                        'GB55A4RR4G2MIORJTQA4L6FENZU7K4W7ATGY6YOT2CW47M5SZYGYKSCT',
                },
                FreeTFT: {
                    asset_code: 'FreeTFT',
                    issuer:
                        'GBLDUINEFYTF7XEE7YNWA3JQS4K2VD37YU7I2YAE7R5AHZDKQXSS2J6R',
                },
            },
            watchersEnabled: false,
            showInputWalletSeed: true
        };

        break;
}

export default config;
