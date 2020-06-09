import { mnemonicToEntropy } from 'bip39';

export const isImportedWallet = wallet => {
    const holder = wallet.holder;
    if (holder.type !== 'imported') {
        return false;
    }
    return true;
};

export const canRemoveWallet = wallet => {
    return isImportedWallet(wallet);
};

export const canShowSeed = wallet => {
    return isImportedWallet(wallet);
};

export const walletNameFound = (name, accounts) => {
    return accounts.find(x => x.name === name);
};

export const importedSeedFound = (seed, accounts) => {
    return !!accounts.find(x => x.toString() === seed.toString());
};

export const isValidWalletName = (walletName, accounts) => {
    if (!walletName) {
        return {
            success: false,
            message: 'Please enter a name.',
        };
    }
    if (walletName.length > 15) {
        return {
            success: false,
            message: 'The length of the name should not exceed 15 characters.',
        };
    }
    if (!walletName.match(/^[0-9a-zA-Z]+$/)){
        return {
            success: false,
            message: 'The name can only contain letters and numbers',
        };
    }
    if (accounts.find(x => x.name.toLowerCase() == walletName.toLowerCase())) {
        return {
            success: false,
            message: 'There is already a wallet with this name',
        };
    }
    return {
        success: true,
        message: 'The name is successfully validated',
    };
};

export const validateAndGenerateSeed = (seedPhrase, accounts) => {
    seedPhrase = seedPhrase
        .replace(/[^a-zA-Z ]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s\s+/g, ' ');
    const wordCount = seedPhrase.split(' ').length;

    if (wordCount !== 24) {
        return {
            success: false,
            message:
                "Please make sure you've entered 24 words. [" +
                wordCount +
                '/24]',
        };
    }

    let seed = null;

    try {
        seed = Buffer.from(mnemonicToEntropy(seedPhrase), 'hex');
    } catch (e) {
        return {
            success: false,
            message: `This is not a valid 24 word seed phrase`,
        };
    }
    const foundWallet = importedSeedFound(seed, accounts);
    if (foundWallet) {
        return {
            success: false,
            message: `This seed is already imported under the name "${foundWallet.name}"`,
        };
    }
    return {
        success: true,
        seedPhrase,
    };
};

export const importedSecretFound = (secret, accounts) => {
    return accounts.find(x => x.keyPair.secret() === secret);
}
